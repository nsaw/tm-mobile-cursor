import React, { createContext, useContext, useState, useEffect } from 'react';

import { designTokens, DesignTokens } from './tokens';
import { typographyTokens } from './typography';
import { buttonStyles } from './buttonStyles';
import { spacingTokens } from './spacing';
import { 
  getButtonVariants, 
  getCardVariants, 
  getInputVariants, 
  getTextVariants, 
  getBadgeVariants 
} from './variants';

interface ThemeContextType {
  tokens: DesignTokens;
  typography: typeof typographyTokens;
  buttonStyles: typeof buttonStyles;
  spacing: typeof spacingTokens;
  variants: {
    buttonVariants: ReturnType<typeof getButtonVariants>;
    cardVariants: ReturnType<typeof getCardVariants>;
    inputVariants: ReturnType<typeof getInputVariants>;
    textVariants: ReturnType<typeof getTextVariants>;
    badgeVariants: ReturnType<typeof getBadgeVariants>;
  };
  isFluidTheme: boolean;
  toggleTheme: () => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

interface ThemeProviderProps {
  children: React.ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [isFluidTheme, setIsFluidTheme] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true); // Default to dark mode

  useEffect(() => {
    // Load theme preferences from storage
    // TODO: Implement AsyncStorage for theme persistence
    const loadThemePreferences = async () => {
      // For now, default to dark mode
      setIsDarkMode(true);
      setIsFluidTheme(false);
    };

    loadThemePreferences();
  }, []);

  const toggleTheme = () => {
    const newMode = !isFluidTheme;
    setIsFluidTheme(newMode);
    // TODO: Save to AsyncStorage
  };

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    // TODO: Save to AsyncStorage
  };

  // Ensure designTokens is available before creating context
  const tokens = designTokens;

  const contextValue: ThemeContextType = {
    tokens,
    typography: typographyTokens,
    buttonStyles: buttonStyles,
    spacing: spacingTokens,
    variants: {
      buttonVariants: getButtonVariants(tokens),
      cardVariants: getCardVariants(tokens),
      inputVariants: getInputVariants(tokens),
      textVariants: getTextVariants(tokens),
      badgeVariants: getBadgeVariants(tokens)
    },
    isFluidTheme,
    toggleTheme,
    isDarkMode,
    toggleDarkMode
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
} 