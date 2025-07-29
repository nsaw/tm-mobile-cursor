import { Text ,
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';

import { useTheme } from '../../../theme/ThemeProvider';
import { Button } from '../../../components/ui/Button';
import { Card, CardHeader, CardContent } from '../../../components/ui/Card';
import { useAuth } from '../../auth/hooks/useAuth';

export const AdminDashboardScreen: React.FC = ({ navigation }: any) => {
  const { user } = useAuth();
  const { tokens: designTokens } = useTheme();

  const styles = StyleSheet.create({
    accessDenied: {
      alignItems: 'center',
      flex: 1,
      justifyContent: 'center',
      padding: designTokens.spacing.xl,
    },
    accessDeniedText: {
      color: designTokens.colors.textSecondary ?? '#666',
      fontFamily: designTokens.typography.fontFamily.body,
      fontSize: designTokens.typography.fontSize.sm,
      marginTop: designTokens.spacing.sm,
      textAlign: 'center',
    },
    accessDeniedTitle: {
      color: designTokens.colors.danger ?? '#FF3B30',
      fontFamily: designTokens.typography.fontFamily.heading,
      fontSize: designTokens.typography.fontSize.heading,
      fontWeight: '700',
      marginTop: designTokens.spacing.md,
    },
    adminButton: {
      justifyContent: 'flex-start',
    },
    adminInfoCard: {
      margin: designTokens.spacing.lg,
    },
    adminInfoText: {
      color: designTokens.colors.textSecondary ?? '#666',
      fontFamily: designTokens.typography.fontFamily.body,
      fontSize: designTokens.typography.fontSize.sm,
    },
    adminInfoTitle: {
      color: designTokens.colors.text ?? '#000',
      fontFamily: designTokens.typography.fontFamily.heading,
      fontSize: designTokens.typography.fontSize.xl,
      fontWeight: '600',
    },
    backButton: {
      padding: designTokens.spacing.sm,
    },
    buttonGrid: {
      gap: designTokens.spacing.md,
    },
    container: {
      backgroundColor: designTokens.colors.background ?? '#0D0D0F',
      flex: 1,
    },
    header: {
      alignItems: 'center',
      borderBottomColor: designTokens.colors.border ?? '#000',
      borderBottomWidth: 1,
      flexDirection: 'row',
      justifyContent: 'space-between',
      padding: designTokens.spacing.lg,
    },
    headerRight: {
      width: 48,
    },
    scrollView: {
      flex: 1,
    },
    section: {
      margin: designTokens.spacing.lg,
    },
    sectionTitle: {
      color: designTokens.colors.text ?? '#000',
      fontFamily: designTokens.typography.fontFamily.heading,
      fontSize: designTokens.typography.fontSize.xl,
      fontWeight: '600',
    },
    title: {
      color: designTokens.colors.text ?? '#000',
      fontFamily: designTokens.typography.fontFamily.heading,
      fontSize: designTokens.typography.fontSize.heading,
      fontWeight: '700',
    },
  });

  const getIconColor = (type: 'danger' | 'accent' | 'background' | 'text') => {
    switch (type) {
      case 'danger':
        return designTokens.colors.danger ?? '#FF3B30';
      case 'accent':
        return designTokens.colors.accent ?? '#000';
      case 'background':
        return designTokens.colors.background ?? '#0D0D0F';
      case 'text':
        return designTokens.colors.text ?? '#000';
      default:
        return '#000';
    }
  };

  // Check if user is admin (you can customize this logic)
  const isAdmin = user?.email?.includes('admin') || user?.isAdmin || false;

  if (!isAdmin) {
    return (
      <View style={styles.container}>
        <View style={styles.accessDenied}>
          <Ionicons name="lock-closed" size={48} color={getIconColor('danger')} />
          <Text style={styles.accessDeniedTitle}>Access Denied</Text>
          <Text style={styles.accessDeniedText}>
            This area is restricted to administrators only.
          </Text>
        </View>
      </View>
    );
  }

  const handleDesignSystemDemo = () => {
    navigation.navigate('DesignSystemDemo');
  };

  const handleDatabaseReset = () => {
    Alert.alert(
      'Reset Database',
      'This will reset all data to demo state. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            // Implement database reset logic here
            Alert.alert('Success', 'Database has been reset to demo state.');
          },
        },
      ]
    );
  };

  const handleExportData = () => {
    Alert.alert('Export Data', 'Data export functionality coming soon.');
  };

  const handleImportData = () => {
    Alert.alert('Import Data', 'Data import functionality coming soon.');
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          accessibilityRole="button"
          accessible={true}
          accessibilityLabel="Go back"
        >
          <Ionicons name="arrow-back" size={24} color={getIconColor('text')} />
        </TouchableOpacity>
          <Text style={styles.title}>Admin Dashboard</Text>
          <View style={styles.headerRight} />
        </View>

        {/* Admin Info */}
        <Card variant="elevated" style={styles.adminInfoCard}>
          <CardHeader>
            <Text style={styles.adminInfoTitle}>Administrator Access</Text>
          </CardHeader>
          <CardContent>
            <Text style={styles.adminInfoText}>
              Welcome, {user?.email}. You have full administrative access to the system.
            </Text>
          </CardContent>
        </Card>

        {/* Development Tools */}
        <Card variant="elevated" style={styles.section}>
          <CardHeader>
            <Text style={styles.sectionTitle}>Development Tools</Text>
          </CardHeader>
          <CardContent>
            <View style={styles.buttonGrid}>
              <Button
                variant="outline"
                onPress={handleDesignSystemDemo}
                leftIcon={<Ionicons name="color-palette-outline" size={16} color={getIconColor('accent')} />}
                style={styles.adminButton}
              ><Text>Design System Demo</Text></Button>

              <Button
                variant="outline"
                onPress={handleDatabaseReset}
                leftIcon={<Ionicons name="refresh-outline" size={16} color={getIconColor('danger')} />}
                style={styles.adminButton}
              ><Text>Reset Database</Text></Button>

              <Button
                variant="outline"
                onPress={handleExportData}
                leftIcon={<Ionicons name="download-outline" size={16} color={getIconColor('accent')} />}
                style={styles.adminButton}
              ><Text>Export Data</Text></Button>

              <Button
                variant="outline"
                onPress={handleImportData}
                leftIcon={<Ionicons name="cloud-upload-outline" size={16} color={getIconColor('accent')} />}
                style={styles.adminButton}
              ><Text>Import Data</Text></Button>
            </View>
          </CardContent>
        </Card>
      </ScrollView>
    </View>
  );
}; 