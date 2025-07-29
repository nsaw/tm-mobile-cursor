import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { DashboardScreen } from '../screens/DashboardScreen';
import { useTheme } from '../../../theme/ThemeProvider';

// Mock navigation for the example
const mockNavigation = {
  navigate: (screen: string, params?: any) => {
    console.log('Navigate to:', screen, params);
  },
  goBack: () => {
    console.log('Go back');
  },
};

export const DashboardExample: React.FC = () => {
  const { tokens: designTokens } = useTheme();

  const styles = StyleSheet.create({
    body: {
      color: designTokens.colors.textSecondary ?? '#808080',
      fontFamily: designTokens.typography.fontFamily.body,
      fontSize: designTokens.typography.fontSize.sm,
      marginBottom: designTokens.spacing.md,
      paddingHorizontal: designTokens.spacing.lg,
      textAlign: 'center',
    },
    container: {
      backgroundColor: designTokens.colors.background ?? '#0D0D0F',
      flex: 1,
    },
    header: {
      color: designTokens.colors.text ?? '#FFFFFF',
      fontFamily: designTokens.typography.fontFamily.heading,
      fontSize: designTokens.typography.fontSize.heading,
      padding: designTokens.spacing.lg,
      textAlign: 'center',
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Dashboard Example</Text>
      <Text style={styles.body}>
        This is an example dashboard component. Replace this with your actual dashboard content.
      </Text>
      
      <DashboardScreen navigation={mockNavigation} />
    </View>
  );
}; 