import React from 'react';
import renderer from 'react-test-renderer';

// Simple test component
const TestCard = ({ children }: { children: React.ReactNode }) => (
  <div data-testid="card">{children}</div>
);

const TestTagChip = ({ label }: { label: string }) => (
  <span data-testid="tag-chip">{label}</span>
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