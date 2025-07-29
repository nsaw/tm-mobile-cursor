import React from 'react';
import { TextStyle, ViewStyle } from 'react-native';

import { useTheme } from '../theme/ThemeProvider';

export interface StyleConfig {
  colors?: Partial<TextStyle>;
  spacing?: Partial<ViewStyle>;
  typography?: Partial<TextStyle>;
}

export const createStyles = <T extends Record<string, any>>(
  styleFactory: (theme: any) => T
): T => {
  // This will be used by components to create theme-aware styles
  return styleFactory({});
};

export const useStyles = <T extends Record<string, any>>(
  styleFactory: (theme: any) => T
): T => {
  const theme = useTheme();
  return React.useMemo(() => styleFactory(theme), [theme, styleFactory]);
};

export const getThemeColor = (colorKey: string, theme: any): string => {
  return theme.colors[colorKey] || theme.colors.text;
};

export const getThemeSpacing = (spacingKey: string, theme: any): number => {
  return theme.spacing[spacingKey] || 0;
};

export const getThemeTypography = (typographyKey: string, theme: any): TextStyle => {
  return theme.typography[typographyKey] || theme.typography.body;
}; 