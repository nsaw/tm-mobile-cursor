import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationProvider } from './navigation/NavigationProvider';
import { AppNavigator } from './navigation/AppNavigator';
import { ThemeProvider } from './theme/ThemeProvider';
import { AuthProvider } from './contexts/AuthProvider';
import { ThoughtmarksProvider } from './contexts/ThoughtmarksProvider';
import { VoiceProvider } from './contexts/VoiceProvider';
import { AIProvider } from './contexts/AIProvider';

const App: React.FC = () => {
  return (
    <SafeAreaProvider>
      <StatusBar style="auto" />
      <ThemeProvider>
        <AuthProvider>
          <ThoughtmarksProvider>
            <VoiceProvider>
              <AIProvider>
                <NavigationProvider>
                  <AppNavigator />
                </NavigationProvider>
              </AIProvider>
            </VoiceProvider>
          </ThoughtmarksProvider>
        </AuthProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
};

export default App; 