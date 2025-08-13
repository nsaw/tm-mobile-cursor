export interface SearchResult {
  id: string;
  type: 'thoughtmark' | 'task' | 'note' | 'bin' | 'tag';
  title: string;
  content: string;
  relevance: number;
  matchedTerms: string[];
  metadata: SearchResultMetadata;
  highlights: SearchHighlight[];
}

export interface SearchResultMetadata {
  tags: string[];
  binName?: string;
  createdAt: string;
  updatedAt: string;
  priority?: string;
  status?: string;
}

export interface SearchHighlight {
  field: string;
  snippet: string;
  start: number;
  end: number;
}

export interface SearchQuery {
  text: string;
  filters: SearchFilters;
  sortBy: 'relevance' | 'date' | 'title';
  sortOrder: 'asc' | 'desc';
  limit: number;
  offset: number;
}

export interface SearchFilters {
  types: string[];
  tags: string[];
  bins: string[];
  dateRange?: {
    start: string;
    end: string;
  };
  status?: string[];
  priority?: string[];
}

export interface SearchSuggestion {
  text: string;
  type: 'recent' | 'popular' | 'ai';
  relevance: number;
}

export interface SearchResponse {
  results: SearchResult[];
  total: number;
  suggestions: SearchSuggestion[];
  query: SearchQuery;
  executionTime: number;
}
