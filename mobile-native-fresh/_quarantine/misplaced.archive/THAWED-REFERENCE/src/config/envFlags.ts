// src/config/envFlags.ts
// Environment flags configuration for dual-mount architecture

export interface EnvironmentFlags {
  // Core environment flags
  EXPO_PUBLIC_USE_NEXTGEN: string;
  EXPO_PUBLIC_ENVIRONMENT: string;
  
  // Development flags
  NODE_ENV: string;
  __DEV__: boolean;
  
  // Feature flags
  EXPO_PUBLIC_ENABLE_DEBUG: string;
  EXPO_PUBLIC_ENABLE_PERFORMANCE_MONITORING: string;
  EXPO_PUBLIC_ENABLE_ACCESSIBILITY_AUDIT: string;
  EXPO_PUBLIC_ENABLE_VISUAL_REGRESSION: string;
  EXPO_PUBLIC_ENABLE_ROLE_ANALYSIS: string;
  
  // Dual-mount specific flags
  EXPO_PUBLIC_DUAL_MOUNT_ENABLED: string;
  EXPO_PUBLIC_LEGACY_FALLBACK: string;
  EXPO_PUBLIC_NEXTGEN_FALLBACK: string;
  
  // Testing flags
  EXPO_PUBLIC_TEST_MODE: string;
  EXPO_PUBLIC_MOCK_ENABLED: string;
  EXPO_PUBLIC_TEST_ENVIRONMENT: string;
  
  // Logging flags
  EXPO_PUBLIC_LOG_LEVEL: string;
  EXPO_PUBLIC_ENABLE_CONSOLE_LOGGING: string;
  EXPO_PUBLIC_ENABLE_FILE_LOGGING: string;
  
  // Performance flags
  EXPO_PUBLIC_PERFORMANCE_THRESHOLD: string;
  EXPO_PUBLIC_MEMORY_THRESHOLD: string;
  EXPO_PUBLIC_RENDER_TIME_THRESHOLD: string;
}

export interface EnvironmentConfig {
  isDevelopment: boolean;
  isProduction: boolean;
  isTest: boolean;
  currentEnvironment: 'legacy' | 'nextgen';
  useNextGen: boolean;
  enableDebug: boolean;
  enablePerformanceMonitoring: boolean;
  enableAccessibilityAudit: boolean;
  enableVisualRegression: boolean;
  enableRoleAnalysis: boolean;
  dualMountEnabled: boolean;
  testMode: boolean;
  logLevel: 'debug' | 'info' | 'warn' | 'error';
}

class EnvironmentFlagsManager {
  private flags: EnvironmentFlags;
  private config: EnvironmentConfig;

  constructor() {
    this.flags = this.initializeFlags();
    this.config = this.buildConfig();
  }

  /**
   * Initialize environment flags
   */
  private initializeFlags(): EnvironmentFlags {
    return {
      // Core environment flags
      EXPO_PUBLIC_USE_NEXTGEN: process.env.EXPO_PUBLIC_USE_NEXTGEN || 'false',
      EXPO_PUBLIC_ENVIRONMENT: process.env.EXPO_PUBLIC_ENVIRONMENT || 'legacy',
      
      // Development flags
      NODE_ENV: process.env.NODE_ENV || 'development',
      __DEV__: __DEV__ || false,
      
      // Feature flags
      EXPO_PUBLIC_ENABLE_DEBUG: process.env.EXPO_PUBLIC_ENABLE_DEBUG || 'true',
      EXPO_PUBLIC_ENABLE_PERFORMANCE_MONITORING: process.env.EXPO_PUBLIC_ENABLE_PERFORMANCE_MONITORING || 'true',
      EXPO_PUBLIC_ENABLE_ACCESSIBILITY_AUDIT: process.env.EXPO_PUBLIC_ENABLE_ACCESSIBILITY_AUDIT || 'true',
      EXPO_PUBLIC_ENABLE_VISUAL_REGRESSION: process.env.EXPO_PUBLIC_ENABLE_VISUAL_REGRESSION || 'true',
      EXPO_PUBLIC_ENABLE_ROLE_ANALYSIS: process.env.EXPO_PUBLIC_ENABLE_ROLE_ANALYSIS || 'true',
      
      // Dual-mount specific flags
      EXPO_PUBLIC_DUAL_MOUNT_ENABLED: process.env.EXPO_PUBLIC_DUAL_MOUNT_ENABLED || 'true',
      EXPO_PUBLIC_LEGACY_FALLBACK: process.env.EXPO_PUBLIC_LEGACY_FALLBACK || 'true',
      EXPO_PUBLIC_NEXTGEN_FALLBACK: process.env.EXPO_PUBLIC_NEXTGEN_FALLBACK || 'false',
      
      // Testing flags
      EXPO_PUBLIC_TEST_MODE: process.env.EXPO_PUBLIC_TEST_MODE || 'false',
      EXPO_PUBLIC_MOCK_ENABLED: process.env.EXPO_PUBLIC_MOCK_ENABLED || 'false',
      EXPO_PUBLIC_TEST_ENVIRONMENT: process.env.EXPO_PUBLIC_TEST_ENVIRONMENT || 'legacy',
      
      // Logging flags
      EXPO_PUBLIC_LOG_LEVEL: process.env.EXPO_PUBLIC_LOG_LEVEL || 'info',
      EXPO_PUBLIC_ENABLE_CONSOLE_LOGGING: process.env.EXPO_PUBLIC_ENABLE_CONSOLE_LOGGING || 'true',
      EXPO_PUBLIC_ENABLE_FILE_LOGGING: process.env.EXPO_PUBLIC_ENABLE_FILE_LOGGING || 'false',
      
      // Performance flags
      EXPO_PUBLIC_PERFORMANCE_THRESHOLD: process.env.EXPO_PUBLIC_PERFORMANCE_THRESHOLD || '5000',
      EXPO_PUBLIC_MEMORY_THRESHOLD: process.env.EXPO_PUBLIC_MEMORY_THRESHOLD || '100',
      EXPO_PUBLIC_RENDER_TIME_THRESHOLD: process.env.EXPO_PUBLIC_RENDER_TIME_THRESHOLD || '100',
    };
  }

