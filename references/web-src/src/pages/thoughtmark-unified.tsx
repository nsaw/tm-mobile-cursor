import { useState, useEffect, useRef, useCallback, memo } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BackButton } from "@/components/ui/BackButton";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { TagChip } from "@/components/ui/tag-chip";
import { ShareButton } from "@/components/share-dialog";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { SmartTagInput } from "@/components/enhanced-interactions";
import { ArrowLeft, Edit2, Edit3, Save, X, Calendar, ChevronLeft, ChevronRight, ChevronUp, ChevronDown, Plus, Tag, Archive, Trash2, Pin, PinOff, Clock, AlertTriangle, Calendar as CalendarIcon, Wand2, Sparkles, ArrowRight, Lightbulb, Undo2, Redo2, FileText, Copy, CheckCircle, Circle, Check } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useThoughtmarks } from "@/hooks/use-thoughtmarks";
import { useBins } from "@/hooks/use-bins";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { cn } from "@/lib/utils";
import type { ThoughtmarkWithBin } from "@shared/schema";

const thoughtmarkFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  tags: z.array(z.string()).default([]),
  binId: z.number().nullable(),
  isTask: z.boolean().default(false),
  isCompleted: z.boolean().default(false),
  dueDate: z.string().nullable().default(null),
  isPinned: z.boolean().default(false),
});

type ThoughtmarkFormData = z.infer<typeof thoughtmarkFormSchema>;

interface UnifiedThoughtmarkProps {
  mode?: "view" | "edit" | "create";
}

// Memoized pin button to prevent over-rendering
const PinButton = memo(({ isPinned, onToggle, disabled }: { 
  isPinned: boolean; 
  onToggle: () => void; 
  disabled: boolean; 
}) => {
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={onToggle}
      disabled={disabled}
      className={`${isPinned ? 'text-[#C6D600]' : 'text-gray-400'} hover:text-[#C6D600] hover:bg-gray-800 flex-shrink-0 disabled:opacity-50`}
      title={isPinned ? "Unpin from top" : "Pin to top"}
    >
      {isPinned ? <Pin className="w-4 h-4" /> : <PinOff className="w-4 h-4" />}
    </Button>
  );
});

