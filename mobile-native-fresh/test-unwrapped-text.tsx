import React from 'react';
import { View } from 'react-native';

const TestComponent = () => {
  return (
    <View>
      This is unwrapped text that should be wrapped in Text
      <View>
        More unwrapped text here
      </View>
    </View>
  );
};

export default TestComponent; 