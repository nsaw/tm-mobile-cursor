import { Platform, Appearance } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Theme configuration
const THEME_STORAGE_KEY = '@thoughtmarks_theme';
const THEME_SWITCH_TIMEOUT = 3000; // 3 seconds
const THEME_VALIDATION_TIMEOUT = 5000; // 5 seconds

// Theme types
export type ThemeMode = 'light' | 'dark' | 'auto';
export type ThemeVariant = 'default' | 'high-contrast' | 'colorblind-friendly';

export interface ThemeColors {
  primary: string;
  secondary: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
  error: string;
  warning: string;
  success: string;
  info: string;
}

export interface ThemeSpacing {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  xxl: number;
}

export interface ThemeTypography {
  fontFamily: string;
  fontSize: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    xxl: number;
  };
  fontWeight: {
    light: string;
    normal: string;
    medium: string;
    bold: string;
  };
  lineHeight: {
    tight: number;
    normal: number;
    relaxed: number;
  };
}

export interface Theme {
  id: string;
  name: string;
  mode: ThemeMode;
  variant: ThemeVariant;
  colors: ThemeColors;
  spacing: ThemeSpacing;
  typography: ThemeTypography;
  borderRadius: number;
  shadow: {
    small: string;
    medium: string;
    large: string;
  };
  animation: {
    duration: {
      fast: number;
      normal: number;
      slow: number;
    };
    easing: {
      ease: string;
      easeIn: string;
      easeOut: string;
      easeInOut: string;
    };
  };
}

export interface ThemeState {
  current: Theme;
  available: Theme[];
  isLoading: boolean;
  error: string | null;
  lastUpdated: number;
  validationStatus: 'pending' | 'validating' | 'valid' | 'invalid';
  performanceMetrics: {
    switchTime: number;
    validationTime: number;
    memoryUsage: number;
  };
}

export interface ThemeSwitchResult {
  success: boolean;
  previousTheme: Theme;
  newTheme: Theme;
  error?: string;
  duration: number;
  validationPassed: boolean;
  performanceImpact: number;
}

export class ThemeSystem {
  private static instance: ThemeSystem;
  private state: ThemeState;
  private themeCache: Map<string, Theme>;
  private switchTimeoutRef: ReturnType<typeof setTimeout> | null = null;
  private validationTimeoutRef: ReturnType<typeof setTimeout> | null = null;
  private listeners: Set<(currentTheme: Theme) => void>;

  private constructor() {
    this.themeCache = new Map();
    this.listeners = new Set();
    
    this.state = {
      current: this.getDefaultTheme(),
      available: this.getAvailableThemes(),
      isLoading: true,
      error: null,
      lastUpdated: Date.now(),
      validationStatus: 'pending',
      performanceMetrics: {
        switchTime: 0,
        validationTime: 0,
        memoryUsage: 0,
      },
    };
  }

  public static getInstance(): ThemeSystem {
    if (!ThemeSystem.instance) {
      ThemeSystem.instance = new ThemeSystem();
    }
    return ThemeSystem.instance;
  }

  public async initialize(): Promise<void> {
    try {
      this.state.isLoading = true;
      this.state.error = null;
      
      // Load saved theme
      const savedTheme = await this.loadSavedTheme();
      if (savedTheme) {
        await this.switchTheme(savedTheme.id);
      } else {
        // Use system theme
        const systemTheme = this.getSystemTheme();
        await this.switchTheme(systemTheme.id);
      }
      
      this.state.isLoading = false;
      this.state.lastUpdated = Date.now();
    } catch (error) {
      console.error('Theme system initialization failed:', error);
      this.state.isLoading = false;
      this.state.error = error instanceof Error ? error.message : 'Initialization failed';
      this.state.validationStatus = 'invalid';
    }
  }

