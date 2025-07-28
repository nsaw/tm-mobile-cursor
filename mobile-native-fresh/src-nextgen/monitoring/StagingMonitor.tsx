import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';

declare const console: any;
declare const setInterval: any;
declare const clearInterval: any;

interface StagingSession {
  id: string;
  startTime: number;
  endTime?: number;
  routeHistory: string[];
  hydrationEvents: HydrationEvent[];
  overrideDetections: OverrideDetection[];
  performanceMetrics: PerformanceMetric[];
  errors: string[];
}

interface HydrationEvent {
  timestamp: number;
  component: string;
  depth: number;
  routeName: string;
  params: any;
  success: boolean;
  error?: string;
}

interface OverrideDetection {
  timestamp: number;
  type: string;
  parentRoute: string;
  childRoute: string;
  severity: 'low' | 'medium' | 'high';
  resolved: boolean;
}

interface PerformanceMetric {
  timestamp: number;
  renderTime: number;
  memoryUsage: number;
  navigationTime: number;
}

export function useStagingMonitor() {
  const route = useRoute<RouteProp<Record<string, object | undefined>, string>>();
  const [currentSession, setCurrentSession] = useState<StagingSession>({
    id: `session-${Date.now()}`,
    startTime: Date.now(),
    routeHistory: [],
    hydrationEvents: [],
    overrideDetections: [],
    performanceMetrics: [],
    errors: []
  });
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [sessionHistory, setSessionHistory] = useState<StagingSession[]>([]);

  // Monitor route changes
  const monitorRouteChange = useCallback(() => {
    if (route?.name) {
      setCurrentSession(prev => ({
        ...prev,
        routeHistory: [...prev.routeHistory, route.name]
      }));

      console.log('[StagingMonitor] Route changed:', route.name);
    }
  }, [route?.name]);

  // Monitor hydration events
  const monitorHydration = useCallback((component: string, depth: number, success: boolean, error?: string) => {
    const hydrationEvent: HydrationEvent = {
      timestamp: Date.now(),
      component,
      depth,
      routeName: route?.name || 'unknown',
      params: route?.params || null,
      success,
      error
    };

    setCurrentSession(prev => ({
      ...prev,
      hydrationEvents: [...prev.hydrationEvents, hydrationEvent]
    }));

    if (!success) {
      console.warn('[StagingMonitor] Hydration failed:', { component, depth, error });
    } else {
      console.log('[StagingMonitor] Hydration successful:', { component, depth });
    }
  }, [route?.name, route?.params]);

  // Monitor override detections
  const monitorOverrideDetection = useCallback((type: string, parentRoute: string, childRoute: string, severity: 'low' | 'medium' | 'high') => {
    const overrideDetection: OverrideDetection = {
      timestamp: Date.now(),
      type,
      parentRoute,
      childRoute,
      severity,
      resolved: false
    };

    setCurrentSession(prev => ({
      ...prev,
      overrideDetections: [...prev.overrideDetections, overrideDetection]
    }));

    console.warn('[StagingMonitor] Override detected:', { type, parentRoute, childRoute, severity });
  }, []);

  // Monitor performance metrics
  const monitorPerformance = useCallback(() => {
    // Simulate performance measurement
    const renderTime = Math.random() * 50 + 10; // 10-60ms
    const memoryUsage = Math.random() * 1000000 + 500000; // 0.5-1.5MB
    const navigationTime = Math.random() * 200 + 50; // 50-250ms

    const performanceMetric: PerformanceMetric = {
      timestamp: Date.now(),
      renderTime,
      memoryUsage,
      navigationTime
    };

    setCurrentSession(prev => ({
      ...prev,
      performanceMetrics: [...prev.performanceMetrics, performanceMetric]
    }));
  }, []);

  // Start monitoring
  const startMonitoring = useCallback(() => {
    setIsMonitoring(true);
    console.log('[StagingMonitor] Staging monitoring started');
  }, []);

  // Stop monitoring and save session
  const stopMonitoring = useCallback(() => {
    setIsMonitoring(false);
    
    const completedSession: StagingSession = {
      ...currentSession,
      endTime: Date.now()
    };

    setSessionHistory(prev => [...prev, completedSession]);
    console.log('[StagingMonitor] Staging monitoring stopped, session saved');
  }, [currentSession]);

  // Clear session history
  const clearHistory = useCallback(() => {
    setSessionHistory([]);
    console.log('[StagingMonitor] Session history cleared');
  }, []);

  // Monitor route changes
  useEffect(() => {
    monitorRouteChange();
  }, [monitorRouteChange]);

  // Periodic performance monitoring
  useEffect(() => {
    if (isMonitoring) {
      const interval = setInterval(monitorPerformance, 5000); // Every 5 seconds
      return () => clearInterval(interval);
    }
  }, [isMonitoring, monitorPerformance]);

  return {
    currentSession,
    sessionHistory,
    isMonitoring,
    startMonitoring,
    stopMonitoring,
    clearHistory,
    monitorHydration,
    monitorOverrideDetection
  };
}