  /**
   * Build environment configuration from flags
   */
  private buildConfig(): EnvironmentConfig {
    const useNextGen = this.flags.EXPO_PUBLIC_USE_NEXTGEN === 'true';
    const currentEnvironment = useNextGen ? 'nextgen' : 'legacy';
    
    return {
      isDevelopment: this.flags.NODE_ENV === 'development' || this.flags.__DEV__,
      isProduction: this.flags.NODE_ENV === 'production',
      isTest: this.flags.EXPO_PUBLIC_TEST_MODE === 'true',
      currentEnvironment,
      useNextGen,
      enableDebug: this.flags.EXPO_PUBLIC_ENABLE_DEBUG === 'true',
      enablePerformanceMonitoring: this.flags.EXPO_PUBLIC_ENABLE_PERFORMANCE_MONITORING === 'true',
      enableAccessibilityAudit: this.flags.EXPO_PUBLIC_ENABLE_ACCESSIBILITY_AUDIT === 'true',
      enableVisualRegression: this.flags.EXPO_PUBLIC_ENABLE_VISUAL_REGRESSION === 'true',
      enableRoleAnalysis: this.flags.EXPO_PUBLIC_ENABLE_ROLE_ANALYSIS === 'true',
      dualMountEnabled: this.flags.EXPO_PUBLIC_DUAL_MOUNT_ENABLED === 'true',
      testMode: this.flags.EXPO_PUBLIC_TEST_MODE === 'true',
      logLevel: (this.flags.EXPO_PUBLIC_LOG_LEVEL as EnvironmentConfig['logLevel']) || 'info',
    };
  }

  /**
   * Get all environment flags
   */
  getFlags(): EnvironmentFlags {
    return { ...this.flags };
  }

  /**
   * Get environment configuration
   */
  getConfig(): EnvironmentConfig {
    return { ...this.config };
  }

  /**
   * Update environment flags
   */
  updateFlags(updates: Partial<EnvironmentFlags>): void {
    this.flags = { ...this.flags, ...updates };
    this.config = this.buildConfig();
    
    // Update process.env for critical flags
    if (updates.EXPO_PUBLIC_USE_NEXTGEN) {
      process.env.EXPO_PUBLIC_USE_NEXTGEN = updates.EXPO_PUBLIC_USE_NEXTGEN;
    }
    if (updates.EXPO_PUBLIC_ENVIRONMENT) {
      process.env.EXPO_PUBLIC_ENVIRONMENT = updates.EXPO_PUBLIC_ENVIRONMENT;
    }
    
    console.log('⚙️ Environment flags updated');
  }

  /**
   * Get a specific flag value
   */
  getFlag(key: keyof EnvironmentFlags): string | boolean {
    return this.flags[key];
  }

