import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuth } from '../features/auth/hooks/useAuth';
import { ContentScreen } from '../features/content/screens/ContentScreen';
import { DesignSystemDemo } from '../components/ui/DesignSystemDemo';
import { LoadingScreen } from '../components/ui/LoadingScreen';
import { RootStackParamList } from './types';
import { VoiceRecorderProvider } from '../components/ui/VoiceRecorderProvider';
import { View } from 'react-native';
import { Text } from '../components/ui/Text';

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
import ProfileScreen from '../features/settings/screens/ProfileScreen';
import PremiumScreen from '../features/settings/screens/PremiumScreen';
import HelpScreen from '../features/settings/screens/HelpScreen';
import TermsScreen from '../features/settings/screens/TermsScreen';
import PrivacyScreen from '../features/settings/screens/PrivacyScreen';
import SecurityScreen from '../features/settings/screens/SecurityScreen';
import ThemeScreen from '../features/settings/screens/ThemeScreen';
import ExportScreen from '../features/settings/screens/ExportScreen';
import ContactScreen from '../features/settings/screens/ContactScreen';
import HowToScreen from '../features/settings/screens/HowToScreen';
import { AdminDashboardScreen } from '../features/settings/screens/AdminDashboardScreen';

// Search Screens
import { SearchScreen } from '../features/search/screens/SearchScreen';

// Thoughtmarks Screens
import { AllThoughtmarksScreen } from '../features/thoughtmarks/screens/AllThoughtmarksScreen';
import { ThoughtmarkDetailScreen } from '../features/thoughtmarks/screens/ThoughtmarkDetailScreen';
import { UnifiedThoughtmarkScreen } from '../features/thoughtmarks/screens/UnifiedThoughtmarkScreen';

// Bins Screens
import { AllBinsScreen } from '../features/bins/screens/AllBinsScreen';

// Placeholder screens - to be implemented
const CreateBinScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text variant="heading" size="lg">Create Bin Screen</Text>
  </View>
);

const BinDetailScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text variant="heading" size="lg">Bin Detail Screen</Text>
  </View>
);

const VoiceRecordScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text variant="heading" size="lg">Voice Record Screen</Text>
  </View>
);

const TasksScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text variant="heading" size="lg">Tasks Screen</Text>
  </View>
);

const BinsScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text variant="heading" size="lg">Bins Screen</Text>
  </View>
);

const ThoughtmarksScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text variant="heading" size="lg">Thoughtmarks Screen</Text>
  </View>
);

const ArchiveScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text variant="heading" size="lg">Archive Screen</Text>
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
        options={{
          headerShown: false
        }}
      />
      <Stack.Screen
        name="BinDetail"
        component={BinDetailScreen}
        options={{
          headerShown: false
        }}
      />
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
      <Stack.Screen name="Premium" component={PremiumScreen} />
      <Stack.Screen name="Help" component={HelpScreen} />
      <Stack.Screen name="Terms" component={TermsScreen} />
      <Stack.Screen name="Privacy" component={PrivacyScreen} />
      <Stack.Screen name="Security" component={SecurityScreen} />
      <Stack.Screen name="Theme" component={ThemeScreen} />
      <Stack.Screen name="Export" component={ExportScreen} />
      <Stack.Screen name="Contact" component={ContactScreen} />
      <Stack.Screen name="HowTo" component={HowToScreen} />
      <Stack.Screen name="AdminDashboard" component={AdminDashboardScreen} />
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