  public async switchTheme(themeId: string): Promise<ThemeSwitchResult> {
    const startTime = Date.now();
    const previousTheme = this.state.current;
    
    try {
      // Clear any existing timeouts
      this.clearTimeouts();
      
      // Find theme
      const newTheme = this.state.available.find(theme => theme.id === themeId);
      if (!newTheme) {
        throw new Error(`Theme not found: ${themeId}`);
      }
      
      // Validate theme
      const validationResult = await this.validateTheme(newTheme);
      if (!validationResult.isValid) {
        throw new Error(`Theme validation failed: ${validationResult.errors.join(', ')}`);
      }
      
      // Set timeout for theme switch
      this.switchTimeoutRef = setTimeout(() => {
        throw new Error('Theme switch timeout');
      }, THEME_SWITCH_TIMEOUT);
      
      // Perform theme switch
      await this.performThemeSwitch(newTheme);
      
      if (this.switchTimeoutRef) {
        clearTimeout(this.switchTimeoutRef);
      }
      
      const duration = Date.now() - startTime;
      const performanceImpact = this.calculatePerformanceImpact(duration);
      
      // Update performance metrics
      this.state.performanceMetrics.switchTime = duration;
      this.state.performanceMetrics.validationTime = validationResult.duration || 0;
      this.state.performanceMetrics.memoryUsage = this.getCurrentMemoryUsage();
      
      // Notify listeners
      this.notifyListeners(newTheme);
      
      return {
        success: true,
        previousTheme,
        newTheme,
        duration,
        validationPassed: true,
        performanceImpact,
      };
    } catch (error) {
      if (this.switchTimeoutRef) {
        clearTimeout(this.switchTimeoutRef);
      }
      
      console.error('Theme switch failed:', error);
      this.state.error = error instanceof Error ? error.message : 'Switch failed';
      
      return {
        success: false,
        previousTheme,
        newTheme: previousTheme,
        error: error instanceof Error ? error.message : 'Switch failed',
        duration: Date.now() - startTime,
        validationPassed: false,
        performanceImpact: 0,
      };
    }
  }

  private async validateTheme(theme: Theme): Promise<{ isValid: boolean; errors: string[]; duration: number }> {
    const startTime = Date.now();
    
    try {
      // Set validation timeout
      this.validationTimeoutRef = setTimeout(() => {
        throw new Error('Theme validation timeout');
      }, THEME_VALIDATION_TIMEOUT);
      
      // Perform validation
      const validationResult = await this.performThemeValidation(theme);
      
      if (this.validationTimeoutRef) {
        clearTimeout(this.validationTimeoutRef);
      }
      
      return {
        ...validationResult,
        duration: Date.now() - startTime,
      };
    } catch (error) {
      if (this.validationTimeoutRef) {
        clearTimeout(this.validationTimeoutRef);
      }
      
      return {
        isValid: false,
        errors: [error instanceof Error ? error.message : 'Validation failed'],
        duration: Date.now() - startTime,
      };
    }
  }

  private async performThemeValidation(theme: Theme): Promise<{ isValid: boolean; errors: string[] }> {
    const errors: string[] = [];
    
    try {
      // Validate color contrast
      const contrastErrors = this.validateColorContrast(theme.colors);
      errors.push(...contrastErrors);
      
      // Validate color accessibility
      const accessibilityErrors = this.validateColorAccessibility(theme.colors);
      errors.push(...accessibilityErrors);
      
      // Validate theme structure
      const structureErrors = this.validateThemeStructure(theme);
      errors.push(...structureErrors);
      
      // Validate performance impact
      const performanceErrors = this.validatePerformanceImpact(theme);
      errors.push(...performanceErrors);
      
      return {
        isValid: errors.length === 0,
        errors,
      };
    } catch (error) {
      return {
        isValid: false,
        errors: [error instanceof Error ? error.message : 'Theme validation failed'],
      };
    }
  }

  private validateColorContrast(colors: ThemeColors): string[] {
    const errors: string[] = [];
    
    try {
      // Check text contrast against background
      const textContrast = this.calculateContrastRatio(colors.text, colors.background);
      if (textContrast < 4.5) { // WCAG AA standard
        errors.push(`Text contrast ratio (${textContrast.toFixed(2)}) below WCAG AA standard (4.5)`);
      }
      
      // Check secondary text contrast
      const secondaryTextContrast = this.calculateContrastRatio(colors.textSecondary, colors.background);
      if (secondaryTextContrast < 3.0) { // WCAG AA standard for large text
        errors.push(`Secondary text contrast ratio (${secondaryTextContrast.toFixed(2)}) below WCAG AA standard (3.0)`);
      }
      
      return errors;
    } catch (error) {
      return [`Color contrast validation failed: ${error}`];
    }
  }

  private validateColorAccessibility(colors: ThemeColors): string[] {
    const errors: string[] = [];
    
    try {
      // Check for colorblind-friendly colors
      const colorblindIssues = this.checkColorblindAccessibility(colors);
      errors.push(...colorblindIssues);
      
      return errors;
    } catch (error) {
      return [`Color accessibility validation failed: ${error}`];
    }
  }

  private validateThemeStructure(theme: Theme): string[] {
    const errors: string[] = [];
    
    try {
      // Check required properties
      const requiredProperties = ['id', 'name', 'mode', 'variant', 'colors', 'spacing', 'typography'];
      for (const prop of requiredProperties) {
        if (!(prop in theme)) {
          errors.push(`Missing required theme property: ${prop}`);
        }
      }
      
      // Check color properties
      const requiredColors = ['primary', 'secondary', 'background', 'surface', 'text', 'textSecondary'];
      for (const color of requiredColors) {
        if (!(color in theme.colors)) {
          errors.push(`Missing required color: ${color}`);
        }
      }
      
      return errors;
    } catch (error) {
      return [`Theme structure validation failed: ${error}`];
    }
  }

