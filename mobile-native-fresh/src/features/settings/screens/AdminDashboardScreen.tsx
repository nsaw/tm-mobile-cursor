import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../theme/ThemeProvider';
import { Button } from '../../../components/ui/Button';
import { Card, CardHeader, CardContent } from '../../../components/ui/Card';
import { useAuth } from '../../auth/hooks/useAuth';

export const AdminDashboardScreen: React.FC = ({ navigation }: any) => {
  const { user } = useAuth();
  const { tokens } = useTheme();
  const styles = getStyles(tokens);

  // Check if user is admin (you can customize this logic)
  const isAdmin = user?.email?.includes('admin') || user?.isAdmin || false;

  if (!isAdmin) {
    return (
      <View style={styles.container}>
        <View style={styles.accessDenied}>
          <Ionicons name="lock-closed" size={48} color={tokens?.colors?.danger ?? '#FF3B30'} />
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
    <View style={{ flex: 1, backgroundColor: tokens?.colors?.background ?? '#0D0D0F' }}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={tokens?.colors?.text ?? '#000'} />
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
                leftIcon={<Ionicons name="color-palette-outline" size={16} color={tokens?.colors?.accent ?? '#000'} />}
                style={styles.adminButton}
              >
                Design System Demo
              </Button>
              
              <Button
                variant="outline"
                onPress={handleExportData}
                leftIcon={<Ionicons name="download-outline" size={16} color={tokens?.colors?.accent ?? '#000'} />}
                style={styles.adminButton}
              >
                Export Data
              </Button>
              
              <Button
                variant="outline"
                onPress={handleImportData}
                leftIcon={<Ionicons name="cloud-upload-outline" size={16} color={tokens?.colors?.accent ?? '#000'} />}
                style={styles.adminButton}
              >
                Import Data
              </Button>
            </View>
          </CardContent>
        </Card>

        {/* System Management */}
        <Card variant="elevated" style={styles.section}>
          <CardHeader>
            <Text style={styles.sectionTitle}>System Management</Text>
          </CardHeader>
          <CardContent>
            <View style={styles.buttonGrid}>
              <Button
                variant="destructive"
                onPress={handleDatabaseReset}
                leftIcon={<Ionicons name="refresh-outline" size={16} color={tokens?.colors?.background ?? '#0D0D0F'} />}
                style={styles.adminButton}
              >
                Reset to Demo
              </Button>
              
              <Button
                variant="outline"
                onPress={() => Alert.alert('Logs', 'System logs functionality coming soon.')}
                leftIcon={<Ionicons name="document-text-outline" size={16} color={tokens?.colors?.accent ?? '#000'} />}
                style={styles.adminButton}
              >
                View Logs
              </Button>
              
              <Button
                variant="outline"
                onPress={() => Alert.alert('Analytics', 'Analytics dashboard coming soon.')}
                leftIcon={<Ionicons name="analytics-outline" size={16} color={tokens?.colors?.accent ?? '#000'} />}
                style={styles.adminButton}
              >
                Analytics
              </Button>
            </View>
          </CardContent>
        </Card>

        {/* User Management */}
        <Card variant="elevated" style={styles.section}>
          <CardHeader>
            <Text style={styles.sectionTitle}>User Management</Text>
          </CardHeader>
          <CardContent>
            <View style={styles.buttonGrid}>
              <Button
                variant="outline"
                onPress={() => Alert.alert('Users', 'User management functionality coming soon.')}
                leftIcon={<Ionicons name="people-outline" size={16} color={tokens?.colors?.accent ?? '#000'} />}
                style={styles.adminButton}
              >
                Manage Users
              </Button>
              
              <Button
                variant="outline"
                onPress={() => Alert.alert('Permissions', 'Permission management coming soon.')}
                leftIcon={<Ionicons name="shield-outline" size={16} color={tokens?.colors?.accent ?? '#000'} />}
                style={styles.adminButton}
              >
                Permissions
              </Button>
            </View>
          </CardContent>
        </Card>
      </ScrollView>
    </View>
  );
};

const getStyles = (tokens: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: tokens?.colors?.background ?? '#0D0D0F',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: tokens.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: tokens?.colors?.border ?? '#000',
  },
  backButton: {
    padding: tokens.spacing.sm,
  },
  title: {
    fontSize: tokens.typography.heading.fontSize,
    fontWeight: '700',
    color: tokens?.colors?.text ?? '#000',
    fontFamily: 'Ubuntu_700Bold',
  },
  headerRight: {
    width: 48,
  },
  accessDenied: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: tokens.spacing.xl,
  },
  accessDeniedTitle: {
    fontSize: tokens.typography.heading.fontSize,
    fontWeight: '700',
    color: tokens?.colors?.danger ?? '#FF3B30',
    marginTop: tokens.spacing.md,
    fontFamily: 'Ubuntu_700Bold',
  },
  accessDeniedText: {
    fontSize: tokens.typography.body.fontSize,
    color: tokens?.colors?.textSecondary ?? '#666',
    textAlign: 'center',
    marginTop: tokens.spacing.sm,
    fontFamily: 'Ubuntu_400Regular',
  },
  adminInfoCard: {
    margin: tokens.spacing.lg,
  },
  adminInfoTitle: {
    fontSize: tokens.typography.subheading.fontSize,
    fontWeight: '600',
    color: tokens?.colors?.text ?? '#000',
    fontFamily: 'Ubuntu_600SemiBold',
  },
  adminInfoText: {
    fontSize: tokens.typography.body.fontSize,
    color: tokens?.colors?.textSecondary ?? '#666',
    fontFamily: 'Ubuntu_400Regular',
  },
  section: {
    margin: tokens.spacing.lg,
  },
  sectionTitle: {
    fontSize: tokens.typography.subheading.fontSize,
    fontWeight: '600',
    color: tokens?.colors?.text ?? '#000',
    fontFamily: 'Ubuntu_600SemiBold',
  },
  buttonGrid: {
    gap: tokens.spacing.md,
  },
  adminButton: {
    justifyContent: 'flex-start',
  },
}); 