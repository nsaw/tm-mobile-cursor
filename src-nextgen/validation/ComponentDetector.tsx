import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

declare const console: any;

interface ComponentInfo {
  name: string;
  path: string;
  type: 'component' | 'hook' | 'utility';
  size: number;
  lastModified: number;
  dependencies: string[];
}

interface DuplicateGroup {
  name: string;
  components: ComponentInfo[];
  severity: 'low' | 'medium' | 'high';
  recommendation: string;
}

interface DetectionResult {
  totalComponents: number;
  duplicateGroups: DuplicateGroup[];
  potentialIssues: string[];
  scanTime: number;
}

export function useComponentDetection() {
  const [detectionResult, setDetectionResult] = useState<DetectionResult>({
    totalComponents: 0,
    duplicateGroups: [],
    potentialIssues: [],
    scanTime: 0
  });
  const [isScanning, setIsScanning] = useState(false);

  const scanForDuplicates = async () => {
    setIsScanning(true);
    const startTime = Date.now();
    
    try {
      // Simulate component scanning
      const mockComponents: ComponentInfo[] = [
        {
          name: 'SlotGrid',
          path: 'src-nextgen/components/SlotGrid.tsx',
          type: 'component',
          size: 1024,
          lastModified: Date.now() - 3600000,
          dependencies: ['slotSelector', 'useSlotQuery']
        },
        {
          name: 'ContextValidator',
          path: 'src-nextgen/navigation/ContextValidator.tsx',
          type: 'component',
          size: 2048,
          lastModified: Date.now() - 1800000,
          dependencies: ['useRoute', 'useNavigation']
        },
        {
          name: 'ContextValidator',
          path: 'src-nextgen/validation/ContextValidator.tsx',
          type: 'component',
          size: 1536,
          lastModified: Date.now() - 900000,
          dependencies: ['useRoute', 'useNavigation']
        }
      ];

      // Group by name to find duplicates
      const componentGroups = new Map<string, ComponentInfo[]>();
      mockComponents.forEach(component => {
        if (!componentGroups.has(component.name)) {
          componentGroups.set(component.name, []);
        }
        componentGroups.get(component.name)!.push(component);
      });

      // Identify duplicates
      const duplicateGroups: DuplicateGroup[] = [];
      const potentialIssues: string[] = [];

      componentGroups.forEach((components, name) => {
        if (components.length > 1) {
          const severity = components.length > 2 ? 'high' : 'medium';
          const recommendation = components.length > 2 
            ? 'Multiple duplicates detected. Consider consolidating into a shared component.'
            : 'Duplicate detected. Review for potential consolidation.';

          duplicateGroups.push({
            name,
            components,
            severity,
            recommendation
          });

          potentialIssues.push(
            `Duplicate component '${name}' found in ${components.length} locations`
          );
        }
      });

      const scanTime = Date.now() - startTime;
      const result: DetectionResult = {
        totalComponents: mockComponents.length,
        duplicateGroups,
        potentialIssues,
        scanTime
      };

      setDetectionResult(result);

      console.log('[ComponentDetector] Scan completed:', {
        totalComponents: result.totalComponents,
        duplicateGroups: result.duplicateGroups.length,
        scanTime: result.scanTime
      });

    } catch (error) {
      console.error('[ComponentDetector] Scan failed:', error);
      setDetectionResult(prev => ({
        ...prev,
        potentialIssues: [...prev.potentialIssues, `Scan error: ${error}`]
      }));
    } finally {
      setIsScanning(false);
    }
  };

  useEffect(() => {
    scanForDuplicates();
  }, []);

  return { detectionResult, isScanning, scanForDuplicates };
}

export default function ComponentDetector() {
  const { detectionResult, isScanning } = useComponentDetection();

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Component Duplicate Detector</Text>
      
      {isScanning && (
        <Text style={styles.scanning}>Scanning for duplicates...</Text>
      )}

      <View style={styles.summaryContainer}>
        <Text style={styles.summaryTitle}>Scan Summary</Text>
        <Text style={styles.summaryText}>Total Components: {detectionResult.totalComponents}</Text>
        <Text style={styles.summaryText}>Duplicate Groups: {detectionResult.duplicateGroups.length}</Text>
        <Text style={styles.summaryText}>Scan Time: {detectionResult.scanTime}ms</Text>
      </View>

      {detectionResult.duplicateGroups.length > 0 && (
        <View style={styles.duplicatesContainer}>
          <Text style={styles.duplicatesTitle}>Duplicate Components</Text>
          {detectionResult.duplicateGroups.map((group, index) => (
            <View key={index} style={styles.duplicateGroup}>
              <Text style={[styles.groupName, styles[group.severity]]}>
                {group.name} ({group.components.length} instances)
              </Text>
              <Text style={styles.recommendation}>{group.recommendation}</Text>
              {group.components.map((component, compIndex) => (
                <View key={compIndex} style={styles.componentInfo}>
                  <Text style={styles.componentPath}>{component.path}</Text>
                  <Text style={styles.componentDetails}>
                    Size: {component.size} bytes | Type: {component.type}
                  </Text>
                </View>
              ))}
            </View>
          ))}
        </View>
      )}

      {detectionResult.potentialIssues.length > 0 && (
        <View style={styles.issuesContainer}>
          <Text style={styles.issuesTitle}>Potential Issues</Text>
          {detectionResult.potentialIssues.map((issue, index) => (
            <Text key={index} style={styles.issueText}>• {issue}</Text>
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
  scanning: {
    fontSize: 14,
    color: 'blue',
    textAlign: 'center',
    marginBottom: 10
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
    marginBottom: 5
  },
  duplicatesContainer: {
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
  duplicatesTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'red'
  },
  duplicateGroup: {
    marginBottom: 15,
    padding: 10,
    backgroundColor: '#fff5f5',
    borderRadius: 5
  },
  groupName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5
  },
  low: {
    color: 'orange'
  },
  medium: {
    color: 'red'
  },
  high: {
    color: 'darkred'
  },
  recommendation: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
    marginBottom: 10
  },
  componentInfo: {
    marginLeft: 10,
    marginBottom: 5
  },
  componentPath: {
    fontSize: 12,
    fontFamily: 'monospace',
    color: '#333'
  },
  componentDetails: {
    fontSize: 11,
    color: '#666',
    marginLeft: 10
  },
  issuesContainer: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  issuesTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'orange'
  },
  issueText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 5
  }
}); 