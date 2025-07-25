import React from 'react';
import renderer from 'react-test-renderer';
import { Card, Tag } from '../../components/system';

describe('JSX Snapshot Baseline — Role Components', () => {
  it('renders Card correctly', () => {
    const tree = renderer.create(<Card>Card baseline</Card>).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders Tag correctly', () => {
    const tree = renderer.create(<Tag>Tag baseline</Tag>).toJSON();
    expect(tree).toMatchSnapshot();
  });
}); 