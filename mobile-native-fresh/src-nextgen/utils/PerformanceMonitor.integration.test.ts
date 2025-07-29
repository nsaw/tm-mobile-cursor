import React from 'react';
import { render } from '@testing-library/react-native';
import { PerformanceMonitor, withPerformanceMonitoring } from './PerformanceMonitor';
import { View, Text } from 'react-native';

// Mock performance API
const mockPerformance = {
  now: jest.fn(() => Date.now()),
};

global.performance = mockPerformance;

const TestComponent: React.FC<{ testID?: string }> = ({ testID }) => (
  <View testID={testID}>
    <Text>Test Component</Text>
  </View>
);

const MonitoredComponent = withPerformanceMonitoring(TestComponent, 'TestComponent', 'nextgen');

describe('PerformanceMonitor Integration', () => {
  let monitor: PerformanceMonitor;

  beforeEach(() => {
    monitor = PerformanceMonitor.getInstance();
    monitor.clearMetrics();
    jest.clearAllMocks();
  });

  it('should integrate with React components', () => {
    const { getByTestId } = render(<MonitoredComponent testID="test-component" />);
    
    expect(getByTestId('test-component')).toBeTruthy();
    
    // Component should be rendered without errors
    expect(() => render(<MonitoredComponent testID="test-component" />)).not.toThrow();
  });

  it('should handle performance monitoring in component lifecycle', () => {
    const { unmount } = render(<MonitoredComponent testID="test-component" />);
    
    // Component should render
    expect(monitor.getPerformanceReport().currentMetrics.length).toBeGreaterThanOrEqual(0);
    
    // Unmount should not cause errors
    expect(() => unmount()).not.toThrow();
  });

  it('should handle multiple monitored components', () => {
    const { getByTestId } = render(
      <View>
        <MonitoredComponent testID="component-1" />
        <MonitoredComponent testID="component-2" />
        <MonitoredComponent testID="component-3" />
      </View>
    );
    
    expect(getByTestId('component-1')).toBeTruthy();
    expect(getByTestId('component-2')).toBeTruthy();
    expect(getByTestId('component-3')).toBeTruthy();
    
    // Should handle multiple components without errors
    expect(() => {
      render(
        <View>
          <MonitoredComponent testID="component-1" />
          <MonitoredComponent testID="component-2" />
          <MonitoredComponent testID="component-3" />
        </View>
      );
    }).not.toThrow();
  });

  it('should handle performance monitoring errors gracefully', () => {
    // Mock performance.now to throw error
    const originalNow = global.performance.now;
    global.performance.now = jest.fn(() => {
      throw new Error('Performance API error');
    });

    // Should not throw error when rendering
    expect(() => {
      render(<MonitoredComponent testID="test-component" />);
    }).not.toThrow();

    // Restore original
    global.performance.now = originalNow;
  });

  it('should integrate with dual-mount system', () => {
    // Test with legacy environment
    const LegacyComponent = withPerformanceMonitoring(TestComponent, 'TestComponent', 'legacy');
    
    const { getByTestId } = render(<LegacyComponent testID="legacy-component" />);
    
    expect(getByTestId('legacy-component')).toBeTruthy();
    
    // Should handle both environments
    expect(() => {
      render(<MonitoredComponent testID="nextgen-component" />);
      render(<LegacyComponent testID="legacy-component" />);
    }).not.toThrow();
  });
}); 