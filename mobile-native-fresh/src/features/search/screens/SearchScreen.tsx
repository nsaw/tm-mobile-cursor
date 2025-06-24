import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { colors, spacing, typography } from '../../../theme/theme';
import { ThoughtmarkCard } from '../../home/components/ThoughtmarkCard';
import { useThoughtmarks } from '../../home/hooks/useThoughtmarks';
import { ModernHeader } from '../../../components/ui/ModernHeader';
import { BottomNav } from '../../../components/ui/BottomNav';
import { useVoiceRecorder } from '../../../components/ui/VoiceRecorderProvider';
import { RootStackParamList } from '../../../navigation/types';

type NavigationProp = StackNavigationProp<RootStackParamList>;

export const SearchScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { thoughtmarks } = useThoughtmarks();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const { showVoiceRecorder } = useVoiceRecorder();

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setIsSearching(true);
    
    if (query.trim() === '') {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    // Simple search implementation
    const results = thoughtmarks.filter((thoughtmark: any) => {
      const searchLower = query.toLowerCase();
      return (
        thoughtmark.title.toLowerCase().includes(searchLower) ||
        thoughtmark.content.toLowerCase().includes(searchLower) ||
        thoughtmark.tags?.some((tag: string) => tag.toLowerCase().includes(searchLower))
      );
    });

    setSearchResults(results);
    setIsSearching(false);
  };

  const handleThoughtmarkPress = (thoughtmark: any) => {
    navigation.navigate('ThoughtmarkDetail', { thoughtmarkId: thoughtmark.id });
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
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
      </View>

      {/* Search Results */}
      <View style={styles.resultsContainer}>
        {searchQuery && !isSearching && (
          <Text style={styles.resultsCount}>
            {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} found
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
          </View>
        )}

        <FlatList
          data={searchResults}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleThoughtmarkPress(item)}>
              <ThoughtmarkCard thoughtmark={item} />
            </TouchableOpacity>
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
  },
  searchInput: {
    flex: 1,
    marginLeft: spacing.sm,
    fontSize: typography.body.fontSize,
    color: colors.text,
  },
  searchIcon: {
    marginRight: spacing.sm,
  },
  searchSpinner: {
    marginLeft: spacing.sm,
  },
  resultsContainer: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  resultsCount: {
    fontSize: typography.body.fontSize,
    color: colors.text,
    marginBottom: spacing.md,
  },
  noResults: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  noResultsTitle: {
    fontSize: typography.subheading.fontSize,
    fontWeight: '600',
    color: colors.text,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  noResultsSubtitle: {
    fontSize: typography.body.fontSize,
    color: colors.subtext,
    textAlign: 'center',
  },
  initialState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  initialStateTitle: {
    fontSize: typography.subheading.fontSize,
    fontWeight: '600',
    color: colors.text,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  initialStateSubtitle: {
    fontSize: typography.body.fontSize,
    color: colors.subtext,
    textAlign: 'center',
  },
  resultsList: {
    paddingBottom: spacing.xl,
  },
}); 