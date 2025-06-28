import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { useLocation } from "wouter";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Square, X, Wand2, Save, ArrowRight, Mic, MicOff, RefreshCw, Sparkles, Calendar, AlertTriangle, Send, TestTube, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useBins } from "@/hooks/use-bins";
import { voiceHandler } from "@/lib/voice-handler";

interface ProcessedVoiceData {
  suggestedTitle: string;
  enhancedContent: string;
  suggestedTags: string[];
  suggestedBinId: number | null;
  priority: "low" | "medium" | "high";
  isTask: boolean;
  dueDate?: string;
  confidence: number;
}

interface SmartSuggestions {
  alternativeTitles: string[];
  additionalTags: string[];
  relatedTopics: string[];
}

interface EnhancedVoiceRecorderProps {
  isOpen: boolean;
  onClose: () => void;
}

export function EnhancedVoiceRecorder({ isOpen, onClose }: EnhancedVoiceRecorderProps) {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: bins = [] } = useBins();

  // Recording state
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [recordingStage, setRecordingStage] = useState<'ready' | 'listening' | 'processing' | 'complete'>('ready');

  // AI processed data
  const [processedData, setProcessedData] = useState<ProcessedVoiceData | null>(null);
  const [smartSuggestions, setSmartSuggestions] = useState<SmartSuggestions | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Form state (editable)
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedBinId, setSelectedBinId] = useState<number | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [isTask, setIsTask] = useState(false);
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");
  const [dueDate, setDueDate] = useState("");
  const [newTag, setNewTag] = useState("");

  // Auto-save state
  const [hasAutoSaved, setHasAutoSaved] = useState(false);
  const [autoSaveId, setAutoSaveId] = useState<number | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recognitionRef = useRef<any>(null);
  const transcriptRef = useRef<string>("");
  const streamRef = useRef<MediaStream | null>(null);
  const autoStartedRef = useRef(false);

  // Auto-start recording when modal opens
  useEffect(() => {
    if (isOpen && !autoStartedRef.current) {
      autoStartedRef.current = true;
      setRecordingStage('ready');
      // Auto-start recording after a brief delay
      const timer = setTimeout(() => {
        startRecording();
      }, 500);
      return () => clearTimeout(timer);
    }
    
    if (!isOpen) {
      autoStartedRef.current = false;
      cleanup();
    }
  }, [isOpen]);

  // Cleanup when modal closes
  useEffect(() => {
    return () => {
      cleanup();
    };
  }, []);

  const cleanup = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (error) {
        console.log('Error stopping speech recognition:', error);
      }
    }
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => {
        track.stop();
        console.log('Stopped microphone track:', track.kind);
      });
      streamRef.current = null;
    }
    setIsRecording(false);
  };

  const startRecording = async () => {
    try {
      setTranscript("");
      transcriptRef.current = "";
      setRecordingStage('listening');
      
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      
      mediaRecorderRef.current = new MediaRecorder(stream);
      
      // Use Web Speech API for real-time transcription
      if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
        recognitionRef.current = new SpeechRecognition();
        
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = 'en-US';
        
        recognitionRef.current.onresult = (event: any) => {
          let finalTranscript = '';
          let interimTranscript = '';
          
          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              finalTranscript += transcript;
            } else {
              interimTranscript += transcript;
            }
          }
          
          if (finalTranscript) {
            transcriptRef.current += finalTranscript;
            console.log('Speech recognition - final transcript added:', finalTranscript);
            console.log('Speech recognition - total transcript:', transcriptRef.current);
          }
          
          const displayTranscript = transcriptRef.current + interimTranscript;
          setTranscript(displayTranscript);
          console.log('Speech recognition - display transcript:', displayTranscript);
        };
        
        recognitionRef.current.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error);
        };
        
        recognitionRef.current.onstart = () => {
          console.log('Speech recognition started');
        };
        
        recognitionRef.current.onend = () => {
          console.log('Speech recognition ended');
        };
        
        recognitionRef.current.start();
      }
      
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
      toast({
        title: "Recording Error",
        description: "Could not start recording. Please check microphone permissions.",
        variant: "destructive",
      });
    }
  };

  const stopRecording = async () => {
    cleanup();
    setIsRecording(false);
    setRecordingStage('processing');
    
    // Get transcript from current state as well as ref
    const finalTranscript = transcriptRef.current.trim() || transcript.trim();
    console.log('Stopping recording, final transcript:', finalTranscript);
    console.log('Transcript ref:', transcriptRef.current);
    console.log('Transcript state:', transcript);
    
    if (finalTranscript) {
      await processTranscription(finalTranscript);
    } else {
      console.log('No transcript available, closing recorder');
      setRecordingStage('ready');
      onClose();
    }
  };

  // Process transcription and save directly to backend
  const processTranscription = async (transcriptionText: string) => {
    try {
      console.log('Processing transcription:', transcriptionText);
      setIsProcessing(true);
      
      // Validate transcription text
      if (!transcriptionText || transcriptionText.trim().length < 2) {
        console.error('Transcription text too short:', transcriptionText);
        toast({
          title: "Recording too short",
          description: "Please speak for at least a few words.",
          variant: "destructive",
        });
        setIsProcessing(false);
        setRecordingStage('ready');
        return;
      }
      
      // Import apiRequest function
      const { apiRequest } = await import('@/lib/queryClient');
      
      // Get bins to find "Sort Later" bin
      console.log('Fetching bins...');
      const binsResponse = await apiRequest('GET', '/api/bins');
      const bins = await binsResponse.json();
      console.log('Available bins:', bins);
      const sortLaterBin = bins.find((bin: any) => bin.name === 'Sort Later');
      console.log('Sort Later bin:', sortLaterBin);
      
      // Generate AI-suggested title
      let aiTitle = "Voice Note";
      try {
        console.log('Generating AI title...');
        const aiResponse = await apiRequest('POST', '/api/ai/voice-title', {
          content: transcriptionText
        });
        const aiData = await aiResponse.json();
        if (aiData.title) {
          aiTitle = aiData.title;
          console.log('AI title generated:', aiTitle);
        }
      } catch (aiError) {
        console.log('AI title generation failed, using fallback:', aiError);
        // Fallback: use first 6 words as title
        const words = transcriptionText.trim().split(' ');
        aiTitle = words.length > 6 ? words.slice(0, 6).join(' ') + '...' : transcriptionText.trim();
        console.log('Fallback title:', aiTitle);
      }
      
      // Pass transcription data to create form instead of saving immediately
      console.log('Passing transcription to create form:', {
        title: aiTitle,
        content: transcriptionText,
        binId: sortLaterBin?.id || null
      });
      
      setRecordingStage('complete');
      setIsProcessing(false);
      
      toast({
        title: "Voice transcription ready",
        description: "Opening create form with your voice note",
      });
      
      // Close the recorder
      onClose();
      
      // Navigate to create page with voice content as URL parameters
      const params = new URLSearchParams({
        content: encodeURIComponent(transcriptionText),
        title: encodeURIComponent(aiTitle),
        voice: 'true',
        binId: sortLaterBin?.id?.toString() || ''
      });
      
      setLocation(`/create?${params.toString()}`);
      
    } catch (error) {
      console.error('Error processing voice note:', error);
      setIsProcessing(false);
      setRecordingStage('ready');
      toast({
        title: "Save Error",
        description: `Could not save the voice note: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive",
      });
    }
  };

  // Manual text submission for fallback
  const handleManualSubmit = () => {
    const manualText = transcript.trim();
    if (manualText) {
      processTranscription(manualText);
    } else {
      toast({
        title: "No content",
        description: "Please speak something or type manually",
        variant: "destructive",
      });
    }
  };

  // Auto-save thoughtmark as draft
  const autoSaveThoughtmark = async (data: ProcessedVoiceData) => {
    try {
      const response = await apiRequest("POST", "/api/thoughtmarks", {
        title: data.suggestedTitle,
        content: data.enhancedContent,
        tags: data.suggestedTags,
        binId: data.suggestedBinId,
        isTask: data.isTask,
        priority: data.priority,
        dueDate: data.dueDate || null,
        isPinned: false
      });
      
      if (response.ok) {
        const savedThoughtmark = await response.json();
        setAutoSaveId(savedThoughtmark.id);
        setHasAutoSaved(true);
        
        toast({
          title: "Auto-saved",
          description: "Voice note automatically saved as draft",
        });
      }
    } catch (error) {
      console.error('Auto-save error:', error);
    }
  };

  // Generate additional AI suggestions
  const generateAdditionalSuggestions = async (title: string, content: string, existingTags: string[]) => {
    try {
      const response = await apiRequest("POST", "/api/voice/suggestions", {
        title,
        content,
        existingTags
      });
      
      if (response.ok) {
        const suggestions: SmartSuggestions = await response.json();
        setSmartSuggestions(suggestions);
      }
    } catch (error) {
      console.error('Error generating suggestions:', error);
    }
  };

  // Save final thoughtmark
  const saveThoughtmarkMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        title: title.trim(),
        content: content.trim(),
        tags,
        binId: selectedBinId,
        isTask,
        priority,
        dueDate: dueDate ? new Date(dueDate).toISOString() : null,
        isPinned: false
      };

      if (autoSaveId) {
        // Update existing auto-saved thoughtmark
        const response = await apiRequest("PATCH", `/api/thoughtmarks/${autoSaveId}`, payload);
        if (!response.ok) throw new Error("Failed to update thoughtmark");
        return response.json();
      } else {
        // Create new thoughtmark
        const response = await apiRequest("POST", "/api/thoughtmarks", payload);
        if (!response.ok) throw new Error("Failed to create thoughtmark");
        return response.json();
      }
    },
    onSuccess: (thoughtmark) => {
      queryClient.invalidateQueries({ queryKey: ["/api/thoughtmarks"] });
      queryClient.invalidateQueries({ queryKey: ["/api/bins"] });
      
      toast({
        title: "Success",
        description: "Voice note saved successfully",
      });
      
      onClose();
      
      // Navigate to the thoughtmark
      setLocation(`/thoughtmarks/${thoughtmark.id}`);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to save thoughtmark",
        variant: "destructive",
      });
    },
  });

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const applySuggestion = (type: 'title' | 'tag', value: string) => {
    if (type === 'title') {
      setTitle(value);
    } else if (type === 'tag' && !tags.includes(value)) {
      setTags([...tags, value]);
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return "text-green-400";
    if (confidence >= 0.6) return "text-yellow-400";
    return "text-red-400";
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "text-red-400";
      case "medium": return "text-yellow-400";
      case "low": return "text-green-400";
      default: return "text-gray-400";
    }
  };

  if (!isOpen) return null;

  const getStageContent = () => {
    switch (recordingStage) {
      case 'ready':
        return {
          title: "Voice Recorder",
          message: "Preparing to listen...",
          icon: <Mic className="w-16 h-16 text-blue-500" />,
          showCancel: true
        };
      case 'listening':
        return {
          title: "Now listening...",
          message: transcript || "Tell me about your idea, task, or thought. I'll capture and organize it for you.",
          icon: <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center animate-pulse">
            <Mic className="w-8 h-8 text-white" />
          </div>,
          showCancel: true
        };
      case 'processing':
        return {
          title: "Processing...",
          message: "Creating your thoughtmark...",
          icon: <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />,
          showCancel: false
        };
      case 'complete':
        return {
          title: "Saved!",
          message: "Your voice note has been saved successfully",
          icon: <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
            <Check className="w-8 h-8 text-white" />
          </div>,
          showCancel: false
        };
    }
  };

  const stageContent = getStageContent();

  return createPortal(
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
      {/* iOS-style Modal */}
      <div className="bg-gray-900/95 backdrop-blur-xl rounded-3xl mx-4 max-w-sm w-full shadow-2xl border border-gray-700/50">
        {/* Cancel Button */}
        {stageContent.showCancel && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-800/80 flex items-center justify-center z-10 hover:bg-gray-700/80 transition-colors"
          >
            <X className="w-4 h-4 text-gray-300" />
          </button>
        )}
        
        {/* Content */}
        <div className="p-8 text-center">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            {stageContent.icon}
          </div>
          
          {/* Title */}
          <h2 className="text-xl font-semibold text-white mb-4">
            {stageContent.title}
          </h2>
          
          {/* Message/Transcript */}
          <div className="text-gray-300 text-base leading-relaxed min-h-[60px] flex items-center justify-center">
            {recordingStage === 'listening' && transcript ? (
              <div className="bg-gray-800/50 rounded-2xl p-4 max-h-32 overflow-y-auto">
                <p className="text-sm text-left">{transcript}</p>
              </div>
            ) : (
              <p className="text-center">{stageContent.message}</p>
            )}
          </div>
          
          {/* Action Buttons */}
          {recordingStage === 'listening' && (
            <div className="mt-8 flex justify-center gap-4">
              <button
                onClick={stopRecording}
                className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-full font-medium transition-colors flex items-center gap-2"
              >
                <Square className="w-4 h-4" />
                Stop & Save
              </button>
            </div>
          )}
          
          {/* Manual Test Button */}
          {recordingStage === 'ready' && (
            <div className="mt-6 flex flex-col gap-3">
              <button
                onClick={() => processTranscription("This is a test voice note to verify the thoughtmark creation functionality is working properly.")}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-2 justify-center"
              >
                <TestTube className="w-4 h-4" />
                Test Save Function
              </button>
              <div className="text-xs text-gray-400 space-y-1">
                <p>Try saying:</p>
                <p>"Remind me to call John tomorrow"</p>
                <p>"I had an idea about improving our workflow"</p>
                <p>"Note: The meeting went well, next steps are..."</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}