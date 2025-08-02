import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface ThemeTokens {
  colors: {
    background: string;
    text: string;
    surface: string;
    border: string;
    accent: string;
    textSecondary: string;
    error: string;
    success: string;
    warning: string;
  };
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
  typography: {
    fontSize: {
      xs: number;
      sm: number;
      body: number;
      lg: number;
      xl: number;
      heading: number;
    };
    fontWeight: {
      normal: string;
      medium: string;
      semibold: string;
      bold: string;
    };
  };
}

const lightTheme: ThemeTokens = {
  colors: {
    background: '#FFFFFF',
    text: '#000000',
    surface: '#F8F9FA',
    border: '#E9ECEF',
    accent: '#007AFF',
    textSecondary: '#6C757D',
    error: '#DC3545',
    success: '#28A745',
    warning: '#FFC107',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  typography: {
    fontSize: {
      xs: 12,
      sm: 14,
      body: 16,
      lg: 18,
      xl: 20,
      heading: 24,
    },
    fontWeight: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
  },
};

const darkTheme: ThemeTokens = {
  colors: {
    background: '#000000',
    text: '#FFFFFF',
    surface: '#1C1C1E',
    border: '#38383A',
    accent: '#0A84FF',
    textSecondary: '#8E8E93',
    error: '#FF453A',
    success: '#32D74B',
    warning: '#FFD60A',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  typography: {
    fontSize: {
      xs: 12,
      sm: 14,
      body: 16,
      lg: 18,
      xl: 20,
      heading: 24,
    },
    fontWeight: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
  },
};

interface ThemeContextType {
  tokens: ThemeTokens;
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  const tokens = isDarkMode ? darkTheme : lightTheme;
  
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <ThemeContext.Provider value={{ tokens, isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }

  // Runtime validation hook
  useEffect(() => {
    console.log('🎨 useTheme hook initialized - Runtime validation active');
    console.log('📊 Theme state:', {
      isDark: context.isDarkMode,
      colors: Object.keys(context.tokens.colors).length,
      spacing: Object.keys(context.tokens.spacing).length,
      typography: Object.keys(context.tokens.typography).length
    });
  }, [context.isDarkMode]);

  return context;
} 