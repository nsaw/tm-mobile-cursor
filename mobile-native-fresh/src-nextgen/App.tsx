import React from 'react';
import { SafeAreaView, View, Text, StyleSheet } from 'react-native';

// Simplified theme system for immediate functionality
const theme = {
  colors: {
    background: '#000000',
    surface: '#1C1C1E',
    text: '#FFFFFF',
    textSecondary: '#8E8E93',
    border: '#38383A',
    primary: '#0A84FF',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
};

// Basic NextGen App component
const NextGenApp: React.FC = () => {
  console.log('[NEXTGEN] App component mounted ✅');

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.content}>
        <Text style={[styles.title, { color: theme.colors.text }]}>
          🚀 NextGen App
        </Text>
        <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
          Successfully loaded from src-nextgen/
        </Text>
        <View style={[styles.card, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
          <Text style={[styles.cardText, { color: theme.colors.text }]}>
            ✅ Theme system working{'\n'}
            ✅ Component structure loaded{'\n'}
            ✅ NextGen architecture active{'\n'}
            ✅ No complex dependencies
          </Text>
        </View>
        <View style={[styles.statusCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
          <Text style={[styles.statusText, { color: theme.colors.textSecondary }]}>
            Status: Ready for Phase 3 migration{'\n'}
            TypeScript Errors: 503 (to be fixed){'\n'}
            Next Step: Fix module resolution
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.lg,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
  },
  card: {
    padding: theme.spacing.lg,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: theme.spacing.md,
    minWidth: 280,
  },
  cardText: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  statusCard: {
    padding: theme.spacing.md,
    borderRadius: 8,
    borderWidth: 1,
    minWidth: 280,
  },
  statusText: {
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 16,
  },
});

export default NextGenApp; 