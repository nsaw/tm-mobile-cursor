import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { BinWithCount, InsertBin } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { localStorageManager } from "@/lib/local-storage";
// Demo data removed during cleanup - users must authenticate to access bins
import { useAuth } from "./use-auth";

export function useBins() {
  const queryClient = useQueryClient();
  const { isAuthenticated, guestMode, authChecked } = useAuth();

  const binsQuery = useQuery({
    queryKey: isAuthenticated ? ["/api/bins"] : ["demo-bins"],
    queryFn: async () => {
      if (isAuthenticated) {
        try {
          const response = await apiRequest("GET", "/api/bins");
          if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
          }
          return response.json() as Promise<BinWithCount[]>;
        } catch (error) {
          console.warn("API request failed, falling back to local storage:", error);
          return localStorageManager.getBins();
        }
      } else {
        // Return empty array for anonymous users - they must authenticate to access bins
        return [];
      }
    },
    enabled: authChecked,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: false,
    refetchOnWindowFocus: false,
  });

  const createBinMutation = useMutation({
    mutationFn: async (bin: InsertBin) => {
      if (isAuthenticated) {
        const response = await apiRequest("POST", "/api/bins", bin);
        return response.json();
      } else {
        // For anonymous users, throw an error that can be caught to show auth prompt
        throw new Error("AUTH_REQUIRED");
      }
    },
    onSuccess: () => {
      if (isAuthenticated) {
        queryClient.invalidateQueries({ queryKey: ["/api/bins"] });
      } else {
        queryClient.invalidateQueries({ queryKey: ["local-bins"] });
      }
    },
  });

  const updateBinMutation = useMutation({
    mutationFn: async ({ id, ...bin }: { id: number } & Partial<InsertBin>) => {
      if (isAuthenticated) {
        const response = await apiRequest("PATCH", `/api/bins/${id}`, bin);
        return response.json();
      } else {
        return localStorageManager.updateBin(id, bin);
      }
    },
    onSuccess: () => {
      if (isAuthenticated) {
        queryClient.invalidateQueries({ queryKey: ["/api/bins"] });
      } else {
        queryClient.invalidateQueries({ queryKey: ["local-bins"] });
      }
    },
  });

  const deleteBinMutation = useMutation({
    mutationFn: async (id: number) => {
      if (isAuthenticated) {
        const response = await apiRequest("DELETE", `/api/bins/${id}`);
        return response.json();
      } else {
        return localStorageManager.deleteBin(id);
      }
    },
    onSuccess: () => {
      if (isAuthenticated) {
        queryClient.invalidateQueries({ queryKey: ["/api/bins"] });
        queryClient.invalidateQueries({ queryKey: ["/api/thoughtmarks"] });
      } else {
        queryClient.invalidateQueries({ queryKey: ["local-bins"] });
        queryClient.invalidateQueries({ queryKey: ["local-thoughtmarks"] });
      }
    },
  });

  return {
    data: binsQuery.data || [],
    isLoading: binsQuery.isLoading,
    error: binsQuery.error,
    createBin: createBinMutation.mutate,
    updateBin: updateBinMutation.mutate,
    deleteBin: deleteBinMutation.mutate,
    isCreating: createBinMutation.isPending,
    isUpdating: updateBinMutation.isPending,
    isDeleting: deleteBinMutation.isPending,
  };
}
