import React, { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { 
  View, 
  TextInput, 
  FlatList, 
  Text, 
  TouchableOpacity, 
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Animated
} from 'react-native';

import { AutoRoleView } from '../../components/AutoRoleView';
import { useTheme } from '../../hooks/useTheme';
import { useSearch } from '../../hooks/useSearch';
import { SecurityManager } from '../../utils/SecurityManager';
import { ValidationSystem } from '../../utils/ValidationSystem';
import { PerformanceMonitor , withPerformanceMonitoring } from '../../utils/PerformanceMonitor';
import { ErrorBoundary } from '../../components/ErrorBoundary';

interface SearchResult {
  id: string;
  label: string;
  type: 'thoughtmark' | 'bin' | 'user';
  description?: string;
  relevance: number;
  timestamp: string;
}

interface SearchSuggestion {
  id: string;
  label: string;
  type: 'recent' | 'popular' | 'suggestion';
}

interface SearchItemProps {
  item: SearchResult | SearchSuggestion;
  onPress: (item: SearchResult | SearchSuggestion) => void;
  theme: any;
  isSuggestion?: boolean;
}

const SearchItem: React.FC<SearchItemProps> = React.memo(({ 
  item, 
  onPress, 
  theme, 
  isSuggestion = false 
}) => {
  const handlePress = useCallback(() => {
    onPress(item);
  }, [item, onPress]);

  const getItemIcon = useCallback(() => {
    if (isSuggestion) {
      return '💡';
    }
    
    switch (item.type) {
      case 'thoughtmark':
        return '📝';
      case 'bin':
        return '📦';
      case 'user':
        return '👤';
      default:
        return '🔍';
    }
  }, [item.type, isSuggestion]);

  const formatTimestamp = useCallback((timestamp: string) => {
    try {
      const date = new Date(timestamp);
      const now = new Date();
      const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
      
      if (diffInHours < 1) {
        return 'Just now';
      } else if (diffInHours < 24) {
        return `${Math.floor(diffInHours)}h ago`;
      } else {
        return date.toLocaleDateString();
      }
    } catch (error) {
      console.warn('Failed to format timestamp:', error);
      return 'Unknown time';
    }
  }, []);

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={theme.styles.searchItem}
      accessibilityRole="button"
      accessibilityLabel={`${isSuggestion ? 'Search suggestion' : 'Search result'}: ${item.label}`}
      accessibilityHint="Double tap to select this item"
    >
      <View style={theme.styles.searchItemContent}>
        <Text style={theme.styles.searchItemIcon}>{getItemIcon()}</Text>
        <View style={theme.styles.searchItemText}>
          <Text style={theme.styles.searchItemLabel} numberOfLines={2}>
            {item.label}
          </Text>
          {'description' in item && item.description && (
            <Text style={theme.styles.searchItemDescription} numberOfLines={1}>
              {item.description}
            </Text>
          )}
          {'timestamp' in item && item.timestamp && (
            <Text style={theme.styles.searchItemTimestamp}>
              {formatTimestamp(item.timestamp)}
            </Text>
          )}
        </View>
        {isSuggestion && (
          <Text style={theme.styles.suggestionBadge}>Suggestion</Text>
        )}
      </View>
    </TouchableOpacity>
  );
});

