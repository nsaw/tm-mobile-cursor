/**
 * @deprecated This component is deprecated. Use UnifiedThoughtmark instead.
 * All thoughtmark edit/view/create functionality has been consolidated into thoughtmark-unified.tsx
 * This file should not be used in new development.
 */

import { useState } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TagChip } from "@/components/ui/tag-chip";
import { ShareButton } from "@/components/share-dialog";
import { ArrowLeft, Edit2, Calendar, ChevronLeft, ChevronRight, Trash2, Archive } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useThoughtmarks } from "@/hooks/use-thoughtmarks";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { ThoughtmarkWithBin } from "@shared/schema";

export default function ThoughtmarkView() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const [startX, setStartX] = useState<number | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: thoughtmarks = [] } = useThoughtmarks();
  const { data: thoughtmark, isLoading, error } = useQuery<ThoughtmarkWithBin>({
    queryKey: [`/api/thoughtmarks/${id}`],
    enabled: !!id,
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (thoughtmarkId: string) => {
      return apiRequest(`/api/thoughtmarks/${thoughtmarkId}`, {
        method: 'DELETE',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/thoughtmarks'] });
      toast({
        title: "Thoughtmark deleted",
        description: "The thoughtmark has been permanently deleted.",
      });
      setLocation('/dashboard');
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete thoughtmark. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Archive mutation
  const archiveMutation = useMutation({
    mutationFn: async (thoughtmarkId: string) => {
      return apiRequest(`/api/thoughtmarks/${thoughtmarkId}/archive`, {
        method: 'POST',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/thoughtmarks'] });
      toast({
        title: "Thoughtmark archived",
        description: "The thoughtmark has been moved to the archive.",
      });
      setLocation('/dashboard');
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to archive thoughtmark. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Find current thoughtmark index and navigation
  const thoughtmarkId = parseInt(id || '0', 10);
  const currentIndex = thoughtmarks.findIndex((t) => t.id === thoughtmarkId);
  const prevThoughtmark = currentIndex > 0 ? thoughtmarks[currentIndex - 1] : null;
  const nextThoughtmark = currentIndex < thoughtmarks.length - 1 ? thoughtmarks[currentIndex + 1] : null;

  // Swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (startX === null) return;
    
    const endX = e.changedTouches[0].clientX;
    const diffX = startX - endX;
    
    // Swipe threshold
    if (Math.abs(diffX) > 100) {
      if (diffX > 0 && nextThoughtmark) {
        // Swipe left - next thoughtmark
        setLocation(`/thoughtmarks/${nextThoughtmark.id}`);
      } else if (diffX < 0 && prevThoughtmark) {
        // Swipe right - previous thoughtmark
        setLocation(`/thoughtmarks/${prevThoughtmark.id}`);
      }
    }
    
    setStartX(null);
  };

  if (isLoading) {
    return (
      <div className="full-height bg-gray-900 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-[#C6D600] border-t-transparent rounded-full" />
      </div>
    );
  }

  if (error || !thoughtmark) {
    return (
      <div className="full-height bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Thoughtmark Not Found</h1>
          <p className="text-gray-400 mb-6">This thoughtmark may have been deleted or you don't have permission to view it.</p>
          <Button onClick={() => setLocation('/dashboard')} className="bg-[#C6D600] text-black hover:bg-[#B8C500]">
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="full-height bg-gray-900 p-4"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="ghost"
            onClick={() => setLocation('/dashboard')}
            className="text-gray-400 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => setLocation(`/thoughtmarks/${id}/edit`)}
              className="border-gray-600 text-gray-300 hover:bg-gray-800"
            >
              <Edit2 className="w-4 h-4 mr-2" />
              Edit
            </Button>
            <Button
              variant="outline"
              onClick={() => archiveMutation.mutate(id!)}
              disabled={archiveMutation.isPending}
              className="border-yellow-600 text-yellow-300 hover:bg-yellow-800/20"
            >
              <Archive className="w-4 h-4 mr-2" />
              Archive
            </Button>
            <Button
              variant="outline"
              onClick={() => deleteMutation.mutate(id!)}
              disabled={deleteMutation.isPending}
              className="border-red-600 text-red-300 hover:bg-red-800/20"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>
            <ShareButton thoughtmark={thoughtmark} variant="default" />
          </div>
        </div>

        {/* Navigation indicators */}
        <div className="flex items-center justify-between mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => prevThoughtmark && setLocation(`/thoughtmarks/${prevThoughtmark.id}`)}
            disabled={!prevThoughtmark}
            className="text-gray-400 hover:text-white disabled:opacity-30"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Previous
          </Button>
          
          <span className="text-xs text-gray-500">
            {currentIndex + 1} of {thoughtmarks.length}
          </span>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => nextThoughtmark && setLocation(`/thoughtmarks/${nextThoughtmark.id}`)}
            disabled={!nextThoughtmark}
            className="text-gray-400 hover:text-white disabled:opacity-30"
          >
            Next
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>

        {/* Thoughtmark Content */}
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            <div className="space-y-4">
              {/* Title */}
              <h1 className="text-2xl font-bold text-white">{thoughtmark.title}</h1>

              {/* Metadata */}
              <div className="flex items-center gap-4 text-sm text-gray-400">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {(() => {
                      try {
                        const date = new Date(thoughtmark.createdAt);
                        if (isNaN(date.getTime())) {
                          return 'Recently created';
                        }
                        return formatDistanceToNow(date, { addSuffix: true });
                      } catch {
                        return 'Recently created';
                      }
                    })()}
                  </span>
                </div>
                {thoughtmark.binName && (
                  <span className="px-2 py-1 bg-gray-700 rounded text-xs">
                    {thoughtmark.binName}
                  </span>
                )}
              </div>

              {/* Content */}
              <div className="prose prose-invert max-w-none">
                <p className="text-gray-300 whitespace-pre-wrap leading-relaxed">
                  {thoughtmark.content}
                </p>
              </div>

              {/* Tags */}
              {thoughtmark.tags && thoughtmark.tags.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-gray-400">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {thoughtmark.tags.map((tag, index) => (
                      <TagChip key={index} tag={tag} />
                    ))}
                  </div>
                </div>
              )}

              {/* Task Status */}
              {thoughtmark.isTask && (
                <div className="border-t border-gray-700 pt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-400">Task Status</span>
                    <span className={`px-2 py-1 rounded text-xs ${
                      thoughtmark.isCompleted 
                        ? 'bg-green-900 text-green-300' 
                        : 'bg-yellow-900 text-yellow-300'
                    }`}>
                      {thoughtmark.isCompleted ? 'Completed' : 'Pending'}
                    </span>
                  </div>
                  {thoughtmark.dueDate && (
                    <p className="text-sm text-gray-400 mt-2">
                      Due: {new Date(thoughtmark.dueDate).toLocaleDateString()}
                    </p>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* AI Suggestions Loading Placeholder */}
        <div className="mt-6 bg-gray-800 border border-gray-700 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-4 h-4 bg-gray-600 rounded animate-pulse"></div>
            <div className="w-32 h-4 bg-gray-600 rounded animate-pulse"></div>
          </div>
          <div className="space-y-2">
            <div className="w-full h-3 bg-gray-700 rounded animate-pulse"></div>
            <div className="w-3/4 h-3 bg-gray-700 rounded animate-pulse"></div>
            <div className="w-1/2 h-3 bg-gray-700 rounded animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
}