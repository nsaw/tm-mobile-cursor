import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import type { ThoughtmarkWithBin, InsertThoughtmark } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { localStorageManager } from "@/lib/local-storage";
// Demo data removed during cleanup - users must authenticate to access thoughtmarks
import { useAuth } from "./use-auth";

export function useThoughtmarks() {
  const queryClient = useQueryClient();
  const { isAuthenticated, guestMode, loading, authChecked } = useAuth();

  // Clear caches only on initial authentication, not on state changes
  useEffect(() => {
    if (isAuthenticated && authChecked) {
      queryClient.removeQueries({ queryKey: ["demo-thoughtmarks"] });
      queryClient.removeQueries({ queryKey: ["local-thoughtmarks"] });
      queryClient.removeQueries({ queryKey: ["local-bins"] });
    }
  }, [authChecked]); // Only run when auth check completes

  const thoughtmarksQuery = useQuery({
    queryKey: ["/api/thoughtmarks"],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/thoughtmarks");
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      const data = await response.json() as ThoughtmarkWithBin[];
      return data;
    },
    enabled: authChecked && isAuthenticated,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 2,
    refetchOnWindowFocus: false,
  });

  const createThoughtmarkMutation = useMutation({
    mutationFn: async (thoughtmark: InsertThoughtmark) => {
      if (isAuthenticated) {
        const response = await apiRequest("POST", "/api/thoughtmarks", thoughtmark);
        return response.json();
      } else {
        // For anonymous users, throw an error that can be caught to show auth prompt
        throw new Error("AUTH_REQUIRED");
      }
    },
    onSuccess: () => {
      if (isAuthenticated) {
        queryClient.invalidateQueries({ queryKey: ["/api/thoughtmarks"] });
        queryClient.invalidateQueries({ queryKey: ["/api/bins"] });
      } else {
        queryClient.invalidateQueries({ queryKey: ["local-thoughtmarks"] });
        queryClient.invalidateQueries({ queryKey: ["local-bins"] });
      }
    },
  });

  const updateThoughtmarkMutation = useMutation({
    mutationFn: async ({ id, ...thoughtmark }: { id: number } & Partial<InsertThoughtmark>) => {
      if (isAuthenticated) {
        const response = await apiRequest("PATCH", `/api/thoughtmarks/${id}`, thoughtmark);
        return response.json();
      } else {
        return localStorageManager.updateThoughtmark(id, thoughtmark);
      }
    },
    onSuccess: () => {
      if (isAuthenticated) {
        queryClient.invalidateQueries({ queryKey: ["/api/thoughtmarks"] });
        queryClient.invalidateQueries({ queryKey: ["/api/bins"] });
      } else {
        queryClient.invalidateQueries({ queryKey: ["local-thoughtmarks"] });
        queryClient.invalidateQueries({ queryKey: ["local-bins"] });
      }
    },
  });

  const deleteThoughtmarkMutation = useMutation({
    mutationFn: async (id: number) => {
      if (isAuthenticated) {
        const response = await apiRequest("DELETE", `/api/thoughtmarks/${id}`);
        return response.json();
      } else {
        return localStorageManager.deleteThoughtmark(id);
      }
    },
    onSuccess: () => {
      if (isAuthenticated) {
        queryClient.invalidateQueries({ queryKey: ["/api/thoughtmarks"] });
        queryClient.invalidateQueries({ queryKey: ["/api/bins"] });
      } else {
        queryClient.invalidateQueries({ queryKey: ["local-thoughtmarks"] });
        queryClient.invalidateQueries({ queryKey: ["local-bins"] });
      }
    },
  });

  return {
    data: thoughtmarksQuery.data || [],
    isLoading: thoughtmarksQuery.isLoading,
    error: thoughtmarksQuery.error,
    createThoughtmark: createThoughtmarkMutation.mutate,
    updateThoughtmark: updateThoughtmarkMutation.mutate,
    deleteThoughtmark: deleteThoughtmarkMutation.mutate,
    isCreating: createThoughtmarkMutation.isPending,
    isUpdating: updateThoughtmarkMutation.isPending,
    isDeleting: deleteThoughtmarkMutation.isPending,
  };
}
