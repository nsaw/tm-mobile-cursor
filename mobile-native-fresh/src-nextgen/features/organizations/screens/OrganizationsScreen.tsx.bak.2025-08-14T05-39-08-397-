import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useOrganizations } from '../hooks/useOrganizations';
import { OrganizationCard } from '../components/OrganizationCard';

export const OrganizationsScreen: React.FC = () => {
  const {
    organizations,
    loading,
    error,
    refreshOrganizations,
  } = useOrganizations();

  const renderOrganization = ({ item }: { item: any }) => (
    <OrganizationCard
      organization={item}
      onPress={() => {
        // Navigate to organization details
        console.log('Navigate to organization:', item.id);
      }}
    />
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name='business' size={64} color='#ccc' />
      <Text style={styles.emptyTitle}>No Organizations</Text>
      <Text style={styles.emptyText}>
        You haven't joined any organizations yet.
      </Text>
      <TouchableOpacity style={styles.createButton} accessibilityRole="button" accessible={true} accessibilityLabel="Button">
        <Ionicons name='add' size={20} color='#fff' />
        <Text style={styles.createButtonText}>Create Organization</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Organizations</Text>
        <TouchableOpacity style={styles.addButton} accessibilityRole="button" accessible={true} accessibilityLabel="Button">
          <Ionicons name='add' size={24} color='#007AFF' />
        </TouchableOpacity>
      </View>

      <FlatList
        data={organizations}
        renderItem={renderOrganization}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        refreshControl={(
          <RefreshControl
            refreshing={loading}
            onRefresh={refreshOrganizations}
          />
        )}
        ListEmptyComponent={renderEmpty}
        showsVerticalScrollIndicator={false}
      />
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
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
  },
  addButton: {
    padding: 8,
  },
  listContainer: {
    padding: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  createButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#fff',
    marginLeft: 8,
  },
});
