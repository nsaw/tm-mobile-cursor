// ✅ AppEntry with screen zone mount
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';

import { SlotRenderer } from '../layout/SlotRenderer';

import { RootStack } from './index';

const AppEntry = () => {
  return (
    <NavigationContainer>
      <SlotRenderer />
      <RootStack />
    </NavigationContainer>
  );
};

export default AppEntry; 