import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BinCard } from '../components/BinCard';
import { CreateBinModal } from '../components/CreateBinModal';
import { binService } from '../services/binService';
import { Bin, CreateBinRequest, BinFilters } from '../types/binTypes';

export const BinsScreen: React.FC = () => {
  const [bins, setBins] = useState<Bin[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filters, setFilters] = useState<BinFilters>({
    includeArchived: false,
    sortBy: 'name',
    sortOrder: 'asc',
  });

  useEffect(() => {
    loadBins();
  }, [filters]);

  const loadBins = async () => {
    try {
      setLoading(true);
      const data = await binService.getBins(filters);
      setBins(data);
    } catch (error) {
      console.error('Error loading bins:', error);
      Alert.alert('Error', 'Failed to load bins');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadBins();
    setRefreshing(false);
  };

  const handleCreateBin = async (binData: CreateBinRequest) => {
    try {
      const newBin = await binService.createBin(binData);
      setBins(prev => [newBin, ...prev]);
    } catch (error) {
      console.error('Error creating bin:', error);
      throw error;
    }
  };

  const handleEditBin = (bin: Bin) => {
    // Navigate to edit screen or show edit modal
    console.log('Edit bin:', bin.id);
  };

  const handleDeleteBin = (bin: Bin) => {
    Alert.alert(
      'Delete Bin',
      `Are you sure you want to delete '${bin.name}'? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await binService.deleteBin(bin.id);
              setBins(prev => prev.filter(b => b.id !== bin.id));
            } catch (error) {
              console.error('Error deleting bin:', error);
              Alert.alert('Error', 'Failed to delete bin');
            }
          },
        },
      ]
    );
  };

  const handleBinPress = (bin: Bin) => {
    // Navigate to bin details or thoughts in bin
    console.log('Open bin:', bin.id);
  };

  const renderBin = ({ item }: { item: Bin }) => (
    <BinCard
      bin={item}
      onPress={handleBinPress}
      onEdit={handleEditBin}
      onDelete={handleDeleteBin}
    />
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name='folder-open' size={64} color='#ccc' />
      <Text style={styles.emptyTitle}>No Bins Yet</Text>
      <Text style={styles.emptySubtitle}>
        Create your first bin to start organizing your thoughts
      </Text>
      <TouchableOpacity
        style={styles.createButton}
        onPress={() => setShowCreateModal(true)}
      >
        <Ionicons name='add' size={20} color='#fff' />
        <Text style={styles.createButtonText}>Create First Bin</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Bins</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowCreateModal(true)}
        >
          <Ionicons name='add' size={24} color='#fff' />
        </TouchableOpacity>
      </View>

      <FlatList
        data={bins}
        renderItem={renderBin}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        ListEmptyComponent={!loading ? renderEmptyState() : null}
      />

      <CreateBinModal
        visible={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateBin}
      />
    </View>
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
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
  },
  addButton: {
    backgroundColor: '#007AFF',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {
    padding: 16,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    marginTop: 100,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  createButton: {
    flexDirection: 'row',
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  createButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
    marginLeft: 8,
  },
});
