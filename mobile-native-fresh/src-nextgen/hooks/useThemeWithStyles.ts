import { useMemo } from 'react';
import { useTheme } from '../theme/ThemeProvider';
import { createThemeStyles, ThemeStyleFactory } from '../utils/themeStyles';
import type { ThemeContextType } from '../theme/ThemeProvider';

// Hook that provides both theme and pre-computed styles
export const useThemeWithStyles = (): {
  theme: ThemeContextType;
  styles: ReturnType<typeof createThemeStyles>;
  styleFactory: ThemeStyleFactory;
} => {
  const theme = useTheme();
  
  const styles = useMemo(() => createThemeStyles(theme.tokens), [theme.tokens]);
  const styleFactory = useMemo(() => new ThemeStyleFactory(theme.tokens), [theme.tokens]);

  return {
    theme,
    styles,
    styleFactory,
  };
};

// Hook for dynamic theme-based styling
export const useThemeStyle = (): {
  theme: ThemeContextType;
  createStyle: ThemeStyleFactory;
  getColor: (colorKey: keyof ThemeContextType['colors']) => ThemeContextType['colors'][keyof ThemeContextType['colors']];
  getSpacing: (size: keyof ThemeContextType['spacing']) => ThemeContextType['spacing'][keyof ThemeContextType['spacing']];
  getFontSize: (size: keyof ThemeContextType['fontSize']) => ThemeContextType['fontSize'][keyof ThemeContextType['fontSize']];
  getFontWeight: (weight: keyof ThemeContextType['fontWeight']) => ThemeContextType['fontWeight'][keyof ThemeContextType['fontWeight']];
  getBorderRadius: (size: keyof ThemeContextType['borderRadius']) => ThemeContextType['borderRadius'][keyof ThemeContextType['borderRadius']];
} => {
  const theme = useTheme();
  
  const styleFactory = useMemo(() => new ThemeStyleFactory(theme.tokens), [theme.tokens]);

  return {
    theme,
    createStyle: styleFactory,
    getColor: (colorKey: keyof ThemeContextType['colors']) => theme.colors[colorKey],
    getSpacing: (size: keyof ThemeContextType['spacing']) => theme.spacing[size],
    getFontSize: (size: keyof ThemeContextType['fontSize']) => theme.fontSize[size],
    getFontWeight: (weight: keyof ThemeContextType['fontWeight']) => theme.fontWeight[weight],
    getBorderRadius: (size: keyof ThemeContextType['borderRadius']) => theme.borderRadius[size],
  };
};

// Hook for theme-aware component styling
export const useComponentTheme = (_componentName: string): {
  theme: ThemeContextType;
  styles: Record<string, unknown>;
} => {
  const theme = useTheme();
  
  const componentStyles = useMemo(() => {
    const factory = new ThemeStyleFactory(theme.tokens);
    
    return {
      // Common component styles
      container: factory.createContainerStyle(),
      text: factory.createTextStyle('body'),
      title: factory.createTextStyle('h1'),
      subtitle: factory.createTextStyle('h2'),
      caption: factory.createTextStyle('caption'),
      
      // Interactive elements
      button: factory.createButtonStyle('primary'),
      buttonSecondary: factory.createButtonStyle('secondary'),
      buttonOutline: factory.createButtonStyle('outline'),
      
      // Form elements
      input: {
        ...factory.createSpacingStyle('md'),
        ...factory.createBorderRadiusStyle('sm'),
        borderWidth: 1,
        borderColor: theme.colors.border,
        color: theme.colors.text,
        backgroundColor: theme.colors.surface,
      },
      
      // Status indicators
      success: { color: theme.colors.success },
      error: { color: theme.colors.error },
      warning: { color: theme.colors.warning },
      
      // Layout helpers
      row: { flexDirection: 'row' as const },
      column: { flexDirection: 'column' as const },
      center: { justifyContent: 'center' as const, alignItems: 'center' as const },
      spaceBetween: { justifyContent: 'space-between' as const },
      spaceAround: { justifyContent: 'space-around' as const },
    };
  }, [theme]);

  return {
    theme,
    styles: componentStyles,
  };
};

// Type-safe theme color hook
export const useThemeColor = (): {
  colors: ThemeContextType['colors'];
  getColor: (colorKey: keyof ThemeContextType['colors']) => string;
  isDark: boolean;
} => {
  const theme = useTheme();
  
  return {
    colors: theme.colors,
    getColor: (colorKey: keyof ThemeContextType['colors']) => theme.colors[colorKey],
    isDark: theme.colors.background === '#000000', // Simple dark mode detection
  };
};

// Type-safe theme spacing hook
export const useThemeSpacing = (): {
  spacing: ThemeContextType['spacing'];
  getSpacing: (size: keyof ThemeContextType['spacing']) => ThemeContextType['spacing'][keyof ThemeContextType['spacing']];
} => {
  const theme = useTheme();
  
  return {
    spacing: theme.spacing,
    getSpacing: (size: keyof ThemeContextType['spacing']) => theme.spacing[size],
  };
};

// Type-safe theme typography hook
export const useThemeTypography = (): {
  typography: ThemeContextType['typography'];
  fontSize: ThemeContextType['fontSize'];
  fontWeight: ThemeContextType['fontWeight'];
  getTypography: (variant: keyof ThemeContextType['typography']) => ThemeContextType['typography'][keyof ThemeContextType['typography']];
  getFontSize: (size: keyof ThemeContextType['fontSize']) => ThemeContextType['fontSize'][keyof ThemeContextType['fontSize']];
  getFontWeight: (weight: keyof ThemeContextType['fontWeight']) => ThemeContextType['fontWeight'][keyof ThemeContextType['fontWeight']];
} => {
  const theme = useTheme();
  
  return {
    typography: theme.typography,
    fontSize: theme.fontSize,
    fontWeight: theme.fontWeight,
    getTypography: (variant: keyof ThemeContextType['typography']) => theme.typography[variant],
    getFontSize: (size: keyof ThemeContextType['fontSize']) => theme.fontSize[size],
    getFontWeight: (weight: keyof ThemeContextType['fontWeight']) => theme.fontWeight[weight],
  };
}; 