// ThemeProvider.tsx
import React from 'react';
import { ThemeProvider as NativeThemeProvider } from 'styled-components/native';

import { useAppState } from '../state/store';

const lightTheme = { background: '#fff' };
const darkTheme = { background: '#000' };

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const { theme } = useAppState();
  const selectedTheme = theme === 'dark' ? darkTheme : lightTheme;

  return <NativeThemeProvider theme={selectedTheme}>{children}</NativeThemeProvider>;
}; 