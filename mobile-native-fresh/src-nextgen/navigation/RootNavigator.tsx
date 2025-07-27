import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { LayoutShell } from '../layout/LayoutShell';
import HomeScreen from '../screens/Home';
import TestZoneScreen from '../screens/TestZoneScreen';
import TestNavBridgeScreen from '../screens/TestNavBridgeScreen';

const Stack = createNativeStackNavigator();

const RootNavigator = () => (
  <Stack.Navigator initialRouteName="LayoutRoot">
    <Stack.Screen 
      name="LayoutRoot" 
      options={{ headerShown: false }}
    >
      {() => <LayoutShell />}
    </Stack.Screen>
    <Stack.Screen name="Home" component={HomeScreen} />
    <Stack.Screen name="TestZone" component={TestZoneScreen} />
    <Stack.Screen name="TestNavBridge" component={TestNavBridgeScreen} />
  </Stack.Navigator>
);

export default RootNavigator; 