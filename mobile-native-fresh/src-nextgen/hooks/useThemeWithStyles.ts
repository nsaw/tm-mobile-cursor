import { useState, useCallback } from 'react';
import { ThemeColors } from '../types/theme';
import { createThemeStyles, ThemeStyles } from '../utils/themeStyles';

export interface ThemeState {
  theme: 'light' | 'dark';
  colors: ThemeColors;
  styles: ThemeStyles;
}

export function useThemeWithStyles(): ThemeState {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const colors: ThemeColors = theme === 'light' ? {
    background: '#FFFFFF',
    surface: '#F8F9FA',
    text: '#1A1A1A',
    textSecondary: '#6C757D',
    primary: '#007AFF',
    error: '#DC3545',
    border: '#DEE2E6',
    warning: '#FFC107',
  } : {
    background: '#1A1A1A',
    surface: '#2D2D2D',
    text: '#FFFFFF',
    textSecondary: '#B0B0B0',
    primary: '#0A84FF',
    error: '#FF453A',
    border: '#404040',
    warning: '#FFD60A',
  };

  const styles = createThemeStyles(colors);

  return {
    theme,
    colors,
    styles,
  };
} 