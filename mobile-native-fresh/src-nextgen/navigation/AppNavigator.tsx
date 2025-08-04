import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// Import screens
import { HomeScreen } from '../shell/home/HomeScreen';
import { SignInScreen } from '../shell/auth/SignInScreen';
import { SettingsScreen } from '../shell/settings/SettingsScreen';
import { ProfileScreen } from '../shell/profile/ProfileScreen';
import { AllBinsScreen } from '../shell/bins/AllBinsScreen';
import { SearchScreen } from '../shell/search/SearchScreen';
import { ThoughtmarkDetailScreen } from '../shell/thoughtmarks/ThoughtmarkDetailScreen';
import { CreateBinScreen } from '../shell/bins/CreateBinScreen';

// Define navigation types
export type AppRoutes = {
  Home: undefined;
  SignIn: undefined;
  Settings: undefined;
  Profile: undefined;
  AllBins: undefined;
  Search: undefined;
  ThoughtmarkDetail: { id: string };
  CreateBin: undefined;
};

const Stack = createStackNavigator<AppRoutes>();
const Tab = createBottomTabNavigator<AppRoutes>();

function TabNavigator() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="AllBins" component={AllBinsScreen} />
      <Tab.Screen name="Search" component={SearchScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="SignIn" component={SignInScreen} />
        <Stack.Screen name="Home" component={TabNavigator} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="ThoughtmarkDetail" component={ThoughtmarkDetailScreen} />
        <Stack.Screen name="CreateBin" component={CreateBinScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
} 