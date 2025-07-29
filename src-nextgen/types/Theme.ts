export interface ColorPalette {
  primary: string;
  primaryHighContrast?: string;
  secondary: string;
  secondaryHighContrast?: string;
  accent: string;
  success: string;
  warning: string;
  error: string;
  info: string;
  text: string;
  textHighContrast?: string;
  textSecondary: string;
  textTertiary: string;
  background: string;
  backgroundHighContrast?: string;
  backgroundSecondary: string;
  backgroundTertiary: string;
  border: string;
  borderSecondary: string;
  shadow: string;
  overlay: string;
}

export interface Typography {
  fontFamily: {
    regular: string;
    medium: string;
    semibold: string;
    bold: string;
    monospace: string;
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
    normal: string;
    medium: string;
    semibold: string;
    bold: string;
  };
}

export interface Spacing {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  '2xl': number;
  '3xl': number;
  '4xl': number;
}

export interface BorderRadius {
  none: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  full: number;
}

export interface Shadows {
  sm: {
    shadowColor: string;
    shadowOffset: { width: number; height: number };
    shadowOpacity: number;
    shadowRadius: number;
    elevation: number;
  };
  md: {
    shadowColor: string;
    shadowOffset: { width: number; height: number };
    shadowOpacity: number;
    shadowRadius: number;
    elevation: number;
  };
  lg: {
    shadowColor: string;
    shadowOffset: { width: number; height: number };
    shadowOpacity: number;
    shadowRadius: number;
    elevation: number;
  };
}

export interface Theme {
  colors: ColorPalette;
  typography: Typography;
  spacing: Spacing;
  borderRadius: BorderRadius;
  shadows: Shadows;
  name: string;
}

export interface ThemeContextType {
  theme: Theme;
  themeMode: 'light' | 'dark' | 'system';
  toggleTheme: () => void;
  setTheme: (mode: 'light' | 'dark' | 'system') => void;
  isDark: boolean;
  isLight: boolean;
}

export interface ThemeHook {
  theme: Theme;
  themeMode: 'light' | 'dark' | 'system';
  toggleTheme: () => void;
  setTheme: (mode: 'light' | 'dark' | 'system') => void;
  isDark: boolean;
  isLight: boolean;
}

export interface ThemeValidator {
  validate: (theme: Theme) => boolean;
  errors: string[];
  warnings: string[];
}

export interface ThemeRenderer {
  render: (theme: Theme) => any;
  shouldUpdate: (prevTheme: Theme, nextTheme: Theme) => boolean;
} 