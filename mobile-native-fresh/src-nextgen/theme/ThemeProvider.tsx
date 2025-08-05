import React, { createContext, useContext, useState, ReactNode } from 'react';
import { DesignTokens } from '../types/designTokens';
import { lightDesignTokens, darkDesignTokens } from './designTokens';

// Define proper font weight types compatible with React Native
export type FontWeight = 
  | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900'
  | 'normal' | 'bold'
  | 'ultralight' | 'thin' | 'light' | 'medium' | 'semibold' | 'heavy' | 'black';

// Define typography element types
export interface TypographyElement {
  fontSize: number;
  fontWeight: FontWeight;
  lineHeight?: number;
}

// Define theme colors interface
export interface ThemeColors {
  primary: string;
  secondary: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  textMuted: string;
  border: string;
  error: string;
  success: string;
  warning: string;
  accent: string;
  onAccent: string;
  onSurface: string;
  onSurfaceVariant: string;
  onBackground: string;
  onPrimary: string;
  outline: string;
}

// Define theme spacing interface
export interface ThemeSpacing {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
}

// Define theme border radius interface
export interface ThemeBorderRadius {
  sm: number;
  md: number;
  lg: number;
}

// Define theme typography interface
export interface ThemeTypography {
  h1: TypographyElement;
  h2: TypographyElement;
  h3: TypographyElement;
  body: TypographyElement;
  caption: TypographyElement;
  // Remove duplicate fontSize and fontWeight properties
}

// Define theme font sizes interface
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

// Define theme font weights interface
export interface ThemeFontWeights {
  light: FontWeight;
  normal: FontWeight;
  medium: FontWeight;
  semibold: FontWeight;
  bold: FontWeight;
}

// Define theme styles interface compatible with React Native
export interface ThemeStyles {
  [key: string]: Record<string, unknown>; // React Native styles are more flexible
}

// Define theme tokens interface
export interface ThemeTokens {
  [key: string]: string | number | boolean | Record<string, unknown>;
}

// Main Theme interface
export interface Theme {
  designTokens: DesignTokens;
  colors: ThemeColors;
  spacing: ThemeSpacing;
  borderRadius: ThemeBorderRadius;
  typography: ThemeTypography;
  fontSize: ThemeFontSizes;
  fontWeight: ThemeFontWeights;
  styles: ThemeStyles;
}

const lightTheme: Theme = {
  colors: {
    primary: '#007AFF',
    secondary: '#5856D6',
    background: '#FFFFFF',
    surface: '#F2F2F7',
    text: '#000000',
    textSecondary: '#8E8E93',
    textMuted: '#8E8E93',
    border: '#C6C6C8',
    error: '#FF3B30',
    success: '#34C759',
    warning: '#FF9500',
    accent: '#007AFF',
    onAccent: '#FFFFFF',
    onSurface: '#000000',
    onSurfaceVariant: '#8E8E93',
    onBackground: '#000000',
    onPrimary: '#FFFFFF',
    outline: '#C6C6C8',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
  },
  typography: {
    h1: { fontSize: 32, fontWeight: 'bold' },
    h2: { fontSize: 24, fontWeight: 'semibold' },
    h3: { fontSize: 20, fontWeight: 'semibold' },
    body: { fontSize: 16, fontWeight: 'normal' },
    caption: { fontSize: 14, fontWeight: 'normal' },
  },
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    h1: 32,
    h2: 24,
    h3: 20,
    body: 16,
    caption: 14,
  },
  fontWeight: {
    light: 'light',
    normal: 'normal',
    medium: 'medium',
    semibold: 'semibold',
    bold: 'bold',
  },
  styles: {},
      designTokens: lightDesignTokens,
};

const darkTheme: Theme = {
  ...lightTheme,
  designTokens: darkDesignTokens,
  colors: {
    primary: '#0A84FF',
    secondary: '#5E5CE6',
    background: '#000000',
    surface: '#1C1C1E',
    text: '#FFFFFF',
    textSecondary: '#8E8E93',
    textMuted: '#8E8E93',
    border: '#38383A',
    error: '#FF453A',
    success: '#30D158',
    warning: '#FF9F0A',
    accent: '#0A84FF',
    onAccent: '#FFFFFF',
    onSurface: '#FFFFFF',
    onSurfaceVariant: '#8E8E93',
    onBackground: '#FFFFFF',
    onPrimary: '#000000',
    outline: '#38383A',
  },
};

interface ThemeContextType {
  theme: Theme;
  isDark: boolean;
  toggleTheme: () => void;
  designTokens: Theme['designTokens'];
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }): React.JSX.Element {
  const [isDark, setIsDark] = useState(false);
  const theme = isDark ? darkTheme : lightTheme;

  const toggleTheme = (): void => {
    setIsDark(!isDark);
  };

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme, designTokens: theme.designTokens }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): Theme {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context.theme;
} 