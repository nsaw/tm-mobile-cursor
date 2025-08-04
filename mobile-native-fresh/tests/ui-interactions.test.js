import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Text, View, TouchableOpacity } from 'react-native';

// Mock components for testing
const TestButton = ({ onPress, title, testID }) => (
  <TouchableOpacity onPress={onPress} testID={testID}>
    <Text>{title}</Text>
  </TouchableOpacity>
);

const TestScreen = () => {
  const [count, setCount] = React.useState(0);
  const [text, setText] = React.useState('');

  return (
    <View>
      <Text testID="count-display">Count: {count}</Text>
      <TestButton 
        onPress={() => setCount(count + 1)} 
        title="Increment" 
        testID="increment-button" 
      />
      <TestButton 
        onPress={() => setCount(count - 1)} 
        title="Decrement" 
        testID="decrement-button" 
      />
      <Text testID="text-display">Text: {text}</Text>
    </View>
  );
};

describe('UI Interactions', () => {
  it('should increment counter when increment button is pressed', async () => {
    const { getByTestId } = render(<TestScreen />);
    
    const incrementButton = getByTestId('increment-button');
    const countDisplay = getByTestId('count-display');
    
    // Initial state
    expect(countDisplay).toHaveTextContent('Count: 0');
    
    // Press increment button
    fireEvent.press(incrementButton);
    
    // Verify state change
    await waitFor(() => {
      expect(countDisplay).toHaveTextContent('Count: 1');
    });
  });

  it('should decrement counter when decrement button is pressed', async () => {
    const { getByTestId } = render(<TestScreen />);
    
    const decrementButton = getByTestId('decrement-button');
    const countDisplay = getByTestId('count-display');
    
    // Initial state
    expect(countDisplay).toHaveTextContent('Count: 0');
    
    // Press decrement button
    fireEvent.press(decrementButton);
    
    // Verify state change
    await waitFor(() => {
      expect(countDisplay).toHaveTextContent('Count: -1');
    });
  });

  it('should handle multiple button presses', async () => {
    const { getByTestId } = render(<TestScreen />);
    
    const incrementButton = getByTestId('increment-button');
    const decrementButton = getByTestId('decrement-button');
    const countDisplay = getByTestId('count-display');
    
    // Press increment twice
    fireEvent.press(incrementButton);
    fireEvent.press(incrementButton);
    
    // Press decrement once
    fireEvent.press(decrementButton);
    
    // Verify final state
    await waitFor(() => {
      expect(countDisplay).toHaveTextContent('Count: 1');
    });
  });
}); 