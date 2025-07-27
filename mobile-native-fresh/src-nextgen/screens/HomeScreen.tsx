// HomeScreen.tsx - JSX baseline role prop hydration
import React from 'react';
import { View, StyleSheet } from 'react-native';

import { AutoRoleView } from '../components/AutoRoleView';
import { useTheme } from '../theme/ThemeProvider';

export interface HomeScreenProps {
  layoutRole?: string;
  accessibilityRole?: string;
  accessible?: boolean;
  accessibilityLabel?: string;
  testID?: string;
  enableRoleHydration?: boolean;
  children?: React.ReactNode;
  style?: any;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  layoutRole = 'home-screen',
  accessibilityRole = 'main',
  accessible = true,
  accessibilityLabel = 'Home screen',
  testID = 'home-screen',
  enableRoleHydration = true,
  children,
  style,
  ...props
}) => {
  const { designTokens } = useTheme();

  const roleProps = enableRoleHydration ? {
    layoutRole,
    accessibilityRole,
    accessible,
    accessibilityLabel,
    testID,
  } : {};

  return (
    <AutoRoleView
      {...roleProps}
      style={[
        styles.container,
        {
          backgroundColor: designTokens.colors.background,
        },
        style,
      ]}
      {...props}
    >
      <View style={styles.content}>
        {children || (
          <AutoRoleView
            layoutRole="home-content"
            accessibilityRole="text"
            accessibilityLabel="Welcome to the home screen"
            style={styles.welcomeText}
          >
            {/* Default home content */}
          </AutoRoleView>
        )}
      </View>
    </AutoRoleView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  welcomeText: {
    fontSize: 18,
    textAlign: 'center',
  },
}); 