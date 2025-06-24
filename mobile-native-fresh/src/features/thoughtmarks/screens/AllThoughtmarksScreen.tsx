import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../../../theme/theme';
import { ThoughtmarkCard } from '../../home/components/ThoughtmarkCard';
import { TagFilter } from '../../home/components/TagFilter';
import { useThoughtmarks } from '../../home/hooks/useThoughtmarks';
import { useBins } from '../../home/hooks/useBins';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { ModernHeader } from '../../../components/ui/ModernHeader';
import { BottomNav } from '../../../components/ui/BottomNav';
import { RootStackParamList } from '../../../navigation/types';
import { useVoiceRecorder } from '../../../components/ui/VoiceRecorderProvider';

export const AllThoughtmarksScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<RouteProp<RootStackParamList, 'AllThoughtmarks'>>();
  const { thoughtmarks, loading, fetchThoughtmarks } = useThoughtmarks();
  const { bins } = useBins();
  
  // Get filter parameters from navigation
  const filterParams = route.params;
  
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedBin, setSelectedBin] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'date' | 'title' | 'pinned'>('date');
  const [refreshing, setRefreshing] = useState(false);

  const { showVoiceRecorder } = useVoiceRecorder();

  // Apply initial filters from navigation params
  useEffect(() => {
    if (filterParams) {
      if (filterParams.filter === 'tasks') {
        // Filter for tasks only
        setSelectedTags([]);
        setSelectedBin(null);
      } else if (filterParams.filter === 'bin' && filterParams.binId) {
        // Filter by specific bin
        setSelectedBin(filterParams.binId.toString());
        setSelectedTags([]);
      } else if (filterParams.filter === 'tag' && filterParams.tag) {
        // Filter by specific tag
        setSelectedTags([filterParams.tag]);
        setSelectedBin(null);
      }
    }
  }, [filterParams]);

  // Get all unique tags from thoughtmarks
  const allTags = Array.from(
    new Set(thoughtmarks.flatMap((t: any) => t.tags || []))
  ).sort();

  // Filter thoughtmarks based on selected tags and bin
  const filteredThoughtmarks = thoughtmarks.filter((thoughtmark: any) => {
    const matchesTags = selectedTags.length === 0 || 
      selectedTags.some(tag => thoughtmark.tags?.includes(tag));
    const matchesBin = !selectedBin || thoughtmark.binId === parseInt(selectedBin);
    
    // Additional filter for tasks if specified
    const matchesTaskFilter = !filterParams?.filter || 
      filterParams.filter !== 'tasks' || 
      thoughtmark.isTask;
    
    return matchesTags && matchesBin && matchesTaskFilter;
  });

  // Sort thoughtmarks
  const sortedThoughtmarks = [...filteredThoughtmarks].sort((a: any, b: any) => {
    if (sortBy === 'pinned') {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
    }
    if (sortBy === 'title') {
      return a.title.localeCompare(b.title);
    }
    // Default: sort by date (newest first)
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchThoughtmarks();
    setRefreshing(false);
  };

  const handleThoughtmarkPress = (thoughtmark: any) => {
    navigation.navigate('ThoughtmarkDetail', { thoughtmarkId: thoughtmark.id });
  };

  const handleCreateThoughtmark = () => {
    navigation.navigate('CreateThoughtmark');
  };

  const handleNavigate = (path: string) => {
    switch (path) {
      case '/':
        navigation.navigate('Dashboard');
        break;
      case '/search':
        navigation.navigate('Search');
        break;
      case '/all-thoughtmarks':
        navigation.navigate('AllThoughtmarks');
        break;
      case '/ai-tools':
        navigation.navigate('AITools');
        break;
      default:
        break;
    }
  };

  const handleVoiceRecord = () => {
    showVoiceRecorder();
  };

  // Get header title based on filters
  const getHeaderTitle = () => {
    return 'THOUGHTMARKS';
  };

  const getHeaderSubtitle = () => {
    if (filterParams?.filter === 'tasks') {
      return 'Your active tasks and to-dos';
    } else if (filterParams?.filter === 'bin' && filterParams.binName) {
      return `Thoughtmarks in ${filterParams.binName}`;
    } else if (filterParams?.filter === 'tag' && filterParams.tag) {
      return `Thoughtmarks tagged with #${filterParams.tag}`;
    }
    return `${sortedThoughtmarks.length} thoughtmark${sortedThoughtmarks.length !== 1 ? 's' : ''}`;
  };

  const renderSortButton = (sortType: 'date' | 'title' | 'pinned', label: string) => (
    <TouchableOpacity
      style={[styles.sortButton, sortBy === sortType && styles.sortButtonActive]}
      onPress={() => setSortBy(sortType)}
    >
      <Text style={[styles.sortButtonText, sortBy === sortType && styles.sortButtonTextActive]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  const renderBinFilter = () => (
    <View style={styles.binFilterContainer}>
      <Text style={styles.filterLabel}>Filter by Bin:</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <TouchableOpacity
          style={[styles.binFilterButton, !selectedBin && styles.binFilterButtonActive]}
          onPress={() => setSelectedBin(null)}
        >
          <Text style={[styles.binFilterText, !selectedBin && styles.binFilterTextActive]}>
            All
          </Text>
        </TouchableOpacity>
        {bins.map((bin: any) => (
          <TouchableOpacity
            key={bin.id}
            style={[styles.binFilterButton, selectedBin === bin.id && styles.binFilterButtonActive]}
            onPress={() => setSelectedBin(bin.id)}
          >
            <Ionicons 
              name={bin.icon as any} 
              size={16} 
              color={selectedBin === bin.id ? colors.background : colors.text}
              style={styles.binFilterIcon}
            />
            <Text style={[styles.binFilterText, selectedBin === bin.id && styles.binFilterTextActive]}>
              {bin.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <ModernHeader
        title={getHeaderTitle()}
        subtitle={getHeaderSubtitle()}
        onBack={() => navigation.goBack()}
      />

      {/* Controls */}
      <View style={styles.controls}>
        {/* Sort Options */}
        <View style={styles.sortContainer}>
          <Text style={styles.filterLabel}>Sort by:</Text>
          <View style={styles.sortButtons}>
            {renderSortButton('date', 'Date')}
            {renderSortButton('title', 'Title')}
            {renderSortButton('pinned', 'Pinned')}
          </View>
        </View>

        {/* Bin Filter */}
        {renderBinFilter()}

        {/* Tag Filter */}
        <TagFilter
          tags={allTags}
          selectedTag={selectedTags.length === 1 ? selectedTags[0] : 'all'}
          onTagSelect={(tag) => {
            if (tag === 'all') {
              setSelectedTags([]);
            } else {
              setSelectedTags([tag]);
            }
          }}
          totalCount={thoughtmarks.length}
        />
      </View>

      {/* Thoughtmarks List */}
      <View style={styles.listContainer}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>Loading thoughtmarks...</Text>
          </View>
        ) : (
          <FlatList
            data={sortedThoughtmarks}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => handleThoughtmarkPress(item)}>
                <ThoughtmarkCard thoughtmark={item} />
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
                colors={[colors.primary]}
                tintColor={colors.primary}
              />
            }
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <Ionicons name="document-text" size={64} color={colors.subtext} />
                <Text style={styles.emptyStateTitle}>No thoughtmarks found</Text>
                <Text style={styles.emptyStateSubtitle}>
                  {selectedTags.length > 0 || selectedBin 
                    ? 'Try adjusting your filters'
                    : 'Create your first thoughtmark to get started'
                  }
                </Text>
                {!selectedTags.length && !selectedBin && (
                  <TouchableOpacity
                    style={styles.createButton}
                    onPress={handleCreateThoughtmark}
                  >
                    <Ionicons name="add" size={20} color={colors.background} />
                    <Text style={styles.createButtonText}>Create Thoughtmark</Text>
                  </TouchableOpacity>
                )}
              </View>
            }
          />
        )}
      </View>

      {/* Bottom Navigation */}
      <BottomNav
        onNavigate={handleNavigate}
        onVoiceRecord={handleVoiceRecord}
        showCreateButton={true}
        currentRoute="/all-thoughtmarks"
        onCreateNew={handleCreateThoughtmark}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  controls: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.sm,
  },
  sortContainer: {
    marginBottom: spacing.md,
  },
  filterLabel: {
    fontSize: typography.body.fontSize,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  sortButtons: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  sortButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: spacing.sm,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sortButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  sortButtonText: {
    fontSize: typography.body.fontSize,
    color: colors.text,
    fontWeight: '500',
  },
  sortButtonTextActive: {
    color: colors.background,
  },
  binFilterContainer: {
    marginBottom: spacing.md,
  },
  binFilterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginRight: spacing.sm,
    borderRadius: spacing.sm,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  binFilterButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  binFilterIcon: {
    marginRight: spacing.xs,
  },
  binFilterText: {
    fontSize: typography.body.fontSize,
    color: colors.text,
    fontWeight: '500',
  },
  binFilterTextActive: {
    color: colors.background,
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  listContent: {
    paddingBottom: spacing.lg,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: spacing.md,
    fontSize: typography.body.fontSize,
    color: colors.subtext,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  emptyStateTitle: {
    fontSize: typography.subheading.fontSize,
    fontWeight: '600',
    color: colors.text,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  emptyStateSubtitle: {
    fontSize: typography.body.fontSize,
    color: colors.subtext,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: spacing.md,
  },
  createButtonText: {
    fontSize: typography.body.fontSize,
    fontWeight: '600',
    color: colors.background,
    marginLeft: spacing.sm,
  },
}); 