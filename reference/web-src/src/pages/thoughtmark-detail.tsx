/**
 * @deprecated This component is deprecated. Use UnifiedThoughtmark instead.
 * All thoughtmark edit/view/create functionality has been consolidated into thoughtmark-unified.tsx
 * This file should not be used in new development.
 */

import { useState, useEffect } from "react";
import { useLocation, useParams } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { ArrowLeft, Edit3, Save, X, Trash2, Archive, ChevronLeft, ChevronRight, Tag, Folder } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { insertThoughtmarkSchema } from "@shared/schema";
import { useAuth } from "@/hooks/use-auth";
import { useThoughtmarks } from "@/hooks/use-thoughtmarks";
import { useBins } from "@/hooks/use-bins";
import { PersistentLayout } from "@/components/persistent-layout";
import { z } from "zod";
import type { Thoughtmark, ThoughtmarkWithBin } from "@shared/schema";

const editThoughtmarkSchema = insertThoughtmarkSchema.extend({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
});

type EditThoughtmarkForm = z.infer<typeof editThoughtmarkSchema>;

const commonTags = [
  "work", "personal", "ideas", "research", "goals", "notes", "learning", "project", 
  "urgent", "important", "meeting", "creative", "inspiration", "todo", "reminder",
  "brainstorm", "strategy", "planning", "review", "feedback", "documentation", 
  "design", "development", "marketing", "finance", "health", "travel", "family",
  "business", "technology", "innovation", "collaboration", "productivity", "growth"
];

