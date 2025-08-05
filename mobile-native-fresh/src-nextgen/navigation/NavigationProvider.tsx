import { Text } from 'react-native';
import React, { ReactNode } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useTheme } from '../theme';
import { useAccessibility } from '../hooks/useAccessibility';

interface NavigationProviderProps {
  children: ReactNode;
}

export const NavigationProvider: React.FC<NavigationProviderProps> = ({ children }) => {
  const theme = useTheme();
  const _isScreenReaderEnabled = useAccessibility();

  const _defaultScreenOptions = {
    headerStyle: {
      backgroundColor: theme.colors.background,
      elevation: 0,
      shadowOpacity: 0,
    },
    headerTintColor: theme.colors.text,
    headerTitleStyle: {
      color: theme.colors.text,
      fontSize: theme.fontSize.lg,
      fontWeight: theme.fontWeight.semibold,
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
    tabBarActiveTintColor: theme.colors.accent,
    tabBarInactiveTintColor: theme.colors.textSecondary,
    tabBarLabelStyle: {
      fontSize: theme.fontSize.xs,
      fontWeight: theme.fontWeight.medium,
    },
  };

  return (
    <NavigationContainer><Text>{children}</Text></NavigationContainer>
  );
}; 