export default function StagingMonitor() {
  const { currentSession, sessionHistory, isMonitoring, startMonitoring, stopMonitoring, clearHistory } = useStagingMonitor();
  const { routeHistory, hydrationEvents, overrideDetections, performanceMetrics } = currentSession;

  const sessionDuration = currentSession.endTime 
    ? Math.round((currentSession.endTime - currentSession.startTime) / 1000)
    : Math.round((Date.now() - currentSession.startTime) / 1000);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Staging Monitor</Text>
      <Text style={styles.subtitle}>Enhanced Context Validator & SlotBridge Monitoring</Text>
      
      <View style={styles.statusContainer}>
        <Text style={styles.statusText}>Status: {isMonitoring ? '🟢 Monitoring' : '🔴 Stopped'}</Text>
        <Text style={styles.statusText}>Session Duration: {sessionDuration}s</Text>
        <Text style={styles.statusText}>Routes Visited: {routeHistory.length}</Text>
        <Text style={styles.statusText}>Hydration Events: {hydrationEvents.length}</Text>
        <Text style={styles.statusText}>Override Detections: {overrideDetections.length}</Text>
        <Text style={styles.statusText}>Performance Metrics: {performanceMetrics.length}</Text>
      </View>

      <View style={styles.controlsContainer}>
        <TouchableOpacity 
          style={[styles.controlButton, isMonitoring ? styles.stopButton : styles.startButton]} 
          onPress={isMonitoring ? stopMonitoring : startMonitoring}
        >
          <Text style={styles.controlButtonText}>
            {isMonitoring ? 'Stop Monitoring' : 'Start Monitoring'}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.clearButton} onPress={clearHistory}>
          <Text style={styles.clearButtonText}>Clear History</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.routeContainer}>
        <Text style={styles.routeTitle}>Route History</Text>
        {routeHistory.slice(-10).map((route, index) => (
          <Text key={index} style={styles.routeText}>• {route}</Text>
        ))}
      </View>

      <View style={styles.hydrationContainer}>
        <Text style={styles.hydrationTitle}>Recent Hydration Events</Text>
        {hydrationEvents.slice(-5).map((event, index) => (
          <View key={index} style={styles.hydrationItem}>
            <Text style={styles.hydrationText}>✅ {event.component} (depth: {event.depth})</Text>
            <Text style={styles.hydrationTime}>{new Date(event.timestamp).toLocaleTimeString()}</Text>
          </View>
        ))}
      </View>

      {overrideDetections.length > 0 && (
        <View style={styles.overrideContainer}>
          <Text style={styles.overrideTitle}>Override Detections</Text>
          {overrideDetections.slice(-5).map((detection, index) => (
            <View key={index} style={styles.overrideItem}>
              <Text style={styles.overrideText}>⚠️ {detection.type}: {detection.parentRoute} → {detection.childRoute}</Text>
              <Text style={styles.overrideTime}>{new Date(detection.timestamp).toLocaleTimeString()}</Text>
            </View>
          ))}
        </View>
      )}

      <View style={styles.performanceContainer}>
        <Text style={styles.performanceTitle}>Performance Metrics</Text>
        {performanceMetrics.length > 0 && (
          <View style={styles.metricsContainer}>
            <Text style={styles.metricText}>Avg Render Time: {(performanceMetrics.reduce((sum, m) => sum + m.renderTime, 0) / performanceMetrics.length).toFixed(2)}ms</Text>
            <Text style={styles.metricText}>Avg Memory Usage: {(performanceMetrics.reduce((sum, m) => sum + m.memoryUsage, 0) / performanceMetrics.length / 1024 / 1024).toFixed(2)}MB</Text>
            <Text style={styles.metricText}>Avg Navigation Time: {(performanceMetrics.reduce((sum, m) => sum + m.navigationTime, 0) / performanceMetrics.length).toFixed(2)}ms</Text>
          </View>
        )}
      </View>

      {sessionHistory.length > 0 && (
        <View style={styles.historyContainer}>
          <Text style={styles.historyTitle}>Session History</Text>
          {sessionHistory.slice(-3).map((session, index) => (
            <View key={session.id} style={styles.historyItem}>
              <Text style={styles.historyText}>Session {sessionHistory.length - index}</Text>
              <Text style={styles.historyText}>Duration: {Math.round((session.endTime! - session.startTime) / 1000)}s</Text>
              <Text style={styles.historyText}>Routes: {session.routeHistory.length}</Text>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#f8f9fa'
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'center'
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
    textAlign: 'center'
  },
  statusContainer: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  statusText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 5
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 15
  },
  controlButton: {
    padding: 10,
    borderRadius: 5,
    minWidth: 120,
    alignItems: 'center'
  },
  startButton: {
    backgroundColor: '#4caf50'
  },
  stopButton: {
    backgroundColor: '#f44336'
  },
  controlButtonText: {
    color: 'white',
    fontWeight: 'bold'
  },
  clearButton: {
    backgroundColor: '#ff9800',
    padding: 10,
    borderRadius: 5,
    minWidth: 100,
    alignItems: 'center'
  },
  clearButtonText: {
    color: 'white',
    fontWeight: 'bold'
  },
  routeContainer: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  routeTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10
  },
  routeText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 3
  },
  hydrationContainer: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  hydrationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10
  },
  hydrationItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5
  },
  hydrationText: {
    fontSize: 14,
    color: '#333',
    flex: 1
  },
  hydrationTime: {
    fontSize: 12,
    color: '#666'
  },
  overrideContainer: {
    backgroundColor: '#fff3cd',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  overrideTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'orange'
  },
  overrideItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5
  },
  overrideText: {
    fontSize: 14,
    color: '#333',
    flex: 1
  },
  overrideTime: {
    fontSize: 12,
    color: '#666'
  },
  performanceContainer: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  performanceTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10
  },
  metricsContainer: {
    gap: 5
  },
  metricText: {
    fontSize: 14,
    color: '#333'
  },
  historyContainer: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  historyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10
  },
  historyItem: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#f8f9fa',
    borderRadius: 5
  },
  historyText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 3
  }
}); 