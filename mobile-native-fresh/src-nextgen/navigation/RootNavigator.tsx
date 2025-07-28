import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import SlotBridge from './SlotBridge';
import HomeScreen from './HomeScreen';

const Stack = createStackNavigator();

export default function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="SlotBridge" component={SlotBridge} />
      </Stack.Navigator>
    </NavigationContainer>
  );
} 