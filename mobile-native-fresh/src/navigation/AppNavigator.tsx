import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuth } from '../features/auth/hooks/useAuth';

// Auth Screens
import { SignInScreen } from '../features/auth/screens/SignIn';
import { SignUpScreen } from '../features/auth/screens/SignUp';

// Home Screens
import { HomeScreen } from '../features/home/screens/HomeScreen';
import { DetailScreen } from '../features/home/screens/DetailScreen';

import { View, Text } from 'react-native';

// Placeholder screens - to be implemented
const CreateThoughtmarkScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text>Create Thoughtmark Screen</Text>
  </View>
);
const ProfileScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text>Profile Screen</Text>
  </View>
);
const SettingsScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text>Settings Screen</Text>
  </View>
);
const BinDetailScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text>Bin Detail Screen</Text>
  </View>
);
const VoiceRecordScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text>Voice Record Screen</Text>
  </View>
);

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Home Stack Navigator
const HomeStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="HomeMain" component={HomeScreen} />
    <Stack.Screen 
      name="ThoughtmarkDetail" 
      component={DetailScreen}
      options={{ headerShown: true, title: 'Thoughtmark' }}
    />
    <Stack.Screen 
      name="CreateThoughtmark" 
      component={CreateThoughtmarkScreen}
      options={{ headerShown: true, title: 'New Thoughtmark', presentation: 'modal' }}
    />
    <Stack.Screen 
      name="BinDetail" 
      component={BinDetailScreen}
      options={{ headerShown: true, title: 'Bin' }}
    />
    <Stack.Screen 
      name="VoiceRecord" 
      component={VoiceRecordScreen}
      options={{ headerShown: true, title: 'Voice Note', presentation: 'modal' }}
    />
  </Stack.Navigator>
);

// Profile Stack Navigator
const ProfileStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="ProfileMain" component={ProfileScreen} />
    <Stack.Screen 
      name="Settings" 
      component={SettingsScreen}
      options={{ headerShown: true, title: 'Settings' }}
    />
  </Stack.Navigator>
);

// Main Tab Navigator (for authenticated users)
const MainTabs = () => (
  <Tab.Navigator
    screenOptions={{
      headerShown: false,
      tabBarStyle: {
        backgroundColor: '#ffffff',
        borderTopColor: '#e0e0e0',
        paddingTop: 8,
        paddingBottom: 8,
        height: 80,
      },
      tabBarActiveTintColor: '#007AFF',
      tabBarInactiveTintColor: '#666666',
      tabBarLabelStyle: {
        fontSize: 12,
        fontWeight: '500',
      },
    }}
  >
    <Tab.Screen 
      name="Home" 
      component={HomeStack}
      options={{
        tabBarLabel: 'Home',
        tabBarIcon: ({ color, size }) => (
          <HomeIcon color={color} size={size} />
        ),
      }}
    />
    <Tab.Screen 
      name="Profile" 
      component={ProfileStack}
      options={{
        tabBarLabel: 'Profile',
        tabBarIcon: ({ color, size }) => (
          <ProfileIcon color={color} size={size} />
        ),
      }}
    />
  </Tab.Navigator>
);

// Auth Stack Navigator (for unauthenticated users)
const AuthStack = () => (
  <Stack.Navigator 
    screenOptions={{ 
      headerShown: false,
      cardStyle: { backgroundColor: '#ffffff' }
    }}
  >
    <Stack.Screen name="SignIn" component={SignInScreen} />
    <Stack.Screen name="SignUp" component={SignUpScreen} />
  </Stack.Navigator>
);

// Simple icon components (you can replace with react-native-vector-icons)
const HomeIcon = ({ color, size }: { color: string; size: number }) => (
  <View style={{ 
    width: size, 
    height: size,
    alignItems: 'center',
    justifyContent: 'center'
  }}>
    <Text style={{ fontSize: size * 0.8, color }}>🏠</Text>
  </View>
);

const ProfileIcon = ({ color, size }: { color: string; size: number }) => (
  <View style={{ 
    width: size, 
    height: size,
    alignItems: 'center',
    justifyContent: 'center'
  }}>
    <Text style={{ fontSize: size * 0.8, color }}>👤</Text>
  </View>
);

// Main App Navigator
export const AppNavigator = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Loading" component={LoadingScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? <MainTabs /> : <AuthStack />}
    </NavigationContainer>
  );
};

// Loading Screen Component
const LoadingScreen = () => {
  return (
    <View style={{
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#ffffff'
    }}>
      <Text style={{ fontSize: 24, marginBottom: 16 }}>🤔</Text>
      <Text style={{ fontSize: 16, color: '#666666' }}>Loading Thoughtmarks...</Text>
    </View>
  );
};