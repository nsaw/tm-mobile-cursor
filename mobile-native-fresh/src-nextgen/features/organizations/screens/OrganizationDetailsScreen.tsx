import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useOrganization } from '../hooks/useOrganization';
import { OrganizationCard } from '../components/OrganizationCard';

interface OrganizationDetailsScreenProps {
  organizationId: string;
}

export const OrganizationDetailsScreen: React.FC<OrganizationDetailsScreenProps> = ({
  organizationId,
}) => {
  const {
    organization,
    loading,
    error,
    updateOrganization,
    deleteOrganization,
  } = useOrganization(organizationId);

  const handleDelete = () => {
    Alert.alert(
      'Delete Organization',
      'Are you sure you want to delete this organization? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteOrganization(),
        },
      ]
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!organization) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Ionicons name='alert-circle' size={64} color='#ff3b30' />
          <Text style={styles.errorText}>Organization not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} accessibilityRole="button" accessible={true} accessibilityLabel="Button">
          <Ionicons name='arrow-back' size={24} color='#007AFF' />
        </TouchableOpacity>
        <Text style={styles.title}>Organization Details</Text>
        <TouchableOpacity style={styles.menuButton} accessibilityRole="button" accessible={true} accessibilityLabel="Button">
          <Ionicons name='ellipsis-vertical' size={24} color='#007AFF' />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.organizationCard}>
          <OrganizationCard organization={organization} showMemberCount={false} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Details</Text>
          <View style={styles.detailItem}>
            <Ionicons name='people' size={20} color='#666' />
            <Text style={styles.detailLabel}>Members</Text>
            <Text style={styles.detailValue}>{organization.memberCount || 0}</Text>
          </View>
          {organization.website && (
            <View style={styles.detailItem}>
              <Ionicons name='globe' size={20} color='#666' />
              <Text style={styles.detailLabel}>Website</Text>
              <Text style={styles.detailValue}>{organization.website}</Text>
            </View>
          )}
          <View style={styles.detailItem}>
            <Ionicons name='calendar' size={20} color='#666' />
            <Text style={styles.detailLabel}>Created</Text>
            <Text style={styles.detailValue}>
              {new Date(organization.createdAt).toLocaleDateString()}
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Actions</Text>
          <TouchableOpacity style={styles.actionButton} accessibilityRole="button" accessible={true} accessibilityLabel="Button">
            <Ionicons name='create' size={20} color='#007AFF' />
            <Text style={styles.actionButtonText}>Edit Organization</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} accessibilityRole="button" accessible={true} accessibilityLabel="Button">
            <Ionicons name='people' size={20} color='#007AFF' />
            <Text style={styles.actionButtonText}>Manage Members</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} accessibilityRole="button" accessible={true} accessibilityLabel="Button">
            <Ionicons name='settings' size={20} color='#007AFF' />
            <Text style={styles.actionButtonText}>Settings</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.deleteButton]}
            onPress={handleDelete}
           accessibilityRole="button" accessible={true} accessibilityLabel="Button">
            <Ionicons name='trash' size={20} color='#ff3b30' />
            <Text style={[styles.actionButtonText, styles.deleteButtonText]}>
              Delete Organization
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  menuButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#666',
    marginTop: 16,
  },
  organizationCard: {
    marginBottom: 16,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
    flex: 1,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    marginBottom: 8,
  },
  actionButtonText: {
    fontSize: 16,
    color: '#007AFF',
    marginLeft: 8,
  },
  deleteButton: {
    marginTop: 8,
  },
  deleteButtonText: {
    color: '#ff3b30',
  },
});
