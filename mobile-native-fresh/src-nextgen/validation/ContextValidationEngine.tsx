import * as React from 'react';
import { useEffect, useState, createContext, useContext } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const console: any;

interface ContextNode {
  id: string;
  type: 'provider' | 'consumer' | 'hook';
  name: string;
  path: string;
  dependencies: string[];
  isValid: boolean;
  errors: string[];
  children: ContextNode[];
}

interface ContextValidationResult {
  rootNodes: ContextNode[];
  totalNodes: number;
  validNodes: number;
  invalidNodes: number;
  circularDependencies: string[];
  orphanedConsumers: string[];
  validationTime: number;
}

// Create a test context for validation
const TestContext = createContext<any>(null);

function TestProvider({ children }: { children: React.ReactNode }) {
  return (
    <TestContext.Provider value={{ test: 'value' }}>
      {children}
    </TestContext.Provider>
  );
}

function TestConsumer() {
  const context = useContext(TestContext);
  return <Text>Context: {context?.test || 'undefined'}</Text>;
}

export function useContextValidationEngine() {
  const [validationResult, setValidationResult] = useState<ContextValidationResult>({
    rootNodes: [],
    totalNodes: 0,
    validNodes: 0,
    invalidNodes: 0,
    circularDependencies: [],
    orphanedConsumers: [],
    validationTime: 0
  });
  const [isValidating, setIsValidating] = useState(false);

  const validateContextTree = async () => {
    setIsValidating(true);
    const startTime = Date.now();
    
    try {
      // Simulate context tree analysis
      const mockContextTree: ContextNode[] = [
        {
          id: 'nav-provider',
          type: 'provider',
          name: 'NavigationContextProvider',
          path: 'src-nextgen/navigation/ContextProvider.tsx',
          dependencies: ['useRoute', 'useNavigation'],
          isValid: true,
          errors: [],
          children: [
            {
              id: 'slot-bridge',
              type: 'consumer',
              name: 'SlotBridge',
              path: 'src-nextgen/navigation/SlotBridge.tsx',
              dependencies: ['useRoute', 'useNavigation'],
              isValid: true,
              errors: [],
              children: []
            },
            {
              id: 'context-validator',
              type: 'consumer',
              name: 'ContextValidator',
              path: 'src-nextgen/navigation/ContextValidator.tsx',
              dependencies: ['useRoute', 'useNavigation'],
              isValid: true,
              errors: [],
              children: []
            }
          ]
        },
        {
          id: 'orphaned-consumer',
          type: 'consumer',
          name: 'OrphanedComponent',
          path: 'src-nextgen/components/OrphanedComponent.tsx',
          dependencies: ['useNavigationContext'],
          isValid: false,
          errors: ['No provider found in component tree'],
          children: []
        }
      ];

      // Analyze the context tree
      let totalNodes = 0;
      let validNodes = 0;
      let invalidNodes = 0;
      const circularDependencies: string[] = [];
      const orphanedConsumers: string[] = [];

      const analyzeNode = (node: ContextNode, visited: Set<string> = new Set()) => {
        totalNodes++;
        
        if (node.isValid) {
          validNodes++;
        } else {
          invalidNodes++;
          if (node.type === 'consumer' && node.errors.includes('No provider found')) {
            orphanedConsumers.push(node.name);
          }
        }

        // Check for circular dependencies
        if (visited.has(node.id)) {
          circularDependencies.push(node.name);
        } else {
          visited.add(node.id);
          node.children.forEach(child => analyzeNode(child, new Set(visited)));
        }
      };

      mockContextTree.forEach(node => analyzeNode(node));

      const validationTime = Date.now() - startTime;
      const result: ContextValidationResult = {
        rootNodes: mockContextTree,
        totalNodes,
        validNodes,
        invalidNodes,
        circularDependencies,
        orphanedConsumers,
        validationTime
      };

      setValidationResult(result);

      console.log('[ContextValidationEngine] Validation completed:', {
        totalNodes: result.totalNodes,
        validNodes: result.validNodes,
        invalidNodes: result.invalidNodes,
        circularDependencies: result.circularDependencies.length,
        orphanedConsumers: result.orphanedConsumers.length,
        validationTime: result.validationTime
      });

    } catch (error) {
      console.error('[ContextValidationEngine] Validation failed:', error);
    } finally {
      setIsValidating(false);
    }
  };

  useEffect(() => {
    validateContextTree();
  }, []);

  return { validationResult, isValidating, validateContextTree };
}

