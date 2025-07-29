// Environment configuration interface

// Environment configuration interface
interface EnvironmentConfig {
  apiUrl: string;
  apiKey: string;
  environment: 'development' | 'staging' | 'production';
  debugMode: boolean;
  timeout: number;
  retryAttempts: number;
  cacheEnabled: boolean;
  analyticsEnabled: boolean;
  crashReportingEnabled: boolean;
}

// Environment validation result
interface EnvironmentValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  missingKeys: string[];
  invalidValues: string[];
}

// Configuration source types
type ConfigSource = 'env' | 'local' | 'remote' | 'fallback';

// Configuration cache entry
interface ConfigCacheEntry {
  config: EnvironmentConfig;
  source: ConfigSource;
  timestamp: number;
  ttl: number;
}

export class EnvironmentSystem {
  private static instance: EnvironmentSystem;
  private config: EnvironmentConfig;
  private configCache: Map<string, ConfigCacheEntry>;
  private validationResults: EnvironmentValidationResult;
  private configSources: Map<ConfigSource, () => Promise<Partial<EnvironmentConfig>>>;
  private isInitialized = false;
  private initializationPromise: Promise<void> | null = null;
  private configWatchers: Array<(config: EnvironmentConfig) => void>;
  private errorHandlers: Array<(error: Error) => void>;

  private constructor() {
    this.config = this.getDefaultConfig();
    this.configCache = new Map();
    this.validationResults = {
      isValid: false,
      errors: [],
      warnings: [],
      missingKeys: [],
      invalidValues: [],
    };
    this.configSources = new Map();
    this.configWatchers = [];
    this.errorHandlers = [];
    this.setupConfigSources();
  }

  public static getInstance(): EnvironmentSystem {
    if (!EnvironmentSystem.instance) {
      EnvironmentSystem.instance = new EnvironmentSystem();
    }
    return EnvironmentSystem.instance;
  }

  // Initialize environment system with fallback chain
  public async initialize(): Promise<void> {
    if (this.isInitialized) {
      return;
    }

    if (this.initializationPromise) {
      return this.initializationPromise;
    }

    this.initializationPromise = this.performInitialization();
    return this.initializationPromise;
  }

  private async performInitialization(): Promise<void> {
    try {
      console.log('🔧 Initializing Environment System...');
      
      // Try configuration sources in order of preference
      const sources: ConfigSource[] = ['env', 'local', 'remote', 'fallback'];
      
      for (const source of sources) {
        try {
          const sourceConfig = await this.loadConfigFromSource(source);
          if (sourceConfig && Object.keys(sourceConfig).length > 0) {
            this.config = { ...this.config, ...sourceConfig };
            console.log(`✅ Loaded config from ${source}`);
            break;
          }
        } catch (error) {
          console.warn(`⚠️ Failed to load config from ${source}:`, error);
          this.handleError(error as Error);
        }
      }

      // Validate configuration
      this.validationResults = this.validateConfiguration(this.config);
      
      if (!this.validationResults.isValid) {
        console.warn('⚠️ Configuration validation failed:', this.validationResults.errors);
        this.applyFallbackConfig();
      }

      this.isInitialized = true;
      console.log('✅ Environment System initialized successfully');
      
      // Notify watchers
      this.notifyConfigWatchers();
      
    } catch (error) {
      console.error('❌ Environment System initialization failed:', error);
      this.handleError(error as Error);
      this.applyFallbackConfig();
      this.isInitialized = true;
    }
  }

  // Get current configuration
  public getConfig(): EnvironmentConfig {
    if (!this.isInitialized) {
      console.warn('⚠️ Environment System not initialized, returning default config');
      return this.getDefaultConfig();
    }
    return { ...this.config };
  }

