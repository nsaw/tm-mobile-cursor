import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useThemeStore } from '../state/stores/themeStore';
import { themeTokens } from './themeTokens';

// Theme Types
export interface ThemeColors {
  primary: string;
  secondary: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  textMuted: string;
  border: string;
  accent: string;
  error: string;
  success: string;
  warning: string;
  onPrimary: string;
  onAccent: string;
  onSurface: string;
  onSurfaceVariant: string;
  onBackground: string;
  outline: string;
  // Add missing properties
  danger: string;
  backgroundSecondary: string;
  divider: string;
}

export interface ThemeSpacing {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
}

export interface ThemeFontSizes {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  h1: number;
  h2: number;
  h3: number;
  body: number;
  caption: number;
}

export interface ThemeFontWeights {
  light: '300';
  normal: '400';
  medium: '500';
  semibold: '600';
  bold: '700';
}

export interface ThemeBorderRadius {
  sm: number;
  md: number;
  lg: number;
}

// Add missing radius interface
export interface ThemeRadius {
  sm: number;
  md: number;
  lg: number;
  full: number;
}

// Add missing zIndex interface
export interface ThemeZIndex {
  modal: number;
  tooltip: number;
}

export interface ThemeTypography {
  h1: {
    fontSize: number;
    fontWeight: '700';
  };
  h2: {
    fontSize: number;
    fontWeight: '600';
  };
  h3: {
    fontSize: number;
    fontWeight: '600';
  };
  body: {
    fontSize: number;
    fontWeight: '400';
  };
  caption: {
    fontSize: number;
    fontWeight: '400';
  };
  // Add missing fontSize property
  fontSize: ThemeFontSizes;
}

export interface ThemeStyles {
  [key: string]: Record<string, unknown>;
}

export interface ThemeTokens {
  colors: ThemeColors;
  spacing: ThemeSpacing;
  fontSize: ThemeFontSizes;
  fontWeight: ThemeFontWeights;
  borderRadius: ThemeBorderRadius;
  radius: ThemeRadius;
  zIndex: ThemeZIndex;
  typography: ThemeTypography;
  styles: ThemeStyles;
}

// Export Theme as an alias for ThemeTokens for backward compatibility
export type Theme = ThemeTokens;

export type TypographyElement = 'h1' | 'h2' | 'h3' | 'body' | 'caption';
export type FontWeight = 'light' | 'normal' | 'medium' | 'semibold' | 'bold';

// Theme Context Interface - this is what components will receive from useTheme()
export interface ThemeContextType {
  colors: ThemeColors;
  spacing: ThemeSpacing;
  fontSize: ThemeFontSizes;
  fontWeight: ThemeFontWeights;
  borderRadius: ThemeBorderRadius;
  typography: ThemeTypography;
  styles: ThemeStyles;
  tokens: ThemeTokens; // Add missing tokens property
  buttonStyles: Record<string, unknown>; // Add missing buttonStyles property
  isDark: boolean;
  setTheme: (theme: 'light' | 'dark') => void;
  toggleTheme: () => void;
}

// Create Theme Context
export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Theme Provider Props
interface ThemeProviderProps {
  children: ReactNode;
  initialTheme?: 'light' | 'dark';
}

/**
 * Theme Provider Component
 * 
 * Provides theme context to the entire application with:
 * - Light/dark theme switching
 * - Theme persistence
 * - Zustand store integration
 * - Type-safe theme tokens
 */
export const ThemeProvider: React.FC<ThemeProviderProps> = ({ 
  children, 
  initialTheme = 'light' 
}) => {
  const themeStore = useThemeStore();
  const [currentTheme, setCurrentTheme] = useState<'light' | 'dark'>(initialTheme);

  // Initialize theme from store
  useEffect(() => {
    const storedTheme = themeStore.currentTheme.name;
    if (storedTheme === 'light' || storedTheme === 'dark') {
      setCurrentTheme(storedTheme);
    }
  }, [themeStore.currentTheme.name]);

  // Set theme function
  const setTheme = (theme: 'light' | 'dark'): void => {
    setCurrentTheme(theme);
    themeStore.setTheme(theme === 'dark' ? 'dark' : 'default');
  };

  // Toggle theme function
  const toggleTheme = (): void => {
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  };

  // Get theme object based on current theme
  const baseTheme = currentTheme === 'dark' ? themeTokens.dark : themeTokens.light;

  // Context value - this is what components will receive
  const contextValue: ThemeContextType = {
    colors: baseTheme.colors,
    spacing: baseTheme.spacing,
    fontSize: baseTheme.fontSize,
    fontWeight: baseTheme.fontWeight,
    borderRadius: baseTheme.borderRadius,
    typography: baseTheme.typography,
    styles: baseTheme.styles,
    tokens: {
      colors: baseTheme.colors,
      spacing: baseTheme.spacing,
      fontSize: baseTheme.fontSize,
      fontWeight: baseTheme.fontWeight,
      borderRadius: baseTheme.borderRadius,
      radius: baseTheme.radius,
      zIndex: baseTheme.zIndex,
      typography: baseTheme.typography,
      styles: baseTheme.styles,
    },
    buttonStyles: {}, // Placeholder for button styles, will be populated later
    isDark: currentTheme === 'dark',
    setTheme,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

/**
 * useTheme Hook
 * 
 * Custom hook to access theme context with proper error handling
 */
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  
  return context;
};

export default ThemeProvider; 