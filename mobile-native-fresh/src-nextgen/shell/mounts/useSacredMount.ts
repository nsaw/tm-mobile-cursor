import { useCallback } from 'react';
import { sacredMountRegistry, SacredMountDefinition } from './SacredMountRegistry';

/**
 * useSacredMount - Hook for sacred mount operations
 * 
 * This hook provides access to sacred mount registry operations
 * and ensures type safety for mount operations.
 */
export const useSacredMount = (): {
  registerMount: (mountDefinition: SacredMountDefinition) => void;
  isSacredMount: (mountId: string) => boolean;
  getSacredMount: (mountId: string) => SacredMountDefinition | undefined;
  getAllSacredMounts: () => SacredMountDefinition[];
  unregisterMount: (mountId: string) => boolean;
  clearAllMounts: () => void;
} => {
  /**
   * Register a new sacred mount point
   */
  const registerMount = useCallback((mountDefinition: SacredMountDefinition) => {
    sacredMountRegistry.register(mountDefinition);
  }, []);

  /**
   * Check if a mount ID is registered as sacred
   */
  const isSacredMount = useCallback((mountId: string): boolean => {
    return sacredMountRegistry.isSacred(mountId);
  }, []);

  /**
   * Get a sacred mount definition
   */
  const getSacredMount = useCallback((mountId: string): SacredMountDefinition | undefined => {
    return sacredMountRegistry.get(mountId);
  }, []);

  /**
   * Get all registered sacred mounts
   */
  const getAllSacredMounts = useCallback((): SacredMountDefinition[] => {
    return sacredMountRegistry.getAll();
  }, []);

  /**
   * Unregister a sacred mount
   */
  const unregisterMount = useCallback((mountId: string): boolean => {
    return sacredMountRegistry.unregister(mountId);
  }, []);

  /**
   * Clear all sacred mount registrations
   */
  const clearAllMounts = useCallback((): void => {
    sacredMountRegistry.clear();
  }, []);

  return {
    registerMount,
    isSacredMount,
    getSacredMount,
    getAllSacredMounts,
    unregisterMount,
    clearAllMounts,
  };
};

export default useSacredMount; 