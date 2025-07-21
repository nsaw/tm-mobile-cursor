import React from 'react';
import { Text } from 'react-native';

const TestComponent = () => {
  return (
    <div><Text>This is unwrapped text that should be wrapped in Text</Text><div><Text>More unwrapped text here</Text></div>
    </div>
  );
};

export default TestComponent; 