// src/__tests__/example.legacy.test.tsx
// Example test for legacy environment

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { Text, View } from 'react-native';

// Mock environment for legacy
process.env.EXPO_PUBLIC_USE_NEXTGEN = 'false';
process.env.EXPO_PUBLIC_ENVIRONMENT = 'legacy';

// Example component for testing
const ExampleComponent = ({ title, onPress }: { title: string; onPress?: () => void }) => {
  return (
    <View testID="example-component-legacy" accessibilityLabel="Example Component Legacy">
      <Text testID="title-legacy">{title}</Text>
      {onPress && (
        <Text testID="button-legacy" onPress={onPress} accessibilityRole="button">
          Click me
        </Text>
      )}
    </View>
  );
};

describe('Example Component - Legacy Environment', () => {
  beforeEach(() => {
    // Ensure legacy environment
    process.env.EXPO_PUBLIC_USE_NEXTGEN = 'false';
    process.env.EXPO_PUBLIC_ENVIRONMENT = 'legacy';
  });

  it('should render with legacy environment', () => {
    render(<ExampleComponent title="Test Title" />);
    
    const component = screen.getByTestId('example-component-legacy');
    expect(component).toBeTruthy();
    expect(component).toHaveEnvironment('legacy');
  });

  it('should display the title correctly', () => {
    render(<ExampleComponent title="Test Title" />);
    
    const title = screen.getByTestId('title-legacy');
    expect(title).toHaveTextContent('Test Title');
  });

  it('should handle button press', () => {
    const mockOnPress = jest.fn();
    render(<ExampleComponent title="Test Title" onPress={mockOnPress} />);
    
    const button = screen.getByTestId('button-legacy');
    fireEvent.press(button);
    
    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });

  it('should be accessible', () => {
    render(<ExampleComponent title="Test Title" />);
    
    const component = screen.getByTestId('example-component-legacy');
    expect(component).toBeAccessible();
  });

  it('should have correct accessibility label', () => {
    render(<ExampleComponent title="Test Title" />);
    
    const component = screen.getByLabelText('Example Component Legacy');
    expect(component).toBeTruthy();
  });
}); 