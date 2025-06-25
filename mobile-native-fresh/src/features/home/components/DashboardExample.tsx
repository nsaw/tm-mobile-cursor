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
  const { tokens } = useTheme();
  const styles = getStyles(tokens);
  return (
    <View style={{ backgroundColor: tokens?.colors?.background ?? '#0D0D0F' }}>
      <Text style={styles.title}>Dashboard Example</Text>
      <Text style={styles.subtitle}>
        This demonstrates the complete dashboard with all components
      </Text>
      
      <DashboardScreen navigation={mockNavigation} />
    </View>
  );
};

const getStyles = (tokens: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: tokens?.colors?.background ?? '#0D0D0F',
  },
  title: {
    ...tokens.typography.heading,
    color: tokens?.colors?.text ?? '#FFFFFF',
    textAlign: 'center',
    padding: tokens.spacing.lg,
  },
  subtitle: {
    ...tokens.typography.body,
    color: tokens?.colors?.textSecondary ?? '#808080',
    textAlign: 'center',
    paddingHorizontal: tokens.spacing.lg,
    marginBottom: tokens.spacing.md,
  },
}); 