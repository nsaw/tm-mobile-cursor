import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { DashboardScreen } from '../screens/DashboardScreen';
import { useEnvironment } from '../state/environment';

export const DualMountNavigator = () => {
  const [environment] = useEnvironment();
  const Stack = createStackNavigator();

  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="Dashboard" 
        component={DashboardScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}; 