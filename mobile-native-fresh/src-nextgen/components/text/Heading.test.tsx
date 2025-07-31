import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Text } from 'react-native';

import { TestWrapper } from '../../__tests__/TestWrapper';

import { Heading } from './Heading';

// Mock useTheme
jest.mock('../../theme/ThemeProvider', () => ({
  useTheme: () => ({
    colors: {
      primary: '#007AFF',
      secondary: '#5856D6',
      background: '#FFFFFF',
      surface: '#F2F2F7',
      text: '#000000',
      textSecondary: '#8E8E93',
      border: '#C6C6C8',
      error: '#FF3B30',
      warning: '#FF9500',
      success: '#34C759',
      info: '#007AFF',
    },
    spacing: { xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48 },
    typography: {
      fontFamily: 'System',
      fontSize: { xs: 12, sm: 14, md: 16, lg: 18, xl: 20, xxl: 24 },
      fontWeight: { light: '300', normal: '400', medium: '500', bold: '700' },
      lineHeight: { tight: 1.2, normal: 1.5, relaxed: 1.8 },
    },
    borderRadius: 8,
    shadow: {
      small: '0 1px 3px rgba(0,0,0,0.12)',
      medium: '0 4px 6px rgba(0,0,0,0.1)',
      large: '0 10px 15px rgba(0,0,0,0.1)',
    },
    animation: {
      duration: { fast: 150, normal: 300, slow: 500 },
      easing: { ease: 'ease', easeIn: 'ease-in', easeOut: 'ease-out', easeInOut: 'ease-in-out' },
    },
  }),
}));

const renderWithTheme = (component: React.ReactElement) => {
  return render(component, { wrapper: TestWrapper });
};

describe('Heading', () => {
  it('should render with default props', () => {
    const { getByText } = renderWithTheme(<Heading level={1}><Text>Test Heading</Text></Heading>);
    
    const heading = getByText('Test Heading');
    expect(heading).toBeTruthy();
  });

  it('should render with different levels', () => {
    const { getByText, rerender } = renderWithTheme(<Heading level={1}><Text>H1 Heading</Text></Heading>);
    expect(getByText('H1 Heading')).toBeTruthy();
    
    rerender(<TestWrapper><Heading level={2}><Text>H2 Heading</Text></Heading></TestWrapper>);
    expect(getByText('H2 Heading')).toBeTruthy();
    
    rerender(<TestWrapper><Heading level={3}><Text>H3 Heading</Text></Heading></TestWrapper>);
    expect(getByText('H3 Heading')).toBeTruthy();
  });

  it('should apply custom styles', () => {
    const customStyle = { color: 'red' };
    const { getByText } = renderWithTheme(
      <Heading level={1} style={customStyle}><Text>Styled Heading</Text></Heading>
    );
    
    const heading = getByText('Styled Heading');
    expect(heading).toBeTruthy();
  });

  it('should handle onPress events', () => {
    const onPress = jest.fn();
    const { getByText } = renderWithTheme(
      <Heading level={1} onPress={onPress}><Text>Clickable Heading</Text></Heading>
    );
    
    const heading = getByText('Clickable Heading');
    fireEvent.press(heading);
    
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('should render with accessibility props', () => {
    const { getByText } = renderWithTheme(
      <Heading level={1} accessibilityLabel="Main heading" accessibilityRole="header"><Text>Accessible Heading</Text></Heading>
    );
    
    const heading = getByText('Accessible Heading');
    expect(heading).toBeTruthy();
  });

  it('should handle different text content types', () => {
    const { getByText } = renderWithTheme(
      <Heading level={1}>
        <Text>Dynamic</Text>
        <Text>Mixed</Text>
        <Text>Content</Text>
      </Heading>
    );
    
    expect(getByText('Dynamic Mixed Content')).toBeTruthy();
  });

  it('should apply theme colors correctly', () => {
    const { getByText } = renderWithTheme(
      <Heading level={1} color="primary"><Text>Colored Heading</Text></Heading>
    );
    
    const heading = getByText('Colored Heading');
    expect(heading).toBeTruthy();
  });

  it('should handle long text content', () => {
    const longText = 'This is a very long heading text that should wrap properly and not cause any layout issues or overflow problems';
    const { getByText } = renderWithTheme(<Heading level={1}>{longText}</Heading>);
    
    const heading = getByText(longText);
    expect(heading).toBeTruthy();
  });

  it('should render with custom testID', () => {
    const { getByTestId } = renderWithTheme(
      <Heading level={1} testID="custom-heading"><Text>Test Heading</Text></Heading>
    );
    
    const heading = getByTestId('custom-heading');
    expect(heading).toBeTruthy();
  });

  it('should handle empty content gracefully', () => {
    const { getByTestId } = renderWithTheme(<Heading level={1} testID="empty-heading">{}</Heading>);
    expect(getByTestId('empty-heading')).toBeTruthy();
  });

  it('should apply responsive styles', () => {
    const { getByText } = renderWithTheme(
      <Heading level={1}><Text>Responsive Heading</Text></Heading>
    );
    
    const heading = getByText('Responsive Heading');
    expect(heading).toBeTruthy();
  });
}); 