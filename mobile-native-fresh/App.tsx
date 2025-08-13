import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { ThemeProvider } from './src-nextgen/theme/ThemeProvider';
import { AuthProvider } from './src-nextgen/contexts/AuthProvider';
import { ThoughtmarksProvider } from './src-nextgen/contexts/ThoughtmarksProvider';
import { VoiceProvider } from './src-nextgen/contexts/VoiceProvider';
import { AIProvider } from './src-nextgen/contexts/AIProvider';
import { DashboardScreen } from './src-nextgen/screens/dashboard/DashboardScreen';
import { LoadingScreen } from './src-nextgen/components/ui/LoadingScreen';
import { useAuth } from './src-nextgen/hooks/useAuth';

// Define the root stack param list
export type RootStackParamList = {
  Dashboard: undefined;
  Loading: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();

  console.log('[APP] Auth state:', { isAuthenticated, loading });

  // Show loading screen while checking authentication
  if (loading) {
    console.log('[APP] Showing loading screen');
    return <LoadingScreen />;
  }

  console.log('[APP] Auth check complete, showing dashboard');
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Dashboard" component={DashboardScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const App: React.FC = () => {
  console.log('[APP] 🚀 Full-featured App loading with navigation');

  return (
    <SafeAreaProvider>
      <StatusBar style="auto" />
      <ThemeProvider>
        <AuthProvider>
          <ThoughtmarksProvider>
            <VoiceProvider>
              <AIProvider>
                <AppNavigator />
              </AIProvider>
            </VoiceProvider>
          </ThoughtmarksProvider>
        </AuthProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
};

export default App;
