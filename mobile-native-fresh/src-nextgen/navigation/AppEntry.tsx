// ✅ AppEntry with screen zone mount
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';

import { RootStack } from './index';
import { SlotRenderer } from '../layout/SlotRenderer';

const AppEntry = () => {
  return (
    <NavigationContainer>
      <SlotRenderer />
      <RootStack />
    </NavigationContainer>
  );
};

export default AppEntry; 