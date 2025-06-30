import React from 'react';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { View, SafeAreaView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { VoiceRecorderProvider } from '../components/ui/VoiceRecorderProvider';
import { LoadingScreen } from '../components/ui/LoadingScreen';
import { DesignSystemDemo } from '../components/ui/DesignSystemDemo';
import { SessionHydrationGuard } from '../components/ui/SessionHydrationGuard';
import { ContentScreen } from '../features/content/screens/ContentScreen';
import { useAuth } from '../features/auth/hooks/useAuth';
import { Text } from '../components/ui/Text';
import { useTheme } from '../theme/ThemeProvider';

// Auth Screens
import { SignInScreen } from '../features/auth/screens/SignIn';
import { SignUpScreen } from '../features/auth/screens/SignUp';

// Home Screens
import { DashboardScreen } from '../features/home/screens/DashboardScreen';

// AI Screens
import { AIToolsScreen } from '../features/ai/screens/AIToolsScreen';

// Settings Screens
import { SettingsScreen } from '../features/settings/screens/SettingsScreen';
import { ProfileScreen } from '../features/settings/screens/ProfileScreen';
import { PremiumScreen } from '../features/settings/screens/PremiumScreen';
import { HelpScreen } from '../features/settings/screens/HelpScreen';
import { TermsScreen } from '../features/settings/screens/TermsScreen';
import { PrivacyScreen } from '../features/settings/screens/PrivacyScreen';
import { SecurityScreen } from '../features/settings/screens/SecurityScreen';
import ThemeScreen from '../features/settings/screens/ThemeScreen';
import { ExportScreen } from '../features/settings/screens/ExportScreen';
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
import { CreateBinScreen } from '../features/bins/screens/CreateBinScreen';

import { RootStackParamList } from './types';

// Placeholder screens - to be implemented
const BinDetailScreen = () => {
  const navigation = useNavigation();
  const { tokens } = useTheme();
  
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: tokens.colors.background }}>
      <View style={{ 
        flexDirection: 'row', 
        alignItems: 'center', 
        paddingHorizontal: tokens.spacing.lg,
        paddingVertical: tokens.spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: tokens.colors.divider
      }}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          style={{ marginRight: tokens.spacing.md }}
          accessibilityRole="button"
          accessible={true}
          accessibilityLabel="Go back"
        >
          <Ionicons name="arrow-back" size={24} color={tokens.colors.text} />
        </TouchableOpacity>
        <Text variant="heading" size="lg" style={{ color: tokens.colors.text }}>
          Bin Details
        </Text>
      </View>
      
      <View style={{ 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center',
        paddingHorizontal: tokens.spacing.lg
      }}>
        <Ionicons name="folder-outline" size={64} color={tokens.colors.textSecondary} />
        <Text variant="subheading" size="lg" style={{ 
          color: tokens.colors.text, 
          marginTop: tokens.spacing.lg,
          marginBottom: tokens.spacing.sm,
          textAlign: 'center'
        }}>
          Bin Management
        </Text>
        <Text variant="body" style={{ 
          color: tokens.colors.textSecondary, 
          textAlign: 'center',
          lineHeight: 20
        }}>
          View and manage your bin contents. 
          Organize thoughtmarks into collections for better organization.
        </Text>
      </View>
    </SafeAreaView>
  );
};

const VoiceRecordScreen = () => {
  const navigation = useNavigation();
  const { tokens } = useTheme();
  
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: tokens.colors.background }}>
      <View style={{ 
        flexDirection: 'row', 
        alignItems: 'center', 
        paddingHorizontal: tokens.spacing.lg,
        paddingVertical: tokens.spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: tokens.colors.divider
      }}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          style={{ marginRight: tokens.spacing.md }}
          accessibilityRole="button"
          accessible={true}
          accessibilityLabel="Go back"
        >
          <Ionicons name="arrow-back" size={24} color={tokens.colors.text} />
        </TouchableOpacity>
        <Text variant="heading" size="lg" style={{ color: tokens.colors.text }}>
          Voice Recording
        </Text>
      </View>
      
      <View style={{ 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center',
        paddingHorizontal: tokens.spacing.lg
      }}>
        <Ionicons name="mic-outline" size={64} color={tokens.colors.textSecondary} />
        <Text variant="subheading" size="lg" style={{ 
          color: tokens.colors.text, 
          marginTop: tokens.spacing.lg,
          marginBottom: tokens.spacing.sm,
          textAlign: 'center'
        }}>
          Voice to Thoughtmark
        </Text>
        <Text variant="body" style={{ 
          color: tokens.colors.textSecondary, 
          textAlign: 'center',
          lineHeight: 20
        }}>
          Record your thoughts and ideas. 
          Your voice will be transcribed into a thoughtmark automatically.
        </Text>
      </View>
    </SafeAreaView>
  );
};

const TasksScreen = () => {
  const navigation = useNavigation();
  const { tokens } = useTheme();
  
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: tokens.colors.background }}>
      <View style={{ 
        flexDirection: 'row', 
        alignItems: 'center', 
        paddingHorizontal: tokens.spacing.lg,
        paddingVertical: tokens.spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: tokens.colors.divider
      }}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          style={{ marginRight: tokens.spacing.md }}
          accessibilityRole="button"
          accessible={true}
          accessibilityLabel="Go back"
        >
          <Ionicons name="arrow-back" size={24} color={tokens.colors.text} />
        </TouchableOpacity>
        <Text variant="heading" size="lg" style={{ color: tokens.colors.text }}>
          Tasks
        </Text>
      </View>
      
      <View style={{ 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center',
        paddingHorizontal: tokens.spacing.lg
      }}>
        <Ionicons name="checkmark-circle-outline" size={64} color={tokens.colors.textSecondary} />
        <Text variant="subheading" size="lg" style={{ 
          color: tokens.colors.text, 
          marginTop: tokens.spacing.lg,
          marginBottom: tokens.spacing.sm,
          textAlign: 'center'
        }}>
          Task Management
        </Text>
        <Text variant="body" style={{ 
          color: tokens.colors.textSecondary, 
          textAlign: 'center',
          lineHeight: 20
        }}>
          Manage your tasks and to-dos. 
          Convert thoughtmarks into actionable tasks and track your progress.
        </Text>
      </View>
    </SafeAreaView>
  );
};

