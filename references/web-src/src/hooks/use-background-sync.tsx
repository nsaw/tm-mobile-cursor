import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";

export function useBackgroundSync() {
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuth();
  const intervalRef = useRef<NodeJS.Timeout>();
  const lastSyncRef = useRef<number>(Date.now());

  useEffect(() => {
    if (!isAuthenticated) return;

    // Sync every 5 minutes when tab is active
    const syncData = () => {
      const now = Date.now();
      if (now - lastSyncRef.current > 4 * 60 * 1000) { // 4 minutes minimum
        queryClient.invalidateQueries({ queryKey: ["/api/thoughtmarks"] });
        queryClient.invalidateQueries({ queryKey: ["/api/bins"] });
        lastSyncRef.current = now;
      }
    };

    // Handle tab visibility changes
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        const timeSinceLastSync = Date.now() - lastSyncRef.current;
        if (timeSinceLastSync > 2 * 60 * 1000) { // 2 minutes
          syncData();
        }
      }
    };

    // Handle online/offline status
    const handleOnline = () => {
      syncData();
    };

    // Set up periodic sync
    intervalRef.current = setInterval(syncData, 5 * 60 * 1000);

    // Add event listeners
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('online', handleOnline);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('online', handleOnline);
    };
  }, [isAuthenticated, queryClient]);
}

// Hook for optimistic updates
export function useOptimisticUpdates() {
  const queryClient = useQueryClient();

  const optimisticUpdate = <T,>(
    queryKey: string[],
    updateFn: (oldData: T[]) => T[],
    revertDelay = 5000
  ) => {
    const previousData = queryClient.getQueryData<T[]>(queryKey);
    
    if (previousData) {
      queryClient.setQueryData(queryKey, updateFn(previousData));
      
      // Revert if no network confirmation within delay
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey });
      }, revertDelay);
    }
  };

  return { optimisticUpdate };
}