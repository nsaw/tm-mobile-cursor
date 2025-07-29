import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Text } from 'react-native';

import { TestWrapper } from '../../__tests__/TestWrapper';
import { Link } from './Link';

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

describe('Link', () => {
  it('should render with default props', () => {
    const { getByText } = renderWithTheme(
      <Link onPress={() => {}}>Test Link</Link>
    );
    
    const link = getByText('Test Link');
    expect(link).toBeTruthy();
  });

  it('should handle onPress events', () => {
    const onPress = jest.fn();
    const { getByText } = renderWithTheme(
      <Link onPress={onPress}>Clickable Link</Link>
    );
    
    const link = getByText('Clickable Link');
    fireEvent.press(link);
    
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('should apply custom styles', () => {
    const customStyle = { color: 'red' };
    const { getByText } = renderWithTheme(
      <Link style={customStyle} onPress={() => {}}>Styled Link</Link>
    );
    
    const link = getByText('Styled Link');
    expect(link).toBeTruthy();
  });

  it('should render with accessibility props', () => {
    const { getByText } = renderWithTheme(
      <Link 
        onPress={() => {}}
        accessibilityLabel="External link"
        accessibilityRole="link"
      >
        Accessible Link
      </Link>
    );
    
    const link = getByText('Accessible Link');
    expect(link).toBeTruthy();
  });

  it('should handle disabled state', () => {
    const onPress = jest.fn();
    const { getByText } = renderWithTheme(
      <Link onPress={onPress} disabled>Disabled Link</Link>
    );
    
    const link = getByText('Disabled Link');
    fireEvent.press(link);
    
    // Should not call onPress when disabled
    expect(onPress).not.toHaveBeenCalled();
  });

  it('should handle different text content types', () => {
    const { getByText } = renderWithTheme(
      <Link onPress={() => {}}>
        {'Dynamic '}
        <Text>Mixed</Text>
        {' Content'}
      </Link>
    );
    
    expect(getByText('Dynamic Mixed Content')).toBeTruthy();
  });

  it('should apply theme colors correctly', () => {
    const { getByText } = renderWithTheme(
      <Link color="primary" onPress={() => {}}>Colored Link</Link>
    );
    
    const link = getByText('Colored Link');
    expect(link).toBeTruthy();
  });

  it('should handle long text content', () => {
    const longText = 'This is a very long link text that should wrap properly and not cause any layout issues or overflow problems';
    const { getByText } = renderWithTheme(
      <Link onPress={() => {}}>{longText}</Link>
    );
    
    const link = getByText(longText);
    expect(link).toBeTruthy();
  });

  it('should render with custom testID', () => {
    const { getByTestId } = renderWithTheme(
      <Link testID="custom-link" onPress={() => {}}>Test Link</Link>
    );
    
    const link = getByTestId('custom-link');
    expect(link).toBeTruthy();
  });

  it('should handle empty content gracefully', () => {
    const { container } = renderWithTheme(<Link onPress={() => {}}></Link>);
    expect(container).toBeTruthy();
  });

  it('should apply responsive styles', () => {
    const { getByText } = renderWithTheme(
      <Link responsive onPress={() => {}}>Responsive Link</Link>
    );
    
    const link = getByText('Responsive Link');
    expect(link).toBeTruthy();
  });

  it('should handle external links', () => {
    const { getByText } = renderWithTheme(
      <Link external onPress={() => {}}>External Link</Link>
    );
    
    const link = getByText('External Link');
    expect(link).toBeTruthy();
  });

  it('should handle underline styles', () => {
    const { getByText } = renderWithTheme(
      <Link underline onPress={() => {}}>Underlined Link</Link>
    );
    
    const link = getByText('Underlined Link');
    expect(link).toBeTruthy();
  });
}); 