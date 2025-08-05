import { Text ,
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';

import { useTheme } from '../../theme/ThemeProvider';
import { ThoughtmarkCard } from '../../components/ui/ThoughtmarkCard';
import { useThoughtmarks, Thoughtmark } from '../../hooks/useThoughtmarks';
import { useBins, Bin } from '../../hooks/useBins';
import { ModernHeader } from '../../components/ui/ModernHeader';
import { BottomNav } from '../../components/BottomNav';
import { RootStackParamList, NavigationProp } from '../../navigation/types';
import { useVoiceRecorder } from '../../components/ui/VoiceRecorderProvider';

export const AllThoughtmarksScreen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation<NavigationProp<keyof RootStackParamList>>();
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

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background ?? '#0D0D0F',
    },
    controls: {
      paddingHorizontal: theme.spacing.lg,
      paddingBottom: theme.spacing.sm,
    },
    filterRow: {
      flexDirection: 'row',
      gap: theme.spacing.md,
      marginBottom: theme.spacing.sm,
    },
    filterDropdown: {
      flex: 1,
      alignItems: 'flex-start',
    },
    filterLabel: {
      fontSize: 12,
      fontWeight: '600',
      color: theme.colors.text ?? '#F5F5F7',
      marginBottom: theme.spacing.xs,
      opacity: 0.8,
    },
    dropdownContainer: {
      flexDirection: 'row',
      gap: theme.spacing.xs,
    },
    dropdownButton: {
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs,
      borderRadius: 6,
      backgroundColor: theme.colors.surface ?? '#2C2C2E',
      borderWidth: 1,
      borderColor: theme.colors.border ?? '#2C2C2E',
    },
    dropdownButtonActive: {
      backgroundColor: theme.colors.accent ?? '#FFD500',
      borderColor: theme.colors.accent ?? '#FFD500',
    },
    dropdownButtonText: {
      fontSize: 11,
      color: theme.colors.text ?? '#F5F5F7',
      fontWeight: '500',
    },
    dropdownButtonTextActive: {
      color: theme.colors.background ?? '#0D0D0F',
    },
    sortButton: {
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs,
      borderRadius: 6,
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    sortButtonActive: {
      backgroundColor: theme.colors.accent,
      borderColor: theme.colors.accent,
    },
    sortButtonText: {
      fontSize: 11,
      color: theme.colors.text,
      fontWeight: '500',
    },
    sortButtonTextActive: {
      color: theme.colors.background,
    },
    binFilterContainer: {
      marginBottom: theme.spacing.md,
    },
    binFilterButton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      marginRight: theme.spacing.sm,
      borderRadius: theme.spacing.sm,
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    binFilterButtonActive: {
      backgroundColor: theme.colors.accent,
      borderColor: theme.colors.accent,
    },
    binFilterIcon: {
      marginRight: theme.spacing.xs,
    },
    binFilterText: {
      fontSize: theme.fontSize.body,
      color: theme.colors.text,
      fontWeight: '500',
    },
    binFilterTextActive: {
      color: theme.colors.background,
    },
    listContainer: {
      flex: 1,
      paddingHorizontal: theme.spacing.lg,
    },
    listContent: {
      paddingBottom: theme.spacing.lg,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    loadingText: {
      marginTop: theme.spacing.md,
      fontSize: theme.fontSize.body,
      color: theme.colors.textSecondary,
    },
    emptyState: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: theme.spacing.xl,
    },
    emptyStateTitle: {
      fontSize: theme.fontSize.lg,
      fontWeight: '600',
      color: theme.colors.text,
      marginTop: theme.spacing.md,
      marginBottom: theme.spacing.sm,
    },
    emptyStateSubtitle: {
      fontSize: theme.fontSize.body,
      color: theme.colors.textSecondary,
      textAlign: 'center',
      marginBottom: theme.spacing.lg,
    },
    createButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.accent,
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
      borderRadius: theme.spacing.md,
    },
    createButtonText: {
      fontSize: theme.fontSize.body,
      fontWeight: '600',
      color: theme.colors.background,
      marginLeft: theme.spacing.sm,
    },
  });

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
    new Set(thoughtmarks.flatMap((t: Thoughtmark) => t.tags || []))
  ).sort();

  // Filter thoughtmarks based on selected tags and bin
  const filteredThoughtmarks = thoughtmarks.filter((thoughtmark: Thoughtmark) => {
    const matchesTags = selectedTags.length === 0 || 
      selectedTags.some(tag => thoughtmark.tags?.includes(tag));
    const matchesBin = !selectedBin || thoughtmark.binId === selectedBin;
    
    // Additional filter for tasks if specified
    const matchesTaskFilter = !filterParams?.filter || 
      filterParams.filter !== 'tasks' || 
      thoughtmark.isArchived === false; // Use isArchived instead of isTask
    
    return matchesTags && matchesBin && matchesTaskFilter && !thoughtmark.isArchived; // Use isArchived instead of isDeleted
  });

  // Sort thoughtmarks
  const sortedThoughtmarks = [...filteredThoughtmarks].sort((a: Thoughtmark, b: Thoughtmark) => {
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

  const handleThoughtmarkPress = (thoughtmark: Thoughtmark) => {
    navigation.navigate('ThoughtmarkDetail', { thoughtmarkId: thoughtmark.id });
  };

  const handleCreateThoughtmark = (): void => {
    navigation.navigate('CreateThoughtmark');
  };

  const handlePinToggle = async (thoughtmarkId: string, pinned: boolean) => {
    try {
      // TODO: Implement API call to toggle pin status
      // await apiRequest("POST", `/api/thoughtmarks/${thoughtmarkId}/toggle-pin`, { pinned });
      console.log(`Thoughtmark ${thoughtmarkId} ${pinned ? 'pinned' : 'unpinned'}`);
      
      // For now, we'll just log the action
      // In a real implementation, you would update the local state and sync with backend
    } catch (error) {
      console.error('Failed to toggle pin status:', error);
    }
  };

  const handleNavigate = (path: string): void => {
    switch (path) {
      case 'home':
        navigation.navigate('Home');
        break;
      case 'search':
        navigation.navigate('Search');
        break;
      case 'profile':
        navigation.navigate('Profile');
        break;
      case 'settings':
        navigation.navigate('Settings');
        break;
      default:
        break;
    }
  };

  const _handleVoiceRecord = (): void => {
    showVoiceRecorder();
  };

  // Get header title based on filters
  const getHeaderTitle = () => {
    return 'THOUGHTMARKS';
  };

  const getHeaderSubtitle = () => {
    if (filterParams?.filter === 'tasks') {
      return 'Your active tasks and to-dos';
    } else if (filterParams?.filter === 'bin' && filterParams.binId) {
      const bin = bins.find(b => b.id === filterParams.binId);
      return `Thoughtmarks in ${bin?.name || 'Unknown Bin'}`;
    } else if (filterParams?.filter === 'tag' && filterParams.tag) {
      return `Thoughtmarks tagged with #${filterParams.tag}`;
    }
    return `${sortedThoughtmarks.length} thoughtmark${sortedThoughtmarks.length !== 1 ? 's' : ''}`;
  };

  const renderSortButton = (sortType: 'date' | 'title' | 'pinned', label: string) => (
    <TouchableOpacity
      style={[
        styles.sortButton,
        sortBy === sortType && styles.sortButtonActive
      ]}
      onPress={() => setSortBy(sortType)}
      accessibilityRole="button"
      accessibilityLabel={`Sort by ${label}`}
    >
      <Text style={[
        styles.sortButtonText,
        sortBy === sortType && styles.sortButtonTextActive
      ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  const _renderBinFilter = () => (
    <View style={styles.binFilterContainer}>
      <Text style={styles.filterLabel}>Filter by Bin</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <TouchableOpacity
          style={[
            styles.binFilterButton,
            !selectedBin && styles.binFilterButtonActive
          ]}
          onPress={() => setSelectedBin(null)}
        >
          <Text style={[
            styles.binFilterText,
            !selectedBin && styles.binFilterTextActive
          ]}>
            All
          </Text>
        </TouchableOpacity>
        {bins.map((bin) => (
          <TouchableOpacity
            key={bin.id}
            style={[
              styles.binFilterButton,
              selectedBin === bin.id && styles.binFilterButtonActive
            ]}
            onPress={() => setSelectedBin(bin.id)}
          >
            <Text style={[
              styles.binFilterText,
              selectedBin === bin.id && styles.binFilterTextActive
            ]}>
              {bin.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const renderThoughtmark = ({ item }: { item: Thoughtmark }) => (
    <ThoughtmarkCard
      thoughtmark={item}
      onPress={() => handleThoughtmarkPress(item)}
      onLongPress={() => handlePinToggle(item.id, !item.isPinned)}
    />
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <ModernHeader
        title={getHeaderTitle()}
        subtitle={getHeaderSubtitle()}
        leftAction={{
          icon: '←',
          onPress: () => navigation.goBack()
        }}
      />

      {/* Controls */}
      <View style={styles.controls}>
        {/* Compact Filter Row */}
        <View style={styles.filterRow}>
          {/* Sort Dropdown */}
          <View style={styles.filterDropdown}>
            <Text style={styles.filterLabel}>Sort</Text>
            <View><Text>{renderSortButton('date', 'Date')}
              {renderSortButton('title', 'Title')}
              {renderSortButton('pinned', 'Pinned')}</Text></View>
          </View>

          {/* Bin Filter Dropdown */}
          <View style={styles.filterDropdown}>
            <Text style={styles.filterLabel}>Bin</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.dropdownContainer}>
              <TouchableOpacity
                style={[styles.dropdownButton, !selectedBin && styles.dropdownButtonActive]}
                onPress={() => setSelectedBin(null)}
                accessibilityRole="button"
                accessibilityLabel="Button"
              >
                <Text style={[styles.dropdownButtonText, !selectedBin && styles.dropdownButtonTextActive]}>
                  All
                </Text>
              </TouchableOpacity>
              {bins.slice(0, 5).map((bin: Bin) => (
                <TouchableOpacity
                  key={bin.id}
                  style={[styles.dropdownButton, selectedBin === bin.id && styles.dropdownButtonActive]}
                  onPress={() => setSelectedBin(bin.id)}
                accessibilityRole="button"
                accessibilityLabel="Button"
                >
                  <Text style={[styles.dropdownButtonText, selectedBin === bin.id && styles.dropdownButtonTextActive]}>
                    {bin.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Tag Filter Dropdown */}
          <View style={styles.filterDropdown}>
            <Text style={styles.filterLabel}>Tag</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.dropdownContainer}>
              <TouchableOpacity
                style={[styles.dropdownButton, selectedTags.length === 0 && styles.dropdownButtonActive]}
                onPress={() => setSelectedTags([])}
                accessibilityRole="button"
                accessibilityLabel="Button"
              >
                <Text style={[styles.dropdownButtonText, selectedTags.length === 0 && styles.dropdownButtonTextActive]}>
                  All
                </Text>
              </TouchableOpacity>
              {allTags.slice(0, 5).map((tag: string) => (
                <TouchableOpacity
                  key={tag}
                  style={[styles.dropdownButton, selectedTags.includes(tag) && styles.dropdownButtonActive]}
                  onPress={() => {
                    if (selectedTags.includes(tag)) {
                      setSelectedTags(selectedTags.filter(t => t !== tag));
                    } else {
                      setSelectedTags([tag]);
                    }
                  }}
                  accessibilityRole="button"
                  accessibilityLabel="Button"
                >
                  <Text style={[styles.dropdownButtonText, selectedTags.includes(tag) && styles.dropdownButtonTextActive]}>
                    {tag}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </View>

      {/* Thoughtmarks List */}
      <View style={styles.listContainer}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.colors.accent} />
            <Text style={styles.loadingText}>Loading thoughtmarks...</Text>
          </View>
        ) : (
          <FlatList
            data={sortedThoughtmarks}
            renderItem={renderThoughtmark}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
                colors={[theme.colors.accent]}
                tintColor={theme.colors.accent}
              />
            }
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <Ionicons name="document-text" size={64} color={theme.colors.textSecondary} />
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
                   accessibilityRole="button"
                   accessibilityLabel="Create new thoughtmark"
                   accessible={true}
                 >
                    <Ionicons name="add" size={20} color={theme.colors.background} />
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
        currentRoute="/all-thoughtmarks"
        onNavigate={handleNavigate}
      />
    </View>
  );
}; 
