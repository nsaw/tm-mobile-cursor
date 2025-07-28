import React, { useEffect, useState, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';

declare const console: any;

interface ContextSnapshot {
  routeName: string | null;
  routeParams: any;
  navigationState: any;
  contextDepth: number;
  timestamp: number;
  componentName: string;
}

interface ContextOverride {
  id: string;
  type: 'route' | 'params' | 'state' | 'depth';
  parentSnapshot: ContextSnapshot;
  childSnapshot: ContextSnapshot;
  severity: 'low' | 'medium' | 'high';
  description: string;
  recommendation: string;
  resolved: boolean;
  resolution?: string;
  timestamp: number;
}

interface OverrideDetectionState {
  contextSnapshots: Map<string, ContextSnapshot>;
  detectedOverrides: ContextOverride[];
  resolvedOverrides: ContextOverride[];
  isMonitoring: boolean;
  lastAnalysis: number;
  overrideHistory: string[];
}

export function useContextOverrideDetection(componentName: string) {
  const route = useRoute<RouteProp<Record<string, object | undefined>, string>>();
  const navigation = useNavigation();
  const [detectionState, setDetectionState] = useState<OverrideDetectionState>({
    contextSnapshots: new Map(),
    detectedOverrides: [],
    resolvedOverrides: [],
    isMonitoring: false,
    lastAnalysis: 0,
    overrideHistory: []
  });
  
  const monitoringIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const analysisIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Create context snapshot
  const createContextSnapshot = useCallback(() => {
    try {
      const snapshot: ContextSnapshot = {
        routeName: route?.name || null,
        routeParams: route?.params || null,
        navigationState: navigation?.getState ? navigation.getState() : null,
        contextDepth: navigation?.getState ? navigation.getState().routes.length : 0,
        timestamp: Date.now(),
        componentName
      };

      setDetectionState(prev => ({
        ...prev,
        contextSnapshots: new Map(prev.contextSnapshots).set(componentName, snapshot)
      }));

      return snapshot;
    } catch (error) {
      console.error('[ContextOverrideDetector] Failed to create snapshot:', error);
      return null;
    }
  }, [route?.name, route?.params, navigation, componentName]);

  // Detect overrides between parent and child contexts
  const detectOverrides = useCallback((parentSnapshot: ContextSnapshot, childSnapshot: ContextSnapshot) => {
    const overrides: ContextOverride[] = [];

    // Route name mismatch
    if (parentSnapshot.routeName !== childSnapshot.routeName) {
      overrides.push({
        id: `route-${Date.now()}`,
        type: 'route',
        parentSnapshot,
        childSnapshot,
        severity: 'high',
        description: `Route name mismatch: parent=${parentSnapshot.routeName}, child=${childSnapshot.routeName}`,
        recommendation: 'Ensure child component receives correct route context from parent',
        resolved: false,
        timestamp: Date.now()
      });
    }

    // Route params mismatch
    if (JSON.stringify(parentSnapshot.routeParams) !== JSON.stringify(childSnapshot.routeParams)) {
      overrides.push({
        id: `params-${Date.now()}`,
        type: 'params',
        parentSnapshot,
        childSnapshot,
        severity: 'medium',
        description: `Route params mismatch between parent and child components`,
        recommendation: 'Verify parameter passing through component hierarchy',
        resolved: false,
        timestamp: Date.now()
      });
    }

    // Navigation state mismatch
    if (parentSnapshot.navigationState !== childSnapshot.navigationState) {
      overrides.push({
        id: `state-${Date.now()}`,
        type: 'state',
        parentSnapshot,
        childSnapshot,
        severity: 'medium',
        description: `Navigation state mismatch between parent and child components`,
        recommendation: 'Check navigation state propagation through context',
        resolved: false,
        timestamp: Date.now()
      });
    }

    // Context depth mismatch
    if (Math.abs(parentSnapshot.contextDepth - childSnapshot.contextDepth) > 1) {
      overrides.push({
        id: `depth-${Date.now()}`,
        type: 'depth',
        parentSnapshot,
        childSnapshot,
        severity: 'low',
        description: `Context depth mismatch: parent=${parentSnapshot.contextDepth}, child=${childSnapshot.contextDepth}`,
        recommendation: 'Verify component nesting and context inheritance',
        resolved: false,
        timestamp: Date.now()
      });
    }

    return overrides;
  }, []);

  // Analyze component hierarchy for overrides
  const analyzeHierarchy = useCallback(() => {
    const snapshots = Array.from(detectionState.contextSnapshots.values());
    if (snapshots.length < 2) return;

    const newOverrides: ContextOverride[] = [];
    const parentSnapshot = snapshots[0]; // Assume first is parent

    // Compare parent with all other snapshots (children)
    for (let i = 1; i < snapshots.length; i++) {
      const childSnapshot = snapshots[i];
      const overrides = detectOverrides(parentSnapshot, childSnapshot);
      newOverrides.push(...overrides);
    }

    if (newOverrides.length > 0) {
      setDetectionState(prev => ({
        ...prev,
        detectedOverrides: [...prev.detectedOverrides, ...newOverrides],
        lastAnalysis: Date.now(),
        overrideHistory: [...prev.overrideHistory, `${newOverrides.length} overrides detected at ${new Date().toLocaleTimeString()}`]
      }));

      console.warn('[ContextOverrideDetector] Overrides detected:', newOverrides.length);
      newOverrides.forEach(override => {
        console.warn('[ContextOverrideDetector] Override:', override.description);
      });
    }
  }, [detectionState.contextSnapshots, detectOverrides]);

  // Resolve specific override
  const resolveOverride = useCallback((overrideId: string, resolution: string) => {
    setDetectionState(prev => {
      const override = prev.detectedOverrides.find(o => o.id === overrideId);
      if (!override) return prev;

      const resolvedOverride = { ...override, resolved: true, resolution };
      
      return {
        ...prev,
        detectedOverrides: prev.detectedOverrides.filter(o => o.id !== overrideId),
        resolvedOverrides: [...prev.resolvedOverrides, resolvedOverride]
      };
    });

    console.log('[ContextOverrideDetector] Override resolved:', overrideId, resolution);
  }, []);

  // Auto-resolve overrides based on severity
  const autoResolveOverrides = useCallback(() => {
    const lowSeverityOverrides = detectionState.detectedOverrides.filter(o => o.severity === 'low');
    
    lowSeverityOverrides.forEach(override => {
      resolveOverride(override.id, 'Auto-resolved: Low severity override');
    });
  }, [detectionState.detectedOverrides, resolveOverride]);

  // Clear resolved overrides
  const clearResolvedOverrides = useCallback(() => {
    setDetectionState(prev => ({
      ...prev,
      resolvedOverrides: []
    }));
  }, []);

  // Start monitoring
  const startMonitoring = useCallback(() => {
    setDetectionState(prev => ({ ...prev, isMonitoring: true }));
    
    // Create initial snapshot
    createContextSnapshot();
    
    // Set up monitoring intervals
    monitoringIntervalRef.current = setInterval(createContextSnapshot, 5000); // Every 5 seconds
    analysisIntervalRef.current = setInterval(analyzeHierarchy, 10000); // Every 10 seconds
    
    console.log('[ContextOverrideDetector] Monitoring started for:', componentName);
  }, [createContextSnapshot, analyzeHierarchy, componentName]);

  // Stop monitoring
  const stopMonitoring = useCallback(() => {
    setDetectionState(prev => ({ ...prev, isMonitoring: false }));
    
    if (monitoringIntervalRef.current) {
      clearInterval(monitoringIntervalRef.current);
      monitoringIntervalRef.current = null;
    }
    
    if (analysisIntervalRef.current) {
      clearInterval(analysisIntervalRef.current);
      analysisIntervalRef.current = null;
    }
    
    console.log('[ContextOverrideDetector] Monitoring stopped for:', componentName);
  }, [componentName]);

  // Start monitoring on mount
  useEffect(() => {
    startMonitoring();
    
    return () => {
      stopMonitoring();
    };
  }, [startMonitoring, stopMonitoring]);

  return {
    detectionState,
    startMonitoring,
    stopMonitoring,
    resolveOverride,
    clearResolvedOverrides,
    analyzeHierarchy,
    autoResolveOverrides
  };
}

export default function ContextOverrideDetector() {
  const { detectionState, startMonitoring, stopMonitoring, resolveOverride, clearResolvedOverrides } = useContextOverrideDetection('ContextOverrideDetector');
  const { detectedOverrides, resolvedOverrides, isMonitoring, lastAnalysis, overrideHistory } = detectionState;

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'red';
      case 'medium': return 'orange';
      case 'low': return 'yellow';
      default: return 'gray';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'high': return '🔴';
      case 'medium': return '🟡';
      case 'low': return '🟢';
      default: return '⚪';
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Context Override Detection</Text>
      
      <View style={styles.statusContainer}>
        <Text style={styles.statusText}>Status: {isMonitoring ? '🟢 Monitoring' : '🔴 Stopped'}</Text>
        <Text style={styles.statusText}>Active Overrides: {detectedOverrides.length}</Text>
        <Text style={styles.statusText}>Resolved Overrides: {resolvedOverrides.length}</Text>
        <Text style={styles.statusText}>
          Last Analysis: {lastAnalysis ? new Date(lastAnalysis).toLocaleTimeString() : 'Never'}
        </Text>
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
        
        <TouchableOpacity style={styles.clearButton} onPress={clearResolvedOverrides}>
          <Text style={styles.clearButtonText}>Clear Resolved</Text>
        </TouchableOpacity>
      </View>

      {detectedOverrides.length > 0 && (
        <View style={styles.overridesContainer}>
          <Text style={styles.overridesTitle}>Active Overrides ({detectedOverrides.length})</Text>
          {detectedOverrides.map((override, index) => (
            <View key={override.id} style={styles.overrideItem}>
              <View style={styles.overrideHeader}>
                <Text style={styles.overrideType}>{getSeverityIcon(override.severity)} {override.type.toUpperCase()}</Text>
                <Text style={[styles.overrideSeverity, { color: getSeverityColor(override.severity) }]}>{
                  {override.severity.toUpperCase()}
                </Text>
              </View>
              <Text style={styles.overrideDescription}>{override.description}</Text>
              <Text style={styles.overrideRecommendation}>💡 {override.recommendation}</Text>
              <Text style={styles.overrideTime}>
                {new Date(override.timestamp).toLocaleTimeString()}
              </Text>
              <TouchableOpacity 
                style={styles.resolveButton} 
                onPress={() => resolveOverride(override.id, 'Manually resolved')}
              >
                <Text style={styles.resolveButtonText}>Mark Resolved</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}

      {resolvedOverrides.length > 0 && (
        <View style={styles.resolvedContainer}>
          <Text style={styles.resolvedTitle}>Resolved Overrides ({resolvedOverrides.length})</Text>
          {resolvedOverrides.slice(-5).map((override, index) => (
            <View key={override.id} style={styles.resolvedItem}>
              <Text style={styles.resolvedType}>✅ {override.type.toUpperCase()}</Text>
              <Text style={styles.resolvedDescription}>{override.description}</Text>
              <Text style={styles.resolvedResolution}>Resolution: {override.resolution}</Text>
              <Text style={styles.resolvedTime}>
                {new Date(override.timestamp).toLocaleTimeString()}
              </Text>
            </View>
          ))}
        </View>
      )}

      {overrideHistory.length > 0 && (
        <View style={styles.historyContainer}>
          <Text style={styles.historyTitle}>Override History</Text>
          {overrideHistory.slice(-10).map((entry, index) => (
            <Text key={index} style={styles.historyEntry}>• {entry}</Text>
          ))}
        </View>
      )}

      {detectedOverrides.length === 0 && resolvedOverrides.length === 0 && (
        <View style={styles.noOverridesContainer}>
          <Text style={styles.noOverridesText}>✅ No context overrides detected</Text>
          <Text style={styles.noOverridesSubtext}>All components have consistent context inheritance</Text>
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
  overridesContainer: {
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
  overridesTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'red'
  },
  overrideItem: {
    marginBottom: 15,
    padding: 12,
    backgroundColor: '#fff3cd',
    borderRadius: 6
  },
  overrideHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8
  },
  overrideType: {
    fontSize: 14,
    fontWeight: 'bold'
  },
  overrideSeverity: {
    fontSize: 12,
    fontWeight: 'bold'
  },
  overrideDescription: {
    fontSize: 14,
    color: '#333',
    marginBottom: 5
  },
  overrideRecommendation: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
    marginBottom: 5
  },
  overrideTime: {
    fontSize: 10,
    color: '#999',
    marginBottom: 8
  },
  resolveButton: {
    backgroundColor: '#007AFF',
    padding: 8,
    borderRadius: 4,
    alignItems: 'center'
  },
  resolveButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold'
  },
  resolvedContainer: {
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
  resolvedTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'green'
  },
  resolvedItem: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#e8f5e8',
    borderRadius: 5
  },
  resolvedType: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'green',
    marginBottom: 5
  },
  resolvedDescription: {
    fontSize: 14,
    color: '#333',
    marginBottom: 3
  },
  resolvedResolution: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
    marginBottom: 3
  },
  resolvedTime: {
    fontSize: 10,
    color: '#999'
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
  historyEntry: {
    fontSize: 12,
    color: '#666',
    marginBottom: 3
  },
  noOverridesContainer: {
    backgroundColor: '#e8f5e8',
    padding: 20,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  noOverridesText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'green',
    marginBottom: 5
  },
  noOverridesSubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center'
  }
}); 