import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuth } from '../features/auth/hooks/useAuth';
import { ContentScreen } from '../features/content/screens/ContentScreen';
import { DesignSystemDemo } from '../components/ui/DesignSystemDemo';
import { RootStackParamList } from './types';

// Auth Screens
import { SignInScreen } from '../features/auth/screens/SignIn';
import { SignUpScreen } from '../features/auth/screens/SignUp';

// Home Screens
import { DashboardScreen } from '../features/home/screens/DashboardScreen';
import { DetailScreen } from '../features/home/screens/DetailScreen';

// AI Screens
import { AIToolsScreen } from '../features/ai/screens/AIToolsScreen';

// Settings Screens
import { SettingsScreen } from '../features/settings/screens/SettingsScreen';

// Search Screens
import { SearchScreen } from '../features/search/screens/SearchScreen';

// Thoughtmarks Screens
import { AllThoughtmarksScreen } from '../features/thoughtmarks/screens/AllThoughtmarksScreen';
import { ThoughtmarkDetailScreen } from '../features/thoughtmarks/screens/ThoughtmarkDetailScreen';

// Bins Screens
import { AllBinsScreen } from '../features/bins/screens/AllBinsScreen';

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
const TasksScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text>Tasks Screen</Text>
  </View>
);
const BinsScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text>Bins Screen</Text>
  </View>
);
const ThoughtmarksScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text>Thoughtmarks Screen</Text>
  </View>
);
const ThoughtmarkEditScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text>Thoughtmark Edit Screen</Text>
  </View>
);
const CreateBinScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text>Create Bin Screen</Text>
  </View>
);

const Stack = createStackNavigator<RootStackParamList>();

// Main Stack Navigator (for authenticated users)
const MainStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Dashboard" component={DashboardScreen} />
    <Stack.Screen name="Search" component={SearchScreen} />
    <Stack.Screen name="AITools" component={AIToolsScreen} />
    <Stack.Screen name="AllThoughtmarks" component={AllThoughtmarksScreen} />
    <Stack.Screen name="AllBins" component={AllBinsScreen} />
    <Stack.Screen name="Tasks" component={TasksScreen} />
    <Stack.Screen name="Bins" component={BinsScreen} />
    <Stack.Screen name="Thoughtmarks" component={ThoughtmarksScreen} />
    <Stack.Screen name="ThoughtmarkDetail" component={ThoughtmarkDetailScreen} />
    <Stack.Screen name="ThoughtmarkEdit" component={ThoughtmarkEditScreen} />
    <Stack.Screen 
      name="CreateThoughtmark" 
      component={CreateThoughtmarkScreen}
      options={{ presentation: 'modal' }}
    />
    <Stack.Screen 
      name="CreateBin" 
      component={CreateBinScreen}
      options={{ presentation: 'modal' }}
    />
    <Stack.Screen name="BinDetail" component={BinDetailScreen} />
    <Stack.Screen 
      name="VoiceRecord" 
      component={VoiceRecordScreen}
      options={{ presentation: 'modal' }}
    />
    <Stack.Screen name="Content" component={ContentScreen} />
    <Stack.Screen name="DesignSystemDemo" component={DesignSystemDemo} />
    <Stack.Screen name="Settings" component={SettingsScreen} />
    <Stack.Screen name="Profile" component={ProfileScreen} />
  </Stack.Navigator>
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

// Loading Screen
const LoadingScreen = () => (
  <View style={{ 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center',
    backgroundColor: '#181818'
  }}>
    <Text style={{ color: '#ffffff', fontSize: 18 }}>Loading...</Text>
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
      {isAuthenticated ? <MainStack /> : <AuthStack />}
    </NavigationContainer>
  );
};
