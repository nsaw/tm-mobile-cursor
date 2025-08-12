import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ErrorBoundary } from './components/ErrorBoundary';
import { AppStateProvider } from './contexts/AppStateContext';
import { AuthFlowProvider } from './contexts/AuthFlowContext';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './theme/ThemeProvider';
import { AppNavigator } from './navigation/AppNavigator';
import { useAppState } from './contexts/AppStateContext';
import { VoiceRecorderProvider } from './components/ui/VoiceRecorderProvider';

export default function App(): React.JSX.Element {
  return (
    <ErrorBoundary>
      <SafeAreaProvider>
        <ThemeProvider>
          <AuthProvider>
            <AppStateProvider>
              <AuthFlowProvider>
                <VoiceRecorderProvider>
                  <AppContent />
                </VoiceRecorderProvider>
              </AuthFlowProvider>
            </AppStateProvider>
          </AuthProvider>
        </ThemeProvider>
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
  }, [dispatch, trackEvent]); // Now safe since functions are memoized with useCallback

  return (
    <>
      <StatusBar style="auto" />
      <AppNavigator />
    </>
  );
};
