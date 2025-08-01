import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

const THEME_STORAGE_KEY = '@thoughtmarks_theme_preferences';

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
  isHydrated: boolean;
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
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    // Load theme preferences from storage
    const loadThemePreferences = async () => {
      try {
        console.log('🎨 Theme: Loading theme preferences from storage...');
        const storedPreferences = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        
        if (storedPreferences) {
          const preferences = JSON.parse(storedPreferences);
          console.log('🎨 Theme: Loaded preferences:', preferences);
          
          setIsDarkMode(preferences.isDarkMode ?? true);
          setIsFluidTheme(preferences.isFluidTheme ?? false);
        } else {
          console.log('🎨 Theme: No stored preferences, using defaults');
          // Save default preferences
          const defaultPreferences = {
            isDarkMode: true,
            isFluidTheme: false,
          };
          await AsyncStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(defaultPreferences));
        }
      } catch (error) {
        console.error('🎨 Theme: Error loading theme preferences:', error);
        // Fallback to defaults
        setIsDarkMode(true);
        setIsFluidTheme(false);
      } finally {
        setIsHydrated(true);
        console.log('🎨 Theme: Hydration complete');
      }
    };

    loadThemePreferences();
  }, []);

  const saveThemePreferences = async (newPreferences: { isDarkMode: boolean; isFluidTheme: boolean }) => {
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(newPreferences));
      console.log('🎨 Theme: Preferences saved:', newPreferences);
    } catch (error) {
      console.error('🎨 Theme: Error saving preferences:', error);
    }
  };

  const toggleTheme = async () => {
    const newMode = !isFluidTheme;
    setIsFluidTheme(newMode);
    await saveThemePreferences({ isDarkMode, isFluidTheme: newMode });
  };

  const toggleDarkMode = async () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    await saveThemePreferences({ isDarkMode: newMode, isFluidTheme });
  };

  const contextValue: ThemeContextType = {
    tokens: designTokens,
    typography: typographyTokens,
    buttonStyles: buttonStyles,
    spacing: spacingTokens,
    variants: {
      buttonVariants: getButtonVariants(designTokens),
      cardVariants: getCardVariants(designTokens),
      inputVariants: getInputVariants(designTokens),
      textVariants: getTextVariants(designTokens),
      badgeVariants: getBadgeVariants(designTokens),
    },
    isFluidTheme,
    toggleTheme,
    isDarkMode,
    toggleDarkMode,
    isHydrated,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
} 