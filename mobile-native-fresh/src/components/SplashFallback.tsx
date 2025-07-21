// src/components/SplashFallback.tsx
// Splash fallback component for dual-mount architecture

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
  StatusBar,
 useColorScheme } from 'react-native';

interface SplashFallbackProps {
  message?: string;
  timeout?: number;
  onTimeout?: () => void;
  showEnvironment?: boolean;
  showDebugInfo?: boolean;
}

interface EnvironmentStatus {
  isReady: boolean;
  environment: 'legacy' | 'nextgen' | 'unknown';
  error?: string;
  timestamp: number;
}

const SplashFallback: React.FC<SplashFallbackProps> = ({
  message = 'Loading...',
  timeout = 10000, // 10 seconds
  onTimeout,
  showEnvironment = true,
  showDebugInfo = false,
}) => {
  const colorScheme = useColorScheme();
  const [timeoutReached, setTimeoutReached] = useState(false);
  const [environmentStatus, setEnvironmentStatus] = useState<EnvironmentStatus>({
    isReady: false,
    environment: 'unknown',
    timestamp: Date.now(),
  });

  // Check environment readiness
  useEffect(() => {
    const checkEnvironment = () => {
      try {
        const useNextGen = process.env.EXPO_PUBLIC_USE_NEXTGEN === 'true';
        const environment = useNextGen ? 'nextgen' : 'legacy';
        
        // Simulate environment readiness check
        const isReady = Math.random() > 0.1; // 90% success rate
        
        setEnvironmentStatus({
          isReady,
          environment,
          timestamp: Date.now(),
          error: isReady ? undefined : 'Environment not ready',
        });
      } catch (error) {
        setEnvironmentStatus({
          isReady: false,
          environment: 'unknown',
          timestamp: Date.now(),
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    };

    checkEnvironment();
  }, []);

  // Handle timeout
  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeoutReached(true);
      onTimeout?.();
    }, timeout);

    return () => clearTimeout(timer);
  }, [timeout, onTimeout]);

  const isDark = colorScheme === 'dark';
  const { width, height } = Dimensions.get('window');

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#000' : '#fff' }]}>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={isDark ? '#000' : '#fff'}
      />
      
      {/* Main content */}
      <View style={styles.content}>
        {/* App icon placeholder */}
        <View style={[styles.iconContainer, { backgroundColor: isDark ? '#333' : '#f0f0f0' }]}>
          <Text style={[styles.iconText, { color: isDark ? '#fff' : '#000' }]}>
            📱
          </Text>
        </View>

        {/* Loading indicator */}
        <ActivityIndicator
          size="large"
          color={isDark ? '#fff' : '#000'}
          style={styles.loader}
        />

        {/* Message */}
        <Text style={[styles.message, { color: isDark ? '#fff' : '#000' }]}>
          {message}
        </Text>

        {/* Environment status */}
        {showEnvironment && (
          <View style={styles.environmentContainer}>
            <Text style={[styles.environmentText, { color: isDark ? '#ccc' : '#666' }]}>
              Environment: {environmentStatus.environment.toUpperCase()}
            </Text>
            <Text style={[
              styles.statusText,
              { color: environmentStatus.isReady ? (isDark ? '#4CAF50' : '#2E7D32') : (isDark ? '#F44336' : '#D32F2F') }
            ]}>
              Status: {environmentStatus.isReady ? 'READY' : 'NOT READY'}
            </Text>
          </View>
        )}

        {/* Debug info */}
        {showDebugInfo && (
          <View style={styles.debugContainer}>
            <Text style={[styles.debugText, { color: isDark ? '#ccc' : '#666' }]}>
              Screen: {width}x{height}
            </Text>
            <Text style={[styles.debugText, { color: isDark ? '#ccc' : '#666' }]}>
              Theme: {colorScheme}
            </Text>
            <Text style={[styles.debugText, { color: isDark ? '#ccc' : '#666' }]}>
              Timeout: {timeoutReached ? 'REACHED' : 'ACTIVE'}
            </Text>
            {environmentStatus.error && (
              <Text style={[styles.errorText, { color: isDark ? '#F44336' : '#D32F2F' }]}>
                Error: {environmentStatus.error}
              </Text>
            )}
          </View>
        )}

        {/* Timeout warning */}
        {timeoutReached && (
          <View style={styles.timeoutContainer}>
            <Text style={[styles.timeoutText, { color: isDark ? '#FF9800' : '#F57C00' }]}>
              ⚠️ Loading timeout reached
            </Text>
            <Text style={[styles.timeoutSubtext, { color: isDark ? '#ccc' : '#666' }]}>
              Please check your connection and try again
            </Text>
          </View>
        )}
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={[styles.footerText, { color: isDark ? '#666' : '#999' }]}>
          ThoughtMarks Mobile
        </Text>
        <Text style={[styles.versionText, { color: isDark ? '#666' : '#999' }]}>
          v1.4.143
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  iconText: {
    fontSize: 40,
  },
  loader: {
    marginBottom: 20,
  },
  message: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 30,
  },
  environmentContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  environmentText: {
    fontSize: 14,
    marginBottom: 5,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
  },
  debugContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  debugText: {
    fontSize: 12,
    marginBottom: 2,
  },
  errorText: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 5,
  },
  timeoutContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  timeoutText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
  },
  timeoutSubtext: {
    fontSize: 14,
    textAlign: 'center',
  },
  footer: {
    paddingBottom: 40,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
  },
  versionText: {
    fontSize: 12,
  },
});

export default SplashFallback; 