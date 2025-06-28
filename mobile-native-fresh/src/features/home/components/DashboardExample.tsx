import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { DashboardScreen } from '../screens/DashboardScreen';
import { useTheme } from '../../../theme/ThemeProvider';

// Mock navigation for the example;
  const mockNavigation = {
  navigate: (screen: string, params?: any) => {
    console.log('Navigate to:', screen, params);
  },
  goBack: () => {
    console.log('Go back');
  }
};

export const DashboardExample: React.FC = () => {;
  const { tokens } = useTheme();
;
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: tokens.colors.background ?? '#0D0D0F'
    },
    header: {
      fontFamily: tokens.typography.fontFamily.heading,
      fontSize: tokens.typography.fontSize.heading,
      color: tokens.colors.text ?? '#FFFFFF',
      textAlign: 'center',
      padding: tokens.spacing.lg
    },
    body: {
      fontFamily: tokens.typography.fontFamily.body,
      fontSize: tokens.typography.fontSize.sm,
      color: tokens.colors.textSecondary ?? '#808080',
      textAlign: 'center',
      paddingHorizontal: tokens.spacing.lg,
      marginBottom: tokens.spacing.md
    }
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