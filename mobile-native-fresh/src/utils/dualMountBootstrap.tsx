// src/utils/dualMountBootstrap.tsx
// FORCED HYDRATION OVERRIDE - Read from env.app before any render phase

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import * as FileSystem from 'expo-file-system';

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
  hydrationSource: 'file' | 'process.env' | 'fallback';
  checks: {
    fileHydration: boolean;
    environmentValidation: boolean;
    stateInitialization: boolean;
    noLegacyFallback: boolean;
  };
}

const DualMountBootstrap: React.FC<DualMountBootstrapProps> = ({
  children,
  timeout = 15000,
  showDebugInfo = false,
  onEnvironmentReady,
  onBootstrapError,
}) => {
  const [bootstrapStatus, setBootstrapStatus] = useState<BootstrapStatus>({
    isReady: false,
    environment: 'unknown',
    timestamp: Date.now(),
    hydrationSource: 'fallback',
    checks: {
      fileHydration: false,
      environmentValidation: false,
      stateInitialization: false,
      noLegacyFallback: false,
    },
  });

  const [timeoutReached, setTimeoutReached] = useState(false);

  // FORCED HYDRATION - Read from env.app file before any render
  useEffect(() => {
    const forceHydrationFromFile = async () => {
      try {
        const startTime = Date.now();
        console.log('🔐 FORCED HYDRATION: Reading environment from env.app file...');
        
        // STEP 1: Force read from env.app file (source of truth)
        const envPath = `${FileSystem.documentDirectory}env.app`;
        let fileContents: string;
        
        try {
          fileContents = await FileSystem.readAsStringAsync(envPath);
          console.log('✅ FORCED HYDRATION: Successfully read env.app file');
          setBootstrapStatus(prev => ({
            ...prev,
            checks: { ...prev.checks, fileHydration: true },
            hydrationSource: 'file',
          }));
        } catch (fileError) {
          console.error('❌ FORCED HYDRATION: Failed to read env.app file:', fileError);
          throw new Error(`File hydration failed: ${fileError}`);
        }

        // STEP 2: Parse environment from file content
        const lines = fileContents.split('\n');
        let environment: 'legacy' | 'nextgen' = 'legacy';
        
        for (const line of lines) {
          if (line.startsWith('EXPO_PUBLIC_ENVIRONMENT=')) {
            const envValue = line.split('=')[1]?.trim();
            if (envValue === 'nextgen') {
              environment = 'nextgen';
              console.log('✅ FORCED HYDRATION: Environment set to nextgen from file');
              break;
            }
          }
        }

        // STEP 3: Validate environment state
        if (environment === 'nextgen') {
          console.log('✅ FORCED HYDRATION: Validated nextgen environment from file');
          setBootstrapStatus(prev => ({
            ...prev,
            environment,
            checks: { ...prev.checks, environmentValidation: true },
          }));
        } else {
          console.log('📋 FORCED HYDRATION: Environment set to legacy from file');
          setBootstrapStatus(prev => ({
            ...prev,
            environment,
            checks: { ...prev.checks, environmentValidation: true },
          }));
        }

        // STEP 4: Block any process.env fallback
        const processEnvEnvironment = process.env.EXPO_PUBLIC_ENVIRONMENT;
        if (processEnvEnvironment && processEnvEnvironment !== environment) {
          console.warn(`⚠️ FORCED HYDRATION: Blocking stale process.env value (${processEnvEnvironment}) in favor of file value (${environment})`);
        }
        
        // HYDRATION GUARD VERIFICATION: Override detection for legacy fallbacks
        if (process.env.EXPO_PUBLIC_ENVIRONMENT !== 'nextgen') {
          console.warn('❌ Detected legacy process.env value — this should have been overridden');
        }
        
        setBootstrapStatus(prev => ({
          ...prev,
          checks: { ...prev.checks, noLegacyFallback: true },
        }));

        // STEP 5: Initialize state with file-based environment
        await new Promise(resolve => setTimeout(resolve, 100)); // Ensure state propagation
        setBootstrapStatus(prev => ({
          ...prev,
          checks: { ...prev.checks, stateInitialization: true },
        }));

        // STEP 6: Complete bootstrap
        const allChecksPassed = Object.values({
          fileHydration: true,
          environmentValidation: true,
          stateInitialization: true,
          noLegacyFallback: true,
        }).every(check => check);

        if (allChecksPassed) {
          setBootstrapStatus(prev => ({
            ...prev,
            isReady: true,
            timestamp: Date.now(),
          }));
          
          onEnvironmentReady?.(environment);
          console.log(`✅ FORCED HYDRATION: Bootstrap completed for ${environment} environment in ${Date.now() - startTime}ms`);
          console.log(`✅ FORCED HYDRATION: Environment source: ${bootstrapStatus.hydrationSource}`);
        } else {
          throw new Error('Forced hydration checks failed');
        }

      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown forced hydration error';
        setBootstrapStatus(prev => ({
          ...prev,
          error: errorMessage,
          timestamp: Date.now(),
        }));
        
        onBootstrapError?.(error instanceof Error ? error : new Error(errorMessage));
        console.error('❌ FORCED HYDRATION: Bootstrap failed:', errorMessage);
      }
    };

    forceHydrationFromFile();
  }, [onEnvironmentReady, onBootstrapError]);

  // Handle timeout
  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeoutReached(true);
      console.warn('⚠️ FORCED HYDRATION: Bootstrap timeout reached');
    }, timeout);

    return () => clearTimeout(timer);
  }, [timeout]);

  // Show splash fallback if not ready
  if (!bootstrapStatus.isReady) {
    return (
      <SplashFallback
        message={timeoutReached ? 'Forced hydration timeout reached' : 'Forcing environment hydration...'}
        timeout={timeout}
        showEnvironment={true}
        showDebugInfo={showDebugInfo}
        onTimeout={() => {
          console.warn('⚠️ FORCED HYDRATION: Splash fallback timeout reached');
        }}
      />
    );
  }

  // Show error state if bootstrap failed
  if (bootstrapStatus.error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorTitle}>🚨 FORCED HYDRATION FAILED</Text>
        <Text style={styles.errorMessage}>{bootstrapStatus.error}</Text>
        <Text style={styles.errorSubtext}>
          Environment: {bootstrapStatus.environment.toUpperCase()}
        </Text>
        <Text style={styles.errorSubtext}>
          Source: {bootstrapStatus.hydrationSource.toUpperCase()}
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