import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ErrorBoundary } from './components/ErrorBoundary';
import { AppStateProvider } from './contexts/AppStateContext';
import { AuthFlowProvider } from './contexts/AuthFlowContext';
import { AuthProvider } from './contexts/AuthContext';
import { DualMountProvider } from './contexts/DualMountContext';
import { ThemeProvider } from './theme/ThemeProvider';
import { MainNavigator } from './navigation/MainNavigator';
import { DualMountApp } from './components/DualMountApp';
import { LegacyApp } from './components/LegacyApp';
import { useAppState } from './contexts/AppStateContext';

export default function App(): React.JSX.Element {
  return (
    <ErrorBoundary>
      <SafeAreaProvider>
        <NavigationContainer>
          <ThemeProvider>
            <DualMountProvider initialMount="nextgen">
              <AuthProvider>
                <AppStateProvider>
                  <AuthFlowProvider>
                    <AppContent />
                  </AuthFlowProvider>
                </AppStateProvider>
              </AuthProvider>
            </DualMountProvider>
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
  }, [dispatch, trackEvent]); // Now safe since functions are memoized with useCallback

  return (
    <>
      <StatusBar style="auto" />
      <DualMountApp 
        nextGenComponent={NextGenAppContent}
        legacyComponent={LegacyApp}
      />
    </>
  );
};

const NextGenAppContent: React.FC = () => {
  return <MainNavigator />;
}; 