const BinsScreen = () => {
  const navigation = useNavigation();
  const { tokens } = useTheme();
  
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: tokens.colors.background }}>
      <View style={{ 
        flexDirection: 'row', 
        alignItems: 'center', 
        paddingHorizontal: tokens.spacing.lg,
        paddingVertical: tokens.spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: tokens.colors.divider
      }}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          style={{ marginRight: tokens.spacing.md }}
          accessibilityRole="button"
          accessible={true}
          accessibilityLabel="Go back"
        >
          <Ionicons name="arrow-back" size={24} color={tokens.colors.text} />
        </TouchableOpacity>
        <Text variant="heading" size="lg" style={{ color: tokens.colors.text }}>
          Bins
        </Text>
      </View>
      
      <View style={{ 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center',
        paddingHorizontal: tokens.spacing.lg
      }}>
        <Ionicons name="folder-open-outline" size={64} color={tokens.colors.textSecondary} />
        <Text variant="subheading" size="lg" style={{ 
          color: tokens.colors.text, 
          marginTop: tokens.spacing.lg,
          marginBottom: tokens.spacing.sm,
          textAlign: 'center'
        }}>
          Bin Collection
        </Text>
        <Text variant="body" style={{ 
          color: tokens.colors.textSecondary, 
          textAlign: 'center',
          lineHeight: 20
        }}>
          Browse and manage your bins. 
          Organize thoughtmarks into themed collections for better discovery.
        </Text>
      </View>
    </SafeAreaView>
  );
};

const ThoughtmarksScreen = () => {
  const navigation = useNavigation();
  const { tokens } = useTheme();
  
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: tokens.colors.background }}>
      <View style={{ 
        flexDirection: 'row', 
        alignItems: 'center', 
        paddingHorizontal: tokens.spacing.lg,
        paddingVertical: tokens.spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: tokens.colors.divider
      }}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          style={{ marginRight: tokens.spacing.md }}
          accessibilityRole="button"
          accessible={true}
          accessibilityLabel="Go back"
        >
          <Ionicons name="arrow-back" size={24} color={tokens.colors.text} />
        </TouchableOpacity>
        <Text variant="heading" size="lg" style={{ color: tokens.colors.text }}>
          Thoughtmarks
        </Text>
      </View>
      
      <View style={{ 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center',
        paddingHorizontal: tokens.spacing.lg
      }}>
        <Ionicons name="document-text-outline" size={64} color={tokens.colors.textSecondary} />
        <Text variant="subheading" size="lg" style={{ 
          color: tokens.colors.text, 
          marginTop: tokens.spacing.lg,
          marginBottom: tokens.spacing.sm,
          textAlign: 'center'
        }}>
          All Thoughtmarks
        </Text>
        <Text variant="body" style={{ 
          color: tokens.colors.textSecondary, 
          textAlign: 'center',
          lineHeight: 20
        }}>
          Browse all your thoughtmarks. 
          Search, filter, and organize your captured ideas and insights.
        </Text>
      </View>
    </SafeAreaView>
  );
};

// Archive Screen with proper implementation
const ArchiveScreen = () => {
  const navigation = useNavigation();
  const { tokens } = useTheme();
  
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: tokens.colors.background }}>
      <View style={{ 
        flexDirection: 'row', 
        alignItems: 'center', 
        paddingHorizontal: tokens.spacing.lg,
        paddingVertical: tokens.spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: tokens.colors.divider
      }}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          style={{ marginRight: tokens.spacing.md }}
          accessibilityRole="button"
          accessible={true}
          accessibilityLabel="Go back"
        >
          <Ionicons name="arrow-back" size={24} color={tokens.colors.text} />
        </TouchableOpacity>
        <Text variant="heading" size="lg" style={{ color: tokens.colors.text }}>
          Archive
        </Text>
      </View>
      
      <View style={{ 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center',
        paddingHorizontal: tokens.spacing.lg
      }}>
        <Ionicons name="archive-outline" size={64} color={tokens.colors.textSecondary} />
        <Text variant="subheading" size="lg" style={{ 
          color: tokens.colors.text, 
          marginTop: tokens.spacing.lg,
          marginBottom: tokens.spacing.sm,
          textAlign: 'center'
        }}>
          Archived Content
        </Text>
        <Text variant="body" style={{ 
          color: tokens.colors.textSecondary, 
          textAlign: 'center',
          lineHeight: 20
        }}>
          Your archived thoughtmarks and bins will appear here. 
          Archived content is preserved but hidden from your main view.
        </Text>
      </View>
    </SafeAreaView>
  );
};

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
      cardStyle: { backgroundColor: '#181818' }
    }}
  >
    <Stack.Screen name="SignIn" component={SignInScreen} />
    <Stack.Screen name="SignUp" component={SignUpScreen} />
  </Stack.Navigator>
);

// Main App Navigator with Session Hydration Guard
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
    <SessionHydrationGuard>
      <NavigationContainer>
        {isAuthenticated ? <MainStack /> : <AuthStack />}
      </NavigationContainer>
    </SessionHydrationGuard>
  );
};
