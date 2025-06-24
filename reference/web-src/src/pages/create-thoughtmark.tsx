import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { useBins } from "@/hooks/use-bins";
import { useThoughtmarks } from "@/hooks/use-thoughtmarks";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { PersistentLayout } from "@/components/persistent-layout";
import { EnhancedButton, SmartTagInput, ValidatedInput } from "@/components/enhanced-interactions";
import { LoadingScreen } from "@/components/loading-screen";
import { useAutoSave } from "@/hooks/use-optimistic-updates";
import { useHapticFeedback } from "@/hooks/use-haptic-feedback";
import { AutoSaveIndicator } from "@/components/auto-save-indicator";
import { smartCategorizationEngine } from "@/lib/smart-categorization";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Sparkles, Brain, Calendar, AlertCircle, Archive, Trash2, Save, Plus } from "lucide-react";
import type { BinWithCount } from "@shared/schema";

export default function CreateThoughtmark() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { data: bins = [], isLoading: binsLoading } = useBins();
  
  // Enhanced UX hooks
  const { saveStatus, save } = useAutoSave();
  const { tapFeedback, successFeedback, errorFeedback } = useHapticFeedback();

  // Form state - ALL HOOKS MUST BE DECLARED BEFORE ANY CONDITIONAL RETURNS
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedBinId, setSelectedBinId] = useState<number | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [isTask, setIsTask] = useState(false);
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");
  const [isFormValid, setIsFormValid] = useState(false);
  
  // Edit mode
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isVoiceNote, setIsVoiceNote] = useState(false);
  
  // Smart suggestions
  const [smartSuggestions, setSmartSuggestions] = useState<{
    suggestedTags: string[];
    suggestedBin: BinWithCount | null;
    confidence: number;
  } | null>(null);
  
  // Auto-save functionality
  const autoSaveTimer = useRef<NodeJS.Timeout>();
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // ALL USEEFFECT HOOKS AND MUTATIONS MUST BE DECLARED BEFORE ANY CONDITIONAL RETURNS
  // Initialize from URL params (voice transcription, editing, etc.)
  useEffect(() => {
    console.log('CreateThoughtmark useEffect running - checking URL params');
    console.log('Current URL:', window.location.href);
    
    const urlParams = new URLSearchParams(window.location.search);
    const editId = urlParams.get('edit');
    const voiceContent = urlParams.get('content');
    const initialTitle = urlParams.get('title');
    const isVoice = urlParams.get('voice') === 'true';
    const voiceBinId = urlParams.get('binId');
    
    console.log('URL params extracted:', {
      editId,
      voiceContent,
      initialTitle,
      isVoice,
      voiceBinId,
      allParams: Object.fromEntries(urlParams)
    });
    
    if (editId) {
      console.log('Edit mode detected, loading thoughtmark:', editId);
      setEditingId(parseInt(editId));
      setIsVoiceNote(isVoice);
      // Load existing thoughtmark data
      loadThoughtmark(parseInt(editId));
    } else if (voiceContent) {
      // Decode the voice content from URL
      const decodedContent = decodeURIComponent(voiceContent);
      console.log('Voice content received:', { 
        rawContent: voiceContent, 
        decodedContent, 
        title: initialTitle, 
        isVoice,
        allParams: Object.fromEntries(urlParams)
      });
      
      // Ensure we're setting the actual transcribed content, not the voice flag
      if (decodedContent && decodedContent !== 'true') {
        console.log('Setting content to:', decodedContent);
        setContent(decodedContent);
        setTitle(initialTitle ? decodeURIComponent(initialTitle) : "Voice Note");
        setIsVoiceNote(isVoice);
        
        // Set voice tag
        setTags(['voice']);
        
        // Set the bin if provided
        if (voiceBinId) {
          const binId = parseInt(voiceBinId);
          if (!isNaN(binId)) {
            setSelectedBinId(binId);
          }
        }
        
        // Clear URL parameters after processing
        window.history.replaceState({}, '', '/create');
      } else {
        console.error('Invalid voice content received:', decodedContent);
      }
    } else {
      console.log('No special URL params detected, normal create mode');
    }
  }, []);

  // Auto-select Sort Later bin as default (when no bin is selected and no draft loaded)
  useEffect(() => {
    if (bins.length > 0 && !selectedBinId && !editingId) {
      const sortLaterBin = bins.find(bin => bin.name === "Sort Later");
      if (sortLaterBin) {
        setSelectedBinId(sortLaterBin.id);
      }
    }
  }, [bins, selectedBinId, editingId]);

  // Load existing thoughtmark for editing
  const loadThoughtmark = async (id: number) => {
    try {
      const response = await apiRequest("GET", `/api/thoughtmarks/${id}`);
      if (response.ok) {
        const thoughtmark = await response.json();
        setTitle(thoughtmark.title);
        setContent(thoughtmark.content);
        setSelectedBinId(thoughtmark.binId);
        setTags(thoughtmark.tags || []);
        setIsTask(thoughtmark.isTask || false);
        setDueDate(thoughtmark.dueDate || "");
        setPriority(thoughtmark.priority || "medium");
      }
    } catch (error) {
      console.error("Failed to load thoughtmark:", error);
      toast({
        title: "Failed to load thoughtmark",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  // Smart content analysis
  useEffect(() => {
    if (content.length > 10) {
      const analysis = smartCategorizationEngine.analyzeContent(content, bins);
      setSmartSuggestions(analysis);
      
      // Auto-suggest bin if high confidence and none selected
      if (!selectedBinId && analysis.suggestedBin && analysis.confidence > 0.7) {
        setSelectedBinId(analysis.suggestedBin.id);
      }
    } else {
      setSmartSuggestions(null);
    }
  }, [content, bins, selectedBinId]);

  // Form validation
  useEffect(() => {
    setIsFormValid(title.trim().length > 0 && content.trim().length > 0);
  }, [title, content]);

  // Auto-save draft
  useEffect(() => {
    if (title || content) {
      clearTimeout(autoSaveTimer.current);
      autoSaveTimer.current = setTimeout(() => {
        const draft = { title, content, selectedBinId, tags, isTask, dueDate, priority };
        localStorage.setItem('thoughtmark-draft', JSON.stringify(draft));
        setLastSaved(new Date());
      }, 2000);
    }
    
    return () => clearTimeout(autoSaveTimer.current);
  }, [title, content, selectedBinId, tags, isTask, dueDate, priority]);

  // Load draft on mount
  useEffect(() => {
    const savedDraft = localStorage.getItem('thoughtmark-draft');
    if (savedDraft) {
      try {
        const draft = JSON.parse(savedDraft);
        setTitle(draft.title || "");
        setContent(draft.content || "");
        setSelectedBinId(draft.selectedBinId || null);
        setTags(draft.tags || []);
        setIsTask(draft.isTask || false);
        setDueDate(draft.dueDate || "");
        setPriority(draft.priority || "medium");
      } catch (error) {
        console.warn("Failed to load draft:", error);
      }
    }
  }, []);

  const createMutation = useMutation({
    mutationFn: async (thoughtmarkData: any) => {
      const url = editingId ? `/api/thoughtmarks/${editingId}` : "/api/thoughtmarks";
      const method = editingId ? "PATCH" : "POST";
      const response = await apiRequest(method, url, thoughtmarkData);
      if (!response.ok) throw new Error(`Failed to ${editingId ? 'update' : 'create'} thoughtmark`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/thoughtmarks"] });
      localStorage.removeItem('thoughtmark-draft');
    },
    onError: () => {
      toast({
        title: `Failed to ${editingId ? 'update' : 'create'} thoughtmark`,
        description: "Please try again",
        variant: "destructive",
      });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      if (!editingId) throw new Error("No thoughtmark to delete");
      const response = await apiRequest("DELETE", `/api/thoughtmarks/${editingId}`);
      if (!response.ok) throw new Error("Failed to delete thoughtmark");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/thoughtmarks"] });
      toast({
        title: "Thoughtmark deleted",
        description: "Your thoughtmark has been removed",
      });
      setLocation("/all-thoughtmarks");
    },
    onError: () => {
      toast({
        title: "Failed to delete thoughtmark",
        description: "Please try again",
        variant: "destructive",
      });
    }
  });

  const archiveMutation = useMutation({
    mutationFn: async () => {
      if (!editingId) throw new Error("No thoughtmark to archive");
      const response = await apiRequest("PATCH", `/api/thoughtmarks/${editingId}`, { 
        isArchived: true 
      });
      if (!response.ok) throw new Error("Failed to archive thoughtmark");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/thoughtmarks"] });
      toast({
        title: "Thoughtmark archived",
        description: "Your thoughtmark has been moved to archive",
      });
      setLocation("/all-thoughtmarks");
    },
    onError: () => {
      toast({
        title: "Failed to archive thoughtmark",
        description: "Please try again",
        variant: "destructive",
      });
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    const thoughtmarkData = {
      title: title.trim(),
      content: content.trim(),
      binId: selectedBinId,
      tags,
      isTask,
      dueDate: dueDate || null,
      priority: isTask ? priority : null,
    };

    createMutation.mutate(thoughtmarkData);
  };

  const handleSaveAndExit = () => {
    if (!isFormValid) return;
    
    const thoughtmarkData = {
      title: title.trim(),
      content: content.trim(),
      binId: selectedBinId,
      tags,
      isTask,
      dueDate: dueDate || null,
      priority: isTask ? priority : null,
    };

    createMutation.mutate(thoughtmarkData, {
      onSuccess: () => {
        toast({
          title: editingId ? "Thoughtmark updated" : "Thoughtmark created",
          description: "Your idea has been saved successfully",
        });
        setLocation("/all-thoughtmarks");
      }
    });
  };

  const handleSaveAndNew = () => {
    if (!isFormValid) return;
    
    const thoughtmarkData = {
      title: title.trim(),
      content: content.trim(),
      binId: selectedBinId,
      tags,
      isTask,
      dueDate: dueDate || null,
      priority: isTask ? priority : null,
    };

    createMutation.mutate(thoughtmarkData, {
      onSuccess: () => {
        toast({
          title: editingId ? "Thoughtmark updated" : "Thoughtmark created",
          description: "Starting new thoughtmark...",
        });
        // Reset form for new thoughtmark
        setTitle("");
        setContent("");
        setSelectedBinId(null);
        setTags([]);
        setIsTask(false);
        setDueDate("");
        setPriority("medium");
        setEditingId(null);
        setIsVoiceNote(false);
        localStorage.removeItem('thoughtmark-draft');
        // Remove URL params
        window.history.pushState({}, '', '/create');
      }
    });
  };

  const handleCancel = () => {
    localStorage.removeItem('thoughtmark-draft');
    setLocation("/");
  };

  const handleDelete = () => {
    if (editingId && window.confirm("Are you sure you want to delete this thoughtmark? This action cannot be undone.")) {
      deleteMutation.mutate();
    }
  };

  const handleArchive = () => {
    if (editingId && window.confirm("Are you sure you want to archive this thoughtmark?")) {
      archiveMutation.mutate();
    }
  };

  // Validation functions
  const validateTitle = (value: string) => {
    if (value.length === 0) return "Title is required";
    if (value.length > 100) return "Title must be under 100 characters";
    return null;
  };

  const validateContent = (value: string) => {
    if (value.length === 0) return "Content is required";
    if (value.length > 10000) return "Content must be under 10,000 characters";
    return null;
  };

  // Loading state - moved to after all hooks
  if (binsLoading) {
    return (
      <PersistentLayout>
        <div className="max-w-2xl mx-auto px-4 py-8">
          <LoadingScreen isVisible={true} />
        </div>
      </PersistentLayout>
    );
  }

  return (
    <PersistentLayout>
      <div className="max-w-2xl mx-auto px-4 py-8 animate-fade-in">
        <div className="mb-8">
          <h1 className="section-title text-2xl mb-2">
            + ADD NEW THOUGHTMARK
          </h1>
          <p className="text-gray-400">Capture your ideas with AI-powered organization</p>
          <AutoSaveIndicator status={saveStatus} />
          {lastSaved && (
            <p className="text-xs text-gray-500 mt-1">
              Draft saved {lastSaved.toLocaleTimeString()}
            </p>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Smart suggestions - expanded by default */}
          {smartSuggestions && (
            <div className="bg-[#202124] border border-[#C6D600]/20 rounded-lg p-4 animate-scale-in">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4 text-[#C6D600]" />
                <span className="text-sm font-medium text-[#C6D600]">
                  AI Suggestions (confidence: {Math.round(smartSuggestions.confidence * 100)}%)
                </span>
              </div>
              
              {smartSuggestions.suggestedTags.length > 0 && (
                <div className="mb-3">
                  <p className="text-xs text-gray-400 mb-2">Suggested tags:</p>
                  <div className="flex gap-2 flex-wrap">
                    {smartSuggestions.suggestedTags.map(tag => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => {
                          if (!tags.includes(tag)) {
                            setTags([...tags, tag]);
                          }
                        }}
                        className="px-2 py-1 text-xs bg-[#C6D600]/10 border border-[#C6D600]/20 rounded-full text-[#C6D600] hover:bg-[#C6D600]/20 transition-all duration-200 touch-target"
                      >
                        #{tag}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              {smartSuggestions.suggestedBin && (
                <div>
                  <p className="text-xs text-gray-400 mb-2">Suggested bin:</p>
                  <button
                    type="button"
                    onClick={() => setSelectedBinId(smartSuggestions.suggestedBin!.id)}
                    className="px-3 py-2 text-sm bg-[#C6D600]/10 border border-[#C6D600]/20 rounded-lg text-[#C6D600] hover:bg-[#C6D600]/20 transition-all duration-200 touch-target"
                  >
                    {smartSuggestions.suggestedBin.name}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Title */}
          <ValidatedInput
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            validation={validateTitle}
            placeholder="What's on your mind?"
            className="text-lg"
            maxLength={100}
          />

          {/* Content */}
          <div className="space-y-2">
            <Label htmlFor="content" className="text-sm font-medium text-gray-300">
              Content
            </Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Elaborate on your thought..."
              className="min-h-[120px] bg-[#202124] border border-border text-white placeholder-gray-400 focus:ring-2 focus:ring-[#C6D600]/50 transition-all duration-200"
              maxLength={10000}
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>{validateContent(content) || ""}</span>
              <span>{content.length}/10,000</span>
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-300">Tags</Label>
            <SmartTagInput
              value={tags}
              onChange={setTags}
              suggestions={smartSuggestions?.suggestedTags || []}
              placeholder="Add tags to organize your thought..."
            />
          </div>

          {/* Bin Assignment */}
          <div className="space-y-2 relative" style={{ zIndex: 1 }}>
            <Label className="text-sm font-medium text-gray-300">Bin Assignment</Label>
            <Select value={selectedBinId?.toString() || "none"} onValueChange={(value) => {
              if (value === "none") {
                setSelectedBinId(null);
              } else {
                const binId = parseInt(value, 10);
                if (!isNaN(binId)) {
                  setSelectedBinId(binId);
                }
              }
            }}>
              <SelectTrigger className="bg-[#202124] border border-border text-white">
                <SelectValue placeholder="Sort Later (default)" />
              </SelectTrigger>
              <SelectContent className="bg-[#202124] border border-border">
                {/* Suggested/Recent bins at top */}
                <SelectItem value="none">Sort Later</SelectItem>
                {bins.find(b => b.name === "Examples") && (
                  <SelectItem value={bins.find(b => b.name === "Examples")!.id.toString()}>
                    Examples
                  </SelectItem>
                )}
                {/* Divider for other bins */}
                {bins.filter(b => !["Sort Later", "Examples"].includes(b.name)).length > 0 && (
                  <div className="border-t border-gray-700 my-1" />
                )}
                {bins
                  .filter(b => !["Sort Later", "Examples"].includes(b.name))
                  .map(bin => (
                    <SelectItem key={bin.id} value={bin.id.toString()}>
                      {bin.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          {/* Task settings */}
          <div className="space-y-4 relative" style={{ zIndex: 1 }}>
            <div className="flex items-center justify-between relative" style={{ zIndex: 1 }}>
              <div className="flex items-center gap-2">
                <Label htmlFor="isTask" className="text-sm font-medium text-gray-300">
                  Make this a task
                </Label>
                <AlertCircle className="w-4 h-4 text-gray-400" />
              </div>
              <Switch
                id="isTask"
                checked={isTask}
                onCheckedChange={setIsTask}
                style={{ zIndex: 1 }}
              />
            </div>

            {isTask && (
              <div className="space-y-4 pl-4 border-l-2 border-[#C6D600]/20 animate-slide-up">
                <div className="space-y-2">
                  <Label htmlFor="dueDate" className="text-sm font-medium text-gray-300">
                    Due Date (optional)
                  </Label>
                  <input
                    id="dueDate"
                    type="datetime-local"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full px-3 py-2 bg-[#202124] border border-border rounded-lg text-white focus:ring-2 focus:ring-[#C6D600]/50 transition-all duration-200"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-300">Priority</Label>
                  <div className="flex gap-2">
                    {["low", "medium", "high"].map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setPriority(p as any)}
                        className={`px-3 py-2 rounded-lg text-sm transition-all duration-200 touch-target ${
                          priority === p
                            ? "bg-[#C6D600] text-black"
                            : "bg-[#202124] border border-border text-gray-300 hover:border-[#C6D600]"
                        }`}
                      >
                        {p.charAt(0).toUpperCase() + p.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="space-y-4 pt-4 relative" style={{ zIndex: 1 }}>
            {/* Primary Actions */}
            <div className="flex gap-3 relative" style={{ zIndex: 1 }}>
              <EnhancedButton
                type="button"
                onClick={handleCancel}
                variant="outline"
                className="flex-1 touch-target"
                style={{ zIndex: 1 }}
              >
                Cancel
              </EnhancedButton>
              <EnhancedButton
                type="button"
                onClick={handleSaveAndExit}
                disabled={!isFormValid || createMutation.isPending}
                className="flex-1 bg-[#C6D600] text-black hover:bg-[#B5C100] disabled:opacity-50 touch-target"
                style={{ zIndex: 1 }}
              >
                <Save className="w-4 h-4 mr-2" />
                {createMutation.isPending ? "Saving..." : "Save & Exit"}
              </EnhancedButton>
            </div>

            {/* Secondary Actions */}
            <div className="flex gap-3 relative" style={{ zIndex: 1 }}>
              <EnhancedButton
                type="button"
                onClick={handleSaveAndNew}
                disabled={!isFormValid || createMutation.isPending}
                variant="outline"
                className="flex-1 touch-target"
                style={{ zIndex: 1 }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Save & New
              </EnhancedButton>
              
              {editingId && (
                <>
                  <EnhancedButton
                    type="button"
                    onClick={handleArchive}
                    disabled={archiveMutation.isPending}
                    variant="outline"
                    className="flex-1 touch-target text-yellow-500 border-yellow-500/20 hover:bg-yellow-500/10"
                    style={{ zIndex: 1 }}
                  >
                    <Archive className="w-4 h-4 mr-2" />
                    Archive
                  </EnhancedButton>
                  <EnhancedButton
                    type="button"
                    onClick={handleDelete}
                    disabled={deleteMutation.isPending}
                    variant="outline"
                    className="flex-1 touch-target text-red-500 border-red-500/20 hover:bg-red-500/10"
                    style={{ zIndex: 1 }}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </EnhancedButton>
                </>
              )}
            </div>

            {editingId && isVoiceNote && (
              <div className="text-xs text-gray-500 text-center">
                Voice note from AI processing • Editing mode
              </div>
            )}
          </div>
        </form>
      </div>
    </PersistentLayout>
  );
}