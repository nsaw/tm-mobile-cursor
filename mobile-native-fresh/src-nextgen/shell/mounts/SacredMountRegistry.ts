import { SacredViewMount } from './SacredViewMount';

export interface SacredMountDefinition {
  mountId: string;
  component: React.ComponentType<any>;
  props?: Record<string, any>;
  zIndex?: number;
  description: string;
}

/**
 * SacredMountRegistry - Registry for sacred mount points
 * 
 * This registry tracks all sacred mount points in the application.
 * Sacred mounts are protected areas where components can be rendered
 * without role wrapping, maintaining their original behavior.
 */
class SacredMountRegistry {
  private mounts: Map<string, SacredMountDefinition> = new Map();

  /**
   * Register a sacred mount point
   */
  register(mountDefinition: SacredMountDefinition): void {
    this.mounts.set(mountDefinition.mountId, mountDefinition);
  }

  /**
   * Get a sacred mount definition by ID
   */
  get(mountId: string): SacredMountDefinition | undefined {
    return this.mounts.get(mountId);
  }

  /**
   * Check if a mount ID is registered as sacred
   */
  isSacred(mountId: string): boolean {
    return this.mounts.has(mountId);
  }

  /**
   * Get all registered sacred mounts
   */
  getAll(): SacredMountDefinition[] {
    return Array.from(this.mounts.values());
  }

  /**
   * Remove a sacred mount registration
   */
  unregister(mountId: string): boolean {
    return this.mounts.delete(mountId);
  }

  /**
   * Clear all sacred mount registrations
   */
  clear(): void {
    this.mounts.clear();
  }
}

// Export singleton instance
export const sacredMountRegistry = new SacredMountRegistry();

// Pre-register common sacred mounts
sacredMountRegistry.register({
  mountId: 'bottom-nav',
  component: SacredViewMount,
  description: 'Bottom navigation bar - protected from role wrapping',
  zIndex: 1000,
});

sacredMountRegistry.register({
  mountId: 'fab',
  component: SacredViewMount,
  description: 'Floating action button - protected from role wrapping',
  zIndex: 1001,
});

sacredMountRegistry.register({
  mountId: 'top-bar',
  component: SacredViewMount,
  description: 'Top navigation bar - protected from role wrapping',
  zIndex: 999,
});

sacredMountRegistry.register({
  mountId: 'modal-overlay',
  component: SacredViewMount,
  description: 'Modal overlay - protected from role wrapping',
  zIndex: 1002,
});

export default sacredMountRegistry; 