function ContextNodeDisplay({ node, level = 0 }: { node: ContextNode; level?: number }) {
  const indent = '  '.repeat(level);
  
  return (
    <View style={[styles.nodeContainer, { marginLeft: level * 20 }]}>
      <Text style={[styles.nodeName, node.isValid ? styles.validNode : styles.invalidNode]}>
        {`${indent}${node.type === 'provider' ? '🔵' : node.type === 'consumer' ? '🟡' : '🟢'} ${node.name}`}
      </Text>
      <Text style={styles.nodePath}>{node.path}</Text>
      {node.errors.length > 0 && (
        <View style={styles.errorContainer}>
          {node.errors.map((error, index) => (
            <Text key={index} style={styles.errorText}>• {error}</Text>
          ))}
        </View>
      )}
      {node.children.map((child, index) => (
        <ContextNodeDisplay key={index} node={child} level={level + 1} />
      ))}
    </View>
  );
}

export default function ContextValidationEngine() {
  const { validationResult, isValidating } = useContextValidationEngine();

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Context Validation Engine</Text>
      
      {isValidating && (
        <Text style={styles.validating}>Validating context tree...</Text>
      )}

      <View style={styles.summaryContainer}>
        <Text style={styles.summaryTitle}>Validation Summary</Text>
        <Text style={styles.summaryText}>Total Nodes: {validationResult.totalNodes}</Text>
        <Text style={styles.summaryText}>Valid Nodes: {validationResult.validNodes}</Text>
        <Text style={styles.summaryText}>Invalid Nodes: {validationResult.invalidNodes}</Text>
        <Text style={styles.summaryText}>Validation Time: {validationResult.validationTime}ms</Text>
      </View>

      {validationResult.circularDependencies.length > 0 && (
        <View style={styles.issuesContainer}>
          <Text style={styles.issuesTitle}>Circular Dependencies</Text>
          {validationResult.circularDependencies.map((dep, index) => (
            <Text key={index} style={styles.issueText}>• {dep}</Text>
          ))}
        </View>
      )}

      {validationResult.orphanedConsumers.length > 0 && (
        <View style={styles.issuesContainer}>
          <Text style={styles.issuesTitle}>Orphaned Consumers</Text>
          {validationResult.orphanedConsumers.map((consumer, index) => (
            <Text key={index} style={styles.issueText}>• {consumer}</Text>
          ))}
        </View>
      )}

      <View style={styles.treeContainer}>
        <Text style={styles.treeTitle}>Context Tree</Text>
        {validationResult.rootNodes.map((node, index) => (
          <ContextNodeDisplay key={index} node={node} />
        ))}
      </View>

      <TestProvider>
        <View style={styles.testContainer}>
          <Text style={styles.testTitle}>Context Test</Text>
          <TestConsumer />
        </View>
      </TestProvider>
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
  validating: {
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
  issuesContainer: {
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
  issuesTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'red'
  },
  issueText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 5
  },
  treeContainer: {
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
  treeTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10
  },
  nodeContainer: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#f8f9fa',
    borderRadius: 5
  },
  nodeName: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5
  },
  validNode: {
    color: 'green'
  },
  invalidNode: {
    color: 'red'
  },
  nodePath: {
    fontSize: 12,
    fontFamily: 'monospace',
    color: '#666',
    marginBottom: 5
  },
  errorContainer: {
    marginTop: 5,
    paddingLeft: 10
  },
  errorText: {
    fontSize: 12,
    color: 'red',
    marginBottom: 2
  },
  testContainer: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  testTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10
  }
}); 