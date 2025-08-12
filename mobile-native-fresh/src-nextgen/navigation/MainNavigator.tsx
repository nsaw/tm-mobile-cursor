import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import { DashboardScreen } from '../screens/dashboard/DashboardScreen';
import { SearchScreen } from '../screens/search/SearchScreen';
import { VoiceRecorderScreen } from '../screens/voice/VoiceRecorderScreen';
import { AIToolsScreen } from '../screens/ai/AIToolsScreen';
import { AllThoughtmarksScreen } from '../screens/thoughtmarks/AllThoughtmarksScreen';

const Tab = createBottomTabNavigator();

export const MainNavigator: React.FC = () => {
  return (
    <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName: string;

            if (route.name === 'Home') {
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === 'Search') {
              iconName = focused ? 'search' : 'search-outline';
            } else if (route.name === 'Voice') {
              iconName = focused ? 'mic' : 'mic-outline';
            } else if (route.name === 'AI') {
              iconName = focused ? 'sparkles' : 'sparkles-outline';
            } else if (route.name === 'All') {
              iconName = focused ? 'list' : 'list-outline';
            } else {
              iconName = 'help-outline';
            }

            return <Ionicons name={iconName as never} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#007AFF',
          tabBarInactiveTintColor: '#8E8E93',
          tabBarStyle: {
            backgroundColor: '#FFFFFF',
            borderTopWidth: 1,
            borderTopColor: '#E5E5EA',
            paddingBottom: 5,
            paddingTop: 5,
            height: 60,
          },
          headerShown: false,
        })}
      >
        <Tab.Screen
          name="Home"
          component={DashboardScreen}
          options={{
            title: 'Home',
          }}
        />
        <Tab.Screen
          name="Search"
          component={SearchScreen}
          options={{
            title: 'Search',
          }}
        />
        <Tab.Screen
          name="Voice"
          component={VoiceRecorderScreen}
          options={{
            title: 'Voice',
          }}
        />
        <Tab.Screen
          name="AI"
          component={AIToolsScreen}
          options={{
            title: 'AI',
          }}
        />
        <Tab.Screen
          name="All"
          component={AllThoughtmarksScreen}
          options={{
            title: 'All',
          }}
        />
      </Tab.Navigator>
  );
}; 