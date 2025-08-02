import React from 'react';
import { render } from '@testing-library/react-native';
import { NavigationProvider } from './NavigationProvider';

// Mock navigation dependencies
jest.mock('@react-navigation/native', () => ({
  NavigationContainer: ({ children }: { children: React.ReactNode }) => children,
}));

jest.mock('@react-navigation/stack', () => ({
  createStackNavigator: () => ({
    Navigator: ({ children }: { children: React.ReactNode }) => children,
    Screen: ({ children }: { children: React.ReactNode }) => children,
  }),
}));

jest.mock('@react-navigation/bottom-tabs', () => ({
  createBottomTabNavigator: () => ({
    Navigator: ({ children }: { children: React.ReactNode }) => children,
    Screen: ({ children }: { children: React.ReactNode }) => children,
  }),
}));

// Mock theme and accessibility hooks
jest.mock('../theme', () => ({
  useTheme: () => ({
    tokens: {
      colors: {
        accent: '#007AFF',
        background: '#FFFFFF',
        text: '#000000',
        border: '#C6C6C8',
        error: '#FF3B30',
        textSecondary: '#8E8E93',
      },
      typography: {
        fontSize: {
          xs: 12,
          lg: 18,
        },
        fontWeight: {
          medium: '500',
          semibold: '600',
        },
      },
    },
  }),
}));

jest.mock('../hooks/useAccessibility', () => ({
  useAccessibility: () => ({
    isScreenReaderEnabled: false,
  }),
}));

describe('NavigationProvider', () => {
  it('should render children', () => {
    const { getByText } = render(
      <NavigationProvider>
        <div>Test Content</div>
      </NavigationProvider>
    );
    
    expect(getByText('Test Content')).toBeDefined();
  });
}); 