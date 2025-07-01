import React from 'react';
import { Text } from 'react-native';
import { DebugScrollView } from './DebugScrollView';

export const TestScrollViewError: React.FC = () => {
  return (
    <DebugScrollView debugId="test-error" style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>This should trigger the ScrollView layout error if the bug is present.</Text>
    </DebugScrollView>
  );
};

export default TestScrollViewError; 