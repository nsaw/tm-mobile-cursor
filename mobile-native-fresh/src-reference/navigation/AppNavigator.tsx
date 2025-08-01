import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { VoiceRecorderProvider } from '../components/ui/VoiceRecorderProvider';
import { LoadingScreen } from '../components/ui/LoadingScreen';
import { DesignSystemDemo } from '../components/ui/DesignSystemDemo';
import { SessionHydrationGuard } from '../components/ui/SessionHydrationGuard';
import { ContentScreen } from '../features/content/screens/ContentScreen';
import { useAuth } from '../features/auth/hooks/useAuth';
import { Text } from '../components/ui/Text';
import { AutoRoleView } from '../components/AutoRoleView';

// Auth Screens
import { SignInScreen } from '../features/auth/screens/SignIn';
import { SignUpScreen } from '../features/auth/screens/SignUp';
import { PINEntryScreen } from '../features/auth/screens/PINEntryScreen';

// Home Screens
import { DashboardScreen } from '../features/home/screens/DashboardScreen';
import { HomeScreen } from '../features/home/screens/HomeScreen';
import { DetailScreen } from '../features/home/screens/DetailScreen';

// Settings Screens
import { SettingsScreen } from '../features/settings/screens/SettingsScreen';
import { ProfileScreen } from '../features/settings/screens/ProfileScreen';
import { HelpScreen } from '../features/settings/screens/HelpScreen';
import { PremiumScreen } from '../features/settings/screens/PremiumScreen';
import { TermsScreen } from '../features/settings/screens/TermsScreen';
import { PrivacyScreen } from '../features/settings/screens/PrivacyScreen';
import { SecurityScreen } from '../features/settings/screens/SecurityScreen';
import ThemeScreen from '../features/settings/screens/ThemeScreen';
import ContactScreen from '../features/settings/screens/ContactScreen';
import { ExportScreen } from '../features/settings/screens/ExportScreen';
import { AdminDashboardScreen } from '../features/settings/screens/AdminDashboardScreen';
import HowToScreen from '../features/settings/screens/HowToScreen';

// Thoughtmarks Screens
import { AllThoughtmarksScreen } from '../features/thoughtmarks/screens/AllThoughtmarksScreen';
import { ThoughtmarkDetailScreen } from '../features/thoughtmarks/screens/ThoughtmarkDetailScreen';
import { UnifiedThoughtmarkScreen } from '../features/thoughtmarks/screens/UnifiedThoughtmarkScreen';

import { RootStackParamList } from './types';

// Placeholder screens - to be implemented
const VoiceRecordScreen = () => (
  <AutoRoleView layoutRole="section" style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text variant="heading" size="lg">Voice Record Screen</Text>
  </AutoRoleView>
);

const SearchScreen = () => (
  <AutoRoleView layoutRole="section" style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text variant="heading" size="lg">Search Screen</Text>
  </AutoRoleView>
);

const AIToolsScreen = () => (
  <AutoRoleView layoutRole="section" style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text variant="heading" size="lg">AI Tools Screen</Text>
  </AutoRoleView>
);

const AllBinsScreen = () => (
  <AutoRoleView layoutRole="section" style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text variant="heading" size="lg">All Bins Screen</Text>
  </AutoRoleView>
);

const TasksScreen = () => (
  <AutoRoleView layoutRole="section" style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text variant="heading" size="lg">Tasks Screen</Text>
  </AutoRoleView>
);

const BinsScreen = () => (
  <AutoRoleView layoutRole="section" style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text variant="heading" size="lg">Bins Screen</Text>
  </AutoRoleView>
);

const ThoughtmarksScreen = () => (
  <AutoRoleView layoutRole="section" style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text variant="heading" size="lg">Thoughtmarks Screen</Text>
  </AutoRoleView>
);

const BinDetailScreen = () => (
  <AutoRoleView layoutRole="section" style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text variant="heading" size="lg">Bin Detail Screen</Text>
  </AutoRoleView>
);

const TaskDetailScreen = () => (
  <AutoRoleView layoutRole="section" style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text variant="heading" size="lg">Task Detail Screen</Text>
  </AutoRoleView>
);

const ArchiveScreen = () => (
  <AutoRoleView layoutRole="section" style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text variant="heading" size="lg">Archive Screen</Text>
  </AutoRoleView>
);

const CreateBinScreen = () => (
  <AutoRoleView layoutRole="section" style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text variant="heading" size="lg">Create Bin Screen</Text>
  </AutoRoleView>
);

const Stack = createStackNavigator<RootStackParamList>();

// PIN Entry Wrapper for navigation
const PINEntryWrapper = () => (
  <SessionHydrationGuard>
    <PINEntryScreen mode="verify" />
  </SessionHydrationGuard>
);

// Auth Stack Navigator (for unauthenticated users)
const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="SignIn" component={SignInScreen} />
    <Stack.Screen name="SignUp" component={SignUpScreen} />
    <Stack.Screen name="PINEntry" component={PINEntryWrapper} />
  </Stack.Navigator>
);

// Loading Stack Navigator
const LoadingStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Loading" component={LoadingScreen} />
  </Stack.Navigator>
);

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
      <Stack.Screen name="BinDetail" component={BinDetailScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="Help" component={HelpScreen} />
      <Stack.Screen name="Premium" component={PremiumScreen} />
      <Stack.Screen name="Terms" component={TermsScreen} />
      <Stack.Screen name="Privacy" component={PrivacyScreen} />
      <Stack.Screen name="Security" component={SecurityScreen} />
      <Stack.Screen name="Theme" component={ThemeScreen} />
      <Stack.Screen name="Contact" component={ContactScreen} />
      <Stack.Screen name="Export" component={ExportScreen} />
      <Stack.Screen name="AdminDashboard" component={AdminDashboardScreen} />
      <Stack.Screen name="HowTo" component={HowToScreen} />
      <Stack.Screen name="Archive" component={ArchiveScreen} />
      <Stack.Screen name="CreateBin" component={CreateBinScreen} />
      <Stack.Screen name="VoiceRecord" component={VoiceRecordScreen} />
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Detail" component={DetailScreen} />
      <Stack.Screen name="UnifiedThoughtmark" component={UnifiedThoughtmarkScreen} />
    </Stack.Navigator>
  </VoiceRecorderProvider>
);

// Root Navigator
export const AppNavigator = () => {
  const { isAuthenticated, loading } = useAuth();

  console.log('[AppNavigator] Auth state:', { isAuthenticated, loading });

  if (loading) {
    return (
      <NavigationContainer>
        <LoadingStack />
      </NavigationContainer>
    );
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? <MainStack /> : <AuthStack />}
    </NavigationContainer>
  );
};
