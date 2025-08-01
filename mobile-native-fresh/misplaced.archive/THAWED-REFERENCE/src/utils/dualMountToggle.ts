// src/utils/dualMountToggle.ts
// Dual-mount toggle system for switching between legacy and nextgen environments

export interface DualMountConfig {
  useNextGen: boolean;
  environment: 'legacy' | 'nextgen';
  autoSwitch: boolean;
  switchThreshold: number;
  fallbackEnvironment: 'legacy' | 'nextgen';
}

export interface ToggleResult {
  success: boolean;
  previousEnvironment: 'legacy' | 'nextgen';
  currentEnvironment: 'legacy' | 'nextgen';
  timestamp: number;
  reason?: string;
}

class DualMountToggle {
  private config: DualMountConfig;
  private isInitialized: boolean = false;

  constructor(config: Partial<DualMountConfig> = {}) {
    this.config = {
      useNextGen: process.env.EXPO_PUBLIC_USE_NEXTGEN === 'true',
      environment: process.env.EXPO_PUBLIC_USE_NEXTGEN === 'true' ? 'nextgen' : 'legacy',
      autoSwitch: false,
      switchThreshold: 5000, // 5 seconds
      fallbackEnvironment: 'legacy',
      ...config,
    };
  }

  /**
   * Initialize the dual-mount toggle system
   */
  initialize(): void {
    try {
      // Set environment variables
      process.env.EXPO_PUBLIC_USE_NEXTGEN = this.config.useNextGen ? 'true' : 'false';
      process.env.EXPO_PUBLIC_ENVIRONMENT = this.config.environment;

      this.isInitialized = true;
      console.log(`🔀 Dual-mount toggle initialized: ${this.config.environment} environment`);
    } catch (error) {
      console.error('❌ Failed to initialize dual-mount toggle:', error);
      throw error;
    }
  }

  /**
   * Toggle between legacy and nextgen environments
   */
  toggleEnvironment(): ToggleResult {
    try {
      if (!this.isInitialized) {
        throw new Error('Dual-mount toggle not initialized');
      }

      const previousEnvironment = this.config.environment;
      const newEnvironment = this.config.environment === 'legacy' ? 'nextgen' : 'legacy';

      // Update configuration
      this.config.environment = newEnvironment;
      this.config.useNextGen = newEnvironment === 'nextgen';

      // Update environment variables
      process.env.EXPO_PUBLIC_USE_NEXTGEN = this.config.useNextGen ? 'true' : 'false';
      process.env.EXPO_PUBLIC_ENVIRONMENT = this.config.environment;

      const result: ToggleResult = {
        success: true,
        previousEnvironment,
        currentEnvironment: newEnvironment,
        timestamp: Date.now(),
      };

      console.log(`🔄 Environment toggled: ${previousEnvironment} → ${newEnvironment}`);
      return result;
    } catch (error) {
      console.error('❌ Failed to toggle environment:', error);
      return {
        success: false,
        previousEnvironment: this.config.environment,
        currentEnvironment: this.config.environment,
        timestamp: Date.now(),
        reason: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Set environment to a specific value
   */
  setEnvironment(environment: 'legacy' | 'nextgen'): ToggleResult {
    try {
      if (!this.isInitialized) {
        throw new Error('Dual-mount toggle not initialized');
      }

      const previousEnvironment = this.config.environment;
      
      if (previousEnvironment === environment) {
        return {
          success: true,
          previousEnvironment,
          currentEnvironment: environment,
          timestamp: Date.now(),
          reason: 'Environment already set to requested value',
        };
      }

      // Update configuration
      this.config.environment = environment;
      this.config.useNextGen = environment === 'nextgen';

      // Update environment variables
      process.env.EXPO_PUBLIC_USE_NEXTGEN = this.config.useNextGen ? 'true' : 'false';
      process.env.EXPO_PUBLIC_ENVIRONMENT = this.config.environment;

      const result: ToggleResult = {
        success: true,
        previousEnvironment,
        currentEnvironment: environment,
        timestamp: Date.now(),
      };

      console.log(`🎯 Environment set: ${previousEnvironment} → ${environment}`);
      return result;
    } catch (error) {
      console.error('❌ Failed to set environment:', error);
      return {
        success: false,
        previousEnvironment: this.config.environment,
        currentEnvironment: this.config.environment,
        timestamp: Date.now(),
        reason: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Get current environment
   */
  getCurrentEnvironment(): 'legacy' | 'nextgen' {
    return this.config.environment;
  }

  /**
   * Get current configuration
   */
  getConfig(): DualMountConfig {
    return { ...this.config };
  }

  /**
   * Update configuration
   */
  updateConfig(updates: Partial<DualMountConfig>): void {
    this.config = { ...this.config, ...updates };
    
    // Update environment variables if environment changed
    if (updates.environment) {
      process.env.EXPO_PUBLIC_USE_NEXTGEN = this.config.useNextGen ? 'true' : 'false';
      process.env.EXPO_PUBLIC_ENVIRONMENT = this.config.environment;
    }
    
    console.log('⚙️ Dual-mount configuration updated');
  }

  /**
   * Check if system is ready for environment switch
   */
  isReadyForSwitch(): boolean {
    return this.isInitialized && this.config.environment !== undefined;
  }

  /**
   * Get environment status
   */
  getStatus(): {
    isInitialized: boolean;
    currentEnvironment: 'legacy' | 'nextgen';
    useNextGen: boolean;
    autoSwitch: boolean;
  } {
    return {
      isInitialized: this.isInitialized,
      currentEnvironment: this.config.environment,
      useNextGen: this.config.useNextGen,
      autoSwitch: this.config.autoSwitch,
    };
  }

  /**
   * Reset to fallback environment
   */
  resetToFallback(): ToggleResult {
    return this.setEnvironment(this.config.fallbackEnvironment);
  }

  /**
   * Validate environment configuration
   */
  validateConfiguration(): boolean {
    const isValid = 
      this.config.environment === 'legacy' || this.config.environment === 'nextgen' &&
      this.config.fallbackEnvironment === 'legacy' || this.config.fallbackEnvironment === 'nextgen' &&
      this.config.switchThreshold > 0;

    if (!isValid) {
      console.error('❌ Invalid dual-mount configuration');
    }

    return isValid;
  }
}

// Create singleton instance
const dualMountToggle = new DualMountToggle();

// Export functions
export function initializeDualMountToggle(config?: Partial<DualMountConfig>): void {
  if (config) {
    dualMountToggle.updateConfig(config);
  }
  dualMountToggle.initialize();
}

export function toggleEnvironment(): ToggleResult {
  return dualMountToggle.toggleEnvironment();
}

export function setEnvironment(environment: 'legacy' | 'nextgen'): ToggleResult {
  return dualMountToggle.setEnvironment(environment);
}

export function getCurrentEnvironment(): 'legacy' | 'nextgen' {
  return dualMountToggle.getCurrentEnvironment();
}

export function getDualMountConfig(): DualMountConfig {
  return dualMountToggle.getConfig();
}

export function updateDualMountConfig(updates: Partial<DualMountConfig>): void {
  dualMountToggle.updateConfig(updates);
}

export function isDualMountReady(): boolean {
  return dualMountToggle.isReadyForSwitch();
}

export function getDualMountStatus(): ReturnType<DualMountToggle['getStatus']> {
  return dualMountToggle.getStatus();
}

export function resetToFallbackEnvironment(): ToggleResult {
  return dualMountToggle.resetToFallback();
}

export function validateDualMountConfiguration(): boolean {
  return dualMountToggle.validateConfiguration();
}

// Export the class for direct usage
export { DualMountToggle }; 