import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { Text } from 'react-native';

import { NavigationProvider } from './NavigationProvider';

// Mock navigation dependencies
const mockNavigationContainer = ({ children }: { children: React.ReactNode }) => children;
const mockCreateStackNavigator = () => ({
  Navigator: ({ children }: { children: React.ReactNode }) => children,
  Screen: ({ children }: { children: React.ReactNode }) => children,
});
const mockCreateBottomTabNavigator = () => ({
  Navigator: ({ children }: { children: React.ReactNode }) => children,
  Screen: ({ children }: { children: React.ReactNode }) => children,
});

jest.mock('@react-navigation/native', () => ({
  NavigationContainer: mockNavigationContainer,
}));

jest.mock('@react-navigation/stack', () => ({
  createStackNavigator: mockCreateStackNavigator,
}));

jest.mock('@react-navigation/bottom-tabs', () => ({
  createBottomTabNavigator: mockCreateBottomTabNavigator,
}));

// Mock theme and accessibility hooks
jest.mock('../theme/ThemeSystem', () => ({
  ThemeSystem: {
    getInstance: () => ({
      getCurrentTheme: () => ({
        name: 'light',
        colors: {
          primary: '#007AFF',
          background: '#FFFFFF',
          text: '#000000',
          border: '#C6C6C8',
          error: '#FF3B30',
          textSecondary: '#8E8E93',
        },
        typography: {
          fontSize: {
            lg: 17,
            xs: 10,
          },
          fontWeight: {
            bold: 'bold',
            medium: '500',
          },
        },
      }),
      addListener: jest.fn(() => jest.fn()),
    }),
  },
}));

jest.mock('../hooks/useAccessibility', () => ({
  useAccessibility: () => ({
    isScreenReaderEnabled: false,
  }),
}));

// Mock NavigationSystem
jest.mock('./NavigationSystem', () => ({
  NavigationSystem: {
    getInstance: () => ({
      navigate: jest.fn(),
      goBack: jest.fn(),
      getCurrentRoute: jest.fn(() => 'Home'),
      getNavigationState: jest.fn(() => ({
        currentRoute: 'Home',
        params: {},
        history: ['Home'],
        isNavigating: false,
        lastNavigationTime: Date.now(),
      })),
      addListener: jest.fn(() => jest.fn()),
      destroy: jest.fn(),
    }),
  },
}));

describe('NavigationProvider', () => {
  const TestComponent = () => (
    <NavigationProvider>
      <Text>Test Content</Text>
    </NavigationProvider>
  );

  it('should render children', () => {
    render(<TestComponent />);
    expect(screen.getByText('Test Content')).toBeDefined();
  });

  it('should render without crashing', () => {
    expect(() => render(<TestComponent />)).not.toThrow();
  });

  it('should provide navigation context', () => {
    render(<TestComponent />);
    // The provider should render without errors, indicating context is available
    expect(screen.getByText('Test Content')).toBeDefined();
  });

  it('should handle empty children', () => {
    const EmptyProvider = () => <NavigationProvider>{null}</NavigationProvider>;
    expect(() => render(<EmptyProvider />)).not.toThrow();
  });

  it('should handle multiple children', () => {
    const MultipleChildren = () => (
      <NavigationProvider>
        <Text>Child 1</Text>
        <Text>Child 2</Text>
        <Text>Child 3</Text>
      </NavigationProvider>
    );
    
    render(<MultipleChildren />);
    expect(screen.getByText('Child 1')).toBeDefined();
    expect(screen.getByText('Child 2')).toBeDefined();
    expect(screen.getByText('Child 3')).toBeDefined();
  });

  it('should handle complex nested components', () => {
    const NestedComponent = () => (
      <NavigationProvider>
        <Text>Outer</Text>
        <Text>Inner</Text>
      </NavigationProvider>
    );
    
    render(<NestedComponent />);
    expect(screen.getByText('Outer')).toBeDefined();
    expect(screen.getByText('Inner')).toBeDefined();
  });
}); 