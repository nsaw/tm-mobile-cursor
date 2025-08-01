// src/__tests__/example.nextgen.test.tsx
// Example test for nextgen environment

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { Text, View } from 'react-native';

// Mock environment for nextgen
process.env.EXPO_PUBLIC_USE_NEXTGEN = 'true';
process.env.EXPO_PUBLIC_ENVIRONMENT = 'nextgen';

// Example component for testing
const ExampleComponent = ({ title, onPress }: { title: string; onPress?: () => void }) => {
  return (
    <View testID="example-component-nextgen" accessibilityLabel="Example Component NextGen">
      <Text testID="title-nextgen">{title}</Text>
      {onPress && (
        <Text testID="button-nextgen" onPress={onPress} accessibilityRole="button">
          Click me
        </Text>
      )}
    </View>
  );
};

describe('Example Component - NextGen Environment', () => {
  beforeEach(() => {
    // Ensure nextgen environment
    process.env.EXPO_PUBLIC_USE_NEXTGEN = 'true';
    process.env.EXPO_PUBLIC_ENVIRONMENT = 'nextgen';
  });

  it('should render with nextgen environment', () => {
    render(<ExampleComponent title="Test Title" />);
    
    const component = screen.getByTestId('example-component-nextgen');
    expect(component).toBeTruthy();
    expect(component).toHaveEnvironment('nextgen');
  });

  it('should display the title correctly', () => {
    render(<ExampleComponent title="Test Title" />);
    
    const title = screen.getByTestId('title-nextgen');
    expect(title).toHaveTextContent('Test Title');
  });

  it('should handle button press', () => {
    const mockOnPress = jest.fn();
    render(<ExampleComponent title="Test Title" onPress={mockOnPress} />);
    
    const button = screen.getByTestId('button-nextgen');
    fireEvent.press(button);
    
    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });

  it('should be accessible', () => {
    render(<ExampleComponent title="Test Title" />);
    
    const component = screen.getByTestId('example-component-nextgen');
    expect(component).toBeAccessible();
  });

  it('should have correct accessibility label', () => {
    render(<ExampleComponent title="Test Title" />);
    
    const component = screen.getByLabelText('Example Component NextGen');
    expect(component).toBeTruthy();
  });
}); 