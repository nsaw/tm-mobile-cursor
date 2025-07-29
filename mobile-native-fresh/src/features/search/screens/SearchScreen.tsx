import { Text ,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert,
} from 'react-native';
import React, { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import { useTheme } from '../../../theme/ThemeProvider';
import { ThoughtmarkCard } from '../../home/components/ThoughtmarkCard';
import { useThoughtmarks } from '../../home/hooks/useThoughtmarks';
import { useAuth } from '../../auth/hooks/useAuth';
import { ModernHeader } from '../../../components/ui/ModernHeader';
import { BottomNav } from '../../../components/ui/BottomNav';
import { useVoiceRecorder } from '../../../components/ui/VoiceRecorderProvider';
import { Card, CardContent } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { TagChip } from '../../../components/ui/TagChip';
import { apiService } from '../../../services/api';
import { RootStackParamList } from '../../../navigation/types';
// import SiriShortcutsService from '../../../services/SiriShortcutsService';

type NavigationProp = StackNavigationProp<RootStackParamList>;

export const SearchScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { thoughtmarks } = useThoughtmarks();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [useAISearch, setUseAISearch] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<any[]>([]);
  const [isGeneratingSuggestions, setIsGeneratingSuggestions] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  const { showVoiceRecorder } = useVoiceRecorder();
  const { tokens: designTokens } = useTheme();
  const hasPremiumAccess = user?.isPremium || user?.isTestUser;
  const styles = getStyles(designTokens);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    setIsSearching(true);
    
    if (query.trim() === '') {
      setSearchResults([]);
      setAiSuggestions([]);
      setIsSearching(false);
      return;
    }

    // Donate Siri shortcut for search
    // SiriShortcutsService.donateSearchShortcut();

    // Add to recent searches
    if (!recentSearches.includes(query)) {
      setRecentSearches(prev => [query, ...prev.slice(0, 4)]);
    }

    // Basic search
    const basicResults = thoughtmarks.filter((thoughtmark: any) => {
      const searchLower = query.toLowerCase();
      return (
        thoughtmark.title.toLowerCase().includes(searchLower) ||
        thoughtmark.content.toLowerCase().includes(searchLower) ||
        thoughtmark.tags?.some((tag: string) => tag.toLowerCase().includes(searchLower))
      );
    });

    setSearchResults(basicResults);

    // AI-enhanced search if enabled and user has premium
    if (useAISearch && hasPremiumAccess && query.length > 3) {
      try {
        const aiResults = await apiService.semanticSearch(query);
        if (aiResults.success && aiResults.data && typeof aiResults.data === 'object' && 'results' in aiResults.data) {
          const results = (aiResults.data as any).results;
          if (Array.isArray(results)) {
            // Merge AI results with basic results, prioritizing AI matches
            const aiResultIds = new Set(results.map((r: any) => r.id));
            const basicOnly = basicResults.filter(r => !aiResultIds.has(r.id));
            const mergedResults = [...results, ...basicOnly];
            setSearchResults(mergedResults);
          }
        }
      } catch (error) {
        console.error('AI search error:', error);
        // Fall back to basic search
      }
    }

    setIsSearching(false);
  };

  const generateSearchSuggestions = async () => {
    if (!hasPremiumAccess) {
      Alert.alert(
        'Premium Feature',
        'AI search suggestions are available for premium users. Upgrade to unlock this feature.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Upgrade', onPress: () => navigation.navigate('Subscribe' as never) }
        ]
      );
      return;
    }

    setIsGeneratingSuggestions(true);
    try {
      const result = await apiService.generateSearchSuggestions();
      if (result.success && result.data && typeof result.data === 'object' && 'suggestions' in result.data) {
        const suggestions = (result.data as any).suggestions;
        if (Array.isArray(suggestions)) {
          setAiSuggestions(suggestions);
        }
      }
    } catch (error) {
      console.error('Error generating search suggestions:', error);
      Alert.alert('Error', 'Failed to generate search suggestions. Please try again.');
    } finally {
      setIsGeneratingSuggestions(false);
    }
  };

  const handleThoughtmarkPress = (thoughtmark: any) => {
    navigation.navigate('ThoughtmarkDetail', { thoughtmarkId: thoughtmark.id });
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setAiSuggestions([]);
  };

  const handleSuggestionPress = (suggestion: any) => {
    setSearchQuery(suggestion.query);
    handleSearch(suggestion.query);
  };

  const handleRecentSearchPress = (recentQuery: string) => {
    setSearchQuery(recentQuery);
    handleSearch(recentQuery);
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

  return (
    <View style={styles.container}>
      <ModernHeader 
        title="SEARCH" 
        subtitle="Find your thoughtmarks"
        rightAction={searchQuery ? {
          icon: 'close',
          onPress: handleClearSearch
        } : undefined}
      />

      {/* Search Input */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search" size={20} color={designTokens.colors.textSecondary} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search thoughtmarks..."
            placeholderTextColor={designTokens.colors.textSecondary}
            value={searchQuery}
            onChangeText={handleSearch}
          />
          {isSearching && (
            <ActivityIndicator size="small" color={designTokens.colors.accent} style={styles.searchSpinner} />
          )}
        </View>

        {/* AI Search Toggle */}
        {hasPremiumAccess && (
          <TouchableOpacity
            style={[styles.aiToggle, useAISearch && styles.aiToggleActive]}
            onPress={() => setUseAISearch(!useAISearch)}
                accessibilityRole="button"
                accessible={true}
                accessibilityLabel="Button"
          >
            <Ionicons 
              name={useAISearch ? "sparkles" : "sparkles-outline"} 
              size={16} 
              color={useAISearch ? designTokens.colors.accent : designTokens.colors.textSecondary} 
            />
            <Text style={[styles.aiToggleText, { color: useAISearch ? designTokens.colors.accent : designTokens.colors.textSecondary }]}>
              AI Enhanced
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Search Results */}
      <View style={styles.resultsContainer}>
        {searchQuery && !isSearching && (
          <Text style={styles.resultsCount}>
            {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} found
            {useAISearch && hasPremiumAccess && " (AI Enhanced)"}
          </Text>
        )}
        
        {searchQuery && !isSearching && searchResults.length === 0 && (
          <View style={styles.noResults}>
            <Ionicons name="search" size={48} color={designTokens.colors.textSecondary} />
            <Text style={styles.noResultsTitle}>No results found</Text>
            <Text style={styles.noResultsSubtitle}>
              Try searching with different keywords or check your spelling
            </Text>
          </View>
        )}

        {!searchQuery && (
          <View style={styles.initialState}>
            <Ionicons name="search" size={48} color={designTokens.colors.textSecondary} />
            <Text style={styles.initialStateTitle}>Search your thoughtmarks</Text>
            <Text style={styles.initialStateSubtitle}>
              Search by title, content, or tags to find what you're looking for
            </Text>

            {/* AI Search Suggestions */}
            {hasPremiumAccess && (
              <Card style={styles.suggestionsCard}>
                <CardContent>
                  <View style={styles.suggestionsHeader}>
                    <Text style={styles.suggestionsTitle}>AI Search Suggestions</Text>
                    <Button
                      variant="ghost"
                      size="sm"
                      onPress={generateSearchSuggestions}
                      disabled={isGeneratingSuggestions}
                    >
                      {isGeneratingSuggestions ? (
                        <ActivityIndicator size="small" color={designTokens.colors.accent} />
                      ) : (
                        <Ionicons name="refresh" size={16} color={designTokens.colors.accent} />
                      )}
                    </Button>
                  </View>
                  
                  {aiSuggestions.length > 0 ? (
                    aiSuggestions.map((suggestion, index) => (
                      <TouchableOpacity
                        key={index}
                        style={styles.suggestionItem}
                        onPress={() => handleSuggestionPress(suggestion)}
                accessibilityRole="button"
                accessible={true}
                accessibilityLabel="Button"
                      >
                        <Ionicons name="bulb-outline" size={16} color={designTokens.colors.accent} />
                        <Text style={styles.suggestionText}>{suggestion.query}</Text>
                        <Text style={styles.suggestionReason}>{suggestion.reason}</Text>
                      </TouchableOpacity>
                    ))
                  ) : (
                    <Text style={styles.suggestionsEmpty}>
                      Tap refresh to get AI-powered search suggestions
                    </Text>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Recent Searches */}
            {recentSearches.length > 0 && (
              <View style={styles.recentSearches}>
                <Text style={styles.recentTitle}>Recent Searches</Text>
                <View style={styles.recentTags}>
                  {recentSearches.map((query, index) => (
                    <TouchableOpacity
                      key={index}
                      onPress={() => handleRecentSearchPress(query)}
                accessibilityRole="button"
                accessible={true}
                accessibilityLabel="Button"
                    >
                      <TagChip
                        tag={query}
                        variant="outline"
                        size="sm"
                      />
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}
          </View>
        )}

        <FlatList
          data={searchResults}
          renderItem={({ item }) => (
            <ThoughtmarkCard 
              thoughtmark={item} 
              onClick={() => handleThoughtmarkPress(item)}
              onPinToggle={handlePinToggle}
            />
          )}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.resultsList}
          showsVerticalScrollIndicator={false}
        />
      </View>

      {/* Bottom Navigation */}
      <BottomNav
        onNavigate={handleNavigate}
        onVoiceRecord={handleVoiceRecord}
        showCreateButton={true}
        currentRoute="/search"
        onCreateNew={handleCreateThoughtmark}
      />
    </View>
  );
};

// tokens are passed from the parent component, useTheme is called in the component scope.
const getStyles = (tokens: any) => StyleSheet.create({
  aiToggle: {
    alignItems: 'center',
    alignSelf: 'flex-end',
    backgroundColor: tokens.colors.surface,
    borderRadius: tokens.spacing.sm,
    flexDirection: 'row',
    paddingHorizontal: tokens.spacing.sm,
    paddingVertical: tokens.spacing.xs,
  },
  aiToggleActive: {
    backgroundColor: tokens.colors.accent + '20',
  },
  aiToggleText: {
    color: tokens.colors.text,
    fontSize: 12,
    fontWeight: '500',
    marginLeft: tokens.spacing.xs,
  },
  container: {
    backgroundColor: tokens.colors.background,
    flex: 1,
  },
  initialState: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingVertical: tokens.spacing.xl,
  },
  initialStateSubtitle: {
    color: tokens.colors.textSecondary,
    fontSize: tokens.typography.fontSize.body,
    marginBottom: tokens.spacing.xl,
    paddingHorizontal: tokens.spacing.lg,
    textAlign: 'center',
  },
  initialStateTitle: {
    color: tokens.colors.text,
    fontSize: tokens.typography.fontSize.heading,
    fontWeight: '600',
    marginBottom: tokens.spacing.sm,
    marginTop: tokens.spacing.md,
  },
  noResults: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingVertical: tokens.spacing.xl,
  },
  noResultsSubtitle: {
    color: tokens.colors.textSecondary,
    fontSize: tokens.typography.fontSize.body,
    paddingHorizontal: tokens.spacing.lg,
    textAlign: 'center',
  },
  noResultsTitle: {
    color: tokens.colors.text,
    fontSize: tokens.typography.fontSize.heading,
    fontWeight: '600',
    marginBottom: tokens.spacing.sm,
    marginTop: tokens.spacing.md,
  },
  recentSearches: {
    width: '100%',
  },
  recentTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: tokens.spacing.sm,
  },
  recentTitle: {
    color: tokens.colors.text,
    fontSize: tokens.typography.fontSize.lg,
    fontWeight: '600',
    marginBottom: tokens.spacing.sm,
  },
  resultsContainer: {
    flex: 1,
    paddingHorizontal: tokens.spacing.lg,
  },
  resultsCount: {
    color: tokens.colors.textSecondary,
    fontSize: tokens.typography.fontSize.body * 0.8,
    marginBottom: tokens.spacing.md,
  },
  resultsList: {
    paddingBottom: tokens.spacing.xl,
  },
  searchContainer: {
    marginBottom: tokens.spacing.md,
    paddingHorizontal: tokens.spacing.lg,
  },
  searchIcon: {
    marginRight: tokens.spacing.sm,
  },
  searchInput: {
    color: tokens.colors.text,
    flex: 1,
    fontSize: tokens.typography.fontSize.body,
    marginLeft: tokens.spacing.sm,
  },
  searchInputContainer: {
    alignItems: 'center',
    backgroundColor: tokens.colors.surface,
    borderColor: tokens.colors.border,
    borderRadius: tokens.spacing.md,
    borderWidth: 1,
    flexDirection: 'row',
    marginBottom: tokens.spacing.sm,
    paddingHorizontal: tokens.spacing.md,
    paddingVertical: tokens.spacing.sm,
  },
  searchSpinner: {
    marginLeft: tokens.spacing.sm,
  },
  suggestionItem: {
    alignItems: 'flex-start',
    borderBottomColor: tokens.colors.border,
    borderBottomWidth: 1,
    flexDirection: 'row',
    paddingVertical: tokens.spacing.sm,
  },
  suggestionReason: {
    color: tokens.colors.textSecondary,
    fontSize: tokens.typography.fontSize.body * 0.8,
    marginLeft: tokens.spacing.sm,
    marginTop: tokens.spacing.xs,
  },
  suggestionText: {
    color: tokens.colors.text,
    flex: 1,
    fontSize: tokens.typography.fontSize.body,
    fontWeight: '500',
    marginLeft: tokens.spacing.sm,
  },
  suggestionsCard: {
    marginBottom: tokens.spacing.lg,
    width: '100%',
  },
  suggestionsEmpty: {
    color: tokens.colors.textSecondary,
    fontSize: tokens.typography.fontSize.body,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  suggestionsHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: tokens.spacing.md,
  },
  suggestionsTitle: {
    color: tokens.colors.text,
    fontSize: tokens.typography.fontSize.lg,
    fontWeight: '600',
    marginBottom: tokens.spacing.sm,
  },
}); 