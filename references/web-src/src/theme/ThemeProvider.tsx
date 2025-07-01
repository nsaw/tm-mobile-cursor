import React, { createContext, useContext, useState, useEffect } from 'react';
import { previewTheme, PreviewTheme } from './preview-theme';

interface ThemeContextType {
  theme: PreviewTheme;
  isPreviewMode: boolean;
  togglePreview: () => void;
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

export function FluidThemeProvider({ children }: ThemeProviderProps) {
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('thoughtmarks-fluid-theme');
    if (saved === 'true') {
      setIsPreviewMode(true);
      applyFluidTheme();
    }
  }, []);

  const applyFluidTheme = () => {
    document.documentElement.classList.add('fluid-theme');
    document.documentElement.setAttribute('data-theme', 'fluid');
  };

  const removeFluidTheme = () => {
    document.documentElement.classList.remove('fluid-theme');
    document.documentElement.removeAttribute('data-theme');
  };

  const togglePreview = () => {
    const newMode = !isPreviewMode;
    setIsPreviewMode(newMode);
    localStorage.setItem('thoughtmarks-fluid-theme', newMode.toString());
    
    if (newMode) {
      applyFluidTheme();
    } else {
      removeFluidTheme();
    }
  };

  const contextValue: ThemeContextType = {
    theme: previewTheme,
    isPreviewMode,
    togglePreview,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}