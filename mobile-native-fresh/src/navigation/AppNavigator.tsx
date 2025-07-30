import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuth } from '../features/auth/hooks/useAuth';
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import SearchScreen from '../screens/SearchScreen';
import ContentScreen from '../screens/ContentScreen';
declare const console: any;

const Stack = createStackNavigator();

const AppNavigator: React.FC = () => {
  const { user } = useAuth();

  console.log('[NAV] AppNavigator rendered, user:', user ? 'authenticated' : 'not authenticated');

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!user ? (
          <Stack.Screen name="Login" component={LoginScreen} />
        ) : (
          <>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Search" component={SearchScreen} />
            <Stack.Screen name="Content" component={ContentScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
