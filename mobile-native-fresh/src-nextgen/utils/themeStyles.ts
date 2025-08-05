import { StyleSheet } from 'react-native';
import type { Theme, TypographyElement, FontWeight } from '../theme/ThemeProvider';

// Type-safe theme style utilities
export interface ThemeStyleUtils {
  createTypographyStyle: (element: TypographyElement) => {
    fontSize: number;
    fontWeight: FontWeight;
    lineHeight?: number;
  };
  createSpacingStyle: (size: keyof Theme['spacing']) => { margin: number; padding: number };
  createColorStyle: (colorKey: keyof Theme['colors']) => { color: string; backgroundColor?: string };
  createBorderRadiusStyle: (size: keyof Theme['borderRadius']) => { borderRadius: number };
}

// Theme style factory
export class ThemeStyleFactory {
  private theme: Theme;

  constructor(theme: Theme) {
    this.theme = theme;
  }

  // Create typography styles
  createTypographyStyle(element: TypographyElement): {
    fontSize: number;
    fontWeight: FontWeight;
    lineHeight?: number;
  } {
    return {
      fontSize: element.fontSize,
      fontWeight: element.fontWeight,
      lineHeight: element.lineHeight,
    };
  }

  // Create spacing styles
  createSpacingStyle(size: keyof Theme['spacing']): { margin: number; padding: number } {
    const spacingValue = this.theme.spacing[size];
    return {
      margin: spacingValue,
      padding: spacingValue,
    };
  }

  // Create color styles
  createColorStyle(colorKey: keyof Theme['colors']): { color: string } {
    const colorValue = this.theme.colors[colorKey];
    return {
      color: colorValue,
    };
  }

  // Create background color styles
  createBackgroundColorStyle(colorKey: keyof Theme['colors']): { backgroundColor: string } {
    const colorValue = this.theme.colors[colorKey];
    return {
      backgroundColor: colorValue,
    };
  }

  // Create border radius styles
  createBorderRadiusStyle(size: keyof Theme['borderRadius']): { borderRadius: number } {
    const radiusValue = this.theme.borderRadius[size];
    return {
      borderRadius: radiusValue,
    };
  }

  // Create complete style objects
  createTextStyle(variant: keyof Theme['typography']): {
    fontSize: number;
    fontWeight: FontWeight;
    lineHeight?: number;
    color: string;
  } {
    const typographyElement = this.theme.typography[variant];
    return {
      ...this.createTypographyStyle(typographyElement),
      color: this.theme.colors.text,
    };
  }

  createContainerStyle(): {
    margin: number;
    padding: number;
    backgroundColor: string;
    borderRadius: number;
  } {
    return {
      ...this.createSpacingStyle('md'),
      ...this.createBackgroundColorStyle('surface'),
      ...this.createBorderRadiusStyle('md'),
    };
  }

  createButtonStyle(variant: 'primary' | 'secondary' | 'outline' = 'primary'): {
    margin: number;
    padding: number;
    borderRadius: number;
    backgroundColor?: string;
    color?: string;
    borderWidth?: number;
    borderColor?: string;
  } {
    const baseStyle = {
      ...this.createSpacingStyle('md'),
      ...this.createBorderRadiusStyle('md'),
    };

    switch (variant) {
      case 'primary':
        return {
          ...baseStyle,
          ...this.createBackgroundColorStyle('primary'),
          ...this.createColorStyle('onPrimary'),
        };
      case 'secondary':
        return {
          ...baseStyle,
          ...this.createBackgroundColorStyle('secondary'),
          ...this.createColorStyle('onPrimary'),
        };
      case 'outline':
        return {
          ...baseStyle,
          borderWidth: 1,
          borderColor: this.theme.colors.border,
          ...this.createColorStyle('text'),
        };
      default:
        return baseStyle;
    }
  }
}

// Hook for using theme styles
export const useThemeStyles = (theme: Theme): ThemeStyleFactory => {
  return new ThemeStyleFactory(theme);
};

// Predefined style patterns
export const createThemeStyles = (theme: Theme): ReturnType<typeof StyleSheet.create> => {
  const factory = new ThemeStyleFactory(theme);

  return StyleSheet.create({
    // Typography styles
    h1: factory.createTextStyle('h1'),
    h2: factory.createTextStyle('h2'),
    h3: factory.createTextStyle('h3'),
    body: factory.createTextStyle('body'),
    caption: factory.createTextStyle('caption'),

    // Container styles
    container: factory.createContainerStyle(),
    card: {
      ...factory.createContainerStyle(),
      ...factory.createBackgroundColorStyle('surface'),
      shadowColor: theme.colors.text,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },

    // Button styles
    buttonPrimary: factory.createButtonStyle('primary'),
    buttonSecondary: factory.createButtonStyle('secondary'),
    buttonOutline: factory.createButtonStyle('outline'),

    // Input styles
    input: {
      ...factory.createSpacingStyle('md'),
      ...factory.createBorderRadiusStyle('sm'),
      borderWidth: 1,
      borderColor: theme.colors.border,
      ...factory.createColorStyle('text'),
      ...factory.createBackgroundColorStyle('surface'),
    },

    // Status styles
    success: {
      ...factory.createColorStyle('success'),
    },
    error: {
      ...factory.createColorStyle('error'),
    },
    warning: {
      ...factory.createColorStyle('warning'),
    },
  });
};

// Type-safe theme style helpers
export const getThemeColor = (theme: Theme, colorKey: keyof Theme['colors']): string => {
  return theme.colors[colorKey];
};

export const getThemeSpacing = (theme: Theme, size: keyof Theme['spacing']): number => {
  return theme.spacing[size];
};

export const getThemeFontSize = (theme: Theme, size: keyof Theme['fontSize']): number => {
  return theme.fontSize[size];
};

export const getThemeFontWeight = (theme: Theme, weight: keyof Theme['fontWeight']): FontWeight => {
  return theme.fontWeight[weight];
}; 