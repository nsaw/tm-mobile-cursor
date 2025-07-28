import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import SlotBridge from './SlotBridge';
import HomeScreen from './HomeScreen';
import NavigationErrorBoundary from './ErrorBoundary';
import ContextTestRunner from './ContextTestRunner';

declare const console: any;

const Stack = createStackNavigator();

function NavigationContent() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="Home" 
        component={HomeScreen}
        options={{ title: 'Home - Context Test' }}
      />
      <Stack.Screen 
        name="SlotBridge" 
        component={SlotBridge}
        options={{ title: 'SlotBridge - Deep Test' }}
      />
      <Stack.Screen 
        name="ContextTest" 
        component={ContextTestRunner}
        options={{ title: 'Context Test Runner' }}
      />
    </Stack.Navigator>
  );
}

export default function RootNavigator() {
  console.log('[RootNavigator] Initializing navigation container');

  return (
    <NavigationErrorBoundary>
      <NavigationContainer>
        <NavigationContent />
      </NavigationContainer>
    </NavigationErrorBoundary>
  );
} 