import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuth } from '../features/auth/hooks/useAuth';
import { ContentScreen } from '../features/content/screens/ContentScreen';
import { DesignSystemDemo } from '../components/ui/DesignSystemDemo';
import { LoadingScreen } from '../components/ui/LoadingScreen';
import { RootStackParamList } from './types';
import { VoiceRecorderProvider } from '../components/ui/VoiceRecorderProvider';

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
import { UnifiedThoughtmarkScreen } from '../features/thoughtmarks/screens/UnifiedThoughtmarkScreen';

// Bins Screens
import { AllBinsScreen } from '../features/bins/screens/AllBinsScreen';

import { View, Text } from 'react-native';

// Placeholder screens - to be implemented
const CreateBinScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text>Create Bin Screen</Text>
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

const ArchiveScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text>Archive Screen</Text>
  </View>
);

const ProfileScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text>Profile Screen</Text>
  </View>
);

// Loading Screen Wrapper for React Navigation
const LoadingScreenWrapper = () => (
  <LoadingScreen isVisible={true} message="Loading Thoughtmarks..." />
);

const Stack = createStackNavigator<RootStackParamList>();

// Main Stack Navigator (for authenticated users)
const MainStack = () => (
  <VoiceRecorderProvider>
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
      <Stack.Screen 
        name="CreateThoughtmark" 
        component={UnifiedThoughtmarkScreen}
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
      <Stack.Screen name="Archive" component={ArchiveScreen} />
    </Stack.Navigator>
  </VoiceRecorderProvider>
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

// Main App Navigator
export const AppNavigator = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Loading" component={LoadingScreenWrapper} />
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
