import { useContext } from 'react';
import { ThemeContext, ThemeContextType, FontWeight } from '../theme/ThemeProvider';

export { FontWeight };

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}; 