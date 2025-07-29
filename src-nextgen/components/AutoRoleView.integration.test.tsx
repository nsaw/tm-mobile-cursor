import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { AutoRoleView } from './AutoRoleView';
import { Text, View } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { useAccessibility } from '../hooks/useAccessibility';

// Mock dependencies
jest.mock('../theme/ThemeProvider');
jest.mock('../hooks/useAccessibility');
jest.mock('../utils/PerformanceMonitor', () => ({
  usePerformanceMonitor: () => ({
    recordComponentRender: jest.fn(() => jest.fn()),
  }),
}));

const MockThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const mockTheme = {
    theme: { colors: { primary: '#007AFF' } },
    themeMode: 'light' as const,
    toggleTheme: jest.fn(),
    setTheme: jest.fn(),
    isDark: false,
    isLight: true,
  };
  
  return (
    <View testID="theme-provider">
      {children}
    </View>
  );
};

describe('AutoRoleView Integration', () => {
  beforeEach(() => {
    (useTheme as jest.Mock).mockReturnValue({
      theme: { colors: { primary: '#007AFF' } },
      isDark: false,
    });
    (useAccessibility as jest.Mock).mockReturnValue({
      isHighContrastEnabled: false,
    });
  });

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

  it('integrates with accessibility system', () => {
    (useAccessibility as jest.Mock).mockReturnValue({
      isHighContrastEnabled: true,
    });
    
    const { getByTestId } = render(
      <AutoRoleView testID="test-view" accessible={true} accessibilityLabel="Test">
        <Text>Test Content</Text>
      </AutoRoleView>
    );
    
    const view = getByTestId('test-view');
    expect(view.props.accessible).toBe(true);
    expect(view.props.accessibilityLabel).toBe('Test');
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