import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import SlotBridge from './SlotBridge';

const Stack = createStackNavigator();

export default function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={() => null} />
        <Stack.Screen name="Slot" component={SlotBridge} />
      </Stack.Navigator>
    </NavigationContainer>
  );
} 