// navigation/stack.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from '../screens/Home';
import TestZoneScreen from '../screens/TestZoneScreen';
import TestNavBridgeScreen from '../screens/TestNavBridgeScreen';

const Stack = createNativeStackNavigator();

export const MainStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="Home" component={HomeScreen} />
    <Stack.Screen name="TestZone" component={TestZoneScreen} />
    <Stack.Screen name="TestNavBridge" component={TestNavBridgeScreen} />
  </Stack.Navigator>
); 