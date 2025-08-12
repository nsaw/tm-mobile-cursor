// App.tsx - Dual-mount system with environment toggle
import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { View, Text } from 'react-native';
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

// Dual-mount system: Check environment variable to determine which app to load
const USE_NEXTGEN = process.env.EXPO_PUBLIC_USE_NEXTGEN === 'true';
console.log('[DUAL-MOUNT] Environment check:', {
  EXPO_PUBLIC_USE_NEXTGEN: process.env.EXPO_PUBLIC_USE_NEXTGEN,
  USE_NEXTGEN: USE_NEXTGEN,
  NODE_ENV: process.env.NODE_ENV,
  EXPO_PUBLIC_ENVIRONMENT: process.env.EXPO_PUBLIC_ENVIRONMENT
});

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function App(): React.JSX.Element | null {
  console.log('[APP] 🚀 App function executed - THIS SHOULD APPEAR');
  console.log('[APP] USE_NEXTGEN:', USE_NEXTGEN);

  const [fontsLoaded] = useFonts({
    'Oswald-Regular': Oswald_400Regular,
    'Oswald-Medium': Oswald_500Medium,
    'Oswald-Bold': Oswald_700Bold,
    'Ubuntu-Light': Ubuntu_300Light,
    'Ubuntu-Regular': Ubuntu_400Regular,
    'Ubuntu-Medium': Ubuntu_500Medium,
    'Ubuntu-Bold': Ubuntu_700Bold,
  });

  const [appComponent, setAppComponent] = useState<React.ComponentType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  useEffect(() => {
    const loadApp = async () => {
      try {
        if (USE_NEXTGEN) {
          console.log('[APP] Loading NextGen app...');
          const NextGenApp = (await import('./src-nextgen/App')).default;
          console.log('[APP] NextGen app loaded successfully');
          setAppComponent(() => NextGenApp);
        } else {
          console.log('[APP] USE_NEXTGEN is false, loading legacy app...');
          const LegacyApp = (await import('./legacy.App')).default;
          console.log('[APP] Legacy app loaded successfully');
          setAppComponent(() => LegacyApp);
        }
      } catch (error) {
        console.error('[APP] Failed to load app:', error);
        console.error('[APP] Error details:', error instanceof Error ? error.message : String(error));
        console.log('[APP] Falling back to mock app...');
        setAppComponent(null);
      } finally {
        setLoading(false);
      }
    };

    loadApp();
  }, []);

  if (!fontsLoaded || loading) {
    return null;
  }

  // Render the loaded app component
  if (appComponent) {
    const AppComponent = appComponent;
    return <AppComponent />;
  }

  // Fallback mock app if both fail
  console.log('[APP] Loading fallback mock app...');
  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: '#000' }}>
        <StatusBar style="light" />
        <View style={{ 
          flex: 1, 
          justifyContent: 'center', 
          alignItems: 'center'
        }}>
          <Text style={{ color: 'white', textAlign: 'center', fontSize: 24, fontWeight: '600' }}>
            📱 App Loading Failed
          </Text>
          <Text style={{ color: 'white', textAlign: 'center' }}>
            Both NextGen and Legacy apps failed to load
          </Text>
          <Text style={{ color: 'white', textAlign: 'center' }}>
            Environment: {process.env.EXPO_PUBLIC_USE_NEXTGEN}
          </Text>
          <Text style={{ color: 'white', textAlign: 'center' }}>
            Check console for errors
          </Text>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
