import React, { createContext, useContext, ReactNode, useEffect, useState } from 'react';

import { ThemeSystem, Theme } from './ThemeSystem';

interface ThemeContextType {
  theme: Theme;
  switchTheme: (themeId: string) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState<Theme | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeTheme = async () => {
      try {
        const themeSystem = ThemeSystem.getInstance();
        await themeSystem.initialize();
        
        const currentTheme = themeSystem.getCurrentTheme();
        setTheme(currentTheme);
        
        // Listen for theme changes
        const unsubscribe = themeSystem.addListener((newTheme) => {
          setTheme(newTheme);
        });
        
        return unsubscribe;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to initialize theme');
      } finally {
        setIsLoading(false);
      }
    };

    initializeTheme();
  }, []);

  const switchTheme = async (themeId: string) => {
    try {
      const themeSystem = ThemeSystem.getInstance();
      await themeSystem.switchTheme(themeId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to switch theme');
    }
  };

  if (isLoading) {
    // Return a loading state or default theme
    return <>{children}</>;
  }

  if (error || !theme) {
    // Return error state or default theme
    return <>{children}</>;
  }

  return (
    <ThemeContext.Provider value={{ theme, switchTheme, isLoading, error }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}; 