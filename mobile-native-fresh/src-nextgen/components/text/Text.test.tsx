import React from 'react';
import { render } from '@testing-library/react-native';
import { Text } from './Text';

// Mock theme and accessibility hooks
jest.mock('../../theme', () => ({
  useTheme: () => ({
    tokens: {
      typography: {
        fontFamily: {
          normal: 'System',
          medium: 'System',
          semibold: 'System',
          bold: 'System',
        },
        fontSize: {
          xs: 12,
          sm: 14,
          body: 16,
          lg: 18,
          xl: 20,
          heading: 24,
        },
        fontWeight: {
          normal: '400',
          medium: '500',
          semibold: '600',
          bold: '700',
        },
      },
      colors: {
        text: '#000000',
        textSecondary: '#6C6C70',
        textTertiary: '#8E8E93',
        error: '#FF3B30',
        success: '#34C759',
        warning: '#FF9500',
        accent: '#007AFF',
      },
    },
  }),
}));

jest.mock('../../hooks/useAccessibilityProps', () => ({
  useAccessibilityProps: () => ({
    accessible: true,
    accessibilityRole: 'text',
  }),
}));

jest.mock('../AutoRoleView', () => ({
  AutoRoleView: ({ children }: { children: React.ReactNode }) => children,
}));

describe('Text', () => {
  it('should render text with default props', () => {
    const { getByText } = render(<Text>Hello World</Text>);
    expect(getByText('Hello World')).toBeDefined();
  });

  it('should render with different variants', () => {
    const { getByText } = render(
      <Text variant="h1">Heading</Text>
    );
    expect(getByText('Heading')).toBeDefined();
  });

  it('should render with different weights', () => {
    const { getByText } = render(
      <Text weight="bold">Bold Text</Text>
    );
    expect(getByText('Bold Text')).toBeDefined();
  });

  it('should render with different colors', () => {
    const { getByText } = render(
      <Text color="error">Error Text</Text>
    );
    expect(getByText('Error Text')).toBeDefined();
  });

  it('should render with truncation', () => {
    const { getByText } = render(
      <Text truncate>Long text that should be truncated</Text>
    );
    expect(getByText('Long text that should be truncated')).toBeDefined();
  });

  it('should render with custom style', () => {
    const { getByText } = render(
      <Text style={{ marginTop: 10 }}>Custom Style</Text>
    );
    expect(getByText('Custom Style')).toBeDefined();
  });
}); 