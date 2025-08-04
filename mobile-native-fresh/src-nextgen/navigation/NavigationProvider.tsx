import React, { createContext, useContext, ReactNode } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { RootStackParamList, TabParamList } from './types';
import { useTheme } from '../theme';
import { useAccessibility } from '../hooks/useAccessibility';

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

interface NavigationProviderProps {
  children: ReactNode;
}

export const NavigationProvider: React.FC<NavigationProviderProps> = ({ children }) => {
  const { tokens } = useTheme();
  const { isScreenReaderEnabled } = useAccessibility();

  const defaultScreenOptions = {
    headerStyle: {
      backgroundColor: tokens.colors.background,
      elevation: 0,
      shadowOpacity: 0,
    },
    headerTintColor: tokens.colors.text,
    headerTitleStyle: {
      color: tokens.colors.text,
      fontSize: tokens.typography.fontSize.lg,
      fontWeight: tokens.typography.fontWeight.semibold,
    },
    cardStyle: {
      backgroundColor: tokens.colors.background,
    },
  };

  const defaultTabOptions = {
    tabBarStyle: {
      backgroundColor: tokens.colors.background,
      borderTopColor: tokens.colors.border,
      borderTopWidth: 1,
    },
    tabBarActiveTintColor: tokens.colors.accent,
    tabBarInactiveTintColor: tokens.colors.textSecondary,
    tabBarLabelStyle: {
      fontSize: tokens.typography.fontSize.xs,
      fontWeight: tokens.typography.fontWeight.medium,
    },
  };

  return (
    <NavigationContainer
      theme={{
        dark: false, // Will be determined by theme system
        colors: {
          primary: tokens.colors.accent,
          background: tokens.colors.background,
          card: tokens.colors.background,
          text: tokens.colors.text,
          border: tokens.colors.border,
          notification: tokens.colors.error,
        },
        fonts: {
          regular: { fontFamily: 'System', fontWeight: '400' },
          medium: { fontFamily: 'System', fontWeight: '500' },
          bold: { fontFamily: 'System', fontWeight: '700' },
          heavy: { fontFamily: 'System', fontWeight: '900' },
        },
      }}
    >
      {children}
    </NavigationContainer>
  );
}; 