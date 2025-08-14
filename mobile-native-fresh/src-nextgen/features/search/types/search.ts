export interface SearchResult {
  id: string;
  type: 'thoughtmark' | 'task' | 'bin' | 'tag';
  title: string;
  content?: string;
  highlights?: SearchHighlight[];
  score: number;
  relevance: number;
  createdAt: string;
  updatedAt: string;
}

export interface SearchHighlight {
  field: string;
  snippet: string;
  start: number;
  end: number;
}

export interface SearchSuggestion {
  text: string;
  type: 'recent' | 'popular' | 'ai';
  relevance: number;
}

export interface SearchFilters {
  type?: string[];
  tags?: string[];
  bins?: string[];
  dateRange?: {
    start: string;
    end: string;
  };
  status?: string;
  priority?: string;
}

export interface SearchResponse {
  results: SearchResult[];
  total: number;
  page: number;
  pageSize: number;
  query: string;
  filters: SearchFilters;
}
