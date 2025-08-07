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
  light: string;
  normal: string;
  medium: string;
  semibold: string;
  bold: string;
}

export interface ThemeBorderRadius {
  sm: number;
  md: number;
  lg: number;
}

export interface ThemeTypography {
  h1: {
    fontSize: number;
    fontWeight: string;
  };
  h2: {
    fontSize: number;
    fontWeight: string;
  };
  h3: {
    fontSize: number;
    fontWeight: string;
  };
  body: {
    fontSize: number;
    fontWeight: string;
  };
  caption: {
    fontSize: number;
    fontWeight: string;
  };
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