  /**
   * Set a specific flag value
   */
  setFlag(key: keyof EnvironmentFlags, value: string | boolean): void {
    (this.flags as any)[key] = value;
    this.config = this.buildConfig();
    
    // Update process.env for critical flags
    if (key === 'EXPO_PUBLIC_USE_NEXTGEN' || key === 'EXPO_PUBLIC_ENVIRONMENT') {
      process.env[key] = value as string;
    }
  }

  /**
   * Check if a feature is enabled
   */
  isFeatureEnabled(feature: keyof Pick<EnvironmentConfig, 
    'enableDebug' | 'enablePerformanceMonitoring' | 'enableAccessibilityAudit' | 
    'enableVisualRegression' | 'enableRoleAnalysis' | 'dualMountEnabled' | 'testMode'
  >): boolean {
    return this.config[feature];
  }

  /**
   * Get current environment
   */
  getCurrentEnvironment(): 'legacy' | 'nextgen' {
    return this.config.currentEnvironment;
  }

  /**
   * Check if in development mode
   */
  isDevelopment(): boolean {
    return this.config.isDevelopment;
  }

  /**
   * Check if in production mode
   */
  isProduction(): boolean {
    return this.config.isProduction;
  }

  /**
   * Check if in test mode
   */
  isTest(): boolean {
    return this.config.isTest;
  }

  /**
   * Validate environment flags
   */
  validateFlags(): boolean {
    const requiredFlags = [
      'EXPO_PUBLIC_USE_NEXTGEN',
      'EXPO_PUBLIC_ENVIRONMENT',
      'NODE_ENV'
    ];

    const missingFlags = requiredFlags.filter(flag => !this.flags[flag as keyof EnvironmentFlags]);
    
    if (missingFlags.length > 0) {
      console.error('❌ Missing required environment flags:', missingFlags);
      return false;
    }

    const validEnvironments = ['legacy', 'nextgen'];
    if (!validEnvironments.includes(this.flags.EXPO_PUBLIC_ENVIRONMENT)) {
      console.error('❌ Invalid environment value:', this.flags.EXPO_PUBLIC_ENVIRONMENT);
      return false;
    }

    return true;
  }

  /**
   * Generate environment report
   */
  generateReport(): string {
    return `
Environment Flags Report:
=======================
Current Environment: ${this.config.currentEnvironment}
Development Mode: ${this.config.isDevelopment}
Production Mode: ${this.config.isProduction}
Test Mode: ${this.config.isTest}
Dual Mount Enabled: ${this.config.dualMountEnabled}
Debug Enabled: ${this.config.enableDebug}
Performance Monitoring: ${this.config.enablePerformanceMonitoring}
Accessibility Audit: ${this.config.enableAccessibilityAudit}
Visual Regression: ${this.config.enableVisualRegression}
Role Analysis: ${this.config.enableRoleAnalysis}
Log Level: ${this.config.logLevel}
    `.trim();
  }
}

// Create singleton instance
const envFlags = new EnvironmentFlagsManager();

// Export functions
export function getEnvironmentFlags(): EnvironmentFlags {
  return envFlags.getFlags();
}

export function getEnvironmentConfig(): EnvironmentConfig {
  return envFlags.getConfig();
}

export function updateEnvironmentFlags(updates: Partial<EnvironmentFlags>): void {
  envFlags.updateFlags(updates);
}

export function getEnvironmentFlag(key: keyof EnvironmentFlags): string | boolean {
  return envFlags.getFlag(key);
}

export function setEnvironmentFlag(key: keyof EnvironmentFlags, value: string | boolean): void {
  envFlags.setFlag(key, value);
}

export function isFeatureEnabled(feature: keyof Pick<EnvironmentConfig, 
  'enableDebug' | 'enablePerformanceMonitoring' | 'enableAccessibilityAudit' | 
  'enableVisualRegression' | 'enableRoleAnalysis' | 'dualMountEnabled' | 'testMode'
>): boolean {
  return envFlags.isFeatureEnabled(feature);
}

export function getCurrentEnvironment(): 'legacy' | 'nextgen' {
  return envFlags.getCurrentEnvironment();
}

export function isDevelopment(): boolean {
  return envFlags.isDevelopment();
}

export function isProduction(): boolean {
  return envFlags.isProduction();
}

export function isTest(): boolean {
  return envFlags.isTest();
}

export function validateEnvironmentFlags(): boolean {
  return envFlags.validateFlags();
}

export function generateEnvironmentReport(): string {
  return envFlags.generateReport();
}

// Export the class for direct usage
export { EnvironmentFlagsManager }; 