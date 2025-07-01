import React, { createContext, useContext, useEffect, useState } from "react";

type VisualTheme = "fluid" | "solid";

type VisualThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: VisualTheme;
  storageKey?: string;
};

type VisualThemeProviderState = {
  visualTheme: VisualTheme;
  setVisualTheme: (theme: VisualTheme) => void;
};

const initialState: VisualThemeProviderState = {
  visualTheme: "fluid",
  setVisualTheme: () => null,
};

const VisualThemeProviderContext = createContext<VisualThemeProviderState>(initialState);

export function VisualThemeProvider({
  children,
  defaultTheme = "fluid", // Default all users to fluid theme
  storageKey = "thoughtmarks-visual-theme",
  ...props
}: VisualThemeProviderProps) {
  const [visualTheme, setVisualTheme] = useState<VisualTheme>(() => {
    const stored = localStorage.getItem(storageKey) as VisualTheme;
    // Force all users to fluid theme by default, migrate existing users
    if (!stored || stored !== "fluid") {
      localStorage.setItem(storageKey, "fluid");
      return "fluid";
    }
    return stored;
  });

  useEffect(() => {
    const root = window.document.documentElement;

    // Remove all visual theme classes
    root.classList.remove("fluid-theme", "solid-theme");
    
    // Apply the selected visual theme
    root.classList.add(`${visualTheme}-theme`);
    
    // Store the preference
    localStorage.setItem(storageKey, visualTheme);
  }, [visualTheme, storageKey]);

  const value = {
    visualTheme,
    setVisualTheme: (theme: VisualTheme) => {
      setVisualTheme(theme);
    },
  };

  return (
    <VisualThemeProviderContext.Provider {...props} value={value}>
      {children}
    </VisualThemeProviderContext.Provider>
  );
}

export const useVisualTheme = () => {
  const context = useContext(VisualThemeProviderContext);

  if (context === undefined)
    throw new Error("useVisualTheme must be used within a VisualThemeProvider");

  return context;
};