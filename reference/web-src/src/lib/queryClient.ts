import { QueryClient, QueryFunction } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  // Get authenticated user ID from storage
  let userId = 3; // Default to demo user
  
  try {
    const storedUser = localStorage.getItem('thoughtmarks-user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      userId = userData.id || 3;
    }
  } catch (error) {
    console.warn('Failed to parse stored user data:', error);
  }
  
  const headers: Record<string, string> = {
    ...(data ? { "Content-Type": "application/json" } : {}),
    "x-user-id": userId.toString(),
    "Authorization": `Bearer demo-token-${userId}`,
  };

  const res = await fetch(url, {
    method,
    headers,
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  // Clear stale cache on authentication errors to force fresh data
  if (res.status === 401 || res.status === 403) {
    localStorage.removeItem('thoughtmarks-cache');
    localStorage.removeItem('thoughtmarks-template-refs');
    // Clear all query cache to force fresh data fetch
    window.location.reload();
  }

  await throwIfResNotOk(res);
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    // Get current user from localStorage for authentication
    const currentUser = JSON.parse(localStorage.getItem('thoughtmarks-user') || 'null');
    
    // For development/demo, ensure we have a fallback user ID
    const userId = currentUser?.id || 3;
    
    const headers: Record<string, string> = {
      "x-user-id": userId.toString(),
      "Authorization": `Bearer demo-token-${userId}`,
    };

    const res = await fetch(queryKey[0] as string, {
      headers,
      credentials: "include",
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      staleTime: 2 * 60 * 1000, // 2 minutes
      gcTime: 5 * 60 * 1000, // 5 minutes
      retry: (failureCount, error) => {
        if (error instanceof Error && error.message.includes('401')) {
          return false;
        }
        return failureCount < 2;
      },
      refetchOnWindowFocus: false,
      refetchOnReconnect: 'always',
    },
    mutations: {
      retry: 1,
    },
  },
});
