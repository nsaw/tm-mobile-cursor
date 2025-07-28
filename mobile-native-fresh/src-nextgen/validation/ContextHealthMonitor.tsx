import * as React from 'react';
import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const console: any;
declare const setInterval: any;
declare const clearInterval: any;

interface ContextHealthMetric {
  name: string;
  value: number;
  unit: string;
  status: 'healthy' | 'warning' | 'critical';
  threshold: number;
}

interface ContextHealthReport {
  timestamp: number;
  metrics: ContextHealthMetric[];
  overallHealth: 'healthy' | 'warning' | 'critical';
  recommendations: string[];
}

export function useContextHealthMonitor() {
  const [healthReport, setHealthReport] = useState<ContextHealthReport>({
    timestamp: Date.now(),
    metrics: [],
    overallHealth: 'healthy',
    recommendations: []
  });
  const [isMonitoring, setIsMonitoring] = useState(false);

  const generateHealthMetrics = async () => {
    setIsMonitoring(true);
    
    try {
      // Simulate health metrics collection
      const metrics: ContextHealthMetric[] = [
        {
          name: 'Context Provider Count',
          value: 3,
          unit: 'providers',
          status: 'healthy',
          threshold: 10
        },
        {
          name: 'Context Consumer Count',
          value: 8,
          unit: 'consumers',
          status: 'healthy',
          threshold: 20
        },
        {
          name: 'Context Nesting Depth',
          value: 4,
          unit: 'levels',
          status: 'warning',
          threshold: 3
        },
        {
          name: 'Orphaned Consumers',
          value: 1,
          unit: 'components',
          status: 'critical',
          threshold: 0
        },
        {
          name: 'Context Re-render Rate',
          value: 15,
          unit: 're-renders/min',
          status: 'healthy',
          threshold: 30
        },
        {
          name: 'Context Memory Usage',
          value: 2.5,
          unit: 'MB',
          status: 'healthy',
          threshold: 10
        }
      ];

      // Calculate overall health
      const criticalCount = metrics.filter(m => m.status === 'critical').length;
      const warningCount = metrics.filter(m => m.status === 'warning').length;
      
      let overallHealth: 'healthy' | 'warning' | 'critical' = 'healthy';
      if (criticalCount > 0) {
        overallHealth = 'critical';
      } else if (warningCount > 0) {
        overallHealth = 'warning';
      }

      // Generate recommendations
      const recommendations: string[] = [];
      
      const orphanedMetric = metrics.find(m => m.name === 'Orphaned Consumers');
      if (orphanedMetric && orphanedMetric.value > 0) {
        recommendations.push('Fix orphaned consumers by ensuring proper provider placement');
      }

      const nestingMetric = metrics.find(m => m.name === 'Context Nesting Depth');
      if (nestingMetric && nestingMetric.value > nestingMetric.threshold) {
        recommendations.push('Consider reducing context nesting depth to improve performance');
      }

      const reRenderMetric = metrics.find(m => m.name === 'Context Re-render Rate');
      if (reRenderMetric && reRenderMetric.value > reRenderMetric.threshold * 0.8) {
        recommendations.push('Monitor context re-render rate for potential optimization');
      }

      const report: ContextHealthReport = {
        timestamp: Date.now(),
        metrics,
        overallHealth,
        recommendations
      };

      setHealthReport(report);

      console.log('[ContextHealthMonitor] Health report generated:', {
        overallHealth: report.overallHealth,
        metricsCount: report.metrics.length,
        recommendationsCount: report.recommendations.length
      });

    } catch (error) {
      console.error('[ContextHealthMonitor] Health monitoring failed:', error);
    } finally {
      setIsMonitoring(false);
    }
  };

  useEffect(() => {
    generateHealthMetrics();
    
    // Set up periodic monitoring
    const interval = setInterval(generateHealthMetrics, 30000); // Every 30 seconds
    
    return () => clearInterval(interval);
  }, []);

  return { healthReport, isMonitoring, generateHealthMetrics };
}

export default function ContextHealthMonitor() {
  const { healthReport, isMonitoring } = useContextHealthMonitor();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'green';
      case 'warning': return 'orange';
      case 'critical': return 'red';
      default: return 'gray';
    }
  };

  const getOverallHealthIcon = () => {
    switch (healthReport.overallHealth) {
      case 'healthy': return '🟢';
      case 'warning': return '🟡';
      case 'critical': return '🔴';
      default: return '⚪';
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Context Health Monitor</Text>
      
      {isMonitoring && (
        <Text style={styles.monitoring}>Monitoring context health...</Text>
      )}

      <View style={styles.overallHealthContainer}>
        <Text style={styles.overallHealthTitle}>Overall Health</Text>
        <Text style={styles.overallHealthStatus}>
          {getOverallHealthIcon()} {healthReport.overallHealth.toUpperCase()}
        </Text>
        <Text style={styles.timestamp}>
          Last updated: {new Date(healthReport.timestamp).toLocaleTimeString()}
        </Text>
      </View>

      <View style={styles.metricsContainer}>
        <Text style={styles.metricsTitle}>Health Metrics</Text>
        {healthReport.metrics.map((metric, index) => (
          <View key={index} style={styles.metricItem}>
            <View style={styles.metricHeader}>
              <Text style={styles.metricName}>{metric.name}</Text>
              <Text style={[styles.metricStatus, { color: getStatusColor(metric.status) }]}>
                {metric.status === 'healthy' ? '🟢' : metric.status === 'warning' ? '🟡' : '🔴'} {metric.status}
              </Text>
            </View>
            <Text style={styles.metricValue}>
              {metric.value} {metric.unit}
            </Text>
            <Text style={styles.metricThreshold}>
              Threshold: {metric.threshold} {metric.unit}
            </Text>
          </View>
        ))}
      </View>

      {healthReport.recommendations.length > 0 && (
        <View style={styles.recommendationsContainer}>
          <Text style={styles.recommendationsTitle}>Recommendations</Text>
          {healthReport.recommendations.map((recommendation, index) => (
            <Text key={index} style={styles.recommendationText}>• {recommendation}</Text>
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
    marginBottom: 15,
    textAlign: 'center'
  },
  monitoring: {
    fontSize: 14,
    color: 'blue',
    textAlign: 'center',
    marginBottom: 10
  },
  overallHealthContainer: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    alignItems: 'center'
  },
  overallHealthTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5
  },
  overallHealthStatus: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5
  },
  timestamp: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic'
  },
  metricsContainer: {
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
  metricsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10
  },
  metricItem: {
    marginBottom: 15,
    padding: 10,
    backgroundColor: '#f8f9fa',
    borderRadius: 5
  },
  metricHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5
  },
  metricName: {
    fontSize: 14,
    fontWeight: 'bold',
    flex: 1
  },
  metricStatus: {
    fontSize: 12,
    fontWeight: 'bold'
  },
  metricValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 2
  },
  metricThreshold: {
    fontSize: 12,
    color: '#666'
  },
  recommendationsContainer: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  recommendationsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'orange'
  },
  recommendationText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 5
  }
}); 