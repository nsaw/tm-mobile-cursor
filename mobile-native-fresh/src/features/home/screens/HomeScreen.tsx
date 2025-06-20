import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  SafeAreaView,
} from 'react-native';
import { useThoughtmarks } from '../hooks/useThoughtmarks';
import { useBins } from '../hooks/useBins';
import { ThoughtmarkCard } from '../components/ThoughtmarkCard';
import { ThoughtmarkList } from '../components/ThoughtmarkList';
import { QuickActions } from '../components/QuickActions';
import { SearchBar } from '../components/SearchBar';
import type { Thoughtmark, Bin } from '../../../types';

export const HomeScreen = ({ navigation }: { navigation: any }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBin, setSelectedBin] = useState<Bin | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const {
    thoughtmarks,
    loading: thoughtmarksLoading,
    error: thoughtmarksError,
    fetchThoughtmarks,
    searchThoughtmarks,
  } = useThoughtmarks();

  const {
    bins,
    loading: binsLoading,
    fetchBins,
  } = useBins();

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    await Promise.all([
      fetchThoughtmarks(),
      fetchBins(),
    ]);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadInitialData();
    setRefreshing(false);
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      await searchThoughtmarks(query);
    } else {
      await fetchThoughtmarks();
    }
  };

  const handleThoughtmarkPress = (thoughtmark: Thoughtmark) => {
    navigation.navigate('ThoughtmarkDetail', { thoughtmarkId: thoughtmark.id });
  };

  const handleCreateNew = () => {
    navigation.navigate('CreateThoughtmark');
  };

  const handleBinPress = (bin: Bin) => {
    setSelectedBin(bin);
    navigation.navigate('BinDetail', { binId: bin.id });
  };

  const filteredThoughtmarks = selectedBin
    ? thoughtmarks.filter(tm => tm.binId === selectedBin.id)
    : thoughtmarks;

  const recentThoughtmarks = thoughtmarks
    .filter(tm => !tm.isArchived && !tm.isDeleted)
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5);

  const pinnedThoughtmarks = thoughtmarks.filter(tm => tm.isPinned);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Thoughtmarks</Text>
        <TouchableOpacity
          style={styles.profileButton}
          onPress={() => navigation.navigate('Profile')}
        >
          <Text style={styles.profileButtonText}>👤</Text>
        </TouchableOpacity>
      </View>

      <SearchBar
        value={searchQuery}
        onChangeText={handleSearch}
        placeholder="Search thoughtmarks..."
      />

      <QuickActions
        onCreateThoughtmark={handleCreateNew}
        onCreateBin={() => navigation.navigate('CreateBin')}
        onVoiceRecord={() => navigation.navigate('VoiceRecord')}
      />

      <FlatList
        data={filteredThoughtmarks}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <ThoughtmarkCard
            thoughtmark={item}
            onPress={() => handleThoughtmarkPress(item)}
          />
        )}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
          />
        }
        ListHeaderComponent={
          <>
            {pinnedThoughtmarks.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Pinned</Text>
                <ThoughtmarkList
                  thoughtmarks={pinnedThoughtmarks}
                  onThoughtmarkPress={handleThoughtmarkPress}
                  horizontal
                />
              </View>
            )}
            
            {recentThoughtmarks.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Recent</Text>
                <ThoughtmarkList
                  thoughtmarks={recentThoughtmarks}
                  onThoughtmarkPress={handleThoughtmarkPress}
                  horizontal
                />
              </View>
            )}

            {bins.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Bins</Text>
                <FlatList
                  data={bins.filter(bin => !bin.isArchived && !bin.isDeleted)}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  keyExtractor={(item) => item.id.toString()}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={[styles.binCard, { backgroundColor: item.color || '#f0f0f0' }]}
                      onPress={() => handleBinPress(item)}
                    >
                      <Text style={styles.binIcon}>{item.icon || '📁'}</Text>
                      <Text style={styles.binName} numberOfLines={1}>
                        {item.name}
                      </Text>
                    </TouchableOpacity>
                  )}
                />
              </View>
            )}

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>All Thoughtmarks</Text>
            </View>
          </>
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>
              {thoughtmarksLoading ? 'Loading...' : 'No thoughtmarks yet'}
            </Text>
            {!thoughtmarksLoading && (
              <TouchableOpacity style={styles.createButton} onPress={handleCreateNew}>
                <Text style={styles.createButtonText}>Create your first thoughtmark</Text>
              </TouchableOpacity>
            )}
          </View>
        }
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileButtonText: {
    fontSize: 18,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    paddingHorizontal: 16,
    color: '#1a1a1a',
  },
  binCard: {
    width: 100,
    height: 80,
    borderRadius: 12,
    marginLeft: 16,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  binIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  binName: {
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
    color: '#1a1a1a',
  },
  listContent: {
    paddingBottom: 20,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingVertical: 64,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 24,
  },
  createButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  createButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});