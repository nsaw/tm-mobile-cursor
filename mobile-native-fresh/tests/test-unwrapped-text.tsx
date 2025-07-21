import React from 'react';
import { View, Text } from 'react-native';

const TestComponent = () => {
  return (
    <View><Text>This is unwrapped text that should be wrapped in Text</Text><View><Text>More unwrapped text here</Text></View>
    </View>
  );
};

export default TestComponent; 