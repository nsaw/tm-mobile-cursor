import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { useAuth } from '../../features/auth/hooks/useAuth';
import { Card } from './Card';
import { AutoRoleView } from './AutoRoleView';

export const HydrationTestCard: React.FC = () => {
  const { tokens: designTokens, isHydrated, isDarkMode, isFluidTheme } = useTheme();
  const { user, isAuthenticated, loading, guestMode } = useAuth();

  const getHydrationStatus = () => {
    if (loading) return '🔄 Loading...';
    if (!isHydrated) return '🔄 Theme Hydrating...';
    if (guestMode) return '👤 Guest Mode';
    if (isAuthenticated && user) return '✅ Authenticated';
    return '❌ Not Authenticated';
  };

  const getThemeStatus = () => {
    if (!isHydrated) return '🔄 Hydrating...';
    return `${isDarkMode ? '🌙' : '☀️'} ${isDarkMode ? 'Dark' : 'Light'} Mode`;
  };

  const getRoleStatus = () => {
    if (!user) return 'N/A';
    if (user.isPremium) return '👑 Premium';
    if (user.isTestUser) return '🧪 Test User';
    return '👤 Standard';
  };

  return (
    <Card style={styles.container}>
      <Text style={[styles.title, { color: designTokens.colors.text }]}>
        Hydration Status
      </Text>
      
      <AutoRoleView style={styles.row}>
        <Text style={[styles.label, { color: designTokens.colors.textSecondary }]}>
          Auth Status:
        </Text>
        <Text style={[styles.value, { color: designTokens.colors.text }]}>
          {getHydrationStatus()}
        </Text>
      </AutoRoleView>

      <AutoRoleView style={styles.row}>
        <Text style={[styles.label, { color: designTokens.colors.textSecondary }]}>
          Theme Status:
        </Text>
        <Text style={[styles.value, { color: designTokens.colors.text }]}>
          {getThemeStatus()}
        </Text>
      </AutoRoleView>

      <AutoRoleView style={styles.row}>
        <Text style={[styles.label, { color: designTokens.colors.textSecondary }]}>
          User Role:
        </Text>
        <Text style={[styles.value, { color: designTokens.colors.text }]}>
          {getRoleStatus()}
        </Text>
      </AutoRoleView>

      {user && (
        <AutoRoleView style={styles.row}>
          <Text style={[styles.label, { color: designTokens.colors.textSecondary }]}>
            User:
          </Text>
          <Text style={[styles.value, { color: designTokens.colors.text }]}>
            {user.firstName} {user.lastName}
          </Text>
        </AutoRoleView>
      )}

      <AutoRoleView style={styles.row}>
        <Text style={[styles.label, { color: designTokens.colors.textSecondary }]}>
          Fluid Theme:
        </Text>
        <Text style={[styles.value, { color: designTokens.colors.text }]}>
          {isFluidTheme ? '✅ Enabled' : '❌ Disabled'}
        </Text>
      </AutoRoleView>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 16,
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
  },
  value: {
    fontSize: 14,
    fontWeight: '600',
  },
}); 