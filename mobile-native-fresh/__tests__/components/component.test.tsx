import React from 'react';
import { render } from '@testing-library/react-native';

import * as Components from '../../src-nextgen/components';

describe('Component Library Tests', () => {
  Object.entries(Components).forEach(([name, Comp]) => {
    it(`${name} renders correctly`, () => {
      const screen = render(<Comp />);
      expect(screen.toJSON()).toMatchSnapshot();
    });
  });

  it('Log: All components rendered for snapshot test', () => {
    console.log('[TEST] All component snapshots executed');
  });
}); 