const SearchScreen: React.FC = () => {
  const { theme } = useTheme();
  const { 
    suggestions, 
    results, 
    handleQueryChange, 
    handleVoiceSearch,
    isLoading,
    error,
    clearResults,
    searchHistory
  } = useSearch();
  
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [isVoiceSearching, setIsVoiceSearching] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));
  
  const searchInputRef = useRef<TextInput>(null);
  const securityManager = SecurityManager.getInstance();
  const validationSystem = ValidationSystem.getInstance();
  const performanceMonitor = PerformanceMonitor.getInstance();

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Handle debounced query changes
  useEffect(() => {
    if (debouncedQuery.trim()) {
      if (validationSystem.validateSearchQuery(debouncedQuery)) {
        handleQueryChange(debouncedQuery);
        setShowSuggestions(false);
        performanceMonitor.recordUserAction('search_query', { query: debouncedQuery });
      } else {
        console.warn('Invalid search query detected:', debouncedQuery);
        Alert.alert('Invalid Search', 'Please enter a valid search term.');
      }
    } else {
      clearResults();
      setShowSuggestions(true);
    }
  }, [debouncedQuery, handleQueryChange, clearResults, validationSystem, performanceMonitor]);

  // Animate suggestions
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: showSuggestions ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [showSuggestions, fadeAnim]);

  const handleQueryInput = useCallback((text: string) => {
    setQuery(text);
    setShowSuggestions(true);
  }, []);

  const handleVoiceSearchPress = useCallback(async () => {
    try {
      setIsVoiceSearching(true);
      
      // Check permissions
      const hasPermission = await securityManager.validateUserPermissions('search:voice');
      if (!hasPermission) {
        throw new Error('Voice search permission not granted');
      }

      await handleVoiceSearch();
      performanceMonitor.recordUserAction('voice_search_activated');
    } catch (error) {
      console.error('Voice search failed:', error);
      performanceMonitor.recordError('SearchScreen', error as Error);
      Alert.alert('Voice Search Error', 'Voice search is not available. Please type your search.');
    } finally {
      setIsVoiceSearching(false);
    }
  }, [handleVoiceSearch, securityManager, performanceMonitor]);

  const handleItemPress = useCallback((item: SearchResult | SearchSuggestion) => {
    try {
      if ('type' in item && item.type) {
        // Handle search result
        performanceMonitor.recordUserAction('search_result_selected', {
          resultType: item.type,
          resultId: item.id,
        });
        
        // Navigate to result (implementation would depend on navigation setup)
        console.log('Navigating to search result:', item);
      } else {
        // Handle suggestion
        setQuery(item.label);
        setShowSuggestions(false);
        performanceMonitor.recordUserAction('search_suggestion_selected', {
          suggestionId: item.id,
        });
      }
    } catch (error) {
      console.error('Failed to handle item press:', error);
      performanceMonitor.recordError('SearchScreen', error as Error);
    }
  }, [performanceMonitor]);

  const handleClearSearch = useCallback(() => {
    setQuery('');
    setShowSuggestions(true);
    clearResults();
    searchInputRef.current?.focus();
  }, [clearResults]);

  const handleSearchSubmit = useCallback(() => {
    if (query.trim()) {
      setShowSuggestions(false);
      searchInputRef.current?.blur();
    }
  }, [query]);

  const displayData = useMemo(() => {
    if (showSuggestions && !query.trim()) {
      return searchHistory;
    }
    return suggestions.length > 0 ? suggestions : results;
  }, [showSuggestions, query, suggestions, results, searchHistory]);

  const renderItem = useCallback(({ item }: { item: SearchResult | SearchSuggestion }) => (
    <SearchItem
      item={item}
      onPress={handleItemPress}
      theme={theme}
      isSuggestion={showSuggestions && !query.trim()}
    />
  ), [handleItemPress, theme, showSuggestions, query]);

  const renderEmptyState = useCallback(() => {
    if (isLoading) {
      return (
        <View style={theme.styles.emptyContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={theme.styles.loadingText}>Searching...</Text>
        </View>
      );
    }

    if (error) {
      return (
        <View style={theme.styles.errorContainer}>
          <Text style={theme.styles.errorText}>{error}</Text>
          <TouchableOpacity onPress={() => handleQueryChange(query)} style={theme.styles.retryButton}>
            <Text style={theme.styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (query.trim() && results.length === 0) {
      return (
        <View style={theme.styles.emptyContainer}>
          <Text style={theme.styles.emptyText}>No results found for "{query}"</Text>
          <Text style={theme.styles.emptySubtext}>Try different keywords or check your spelling</Text>
        </View>
      );
    }

    if (!query.trim()) {
      return (
        <View style={theme.styles.emptyContainer}>
          <Text style={theme.styles.emptyText}>Start typing to search</Text>
          <Text style={theme.styles.emptySubtext}>Search for thoughtmarks, bins, or users</Text>
        </View>
      );
    }

    return null;
  }, [isLoading, error, query, results.length, theme, handleQueryChange]);

  const keyExtractor = useCallback((item: SearchResult | SearchSuggestion) => item.id, []);

  return (
    <ErrorBoundary>
      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <AutoRoleView role="main" style={theme.styles.screenContainer}>
          <View style={theme.styles.searchBar}>
            <TextInput
              ref={searchInputRef}
              value={query}
              onChangeText={handleQueryInput}
              onSubmitEditing={handleSearchSubmit}
              placeholder="Search thoughtmarks, bins, users..."
              accessibilityLabel="Search bar"
              accessibilityHint="Type to search for content"
              style={theme.styles.input}
              returnKeyType="search"
              autoCapitalize="none"
              autoCorrect={false}
              clearButtonMode="while-editing"
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => {
                // Delay hiding suggestions to allow for item selection
                setTimeout(() => setShowSuggestions(false), 200);
              }}
            />
            
            {query.length > 0 && (
              <TouchableOpacity
                onPress={handleClearSearch}
                style={theme.styles.clearButton}
                accessibilityRole="button"
                accessibilityLabel="Clear search"
              >
                <Text style={theme.styles.clearButtonText}>✕</Text>
              </TouchableOpacity>
            )}
            
            <TouchableOpacity
              onPress={handleVoiceSearchPress}
              disabled={isVoiceSearching}
              accessibilityRole="button"
              accessibilityLabel="Voice Search"
              accessibilityHint="Double tap to activate voice search"
              style={[
                theme.styles.voiceButton,
                { opacity: isVoiceSearching ? 0.6 : 1 }
              ]}
            >
              <Text style={theme.styles.voiceLabel}>
                {isVoiceSearching ? '🎤' : '🎤'}
              </Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={displayData}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
            ListEmptyComponent={renderEmptyState}
            accessibilityLabel="Search results list"
            accessibilityHint="Scroll to view search results"
            showsVerticalScrollIndicator={false}
            removeClippedSubviews={true}
            maxToRenderPerBatch={10}
            windowSize={10}
            initialNumToRender={5}
            getItemLayout={(data, index) => ({
              length: 80, // Approximate item height
              offset: 80 * index,
              index,
            })}
            contentContainerStyle={displayData.length === 0 ? { flex: 1 } : undefined}
          />
        </AutoRoleView>
      </KeyboardAvoidingView>
    </ErrorBoundary>
  );
};

export default withPerformanceMonitoring(SearchScreen, 'SearchScreen', 'nextgen'); 