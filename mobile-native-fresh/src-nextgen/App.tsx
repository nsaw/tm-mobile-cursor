import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ErrorBoundary } from './components/ErrorBoundary';
import { AppStateProvider } from './contexts/AppStateContext';
import { AuthFlowProvider } from './contexts/AuthFlowContext';
import { ThemeProvider } from './theme/ThemeProvider';
import { MainNavigator } from './navigation/MainNavigator';
import { useAppState } from './contexts/AppStateContext';

export default function App(): React.JSX.Element {
  return (
    <ErrorBoundary>
      <SafeAreaProvider>
        <NavigationContainer>
          <ThemeProvider>
            <AppStateProvider>
              <AuthFlowProvider>
                <AppContent />
              </AuthFlowProvider>
            </AppStateProvider>
          </ThemeProvider>
        </NavigationContainer>
      </SafeAreaProvider>
    </ErrorBoundary>
  );
}

const AppContent: React.FC = () => {
  const { dispatch, trackEvent } = useAppState();

  useEffect(() => {
    // Initialize app - only run once on mount
    dispatch({ type: 'INITIALIZE_APP' });
    trackEvent('app_initialized');
  }, [dispatch, trackEvent]); // Include dependencies to prevent lint warning

  return (
    <>
      <StatusBar style="auto" />
      <MainNavigator />
    </>
  );
}; 