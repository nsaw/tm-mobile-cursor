import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { DashboardScreen } from '../screens/DashboardScreen';
import { colors, spacing, typography } from '../../../theme/theme';

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
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dashboard Example</Text>
      <Text style={styles.subtitle}>
        This demonstrates the complete dashboard with all components
      </Text>
      
      <DashboardScreen navigation={mockNavigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  title: {
    ...typography.heading,
    color: colors.text,
    textAlign: 'center',
    padding: spacing.lg,
  },
  subtitle: {
    ...typography.body,
    color: colors.subtext,
    textAlign: 'center',
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
}); 