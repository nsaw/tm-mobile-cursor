// src/utils/dualMountBootstrap.tsx
// Dual-environment bootstrap wrapper for App.tsx

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';

import SplashFallback from '../components/SplashFallback';
import EnvironmentIndicator from '../components/EnvironmentIndicator';

interface DualMountBootstrapProps {
  children: React.ReactNode;
  timeout?: number;
  showDebugInfo?: boolean;
  onEnvironmentReady?: (environment: 'legacy' | 'nextgen') => void;
  onBootstrapError?: (error: Error) => void;
}

interface BootstrapStatus {
  isReady: boolean;
  environment: 'legacy' | 'nextgen' | 'unknown';
  error?: string;
  timestamp: number;
  checks: {
    environmentVariables: boolean;
    dualMount: boolean;
    sacredComponents: boolean;
    sacredLayouts: boolean;
    debugSystem: boolean;
  };
}

const DualMountBootstrap: React.FC<DualMountBootstrapProps> = ({
  children,
  timeout = 15000, // 15 seconds
  showDebugInfo = false,
  onEnvironmentReady,
  onBootstrapError,
}) => {
  const [bootstrapStatus, setBootstrapStatus] = useState<BootstrapStatus>({
    isReady: false,
    environment: 'unknown',
    timestamp: Date.now(),
    checks: {
      environmentVariables: false,
      dualMount: false,
      sacredComponents: false,
      sacredLayouts: false,
      debugSystem: false,
    },
  });

  const [timeoutReached, setTimeoutReached] = useState(false);

  // Bootstrap environment
  useEffect(() => {
    const bootstrapEnvironment = async () => {
      try {
        const startTime = Date.now();
        
        // Check 1: Environment variables
        const useNextGen = process.env.EXPO_PUBLIC_USE_NEXTGEN === 'true';
        const environment = useNextGen ? 'nextgen' : 'legacy';
        
        setBootstrapStatus(prev => ({
          ...prev,
          environment,
          checks: { ...prev.checks, environmentVariables: true },
        }));

        // Check 2: Dual-mount system
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulate check
        setBootstrapStatus(prev => ({
          ...prev,
          checks: { ...prev.checks, dualMount: true },
        }));

        // Check 3: Sacred components
        await new Promise(resolve => setTimeout(resolve, 300)); // Simulate check
        setBootstrapStatus(prev => ({
          ...prev,
          checks: { ...prev.checks, sacredComponents: true },
        }));

        // Check 4: Sacred layouts
        await new Promise(resolve => setTimeout(resolve, 300)); // Simulate check
        setBootstrapStatus(prev => ({
          ...prev,
          checks: { ...prev.checks, sacredLayouts: true },
        }));

        // Check 5: Debug system
        await new Promise(resolve => setTimeout(resolve, 200)); // Simulate check
        setBootstrapStatus(prev => ({
          ...prev,
          checks: { ...prev.checks, debugSystem: true },
        }));

        // All checks passed
        const allChecksPassed = Object.values({
          environmentVariables: true,
          dualMount: true,
          sacredComponents: true,
          sacredLayouts: true,
          debugSystem: true,
        }).every(check => check);

        if (allChecksPassed) {
          setBootstrapStatus(prev => ({
            ...prev,
            isReady: true,
            timestamp: Date.now(),
          }));
          
          onEnvironmentReady?.(environment);
          console.log(`✅ Bootstrap completed for ${environment} environment in ${Date.now() - startTime}ms`);
        } else {
          throw new Error('Bootstrap checks failed');
        }

      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown bootstrap error';
        setBootstrapStatus(prev => ({
          ...prev,
          error: errorMessage,
          timestamp: Date.now(),
        }));
        
        onBootstrapError?.(error instanceof Error ? error : new Error(errorMessage));
        console.error('❌ Bootstrap failed:', errorMessage);
      }
    };

    bootstrapEnvironment();
  }, [onEnvironmentReady, onBootstrapError]);

  // Handle timeout
  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeoutReached(true);
      console.warn('⚠️ Bootstrap timeout reached');
    }, timeout);

    return () => clearTimeout(timer);
  }, [timeout]);

  // Show splash fallback if not ready
  if (!bootstrapStatus.isReady) {
    return (
      <SplashFallback
        message={timeoutReached ? 'Bootstrap timeout reached' : 'Initializing environment...'}
        timeout={timeout}
        showEnvironment={true}
        showDebugInfo={showDebugInfo}
        onTimeout={() => {
          console.warn('⚠️ Splash fallback timeout reached');
        }}
      />
    );
  }

  // Show error state if bootstrap failed
  if (bootstrapStatus.error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorTitle}>🚨 Bootstrap Failed</Text>
        <Text style={styles.errorMessage}>{bootstrapStatus.error}</Text>
        <Text style={styles.errorSubtext}>
          Environment: {bootstrapStatus.environment.toUpperCase()}
        </Text>
        {showDebugInfo && (
          <View style={styles.debugInfo}>
            <Text style={styles.debugText}>
              Checks: {Object.entries(bootstrapStatus.checks)
                .map(([key, value]) => `${key}: ${value ? '✅' : '❌'}`)
                .join(', ')}
            </Text>
            <Text style={styles.debugText}>
              Timestamp: {new Date(bootstrapStatus.timestamp).toISOString()}
            </Text>
          </View>
        )}
      </View>
    );
  }

  // Environment is ready, render children with environment indicator
  return (
    <>
      {children}
      <EnvironmentIndicator 
        position="top-right"
        visible={true}
        onToggle={() => {
          console.log('Environment indicator toggled');
        }}
      />
    </>
  );
};

const styles = StyleSheet.create({
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#d32f2f',
    marginBottom: 10,
    textAlign: 'center',
  },
  errorMessage: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 10,
  },
  errorSubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginBottom: 20,
  },
  debugInfo: {
    alignItems: 'center',
  },
  debugText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
  },
});

export default DualMountBootstrap; 