// Re-export theme types from the main ThemeProvider
export type { 
  Theme, 
  ThemeColors, 
  ThemeSpacing, 
  ThemeBorderRadius, 
  ThemeTypography, 
  ThemeFontSizes, 
  ThemeFontWeights, 
  ThemeStyles, 
  ThemeTokens,
  TypographyElement,
  FontWeight 
} from '../theme/ThemeProvider';

// Legacy interface for backward compatibility
export interface LegacyThemeColors {
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  primary: string;
  error: string;
  border: string;
  warning?: string;
}

export interface LegacyTheme {
  colors: LegacyThemeColors;
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
  borderRadius: {
    sm: number;
    md: number;
    lg: number;
  };
} 
