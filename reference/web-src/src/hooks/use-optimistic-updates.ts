import { useState, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";

export function useOptimisticUpdates<T extends { id: number; [key: string]: any }>() {
  const [optimisticData, setOptimisticData] = useState<Record<number, Partial<T>>>({});
  const queryClient = useQueryClient();

  const addOptimisticUpdate = useCallback((id: number, updates: Partial<T>) => {
    setOptimisticData(prev => ({ ...prev, [id]: { ...prev[id], ...updates } }));
  }, []);

  const removeOptimisticUpdate = useCallback((id: number) => {
    setOptimisticData(prev => {
      const { [id]: removed, ...rest } = prev;
      return rest;
    });
  }, []);

  const clearAllOptimisticUpdates = useCallback(() => {
    setOptimisticData({});
  }, []);

  const applyOptimisticUpdates = useCallback((items: T[]): T[] => {
    return items.map(item => ({
      ...item,
      ...optimisticData[item.id]
    }));
  }, [optimisticData]);

  const isOptimistic = useCallback((id: number) => {
    return id in optimisticData;
  }, [optimisticData]);

  return {
    addOptimisticUpdate,
    removeOptimisticUpdate,
    clearAllOptimisticUpdates,
    applyOptimisticUpdates,
    isOptimistic
  };
}

export function useAutoSave() {
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  const save = useCallback(async (saveFunction: () => Promise<void>) => {
    setSaveStatus('saving');
    try {
      await saveFunction();
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (error) {
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    }
  }, []);

  return { saveStatus, save };
}