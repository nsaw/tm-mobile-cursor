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

import { useTheme } from '../../../theme/ThemeProvider';
import { ThoughtmarkCard } from '../../home/components/ThoughtmarkCard';
import { useThoughtmarks } from '../../home/hooks/useThoughtmarks';
import { useBins } from '../../home/hooks/useBins';
import { ModernHeader } from '../../../components/ui/ModernHeader';
import { BottomNav } from '../../../components/ui/BottomNav';
import { RootStackParamList } from '../../../navigation/types';
import { useVoiceRecorder } from '../../../components/ui/VoiceRecorderProvider';

export const AllThoughtmarksScreen: React.FC = () => {
  const { tokens: designTokens } = useTheme();
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

  const styles = StyleSheet.create({
    binFilterButton: {
      alignItems: 'center',
      backgroundColor: designTokens.colors.surface,
      borderColor: designTokens.colors.border,
      borderRadius: designTokens.spacing.sm,
      borderWidth: 1,
      flexDirection: 'row',
      marginRight: designTokens.spacing.sm,
      paddingHorizontal: designTokens.spacing.md,
      paddingVertical: designTokens.spacing.sm,
    },
    binFilterButtonActive: {
      backgroundColor: designTokens.colors.accent,
      borderColor: designTokens.colors.accent,
    },
    binFilterContainer: {
      marginBottom: designTokens.spacing.md,
    },
    binFilterIcon: {
      marginRight: designTokens.spacing.xs,
    },
    binFilterText: {
      color: designTokens.colors.text,
      fontSize: designTokens.typography.fontSize.body,
      fontWeight: '500',
    },
    binFilterTextActive: {
      color: designTokens.colors.background,
    },
    container: {
      backgroundColor: designTokens.colors.background ?? '#0D0D0F',
      flex: 1,
    },
    controls: {
      paddingBottom: designTokens.spacing.sm,
      paddingHorizontal: designTokens.spacing.lg,
    },
    createButton: {
      alignItems: 'center',
      backgroundColor: designTokens.colors.accent,
      borderRadius: designTokens.spacing.md,
      flexDirection: 'row',
      paddingHorizontal: designTokens.spacing.lg,
      paddingVertical: designTokens.spacing.md,
    },
    createButtonText: {
      color: designTokens.colors.background,
      fontSize: designTokens.typography.fontSize.body,
      fontWeight: '600',
      marginLeft: designTokens.spacing.sm,
    },
    dropdownButton: {
      backgroundColor: designTokens.colors.surface ?? '#2C2C2E',
      borderColor: designTokens.colors.border ?? '#2C2C2E',
      borderRadius: 6,
      borderWidth: 1,
      paddingHorizontal: designTokens.spacing.sm,
      paddingVertical: designTokens.spacing.xs,
    },
    dropdownButtonActive: {
      backgroundColor: designTokens.colors.accent ?? '#FFD500',
      borderColor: designTokens.colors.accent ?? '#FFD500',
    },
    dropdownButtonText: {
      color: designTokens.colors.text ?? '#F5F5F7',
      fontSize: 11,
      fontWeight: '500',
    },
    dropdownButtonTextActive: {
      color: designTokens.colors.background ?? '#0D0D0F',
    },
    dropdownContainer: {
      flexDirection: 'row',
      gap: designTokens.spacing.xs,
    },
    emptyState: {
      alignItems: 'center',
      flex: 1,
      justifyContent: 'center',
      paddingVertical: designTokens.spacing.xl,
    },
    emptyStateSubtitle: {
      color: designTokens.colors.textSecondary,
      fontSize: designTokens.typography.fontSize.body,
      marginBottom: designTokens.spacing.lg,
      textAlign: 'center',
    },
    emptyStateTitle: {
      color: designTokens.colors.text,
      fontSize: designTokens.typography.fontSize.lg,
      fontWeight: '600',
      marginBottom: designTokens.spacing.sm,
      marginTop: designTokens.spacing.md,
    },
    filterDropdown: {
      alignItems: 'flex-start',
      flex: 1,
    },
    filterLabel: {
      color: designTokens.colors.text ?? '#F5F5F7',
      fontSize: 12,
      fontWeight: '600',
      marginBottom: designTokens.spacing.xs,
      opacity: 0.8,
    },
    filterRow: {
      flexDirection: 'row',
      gap: designTokens.spacing.md,
      marginBottom: designTokens.spacing.sm,
    },
    listContainer: {
      flex: 1,
      paddingHorizontal: designTokens.spacing.lg,
    },
    listContent: {
      paddingBottom: designTokens.spacing.lg,
    },
    loadingContainer: {
      alignItems: 'center',
      flex: 1,
      justifyContent: 'center',
    },
    loadingText: {
      color: designTokens.colors.textSecondary,
      fontSize: designTokens.typography.fontSize.body,
      marginTop: designTokens.spacing.md,
    },
    sortButton: {
      backgroundColor: designTokens.colors.surface,
      borderColor: designTokens.colors.border,
      borderRadius: 6,
      borderWidth: 1,
      paddingHorizontal: designTokens.spacing.sm,
      paddingVertical: designTokens.spacing.xs,
    },
    sortButtonActive: {
      backgroundColor: designTokens.colors.accent,
      borderColor: designTokens.colors.accent,
    },
    sortButtonText: {
      color: designTokens.colors.text,
      fontSize: 11,
      fontWeight: '500',
    },
    sortButtonTextActive: {
      color: designTokens.colors.background,
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
    
    return matchesTags && matchesBin && matchesTaskFilter && !thoughtmark.isDeleted;
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
    navigation.navigate('CreateThoughtmark' as any);
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

  const handleNavigate = (path: string) => {
    switch (path) {
      case '/':
      case 'Dashboard':
        navigation.navigate('Dashboard' as any);
        break;
      case '/search':
      case 'Search':
        navigation.navigate('Search' as any);
        break;
      case '/all-thoughtmarks':
      case 'AllThoughtmarks':
        navigation.navigate('AllThoughtmarks' as any);
        break;
      case '/ai-tools':
      case 'AITools':
        navigation.navigate('AITools' as any);
        break;
      default:
        console.log('Unknown navigation path:', path);
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
      accessibilityRole="button"
      accessible={true}
      accessibilityLabel={sortType}
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
                accessibilityRole="button"
                accessible={true}
                accessibilityLabel="Button"
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
                accessibilityRole="button"
                accessible={true}
                accessibilityLabel="Button"
          >
            <Ionicons 
              name={bin.icon as any} 
              size={16} 
              color={selectedBin === bin.id ? designTokens.colors.background : designTokens.colors.text}
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
                accessible={true}
                accessibilityLabel="Button"
              >
                <Text style={[styles.dropdownButtonText, !selectedBin && styles.dropdownButtonTextActive]}>
                  All
                </Text>
              </TouchableOpacity>
              {bins.slice(0, 5).map((bin: any) => (
                <TouchableOpacity
                  key={bin.id}
                  style={[styles.dropdownButton, selectedBin === bin.id && styles.dropdownButtonActive]}
                  onPress={() => setSelectedBin(bin.id)}
                accessibilityRole="button"
                accessible={true}
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
                accessible={true}
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
                  accessible={true}
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
            <ActivityIndicator size="large" color={designTokens.colors.accent} />
            <Text style={styles.loadingText}>Loading thoughtmarks...</Text>
          </View>
        ) : (
          <FlatList
            data={sortedThoughtmarks}
            renderItem={({ item }) => (
              <ThoughtmarkCard 
                thoughtmark={item} 
                onClick={() => handleThoughtmarkPress(item)}
                onPinToggle={handlePinToggle}
              />
            )}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
                colors={[designTokens.colors.accent]}
                tintColor={designTokens.colors.accent}
              />
            }
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <Ionicons name="document-text" size={64} color={designTokens.colors.textSecondary} />
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
                   accessibilityRole="button" accessible={true} accessibilityLabel="Button">
                    <Ionicons name="add" size={20} color={designTokens.colors.background} />
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