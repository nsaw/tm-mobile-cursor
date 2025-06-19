import { useState, useEffect, useRef } from "react";
import { Search, Clock, Hash, Sparkles, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import type { ThoughtmarkWithBin } from "@shared/schema";

interface InstantSearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
  onResultSelect?: (thoughtmark: ThoughtmarkWithBin) => void;
}

export function InstantSearch({ 
  value, 
  onChange, 
  placeholder = "Search thoughtmarks...", 
  autoFocus = false,
  onResultSelect 
}: InstantSearchProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const [, setLocation] = useLocation();

  // Load recent searches from localStorage
  useEffect(() => {
    const recent = localStorage.getItem('recent-searches');
    if (recent) {
      setRecentSearches(JSON.parse(recent).slice(0, 5));
    }
  }, []);

  // Save search to recent when user searches
  const saveRecentSearch = (query: string) => {
    if (!query.trim()) return;
    
    const recent = [...recentSearches.filter(s => s !== query), query].slice(-5);
    setRecentSearches(recent);
    localStorage.setItem('recent-searches', JSON.stringify(recent));
  };

  // Instant search results
  const { data: searchResults = [], isLoading } = useQuery<ThoughtmarkWithBin[]>({
    queryKey: ["/api/search", value],
    queryFn: async () => {
      if (!value.trim()) return [];
      const response = await apiRequest("GET", `/api/search?q=${encodeURIComponent(value)}&limit=5`);
      return response.json();
    },
    enabled: !!value.trim(),
    staleTime: 1000 * 60, // Cache for 1 minute
  });

  // Get popular tags for suggestions
  const { data: popularTags = [] } = useQuery<string[]>({
    queryKey: ["/api/tags/popular"],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/tags/popular?limit=8");
      return response.json();
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });

  const handleResultClick = (thoughtmark: ThoughtmarkWithBin) => {
    if (onResultSelect) {
      onResultSelect(thoughtmark);
    } else {
      setLocation(`/thoughtmarks/${thoughtmark.id}`);
    }
    setIsOpen(false);
    saveRecentSearch(value);
  };

  const handleTagClick = (tag: string) => {
    onChange(`#${tag}`);
    setIsOpen(false);
  };

  const handleRecentSearchClick = (search: string) => {
    onChange(search);
    setIsOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    console.log('Search input change:', newValue);
    onChange(newValue);
    setIsOpen(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && value.trim()) {
      saveRecentSearch(value);
      setLocation(`/search?q=${encodeURIComponent(value)}`);
      setIsOpen(false);
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('recent-searches');
  };

  return (
    <div className="relative">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <Input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsOpen(true)}
          className="search-input w-full pl-10 pr-4 py-3 bg-gray-800 border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-[#C6D600] focus:border-[#C6D600]"
          placeholder={placeholder}
          autoFocus={autoFocus}
          aria-label="Search thoughtmarks"
          role="searchbox"
        />
      </div>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Search dropdown */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-full left-0 right-0 mt-2 z-50 bg-gray-900 border border-gray-600 rounded-xl shadow-2xl max-h-96 overflow-hidden"
            >
              {/* Loading state */}
              {isLoading && value.trim() && (
                <div className="p-4 text-center">
                  <div className="animate-spin w-5 h-5 border-2 border-[#C6D600] border-t-transparent rounded-full mx-auto mb-2" />
                  <p className="text-sm text-gray-400">Searching...</p>
                </div>
              )}

              {/* Search results */}
              {!isLoading && searchResults.length > 0 && (
                <div className="border-b border-gray-700">
                  <div className="px-4 py-2 text-xs text-gray-400 uppercase tracking-wide">
                    Results
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {searchResults.map((thoughtmark) => (
                      <button
                        key={thoughtmark.id}
                        onClick={() => handleResultClick(thoughtmark)}
                        className="w-full px-4 py-3 text-left hover:bg-gray-800 transition-colors border-b border-gray-800 last:border-b-0"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-medium text-white truncate">
                              {thoughtmark.title}
                            </h4>
                            <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                              {thoughtmark.content}
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                              <span className="text-xs text-blue-400">
                                {thoughtmark.binName}
                              </span>
                              {thoughtmark.tags.slice(0, 2).map(tag => (
                                <span key={tag} className="text-xs text-gray-500">
                                  #{tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* No results */}
              {!isLoading && value.trim() && searchResults.length === 0 && (
                <div className="p-4 text-center">
                  <p className="text-sm text-gray-400">No thoughtmarks found</p>
                  <Button
                    onClick={() => {
                      setLocation(`/search?q=${encodeURIComponent(value)}`);
                      setIsOpen(false);
                    }}
                    variant="ghost"
                    size="sm"
                    className="mt-2 text-[#C6D600] hover:bg-[#C6D600]/10"
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    Try AI search
                  </Button>
                </div>
              )}

              {/* Recent searches */}
              {!value.trim() && recentSearches.length > 0 && (
                <div className="border-b border-gray-700">
                  <div className="flex items-center justify-between px-4 py-2">
                    <span className="text-xs text-gray-400 uppercase tracking-wide">
                      Recent
                    </span>
                    <Button
                      onClick={clearRecentSearches}
                      variant="ghost"
                      size="sm"
                      className="text-gray-500 hover:text-gray-300 h-auto p-1"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                  <div>
                    {recentSearches.map((search, index) => (
                      <button
                        key={index}
                        onClick={() => handleRecentSearchClick(search)}
                        className="w-full px-4 py-2 text-left hover:bg-gray-800 transition-colors flex items-center gap-3"
                      >
                        <Clock className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-300">{search}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Popular tags */}
              {!value.trim() && popularTags.length > 0 && (
                <div>
                  <div className="px-4 py-2 text-xs text-gray-400 uppercase tracking-wide">
                    Popular Tags
                  </div>
                  <div className="p-4 flex flex-wrap gap-2">
                    {popularTags.map((tag) => (
                      <button
                        key={tag}
                        onClick={() => handleTagClick(tag)}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-gray-800 hover:bg-gray-700 rounded-full text-sm text-gray-300 transition-colors"
                      >
                        <Hash className="w-3 h-3" />
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Empty state */}
              {!value.trim() && recentSearches.length === 0 && popularTags.length === 0 && (
                <div className="p-6 text-center">
                  <Search className="w-8 h-8 text-gray-600 mx-auto mb-3" />
                  <p className="text-sm text-gray-400">
                    Start typing to search your thoughtmarks
                  </p>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}