export default function ThoughtmarkDetail() {
  const params = useParams();
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [startX, setStartX] = useState<number | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const [showTagInput, setShowTagInput] = useState(false);
  
  const { user } = useAuth();
  const { data: thoughtmarks = [] } = useThoughtmarks();
  const { data: bins = [] } = useBins();

  const thoughtmarkId = params.id ? parseInt(params.id) : null;
  const currentThoughtmark = thoughtmarks.find(t => t.id === thoughtmarkId);
  const currentIndex = thoughtmarks.findIndex(t => t.id === thoughtmarkId);

  // Debug logging for thoughtmark expansion issue
  useEffect(() => {
    if (thoughtmarkId && !currentThoughtmark && thoughtmarks.length > 0) {
      console.log('Thoughtmark not found:', thoughtmarkId, 'Available:', thoughtmarks.map(t => t.id));
    }
  }, [thoughtmarkId, currentThoughtmark, thoughtmarks]);

  // Check for edit mode from URL parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const mode = urlParams.get('mode');
    if (mode === 'edit') {
      setIsEditing(true);
    }
  }, []);

  // If thoughtmark not found, redirect to dashboard
  useEffect(() => {
    if (thoughtmarkId && thoughtmarks.length > 0 && !currentThoughtmark) {
      setLocation('/');
    }
  }, [thoughtmarkId, thoughtmarks, currentThoughtmark, setLocation]);
  
  const prevThoughtmark = currentIndex > 0 ? thoughtmarks[currentIndex - 1] : null;
  const nextThoughtmark = currentIndex < thoughtmarks.length - 1 ? thoughtmarks[currentIndex + 1] : null;

  const form = useForm<EditThoughtmarkForm>({
    resolver: zodResolver(editThoughtmarkSchema),
    defaultValues: {
      title: "",
      content: "",
      tags: [],
      binId: undefined,
    },
  });

  // Set form values when thoughtmark loads
  useEffect(() => {
    if (currentThoughtmark) {
      form.reset({
        title: currentThoughtmark.title,
        content: currentThoughtmark.content,
        tags: currentThoughtmark.tags || [],
        binId: currentThoughtmark.binId || undefined,
      });
      setSelectedTags(currentThoughtmark.tags || []);
    }
  }, [currentThoughtmark, form]);

  // Tag management functions
  const addTag = (tag: string) => {
    if (tag && !selectedTags.includes(tag)) {
      const updatedTags = [...selectedTags, tag];
      setSelectedTags(updatedTags);
      form.setValue("tags", updatedTags);
    }
  };

  const removeTag = (tagToRemove: string) => {
    const updatedTags = selectedTags.filter(tag => tag !== tagToRemove);
    setSelectedTags(updatedTags);
    form.setValue("tags", updatedTags);
  };

  const handleAddNewTag = () => {
    if (newTag.trim()) {
      addTag(newTag.trim());
      setNewTag("");
      setShowTagInput(false);
    }
  };

  // Swipe navigation handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!startX) return;
    
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

  const updateThoughtmarkMutation = useMutation({
    mutationFn: async (data: EditThoughtmarkForm) => {
      const payload = {
        ...data,
        tags: selectedTags,
      };
      const response = await apiRequest("PATCH", `/api/thoughtmarks/${thoughtmarkId}`, payload);
      if (!response.ok) {
        throw new Error("Failed to update thoughtmark");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/thoughtmarks"] });
      queryClient.invalidateQueries({ queryKey: ["/api/bins"] });
      setIsEditing(false);
      toast({
        title: "Success",
        description: "Thoughtmark updated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update thoughtmark",
        variant: "destructive",
      });
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (thoughtmarkId: number) => {
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
    mutationFn: async (thoughtmarkId: number) => {
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

  const onSubmit = (data: EditThoughtmarkForm) => {
    updateThoughtmarkMutation.mutate(data);
  };

  const handleDelete = () => {
    if (confirm("Move this thoughtmark to trash?")) {
      deleteMutation.mutate(thoughtmarkId!);
    }
  };

  const handleArchive = () => {
    if (confirm("Archive this thoughtmark?")) {
      archiveMutation.mutate(thoughtmarkId!);
    }
  };

  if (!user) {
    return (
      <PersistentLayout>
        <div className="max-w-md mx-auto text-center py-12">
          <p className="text-gray-400">Please sign in to view thoughtmarks</p>
        </div>
      </PersistentLayout>
    );
  }

  if (!currentThoughtmark) {
    return (
      <PersistentLayout>
        <div className="max-w-md mx-auto px-4 py-8">
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setLocation("/")}
              className="text-gray-400 hover:text-white"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-xl font-title text-white">Thoughtmark Not Found</h1>
          </div>
          <p className="text-gray-400 mb-4">The thoughtmark could not be found.</p>
          <Button onClick={() => setLocation("/")}>Go Back to Dashboard</Button>
        </div>
      </PersistentLayout>
    );
  }

  const currentBin = bins.find(b => b.id === currentThoughtmark.binId);

  return (
    <PersistentLayout>
      <div 
        className="max-w-md mx-auto px-4 py-8"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setLocation("/")}
              className="text-gray-400 hover:text-white"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-xl font-title text-white">Thoughtmark</h1>
              {currentBin && (
                <p className="text-sm text-gray-400">{currentBin.name}</p>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {!isEditing ? (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsEditing(true)}
                  className="text-gray-400 hover:text-white"
                >
                  <Edit3 className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleArchive}
                  className="text-gray-400 hover:text-yellow-400"
                >
                  <Archive className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleDelete}
                  className="text-gray-400 hover:text-red-400"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsEditing(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
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

        {/* Content */}
        {isEditing ? (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Title</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="bg-gray-900 border-gray-700 text-white"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Content</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        className="bg-gray-900 border-gray-700 text-white resize-none"
                        rows={8}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Bin Selection */}
              <FormField
                control={form.control}
                name="binId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white flex items-center gap-2">
                      <Folder className="w-4 h-4" />
                      Bin
                    </FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(value === "null" ? null : parseInt(value))}
                      value={field.value?.toString() || "null"}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                          <SelectValue placeholder="Select a bin" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-gray-800 border-gray-600">
                        <SelectItem value="null" className="text-gray-400">
                          No bin
                        </SelectItem>
                        {bins.map((bin) => (
                          <SelectItem key={bin.id} value={bin.id.toString()} className="text-white">
                            <div className="flex items-center gap-2">
                              <div
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: bin.color }}
                              />
                              {bin.name}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-white mb-2 flex items-center gap-2">
                  <Tag className="w-4 h-4" />
                  Tags
                </label>
                
                {/* Selected Tags */}
                {selectedTags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {selectedTags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-[#C6D600] text-black"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="ml-1 hover:text-red-600"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}

                {/* Add New Tag */}
                {showTagInput ? (
                  <div className="flex gap-2 mb-3">
                    <Input
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      placeholder="Enter tag name..."
                      className="bg-gray-800 border-gray-600 text-white flex-1"
                      onKeyPress={(e) => e.key === 'Enter' && handleAddNewTag()}
                    />
                    <Button
                      type="button"
                      onClick={handleAddNewTag}
                      size="sm"
                      className="bg-[#C6D600] text-black hover:bg-[#B5C100]"
                    >
                      Add
                    </Button>
                    <Button
                      type="button"
                      onClick={() => {
                        setShowTagInput(false);
                        setNewTag("");
                      }}
                      size="sm"
                      variant="outline"
                      className="border-gray-600 text-gray-400"
                    >
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <Button
                    type="button"
                    onClick={() => setShowTagInput(true)}
                    variant="outline"
                    size="sm"
                    className="mb-3 border-gray-600 text-gray-400 hover:text-white"
                  >
                    + Add Custom Tag
                  </Button>
                )}

                {/* Common Tags */}
                <div className="flex flex-wrap gap-2">
                  {commonTags
                    .filter(tag => !selectedTags.includes(tag))
                    .slice(0, 12)
                    .map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => addTag(tag)}
                        className="px-3 py-1 text-xs rounded-full bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white border border-gray-600"
                      >
                        {tag}
                      </button>
                    ))}
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditing(false)}
                  className="flex-1 border-gray-700 text-gray-300 hover:text-white"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={updateThoughtmarkMutation.isPending}
                  className="flex-1 bg-[#C6D600] hover:bg-[#B5C100] text-black"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {updateThoughtmarkMutation.isPending ? "Saving..." : "Save"}
                </Button>
              </div>
            </form>
          </Form>
        ) : (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-semibold text-white mb-3">
                {currentThoughtmark.title}
              </h2>
              <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-800">
                <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                  {currentThoughtmark.content}
                </p>
              </div>
            </div>

            {currentThoughtmark.tags && currentThoughtmark.tags.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-400 mb-2">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {currentThoughtmark.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 text-xs bg-gray-800 text-gray-300 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="text-xs text-gray-500 pt-4 border-t border-gray-800">
              Created {new Date(currentThoughtmark.createdAt).toLocaleDateString()}
            </div>
          </div>
        )}
      </div>
    </PersistentLayout>
  );
}