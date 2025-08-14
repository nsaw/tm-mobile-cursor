import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  SearchQuery,
  SearchResponse,
  SearchResult,
  SearchSuggestion,
  SearchFilters,
  SearchHighlight,
} from '../types/search';
import { useAppStore } from '../../../state/store';

const SEARCH_HISTORY_KEY = '@thoughtmarks_search_history';
const SEARCH_SUGGESTIONS_KEY = '@thoughtmarks_search_suggestions';

class SearchService {
  private searchHistory: string[] = [];
  private popularSearches: string[] = [
    'important',
    'meeting',
    'ideas',
    'todo',
    'project',
    'notes',
    'urgent',
    'follow up',
  ];

  async search(query: SearchQuery): Promise<SearchResponse> {
    const startTime = Date.now();
    const store = useAppStore.getState();

    try {
      // Get all searchable items
      const allItems = this.getAllSearchableItems(store);

      // Apply filters
      const filteredItems = this.applyFilters(allItems, query.filters);

      // Perform text search
      const searchResults = this.performTextSearch(filteredItems, query.text);

      // Apply sorting
      const sortedResults = this.sortResults(searchResults, query.sortBy, query.sortOrder);

      // Apply pagination
      const paginatedResults = sortedResults.slice(query.offset, query.offset + query.limit);

      // Generate suggestions
      const suggestions = await this.generateSuggestions(query.text);

      // Save search to history
      if (query.text.trim()) {
        await this.saveToHistory(query.text);
      }

      const executionTime = Date.now() - startTime;

      return {
        results: paginatedResults,
        total: searchResults.length,
        suggestions,
        query,
        executionTime,
      };
    } catch (error) {
      console.error('Search failed:', error);
      throw error;
    }
  }

  private getAllSearchableItems(store: any): SearchResult[] {
    const items: SearchResult[] = [];

    // Add thoughtmarks
    store.thoughtmarks.forEach((thoughtmark: any) => {
      items.push({
        id: thoughtmark.id,
        type: 'thoughtmark',
        title: thoughtmark.title || 'Untitled Thoughtmark',
        content: thoughtmark.content || '',
        relevance: 0,
        matchedTerms: [],
        metadata: {
          tags: thoughtmark.tags || [],
          binName: thoughtmark.binName,
          createdAt: thoughtmark.createdAt,
          updatedAt: thoughtmark.updatedAt,
        },
        highlights: [],
      });
    });

    // Add tasks
    store.tasks.forEach((task: any) => {
      items.push({
        id: task.id,
        type: 'task',
        title: task.title || 'Untitled Task',
        content: task.description || '',
        relevance: 0,
        matchedTerms: [],
        metadata: {
          tags: task.tags || [],
          createdAt: task.createdAt,
          updatedAt: task.updatedAt,
          priority: task.priority,
          status: task.completed ? 'completed' : 'pending',
        },
        highlights: [],
      });
    });

    // Add bins
    store.bins.forEach((bin: any) => {
      items.push({
        id: bin.id,
        type: 'bin',
        title: bin.name || 'Untitled Bin',
        content: bin.description || '',
        relevance: 0,
        matchedTerms: [],
        metadata: {
          tags: bin.tags || [],
          createdAt: bin.createdAt,
          updatedAt: bin.updatedAt,
        },
        highlights: [],
      });
    });

    return items;
  }

  private applyFilters(items: SearchResult[], filters: SearchFilters): SearchResult[] {
    let filtered = items;

    if (filters.types.length > 0) {
      filtered = filtered.filter(item => filters.types.includes(item.type));
    }

    if (filters.tags.length > 0) {
      filtered = filtered.filter(item =>
        filters.tags.some(tag => item.metadata.tags.includes(tag))
      );
    }

    if (filters.bins.length > 0) {
      filtered = filtered.filter(item =>
        item.metadata.binName && filters.bins.includes(item.metadata.binName)
      );
    }

    if (filters.status && filters.status.length > 0) {
      filtered = filtered.filter(item =>
        item.metadata.status && filters.status!.includes(item.metadata.status)
      );
    }

    if (filters.priority && filters.priority.length > 0) {
      filtered = filtered.filter(item =>
        item.metadata.priority && filters.priority!.includes(item.metadata.priority)
      );
    }

    return filtered;
  }

  private performTextSearch(items: SearchResult[], query: string): SearchResult[] {
    if (!query.trim()) return items;

    const searchTerms = query.toLowerCase().split(' ').filter(term => term.length > 0);
    const results: SearchResult[] = [];

    items.forEach(item => {
      const titleMatch = this.calculateMatchScore(item.title.toLowerCase(), searchTerms);
      const contentMatch = this.calculateMatchScore(item.content.toLowerCase(), searchTerms);
      const tagMatch = this.calculateTagMatch(item.metadata.tags, searchTerms);

      const totalScore = titleMatch * 3 + contentMatch * 2 + tagMatch * 1.5;

      if (totalScore > 0) {
        const matchedTerms = this.findMatchedTerms(item, searchTerms);
        const highlights = this.generateHighlights(item, searchTerms);

        results.push({
          ...item,
          relevance: totalScore / (titleMatch + contentMatch + tagMatch),
          matchedTerms,
          highlights,
        });
      }
    });

    return results;
  }

