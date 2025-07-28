import React from 'react';
import renderer from 'react-test-renderer';

import { Card, Tag } from '../../components/system';

describe('JSX Snapshot Baseline — Role Components', () => {
  it('renders Card correctly', () => {
    const tree = renderer.create(<Card><Text>Card baseline</Text></Card>).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders Tag correctly', () => {
    const tree = renderer.create(<Tag><Text>Tag baseline</Text></Tag>).toJSON();
    expect(tree).toMatchSnapshot();
  });
}); 