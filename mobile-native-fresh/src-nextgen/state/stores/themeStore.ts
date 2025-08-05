import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface ThemeColors {
  primary: string;
  secondary: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
  error: string;
  success: string;
  warning: string;
}

export interface Theme {
  name: string;
  colors: ThemeColors;
  isDark: boolean;
}

export interface ThemeState {
  currentTheme: Theme;
  availableThemes: Theme[];
}

export interface ThemeActions {
  setTheme: (themeName: string) => void;
  toggleDarkMode: () => void;
  addTheme: (theme: Theme) => void;
}

export interface ThemeStore extends ThemeState, ThemeActions {}

const defaultTheme: Theme = {
  name: 'default',
  isDark: false,
  colors: {
    primary: '#007AFF',
    secondary: '#5856D6',
    background: '#FFFFFF',
    surface: '#F2F2F7',
    text: '#000000',
    textSecondary: '#8E8E93',
    border: '#C6C6C8',
    error: '#FF3B30',
    success: '#34C759',
    warning: '#FF9500',
  },
};

const darkTheme: Theme = {
  name: 'dark',
  isDark: true,
  colors: {
    primary: '#0A84FF',
    secondary: '#5E5CE6',
    background: '#000000',
    surface: '#1C1C1E',
    text: '#FFFFFF',
    textSecondary: '#8E8E93',
    border: '#38383A',
    error: '#FF453A',
    success: '#32D74B',
    warning: '#FF9F0A',
  },
};

const useThemeStore = create<ThemeStore>()(
  persist(
    (set, get) => ({
      currentTheme: defaultTheme,
      availableThemes: [defaultTheme, darkTheme],
      
      setTheme: (themeName: string) => {
        const { availableThemes: _availableThemes } = get();
        const theme = _availableThemes.find(t => t.name === themeName);
        if (theme) {
          set({ currentTheme: theme });
        }
      },
      
      toggleDarkMode: () => {
        const { currentTheme, availableThemes: _availableThemes } = get();
        const newTheme = currentTheme.isDark ? defaultTheme : darkTheme;
        set({ currentTheme: newTheme });
      },
      
      addTheme: (theme: Theme) => {
        const { availableThemes } = get();
        set({ availableThemes: [...availableThemes, theme] });
      },
    }),
    {
      name: 'theme-store',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export default useThemeStore; 