  private calculateMatchScore(text: string, searchTerms: string[]): number {
    let score = 0;
    searchTerms.forEach(term => {
      if (text.includes(term)) {
        score += 1;
        // Bonus for exact matches
        if (text === term) score += 0.5;
        // Bonus for word boundaries
        if (text.includes(` ${term} `) || text.startsWith(`${term} `) || text.endsWith(` ${term}`)) {
          score += 0.3;
        }
      }
    });
    return score;
  }

  private calculateTagMatch(tags: string[], searchTerms: string[]): number {
    let score = 0;
    searchTerms.forEach(term => {
      if (tags.some(tag => tag.toLowerCase().includes(term))) {
        score += 1;
      }
    });
    return score;
  }

  private findMatchedTerms(item: SearchResult, searchTerms: string[]): string[] {
    const matched: string[] = [];
    const allText = `${item.title} ${item.content}`.toLowerCase();
    searchTerms.forEach(term => {
      if (allText.includes(term)) {
        matched.push(term);
      }
    });
    return matched;
  }

  private generateHighlights(item: SearchResult, searchTerms: string[]): SearchHighlight[] {
    const highlights: SearchHighlight[] = [];
    searchTerms.forEach(term => {
      // Highlight in title
      const titleIndex = item.title.toLowerCase().indexOf(term);
      if (titleIndex !== -1) {
        highlights.push({
          field: 'title',
          snippet: item.title.substring(titleIndex, titleIndex + term.length),
          start: titleIndex,
          end: titleIndex + term.length,
        });
      }

      // Highlight in content
      const contentIndex = item.content.toLowerCase().indexOf(term);
      if (contentIndex !== -1) {
        highlights.push({
          field: 'content',
          snippet: item.content.substring(contentIndex, contentIndex + term.length),
          start: contentIndex,
          end: contentIndex + term.length,
        });
      }
    });
    return highlights;
  }

  private sortResults(results: SearchResult[], sortBy: string, sortOrder: string): SearchResult[] {
    return results.sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case 'relevance':
          comparison = b.relevance - a.relevance;
          break;
        case 'date':
          comparison = new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
          break;
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        default:
          comparison = b.relevance - a.relevance;
      }

      return sortOrder === 'desc' ? comparison : -comparison;
    });
  }

  async generateSuggestions(query: string): Promise<SearchSuggestion[]> {
    const suggestions: SearchSuggestion[] = [];

    // Add recent searches
    const recentSearches = await this.getSearchHistory();
    recentSearches.forEach(search => {
      if (search.toLowerCase().includes(query.toLowerCase())) {
        suggestions.push({
          text: search,
          type: 'recent',
          relevance: 0.8,
        });
      }
    });

    // Add popular searches
    this.popularSearches.forEach(search => {
      if (search.toLowerCase().includes(query.toLowerCase())) {
        suggestions.push({
          text: search,
          type: 'popular',
          relevance: 0.6,
        });
      }
    });

    // Add AI suggestions (simulated)
    if (query.length > 2) {
      const aiSuggestions = this.generateAISuggestions(query);
      suggestions.push(...aiSuggestions);
    }

    return suggestions.sort((a, b) => b.relevance - a.relevance).slice(0, 10);
  }

  private generateAISuggestions(query: string): SearchSuggestion[] {
    const suggestions: SearchSuggestion[] = [];
    const queryLower = query.toLowerCase();

    // Simple AI-like suggestions based on query patterns
    if (queryLower.includes('meet')) {
      suggestions.push({
        text: 'meeting notes',
        type: 'ai',
        relevance: 0.9,
      });
    }

    if (queryLower.includes('task') || queryLower.includes('todo')) {
      suggestions.push({
        text: 'pending tasks',
        type: 'ai',
        relevance: 0.9,
      });
    }

    if (queryLower.includes('idea')) {
      suggestions.push({
        text: 'creative ideas',
        type: 'ai',
        relevance: 0.8,
      });
    }

    return suggestions;
  }

  private async saveToHistory(query: string): Promise<void> {
    try {
      this.searchHistory = this.searchHistory.filter(q => q !== query);
      this.searchHistory.unshift(query);
      this.searchHistory = this.searchHistory.slice(0, 20); // Keep last 20 searches
      await AsyncStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(this.searchHistory));
    } catch (error) {
      console.error('Failed to save search history:', error);
    }
  }

  private async getSearchHistory(): Promise<string[]> {
    try {
      const stored = await AsyncStorage.getItem(SEARCH_HISTORY_KEY);
      if (stored) {
        this.searchHistory = JSON.parse(stored);
      }
      return this.searchHistory;
    } catch (error) {
      console.error('Failed to load search history:', error);
      return [];
    }
  }

  async clearSearchHistory(): Promise<void> {
    try {
      this.searchHistory = [];
      await AsyncStorage.removeItem(SEARCH_HISTORY_KEY);
    } catch (error) {
      console.error('Failed to clear search history:', error);
    }
  }
}

export const searchService = new SearchService();