  private validatePerformanceImpact(theme: Theme): string[] {
    const errors: string[] = [];
    
    try {
      // Check if theme switch would cause performance issues
      const estimatedMemoryUsage = this.estimateThemeMemoryUsage(theme);
      if (estimatedMemoryUsage > 10 * 1024 * 1024) { // 10MB limit
        errors.push(`Theme memory usage (${(estimatedMemoryUsage / 1024 / 1024).toFixed(2)}MB) exceeds limit (10MB)`);
      }
      
      return errors;
    } catch (error) {
      return [`Performance validation failed: ${error}`];
    }
  }

  private calculateContrastRatio(color1: string, color2: string): number {
    try {
      // Convert hex to RGB
      const rgb1 = this.hexToRgb(color1);
      const rgb2 = this.hexToRgb(color2);
      
      // Calculate relative luminance
      const luminance1 = this.calculateRelativeLuminance(rgb1);
      const luminance2 = this.calculateRelativeLuminance(rgb2);
      
      // Calculate contrast ratio
      const lighter = Math.max(luminance1, luminance2);
      const darker = Math.min(luminance1, luminance2);
      
      return (lighter + 0.05) / (darker + 0.05);
    } catch (error) {
      console.warn('Contrast ratio calculation failed:', error);
      return 1; // Default to low contrast
    }
  }

