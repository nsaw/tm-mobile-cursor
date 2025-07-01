import { useState } from "react";
import { useLocation } from "wouter";
import { DraggableBins } from "@/components/draggable-bins";
import { Button } from "@/components/ui/button";
import { useBins } from "@/hooks/use-bins";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useEnhancedScroll } from "@/hooks/use-enhanced-scroll";
import { Plus, Search } from "lucide-react";
import { PersistentLayout } from "@/components/persistent-layout";
import type { BinWithCount } from "@shared/schema";

export default function BinsIndex() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  
  const { data: bins = [], isLoading: binsLoading } = useBins();

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

  const handleBinClick = (bin: BinWithCount) => {
    setLocation(`/bins/${bin.id}`);
  };

  const reorderBinsMutation = useMutation({
    mutationFn: async (newOrder: number[]) => {
      const response = await apiRequest('POST', '/api/bins/reorder', { binIds: newOrder });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/bins'] });
      toast({
        title: "Bins reordered",
        description: "Your bin organization has been updated.",
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

  const handleBinsReorder = (reorderedBins: BinWithCount[]) => {
    const newOrder = reorderedBins.map(bin => bin.id);
    reorderBinsMutation.mutate(newOrder);
  };

  // Enhanced scroll with swipe gestures
  useEnhancedScroll();

  return (
    <PersistentLayout>
      <div className="max-w-4xl mx-auto p-6 pb-24">
        {/* Header */}
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">All Bins</h1>
            <p className="text-gray-400">
              AI suggests optimal bin order, but you can drag and drop to customize your organization.
            </p>
          </div>
          <Button
            onClick={() => setLocation('/create-bin')}
            className="bg-[#C6D600] hover:bg-[#B5C500] text-black font-medium flex-shrink-0"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Bin
          </Button>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search bins..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#C6D600] focus:border-transparent"
            />
          </div>
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
      </div>
    </PersistentLayout>
  );
}