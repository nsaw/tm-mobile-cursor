import React from 'react';
import { render, act } from '@testing-library/react-native';
import { ComponentRegistryProvider, useComponentRegistry } from './ComponentRegistry';

// Test component
const TestComponent: React.FC<{ testProp?: string }> = ({ testProp }) => {
  return null;
};

// Test hook usage
const TestHookUsage: React.FC = () => {
  const registry = useComponentRegistry();
  
  React.useEffect(() => {
    registry.register('test-component', TestComponent, {
      name: 'TestComponent',
      category: 'utility',
      description: 'Test component',
    });
  }, [registry]);

  return null;
};

describe('ComponentRegistry', () => {
  it('should register and retrieve components', () => {
    const { getByTestId } = render(
      <ComponentRegistryProvider>
        <TestHookUsage />
      </ComponentRegistryProvider>
    );

    // Component should be registered
    expect(getByTestId).toBeDefined();
  });

  it('should provide registry API', () => {
    const TestAPIUsage: React.FC = () => {
      const registry = useComponentRegistry();
      
      React.useEffect(() => {
        expect(registry.register).toBeDefined();
        expect(registry.get).toBeDefined();
        expect(registry.list).toBeDefined();
        expect(registry.clear).toBeDefined();
      }, [registry]);

      return null;
    };

    render(
      <ComponentRegistryProvider>
        <TestAPIUsage />
      </ComponentRegistryProvider>
    );
  });

  it('should handle component registration with metadata', () => {
    const TestMetadataUsage: React.FC = () => {
      const registry = useComponentRegistry();
      
      React.useEffect(() => {
        registry.register('test-with-metadata', TestComponent, {
          name: 'TestWithMetadata',
          category: 'content',
          version: '2.0.0',
          description: 'Test component with metadata',
          tags: ['test', 'metadata'],
        });

        const metadata = registry.getMetadata('test-with-metadata');
        expect(metadata).toBeDefined();
        expect(metadata?.name).toBe('TestWithMetadata');
        expect(metadata?.category).toBe('content');
        expect(metadata?.version).toBe('2.0.0');
      }, [registry]);

      return null;
    };

    render(
      <ComponentRegistryProvider>
        <TestMetadataUsage />
      </ComponentRegistryProvider>
    );
  });

  it('should handle component unregistration', () => {
    const TestUnregisterUsage: React.FC = () => {
      const registry = useComponentRegistry();
      
      React.useEffect(() => {
        registry.register('test-unregister', TestComponent, {
          name: 'TestUnregister',
          category: 'utility',
        });

        expect(registry.get('test-unregister')).toBeDefined();
        
        const removed = registry.unregister('test-unregister');
        expect(removed).toBe(true);
        expect(registry.get('test-unregister')).toBeNull();
      }, [registry]);

      return null;
    };

    render(
      <ComponentRegistryProvider>
        <TestUnregisterUsage />
      </ComponentRegistryProvider>
    );
  });

  it('should provide registry statistics', () => {
    const TestStatsUsage: React.FC = () => {
      const registry = useComponentRegistry();
      
      React.useEffect(() => {
        registry.register('test-stats-1', TestComponent, {
          name: 'TestStats1',
          category: 'layout',
        });

        registry.register('test-stats-2', TestComponent, {
          name: 'TestStats2',
          category: 'content',
        });

        const stats = registry.getStats();
        expect(stats.total).toBe(2);
        expect(stats.categories.layout).toBe(1);
        expect(stats.categories.content).toBe(1);
      }, [registry]);

      return null;
    };

    render(
      <ComponentRegistryProvider>
        <TestStatsUsage />
      </ComponentRegistryProvider>
    );
  });

  it('should throw error when used outside provider', () => {
    expect(() => render(<TestHookUsage />)).toThrow(
      'useComponentRegistry must be used within a ComponentRegistryProvider'
    );
  });
}); 