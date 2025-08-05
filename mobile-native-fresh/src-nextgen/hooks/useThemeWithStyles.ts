import { useMemo } from 'react';
import { useTheme } from '../theme/ThemeProvider';
import { createThemeStyles, ThemeStyleFactory } from '../utils/themeStyles';
import type { Theme } from '../theme/ThemeProvider';

// Hook that provides both theme and pre-computed styles
export const useThemeWithStyles = (): {
  theme: Theme;
  styles: ReturnType<typeof createThemeStyles>;
  styleFactory: ThemeStyleFactory;
} => {
  const theme = useTheme();
  
  const styles = useMemo(() => createThemeStyles(theme), [theme]);
  const styleFactory = useMemo(() => new ThemeStyleFactory(theme), [theme]);

  return {
    theme,
    styles,
    styleFactory,
  };
};

// Hook for dynamic theme-based styling
export const useThemeStyle = (): {
  theme: Theme;
  createStyle: ThemeStyleFactory;
  getColor: (colorKey: keyof Theme['colors']) => Theme['colors'][keyof Theme['colors']];
  getSpacing: (size: keyof Theme['spacing']) => Theme['spacing'][keyof Theme['spacing']];
  getFontSize: (size: keyof Theme['fontSize']) => Theme['fontSize'][keyof Theme['fontSize']];
  getFontWeight: (weight: keyof Theme['fontWeight']) => Theme['fontWeight'][keyof Theme['fontWeight']];
  getBorderRadius: (size: keyof Theme['borderRadius']) => Theme['borderRadius'][keyof Theme['borderRadius']];
} => {
  const theme = useTheme();
  
  const styleFactory = useMemo(() => new ThemeStyleFactory(theme), [theme]);

  return {
    theme,
    createStyle: styleFactory,
    getColor: (colorKey: keyof Theme['colors']) => theme.colors[colorKey],
    getSpacing: (size: keyof Theme['spacing']) => theme.spacing[size],
    getFontSize: (size: keyof Theme['fontSize']) => theme.fontSize[size],
    getFontWeight: (weight: keyof Theme['fontWeight']) => theme.fontWeight[weight],
    getBorderRadius: (size: keyof Theme['borderRadius']) => theme.borderRadius[size],
  };
};

// Hook for theme-aware component styling
export const useComponentTheme = (_componentName: string): {
  theme: Theme;
  styles: Record<string, unknown>;
} => {
  const theme = useTheme();
  
  const componentStyles = useMemo(() => {
    const factory = new ThemeStyleFactory(theme);
    
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
  colors: Theme['colors'];
  getColor: (colorKey: keyof Theme['colors']) => Theme['colors'][keyof Theme['colors']];
  isDark: boolean;
} => {
  const theme = useTheme();
  
  return {
    colors: theme.colors,
    getColor: (colorKey: keyof Theme['colors']) => theme.colors[colorKey],
    isDark: theme.colors.background === '#000000', // Simple dark mode detection
  };
};

// Type-safe theme spacing hook
export const useThemeSpacing = (): {
  spacing: Theme['spacing'];
  getSpacing: (size: keyof Theme['spacing']) => Theme['spacing'][keyof Theme['spacing']];
} => {
  const theme = useTheme();
  
  return {
    spacing: theme.spacing,
    getSpacing: (size: keyof Theme['spacing']) => theme.spacing[size],
  };
};

// Type-safe theme typography hook
export const useThemeTypography = (): {
  typography: Theme['typography'];
  fontSize: Theme['fontSize'];
  fontWeight: Theme['fontWeight'];
  getTypography: (variant: keyof Theme['typography']) => Theme['typography'][keyof Theme['typography']];
  getFontSize: (size: keyof Theme['fontSize']) => Theme['fontSize'][keyof Theme['fontSize']];
  getFontWeight: (weight: keyof Theme['fontWeight']) => Theme['fontWeight'][keyof Theme['fontWeight']];
} => {
  const theme = useTheme();
  
  return {
    typography: theme.typography,
    fontSize: theme.fontSize,
    fontWeight: theme.fontWeight,
    getTypography: (variant: keyof Theme['typography']) => theme.typography[variant],
    getFontSize: (size: keyof Theme['fontSize']) => theme.fontSize[size],
    getFontWeight: (weight: keyof Theme['fontWeight']) => theme.fontWeight[weight],
  };
}; 