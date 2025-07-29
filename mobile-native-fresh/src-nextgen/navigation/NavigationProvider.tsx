import React, { ReactNode, useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { ThemeSystem, Theme } from '../theme/ThemeSystem';
import { useAccessibility } from '../hooks/useAccessibility';

import { RootStackParamList, TabParamList } from './types';

const _Stack = createStackNavigator<RootStackParamList>();
const _Tab = createBottomTabNavigator<TabParamList>();

interface NavigationProviderProps {
  children: ReactNode;
}

export const NavigationProvider: React.FC<NavigationProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(ThemeSystem.getInstance().getCurrentTheme());
  const { isScreenReaderEnabled: _isScreenReaderEnabled } = useAccessibility();

  useEffect(() => {
    const unsubscribe = ThemeSystem.getInstance().addListener((newTheme) => {
      setTheme(newTheme);
    });
    return unsubscribe;
  }, []);

  const _defaultScreenOptions = {
    headerStyle: {
      backgroundColor: theme.colors.background,
      elevation: 0,
      shadowOpacity: 0,
    },
    headerTintColor: theme.colors.text,
    headerTitleStyle: {
      color: theme.colors.text,
      fontSize: theme.typography.fontSize.lg,
      fontWeight: theme.typography.fontWeight.bold,
    },
    cardStyle: {
      backgroundColor: theme.colors.background,
    },
  };

  const _defaultTabOptions = {
    tabBarStyle: {
      backgroundColor: theme.colors.background,
      borderTopColor: theme.colors.border,
      borderTopWidth: 1,
    },
    tabBarActiveTintColor: theme.colors.primary,
    tabBarInactiveTintColor: theme.colors.textSecondary,
    tabBarLabelStyle: {
      fontSize: theme.typography.fontSize.xs,
      fontWeight: theme.typography.fontWeight.medium,
    },
  };

  return (
    <NavigationContainer
      theme={{
        dark: theme.name === 'dark',
        colors: {
          primary: theme.colors.primary,
          background: theme.colors.background,
          card: theme.colors.background,
          text: theme.colors.text,
          border: theme.colors.border,
          notification: theme.colors.error,
        },
      } as any}
    >
      {children}
    </NavigationContainer>
  );
}; 