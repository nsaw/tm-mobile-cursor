import React, { ReactNode } from 'react';
import { NavigationContainer } from '@react-navigation/native';

// Core Systems
import { ThemeProvider } from '../theme/ThemeProvider';

// Navigation Components
import { RootNavigator } from '../navigation/RootNavigator';

// Error Boundary
import { GlobalErrorBoundary } from '../components/GlobalErrorBoundary';

// App Integration Hook
import { useAppIntegration } from '../hooks/useAppIntegration';

// Components
import { AutoRoleView } from '../shell/wrappers/AutoRoleView';

/**
 * Core Systems Integration Component
 * 
 * This component integrates all core systems:
 * - Navigation
 * - Theme Provider
 * - Error Boundaries
 * - State Management
 * - API Services
 */
export const CoreSystemsIntegration: React.FC<{ children?: ReactNode }> = ({ children }) => {
  // Initialize app integration
  useAppIntegration();

  return (
    <GlobalErrorBoundary
      maxRecoveryAttempts={3}
      recoveryDelay={2000}
      onError={(error, errorInfo) => {
        console.error('Global error caught:', error, errorInfo);
      }}
      onRecovery={() => {
        console.log('Application recovered from error');
      }}
    >
      <ThemeProvider>
        <NavigationContainer>
          <AutoRoleView layoutRole="container-main" style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <RootNavigator />
            {children}
          </AutoRoleView>
        </NavigationContainer>
      </ThemeProvider>
    </GlobalErrorBoundary>
  );
};

export default CoreSystemsIntegration; 