  // Update configuration
  public async updateConfig(updates: Partial<EnvironmentConfig>): Promise<void> {
    try {
      const newConfig = { ...this.config, ...updates };
      const validation = this.validateConfiguration(newConfig);
      
      if (validation.isValid) {
        this.config = newConfig;
        this.validationResults = validation;
        this.notifyConfigWatchers();
        console.log('✅ Configuration updated successfully');
      } else {
        console.warn('⚠️ Configuration update failed validation:', validation.errors);
        throw new Error(`Configuration validation failed: ${validation.errors.join(', ')}`);
      }
    } catch (error) {
      this.handleError(error as Error);
      throw error;
    }
  }

  // Get validation results
  public getValidationResults(): EnvironmentValidationResult {
    return { ...this.validationResults };
  }

  // Add configuration watcher
  public addConfigWatcher(watcher: (config: EnvironmentConfig) => void): void {
    this.configWatchers.push(watcher);
  }

  // Remove configuration watcher
  public removeConfigWatcher(watcher: (config: EnvironmentConfig) => void): void {
    const index = this.configWatchers.indexOf(watcher);
    if (index > -1) {
      this.configWatchers.splice(index, 1);
    }
  }

  // Add error handler
  public addErrorHandler(handler: (error: Error) => void): void {
    this.errorHandlers.push(handler);
  }

  // Remove error handler
  public removeErrorHandler(handler: (error: Error) => void): void {
    const index = this.errorHandlers.indexOf(handler);
    if (index > -1) {
      this.errorHandlers.splice(index, 1);
    }
  }

  // Reload configuration
  public async reloadConfig(): Promise<void> {
    console.log('🔄 Reloading configuration...');
    this.isInitialized = false;
    this.initializationPromise = null;
    this.configCache.clear();
    await this.initialize();
  }

  // Get configuration value with fallback
  public getValue<T>(key: keyof EnvironmentConfig, fallback?: T): T {
    if (!this.isInitialized) {
      console.warn(`⚠️ Environment System not initialized, returning fallback for ${key}`);
      return fallback as T;
    }
    
    const value = this.config[key];
    if (value !== undefined) {
      return value as T;
    }
    
    if (fallback !== undefined) {
      return fallback;
    }
    
    throw new Error(`Configuration key '${key}' not found and no fallback provided`);
  }

  // Check if configuration is valid
  public isValid(): boolean {
    return this.validationResults.isValid;
  }

  // Get configuration errors
  public getErrors(): string[] {
    return [...this.validationResults.errors];
  }

  // Get configuration warnings
  public getWarnings(): string[] {
    return [...this.validationResults.warnings];
  }

  // Private methods

  private getDefaultConfig(): EnvironmentConfig {
    return {
      apiUrl: 'https://api.thoughtmarks.app',
      apiKey: '',
      environment: 'development',
      debugMode: true,
      timeout: 30000,
      retryAttempts: 3,
      cacheEnabled: true,
      analyticsEnabled: false,
      crashReportingEnabled: false,
    };
  }

  private setupConfigSources(): void {
    // Environment variables source
    this.configSources.set('env', async () => {
      return this.loadFromEnvironmentVariables();
    });

    // Local configuration source
    this.configSources.set('local', async () => {
      return this.loadFromLocalConfig();
    });

    // Remote configuration source
    this.configSources.set('remote', async () => {
      return this.loadFromRemoteConfig();
    });

    // Fallback configuration source
    this.configSources.set('fallback', async () => {
      return this.getDefaultConfig();
    });
  }

  private async loadConfigFromSource(source: ConfigSource): Promise<Partial<EnvironmentConfig> | null> {
    const sourceLoader = this.configSources.get(source);
    if (!sourceLoader) {
      throw new Error(`Unknown configuration source: ${source}`);
    }

    try {
      const config = await sourceLoader();
      if (config && Object.keys(config).length > 0) {
        // Cache the configuration
        this.configCache.set(source, {
          config: { ...this.getDefaultConfig(), ...config },
          source,
          timestamp: Date.now(),
          ttl: 300000, // 5 minutes
        });
        return config;
      }
    } catch (error) {
      console.warn(`Failed to load config from ${source}:`, error);
    }

    return null;
  }

