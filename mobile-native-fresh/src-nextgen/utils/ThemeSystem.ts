// Theme configuration interfaces
interface ColorPalette {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
  error: string;
  warning: string;
  success: string;
  info: string;
  disabled: string;
  overlay: string;
  shadow: string;
}

interface TypographyConfig {
  fontFamily: {
    regular: string;
    medium: string;
    bold: string;
    light: string;
  };
  fontSize: {
    xs: number;
    sm: number;
    base: number;
    lg: number;
    xl: number;
    '2xl': number;
    '3xl': number;
    '4xl': number;
  };
  lineHeight: {
    tight: number;
    normal: number;
    relaxed: number;
  };
  fontWeight: {
    light: string;
    normal: string;
    medium: string;
    bold: string;
  };
}

interface SpacingConfig {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  '2xl': number;
  '3xl': number;
  '4xl': number;
}

interface BorderRadiusConfig {
  none: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  full: number;
}

interface ShadowConfig {
  sm: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
}

interface ThemeConfig {
  name: string;
  colors: ColorPalette;
  typography: TypographyConfig;
  spacing: SpacingConfig;
  borderRadius: BorderRadiusConfig;
  shadows: ShadowConfig;
  isDark: boolean;
}

// Theme change event
interface ThemeChangeEvent {
  previousTheme: string;
  currentTheme: string;
  timestamp: number;
  reason: 'user' | 'system' | 'auto';
}

// Theme validation result
interface ThemeValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  missingProperties: string[];
}

export class ThemeSystem {
  private static instance: ThemeSystem;
  private currentTheme: ThemeConfig;
  private themes: Map<string, ThemeConfig>;
  private themeWatchers: Array<(theme: ThemeConfig, event: ThemeChangeEvent) => void>;
  private errorHandlers: Array<(error: Error) => void>;
  private isInitialized = false;
  private initializationPromise: Promise<void> | null = null;
  private themeHistory: ThemeChangeEvent[];
  private maxHistorySize = 50;

  private constructor() {
    this.themes = new Map();
    this.themeWatchers = [];
    this.errorHandlers = [];
    this.themeHistory = [];
    this.currentTheme = this.getDefaultTheme();
    this.setupDefaultThemes();
  }

  public static getInstance(): ThemeSystem {
    if (!ThemeSystem.instance) {
      ThemeSystem.instance = new ThemeSystem();
    }
    return ThemeSystem.instance;
  }

  // Initialize theme system
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
      console.log('🎨 Initializing Theme System...');
      
      // Load saved theme preference
      const savedTheme = await this.loadSavedTheme();
      if (savedTheme && this.themes.has(savedTheme)) {
        this.currentTheme = this.themes.get(savedTheme)!;
        console.log(`✅ Loaded saved theme: ${savedTheme}`);
      } else {
        // Use system preference or default
        const systemTheme = await this.detectSystemTheme();
        this.currentTheme = this.themes.get(systemTheme) || this.themes.get('light')!;
        console.log(`✅ Using system theme: ${this.currentTheme.name}`);
      }

      this.isInitialized = true;
      console.log('✅ Theme System initialized successfully');
      
