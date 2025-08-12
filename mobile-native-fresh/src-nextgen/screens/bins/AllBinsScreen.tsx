import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import { useTheme } from '../../theme/ThemeProvider';
import { ModernHeader } from '../../components/ui/ModernHeader';
import { BottomNav } from '../../components/ui/BottomNav';
import { useAuth } from '../../hooks/useAuth';

type SortType = 'name' | 'count' | 'date' | 'created' | 'updated';

export const AllBinsScreen: React.FC = () => {
  const navigation = useNavigation();
  const { tokens: _designTokens } = useTheme();
  const { user: _user } = useAuth();

  const [refreshing, setRefreshing] = useState(false);
  const [sortBy, setSortBy] = useState<SortType>('name');

  // Mock data for now
  const bins = [
    { id: 1, name: 'Personal', description: 'Personal thoughts and ideas', createdAt: new Date(), updatedAt: new Date() },
    { id: 2, name: 'Work', description: 'Work-related notes and tasks', createdAt: new Date(), updatedAt: new Date() },
    { id: 3, name: 'Ideas', description: 'Creative ideas and concepts', createdAt: new Date(), updatedAt: new Date() },
  ];
  const thoughtmarks = [
    { id: 1, title: 'Sample thoughtmark 1', content: 'This is a sample thoughtmark', binId: 1, createdAt: new Date() },
    { id: 2, title: 'Sample thoughtmark 2', content: 'Another sample thoughtmark', binId: 1, createdAt: new Date() },
    { id: 3, title: 'Work task', content: 'Important work task', binId: 2, createdAt: new Date() },
  ];

  const handleRefresh = async () => {
    setRefreshing(true);
    // TODO: Implement actual refresh logic
    await new Promise<void>(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  interface Bin {
    id: number;
    name: string;
    description: string;
    createdAt: Date;
    updatedAt: Date;
  }

  const handleBinPress = (bin: Bin) => {
    // TODO: Navigate to bin detail screen
    console.log('Bin pressed:', bin.name);
  };

  const handleCreateBin = () => {
    // TODO: Navigate to create bin screen
    console.log('Create bin pressed');
  };

  const handleEditBin = (bin: Bin) => {
    // TODO: Navigate to edit bin screen
    console.log('Edit bin:', bin.name);
  };

  const handleDeleteBin = (bin: Bin) => {
    // TODO: Show confirmation dialog and delete bin
    console.log('Delete bin:', bin.name);
  };

  const getBinThoughtmarkCount = (binId: number) => {
    return thoughtmarks.filter(t => t.binId === binId).length;
  };

  const getSortedBins = () => {
    return [...bins].sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'count':
          return getBinThoughtmarkCount(b.id) - getBinThoughtmarkCount(a.id);
        case 'date':
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
        case 'created':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'updated':
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
        default:
          return 0;
      }
    });
  };

  const renderBinItem = ({ item: bin }: { item: Bin }) => {
    const thoughtmarkCount = getBinThoughtmarkCount(bin.id);
    
    return (
      <TouchableOpacity
        style={styles.binItem}
        onPress={() => handleBinPress(bin)}
        activeOpacity={0.7}
      >
        <View style={styles.binCard}>
          <View style={styles.binHeader}>
            <View style={styles.binInfo}>
              <Text style={styles.binName}>{bin.name}</Text>
              <Text style={styles.binDescription}>{bin.description}</Text>
              <Text style={styles.binCount}>{thoughtmarkCount} thoughtmarks</Text>
            </View>
            <View style={styles.binActions}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => handleEditBin(bin)}
              >
                <Ionicons name="create-outline" size={20} color="#666" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => handleDeleteBin(bin)}
              >
                <Ionicons name="trash-outline" size={20} color="#666" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderSortButton = (type: SortType, label: string) => (
    <TouchableOpacity
      style={[
        styles.sortButton,
        sortBy === type && styles.sortButtonActive
      ]}
      onPress={() => setSortBy(type)}
    >
      <Text style={[
        styles.sortButtonText,
        sortBy === type && styles.sortButtonTextActive
      ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <ModernHeader
        title="All Bins"
        subtitle={`${bins.length} bin${bins.length !== 1 ? 's' : ''}`}
        rightAction={{ icon: '+', onPress: handleCreateBin }}
      />
      
      <View style={styles.content}>
        {/* Sort Controls */}
        <View style={styles.sortControls}>
          {renderSortButton('name', 'Name')}
          {renderSortButton('count', 'Count')}
          {renderSortButton('date', 'Updated')}
          {renderSortButton('created', 'Created')}
        </View>

        {/* Bins List */}
        <FlatList
          data={getSortedBins()}
          renderItem={renderBinItem}
          keyExtractor={(item: Bin) => item.id.toString()}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      </View>
      
      <BottomNav navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  sortControls: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 8,
  },
  sortButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#2A2A2A',
    borderWidth: 1,
    borderColor: '#444444',
  },
  sortButtonActive: {
    backgroundColor: '#3A3A3A',
    borderColor: '#666666',
  },
  sortButtonText: {
    fontSize: 12,
    color: '#CCCCCC',
    fontWeight: '500',
  },
  sortButtonTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  listContainer: {
    paddingBottom: 16,
  },
  binItem: {
    marginBottom: 12,
  },
  binCard: {
    padding: 16,
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#333333',
  },
  binHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  binInfo: {
    flex: 1,
    marginRight: 12,
  },
  binName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  binDescription: {
    fontSize: 14,
    color: '#CCCCCC',
    lineHeight: 20,
  },
  binCount: {
    fontSize: 14,
    color: '#999999',
    marginTop: 4,
  },
  binActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    padding: 8,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 16,
    color: '#CCCCCC',
    textAlign: 'center',
    marginBottom: 24,
    paddingHorizontal: 32,
  },
  createButton: {
    minWidth: 160,
    backgroundColor: '#4CAF50', // Added a background color for the button
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  createButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
