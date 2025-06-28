import { useState, useMemo, useEffect } from "react";
import { useLocation } from "wouter";
import { Search, Filter, ChevronDown, ChevronUp, SortAsc, SortDesc, Calendar, Type, CheckSquare, Square, Archive, Trash2, MoreVertical, Undo2, Redo2, FolderOpen, ArrowLeft, Folder } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BackButton } from "@/components/ui/BackButton";
import { SearchBar } from "@/components/search-bar";
import { ThoughtmarkCard } from "@/components/thoughtmark-card";
import { useThoughtmarks } from "@/hooks/use-thoughtmarks";
import { useAuth } from "@/hooks/use-auth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useUndoRedo } from "@/hooks/use-undo-redo";
import { useBins } from "@/hooks/use-bins";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { PersistentLayout } from "@/components/persistent-layout";
import { useSwipeGestures } from "@/hooks/use-swipe-gestures";
import { ExampleDeletionPopup } from "@/components/example-deletion-popup";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function AllThoughtmarks() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { addAction, undo, redo, canUndo, canRedo, lastAction } = useUndoRedo();

  // Add swipe gestures for navigation
  const { swipeHandlers } = useSwipeGestures({
    onSwipeRight: () => setLocation('/'),
    onSwipeLeft: () => {
      // Swipe left could go to create page or other navigation
    }
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("date-desc");
  const [tagsExpanded, setTagsExpanded] = useState(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedBinId, setSelectedBinId] = useState<number | null>(null);
  const [filterType, setFilterType] = useState<string>("");
  const [filterBinName, setFilterBinName] = useState<string>("");
  const [showExampleDeletion, setShowExampleDeletion] = useState(false);
  const [hasVisitedAllThoughtmarks, setHasVisitedAllThoughtmarks] = useState(false);

  const { data: thoughtmarks = [], isLoading } = useThoughtmarks();
  const { data: bins = [] } = useBins();

  // Check URL parameters for filter and update when bins change
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const filter = urlParams.get('filter');
    const binName = urlParams.get('binName');
    
    console.log('All-thoughtmarks filter check:', { filter, binName, currentURL: window.location.search });
    
    if (filter === 'tasks') {
      console.log('Setting filter to tasks');
      setFilterType('tasks');
      setFilterBinName('');
    } else if (filter === 'bin' && binName) {
      const decodedBinName = decodeURIComponent(binName);
      console.log('Bin filter detected:', decodedBinName);
      
      // Only check bin existence if bins are loaded
      if (bins.length > 0) {
        const binExists = bins.some(bin => bin.name === decodedBinName);
        console.log('Bin exists:', binExists, 'Available bins:', bins.map(b => b.name));
        if (binExists) {
          setFilterType('bin');
          setFilterBinName(decodedBinName);
          console.log('Applied bin filter:', decodedBinName);
        } else {
          console.log('Bin not found, redirecting to all thoughtmarks');
          // If bin doesn't exist, redirect to all thoughtmarks
          setLocation('/thoughtmarks/all');
        }
      } else {
        // Bins not loaded yet, set filter anyway and let it apply when bins load
        console.log('Bins not loaded yet, applying filter anyway:', decodedBinName);
        setFilterType('bin');
        setFilterBinName(decodedBinName);
      }
    } else {
      console.log('No filter applied');
      setFilterType('');
      setFilterBinName('');
    }
  }, [window.location.search, bins, setLocation]);

  // Check for first visit and example thoughtmarks
  useEffect(() => {
    if (!user?.email) return;
    
    const isDemoUser = user?.email === 'hello@thoughtmarks.app' || user?.email === 'applereview@thoughtmarks.app' || user?.email === 'test@thoughtmarks.app' || user?.isTestUser;
    
    // For demo users, always show popup (reset on every login), for others check localStorage
    const hasVisited = isDemoUser ? false : localStorage.getItem('hasVisitedAllThoughtmarks');
    
    if (!hasVisited && thoughtmarks.length > 0) {
      // Count example thoughtmarks
      const exampleThoughtmarks = thoughtmarks.filter(tm => {
        // Check if it's in the Examples bin
        const isInExamplesBin = tm.binName === 'Examples';
        
        // Check if content contains example indicators
        const hasExampleContent = tm.content.includes('*example') || 
                                  tm.title.includes('*example') ||
                                  tm.content.includes('Sample thoughtmark') ||
                                  tm.title.includes('Morning routine optimization') ||
                                  tm.title.includes('User feedback implementation') ||
                                  tm.title.includes('Funny office conversation') ||
                                  tm.title.includes('Weekend camping gear') ||
                                  tm.title.includes('Flow State Triggers') ||
                                  tm.title.includes('Book recommendation') ||
                                  tm.title.includes('AI Innovation Ideas') ||
                                  tm.title.includes('Creative Awareness') ||
                                  tm.title.includes('The Compound Effect');
        
        return isInExamplesBin || hasExampleContent;
      });

      if (exampleThoughtmarks.length > 0) {
        setShowExampleDeletion(true);
      }
      
      // Mark as visited (for non-demo users only)
      if (!isDemoUser) {
        localStorage.setItem('hasVisitedAllThoughtmarks', 'true');
      }
      setHasVisitedAllThoughtmarks(true);
    }
  }, [thoughtmarks, user]);

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest("DELETE", `/api/thoughtmarks/${id}`);
      if (!response.ok) {
        throw new Error("Failed to delete thoughtmark");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/thoughtmarks"] });
      queryClient.invalidateQueries({ queryKey: ["/api/bins"] });
      toast({
        title: "Success",
        description: "Thoughtmark deleted successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete thoughtmark",
        variant: "destructive",
      });
    },
  });

  // Archive mutation
  const archiveMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest("POST", `/api/thoughtmarks/${id}/archive`);
      if (!response.ok) {
        throw new Error("Failed to archive thoughtmark");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/thoughtmarks"] });
      queryClient.invalidateQueries({ queryKey: ["/api/bins"] });
      toast({
        title: "Success",
        description: "Thoughtmark archived successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to archive thoughtmark",
        variant: "destructive",
      });
    },
  });

  // Bulk operations
  const bulkArchiveMutation = useMutation({
    mutationFn: async (ids: number[]) => {
      const promises = ids.map(id => apiRequest("POST", `/api/thoughtmarks/${id}/archive`));
      const responses = await Promise.all(promises);
      const failed = responses.filter(r => !r.ok);
      if (failed.length > 0) throw new Error(`Failed to archive ${failed.length} thoughtmarks`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/thoughtmarks"] });
      queryClient.invalidateQueries({ queryKey: ["/api/bins"] });
      setSelectedIds([]);
      setShowBulkActions(false);
      toast({
        title: "Success",
        description: `${selectedIds.length} thoughtmarks archived successfully`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const bulkDeleteMutation = useMutation({
    mutationFn: async (ids: number[]) => {
      // Store thoughtmarks for undo before deletion
      const thoughtmarksToDelete = thoughtmarks.filter(t => ids.includes(t.id));
      
      const promises = ids.map(id => apiRequest("DELETE", `/api/thoughtmarks/${id}`));
      const responses = await Promise.all(promises);
      const failed = responses.filter(r => !r.ok);
      if (failed.length > 0) throw new Error(`Failed to delete ${failed.length} thoughtmarks`);
      
      // Add to undo stack
      addAction({
        type: 'bulk_delete',
        description: `Delete ${ids.length} thoughtmarks`,
        data: { ids, thoughtmarks: thoughtmarksToDelete }
      });
      
      return thoughtmarksToDelete;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/thoughtmarks"] });
      queryClient.invalidateQueries({ queryKey: ["/api/bins"] });
      setSelectedIds([]);
      setShowBulkActions(false);
      setShowDeleteConfirm(false);
      toast({
        title: "Success",
        description: `${selectedIds.length} thoughtmarks deleted successfully`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Bulk move mutation
  const bulkMoveMutation = useMutation({
    mutationFn: async ({ ids, binId }: { ids: number[], binId: number | null }) => {
      const thoughtmarksToMove = thoughtmarks.filter(t => ids.includes(t.id));
      const originalBins = thoughtmarksToMove.map(t => ({ id: t.id, originalBinId: t.binId }));
      
      const promises = ids.map(id => apiRequest("PATCH", `/api/thoughtmarks/${id}`, { binId }));
      const responses = await Promise.all(promises);
      const failed = responses.filter(r => !r.ok);
      if (failed.length > 0) throw new Error(`Failed to move ${failed.length} thoughtmarks`);
      
      // Add to undo stack
      addAction({
        type: 'move',
        description: `Move ${ids.length} thoughtmarks`,
        data: { ids, newBinId: binId, originalBins }
      });
      
      return thoughtmarksToMove;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/thoughtmarks"] });
      queryClient.invalidateQueries({ queryKey: ["/api/bins"] });
      setSelectedIds([]);
      setShowBulkActions(false);
      setSelectedBinId(null);
      toast({
        title: "Success",
        description: `${selectedIds.length} thoughtmarks moved successfully`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Filter, search, and sort thoughtmarks
  const filteredAndSortedThoughtmarks = useMemo(() => {
    let filtered = thoughtmarks.filter(thoughtmark => {
      const matchesSearch = searchQuery === "" || 
        thoughtmark.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        thoughtmark.content.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesTag = selectedTag === "" || 
        thoughtmark.tags.includes(selectedTag);
      
      let matchesFilter = true;
      if (filterType === "tasks") {
        matchesFilter = Boolean(thoughtmark.isTask);
      } else if (filterType === "bin" && filterBinName) {
        const targetBin = bins.find(bin => bin.name === filterBinName);
        if (targetBin) {
          matchesFilter = thoughtmark.binId === targetBin.id;
        } else {
          // Handle special case for "Sort Later" - thoughtmarks without bins
          if (filterBinName === "Sort Later") {
            matchesFilter = thoughtmark.binId === null;
          } else {
            matchesFilter = false;
          }
        }
      } else if (filterType === "") {
        // No filter applied - show all thoughtmarks
        matchesFilter = true;
      }
      
      return matchesSearch && matchesTag && matchesFilter && !thoughtmark.isDeleted;
    });

    // Sort thoughtmarks based on selected option
    return filtered.sort((a, b) => {
      // First sort by pinned status (pinned items always first)
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      
      // Then sort by selected option
      switch (sortBy) {
        case "date-desc":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case "date-asc":
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case "title-asc":
          return a.title.localeCompare(b.title);
        case "title-desc":
          return b.title.localeCompare(a.title);
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });
  }, [thoughtmarks, searchQuery, selectedTag, sortBy, filterType, filterBinName, bins]);

  // Get all unique tags
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    thoughtmarks.forEach(thoughtmark => {
      thoughtmark.tags.forEach(tag => tags.add(tag));
    });
    return Array.from(tags);
  }, [thoughtmarks]);

  // Bulk selection helpers
  const toggleSelection = (id: number) => {
    setSelectedIds(prev => 
      prev.includes(id) 
        ? prev.filter(selectedId => selectedId !== id)
        : [...prev, id]
    );
  };

  const toggleBulkActions = () => {
    setShowBulkActions(!showBulkActions);
    setSelectedIds([]);
  };

  const selectAll = () => {
    setSelectedIds(filteredAndSortedThoughtmarks.map(tm => tm.id));
  };

  const deselectAll = () => {
    setSelectedIds([]);
  };

  const handleBulkArchive = () => {
    bulkArchiveMutation.mutate(selectedIds);
  };

  const handleBulkDelete = () => {
    setShowDeleteConfirm(true);
  };

  const confirmBulkDelete = () => {
    bulkDeleteMutation.mutate(selectedIds);
  };

  // Calculate example thoughtmarks count for popup
  const exampleCount = useMemo(() => {
    return thoughtmarks.filter(tm => {
      // Check if it's in the Examples bin
      const isInExamplesBin = tm.binName === 'Examples';
      
      // Check if content contains example indicators
      const hasExampleContent = tm.content.includes('*example') || 
                                tm.title.includes('*example') ||
                                tm.content.includes('Sample thoughtmark') ||
                                tm.title.includes('Morning routine optimization') ||
                                tm.title.includes('User feedback implementation') ||
                                tm.title.includes('Funny office conversation') ||
                                tm.title.includes('Weekend camping gear') ||
                                tm.title.includes('Flow State Triggers') ||
                                tm.title.includes('Book recommendation') ||
                                tm.title.includes('AI Innovation Ideas') ||
                                tm.title.includes('Creative Awareness') ||
                                tm.title.includes('The Compound Effect');
      
      return isInExamplesBin || hasExampleContent;
    }).length;
  }, [thoughtmarks]);

  if (!user) {
    return (
      <PersistentLayout>
        <div className="max-w-md mx-auto text-center py-12">
          <p className="text-gray-400">Please sign in to view your thoughtmarks</p>
        </div>
      </PersistentLayout>
    );
  }

  return (
    <PersistentLayout>
      <div className="max-w-md mx-auto px-4 py-8" {...swipeHandlers}>
        {/* Header with Back Button */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <BackButton />
            <h1 className="text-2xl text-white uppercase flex-1" style={{ fontFamily: 'Oswald, sans-serif', fontWeight: '600', letterSpacing: '-0.02em' }}>
              {filterType === 'tasks' ? 'ALL TASKS' : 
               filterType === 'bin' ? `${filterBinName.toUpperCase()} BIN` : 
               'ALL THOUGHTMARKS'}
            </h1>
          </div>
          <p className="text-gray-400">
            {filterType === 'tasks' ? 'Browse and manage your tasks' : 
             filterType === 'bin' ? `Browse and manage thoughtmarks in ${filterBinName}` :
             'Browse and manage your ideas'}
          </p>
          {(filterType === 'tasks' || filterType === 'bin') && (
            <div className="mt-2">
              <Badge variant="secondary" className="bg-blue-900/30 text-blue-200 border-blue-500/30">
                {filterType === 'tasks' ? 'Showing Tasks Only' : `Showing ${filterBinName} Only`}
              </Badge>
            </div>
          )}
        </div>

        {/* Header Actions */}
        <div className="flex items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-semibold text-white uppercase tracking-wide">YOUR COLLECTION</h2>
          </div>
          
          {/* Hamburger Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                <MoreVertical className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-gray-900 border-gray-700">
              <DropdownMenuItem 
                onClick={() => setShowBulkActions(!showBulkActions)}
                className="text-gray-300 hover:text-white hover:bg-gray-700 focus:bg-gray-700 focus:text-white"
              >
                <CheckSquare className="mr-2 h-4 w-4" />
                {showBulkActions ? "Exit Selection" : "Select Multiple"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Undo/Redo Toolbar */}
        {(canUndo || canRedo) && (
          <div className="mb-4 p-3 bg-gray-900 rounded-lg border border-gray-700 animate-slide-down">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-400">
                  {lastAction && `Last: ${lastAction.description}`}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={undo}
                  disabled={!canUndo}
                  className="text-gray-400 hover:text-white disabled:opacity-50"
                >
                  <Undo2 className="w-4 h-4 mr-1" />
                  Undo
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={redo}
                  disabled={!canRedo}
                  className="text-gray-400 hover:text-white disabled:opacity-50"
                >
                  <Redo2 className="w-4 h-4 mr-1" />
                  Redo
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Bulk Actions Toolbar */}
        {showBulkActions && (
          <div className="glass-surface mb-4 animate-slide-down border-blue-500/30">
            <div className="card-content">
              <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-blue-200">
                  {selectedIds.length > 0 ? `${selectedIds.length} selected` : "Select thoughtmarks"}
                </span>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      if (selectedIds.length === filteredAndSortedThoughtmarks.length) {
                        setSelectedIds([]);
                      } else {
                        setSelectedIds(filteredAndSortedThoughtmarks.map(t => t.id));
                      }
                    }}
                    className="text-blue-200 hover:text-white text-xs"
                  >
                    {selectedIds.length === filteredAndSortedThoughtmarks.length ? "Deselect All" : "Select All"}
                  </Button>
                </div>
              </div>
              
              {selectedIds.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => bulkArchiveMutation.mutate(selectedIds)}
                    disabled={bulkArchiveMutation.isPending}
                    className="text-yellow-200 hover:text-white hover:bg-yellow-600/20"
                  >
                    <Archive className="w-4 h-4 mr-1" />
                    Archive
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleBulkDelete}
                    disabled={bulkDeleteMutation.isPending}
                    className="text-red-200 hover:text-white hover:bg-red-600/20"
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Delete
                  </Button>
                  
                  {/* Bulk Move to Bin */}
                  <div className="flex items-center gap-2">
                    <Select value={selectedBinId?.toString() || ""} onValueChange={(value) => {
                      const binId = value === "none" ? null : parseInt(value, 10);
                      setSelectedBinId(binId);
                    }}>
                      <SelectTrigger className="w-32 h-8 bg-gray-800 border-gray-600 text-xs">
                        <SelectValue placeholder="Move to..." />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-600">
                        <SelectItem value="none">No Bin</SelectItem>
                        {bins.map(bin => (
                          <SelectItem key={bin.id} value={bin.id.toString()}>
                            {bin.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    {selectedBinId !== null && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => bulkMoveMutation.mutate({ ids: selectedIds, binId: selectedBinId })}
                        disabled={bulkMoveMutation.isPending}
                        className="text-green-200 hover:text-white hover:bg-green-600/20"
                      >
                        <FolderOpen className="w-4 h-4 mr-1" />
                        Move
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </div>
            </div>
          </div>
        )}

        <div className="space-y-4">
        {/* Stats Box */}
        <div className="glass-surface p-4 mb-4">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-lg font-semibold text-white">{thoughtmarks.length}</div>
              <div className="text-xs text-gray-400 uppercase tracking-wide">TOTAL THOUGHTMARKS</div>
            </div>
            <div>
              <div className="text-lg font-semibold text-white">{allTags.length}</div>
              <div className="text-xs text-gray-400 uppercase tracking-wide">UNIQUE TAGS</div>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search all thoughtmarks..."
        />

        {/* Filtering and Sorting Options */}
        <div className="glass-surface p-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wide">FILTERS & SORTING</h3>
              <div className="text-sm text-gray-400">
                {filteredAndSortedThoughtmarks.length} thoughtmarks
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Collection Filter */}
              <div className="space-y-2">
                <label className="text-xs text-gray-400 uppercase tracking-wide">COLLECTION</label>
                <select 
                  value={filterType === 'bin' ? filterBinName : filterType === 'tasks' ? 'tasks' : 'all'} 
                  onChange={(e) => {
                    try {
                      const value = e.target.value;
                      console.log('Dropdown value changed to:', value);
                      console.log('Current filterType:', filterType, 'filterBinName:', filterBinName);
                      
                      if (value === 'all') {
                        console.log('Setting filter to all');
                        setFilterType('');
                        setFilterBinName('');
                        setLocation('/thoughtmarks/all');
                      } else if (value === 'tasks') {
                        console.log('Setting filter to tasks');
                        setFilterType('tasks');
                        setFilterBinName('');
                        setLocation('/thoughtmarks/all?filter=tasks');
                      } else {
                        console.log('Setting bin filter to:', value);
                        setFilterType('bin');
                        setFilterBinName(value);
                        setLocation(`/thoughtmarks/all?filter=bin&binName=${encodeURIComponent(value)}`);
                      }
                    } catch (error) {
                      console.error('Error in dropdown onChange:', error);
                    }
                  }}
                  className="w-full h-10 bg-gray-800/50 border border-gray-600/50 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500 backdrop-blur-sm"
                >
                  <option value="all">ALL THOUGHTMARKS</option>
                  <option value="tasks">TASKS ONLY</option>
                  {bins
                    .filter((bin) => bin && bin.name)
                    .sort((a, b) => a.name.localeCompare(b.name))
                    .map((bin) => (
                    <option key={bin.id} value={bin.name}>
                      {bin.name.toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort By */}
              <div className="space-y-2">
                <label className="text-xs text-gray-400 uppercase tracking-wide">SORT BY</label>
                <select 
                  value={sortBy} 
                  onChange={(e) => {
                    try {
                      console.log('Sort dropdown value changed to:', e.target.value);
                      setSortBy(e.target.value);
                    } catch (error) {
                      console.error('Error in sort dropdown onChange:', error);
                    }
                  }}
                  className="w-full h-10 bg-gray-800/50 border border-gray-600/50 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500 backdrop-blur-sm"
                >
                  <option value="date-desc">NEWEST FIRST</option>
                  <option value="date-asc">OLDEST FIRST</option>
                  <option value="title-asc">A-Z</option>
                  <option value="title-desc">Z-A</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Collapsible Filter by Tags */}
        {allTags.length > 0 && (
          <Collapsible open={tagsExpanded} onOpenChange={setTagsExpanded}>
            <CollapsibleTrigger asChild>
              <Button variant="outline" className="w-full justify-between bg-gray-800 border-gray-600 hover:bg-gray-700">
                <span className="flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  Filter by Tags
                  {selectedTag && (
                    <Badge variant="secondary" className="ml-2">
                      {selectedTag}
                    </Badge>
                  )}
                </span>
                {tagsExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-3 pt-3">
              <div className="flex flex-wrap gap-2">
                <Badge
                  variant={selectedTag === "" ? "default" : "outline"}
                  className="cursor-pointer hover:bg-primary/20"
                  onClick={() => setSelectedTag("")}
                >
                  All Tags
                </Badge>
                {allTags.map(tag => (
                  <Badge
                    key={tag}
                    variant={selectedTag === tag ? "default" : "outline"}
                    className="cursor-pointer hover:bg-primary/20"
                    onClick={() => setSelectedTag(tag)}
                  >
                    #{tag}
                  </Badge>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>
        )}

        {/* Bulk Actions Controls */}
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            onClick={toggleBulkActions}
            className="border-gray-600 text-gray-300 hover:text-white"
          >
            {showBulkActions ? "Cancel" : "Select Multiple"}
          </Button>

          {showBulkActions && selectedIds.length > 0 && (
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleBulkArchive}
                disabled={bulkArchiveMutation.isPending}
                className="border-orange-600 text-orange-400 hover:text-orange-300"
              >
                <Archive className="w-4 h-4 mr-1" />
                Archive ({selectedIds.length})
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleBulkDelete}
                disabled={bulkDeleteMutation.isPending}
                className="border-red-600 text-red-400 hover:text-red-300"
              >
                <Trash2 className="w-4 h-4 mr-1" />
                Delete ({selectedIds.length})
              </Button>
            </div>
          )}
        </div>

        {showBulkActions && (
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={selectAll}
              className="text-gray-400 hover:text-white"
            >
              Select All
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={deselectAll}
              className="text-gray-400 hover:text-white"
            >
              Deselect All
            </Button>
          </div>
        )}

        {/* Thoughtmarks List */}
        <div className="space-y-3">
          {isLoading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-32 bg-gray-800 rounded-lg animate-pulse" />
            ))
          ) : filteredAndSortedThoughtmarks.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400 mb-4">
                {searchQuery || selectedTag ? "No thoughtmarks match your filters" : "No thoughtmarks yet"}
              </p>
              <Button 
                onClick={() => setLocation("/thoughtmarks/create")}
                className="bg-[#C6D600] hover:bg-[#B5C100] text-black"
              >
                Create Your First Thoughtmark
              </Button>
            </div>
          ) : (
            filteredAndSortedThoughtmarks.map((thoughtmark) => (
              <ThoughtmarkCard
                key={thoughtmark.id}
                thoughtmark={thoughtmark}
                onEdit={() => setLocation(`/thoughtmarks/${thoughtmark.id}/edit`)}
                onDelete={() => deleteMutation.mutate(thoughtmark.id)}
                onArchive={() => archiveMutation.mutate(thoughtmark.id)}
                onClick={() => setLocation(`/thoughtmarks/${thoughtmark.id}`)}
                enableSwipeDelete={!showBulkActions}
                isSelectable={showBulkActions}
                isSelected={selectedIds.includes(thoughtmark.id)}
                onSelectionToggle={(id) => {
                  if (selectedIds.includes(id)) {
                    setSelectedIds(prev => prev.filter(selectedId => selectedId !== id));
                  } else {
                    setSelectedIds(prev => [...prev, id]);
                  }
                }}
              />
            ))
          )}
        </div>

        {/* Quick Stats */}
        {thoughtmarks.length > 0 && (
          <div className="mt-8 bg-gray-900 rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-3 text-[#C6D600]">Quick Stats</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-400">Total Thoughtmarks</p>
                <p className="text-xl font-bold">{thoughtmarks.filter(t => !t.isDeleted).length}</p>
              </div>
              <div>
                <p className="text-gray-400">Total Tags</p>
                <p className="text-xl font-bold">{allTags.length}</p>
              </div>
            </div>
          </div>
        )}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent className="bg-gray-900 border-gray-700">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Delete Thoughtmarks</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              Are you sure you want to delete {selectedIds.length} thoughtmark{selectedIds.length !== 1 ? 's' : ''}? 
              This will move them to recently deleted where they can be restored for 30 days.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-gray-600 text-gray-300 hover:text-white">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmBulkDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
              disabled={bulkDeleteMutation.isPending}
            >
              {bulkDeleteMutation.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Example Deletion Popup */}
      <ExampleDeletionPopup
        isOpen={showExampleDeletion}
        onClose={() => setShowExampleDeletion(false)}
        exampleCount={exampleCount}
      />
    </PersistentLayout>
  );
}