  private hexToRgb(hex: string): { r: number; g: number; b: number } {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16),
    } : { r: 0, g: 0, b: 0 };
  }

  private calculateRelativeLuminance(rgb: { r: number; g: number; b: number }): number {
    const { r, g, b } = rgb;
    const [rs, gs, bs] = [r / 255, g / 255, b / 255].map(c => {
      if (c <= 0.03928) {
        return c / 12.92;
      }
      return Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  }

  private checkColorblindAccessibility(colors: ThemeColors): string[] {
    const errors: string[] = [];
    
    try {
      // Check for red-green colorblind issues
      const redGreenIssues = this.checkRedGreenColorblindIssues(colors);
      errors.push(...redGreenIssues);
      
      return errors;
    } catch (error) {
      return [`Colorblind accessibility check failed: ${error}`];
    }
  }

  private checkRedGreenColorblindIssues(colors: ThemeColors): string[] {
    const errors: string[] = [];
    
    try {
      // Simplified check for red-green colorblind issues
      const redGreenPairs = [
        [colors.error, colors.success],
        [colors.primary, colors.secondary],
      ];
      
      for (const [color1, color2] of redGreenPairs) {
        const contrast = this.calculateContrastRatio(color1, color2);
        if (contrast < 2.0) {
          errors.push(`Red-green colorblind accessibility issue: colors too similar (contrast: ${contrast.toFixed(2)})`);
        }
      }
      
      return errors;
    } catch (error) {
      return [`Red-green colorblind check failed: ${error}`];
    }
  }

  private async performThemeSwitch(theme: Theme): Promise<void> {
    try {
      // Update current theme
      this.state.current = theme;
      this.state.lastUpdated = Date.now();
      this.state.validationStatus = 'valid';
      
      // Save theme to storage
      await AsyncStorage.setItem(THEME_STORAGE_KEY, theme.id);
      
      // Cache theme
      this.themeCache.set(theme.id, theme);
    } catch (error) {
      console.error('Theme switch failed:', error);
      throw error;
    }
  }

  private calculatePerformanceImpact(duration: number): number {
    // Calculate performance impact as percentage of acceptable threshold
    const acceptableThreshold = 1000; // 1 second
    return Math.min((duration / acceptableThreshold) * 100, 100);
  }

  private estimateThemeMemoryUsage(theme: Theme): number {
    // Estimate memory usage based on theme complexity
    const baseUsage = 1024 * 1024; // 1MB base
    const colorUsage = Object.keys(theme.colors).length * 1024; // 1KB per color
    const spacingUsage = Object.keys(theme.spacing).length * 512; // 512B per spacing
    const typographyUsage = Object.keys(theme.typography.fontSize).length * 512; // 512B per font size
    
    return baseUsage + colorUsage + spacingUsage + typographyUsage;
  }

  private getCurrentMemoryUsage(): number {
    // Simplified memory usage estimation
    return this.themeCache.size * 1024; // 1KB per cached theme
  }

  private clearTimeouts(): void {
    if (this.switchTimeoutRef) {
      clearTimeout(this.switchTimeoutRef);
      this.switchTimeoutRef = null;
    }
    if (this.validationTimeoutRef) {
      clearTimeout(this.validationTimeoutRef);
      this.validationTimeoutRef = null;
    }
  }

  private notifyListeners(currentTheme: Theme): void {
    this.listeners.forEach(listener => {
      try {
        listener(currentTheme);
      } catch (error) {
        console.warn('Theme listener error:', error);
      }
    });
  }

  public addListener(listener: (theme: Theme) => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  public getState(): ThemeState {
    return { ...this.state };
  }

  public getCurrentTheme(): Theme {
    return this.state.current;
  }

  public getAvailableThemes(): Theme[] {
    return [...this.state.available];
  }

  private async loadSavedTheme(): Promise<Theme | null> {
    try {
      const savedThemeId = await AsyncStorage.getItem(THEME_STORAGE_KEY);
      if (savedThemeId) {
        return this.state.available.find(savedTheme => savedTheme.id === savedThemeId) || null;
      }
      return null;
    } catch (error) {
      console.warn('Failed to load saved theme:', error);
      return null;
    }
  }

  private getSystemTheme(): Theme {
    const colorScheme = Appearance.getColorScheme();
    return colorScheme === 'dark' ? this.getDarkTheme() : this.getLightTheme();
  }

  private getDefaultTheme(): Theme {
    return this.getLightTheme();
  }

  private getLightTheme(): Theme {
    return {
      id: 'light',
      name: 'Light Theme',
      mode: 'light',
      variant: 'default',
      colors: {
        primary: '#007AFF',
        secondary: '#5856D6',
        background: '#FFFFFF',
        surface: '#F2F2F7',
        text: '#000000',
        textSecondary: '#8E8E93',
        border: '#C6C6C8',
        error: '#FF3B30',
        warning: '#FF9500',
        success: '#34C759',
        info: '#007AFF',
      },
      spacing: {
        xs: 4,
        sm: 8,
        md: 16,
        lg: 24,
        xl: 32,
        xxl: 48,
      },
      typography: {
        fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
        fontSize: {
          xs: 12,
          sm: 14,
          md: 16,
          lg: 18,
          xl: 20,
          xxl: 24,
        },
        fontWeight: {
          light: '300',
          normal: '400',
          medium: '500',
          bold: '700',
        },
        lineHeight: {
          tight: 1.2,
          normal: 1.5,
          relaxed: 1.8,
        },
      },
      borderRadius: 8,
      shadow: {
        small: '0 1px 3px rgba(0,0,0,0.12)',
        medium: '0 4px 6px rgba(0,0,0,0.1)',
        large: '0 10px 15px rgba(0,0,0,0.1)',
      },
      animation: {
        duration: {
          fast: 150,
          normal: 300,
          slow: 500,
        },
        easing: {
          ease: 'ease',
          easeIn: 'ease-in',
          easeOut: 'ease-out',
          easeInOut: 'ease-in-out',
        },
      },
    };
  }

  private getDarkTheme(): Theme {
    return {
      id: 'dark',
      name: 'Dark Theme',
      mode: 'dark',
      variant: 'default',
      colors: {
        primary: '#0A84FF',
        secondary: '#5E5CE6',
        background: '#000000',
        surface: '#1C1C1E',
        text: '#FFFFFF',
        textSecondary: '#8E8E93',
        border: '#38383A',
        error: '#FF453A',
        warning: '#FF9F0A',
        success: '#30D158',
        info: '#0A84FF',
      },
      spacing: {
        xs: 4,
        sm: 8,
        md: 16,
        lg: 24,
        xl: 32,
        xxl: 48,
      },
      typography: {
        fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
        fontSize: {
          xs: 12,
          sm: 14,
          md: 16,
          lg: 18,
          xl: 20,
          xxl: 24,
        },
        fontWeight: {
          light: '300',
          normal: '400',
          medium: '500',
          bold: '700',
        },
        lineHeight: {
          tight: 1.2,
          normal: 1.5,
          relaxed: 1.8,
        },
      },
      borderRadius: 8,
      shadow: {
        small: '0 1px 3px rgba(255,255,255,0.12)',
        medium: '0 4px 6px rgba(255,255,255,0.1)',
        large: '0 10px 15px rgba(255,255,255,0.1)',
      },
      animation: {
        duration: {
          fast: 150,
          normal: 300,
          slow: 500,
        },
        easing: {
          ease: 'ease',
          easeIn: 'ease-in',
          easeOut: 'ease-out',
          easeInOut: 'ease-in-out',
        },
      },
    };
  }

  public destroy(): void {
    this.clearTimeouts();
    this.listeners.clear();
    this.themeCache.clear();
  }
} 