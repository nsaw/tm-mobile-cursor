import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { colors, spacing, typography } from '../../../theme/theme';
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
import SiriShortcutsService from '../../../services/SiriShortcutsService';

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
  const hasPremiumAccess = user?.isPremium || user?.isTestUser;

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
    SiriShortcutsService.donateSearchShortcut();

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
          <Ionicons name="search" size={20} color={colors.subtext} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search thoughtmarks, tags, or content..."
            placeholderTextColor={colors.subtext}
            value={searchQuery}
            onChangeText={handleSearch}
            autoFocus
          />
          {isSearching && (
            <ActivityIndicator size="small" color={colors.primary} style={styles.searchSpinner} />
          )}
        </View>

        {/* AI Search Toggle */}
        {hasPremiumAccess && (
          <TouchableOpacity
            style={[styles.aiToggle, useAISearch && styles.aiToggleActive]}
            onPress={() => setUseAISearch(!useAISearch)}
          >
            <Ionicons 
              name={useAISearch ? "sparkles" : "sparkles-outline"} 
              size={16} 
              color={useAISearch ? colors.primary : colors.subtext} 
            />
            <Text style={[styles.aiToggleText, { color: useAISearch ? colors.primary : colors.subtext }]}>
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
            <Ionicons name="search" size={48} color={colors.subtext} />
            <Text style={styles.noResultsTitle}>No results found</Text>
            <Text style={styles.noResultsSubtitle}>
              Try searching with different keywords or check your spelling
            </Text>
          </View>
        )}

        {!searchQuery && (
          <View style={styles.initialState}>
            <Ionicons name="search" size={48} color={colors.subtext} />
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
                        <ActivityIndicator size="small" color={colors.primary} />
                      ) : (
                        <Ionicons name="refresh" size={16} color={colors.primary} />
                      )}
                    </Button>
                  </View>
                  
                  {aiSuggestions.length > 0 ? (
                    aiSuggestions.map((suggestion, index) => (
                      <TouchableOpacity
                        key={index}
                        style={styles.suggestionItem}
                        onPress={() => handleSuggestionPress(suggestion)}
                      >
                        <Ionicons name="bulb-outline" size={16} color={colors.primary} />
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  searchContainer: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: typography.body.fontSize,
    color: colors.text,
    marginLeft: spacing.sm,
  },
  searchIcon: {
    marginRight: spacing.sm,
  },
  searchSpinner: {
    marginLeft: spacing.sm,
  },
  aiToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: spacing.sm,
    backgroundColor: colors.card,
  },
  aiToggleActive: {
    backgroundColor: colors.primary + '20',
  },
  aiToggleText: {
    fontSize: 12,
    fontWeight: '500',
    marginLeft: spacing.xs,
  },
  resultsContainer: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  resultsCount: {
    fontSize: typography.body.fontSize * 0.8,
    color: colors.subtext,
    marginBottom: spacing.md,
  },
  noResults: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  noResultsTitle: {
    fontSize: typography.heading.fontSize,
    fontWeight: '600',
    color: colors.text,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  noResultsSubtitle: {
    fontSize: typography.body.fontSize,
    color: colors.subtext,
    textAlign: 'center',
    paddingHorizontal: spacing.lg,
  },
  initialState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  initialStateTitle: {
    fontSize: typography.heading.fontSize,
    fontWeight: '600',
    color: colors.text,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  initialStateSubtitle: {
    fontSize: typography.body.fontSize,
    color: colors.subtext,
    textAlign: 'center',
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.xl,
  },
  suggestionsCard: {
    marginBottom: spacing.lg,
    width: '100%',
  },
  suggestionsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  suggestionsTitle: {
    fontSize: typography.subheading.fontSize,
    fontWeight: '600',
    color: colors.text,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  suggestionText: {
    flex: 1,
    fontSize: typography.body.fontSize,
    color: colors.text,
    marginLeft: spacing.sm,
    fontWeight: '500',
  },
  suggestionReason: {
    fontSize: typography.body.fontSize * 0.8,
    color: colors.subtext,
    marginLeft: spacing.sm,
    marginTop: spacing.xs,
  },
  suggestionsEmpty: {
    fontSize: typography.body.fontSize,
    color: colors.subtext,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  recentSearches: {
    width: '100%',
  },
  recentTitle: {
    fontSize: typography.subheading.fontSize,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  recentTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  resultsList: {
    paddingBottom: spacing.xl,
  },
}); 