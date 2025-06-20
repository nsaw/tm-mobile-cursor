import React from 'react';
import { StatusBar } from 'expo-status-bar';
// App.tsx
import { useFonts } from 'expo-font';
import { Oswald_700Bold, Oswald_400Regular } from '@expo-google-fonts/oswald';
import { Ubuntu_400Regular, Ubuntu_500Medium } from '@expo-google-fonts/ubuntu';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  const [loaded] = useFonts({ Oswald_700Bold, Oswald_400Regular, Ubuntu_400Regular, Ubuntu_500Medium });
  if (!loaded) return null;
  return <AppNavigator />;
    <>
      <AppNavigator />
      <StatusBar style="auto" />
    </>
}
