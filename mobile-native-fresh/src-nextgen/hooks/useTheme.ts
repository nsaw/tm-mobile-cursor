import { useState } from 'react';

import { ThemeColors } from '../types/theme';

export interface ThemeState {
  theme: 'light' | 'dark';
  colors: ThemeColors;
}

export function useTheme(): ThemeState {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const colors: ThemeColors = theme === 'light' ? {
    background: '#FFFFFF',
    surface: '#F8F9FA',
    text: '#1A1A1A',
    textSecondary: '#6C757D',
    primary: '#007AFF',
    error: '#DC3545',
    border: '#DEE2E6',
  } : {
    background: '#1A1A1A',
    surface: '#2D2D2D',
    text: '#FFFFFF',
    textSecondary: '#B0B0B0',
    primary: '#0A84FF',
    error: '#FF453A',
    border: '#404040',
  };

  return {
    theme,
    colors,
  };
} 