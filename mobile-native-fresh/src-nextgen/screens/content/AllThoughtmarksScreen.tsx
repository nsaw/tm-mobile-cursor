import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { View, Text, FlatList, RefreshControl, ActivityIndicator, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { useThoughtmarks } from '../../hooks/useThoughtmarks';
import { useSearch } from '../../hooks/useSearch';
import { useTheme } from '../../hooks/useTheme';
import { useInfiniteScroll } from '../../hooks/useInfiniteScroll';
import { ThoughtmarkCard } from '../../components/ThoughtmarkCard';
import { Button } from '../../components/Button';
import { AutoRoleView } from '../../components/AutoRoleView';
import { ErrorBoundary } from '../../components/ErrorBoundary';
import { withPerformanceMonitoring } from '../../utils/PerformanceMonitor';
import { logSecurityEvent } from '../../utils/security';
import { analytics } from '../../utils/analytics';
import { ThoughtmarkWithBin } from '../../types/Thoughtmark';

// Performance constants
const PAGE_SIZE = 20;
const _DEBOUNCE_DELAY = 300;
const _CACHE_SIZE = 100;

// Sort options
type SortOption = 'newest' | 'oldest' | 'title' | 'bin' | 'favorite';

interface AllThoughtmarksScreenProps {
  route?: any;
}

const AllThoughtmarksScreen: React.FC<AllThoughtmarksScreenProps> = ({ route: _route }) => {
  const navigation = useNavigation();
  const { colors } = useTheme();
  const { thoughtmarks, loading, error, fetchThoughtmarks, refreshThoughtmarks } = useThoughtmarks();
  const { isLoading: searchLoading } = useSearch();
  const { isRefreshing, onRefresh } = useInfiniteScroll();
  
  // Local search state
  const [searchQuery, setSearchQuery] = useState('');
  
  // Local state
  const [sortOption, setSortOption] = useState<SortOption>('newest');
  const [filterBin, setFilterBin] = useState<string | null>(null);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [lastRefreshTime, setLastRefreshTime] = useState(Date.now());

  // Security: Log screen events
  const logScreenEvent = useCallback((event: string, details?: any) => {
    try {
      logSecurityEvent('all_thoughtmarks_screen', {
        event,
        sortOption,
        filterBin,
        showFavoritesOnly,
        currentPage,
        timestamp: new Date().toISOString(),
        ...details,
      });
    } catch (error) {
      console.warn('Failed to log screen event:', error);
    }
  }, [sortOption, filterBin, showFavoritesOnly, currentPage]);

  // Analytics tracking
  const trackScreenEvent = useCallback((event: string, properties?: any) => {
    try {
      analytics.track(event, {
        screen: 'AllThoughtmarksScreen',
        sortOption,
        filterBin,
        showFavoritesOnly,
        currentPage,
        ...properties,
      });
    } catch (error) {
      console.warn('Failed to track screen event:', error);
    }
  }, [sortOption, filterBin, showFavoritesOnly, currentPage]);

  // Filter and sort thoughtmarks
  const filteredAndSortedThoughtmarks = useMemo(() => {
    let filtered = thoughtmarks;
    
    // Apply bin filter
    if (filterBin) {
      filtered = filtered.filter(thoughtmark => thoughtmark.binId === filterBin);
    }
    
    // Apply favorites filter
    if (showFavoritesOnly) {
      filtered = filtered.filter(thoughtmark => thoughtmark.isFavorite);
    }
    
    // Apply sorting
    const sorted = [...filtered].sort((a, b) => {
      switch (sortOption) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'title':
          return a.title.localeCompare(b.title);
        case 'bin':
          return (a.binName || '').localeCompare(b.binName || '');
        case 'favorite':
          return (b.isFavorite ? 1 : 0) - (a.isFavorite ? 1 : 0);
        default:
          return 0;
      }
    });
    
    return sorted;
  }, [thoughtmarks, filterBin, showFavoritesOnly, sortOption]);

  // Load more thoughtmarks
  const loadMoreThoughtmarks = useCallback(async () => {
    if (isLoadingMore || !hasMore || searchQuery) return;
    
    try {
      setIsLoadingMore(true);
      logScreenEvent('load_more_started');
      trackScreenEvent('thoughtmarks_load_more_started');
      
      const nextPage = currentPage + 1;
      const newThoughtmarks = await fetchThoughtmarks({
        page: nextPage,
        limit: PAGE_SIZE,
        sortBy: sortOption,
        binId: filterBin,
        favoritesOnly: showFavoritesOnly,
      });
      
      if (newThoughtmarks.length < PAGE_SIZE) {
        setHasMore(false);
      }
      
      setCurrentPage(nextPage);
      
      logScreenEvent('load_more_success', { page: nextPage, count: newThoughtmarks.length });
      trackScreenEvent('thoughtmarks_load_more_success', { page: nextPage, count: newThoughtmarks.length });
    } catch (error) {
      console.error('Failed to load more thoughtmarks:', error);
      logScreenEvent('load_more_failed', { error: error.message });
      trackScreenEvent('thoughtmarks_load_more_failed', { error: error.message });
    } finally {
      setIsLoadingMore(false);
    }
  }, [isLoadingMore, hasMore, searchQuery, currentPage, fetchThoughtmarks, sortOption, filterBin, showFavoritesOnly, logScreenEvent, trackScreenEvent]);

  // Handle refresh
  const handleRefresh = useCallback(async () => {
    try {
      setCurrentPage(1);
      setHasMore(true);
      setLastRefreshTime(Date.now());
      
      logScreenEvent('refresh_started');
      trackScreenEvent('thoughtmarks_refresh_started');
      
      await refreshThoughtmarks({
        sortBy: sortOption,
        binId: filterBin,
        favoritesOnly: showFavoritesOnly,
      });
      
      logScreenEvent('refresh_success');
      trackScreenEvent('thoughtmarks_refresh_success');
    } catch (error) {
      console.error('Failed to refresh thoughtmarks:', error);
      logScreenEvent('refresh_failed', { error: error.message });
      trackScreenEvent('thoughtmarks_refresh_failed', { error: error.message });
    }
  }, [refreshThoughtmarks, sortOption, filterBin, showFavoritesOnly, logScreenEvent, trackScreenEvent]);

  // Handle search
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
    setHasMore(true);
    
    logScreenEvent('search_performed', { query });
    trackScreenEvent('thoughtmarks_search_performed', { query });
  }, [setSearchQuery, logScreenEvent, trackScreenEvent]);

  // Handle sort change
  const handleSortChange = useCallback((option: SortOption) => {
    setSortOption(option);
    setCurrentPage(1);
    setHasMore(true);
    
    logScreenEvent('sort_changed', { option });
    trackScreenEvent('thoughtmarks_sort_changed', { option });
  }, [logScreenEvent, trackScreenEvent]);

  // Handle filter change
  const _handleFilterChange = useCallback((binId: string | null) => {
    setFilterBin(binId);
    setCurrentPage(1);
    setHasMore(true);
    
    logScreenEvent('filter_changed', { binId });
    trackScreenEvent('thoughtmarks_filter_changed', { binId });
  }, [logScreenEvent, trackScreenEvent]);

  // Handle favorites toggle
  const handleFavoritesToggle = useCallback(() => {
    setShowFavoritesOnly(!showFavoritesOnly);
    setCurrentPage(1);
    setHasMore(true);
    
    logScreenEvent('favorites_toggled', { showFavoritesOnly: !showFavoritesOnly });
    trackScreenEvent('thoughtmarks_favorites_toggled', { showFavoritesOnly: !showFavoritesOnly });
  }, [showFavoritesOnly, logScreenEvent, trackScreenEvent]);

  // Handle thoughtmark press
  const handleThoughtmarkPress = useCallback((thoughtmark: ThoughtmarkWithBin) => {
    // TODO: Implement navigation to thoughtmark detail
    console.log('Navigate to thoughtmark detail:', thoughtmark.id);
    
    logScreenEvent('thoughtmark_pressed', { thoughtmarkId: thoughtmark.id });
    trackScreenEvent('thoughtmark_pressed', { thoughtmarkId: thoughtmark.id });
  }, [logScreenEvent, trackScreenEvent]);

  // Handle create new thoughtmark
  const handleCreateThoughtmark = useCallback(() => {
    navigation.navigate('CreateThoughtmark' as never);
    
    logScreenEvent('create_thoughtmark_pressed');
    trackScreenEvent('create_thoughtmark_pressed');
  }, [navigation, logScreenEvent, trackScreenEvent]);

  // Render thoughtmark item
  const renderThoughtmarkItem = useCallback(({ item }: { item: ThoughtmarkWithBin }) => (
    <ThoughtmarkCard
      thoughtmark={item}
      onPress={() => handleThoughtmarkPress(item)}
      style={{ backgroundColor: colors.surface }}
    />
  ), [handleThoughtmarkPress, colors.surface]);

  // Render empty state
  const renderEmptyState = useCallback(() => {
    if (loading || searchLoading) return null;
    
    const message = searchQuery
      ? 'No thoughtmarks found matching your search'
      : 'No thoughtmarks yet. Create your first one!';
    
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold', color: colors.text, marginBottom: 8 }}>
          No Thoughtmarks
        </Text>
        <Text style={{ fontSize: 14, color: colors.textSecondary, textAlign: 'center', marginBottom: 20 }}>
          {message}
        </Text>
        <Button
          title="Create Thoughtmark"
          onPress={handleCreateThoughtmark}
          accessibilityLabel="Create new thoughtmark"
          accessibilityHint="Opens the create thoughtmark screen"
        />
      </View>
    );
  }, [loading, searchLoading, searchQuery, colors, handleCreateThoughtmark]);

  // Render loading footer
  const renderLoadingFooter = useCallback(() => {
    if (!isLoadingMore) return null;
    
    return (
      <View style={{ padding: 20, alignItems: 'center' }}>
        <ActivityIndicator size="small" color={colors.primary} />
        <Text style={{ marginTop: 8, color: colors.textSecondary }}>Loading more...</Text>
      </View>
    );
  }, [isLoadingMore, colors]);

  // Render header with search and filters
  const renderHeader = useCallback(() => (
    <View style={{ padding: 16, backgroundColor: colors.background }}>
      <TextInput
        style={{
          height: 40,
          borderWidth: 1,
          borderColor: colors.border,
          borderRadius: 8,
          paddingHorizontal: 12,
          backgroundColor: colors.surface,
          color: colors.text,
          marginBottom: 12,
        }}
        placeholder="Search thoughtmarks..."
        placeholderTextColor={colors.textSecondary}
        value={searchQuery}
        onChangeText={handleSearch}
        autoCapitalize="none"
        autoCorrect={false}
        accessibilityLabel="Search thoughtmarks"
        accessibilityHint="Enter text to search for thoughtmarks"
      />
      
      <View style={{ flexDirection: 'row', gap: 8 }}>
        <Button
          title={sortOption === 'newest' ? 'Newest' : 'Sort'}
          onPress={() => handleSortChange(sortOption === 'newest' ? 'oldest' : 'newest')}
          accessibilityLabel="Change sort order"
          accessibilityHint="Toggles between newest and oldest sort order"
        />
        
        <Button
          title={showFavoritesOnly ? 'All' : 'Favorites'}
          onPress={handleFavoritesToggle}
          accessibilityLabel="Toggle favorites filter"
          accessibilityHint="Shows only favorite thoughtmarks when active"
        />
      </View>
    </View>
  ), [searchQuery, handleSearch, sortOption, handleSortChange, showFavoritesOnly, handleFavoritesToggle, colors]);

  // Track screen events
  useEffect(() => {
    logScreenEvent('screen_mounted');
    trackScreenEvent('all_thoughtmarks_screen_mounted');
  }, [logScreenEvent, trackScreenEvent]);

  // Track refresh time
  useEffect(() => {
    const timeSinceRefresh = Date.now() - lastRefreshTime;
    if (timeSinceRefresh > 5 * 60 * 1000) { // 5 minutes
      handleRefresh();
    }
  }, [lastRefreshTime, handleRefresh]);

  if (error) {
    return (
      <ErrorBoundary>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', color: colors.text, marginBottom: 8 }}>
            Failed to load thoughtmarks
          </Text>
          <Text style={{ fontSize: 14, color: colors.textSecondary, textAlign: 'center', marginBottom: 20 }}>
            {error}
          </Text>
          <Button
            title="Try Again"
            onPress={handleRefresh}
            accessibilityLabel="Retry loading thoughtmarks"
            accessibilityHint="Attempts to load thoughtmarks again"
          />
        </View>
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <AutoRoleView style={{ flex: 1, backgroundColor: colors.background }}>
        {renderHeader()}
        
        <FlatList
          data={filteredAndSortedThoughtmarks}
          renderItem={renderThoughtmarkItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ flexGrow: 1 }}
          refreshControl={(
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={onRefresh}
              colors={[colors.primary]}
              tintColor={colors.primary}
            />
          )}
          onEndReached={loadMoreThoughtmarks}
          onEndReachedThreshold={0.1}
          ListEmptyComponent={renderEmptyState}
          ListFooterComponent={renderLoadingFooter}
          removeClippedSubviews={true}
          maxToRenderPerBatch={10}
          windowSize={10}
          initialNumToRender={PAGE_SIZE}
          getItemLayout={(data, index) => ({
            length: 120, // Approximate item height
            offset: 120 * index,
            index,
          })}
          accessibilityLabel="List of thoughtmarks"
          accessibilityHint="Scrollable list of all thoughtmarks"
        />
        
        <Button
          title="+"
          onPress={handleCreateThoughtmark}
          style={{
            position: 'absolute',
            bottom: 20,
            right: 20,
            width: 56,
            height: 56,
            borderRadius: 28,
            backgroundColor: colors.primary,
          }}
          accessibilityLabel="Create new thoughtmark"
          accessibilityHint="Opens the create thoughtmark screen"
        />
      </AutoRoleView>
    </ErrorBoundary>
  );
};

export default withPerformanceMonitoring(AllThoughtmarksScreen, 'AllThoughtmarksScreen', 'nextgen'); 