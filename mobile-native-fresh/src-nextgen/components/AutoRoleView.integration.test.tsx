import React from 'react';
import { render } from '@testing-library/react-native';

import { AutoRoleView } from './AutoRoleView';
import { Text, View } from 'react-native';

// Mock performance monitor
jest.mock('../utils/PerformanceMonitor', () => ({
  usePerformanceMonitor: () => ({
    recordComponentRender: jest.fn(() => jest.fn()),
  }),
}));

const MockThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <View testID="theme-provider">
      {children}
    </View>
  );
};

describe('AutoRoleView Integration', () => {
  it('integrates with theme system', () => {
    const { getByTestId } = render(
      <MockThemeProvider>
        <AutoRoleView testID="test-view">
          <Text>Test Content</Text>
        </AutoRoleView>
      </MockThemeProvider>
    );
    
    expect(getByTestId('test-view')).toBeTruthy();
    expect(getByTestId('theme-provider')).toBeTruthy();
  });

  it('handles complex nested structures', () => {
    const { getByTestId } = render(
      <AutoRoleView testID="parent">
        <AutoRoleView testID="child1">
          <Text>Child 1</Text>
        </AutoRoleView>
        <AutoRoleView testID="child2">
          <Text>Child 2</Text>
        </AutoRoleView>
      </AutoRoleView>
    );
    
    expect(getByTestId('parent')).toBeTruthy();
    expect(getByTestId('child1')).toBeTruthy();
    expect(getByTestId('child2')).toBeTruthy();
  });
}); 