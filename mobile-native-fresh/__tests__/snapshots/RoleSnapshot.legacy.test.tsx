import React from 'react';
import renderer from 'react-test-renderer';
import { View, Text } from 'react-native';

// Simple test component using React Native components
const TestCard = ({ children }: { children: React.ReactNode }) => (
  <View testID="card">{children}</View>
);

const TestTagChip = ({ label }: { label: string }) => (
  <Text testID="tag-chip">{label}</Text>
);

describe('RoleSnapshot JSX Structure', () => {
  it('renders <TestCard /> correctly', () => {
    const tree = renderer.create(<TestCard>Snapshot JSX Test</TestCard>).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders <TestTagChip /> correctly', () => {
    const tree = renderer.create(<TestTagChip label="RoleTag" />).toJSON();
    expect(tree).toMatchSnapshot();
  });
}); 