  private loadFromEnvironmentVariables(): Partial<EnvironmentConfig> {
    const config: Partial<EnvironmentConfig> = {};

    // Load from environment variables if available
    if (typeof process !== 'undefined' && process.env) {
      if (process.env.API_URL) config.apiUrl = process.env.API_URL;
      if (process.env.API_KEY) config.apiKey = process.env.API_KEY;
      if (process.env.NODE_ENV) {
        const env = process.env.NODE_ENV as EnvironmentConfig['environment'];
        if (['development', 'staging', 'production'].includes(env)) {
          config.environment = env;
        }
      }
      if (process.env.DEBUG_MODE) config.debugMode = process.env.DEBUG_MODE === 'true';
      if (process.env.TIMEOUT) config.timeout = parseInt(process.env.TIMEOUT, 10);
      if (process.env.RETRY_ATTEMPTS) config.retryAttempts = parseInt(process.env.RETRY_ATTEMPTS, 10);
      if (process.env.CACHE_ENABLED) config.cacheEnabled = process.env.CACHE_ENABLED === 'true';
      if (process.env.ANALYTICS_ENABLED) config.analyticsEnabled = process.env.ANALYTICS_ENABLED === 'true';
      if (process.env.CRASH_REPORTING_ENABLED) config.crashReportingEnabled = process.env.CRASH_REPORTING_ENABLED === 'true';
    }

    return config;
  }

  private async loadFromLocalConfig(): Promise<Partial<EnvironmentConfig>> {
    // In React Native, we might load from AsyncStorage or similar
    // For now, return empty object
    return {};
  }

  private async loadFromRemoteConfig(): Promise<Partial<EnvironmentConfig>> {
    // In a real implementation, this would fetch from a remote configuration service
    // For now, return empty object
    return {};
  }

  private validateConfiguration(config: EnvironmentConfig): EnvironmentValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    const missingKeys: string[] = [];
    const invalidValues: string[] = [];

    // Required fields validation
    if (!config.apiUrl) {
      missingKeys.push('apiUrl');
      errors.push('API URL is required');
    } else if (!this.isValidUrl(config.apiUrl)) {
      invalidValues.push('apiUrl');
      errors.push('API URL is not a valid URL');
    }

    if (!config.apiKey) {
      warnings.push('API key is not set - some features may not work');
    }

    // Environment validation
    if (!['development', 'staging', 'production'].includes(config.environment)) {
      invalidValues.push('environment');
      errors.push('Environment must be development, staging, or production');
    }

    // Timeout validation
    if (config.timeout < 1000 || config.timeout > 300000) {
      invalidValues.push('timeout');
      warnings.push('Timeout should be between 1000ms and 300000ms');
    }

    // Retry attempts validation
    if (config.retryAttempts < 0 || config.retryAttempts > 10) {
      invalidValues.push('retryAttempts');
      warnings.push('Retry attempts should be between 0 and 10');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      missingKeys,
      invalidValues,
    };
  }

  private isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  private applyFallbackConfig(): void {
    console.log('🔄 Applying fallback configuration...');
    this.config = this.getDefaultConfig();
    this.validationResults = this.validateConfiguration(this.config);
  }

  private notifyConfigWatchers(): void {
    this.configWatchers.forEach(watcher => {
      try {
        watcher(this.config);
      } catch (error) {
        console.error('Error in config watcher:', error);
      }
    });
  }

  private handleError(error: Error): void {
    console.error('Environment System Error:', error);
    this.errorHandlers.forEach(handler => {
      try {
        handler(error);
      } catch (handlerError) {
        console.error('Error in error handler:', handlerError);
      }
    });
  }
}

// Export singleton instance
export const environmentSystem = EnvironmentSystem.getInstance(); 