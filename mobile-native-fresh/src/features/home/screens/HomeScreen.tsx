import React, { useState, useEffect } from 'react';
import {
  View,
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
import { TagFilter } from '../../../components/ui/TagFilter';
import { Text } from '../../../components/ui/Text';
import { Button } from '../../../components/ui/Button';
import { useTheme } from '../../../theme/ThemeProvider';
import type { Thoughtmark, Bin, ThoughtmarkWithBin } from '../../../types';
import Ionicons from 'react-native-vector-icons/Ionicons';

export const HomeScreen = ({ navigation }: { navigation: any }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBin, setSelectedBin] = useState<Bin | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const { tokens } = useTheme();

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

  const handleTagPress = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const handleClearAllTags = () => {
    setSelectedTags([]);
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

  // Convert Thoughtmark to ThoughtmarkWithBin by adding binName
  const thoughtmarksWithBin: ThoughtmarkWithBin[] = thoughtmarks.map(tm => ({
    ...tm,
    binName: bins.find(bin => bin.id === tm.binId)?.name,
  }));

  // Get all unique tags from thoughtmarks
  const allTags = Array.from(
    new Set(
      thoughtmarks
        .flatMap(tm => tm.tags)
        .filter(tag => tag.trim().length > 0)
    )
  ).sort();

  // Filter thoughtmarks by selected bin and tags
  const filteredThoughtmarks = thoughtmarksWithBin.filter(tm => {
    const matchesBin = !selectedBin || tm.binId === selectedBin.id;
    const matchesTags = selectedTags.length === 0 || 
      selectedTags.some(tag => tm.tags.includes(tag));
    return matchesBin && matchesTags;
  });

  const recentThoughtmarks = filteredThoughtmarks
    .filter(tm => !tm.isArchived && !tm.isDeleted)
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5);

  const pinnedThoughtmarks = filteredThoughtmarks.filter(tm => tm.isPinned);

  const renderThoughtmarkCard = ({ item }: { item: ThoughtmarkWithBin }) => (
    <ThoughtmarkCard
      thoughtmark={item}
      onClick={() => handleThoughtmarkPress(item)}
      onEdit={() => handleThoughtmarkEdit(item)}
      onArchive={() => {
        // TODO: Implement archive functionality
        console.log('Archive thoughtmark:', item.id);
      }}
      onPinToggle={handlePinToggle}
    />
  );

  const handleProfilePress = () => {
    navigation.navigate('Profile');
  };

  const handleVoiceRecord = () => {
    navigation.navigate('VoiceRecord');
  };

  const handleViewBins = () => {
    navigation.navigate('Bins');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: designTokens.colors.background }}>
      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: designTokens.spacing.lg,
        paddingVertical: designTokens.spacing.md,
      }}>
        <Text variant="heading" size="2xl">Thoughtmarks</Text>
        <TouchableOpacity 
          style={{
            width: 40,
            height: 40,
            borderRadius: designTokens.radius.full,
            backgroundColor: designTokens.colors.backgroundSecondary,
            justifyContent: 'center',
            alignItems: 'center',
          }} 
          onPress={handleProfilePress}
        >
          <Ionicons name="person-circle-outline" size={24} color={designTokens.colors.text} />
        </TouchableOpacity>
      </View>

      <SearchBar
        onSearch={handleSearch}
        placeholder="Search thoughtmarks..."
      />

      <QuickActions
        onCreateThoughtmark={handleCreateNew}
        onVoiceRecord={handleVoiceRecord}
        onViewBins={handleViewBins}
      />

      {allTags.length > 0 && (
        <TagFilter
          tags={allTags}
          selectedTags={selectedTags}
          onTagPress={handleTagPress}
          onClearAll={handleClearAllTags}
        />
      )}

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
              <View style={{ marginBottom: designTokens.spacing.lg }}>
                <Text 
                  variant="subheading" 
                  size="lg"
                  style={{
                    paddingHorizontal: designTokens.spacing.lg,
                    marginBottom: designTokens.spacing.sm,
                  }}
                >
                  Pinned
                </Text>
                <FlatList
                  data={pinnedThoughtmarks}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  keyExtractor={(item) => item.id.toString()}
                  renderItem={renderThoughtmarkCard}
                  contentContainerStyle={{ paddingHorizontal: designTokens.spacing.md }}
                />
              </View>
            )}
            
            {recentThoughtmarks.length > 0 && (
              <View style={{ marginBottom: designTokens.spacing.lg }}>
                <Text 
                  variant="subheading" 
                  size="lg"
                  style={{
                    paddingHorizontal: designTokens.spacing.lg,
                    marginBottom: designTokens.spacing.sm,
                  }}
                >
                  Recent
                </Text>
                <FlatList
                  data={recentThoughtmarks}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  keyExtractor={(item) => item.id.toString()}
                  renderItem={renderThoughtmarkCard}
                  contentContainerStyle={{ paddingHorizontal: designTokens.spacing.md }}
                />
              </View>
            )}

            {bins.length > 0 && (
              <View style={{ marginBottom: designTokens.spacing.lg }}>
                <Text 
                  variant="subheading" 
                  size="lg"
                  style={{
                    paddingHorizontal: designTokens.spacing.lg,
                    marginBottom: designTokens.spacing.sm,
                  }}
                >
                  Bins
                </Text>
                <FlatList
                  data={bins.filter(bin => !bin.isArchived && !bin.isDeleted)}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  keyExtractor={(item) => item.id.toString()}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={{
                        width: 80,
                        height: 80,
                        borderRadius: designTokens.radius.md,
                        marginHorizontal: designTokens.spacing.xs,
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: item.color || designTokens.colors.surface,
                      }}
                      onPress={() => handleBinPress(item)}
                    >
                      <Ionicons 
                        name={item.icon || "folder-outline"} 
                        size={24} 
                        color={designTokens.colors.text} 
                        style={{ marginBottom: designTokens.spacing.xs }}
                      />
                      <Text variant="caption" size="xs" style={{ textAlign: 'center' }}>
                        {item.name}
                      </Text>
                    </TouchableOpacity>
                  )}
                />
              </View>
            )}

            <View style={{ marginBottom: designTokens.spacing.lg }}>
              <Text 
                variant="subheading" 
                size="lg"
                style={{
                  paddingHorizontal: designTokens.spacing.lg,
                  marginBottom: designTokens.spacing.sm,
                }}
              >
                All Thoughtmarks
              </Text>
            </View>
          </>
        }
        ListEmptyComponent={
          <View style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: designTokens.spacing.lg,
          }}>
            <Text variant="body" style={{ textAlign: 'center', marginBottom: designTokens.spacing.lg }}>
              {thoughtmarksLoading ? 'Loading...' : 'No thoughtmarks yet'}
            </Text>
            {!thoughtmarksLoading && (
              <Button variant="primary" onPress={handleCreateNew}>
                Create your first thoughtmark
              </Button>
            )}
          </View>
        }
        contentContainerStyle={{ paddingBottom: designTokens.spacing.xl }}
      />
    </SafeAreaView>
  );
};