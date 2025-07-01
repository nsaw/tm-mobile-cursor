import { useState } from "react";
import { useLocation } from "wouter";
import { DraggableBins } from "@/components/draggable-bins";
import { Button } from "@/components/ui/button";
import { BinsBackButton } from "@/components/ui/BackButton";
import { Card, CardContent } from "@/components/ui/card";
import { useBins } from "@/hooks/use-bins";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useSwipeGestures } from "@/hooks/use-swipe-gestures";
import { Plus, FolderOpen, Grid3X3, Search, Filter, MoreHorizontal, ArrowLeft } from "lucide-react";
import { PersistentLayout } from "@/components/persistent-layout";
import type { BinWithCount } from "@shared/schema";

export default function AllBins() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  
  const { data: bins = [], isLoading: binsLoading } = useBins();

  // Add swipe gestures for navigation
  const { swipeHandlers } = useSwipeGestures({
    onSwipeRight: () => setLocation('/'),
    onSwipeLeft: () => {
      // Swipe left could go to create page or other navigation
    }
  });

  // Define suggested bin order (user can modify these)
  const suggestedBinOrder = [
    'Relevant', 'Life Hacks', 'Quotes', 'Inspiration', 'Circle Back', 
    'Revelations', 'Funny', 'Stories', 'Half-Baked', 'Team-Up', 'Newsworthy',
    'Examples', 'Tasks'
  ];

  // Filter bins based on search query
  const filteredBins = bins.filter(bin => 
    bin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (bin.description && bin.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Sort bins with AI-suggested order first, then alphabetically for others
  const sortedBins = [...filteredBins].sort((a, b) => {
    const aIndex = suggestedBinOrder.indexOf(a.name);
    const bIndex = suggestedBinOrder.indexOf(b.name);
    
    // If both bins are in suggested order, sort by position
    if (aIndex !== -1 && bIndex !== -1) {
      return aIndex - bIndex;
    }
    
    // If only one is in suggested order, prioritize it
    if (aIndex !== -1) return -1;
    if (bIndex !== -1) return 1;
    
    // For other bins, sort alphabetically
    return a.name.localeCompare(b.name);
  });

  // Bin reordering mutation
  const reorderBinsMutation = useMutation({
    mutationFn: async (newOrder: BinWithCount[]) => {
      const updates = newOrder.map((bin, index) => ({
        id: bin.id,
        order: index
      }));
      return apiRequest("PATCH", "/api/bins/reorder", { updates });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/bins"] });
      toast({
        title: "Bins reordered",
        description: "Your bin order has been updated successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to reorder bins. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Handle bin reordering (all bins can be reordered)
  const handleBinsReorder = (newOrder: BinWithCount[]) => {
    reorderBinsMutation.mutate(newOrder);
  };

  // Handle bin click navigation
  const handleBinClick = (bin: BinWithCount) => {
    setLocation(`/bins/${bin.id}`);
  };

  return (
    <PersistentLayout>
      <div className="max-w-md mx-auto px-4 py-8" {...swipeHandlers}>
        {/* Header with Back Button */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <BinsBackButton />
            <h1 className="text-2xl text-white uppercase tracking-wide flex-1" style={{ fontFamily: 'Oswald, sans-serif', fontWeight: '600', letterSpacing: '-0.02em' }}>
              ALL BINS
            </h1>
          </div>
          <p className="text-gray-400">Organize your thoughtmarks into bins</p>
        </div>

        {/* Enhanced Search and Controls */}
        <div className="glass-surface p-4 mb-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wide">SEARCH & VIEW</h3>
              <div className="text-sm text-gray-400">
                {sortedBins.length} bins {searchQuery && `(filtered)`}
              </div>
            </div>
            
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search bins..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#C6D600] transition-colors backdrop-blur-sm"
              />
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center space-x-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="p-2"
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="p-2"
              >
                <FolderOpen className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="glass-surface p-4 mb-6">
          <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wide mb-2">ORGANIZATION</h3>
          <p className="text-sm text-gray-400">
            AI suggests optimal bin order, but you can drag and drop to customize your organization.
          </p>
        </div>

        {/* Bins Grid with Drag and Drop */}
        <div className="mb-4">
          {binsLoading ? (
            <div className="grid grid-cols-3 gap-3">
              {[...Array(9)].map((_, i) => (
                <div key={i} className="h-20 bg-gray-800 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : (
            <DraggableBins
              bins={sortedBins}
              onBinClick={handleBinClick}
              onBinsReorder={handleBinsReorder}
            />
          )}
        </div>

        {/* Create New Bin Button */}
        <Button
          onClick={() => setLocation('/create-bin')}
          className="w-full bg-[#C6D600] hover:bg-[#B5C500] text-black font-medium"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create New Bin
        </Button>
      </div>
    </PersistentLayout>
  );
}