import React from 'react';
import { render } from '@testing-library/react-native';
import { Heading } from './Heading';

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

describe('Heading', () => {
  it('should render heading with level 1', () => {
    const { getByText } = render(
      <Heading level={1}>Main Heading</Heading>
    );
    expect(getByText('Main Heading')).toBeDefined();
  });

  it('should render heading with level 2', () => {
    const { getByText } = render(
      <Heading level={2}>Sub Heading</Heading>
    );
    expect(getByText('Sub Heading')).toBeDefined();
  });

  it('should render heading with custom weight', () => {
    const { getByText } = render(
      <Heading level={1} weight="medium">Custom Weight</Heading>
    );
    expect(getByText('Custom Weight')).toBeDefined();
  });

  it('should render heading with custom color', () => {
    const { getByText } = render(
      <Heading level={1} color="secondary">Custom Color</Heading>
    );
    expect(getByText('Custom Color')).toBeDefined();
  });
}); 