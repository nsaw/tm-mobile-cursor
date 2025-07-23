// navigation/stack.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/Home';

const Stack = createNativeStackNavigator();

export const MainStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="Home" component={HomeScreen} />
  </Stack.Navigator>
); 