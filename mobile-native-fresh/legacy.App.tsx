// legacy.App.tsx - Simple legacy app entry point
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { AppRegistry } from 'react-native';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import {
  Oswald_400Regular,
  Oswald_500Medium,
  Oswald_700Bold
} from '@expo-google-fonts/oswald';
import {
  Ubuntu_300Light,
  Ubuntu_400Regular,
  Ubuntu_500Medium,
  Ubuntu_700Bold
} from '@expo-google-fonts/ubuntu';

// Import the simplified SignInScreen (Firebase hooks disabled)
import { SignInScreen } from '@legacy/features/auth/screens';
// Import ThemeProvider to fix useTheme error
import { ThemeProvider } from '@legacy/theme/ThemeProvider';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

function LegacyApp(): React.JSX.Element | null {
  const [fontsLoaded] = useFonts({
    'Oswald-Regular': Oswald_400Regular,
    'Oswald-Medium': Oswald_500Medium,
    'Oswald-Bold': Oswald_700Bold,
    'Ubuntu-Light': Ubuntu_300Light,
    'Ubuntu-Regular': Ubuntu_400Regular,
    'Ubuntu-Medium': Ubuntu_500Medium,
    'Ubuntu-Bold': Ubuntu_700Bold,
  });

  React.useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) { return null; }

  console.log('[LEGACY-APP] 🚀 Legacy app loaded successfully');
  console.log('[LEGACY-APP] Loading simplified SignInScreen...');

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: '#000' }}>
        <StatusBar style="light" />
        <ThemeProvider>
          <SignInScreen />
        </ThemeProvider>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

export default LegacyApp;
AppRegistry.registerComponent('auth', () => LegacyApp);
AppRegistry.registerComponent('main', () => LegacyApp);
