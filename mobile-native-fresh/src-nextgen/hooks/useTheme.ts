import { useContext } from 'react';
import { ThemeContext, Theme } from '../theme/ThemeProvider';

export const useTheme = (): Theme => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context.theme;
}; 