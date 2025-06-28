import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { ThoughtmarkCard } from "@/components/thoughtmark-card";
import { Button } from "@/components/ui/button";
import { ContentBackButton } from "@/components/ui/BackButton";
import { Input } from "@/components/ui/input";
import { Search, Trash2, Undo2, CheckSquare, Square } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { ThoughtmarkWithBin } from "@shared/schema";
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

export default function Archive() {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: archivedThoughtmarks = [], isLoading } = useQuery({
    queryKey: ["/api/thoughtmarks/archived"],
    queryFn: () => apiRequest("GET", "/api/thoughtmarks/archived").then(res => res.json() as Promise<ThoughtmarkWithBin[]>)
  });

  const restoreThoughtmarkMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest("POST", `/api/thoughtmarks/${id}/restore`);
      if (!response.ok) throw new Error("Failed to restore thoughtmark");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/thoughtmarks/archived"] });
      queryClient.invalidateQueries({ queryKey: ["/api/thoughtmarks"] });
      toast({
        title: "Thoughtmark restored",
        description: "The thoughtmark has been restored successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to restore thoughtmark.",
        variant: "destructive",
      });
    }
  });

  const deleteThoughtmarkMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest("DELETE", `/api/thoughtmarks/${id}/permanent`);
      if (!response.ok) throw new Error("Failed to delete thoughtmark permanently");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/thoughtmarks/archived"] });
      toast({
        title: "Thoughtmark deleted",
        description: "The thoughtmark has been permanently deleted.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete thoughtmark permanently.",
        variant: "destructive",
      });
    }
  });

  const bulkRestoreMutation = useMutation({
    mutationFn: async (ids: number[]) => {
      const promises = ids.map(id => apiRequest("POST", `/api/thoughtmarks/${id}/restore`));
      const responses = await Promise.all(promises);
      const failed = responses.filter(r => !r.ok);
      if (failed.length > 0) throw new Error(`Failed to restore ${failed.length} thoughtmarks`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/thoughtmarks/archived"] });
      queryClient.invalidateQueries({ queryKey: ["/api/thoughtmarks"] });
      setSelectedIds([]);
      setShowBulkActions(false);
      toast({
        title: "Thoughtmarks restored",
        description: `${selectedIds.length} thoughtmarks have been restored.`,
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to restore thoughtmarks.",
        variant: "destructive",
      });
    }
  });

  const bulkDeleteMutation = useMutation({
    mutationFn: async (ids: number[]) => {
      const promises = ids.map(id => apiRequest("DELETE", `/api/thoughtmarks/${id}/permanent`));
      const responses = await Promise.all(promises);
      const failed = responses.filter(r => !r.ok);
      if (failed.length > 0) throw new Error(`Failed to delete ${failed.length} thoughtmarks`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/thoughtmarks/archived"] });
      setSelectedIds([]);
      setShowBulkActions(false);
      setShowDeleteConfirm(false);
      toast({
        title: "Thoughtmarks deleted",
        description: `${selectedIds.length} thoughtmarks have been permanently deleted.`,
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete thoughtmarks.",
        variant: "destructive",
      });
    }
  });

  const filteredThoughtmarks = archivedThoughtmarks.filter(tm => 
    tm.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tm.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tm.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleThoughtmarkSelect = (id: number) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(tid => tid !== id) : [...prev, id]
    );
  };

  const toggleBulkActions = () => {
    setShowBulkActions(!showBulkActions);
    setSelectedIds([]);
  };

  const selectAll = () => {
    setSelectedIds(filteredThoughtmarks.map(tm => tm.id));
  };

  const deselectAll = () => {
    setSelectedIds([]);
  };

  const handleBulkDelete = () => {
    setShowDeleteConfirm(true);
  };

  const confirmBulkDelete = () => {
    bulkDeleteMutation.mutate(selectedIds);
  };

  const handleBulkRestore = () => {
    bulkRestoreMutation.mutate(selectedIds);
  };

  if (isLoading) {
    return (
      <div className="full-height bg-gray-950 text-white p-4">
        <div className="max-w-2xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-800 rounded mb-4"></div>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-800 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="full-height bg-gray-950 text-white">
      <div className="max-w-2xl mx-auto p-4">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <ContentBackButton />
            <h1 className="text-2xl font-bold text-white uppercase tracking-wide">ARCHIVE</h1>
          </div>
          <p className="text-gray-400">Archived thoughtmarks can be restored or permanently deleted</p>
        </div>

        {/* Search and Controls */}
        <div className="glass-surface p-4 mb-6">
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wide">SEARCH & ACTIONS</h3>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search archived thoughtmarks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-gray-800/50 border-gray-600/50 text-white backdrop-blur-sm"
              />
            </div>

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
                    onClick={handleBulkRestore}
                    disabled={bulkRestoreMutation.isPending}
                    className="border-green-600 text-green-400 hover:text-green-300"
                  >
                    <Undo2 className="w-4 h-4 mr-1" />
                    Restore ({selectedIds.length})
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
          </div>
        </div>

        {/* Thoughtmarks */}
        <div className="space-y-2">
          {filteredThoughtmarks.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-2">No archived thoughtmarks found</div>
              {searchQuery && (
                <div className="text-sm text-gray-500">
                  Try adjusting your search terms
                </div>
              )}
            </div>
          ) : (
            filteredThoughtmarks.map(thoughtmark => (
              <div key={thoughtmark.id} className="relative">
                {showBulkActions && (
                  <button
                    onClick={() => handleThoughtmarkSelect(thoughtmark.id)}
                    className="absolute top-4 left-4 z-10 p-1 rounded bg-gray-800 border border-gray-600"
                  >
                    {selectedIds.includes(thoughtmark.id) ? (
                      <CheckSquare className="w-4 h-4 text-[#C6D600]" />
                    ) : (
                      <Square className="w-4 h-4 text-gray-400" />
                    )}
                  </button>
                )}
                <ThoughtmarkCard
                  key={thoughtmark.id}
                  thoughtmark={thoughtmark}
                  actions={[
                    {
                      label: "Restore",
                      onClick: () => restoreThoughtmarkMutation.mutate(thoughtmark.id),
                      icon: <Undo2 className="w-4 h-4" />,
                      variant: "success",
                      disabled: restoreThoughtmarkMutation.isPending
                    },
                    {
                      label: "Delete Permanently",
                      onClick: () => deleteThoughtmarkMutation.mutate(thoughtmark.id),
                      icon: <Trash2 className="w-4 h-4" />,
                      variant: "destructive",
                      disabled: deleteThoughtmarkMutation.isPending
                    }
                  ]}
                  className={showBulkActions ? "ml-8" : ""}
                />
              </div>
            ))
          )}
        </div>

        {/* Bulk Delete Confirmation Dialog */}
        <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
          <AlertDialogContent className="bg-gray-900 border-gray-700">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-white">Permanently Delete Thoughtmarks</AlertDialogTitle>
              <AlertDialogDescription className="text-gray-400">
                Are you sure you want to permanently delete {selectedIds.length} thoughtmarks? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="bg-gray-800 text-gray-300 border-gray-600 hover:bg-gray-700">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmBulkDelete}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Delete Permanently
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}