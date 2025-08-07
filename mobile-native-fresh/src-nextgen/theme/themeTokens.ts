/**
 * Theme Tokens
 * 
 * Provides light and dark theme tokens for the application.
 * These tokens are used by the ThemeProvider to provide consistent theming.
 */

// Light Theme Tokens
export const lightThemeTokens = {
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
};

// Dark Theme Tokens
export const darkThemeTokens = {
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
};

// Export theme tokens object
export const themeTokens = {
  light: lightThemeTokens,
  dark: darkThemeTokens,
};

export default themeTokens; 