export default function UnifiedThoughtmark({ mode: initialMode = "view" }: UnifiedThoughtmarkProps) {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  // Remove debounced cache invalidation - using direct cache updates only

  // Component state
  const [mode, setMode] = useState(initialMode);
  const [startX, setStartX] = useState<number | null>(null);
  const [newTag, setNewTag] = useState("");
  const [autoSaveTimer, setAutoSaveTimer] = useState<NodeJS.Timeout | null>(null);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  
  // Tag autocomplete state
  const [tagInput, setTagInput] = useState("");
  const [showTagDropdown, setShowTagDropdown] = useState(false);
  const [filteredTags, setFilteredTags] = useState<string[]>([]);
  const tagInputRef = useRef<HTMLInputElement>(null);
  
  // Undo/Redo state management
  const [undoStack, setUndoStack] = useState<any[]>([]);
  const [redoStack, setRedoStack] = useState<any[]>([]);
  const [lastAction, setLastAction] = useState<string | null>(null);

  // AI features
  const [smartSuggestions, setSmartSuggestions] = useState<{
    alternativeTitles: string[];
    additionalTags: string[];
    relatedTopics: string[];
  } | null>(null);
  const [isGeneratingSuggestions, setIsGeneratingSuggestions] = useState(false);

  // Data fetching
  const { data: thoughtmarks = [] } = useThoughtmarks();
  const { data: bins = [] } = useBins();
  
  // Get all existing tags for autocomplete
  const allTags = Array.from(new Set(thoughtmarks.flatMap(tm => tm.tags || [])));
  const recentTags = allTags.slice(0, 10); // Most recent tags
  const { data: thoughtmark, isLoading, error } = useQuery<ThoughtmarkWithBin>({
    queryKey: [`/api/thoughtmarks/${id}`],
    enabled: !!id && mode !== "create",
  });

  // Form setup
  const form = useForm<ThoughtmarkFormData>({
    resolver: zodResolver(thoughtmarkFormSchema),
    defaultValues: {
      title: "",
      content: "",
      tags: [],
      binId: null,
      isTask: false,
      isCompleted: false,
      dueDate: null,
      isPinned: false,
    },
  });

  // Navigation logic
  const thoughtmarkId = parseInt(id || '0', 10);
  const currentIndex = thoughtmarks.findIndex((t) => t.id === thoughtmarkId);
  const totalCount = thoughtmarks.length;
  const prevThoughtmark = currentIndex > 0 ? thoughtmarks[currentIndex - 1] : null;
  const nextThoughtmark = currentIndex < thoughtmarks.length - 1 ? thoughtmarks[currentIndex + 1] : null;

  // Handle voice content from URL parameters (for create mode)
  useEffect(() => {
    if (mode === "create") {
      // Check for voice content in URL parameters
      const urlParams = new URLSearchParams(window.location.search);
      const isVoiceContent = urlParams.get('voice') === 'true';
      const content = urlParams.get('content');
      const title = urlParams.get('title');
      const tags = urlParams.get('tags');
      
      if (isVoiceContent && content) {
        // Use setTimeout to ensure form is ready
        setTimeout(() => {
          form.setValue("content", decodeURIComponent(content));
          form.setValue("title", title ? decodeURIComponent(title) : "Voice Note");
          form.setValue("tags", tags ? tags.split(',') : ["voice"]);
          
          // Clean up URL parameters after processing
          const newUrl = window.location.pathname;
          window.history.replaceState({}, '', newUrl);
        }, 100);
        
        toast({
          title: "Voice content loaded",
          description: "Your voice transcription has been loaded into the form",
        });
      }
    }
  }, [mode, form, toast]);

  // Auto-select default bin for new thoughtmarks
  useEffect(() => {
    if (mode === "create" && bins.length > 0) {
      const sortLaterBin = bins.find(bin => bin.name === "Sort Later");
      if (sortLaterBin) {
        form.setValue("binId", sortLaterBin.id);
      }
    }
  }, [mode, bins, form]);

  // Load thoughtmark data when switching to edit mode or when data loads
  useEffect(() => {
    if (thoughtmark && (mode === "edit" || mode === "view")) {
      form.reset({
        title: thoughtmark.title,
        content: thoughtmark.content,
        tags: thoughtmark.tags || [],
        binId: thoughtmark.binId,
        isTask: thoughtmark.isTask || false,
        isCompleted: thoughtmark.isCompleted || false,
        dueDate: thoughtmark.dueDate ? new Date(thoughtmark.dueDate).toISOString().split('T')[0] : null,
        isPinned: thoughtmark.isPinned || false,
      });

      // Auto-generate AI suggestions in view mode to prevent layout shift
      if (mode === "view" && thoughtmark.title && thoughtmark.content && !smartSuggestions) {
        const generateViewModeSuggestions = async () => {
          setIsGeneratingSuggestions(true);
          try {
            const response = await apiRequest("POST", "/api/voice/suggestions", {
              title: thoughtmark.title,
              content: thoughtmark.content,
              existingTags: thoughtmark.tags || [],
            });
            
            if (response.ok) {
              const suggestions = await response.json();
              setSmartSuggestions(suggestions);
            }
          } catch (error) {
            console.warn("Auto AI suggestions failed:", error);
          } finally {
            setIsGeneratingSuggestions(false);
          }
        };

        generateViewModeSuggestions();
      }
    }
  }, [thoughtmark, mode, form, smartSuggestions]);

  // Sync form with thoughtmark data changes (for real-time updates after mutations)
  useEffect(() => {
    if (thoughtmark && mode === "view") {
      console.log("Syncing form with thoughtmark data:", {
        thoughtmarkId: thoughtmark.id,
        isCompleted: thoughtmark.isCompleted,
        isPinned: thoughtmark.isPinned,
        formCompleted: form.watch("isCompleted"),
        formPinned: form.watch("isPinned")
      });
      // Only update specific fields that might change via mutations to avoid disrupting editing
      form.setValue("isCompleted", thoughtmark.isCompleted || false);
      form.setValue("isPinned", thoughtmark.isPinned || false);
    }
  }, [thoughtmark?.isCompleted, thoughtmark?.isPinned, mode, form]);

  // Auto-save functionality
  const triggerAutoSave = () => {
    if (autoSaveTimer) {
      clearTimeout(autoSaveTimer);
    }
    
    const timer = setTimeout(() => {
      if (mode === "edit" && thoughtmark) {
        const formData = form.getValues();
        updateThoughtmarkMutation.mutate({
          id: thoughtmark.id,
          data: formData,
          isAutoSave: true,
        });
      }
    }, 2000);
    
    setAutoSaveTimer(timer);
  };

  // Watch form changes for auto-save
  useEffect(() => {
    const subscription = form.watch(() => {
      if (mode === "edit") {
        triggerAutoSave();
      }
    });
    return () => subscription.unsubscribe();
  }, [form, mode]);

  // Undo/Redo functions
  const saveToUndoStack = useCallback((currentState: any, actionType: string) => {
    setUndoStack(prev => [...prev, { state: currentState, action: actionType }]);
    setRedoStack([]); // Clear redo stack when new action is performed
    setLastAction(actionType);
  }, []);

  const handleUndo = useCallback(() => {
    if (undoStack.length === 0) return;
    
    const lastUndo = undoStack[undoStack.length - 1];
    const currentState = form.getValues();
    
    // Save current state to redo stack
    setRedoStack(prev => [...prev, { state: currentState, action: lastAction }]);
    
    // Restore previous state
    form.reset(lastUndo.state);
    
    // Remove from undo stack
    setUndoStack(prev => prev.slice(0, -1));
    
    toast({
      title: "Undone",
      description: `Reversed: ${lastUndo.action}`,
      
    });
  }, [undoStack, form, lastAction, toast]);

  const handleRedo = useCallback(() => {
    if (redoStack.length === 0) return;
    
    const lastRedo = redoStack[redoStack.length - 1];
    const currentState = form.getValues();
    
    // Save current state to undo stack
    setUndoStack(prev => [...prev, { state: currentState, action: lastRedo.action }]);
    
    // Restore redo state
    form.reset(lastRedo.state);
    
    // Remove from redo stack
    setRedoStack(prev => prev.slice(0, -1));
    
    toast({
      title: "Redone",
      description: `Restored: ${lastRedo.action}`,
      
    });
  }, [redoStack, form, toast]);

  // Mutations
  const createThoughtmarkMutation = useMutation({
    mutationFn: async (data: ThoughtmarkFormData) => {
      const response = await apiRequest("POST", "/api/thoughtmarks", {
        ...data,
        dueDate: data.dueDate ? new Date(data.dueDate).toISOString() : null,
      });
      if (!response.ok) throw new Error("Failed to create thoughtmark");
      return response.json();
    },
    onSuccess: (newThoughtmark) => {
      // Use debounced cache updates to prevent UI blocking
      const queryKeys = ["/api/thoughtmarks"];
      if (newThoughtmark.binId) {
        queryKeys.push("/api/bins");
      }
      // Skip cache invalidation to prevent UI blocking
      
      toast({ title: "Thoughtmark created" });
      setLocation(`/thoughtmarks/${newThoughtmark.id}`);
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to create thoughtmark", variant: "destructive" });
    },
  });

  const updateThoughtmarkMutation = useMutation({
    mutationFn: async ({ id, data, isAutoSave }: { id: number; data: ThoughtmarkFormData; isAutoSave?: boolean }) => {
      const payload = {
        ...data,
        dueDate: data.dueDate ? data.dueDate : null, // Send as string, API will convert
      };
      
      const response = await apiRequest("PATCH", `/api/thoughtmarks/${id}`, payload);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update thoughtmark");
      }
      return { data: await response.json(), isAutoSave };
    },
    onSuccess: ({ data, isAutoSave }) => {
      // Update the cache directly to prevent blocking
      queryClient.setQueryData([`/api/thoughtmarks/${id}`], data);
      
      if (isAutoSave) {
        setLastSaved(new Date());
      } else {
        toast({ title: "Thoughtmark updated" });
        setMode("view");
      }
    },
    onError: (error: any) => {
      console.error("Update thoughtmark error:", error);
      toast({ 
        title: "Error", 
        description: error.message || "Failed to update thoughtmark", 
        variant: "destructive"
      });
    },
  });

  const deleteThoughtmarkMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest("DELETE", `/api/thoughtmarks/${id}`);
      if (!response.ok) throw new Error("Failed to delete thoughtmark");
      return response.json();
    },
    onSuccess: () => {
      // Remove from cache without invalidation to prevent UI blocking
      queryClient.removeQueries({ queryKey: [`/api/thoughtmarks/${id}`] });
      toast({ title: "Thoughtmark deleted" });
      setLocation("/");
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to delete thoughtmark", variant: "destructive" });
    },
  });

  const archiveThoughtmarkMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest("PATCH", `/api/thoughtmarks/${id}/archive`);
      if (!response.ok) throw new Error("Failed to archive thoughtmark");
      return response.json();
    },
    onSuccess: () => {
      // Remove from cache without invalidation to prevent UI blocking
      queryClient.removeQueries({ queryKey: [`/api/thoughtmarks/${id}`] });
      toast({ title: "Thoughtmark archived" });
      setLocation("/");
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to archive thoughtmark", variant: "destructive" });
    },
  });

  // Pin toggle using React Hook Form pattern (same as edit mode)
  const handleTogglePin = useCallback(async () => {
    // Immediate UI update using form state
    const newPinState = !form.watch("isPinned");
    form.setValue("isPinned", newPinState);
    
    try {
      const response = await apiRequest("POST", `/api/thoughtmarks/${id}/toggle-pin`);
      if (!response.ok) throw new Error("Failed to toggle pin");
      
      const result = await response.json();
      
      // Update React Query cache silently
      queryClient.setQueryData([`/api/thoughtmarks/${id}`], (prev: any) => ({
        ...prev,
        isPinned: result.isPinned
      }));
      
      toast({ 
        title: "Success", 
        description: result.isPinned ? "Thoughtmark pinned" : "Thoughtmark unpinned"
      });
    } catch (error) {
      // Revert form state on error
      form.setValue("isPinned", !newPinState);
      toast({ title: "Error", description: "Failed to toggle pin", variant: "destructive" });
    }
  }, [id, form, queryClient, toast]);

  // Tag management
  const addTag = () => {
    if (newTag.trim() && !form.getValues("tags").includes(newTag.trim())) {
      const currentTags = form.getValues("tags");
      form.setValue("tags", [...currentTags, newTag.trim()]);
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    const currentTags = form.getValues("tags");
    form.setValue("tags", currentTags.filter(tag => tag !== tagToRemove));
  };

  // Tag autocomplete functionality
  const handleTagInput = (value: string) => {
    setTagInput(value);
    if (value.trim()) {
      const filtered = allTags.filter(tag => 
        tag.toLowerCase().includes(value.toLowerCase()) &&
        !form.getValues("tags").includes(tag)
      );
      setFilteredTags(filtered);
      setShowTagDropdown(true);
    } else {
      setFilteredTags(recentTags.filter(tag => !form.getValues("tags").includes(tag)));
      setShowTagDropdown(true);
    }
  };

  const selectTag = (tag: string) => {
    const currentTags = form.getValues("tags");
    if (!currentTags.includes(tag)) {
      form.setValue("tags", [...currentTags, tag]);
    }
    setTagInput("");
    setShowTagDropdown(false);
    tagInputRef.current?.focus();
  };

  const addCustomTag = () => {
    const value = tagInput.trim();
    if (value && !form.getValues("tags").includes(value)) {
      const currentTags = form.getValues("tags");
      form.setValue("tags", [...currentTags, value]);
      setTagInput("");
      setShowTagDropdown(false);
    }
  };

  // AI suggestion functions
  const generateAISuggestions = async () => {
    const title = form.getValues("title");
    const content = form.getValues("content");
    
    if (!title || !content) {
      toast({
        title: "Content Required",
        description: "Please add a title and content before generating AI suggestions",
        variant: "destructive",
        
      });
      return;
    }

    setIsGeneratingSuggestions(true);
    try {
      const response = await apiRequest("POST", "/api/voice/suggestions", {
        title,
        content,
        existingTags: form.getValues("tags"),
      });
      
      if (response.ok) {
        const suggestions = await response.json();
        setSmartSuggestions(suggestions);
      } else {
        throw new Error("Failed to generate suggestions");
      }
    } catch (error) {
      console.error("Error generating AI suggestions:", error);
      toast({
        title: "AI Error",
        description: "Failed to generate AI suggestions. Please try again.",
        variant: "destructive",
        
      });
    } finally {
      setIsGeneratingSuggestions(false);
    }
  };

  const applySuggestion = (type: 'title' | 'tag', value: string) => {
    const currentValues = form.getValues();
    
    // Save current state to undo stack before applying AI suggestion
    saveToUndoStack(currentValues, `AI ${type} suggestion`);
    
    if (type === 'title') {
      form.setValue("title", value);
      toast({
        title: "Applied AI suggestion",
        description: "Title updated • Undo available",
        
      });
    } else if (type === 'tag' && !form.getValues("tags").includes(value)) {
      const currentTags = form.getValues("tags");
      form.setValue("tags", [...currentTags, value]);
      toast({
        title: "Applied AI suggestion", 
        description: "Tag added • Undo available",
        
      });
    }
  };

  // Swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    if (mode === "view") {
      setStartX(e.touches[0].clientX);
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (startX === null || mode !== "view") return;
    
    const endX = e.changedTouches[0].clientX;
    const diffX = startX - endX;
    
    if (Math.abs(diffX) > 100) {
      if (diffX > 0 && nextThoughtmark) {
        setLocation(`/thoughtmarks/${nextThoughtmark.id}`);
      } else if (diffX < 0 && prevThoughtmark) {
        setLocation(`/thoughtmarks/${prevThoughtmark.id}`);
      }
    }
    setStartX(null);
  };

  // Form submission
  const onSubmit = (data: ThoughtmarkFormData) => {
    if (mode === "create") {
      createThoughtmarkMutation.mutate(data);
    } else if (mode === "edit" && thoughtmark) {
      updateThoughtmarkMutation.mutate({ id: thoughtmark.id, data });
    }
  };

  // Loading and error states
  if (isLoading && mode !== "create") {
    return (
      <div className="full-height bg-gray-950 flex items-center justify-center">
        <div className="text-gray-400">Loading...</div>
      </div>
    );
  }

  if (error && mode !== "create") {
    return (
      <div className="full-height bg-gray-950 flex items-center justify-center">
        <div className="text-red-400">Error loading thoughtmark</div>
      </div>
    );
  }

  const currentTags = form.watch("tags");
  const isTask = form.watch("isTask");
  const isPinned = form.watch("isPinned");

  const formatRelativeTime = (date: string | Date) => {
    try {
      return formatDistanceToNow(new Date(date), { addSuffix: true });
    } catch {
      return 'Unknown time';
    }
  };

  return (
    <div 
      className="full-height bg-gradient-to-br from-[#0A0B0E] via-[#171B22] to-[#1C2129] text-white relative"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-900/5 via-transparent to-blue-800/5 pointer-events-none" />
      
      {/* Navigation Header - Fixed width and centered */}
      <div className="max-w-[450px] mx-auto px-4 py-4">
        <div className="mb-3 w-full max-w-[100vw] overflow-hidden">
          <div className="flex items-center justify-between mb-2 whitespace-nowrap">
            {mode === "edit" ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  // Save changes before going back to view
                  if (thoughtmark) {
                    const formData = form.getValues();
                    updateThoughtmarkMutation.mutate({ id: thoughtmark.id, data: formData });
                  }
                }}
                className="text-gray-400 hover:text-white hover:bg-blue-500/10 transition-all duration-200 flex-shrink-0"
                aria-label="Save changes and return to view mode"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
            ) : (
              <BackButton variant="icon" className="text-gray-400 hover:text-white hover:bg-blue-500/10 transition-all duration-200 flex-shrink-0" aria-label="Return to dashboard" />
            )}

            {/* Navigation Controls in Header Row */}
            {thoughtmark && mode !== "edit" && (
              <div className="flex items-center gap-2 bg-[#1A1D23]/80 backdrop-blur-sm rounded-lg px-3 py-1.5 border border-blue-500/20">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => prevThoughtmark && setLocation(`/thoughtmarks/${prevThoughtmark.id}`)}
                  disabled={!prevThoughtmark}
                  className="text-gray-400 hover:text-white disabled:opacity-50 h-8 w-8 p-0"
                  aria-label="Previous thoughtmark"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <span className="text-sm text-gray-400 px-2 text-center min-w-[60px]" aria-label={`Thoughtmark ${currentIndex + 1} of ${totalCount}`}>
                  {currentIndex + 1} of {totalCount}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => nextThoughtmark && setLocation(`/thoughtmarks/${nextThoughtmark.id}`)}
                  disabled={!nextThoughtmark}
                  className="text-gray-400 hover:text-white disabled:opacity-50 h-8 w-8 p-0"
                  aria-label="Next thoughtmark"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
          
          {/* Page Title */}
          <div className="mb-3">
          </div>

          {/* Secondary Controls - Edit Mode Only */}
          {mode === "edit" && (
            <div className="flex items-center justify-center gap-2 mb-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleUndo}
                disabled={undoStack.length === 0}
                className="text-gray-400 hover:text-blue-400 hover:bg-gray-800 disabled:opacity-30"
                title="Undo last change"
              >
                <Undo2 className="w-4 h-4" />
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={handleRedo}
                disabled={redoStack.length === 0}
                className="text-gray-400 hover:text-blue-400 hover:bg-gray-800 disabled:opacity-30"
                title="Redo last undone change"
              >
                <Redo2 className="w-4 h-4" />
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={generateAISuggestions}
                disabled={isGeneratingSuggestions}
                className="text-gray-400 hover:text-[#C6D600] hover:bg-gray-800"
                title="Generate AI suggestions"
              >
                {isGeneratingSuggestions ? (
                  <Sparkles className="w-4 h-4 animate-pulse" />
                ) : (
                  <Wand2 className="w-4 h-4" />
                )}
              </Button>
              
              {lastSaved && (
                <span className="text-xs text-gray-500 ml-2">
                  Saved {formatRelativeTime(lastSaved)}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Content */}
      <div className="max-w-[450px] mx-auto p-2 pb-16">
        {mode === "view" ? (
          // View mode with container box
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 space-y-6">
            {/* Title with inline controls */}
            <div className="space-y-3">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="text-2xl font-bold text-white break-words flex-1">
                    {thoughtmark?.title}
                  </div>
                  
                  {/* Action buttons in card */}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      const currentPinned = form.watch("isPinned");
                      form.setValue("isPinned", !currentPinned);
                      const formData = form.getValues();
                      updateThoughtmarkMutation.mutate({ id: thoughtmark.id, data: formData });
                    }}
                    className="text-gray-400 hover:text-blue-400 hover:bg-gray-800 h-8 w-8 flex-shrink-0"
                    title={form.watch("isPinned") ? "Unpin thoughtmark" : "Pin thoughtmark"}
                    aria-label={form.watch("isPinned") ? "Unpin thoughtmark" : "Pin thoughtmark"}
                  >
                    <Pin className={cn("w-4 h-4", form.watch("isPinned") && "text-blue-400")} />
                  </Button>

                  {form.watch("isTask") && (
                    <div
                      onClick={() => {
                        const currentCompleted = form.watch("isCompleted");
                        form.setValue("isCompleted", !currentCompleted);
                        const formData = form.getValues();
                        updateThoughtmarkMutation.mutate({ id: thoughtmark.id, data: formData });
                      }}
                      className="tm-completion-toggle"
                      data-completed={form.watch("isCompleted")}
                      title={form.watch("isCompleted") ? "Mark as incomplete" : "Mark as complete"}
                      aria-label={form.watch("isCompleted") ? "Mark as incomplete" : "Mark as complete"}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          const currentCompleted = form.watch("isCompleted");
                          form.setValue("isCompleted", !currentCompleted);
                          const formData = form.getValues();
                          updateThoughtmarkMutation.mutate({ id: thoughtmark.id, data: formData });
                        }
                      }}
                    >
                      <Check className="w-4 h-4" />
                    </div>
                  )}

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setMode("edit")}
                    className="text-gray-400 hover:text-white hover:bg-gray-800 h-8 w-8 flex-shrink-0"
                    title="Edit thoughtmark"
                    aria-label="Edit thoughtmark"
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                </div>
                
                {thoughtmark?.isTask && (
                  <div className="flex items-center gap-2">

                    
                    {thoughtmark.dueDate && (
                      <Badge variant="outline" className="text-blue-400 border-blue-400">
                        <CalendarIcon className="w-3 h-3 mr-1" />
                        Due {formatRelativeTime(thoughtmark.dueDate)}
                      </Badge>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Content */}
            <div className="space-y-2">
              <div className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                {thoughtmark?.content}
              </div>
            </div>

            {/* Tags */}
            {thoughtmark?.tags && thoughtmark.tags.length > 0 && (
              <div className="space-y-2">
                <div className="text-sm text-gray-400">Tags</div>
                <div className="flex flex-wrap gap-2">
                  {thoughtmark.tags.map((tag: string, index: number) => (
                    <Badge key={index} variant="secondary" className="bg-gray-800 text-gray-300">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Collection */}
            {thoughtmark?.binId && (
              <div className="space-y-2">
                <div className="text-sm text-gray-400">Collection</div>
                <Badge variant="outline" className="text-blue-400 border-blue-400">
                  {bins.find(bin => bin.id === thoughtmark.binId)?.name || "Unknown Collection"}
                </Badge>
              </div>
            )}

            {/* Metadata and Actions */}
            <div className="border-t border-gray-700 pt-4">
              <div className="flex items-center justify-between">
                <div className="text-xs text-gray-500">
                  Created {formatRelativeTime(thoughtmark?.createdAt || new Date())}
                  {thoughtmark?.updatedAt && thoughtmark.updatedAt !== thoughtmark.createdAt && (
                    <> • Updated {formatRelativeTime(thoughtmark.updatedAt)}</>
                  )}
                </div>
                
                {/* Action buttons in lower right */}
                <div className="flex items-center gap-1">
                  {thoughtmark && <ShareButton thoughtmark={thoughtmark} />}
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => thoughtmark && archiveThoughtmarkMutation.mutate(thoughtmark.id)}
                    disabled={archiveThoughtmarkMutation.isPending}
                    className="text-yellow-400 hover:text-yellow-300 hover:bg-yellow-800/20 h-8 w-8 p-0"
                    title="Archive thoughtmark"
                  >
                    <Archive className="w-3.5 h-3.5" />
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => thoughtmark && deleteThoughtmarkMutation.mutate(thoughtmark.id)}
                    disabled={deleteThoughtmarkMutation.isPending}
                    className="text-red-400 hover:text-red-300 hover:bg-red-800/20 h-8 w-8 p-0"
                    title="Delete thoughtmark"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            </div>

            {/* AI Suggestions Panel for View Mode */}
            <div className="border-t border-gray-700 pt-6">
              {smartSuggestions ? (
                <div className="glass-surface">
                  <div className="card-content">
                    <div className="flex items-center gap-2 mb-4">
                      <Sparkles className="w-5 h-5 text-[#C6D600]" />
                      <h3 className="text-white font-semibold">AI Suggestions</h3>
                    </div>
                    <div className="space-y-4">
                      {smartSuggestions.alternativeTitles?.length > 0 && (
                        <div>
                          <div className="text-sm text-gray-400 mb-2">Alternative Titles</div>
                          <div className="flex flex-wrap gap-2">
                            {smartSuggestions.alternativeTitles.map((title, index) => (
                              <Badge
                                key={index}
                                variant="outline"
                                className="text-xs bg-gray-800 border-gray-600 text-gray-300 cursor-pointer hover:bg-gray-700"
                                onClick={() => {
                                  if (thoughtmark) {
                                    navigator.clipboard.writeText(title);
                                  }
                                }}
                              >
                                {title}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {smartSuggestions.additionalTags?.length > 0 && (
                        <div>
                          <div className="text-sm text-gray-400 mb-2">Suggested Tags</div>
                          <div className="flex flex-wrap gap-2">
                            {smartSuggestions.additionalTags.map((tag, index) => (
                              <Badge
                                key={index}
                                variant="outline"
                                className="text-xs bg-gray-800 border-gray-600 text-gray-300 cursor-pointer hover:bg-gray-700"
                                onClick={() => {
                                  navigator.clipboard.writeText(`#${tag.toLowerCase()}`);
                                }}
                              >
                                #{tag.toLowerCase()}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {smartSuggestions.relatedTopics?.length > 0 && (
                        <div>
                          <div className="text-sm text-gray-400 mb-2">Related Topics</div>
                          <div className="text-sm text-gray-300">
                            {smartSuggestions.relatedTopics.join(" • ")}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="glass-surface">
                  <div className="card-content">
                    <div className="flex items-center gap-2 mb-4">
                      <Sparkles className="w-5 h-5 text-[#C6D600]" />
                      <h3 className="text-white font-semibold">AI Suggestions</h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={generateAISuggestions}
                        disabled={isGeneratingSuggestions}
                        className="ml-auto text-gray-400 hover:text-[#C6D600]"
                      >
                        {isGeneratingSuggestions ? (
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#C6D600] border-t-transparent" />
                        ) : (
                          <Wand2 className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                    <div className="animate-pulse space-y-4">
                      <div>
                        <div className="text-sm text-gray-400 mb-2">Alternative Titles</div>
                        <div className="flex flex-wrap gap-2">
                          <div className="h-6 w-20 bg-gray-700 rounded"></div>
                          <div className="h-6 w-24 bg-gray-700 rounded"></div>
                          <div className="h-6 w-16 bg-gray-700 rounded"></div>
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-400 mb-2">Suggested Tags</div>
                        <div className="flex flex-wrap gap-2">
                          <div className="h-6 w-16 bg-gray-700 rounded"></div>
                          <div className="h-6 w-20 bg-gray-700 rounded"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          // Edit/Create mode with modern form layout
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                {/* Title Section with inline controls */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Enter title..."
                              className="text-xl font-semibold bg-transparent border-0 p-0 text-white placeholder:text-gray-500 focus-visible:ring-0 focus:outline-none"
                              onChange={(e) => {
                                // Convert to Title Case
                                const titleCase = e.target.value.replace(/\w\S*/g, (txt) => 
                                  txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
                                );
                                field.onChange(titleCase);
                              }}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    {/* Pin Toggle - Inline with title */}
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => form.setValue("isPinned", !form.watch("isPinned"))}
                      className={`${form.watch("isPinned") ? 'text-[#C6D600]' : 'text-gray-400'} hover:text-[#C6D600] hover:bg-gray-800 flex-shrink-0`}
                      title={form.watch("isPinned") ? "Unpin from top" : "Pin to top"}
                    >
                      {form.watch("isPinned") ? <Pin className="w-4 h-4" /> : <PinOff className="w-4 h-4" />}
                    </Button>
                    
                    {/* Close Button - Inline with title */}
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => setMode("view")}
                      className="text-gray-400 hover:text-white hover:bg-gray-800 flex-shrink-0"
                      title="Close"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Content Section */}
                <div className="space-y-3">
                  <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="What's on your mind?"
                            rows={8}
                            className="bg-gray-800 border-gray-600 text-gray-200 placeholder:text-gray-500 resize-none rounded-lg focus:ring-2 focus:ring-[#C6D600] focus:border-transparent"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                {/* Smart Tags Section */}
                <div className="space-y-3 relative z-[999]">
                  <div className="text-sm font-medium text-gray-300">Tags</div>
                  <div className="relative z-[999]">
                    <div className="flex gap-2">
                      <Input
                        ref={tagInputRef}
                        value={tagInput}
                        onChange={(e) => handleTagInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            if (filteredTags.length > 0 && showTagDropdown) {
                              selectTag(filteredTags[0]);
                            } else {
                              addCustomTag();
                            }
                          } else if (e.key === 'Escape') {
                            setShowTagDropdown(false);
                          }
                        }}
                        onFocus={() => {
                          setFilteredTags(recentTags.filter(tag => !form.getValues("tags").includes(tag)));
                          setShowTagDropdown(true);
                        }}
                        onBlur={() => setTimeout(() => setShowTagDropdown(false), 150)}
                        placeholder="Type to search or add tags..."
                        className="bg-gray-800 border-gray-600 text-gray-200 placeholder:text-gray-500 rounded-lg focus:ring-2 focus:ring-[#C6D600] focus:border-transparent"
                      />
                      <Button
                        type="button"
                        onClick={addCustomTag}
                        size="icon"
                        variant="outline"
                        className="border-gray-600 text-gray-300 hover:bg-gray-700 hover:border-[#C6D600]"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    {/* Enhanced Tag Dropdown */}
                    {showTagDropdown && (filteredTags.length > 0 || (!tagInput && recentTags.length > 0) || tagInput) && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-gray-800 border border-gray-600 rounded-lg shadow-lg z-[999] max-h-48 overflow-y-auto">
                        {!tagInput && recentTags.length > 0 && (
                          <div className="px-3 py-2 text-xs text-gray-400 border-b border-gray-700">Recent Tags</div>
                        )}
                        {tagInput && filteredTags.length > 0 && (
                          <div className="px-3 py-2 text-xs text-gray-400 border-b border-gray-700">Matching Tags</div>
                        )}
                        {(tagInput ? filteredTags : recentTags.slice(0, 8)).map((tag) => (
                          <button
                            key={tag}
                            type="button"
                            onClick={() => selectTag(tag)}
                            className="w-full text-left px-3 py-2 text-gray-200 hover:bg-gray-700 focus:bg-gray-700 focus:outline-none transition-colors"
                          >
                            <div className="flex items-center gap-2">
                              <Tag className="w-3 h-3 text-gray-500" />
                              {tagInput ? (
                                <>
                                  {tag.slice(0, tag.toLowerCase().indexOf(tagInput.toLowerCase()))}
                                  <span className="bg-[#C6D600] text-black px-0.5 rounded font-medium">
                                    {tag.slice(tag.toLowerCase().indexOf(tagInput.toLowerCase()), tag.toLowerCase().indexOf(tagInput.toLowerCase()) + tagInput.length)}
                                  </span>
                                  {tag.slice(tag.toLowerCase().indexOf(tagInput.toLowerCase()) + tagInput.length)}
                                </>
                              ) : (
                                tag
                              )}
                            </div>
                          </button>
                        ))}
                        {tagInput && tagInput.trim() && !filteredTags.some(tag => tag.toLowerCase() === tagInput.toLowerCase()) && (
                          <button
                            type="button"
                            onClick={addCustomTag}
                            className="w-full text-left px-3 py-2 text-[#C6D600] hover:bg-gray-700 focus:bg-gray-700 focus:outline-none border-t border-gray-700 transition-colors"
                          >
                            <div className="flex items-center gap-2">
                              <Plus className="w-3 h-3" />
                              Create "{tagInput}"
                            </div>
                          </button>
                        )}
                        {tagInput && filteredTags.length === 0 && recentTags.length === 0 && (
                          <div className="px-3 py-2 text-sm text-gray-500">No matching tags found</div>
                        )}
                      </div>
                    )}
                  </div>
                  
                  {/* Selected Tags */}
                  {currentTags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {currentTags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="bg-gray-800 text-gray-300 cursor-pointer hover:bg-gray-700 border border-gray-600 group"
                          onClick={() => removeTag(tag)}
                        >
                          <Tag className="w-3 h-3 mr-1" />
                          {tag}
                          <X className="w-3 h-3 ml-1 opacity-60 group-hover:opacity-100" />
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                {/* Collection and Settings Section */}
                <div className="space-y-6 border-t border-gray-700 pt-6">
                  {/* Bin Selection */}
                  <FormField
                  control={form.control}
                  name="binId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-300">Collection</FormLabel>
                      <FormControl>
                        <select
                          {...field}
                          value={field.value || ""}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (value === "" || value === "none") {
                              field.onChange(undefined);
                            } else {
                              const binId = parseInt(value, 10);
                              if (!isNaN(binId)) {
                                field.onChange(binId);
                              }
                            }
                          }}
                          className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-md text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#C6D600] focus:border-transparent"
                        >
                          <option value="">Sort Later (default)</option>
                          {Array.isArray(bins) && bins.length > 0 && bins.map((bin: any) => {
                            try {
                              if (!bin || typeof bin.id !== 'number' || !bin.name) return null;
                              return (
                                <option 
                                  key={bin.id} 
                                  value={bin.id}
                                  className="bg-gray-900 text-gray-200"
                                >
                                  {bin.name}
                                </option>
                              );
                            } catch (error) {
                              console.warn('Error rendering bin option:', error);
                              return null;
                            }
                          })}
                        </select>
                      </FormControl>
                    </FormItem>
                  )}
                />

                {/* Task Options */}
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="isTask"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel className="text-gray-300">Mark as task</FormLabel>
                      </FormItem>
                    )}
                  />

                  {isTask && (
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="dueDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-300">Due Date</FormLabel>
                            <FormControl>
                              <Input
                                type="date"
                                {...field}
                                value={field.value?.toString() || ""}
                                className="bg-gray-900 border-gray-700 text-gray-200"
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                  )}
                </div>

                </div>

                {/* Enhanced Action Buttons */}
                <div className="space-y-4 pt-6 border-t border-gray-700">
                  {/* Primary Actions */}
                  <div className="flex gap-3">
                    <Button
                      type="submit"
                      disabled={createThoughtmarkMutation.isPending || updateThoughtmarkMutation.isPending}
                      className="bg-[#C6D600] hover:bg-[#B5C500] text-black font-medium px-6 py-2 rounded-lg flex-1"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      {mode === "create" ? "Save & Exit" : "Save Changes"}
                    </Button>
                    
                    {mode === "create" && (
                      <Button
                        type="button"
                        onClick={() => {
                          // Save current form, then reset for new
                          form.handleSubmit((data) => {
                            createThoughtmarkMutation.mutate(data, {
                              onSuccess: () => {
                                form.reset();
                                setTagInput("");
                                toast({
                                  title: "Thoughtmark created",
                                  description: "Ready for another one",
                                });
                              }
                            });
                          })();
                        }}
                        disabled={createThoughtmarkMutation.isPending}
                        variant="outline"
                        className="border-[#C6D600] text-[#C6D600] hover:bg-[#C6D600] hover:text-black px-6"
                      >
                        <FileText className="w-4 h-4 mr-2" />
                        Save & New
                      </Button>
                    )}
                  </div>
                  
                  {/* Secondary Actions */}
                  <div className="flex justify-between items-center">
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => setLocation("/")}
                        className="text-gray-400 hover:text-gray-200"
                      >
                        <X className="w-4 h-4 mr-2" />
                        Cancel
                      </Button>
                      
                      {mode === "edit" && thoughtmark && (
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => deleteThoughtmarkMutation.mutate(thoughtmark.id)}
                          disabled={deleteThoughtmarkMutation.isPending}
                          className="text-red-400 hover:text-red-300 hover:bg-red-950"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </Button>
                      )}
                    </div>
                    
                    {/* Auto-save indicator */}
                    {lastSaved && (
                      <div className="text-xs text-gray-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Saved {formatDistanceToNow(lastSaved, { addSuffix: true })}
                      </div>
                    )}
                  </div>
                </div>
              </form>
            </Form>
          </div>
        )}

        {/* Enhanced AI Suggestions Module */}
        {(mode === "edit" || mode === "create") && (
          <div className="mt-3">
            <Card className="card-glass bg-gray-900 border-gray-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-white flex items-center gap-2 text-base">
                  <Sparkles className="w-4 h-4 text-[#C6D600]" />
                  AI Suggestions
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={generateAISuggestions}
                    disabled={isGeneratingSuggestions}
                    className="ml-auto text-gray-400 hover:text-[#C6D600] h-7 w-7 p-0"
                  >
                    {isGeneratingSuggestions ? (
                      <div className="h-3 w-3 animate-spin rounded-full border-2 border-[#C6D600] border-t-transparent" />
                    ) : (
                      <Wand2 className="w-3 h-3" />
                    )}
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="sub-section pt-0 space-y-3">
                  {smartSuggestions ? (
                    <>
                      {/* Alternative Titles */}
                      {smartSuggestions.alternativeTitles?.length > 0 && (
                        <div className="sub-section space-y-2">
                          <label className="text-xs font-medium text-gray-400 uppercase tracking-wide">Alternative Titles</label>
                          <div className="space-y-1">
                            {smartSuggestions.alternativeTitles.slice(0, 3).map((title, index) => (
                              <Button
                                key={index}
                                onClick={() => applySuggestion('title', title)}
                                variant="ghost"
                                size="sm"
                                className="w-full text-left justify-start text-gray-300 hover:text-white hover:bg-gray-800 h-auto py-2 px-3"
                              >
                                <ArrowRight className="w-3 h-3 mr-2 text-[#C6D600]" />
                                <span className="text-sm">{title}</span>
                              </Button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Smart Tags */}
                      {smartSuggestions.additionalTags?.length > 0 && (
                        <div className="sub-section space-y-2">
                          <label className="text-xs font-medium text-gray-400 uppercase tracking-wide">Smart Tags</label>
                          <div className="flex flex-wrap gap-1.5">
                            {smartSuggestions.additionalTags.slice(0, 6).map((tag) => (
                              <Badge
                                key={tag}
                                variant="outline"
                                className="cursor-pointer hover:bg-[#C6D600] hover:text-black border-[#C6D600] text-[#C6D600] text-xs px-2 py-1"
                                onClick={() => applySuggestion('tag', tag)}
                              >
                                <Plus className="w-2.5 h-2.5 mr-1" />
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Related Content */}
                      {smartSuggestions.relatedTopics?.length > 0 && (
                        <div className="sub-section space-y-2">
                          <label className="text-xs font-medium text-gray-400 uppercase tracking-wide">Related Content</label>
                          <div className="grid gap-1.5">
                            {smartSuggestions.relatedTopics.slice(0, 3).map((topic, index) => (
                              <div key={index} className="sub-section text-xs text-gray-400 p-2 bg-gray-800 rounded-md flex items-center gap-2">
                                <Lightbulb className="w-3 h-3 text-yellow-400 flex-shrink-0" />
                                <span>{topic}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="text-center py-4">
                      <div className="text-sm text-gray-500 mb-2">Start typing to get AI suggestions</div>
                      <div className="text-xs text-gray-600">Title recommendations, smart tags, and related topics</div>
                    </div>
                  )}
                </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}