import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link2, Sparkles, ArrowRight, Brain } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import type { ThoughtmarkWithBin } from "@shared/schema";

interface ThoughtConnectionsProps {
  thoughtmarkId: number;
  currentTags: string[];
  currentContent: string;
}

export function ThoughtConnections({ 
  thoughtmarkId, 
  currentTags, 
  currentContent 
}: ThoughtConnectionsProps) {
  const [, setLocation] = useLocation();
  const [showConnections, setShowConnections] = useState(false);

  // Find similar thoughtmarks based on tags and content
  const { data: connections = [], isLoading } = useQuery<ThoughtmarkWithBin[]>({
    queryKey: ["/api/ai/similar", thoughtmarkId, currentTags.join(",")],
    queryFn: async () => {
      const response = await apiRequest("POST", "/api/ai/similar", {
        query: currentContent.slice(0, 200), // First 200 chars
        tags: currentTags,
        excludeId: thoughtmarkId,
        limit: 5
      });
      return response.json().then(data => data.results || []);
    },
    enabled: currentTags.length > 0 || currentContent.length > 50,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  // Auto-show if we have good connections
  useEffect(() => {
    if (connections.length >= 2 && !showConnections) {
      setShowConnections(true);
    }
  }, [connections.length, showConnections]);

  if (!showConnections && connections.length === 0) return null;

  return (
    <Card className="bg-gradient-to-br from-purple-950/30 to-blue-950/30 border-purple-800/50">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-white">
          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-purple-400" />
            <span>Connected Thoughts</span>
            {connections.length > 0 && (
              <Badge variant="secondary" className="bg-purple-900/50 text-purple-300">
                {connections.length}
              </Badge>
            )}
          </div>
          {!showConnections && connections.length > 0 && (
            <Button
              onClick={() => setShowConnections(true)}
              variant="ghost"
              size="sm"
              className="text-purple-400 hover:text-purple-300"
            >
              <Sparkles className="w-4 h-4 mr-1" />
              Show
            </Button>
          )}
        </CardTitle>
      </CardHeader>

      <AnimatePresence>
        {showConnections && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <CardContent className="space-y-3">
              {isLoading ? (
                <div className="space-y-2">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-16 bg-gray-800 rounded-lg animate-pulse" />
                  ))}
                </div>
              ) : connections.length === 0 ? (
                <div className="text-center py-6">
                  <Link2 className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                  <p className="text-gray-400 text-sm">
                    No similar thoughts found yet. Add more content or tags to discover connections.
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {connections.map((connection, index) => (
                    <motion.div
                      key={connection.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      onClick={() => setLocation(`/thoughtmarks/${connection.id}`)}
                      className="group p-3 bg-gray-800/50 hover:bg-gray-800 rounded-lg cursor-pointer transition-all duration-200 border border-transparent hover:border-purple-700/50"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-white text-sm group-hover:text-purple-300 transition-colors line-clamp-1">
                            {connection.title}
                          </h4>
                          <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                            {connection.content}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-xs text-blue-400">
                              {connection.binName}
                            </span>
                            {connection.tags.slice(0, 2).map(tag => (
                              <Badge key={tag} variant="outline" className="text-xs h-5 px-1.5 border-gray-600 text-gray-400">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-purple-400 transition-colors ml-2 flex-shrink-0" />
                      </div>
                    </motion.div>
                  ))}
                  
                  <Button
                    onClick={() => setLocation(`/search?q=${encodeURIComponent(currentTags.join(" "))}`)}
                    variant="ghost"
                    size="sm"
                    className="w-full mt-3 text-purple-400 hover:text-purple-300 hover:bg-purple-900/20"
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    Explore more connections
                  </Button>
                </div>
              )}
            </CardContent>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}