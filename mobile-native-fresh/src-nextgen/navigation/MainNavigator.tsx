import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import { useAuthContext } from '../contexts/AuthContext';
import { useTheme } from '../hooks/useTheme';
import { AuthNavigator } from './AuthNavigator';
import { AllThoughtmarksScreen } from '../screens/content/AllThoughtmarksScreen';
import AllBinsScreen from '../screens/content/AllBinsScreen';
import SearchScreen from '../screens/content/SearchScreen';
import ThoughtmarkDetailScreen from '../screens/content/ThoughtmarkDetailScreen';
import CreateBinScreen from '../screens/content/CreateBinScreen';
import { SettingsScreen } from '../screens/settings/SettingsScreen';
import ProfileScreen from '../screens/settings/ProfileScreen';
import PremiumScreen from '../screens/settings/PremiumScreen';
import SecurityScreen from '../screens/settings/SecurityScreen';
import ThemeScreen from '../screens/settings/ThemeScreen';
import { AutoRoleView } from '../components/AutoRoleView';

export type MainStackParamList = {
  Auth: undefined;
  Main: undefined;
};

export type TabParamList = {
  Thoughtmarks: undefined;
  Bins: undefined;
  Search: undefined;
  Settings: undefined;
};

export type ContentStackParamList = {
  AllThoughtmarks: undefined;
  AllBins: undefined;
  Search: undefined;
  ThoughtmarkDetail: { thoughtmarkId: string };
  CreateBin: undefined;
};

export type SettingsStackParamList = {
  Settings: undefined;
  Profile: undefined;
  Premium: undefined;
  Security: undefined;
  Theme: undefined;
};

const MainStack = createStackNavigator<MainStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();
const ContentStack = createStackNavigator<ContentStackParamList>();
const SettingsStack = createStackNavigator<SettingsStackParamList>();

// Content Stack Navigator
const ContentNavigator: React.FC = () => {
  const theme = useTheme();

  return (
    <ContentStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.background,
        },
        headerTintColor: theme.colors.text,
        headerTitleStyle: {
          fontWeight: '600',
        },
        cardStyle: {
          backgroundColor: theme.colors.background,
        },
      }}
    >
      <ContentStack.Screen
        name="AllThoughtmarks"
        component={AllThoughtmarksScreen}
        options={{
          title: 'Thoughtmarks',
        }}
      />
      <ContentStack.Screen
        name="AllBins"
        component={AllBinsScreen}
        options={{
          title: 'Bins',
        }}
      />
      <ContentStack.Screen
        name="Search"
        component={SearchScreen}
        options={{
          title: 'Search',
        }}
      />
      <ContentStack.Screen
        name="ThoughtmarkDetail"
        component={ThoughtmarkDetailScreen}
        options={{
          title: 'Thoughtmark',
        }}
      />
      <ContentStack.Screen
        name="CreateBin"
        component={CreateBinScreen}
        options={{
          title: 'Create Bin',
        }}
      />
    </ContentStack.Navigator>
  );
};

// Settings Stack Navigator
const SettingsNavigator: React.FC = () => {
  const theme = useTheme();

  return (
    <SettingsStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.background,
        },
        headerTintColor: theme.colors.text,
        headerTitleStyle: {
          fontWeight: '600',
        },
        cardStyle: {
          backgroundColor: theme.colors.background,
        },
      }}
    >
      <SettingsStack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          title: 'Settings',
        }}
      />
      <SettingsStack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: 'Profile',
        }}
      />
      <SettingsStack.Screen
        name="Premium"
        component={PremiumScreen}
        options={{
          title: 'Premium',
        }}
      />
      <SettingsStack.Screen
        name="Security"
        component={SecurityScreen}
        options={{
          title: 'Security',
        }}
      />
      <SettingsStack.Screen
        name="Theme"
        component={ThemeScreen}
        options={{
          title: 'Theme',
        }}
      />
    </SettingsStack.Navigator>
  );
};

// Tab Navigator
const TabNavigator: React.FC = () => {
  const theme = useTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          backgroundColor: theme.colors.background,
          borderTopColor: theme.colors.border,
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textSecondary,
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="Thoughtmarks"
        component={ContentNavigator}
        options={{
          title: 'Thoughtmarks',
          tabBarIcon: ({ color, size }) => (
            <AutoRoleView componentRole="tab-icon" style={{ width: size, height: size }}>
              <Text style={{ color, fontSize: size }}>📝</Text>
            </AutoRoleView>
          ),
        }}
      />
      <Tab.Screen
        name="Bins"
        component={ContentNavigator}
        options={{
          title: 'Bins',
          tabBarIcon: ({ color, size }) => (
            <AutoRoleView componentRole="tab-icon" style={{ width: size, height: size }}>
              <Text style={{ color, fontSize: size }}>📦</Text>
            </AutoRoleView>
          ),
        }}
      />
      <Tab.Screen
        name="Search"
        component={ContentNavigator}
        options={{
          title: 'Search',
          tabBarIcon: ({ color, size }) => (
            <AutoRoleView componentRole="tab-icon" style={{ width: size, height: size }}>
              <Text style={{ color, fontSize: size }}>🔍</Text>
            </AutoRoleView>
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsNavigator}
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, size }) => (
            <AutoRoleView componentRole="tab-icon" style={{ width: size, height: size }}>
              <Text style={{ color, fontSize: size }}>⚙️</Text>
            </AutoRoleView>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

// Main App Navigator
export const MainNavigator: React.FC = () => {
  const { isAuthenticated } = useAuthContext();

  // Debug: Log navigation state
  React.useEffect(() => {
    console.log('🧭 MainNavigator - Auth State:', { isAuthenticated });
  }, [isAuthenticated]);

  return (
    <MainStack.Navigator screenOptions={{ headerShown: false }}>
      {isAuthenticated ? (
        <MainStack.Screen name="Main" component={TabNavigator} />
      ) : (
        <MainStack.Screen name="Auth" component={AuthNavigator} />
      )}
    </MainStack.Navigator>
  );
}; 