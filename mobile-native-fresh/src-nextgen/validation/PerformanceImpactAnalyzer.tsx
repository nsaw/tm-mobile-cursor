import * as React from 'react';
import { useEffect, useState, useCallback, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const console: any;
declare const performance: any;
declare const setInterval: any;
declare const clearInterval: any;
declare const window: any;

interface PerformanceMetrics {
  renderTime: number;
  memoryUsage: number;
  reRenderCount: number;
  bundleSize: number;
  cpuUsage: number;
  timestamp: number;
}

interface ComponentPerformance {
  name: string;
  path: string;
  metrics: PerformanceMetrics;
  impact: 'low' | 'medium' | 'high' | 'critical';
  recommendations: string[];
}

interface PerformanceReport {
  totalComponents: number;
  highImpactComponents: ComponentPerformance[];
  memoryLeaks: string[];
  performanceBottlenecks: string[];
  optimizationOpportunities: string[];
  overallScore: number;
  timestamp: number;
}

export function usePerformanceImpactAnalyzer() {
  const [performanceReport, setPerformanceReport] = useState<PerformanceReport>({
    totalComponents: 0,
    highImpactComponents: [],
    memoryLeaks: [],
    performanceBottlenecks: [],
    optimizationOpportunities: [],
    overallScore: 0,
    timestamp: 0
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentMetrics, setCurrentMetrics] = useState<PerformanceMetrics[]>([]);
  
  const metricsIntervalRef = useRef<any>(null);
  const renderCountRef = useRef<Map<string, number>>(new Map());

  // Measure render time for a component
  const measureRenderTime = useCallback((componentName: string) => {
    const startTime = performance.now();
    
    return () => {
      const endTime = performance.now();
      const renderTime = endTime - startTime;
      
      // Update render count
      const currentCount = renderCountRef.current.get(componentName) || 0;
      renderCountRef.current.set(componentName, currentCount + 1);
      
      console.log(`[PerformanceAnalyzer] ${componentName} render time: ${renderTime.toFixed(2)}ms`);
      return renderTime;
    };
  }, []);

  // Measure memory usage
  const measureMemoryUsage = useCallback(() => {
    try {
      if (typeof window !== 'undefined' && window.performance?.memory) {
        const memory = window.performance.memory;
        return {
          usedJSHeapSize: memory.usedJSHeapSize,
          totalJSHeapSize: memory.totalJSHeapSize,
          jsHeapSizeLimit: memory.jsHeapSizeLimit
        };
      }
      return null;
    } catch (error) {
      console.error('[PerformanceAnalyzer] Memory measurement failed:', error);
      return null;
    }
  }, []);



  // Calculate performance impact
  const calculateImpact = useCallback((metrics: PerformanceMetrics): 'low' | 'medium' | 'high' | 'critical' => {
    let score = 0;
    
    // Render time impact (0-40 points)
    if (metrics.renderTime > 100) score += 40;
    else if (metrics.renderTime > 50) score += 20;
    else if (metrics.renderTime > 20) score += 10;
    
    // Memory usage impact (0-30 points)
    const memoryPercentage = (metrics.memoryUsage / metrics.bundleSize) * 100;
    if (memoryPercentage > 50) score += 30;
    else if (memoryPercentage > 25) score += 20;
    else if (memoryPercentage > 10) score += 10;
    
    // Re-render impact (0-20 points)
    if (metrics.reRenderCount > 10) score += 20;
    else if (metrics.reRenderCount > 5) score += 15;
    else if (metrics.reRenderCount > 2) score += 10;
    
    // Bundle size impact (0-10 points)
    if (metrics.bundleSize > 5000) score += 10;
    else if (metrics.bundleSize > 2000) score += 5;
    
    if (score >= 80) return 'critical';
    if (score >= 60) return 'high';
    if (score >= 30) return 'medium';
    return 'low';
  }, []);

  // Generate optimization recommendations
  const generateRecommendations = useCallback((metrics: PerformanceMetrics, componentName: string): string[] => {
    const recommendations: string[] = [];
    
    if (metrics.renderTime > 50) {
      recommendations.push(`Optimize render performance for ${componentName} (${metrics.renderTime.toFixed(2)}ms)`);
    }
    
    if (metrics.reRenderCount > 5) {
      recommendations.push(`Reduce re-renders for ${componentName} (${metrics.reRenderCount} re-renders detected)`);
    }
    
    if (metrics.bundleSize > 2000) {
      recommendations.push(`Consider code splitting for ${componentName} (${metrics.bundleSize} bytes)`);
    }
    
    if (metrics.memoryUsage > 1000000) {
      recommendations.push(`Optimize memory usage for ${componentName} (${(metrics.memoryUsage / 1024 / 1024).toFixed(2)} MB)`);
    }
    
    return recommendations;
  }, []);

  // Analyze performance impact
  const analyzePerformanceImpact = useCallback(async () => {
    setIsAnalyzing(true);
    const startTime = Date.now();
    
    try {
      // Simulate component performance analysis
      const mockComponents: ComponentPerformance[] = [
        {
          name: 'SlotGrid',
          path: 'src-nextgen/components/SlotGrid.tsx',
          metrics: {
            renderTime: 45.2,
            memoryUsage: 2048576,
            reRenderCount: 3,
            bundleSize: 2048,
            cpuUsage: 15.5,
            timestamp: Date.now()
          },
          impact: 'medium',
          recommendations: []
        },
        {
          name: 'ContextValidator',
          path: 'src-nextgen/navigation/ContextValidator.tsx',
          metrics: {
            renderTime: 12.8,
            memoryUsage: 1048576,
            reRenderCount: 1,
            bundleSize: 1536,
            cpuUsage: 8.2,
            timestamp: Date.now()
          },
          impact: 'low',
          recommendations: []
        },
        {
          name: 'NavigationManager',
          path: 'src-nextgen/navigation/NavigationManager.tsx',
          metrics: {
            renderTime: 125.6,
            memoryUsage: 5242880,
            reRenderCount: 8,
            bundleSize: 4096,
            cpuUsage: 45.3,
            timestamp: Date.now()
          },
          impact: 'high',
          recommendations: []
        }
      ];

      // Calculate impact and generate recommendations
      const analyzedComponents = mockComponents.map(component => {
        const impact = calculateImpact(component.metrics);
        const recommendations = generateRecommendations(component.metrics, component.name);
        
        return {
          ...component,
          impact,
          recommendations
        };
      });

      // Identify high impact components
      const highImpactComponents = analyzedComponents.filter(c => c.impact === 'high' || c.impact === 'critical');
      
      // Identify potential memory leaks
      const memoryLeaks = analyzedComponents
        .filter(c => c.metrics.memoryUsage > 5000000)
        .map(c => `Potential memory leak in ${c.name}: ${(c.metrics.memoryUsage / 1024 / 1024).toFixed(2)} MB`);
      
      // Identify performance bottlenecks
      const performanceBottlenecks = analyzedComponents
        .filter(c => c.metrics.renderTime > 100)
        .map(c => `Performance bottleneck in ${c.name}: ${c.metrics.renderTime.toFixed(2)}ms render time`);
      
      // Generate optimization opportunities
      const optimizationOpportunities = analyzedComponents
        .flatMap(c => c.recommendations);
      
      // Calculate overall performance score
      const totalScore = analyzedComponents.reduce((sum, c) => {
        const impactScores = { low: 0, medium: 25, high: 50, critical: 75 };
        return sum + impactScores[c.impact];
      }, 0);
      
      const overallScore = Math.max(0, 100 - (totalScore / analyzedComponents.length));

      const report: PerformanceReport = {
        totalComponents: analyzedComponents.length,
        highImpactComponents,
        memoryLeaks,
        performanceBottlenecks,
        optimizationOpportunities,
        overallScore,
        timestamp: Date.now()
      };

      setPerformanceReport(report);
      setCurrentMetrics(analyzedComponents.map(c => c.metrics));

      console.log('[PerformanceAnalyzer] Analysis completed:', {
        totalComponents: report.totalComponents,
        highImpactComponents: report.highImpactComponents.length,
        overallScore: report.overallScore,
        analysisTime: Date.now() - startTime
      });

    } catch (error) {
      console.error('[PerformanceAnalyzer] Analysis failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  }, [calculateImpact, generateRecommendations]);

  // Continuous performance monitoring
  useEffect(() => {
    const memory = measureMemoryUsage();
    if (memory) {
      const metrics: PerformanceMetrics = {
        renderTime: 0,
        memoryUsage: memory.usedJSHeapSize,
        reRenderCount: 0,
        bundleSize: 0,
        cpuUsage: 0,
        timestamp: Date.now()
      };
      
      setCurrentMetrics(prev => [...prev.slice(-50), metrics]);
    }

    metricsIntervalRef.current = setInterval(() => {
      const memory = measureMemoryUsage();
      if (memory) {
        const metrics: PerformanceMetrics = {
          renderTime: 0,
          memoryUsage: memory.usedJSHeapSize,
          reRenderCount: 0,
          bundleSize: 0,
          cpuUsage: 0,
          timestamp: Date.now()
        };
        
        setCurrentMetrics(prev => [...prev.slice(-50), metrics]);
      }
    }, 5000); // Every 5 seconds

    return () => {
      if (metricsIntervalRef.current) {
        clearInterval(metricsIntervalRef.current);
      }
    };
  }, [measureMemoryUsage]);

  // Initial analysis
  useEffect(() => {
    analyzePerformanceImpact();
  }, [analyzePerformanceImpact]);

  return {
    performanceReport,
    currentMetrics,
    isAnalyzing,
    measureRenderTime,
    analyzePerformanceImpact
  };
}

export default function PerformanceImpactAnalyzer() {
  const { performanceReport, currentMetrics, isAnalyzing } = usePerformanceImpactAnalyzer();
  const latestMetrics = currentMetrics[currentMetrics.length - 1];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Performance Impact Analyzer</Text>
      
      {isAnalyzing && (
        <Text style={styles.analyzing}>Analyzing performance impact...</Text>
      )}

      <View style={styles.scoreContainer}>
        <Text style={styles.scoreTitle}>Overall Performance Score</Text>
        <Text style={[styles.scoreValue, performanceReport.overallScore >= 80 ? styles.scoreGood : performanceReport.overallScore >= 60 ? styles.scoreMedium : styles.scorePoor]}>
          {performanceReport.overallScore.toFixed(1)}%
        </Text>
        <Text style={styles.scoreDescription}>
          {performanceReport.overallScore >= 80 ? 'Excellent' : 
           performanceReport.overallScore >= 60 ? 'Good' : 
           performanceReport.overallScore >= 40 ? 'Fair' : 'Poor'
          }
        </Text>
      </View>

      <View style={styles.summaryContainer}>
        <Text style={styles.summaryTitle}>Analysis Summary</Text>
        <Text style={styles.summaryText}>Total Components: {performanceReport.totalComponents}</Text>
        <Text style={styles.summaryText}>High Impact: {performanceReport.highImpactComponents.length}</Text>
        <Text style={styles.summaryText}>Memory Leaks: {performanceReport.memoryLeaks.length}</Text>
        <Text style={styles.summaryText}>Bottlenecks: {performanceReport.performanceBottlenecks.length}</Text>
        <Text style={styles.summaryText}>Optimizations: {performanceReport.optimizationOpportunities.length}</Text>
      </View>

      {latestMetrics && (
        <View style={styles.metricsContainer}>
          <Text style={styles.metricsTitle}>Current Metrics</Text>
          <Text style={styles.metricText}>Memory Usage: {(latestMetrics.memoryUsage / 1024 / 1024).toFixed(2)} MB</Text>
          <Text style={styles.metricText}>Render Time: {latestMetrics.renderTime.toFixed(2)}ms</Text>
          <Text style={styles.metricText}>Re-render Count: {latestMetrics.reRenderCount}</Text>
          <Text style={styles.metricText}>Bundle Size: {(latestMetrics.bundleSize / 1024).toFixed(2)} KB</Text>
        </View>
      )}

      {performanceReport.highImpactComponents.length > 0 && (
        <View style={styles.highImpactContainer}>
          <Text style={styles.highImpactTitle}>High Impact Components</Text>
          {performanceReport.highImpactComponents.map((component, index) => (
            <View key={index} style={styles.componentItem}>
              <Text style={[styles.componentName, styles[component.impact]]}>
                {component.name} ({component.impact.toUpperCase()})
              </Text>
              <Text style={styles.componentPath}>{component.path}</Text>
              <Text style={styles.componentMetrics}>
                Render: {component.metrics.renderTime.toFixed(2)}ms | 
                Memory: {(component.metrics.memoryUsage / 1024 / 1024).toFixed(2)}MB | 
                Re-renders: {component.metrics.reRenderCount}
              </Text>
              {component.recommendations.map((rec, recIndex) => (
                <Text key={recIndex} style={styles.recommendation}>• {rec}</Text>
              ))}
            </View>
          ))}
        </View>
      )}

      {performanceReport.memoryLeaks.length > 0 && (
        <View style={styles.leaksContainer}>
          <Text style={styles.leaksTitle}>Potential Memory Leaks</Text>
          {performanceReport.memoryLeaks.map((leak, index) => (
            <Text key={index} style={styles.leakText}>⚠️ {leak}</Text>
          ))}
        </View>
      )}

      {performanceReport.performanceBottlenecks.length > 0 && (
        <View style={styles.bottlenecksContainer}>
          <Text style={styles.bottlenecksTitle}>Performance Bottlenecks</Text>
          {performanceReport.performanceBottlenecks.map((bottleneck, index) => (
            <Text key={index} style={styles.bottleneckText}>🐌 {bottleneck}</Text>
          ))}
        </View>
      )}

      {performanceReport.optimizationOpportunities.length > 0 && (
        <View style={styles.optimizationsContainer}>
          <Text style={styles.optimizationsTitle}>Optimization Opportunities</Text>
          {performanceReport.optimizationOpportunities.slice(0, 10).map((opportunity, index) => (
            <Text key={index} style={styles.optimizationText}>💡 {opportunity}</Text>
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
  analyzing: {
    fontSize: 14,
    color: 'blue',
    textAlign: 'center',
    marginBottom: 10
  },
  scoreContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 8,
    marginBottom: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  scoreTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10
  },
  scoreValue: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 5
  },
  scoreGood: {
    color: '#4caf50'
  },
  scoreMedium: {
    color: '#ff9800'
  },
  scorePoor: {
    color: '#f44336'
  },
  scoreDescription: {
    fontSize: 14,
    color: '#666'
  },
  summaryContainer: {
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
  summaryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10
  },
  summaryText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 5
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
  metricText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 5
  },
  highImpactContainer: {
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
  highImpactTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'red'
  },
  componentItem: {
    marginBottom: 15,
    padding: 10,
    backgroundColor: '#fff5f5',
    borderRadius: 5
  },
  componentName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5
  },
  high: {
    color: 'red'
  },
  critical: {
    color: 'darkred'
  },
  low: {
    color: '#4caf50'
  },
  medium: {
    color: '#ff9800'
  },
  componentPath: {
    fontSize: 12,
    fontFamily: 'monospace',
    color: '#666',
    marginBottom: 5
  },
  componentMetrics: {
    fontSize: 12,
    color: '#333',
    marginBottom: 5
  },
  recommendation: {
    fontSize: 12,
    color: '#666',
    marginLeft: 10,
    marginBottom: 2
  },
  leaksContainer: {
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
  leaksTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'orange'
  },
  leakText: {
    fontSize: 14,
    color: 'orange',
    marginBottom: 5
  },
  bottlenecksContainer: {
    backgroundColor: '#ffe6e6',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  bottlenecksTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'red'
  },
  bottleneckText: {
    fontSize: 14,
    color: 'red',
    marginBottom: 5
  },
  optimizationsContainer: {
    backgroundColor: '#e8f5e8',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  optimizationsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#2e7d32'
  },
  optimizationText: {
    fontSize: 14,
    color: '#2e7d32',
    marginBottom: 5
  }
}); 