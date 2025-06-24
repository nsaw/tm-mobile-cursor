import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { ArrowLeft, Sparkles, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BackButton } from "@/components/ui/BackButton";
import { InstantSearch } from "@/components/instant-search";
import { TagChip } from "@/components/ui/tag-chip";
import { ThoughtmarkCard } from "@/components/thoughtmark-card";
import { BottomNav } from "@/components/ui/bottom-nav";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { motion, AnimatePresence } from "framer-motion";
import type { ThoughtmarkWithBin } from "@shared/schema";
import { AiTooltip } from "@/components/ai-tooltip";
import { PremiumFeatureWrapper } from "@/components/premium-overlay";
import { useAuth } from "@/hooks/use-auth";

export default function SearchResults() {
  const [location, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [similarResults, setSimilarResults] = useState<(ThoughtmarkWithBin & { similarity: number })[]>([]);
  const [showSimilar, setShowSimilar] = useState(false);
  const { user } = useAuth();

  // Get initial search query from URL
  useEffect(() => {
    const urlParams = new URLSearchParams(location.split("?")[1] || "");
    const query = urlParams.get("q") || "";
    setSearchQuery(query);
  }, [location]);

  const { data: searchResults = [], isLoading } = useQuery<ThoughtmarkWithBin[]>({
    queryKey: ["/api/search", searchQuery, selectedTags],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (searchQuery) params.append("q", searchQuery);
      selectedTags.forEach(tag => params.append("tags", tag));
      
      const response = await apiRequest("GET", `/api/search?${params}`);
      return response.json();
    },
    enabled: !!(searchQuery || selectedTags.length > 0),
  });

  // Semantic search mutation
  const semanticSearchMutation = useMutation({
    mutationFn: async (query: string) => {
      const response = await apiRequest("POST", "/api/ai/similar", { query, limit: 5 });
      if (!response.ok) {
        throw new Error("Semantic search failed");
      }
      return response.json();
    },
    onSuccess: (data) => {
      setSimilarResults(data.results || []);
      setShowSimilar(true);
    },
    onError: () => {
      // Silently fail if AI is not available
      setSimilarResults([]);
      setShowSimilar(false);
    }
  });

  // Get unique tags from results
  const availableTags = Array.from(
    new Set(searchResults.flatMap(tm => tm.tags))
  ).sort();

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const handleSearch = (newQuery: string) => {
    console.log('Search handler called with:', newQuery);
    setSearchQuery(newQuery);
    if (newQuery.trim()) {
      const url = new URL(window.location.href);
      url.searchParams.set("q", newQuery);
      window.history.replaceState({}, "", url.toString());
      console.log('Updated URL with search query:', url.toString());
    }
  };

  return (
    <div className="max-w-md mx-auto bg-black full-height relative">
      <div className="p-6 pb-24">
        {/* Header */}
        <div className="flex items-center mb-6">
          <BackButton className="mr-3" />
          <div className="flex-1">
            <h1 className="text-xl font-bold text-white uppercase tracking-wide">SEARCH RESULTS</h1>
            <p className="text-sm text-gray-400">
              {isLoading 
                ? "Searching..." 
                : `${searchResults.length} results${searchQuery ? ` for "${searchQuery}"` : ""}`
              }
            </p>
          </div>
        </div>

        {/* Enhanced Search Bar */}
        <div className="mb-6">
          <InstantSearch
            value={searchQuery}
            onChange={handleSearch}
            placeholder="Search thoughtmarks..."
            autoFocus={true}
          />
          
          {/* AI Search Button with Premium Overlay */}
          {searchQuery && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <PremiumFeatureWrapper 
                  isPremium={Boolean(user?.isPremium || user?.isTestUser)}
                  feature="AI Search"
                  description="Find thoughtmarks by meaning and context, not just keywords"
                  overlaySize="sm"
                >
                  <Button
                    onClick={() => user?.isPremium || user?.isTestUser ? semanticSearchMutation.mutate(searchQuery) : setLocation("/subscribe")}
                    disabled={semanticSearchMutation.isPending}
                    variant="outline"
                    size="sm"
                    className="border-[#C6D600] text-[#C6D600] hover:bg-[#C6D600]/10"
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    {semanticSearchMutation.isPending ? "Finding..." : "AI Search"}
                  </Button>
                </PremiumFeatureWrapper>
                
                {showSimilar && (
                  <Button
                    onClick={() => setShowSimilar(false)}
                    variant="ghost"
                    size="sm"
                    className="text-gray-400 hover:text-white"
                  >
                    Show All Results
                  </Button>
                )}
              </div>
              
              <div className="text-xs text-gray-400">
                {searchResults.length} result{searchResults.length !== 1 ? 's' : ''}
              </div>
            </motion.div>
          )}
        </div>

        {/* Filter Tags */}
        {availableTags.length > 0 && (
          <div className="glass-surface p-4 mb-6">
            <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wide mb-3">FILTER BY TAGS</h3>
            <div className="flex flex-wrap gap-2">
              <TagChip
                tag="All"
                variant={selectedTags.length === 0 ? "primary" : "secondary"}
                onClick={() => setSelectedTags([])}
              />
              {availableTags.map((tag) => (
                <TagChip
                  key={tag}
                  tag={tag}
                  variant={selectedTags.includes(tag) ? "primary" : "secondary"}
                  onClick={() => toggleTag(tag)}
                />
              ))}
            </div>
          </div>
        )}

        {/* AI Similar Results */}
        {showSimilar && similarResults.length > 0 && (
          <div className="mb-6">
            <div className="glass-surface p-4">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-4 h-4 text-blue-400" />
                <h3 className="text-sm font-medium text-blue-300 uppercase tracking-wide">AI SIMILAR RESULTS</h3>
                <button
                  onClick={() => setShowSimilar(false)}
                  className="ml-auto text-xs text-gray-400 hover:text-white"
                >
                  HIDE
                </button>
              </div>
              <div className="space-y-3">
                {similarResults.map((thoughtmark) => (
                  <div key={`similar-${thoughtmark.id}`} className="relative">
                    <div className="absolute -left-2 top-3 w-1 h-6 bg-blue-400 rounded-full opacity-60"></div>
                    <div className="pl-4">
                      <ThoughtmarkCard
                        thoughtmark={thoughtmark}
                        onEdit={() => setLocation(`/edit/${thoughtmark.id}`)}
                      />
                      <div className="mt-2 text-xs text-blue-300">
                        {Math.round(thoughtmark.similarity * 100)}% similar
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Search Results */}
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              {[...Array(5)].map((_, i) => (
                <div key={i} className="bg-gray-800 p-4 rounded-xl h-32 animate-pulse" />
              ))}
            </motion.div>
          ) : showSimilar && similarResults.length > 0 ? (
            <motion.div
              key="similar"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-[#C6D600]" />
                <h3 className="text-lg font-medium text-white">Similar Thoughtmarks</h3>
              </div>
              {similarResults.map((result) => (
                <motion.div
                  key={result.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <ThoughtmarkCard
                    thoughtmark={result}
                    onEdit={() => setLocation(`/edit/${result.id}`)}
                    showSimilarity={true}
                    similarity={result.similarity}
                  />
                </motion.div>
              ))}
            </motion.div>
          ) : searchResults.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-12"
            >
              <Search className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">
                {searchQuery || selectedTags.length > 0 
                  ? "No thoughtmarks found"
                  : "Start searching"
                }
              </h3>
              <p className="text-gray-400 mb-6">
                {searchQuery || selectedTags.length > 0 
                  ? "Try different keywords or use AI search for semantic matching"
                  : "Search through your thoughtmarks to find ideas, insights, and connections"
                }
              </p>
              {(searchQuery || selectedTags.length > 0) && (
                <div className="space-y-3">
                  {searchQuery && (
                    <Button
                      onClick={() => semanticSearchMutation.mutate(searchQuery)}
                      disabled={semanticSearchMutation.isPending}
                      className="bg-[#C6D600] text-black hover:bg-[#B5C100]"
                    >
                      <Sparkles className="w-4 h-4 mr-2" />
                      Try AI Search
                    </Button>
                  )}
                  <Button
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedTags([]);
                    }}
                    variant="outline"
                    className="border-gray-600 text-gray-300 hover:bg-gray-800"
                  >
                    Clear Search
                  </Button>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              {searchResults.map((thoughtmark, index) => (
                <motion.div
                  key={thoughtmark.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <ThoughtmarkCard
                    thoughtmark={thoughtmark}
                    onEdit={() => setLocation(`/edit/${thoughtmark.id}`)}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <BottomNav onNavigate={setLocation} />
    </div>
  );
}
