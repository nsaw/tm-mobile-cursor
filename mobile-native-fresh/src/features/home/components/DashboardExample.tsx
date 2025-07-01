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
    container: {
      flex: 1,
      backgroundColor: designTokens.colors.background ?? '#0D0D0F',
    },
    header: {
      fontFamily: designTokens.typography.fontFamily.heading,
      fontSize: designTokens.typography.fontSize.heading,
      color: designTokens.colors.text ?? '#FFFFFF',
      textAlign: 'center',
      padding: designTokens.spacing.lg,
    },
    body: {
      fontFamily: designTokens.typography.fontFamily.body,
      fontSize: designTokens.typography.fontSize.sm,
      color: designTokens.colors.textSecondary ?? '#808080',
      textAlign: 'center',
      paddingHorizontal: designTokens.spacing.lg,
      marginBottom: designTokens.spacing.md,
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