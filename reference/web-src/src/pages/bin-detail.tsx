import { useParams, useLocation } from "wouter";
import { useState } from "react";
import { MoreHorizontal, Edit2, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageLayout } from "@/components/page-layout";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ThoughtmarkCard } from "@/components/thoughtmark-card";
import { FloatingButton } from "@/components/ui/floating-button";
import { BottomNav } from "@/components/ui/bottom-nav";
import { useBins } from "@/hooks/use-bins";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { ThoughtmarkWithBin } from "@shared/schema";

export default function BinDetail() {
  const params = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const [sortBy, setSortBy] = useState("recent");
  const [filterTag, setFilterTag] = useState("all");
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const binId = parseInt(params.id!);
  const { data: bins = [] } = useBins();
  
  // Get bin from API directly if not found in bins array
  const { data: directBin } = useQuery({
    queryKey: [`/api/bins/${binId}`],
    enabled: !bins.find(bin => bin.id === binId) && !!binId,
  });
  
  const currentBin = bins.find(bin => bin.id === binId) || directBin;
  
  // Add thoughtmarkCount to direct bin if missing
  const binWithCount = currentBin ? {
    ...currentBin,
    thoughtmarkCount: currentBin.thoughtmarkCount ?? 0
  } : null;

  const renameBinMutation = useMutation({
    mutationFn: async (newName: string) => {
      const response = await apiRequest("PATCH", `/api/bins/${binId}`, { name: newName });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/bins"] });
      queryClient.invalidateQueries({ queryKey: [`/api/bins/${binId}`] });
      setIsEditing(false);
      toast({
        title: "Bin renamed",
        description: "The bin name has been updated successfully.",
      });
    },
    onError: (error: any) => {
      console.error('Rename error:', error);
      toast({
        title: "Error",
        description: "Failed to rename bin. Please try again.",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (thoughtmarkId: number) => {
      const response = await apiRequest("DELETE", `/api/thoughtmarks/${thoughtmarkId}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/thoughtmarks/bin", binId] });
      queryClient.invalidateQueries({ queryKey: ["/api/thoughtmarks"] });
      queryClient.invalidateQueries({ queryKey: ["/api/bins"] });
      toast({
        title: "Success",
        description: "Thoughtmark deleted successfully!",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete thoughtmark. Please try again.",
        variant: "destructive",
      });
    },
  });

  const { data: thoughtmarks = [], isLoading } = useQuery<ThoughtmarkWithBin[]>({
    queryKey: ["/api/thoughtmarks/bin", binId],
    queryFn: async () => {
      const response = await apiRequest("GET", `/api/thoughtmarks/bin/${binId}`);
      return response.json();
    },
    enabled: !!binId,
  });

  // Get unique tags from thoughtmarks
  const availableTags = Array.from(
    new Set(thoughtmarks.flatMap(tm => tm.tags))
  ).sort();

  const handleStartEdit = () => {
    setEditName(binWithCount?.name || "");
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    if (editName.trim() && editName !== binWithCount?.name) {
      renameBinMutation.mutate(editName.trim());
    } else {
      setIsEditing(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditName("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSaveEdit();
    } else if (e.key === 'Escape') {
      handleCancelEdit();
    }
  };

  // Filter and sort thoughtmarks
  let filteredThoughtmarks = thoughtmarks;
  if (filterTag !== "all") {
    filteredThoughtmarks = thoughtmarks.filter(tm => tm.tags.includes(filterTag));
  }

  switch (sortBy) {
    case "oldest":
      filteredThoughtmarks.sort((a, b) => 
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
      break;
    case "alphabetical":
      filteredThoughtmarks.sort((a, b) => a.title.localeCompare(b.title));
      break;
    default: // recent
      filteredThoughtmarks.sort((a, b) => 
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );
  }

  if (!binWithCount) {
    return (
      <div className="max-w-md mx-auto bg-black full-height flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400 mb-4">BIN NOT FOUND</p>
          <p className="text-gray-500 text-sm mb-4">The bin "{binId}" could not be found</p>
          <Button onClick={() => setLocation("/")} className="bg-[#C6D600] hover:bg-[#B5C100] text-black">
            Go Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="full-height bg-black text-white">
      {/* Custom Header with Editable Title */}
      <div className="flex items-center justify-between p-4 border-b border-gray-800">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setLocation("/")}
          className="text-gray-400 hover:text-white"
        >
          ← Back
        </Button>
        
        <div className="flex items-center space-x-2 flex-1 max-w-xs">
          {isEditing ? (
            <div className="flex items-center space-x-2 w-full">
              <Input
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                onKeyDown={handleKeyPress}
                className="bg-gray-800 border-gray-600 text-white text-center font-semibold"
                autoFocus
              />
              <Button
                size="sm"
                onClick={handleSaveEdit}
                disabled={renameBinMutation.isPending || !editName.trim()}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Check className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={handleCancelEdit}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <h1 className="text-lg font-semibold text-white text-center">
                {binWithCount.name}
              </h1>
              <Button
                size="sm"
                variant="ghost"
                onClick={handleStartEdit}
                className="text-gray-400 hover:text-white"
              >
                <Edit2 className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setLocation("/thoughtmarks/create")}
          className="text-blue-400 hover:text-blue-300"
        >
          + New
        </Button>
      </div>

      {/* Content */}
      <div className="max-w-md mx-auto p-6 pb-24">
        <div className="mb-6">
          <p className="text-sm text-gray-400">
            {binWithCount.thoughtmarkCount} thoughtmarks
          </p>
        </div>

        {/* Filter & Sort */}
        <div className="flex items-center space-x-3 mb-6">
          <Select value={filterTag} onValueChange={setFilterTag}>
            <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
              <SelectValue placeholder="All Tags" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Tags</SelectItem>
              {availableTags.map(tag => (
                <SelectItem key={tag} value={tag}>{tag}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Recently Added</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="alphabetical">Alphabetical</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Thoughtmarks List */}
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-gray-800 p-4 rounded-xl h-32 animate-pulse" />
            ))}
          </div>
        ) : filteredThoughtmarks.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-400 mb-4">
              {filterTag === "all" ? "No thoughtmarks in this bin yet" : `No thoughtmarks with "${filterTag}" tag`}
            </p>
            <Button
              onClick={() => setLocation("/thoughtmarks/create")}
              className="bg-[#C6D600] hover:bg-[#B5C100] text-black"
            >
              Add Thoughtmark
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredThoughtmarks.map((thoughtmark) => (
              <ThoughtmarkCard
                key={thoughtmark.id}
                thoughtmark={thoughtmark}
                onClick={() => setLocation(`/thoughtmarks/${thoughtmark.id}`)}
                onEdit={() => setLocation(`/thoughtmarks/${thoughtmark.id}/edit`)}
                onDelete={() => deleteMutation.mutate(thoughtmark.id)}
                enableSwipeDelete={true}
              />
            ))}
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <BottomNav onNavigate={(path) => setLocation(path)} />
      
      {/* Floating Add Button */}
      <FloatingButton onClick={() => setLocation("/thoughtmarks/create")} />
    </div>
  );
}
