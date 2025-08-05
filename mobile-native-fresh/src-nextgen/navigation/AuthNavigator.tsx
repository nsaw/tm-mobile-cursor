import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { SignInScreen } from '../screens/auth/SignInScreen';
import { SignUpScreen } from '../screens/auth/SignUpScreen';
import { PinEntryScreen } from '../screens/auth/PinEntryScreen';
import { PasswordResetScreen } from '../screens/auth/PasswordResetScreen';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';

export type AuthStackParamList = {
  SignIn: undefined;
  SignUp: undefined;
  PinEntry: { email: string; purpose: 'verification' | 'setup' };
  PasswordReset: undefined;
};

const Stack = createStackNavigator<AuthStackParamList>();

export const AuthNavigator: React.FC = () => {
  const theme = useTheme();
  const _isAuthenticated = useAuth();

  return (
    <Stack.Navigator
      initialRouteName="SignIn"
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
      <Stack.Screen
        name="SignIn"
        component={SignInScreen}
        options={{
          title: 'Sign In',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="SignUp"
        component={SignUpScreen}
        options={{
          title: 'Create Account',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="PinEntry"
        component={PinEntryScreen}
        options={{
          title: 'Enter PIN',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="PasswordReset"
        component={PasswordResetScreen}
        options={{
          title: 'Reset Password',
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}; 