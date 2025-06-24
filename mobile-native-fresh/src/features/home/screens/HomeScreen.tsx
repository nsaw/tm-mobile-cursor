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
import { colors, spacing, typography } from '../../../theme/theme';
import type { Thoughtmark, Bin, ThoughtmarkWithBin } from '../../../types';

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

  const handleThoughtmarkEdit = (thoughtmark: Thoughtmark) => {
    navigation.navigate('CreateThoughtmark', { thoughtmarkId: thoughtmark.id });
  };

  const handleCreateNew = () => {
    navigation.navigate('CreateThoughtmark');
  };

  const handleBinPress = (bin: Bin) => {
    setSelectedBin(bin);
    navigation.navigate('BinDetail', { binId: bin.id });
  };

  // Convert Thoughtmark to ThoughtmarkWithBin by adding binName
  const thoughtmarksWithBin: ThoughtmarkWithBin[] = thoughtmarks.map(tm => ({
    ...tm,
    binName: bins.find(bin => bin.id === tm.binId)?.name,
  }));

  const filteredThoughtmarks = selectedBin
    ? thoughtmarksWithBin.filter(tm => tm.binId === selectedBin.id)
    : thoughtmarksWithBin;

  const recentThoughtmarks = thoughtmarksWithBin
    .filter(tm => !tm.isArchived && !tm.isDeleted)
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5);

  const pinnedThoughtmarks = thoughtmarksWithBin.filter(tm => tm.isPinned);

  const renderThoughtmarkCard = ({ item }: { item: ThoughtmarkWithBin }) => (
    <ThoughtmarkCard
      thoughtmark={item}
      onClick={() => handleThoughtmarkPress(item)}
      onEdit={() => handleThoughtmarkEdit(item)}
      onArchive={() => {
        // TODO: Implement archive functionality
        console.log('Archive thoughtmark:', item.id);
      }}
    />
  );

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
        renderItem={renderThoughtmarkCard}
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
                <FlatList
                  data={pinnedThoughtmarks}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  keyExtractor={(item) => item.id.toString()}
                  renderItem={renderThoughtmarkCard}
                  contentContainerStyle={styles.horizontalList}
                />
              </View>
            )}
            
            {recentThoughtmarks.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Recent</Text>
                <FlatList
                  data={recentThoughtmarks}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  keyExtractor={(item) => item.id.toString()}
                  renderItem={renderThoughtmarkCard}
                  contentContainerStyle={styles.horizontalList}
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
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  title: {
    ...typography.heading,
    color: colors.text,
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.card,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileButtonText: {
    fontSize: 20,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    ...typography.subheading,
    color: colors.text,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.sm,
  },
  horizontalList: {
    paddingHorizontal: spacing.md,
  },
  binCard: {
    width: 80,
    height: 80,
    borderRadius: 12,
    marginHorizontal: spacing.xs,
    justifyContent: 'center',
    alignItems: 'center',
  },
  binIcon: {
    fontSize: 24,
    marginBottom: spacing.xs,
  },
  binName: {
    fontSize: 12,
    color: colors.text,
    textAlign: 'center',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },
  emptyStateText: {
    ...typography.body,
    color: colors.subtext,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  createButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: 8,
  },
  createButtonText: {
    ...typography.body,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  listContent: {
    paddingBottom: spacing.xl,
  },
});