      // Notify watchers
      this.notifyThemeWatchers({
        previousTheme: '',
        currentTheme: this.currentTheme.name,
        timestamp: Date.now(),
        reason: 'system',
      });
      
    } catch (error) {
      console.error('❌ Theme System initialization failed:', error);
      this.handleError(error as Error);
      this.currentTheme = this.themes.get('light')!;
      this.isInitialized = true;
    }
  }

  // Get current theme
  public getCurrentTheme(): ThemeConfig {
    if (!this.isInitialized) {
      console.warn('⚠️ Theme System not initialized, returning default theme');
      return this.getDefaultTheme();
    }
    return { ...this.currentTheme };
  }

  // Set theme
  public async setTheme(themeName: string): Promise<void> {
    try {
      if (!this.themes.has(themeName)) {
        throw new Error(`Theme '${themeName}' not found`);
      }

      const previousTheme = this.currentTheme.name;
      this.currentTheme = this.themes.get(themeName)!;

      // Save theme preference
      await this.saveThemePreference(themeName);

      // Record theme change
      const event: ThemeChangeEvent = {
        previousTheme,
        currentTheme: themeName,
        timestamp: Date.now(),
        reason: 'user',
      };
      this.recordThemeChange(event);

      // Notify watchers
      this.notifyThemeWatchers(event);

      console.log(`✅ Theme changed to: ${themeName}`);
    } catch (error) {
      this.handleError(error as Error);
      throw error;
    }
  }

  // Toggle between light and dark themes
  public async toggleTheme(): Promise<void> {
    const currentThemeName = this.currentTheme.name;
    const newThemeName = currentThemeName === 'light' ? 'dark' : 'light';
    await this.setTheme(newThemeName);
  }

  // Get available themes
  public getAvailableThemes(): string[] {
    return Array.from(this.themes.keys());
  }

  // Add custom theme
  public addTheme(theme: ThemeConfig): void {
    try {
      const validation = this.validateTheme(theme);
      if (!validation.isValid) {
        throw new Error(`Theme validation failed: ${validation.errors.join(', ')}`);
      }

      this.themes.set(theme.name, theme);
      console.log(`✅ Added custom theme: ${theme.name}`);
    } catch (error) {
      this.handleError(error as Error);
      throw error;
    }
  }

  // Remove custom theme
  public removeTheme(themeName: string): void {
    if (['light', 'dark'].includes(themeName)) {
      throw new Error(`Cannot remove built-in theme: ${themeName}`);
    }

    if (this.themes.has(themeName)) {
      this.themes.delete(themeName);
      console.log(`✅ Removed theme: ${themeName}`);
    }
  }

  // Get theme by name
  public getTheme(themeName: string): ThemeConfig | null {
    return this.themes.get(themeName) || null;
  }

  // Add theme watcher
  public addThemeWatcher(watcher: (theme: ThemeConfig, event: ThemeChangeEvent) => void): void {
    this.themeWatchers.push(watcher);
  }

  // Remove theme watcher
  public removeThemeWatcher(watcher: (theme: ThemeConfig, event: ThemeChangeEvent) => void): void {
    const index = this.themeWatchers.indexOf(watcher);
    if (index > -1) {
      this.themeWatchers.splice(index, 1);
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

  // Get theme history
  public getThemeHistory(): ThemeChangeEvent[] {
    return [...this.themeHistory];
  }

  // Get theme statistics
  public getThemeStatistics(): { [themeName: string]: number } {
    const stats: { [themeName: string]: number } = {};
    
    this.themeHistory.forEach(event => {
      stats[event.currentTheme] = (stats[event.currentTheme] || 0) + 1;
    });

    return stats;
  }

  // Validate theme
  public validateTheme(theme: ThemeConfig): ThemeValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    const missingProperties: string[] = [];

    // Required properties
    if (!theme.name) {
      missingProperties.push('name');
      errors.push('Theme name is required');
    }

    if (!theme.colors) {
      missingProperties.push('colors');
      errors.push('Colors configuration is required');
    } else {
      const requiredColors = ['primary', 'secondary', 'background', 'text'];
      requiredColors.forEach(color => {
        if (!theme.colors[color as keyof ColorPalette]) {
          missingProperties.push(`colors.${color}`);
          errors.push(`Color '${color}' is required`);
        }
      });
    }

    if (!theme.typography) {
      missingProperties.push('typography');
      errors.push('Typography configuration is required');
    }

    if (!theme.spacing) {
      missingProperties.push('spacing');
      errors.push('Spacing configuration is required');
    }

    if (!theme.borderRadius) {
      missingProperties.push('borderRadius');
      errors.push('Border radius configuration is required');
    }

    if (!theme.shadows) {
      missingProperties.push('shadows');
      errors.push('Shadows configuration is required');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      missingProperties,
    };
  }

  // Private methods

  private getDefaultTheme(): ThemeConfig {
    return this.themes.get('light') || this.createLightTheme();
  }

  private setupDefaultThemes(): void {
    // Light theme
    this.themes.set('light', this.createLightTheme());
    
    // Dark theme
    this.themes.set('dark', this.createDarkTheme());
  }

  private createLightTheme(): ThemeConfig {
    return {
      name: 'light',
      isDark: false,
      colors: {
        primary: '#007AFF',
        secondary: '#5856D6',
        accent: '#FF9500',
        background: '#FFFFFF',
        surface: '#F2F2F7',
        text: '#000000',
        textSecondary: '#8E8E93',
        border: '#C6C6C8',
        error: '#FF3B30',
        warning: '#FF9500',
        success: '#34C759',
        info: '#007AFF',
        disabled: '#C7C7CC',
        overlay: 'rgba(0, 0, 0, 0.5)',
        shadow: 'rgba(0, 0, 0, 0.1)',
      },
      typography: {
        fontFamily: {
          regular: 'System',
          medium: 'System',
          bold: 'System',
          light: 'System',
        },
        fontSize: {
          xs: 12,
          sm: 14,
          base: 16,
          lg: 18,
          xl: 20,
          '2xl': 24,
          '3xl': 30,
          '4xl': 36,
        },
        lineHeight: {
          tight: 1.25,
          normal: 1.5,
          relaxed: 1.75,
        },
        fontWeight: {
          light: '300',
          normal: '400',
          medium: '500',
          bold: '700',
        },
      },
      spacing: {
        xs: 4,
        sm: 8,
        md: 16,
        lg: 24,
        xl: 32,
        '2xl': 48,
        '3xl': 64,
        '4xl': 96,
      },
      borderRadius: {
        none: 0,
        sm: 4,
        md: 8,
        lg: 12,
        xl: 16,
        full: 9999,
      },
      shadows: {
        sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
        '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      },
    };
  }

  private createDarkTheme(): ThemeConfig {
    return {
      name: 'dark',
      isDark: true,
      colors: {
        primary: '#0A84FF',
        secondary: '#5E5CE6',
        accent: '#FF9F0A',
        background: '#000000',
        surface: '#1C1C1E',
        text: '#FFFFFF',
        textSecondary: '#8E8E93',
        border: '#38383A',
        error: '#FF453A',
        warning: '#FF9F0A',
        success: '#30D158',
        info: '#0A84FF',
        disabled: '#3A3A3C',
        overlay: 'rgba(0, 0, 0, 0.7)',
        shadow: 'rgba(0, 0, 0, 0.3)',
      },
      typography: {
        fontFamily: {
          regular: 'System',
          medium: 'System',
          bold: 'System',
          light: 'System',
        },
        fontSize: {
          xs: 12,
          sm: 14,
          base: 16,
          lg: 18,
          xl: 20,
          '2xl': 24,
          '3xl': 30,
          '4xl': 36,
        },
        lineHeight: {
          tight: 1.25,
          normal: 1.5,
          relaxed: 1.75,
        },
        fontWeight: {
          light: '300',
          normal: '400',
          medium: '500',
          bold: '700',
        },
      },
      spacing: {
        xs: 4,
        sm: 8,
        md: 16,
        lg: 24,
        xl: 32,
        '2xl': 48,
        '3xl': 64,
        '4xl': 96,
      },
      borderRadius: {
        none: 0,
        sm: 4,
        md: 8,
        lg: 12,
        xl: 16,
        full: 9999,
      },
      shadows: {
        sm: '0 1px 2px 0 rgba(0, 0, 0, 0.3)',
        md: '0 4px 6px -1px rgba(0, 0, 0, 0.4)',
        lg: '0 10px 15px -3px rgba(0, 0, 0, 0.4)',
        xl: '0 20px 25px -5px rgba(0, 0, 0, 0.4)',
        '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
      },
    };
  }

  private async loadSavedTheme(): Promise<string | null> {
    // In React Native, this would load from AsyncStorage
    // For now, return null to use system preference
    return null;
  }

  private async saveThemePreference(themeName: string): Promise<void> {
    // In React Native, this would save to AsyncStorage
    // For now, just log the preference
    console.log(`💾 Saved theme preference: ${themeName}`);
  }

  private async detectSystemTheme(): Promise<string> {
    // In React Native, this would detect system appearance
    // For now, return 'light' as default
    return 'light';
  }

  private recordThemeChange(event: ThemeChangeEvent): void {
    this.themeHistory.push(event);
    
    // Keep history size manageable
    if (this.themeHistory.length > this.maxHistorySize) {
      this.themeHistory.shift();
    }
  }

  private notifyThemeWatchers(event: ThemeChangeEvent): void {
    this.themeWatchers.forEach(watcher => {
      try {
        watcher(this.currentTheme, event);
      } catch (error) {
        console.error('Error in theme watcher:', error);
      }
    });
  }

  private handleError(error: Error): void {
    console.error('Theme System Error:', error);
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
export const themeSystem = ThemeSystem.getInstance(); 