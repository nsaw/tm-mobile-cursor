import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { DraggableBins } from "@/components/draggable-bins";
import { ThoughtmarkCard } from "@/components/thoughtmark-card";
import { PersistentLayout } from "@/components/persistent-layout";

import { IntroOverlay } from "@/components/intro-overlay";
import { AuthPromptDialog } from "@/components/auth-prompt-dialog";
import { ThoughtmarkInsights } from "@/components/thoughtmark-insights";
import { LoadingScreen } from "@/components/loading-screen";
import { InteractiveCard, EnhancedButton, SmartTagInput } from "@/components/enhanced-interactions";
import { PremiumFeatureWrapper } from "@/components/premium-overlay";
import { useOptimisticUpdates, useAutoSave } from "@/hooks/use-optimistic-updates";
import { SwipeGesture, useHapticFeedback } from "@/components/gesture-navigation";
import { NativeScroll } from "@/components/native-scroll";
import { SwipeCard } from "@/components/swipe-dismissible";
import { useUndoRedo } from "@/hooks/use-undo-redo";
import { smartCategorizationEngine } from "@/lib/smart-categorization";


import { useAuth } from "@/hooks/use-auth";
import { Settings, Plus, ChevronDown, ChevronUp, Filter, MoreHorizontal, Brain, ArrowRight, Crown, CheckSquare, Square, Clock, RefreshCw, Check, Archive } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useBins } from "@/hooks/use-bins";
import { useThoughtmarks } from "@/hooks/use-thoughtmarks";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { BinWithCount } from "@shared/schema";
import { CanonicalHead, canonicalConfigs } from "@/components/canonical-head";


export default function Dashboard() {
  const [, setLocation] = useLocation();
  const [showBinsSection, setShowBinsSection] = useState(true);
  const [showThoughtmarksSection, setShowThoughtmarksSection] = useState(true);
  const [showIntro, setShowIntro] = useState(false);
  const [selectedTag, setSelectedTag] = useState<string>("all");
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);
  const [authPromptFeature, setAuthPromptFeature] = useState("");
  const [authInitialMode, setAuthInitialMode] = useState<"login" | "signup" | "pin">("login");
  const [showTasksSection, setShowTasksSection] = useState(true);


  // All hooks must be called unconditionally
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { 
    addOptimisticUpdate, 
    removeOptimisticUpdate, 
    applyOptimisticUpdates, 
    isOptimistic 
  } = useOptimisticUpdates();
  const { saveStatus, save } = useAutoSave();
  const { addAction, undo, redo, canUndo, canRedo } = useUndoRedo();
  const { triggerImpact, triggerSelection, triggerNotification } = useHapticFeedback();
  
  const { data: bins = [], isLoading: binsLoading } = useBins();
  const { data: thoughtmarks = [], isLoading: thoughtmarksLoading } = useThoughtmarks();
  
  // All mutations must be called before any conditional returns
  const reorderBinsMutation = useMutation({
    mutationFn: async (newOrder: BinWithCount[]) => {
      if (typeof window !== 'undefined') {
        localStorage.setItem('bins-order', JSON.stringify(newOrder.map(b => b.id)));
      }
      
      const response = await apiRequest("POST", "/api/bins/reorder", { 
        binOrder: newOrder.map(b => b.id) 
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/bins'] });
    }
  });

  const deleteThoughtmarkMutation = useMutation({
    mutationFn: async (thoughtmarkId: number) => {
      const response = await apiRequest("DELETE", `/api/thoughtmarks/${thoughtmarkId}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/thoughtmarks'] });
      toast({
        title: "Thoughtmark deleted",
        description: "The thoughtmark has been successfully deleted."
      });
    },
    onError: () => {
      toast({
        title: "Delete failed",
        description: "Could not delete the thoughtmark. Please try again.",
        variant: "destructive"
      });
    }
  });

  const archiveThoughtmarkMutation = useMutation({
    mutationFn: async (thoughtmarkId: number) => {
      const response = await apiRequest("DELETE", `/api/thoughtmarks/${thoughtmarkId}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/thoughtmarks'] });
      toast({
        title: "Thoughtmark archived",
        description: "The thoughtmark has been moved to archive."
      });
    },
    onError: () => {
      toast({
        title: "Archive failed",
        description: "Could not archive the thoughtmark. Please try again.",
        variant: "destructive"
      });
    }
  });

  // Handle premium invite links
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const premiumInviteToken = urlParams.get('premium-invite');
    
    if (premiumInviteToken && user && isAuthenticated) {
      handlePremiumInvite(premiumInviteToken);
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [user, isAuthenticated]);

  // Check for onboarding display logic
  useEffect(() => {
    if (!user?.email) return;
    
    const isDemoUser = user?.email === 'hello@thoughtmarks.app' || user?.email === 'applereview@thoughtmarks.app' || user?.email === 'test@thoughtmarks.app' || user?.isTestUser;
    
    // For demo users, show onboarding only once per session (cleared on logout)
    if (isDemoUser && bins.length > 0 && !binsLoading && !thoughtmarksLoading) {
      const hasSeenIntroThisSession = sessionStorage.getItem('hasSeenIntroThisSession');
      if (!hasSeenIntroThisSession) {
        setShowIntro(true);
      }
      return;
    }
    
    // For non-demo users, check if they've seen intro before
    const hasSeenIntro = localStorage.getItem('hasSeenIntro');
    
    // Show intro if data has loaded and they haven't seen it
    if (bins.length > 0 && !binsLoading && !thoughtmarksLoading && !hasSeenIntro) {
      setShowIntro(true);
    }
  }, [bins.length, thoughtmarks.length, binsLoading, thoughtmarksLoading, user]);

  // Custom Siri voice recording handler - now handled by persistent layout
  useEffect(() => {
    const handleSiriVoiceRecord = (event: CustomEvent) => {
      console.log("Siri voice record event received:", event.detail);
      // Voice recording is now handled by the persistent layout
      // Trigger the global voice recorder
      const voiceEvent = new CustomEvent('trigger-voice-recorder');
      window.dispatchEvent(voiceEvent);
    };

    // Listen for Siri shortcut voice recording
    window.addEventListener('siri-voice-record', handleSiriVoiceRecord as EventListener);

    return () => {
      window.removeEventListener('siri-voice-record', handleSiriVoiceRecord as EventListener);
    };
  }, []);

  // Show skeleton only if BOTH are loading AND have no data
  if ((binsLoading || thoughtmarksLoading) && bins.length === 0 && thoughtmarks.length === 0) {
    return (
      <PersistentLayout>
        <LoadingScreen isVisible={true} />
      </PersistentLayout>
    );
  }

  // Apply optimistic updates to thoughtmarks first
  const enhancedThoughtmarks = applyOptimisticUpdates(thoughtmarks);

  // Smart categorization suggestions
  const contextualSuggestions = user ? smartCategorizationEngine.generateContextualSuggestions(enhancedThoughtmarks) : null;

  // Enhanced task completion with optimistic updates
  const handleTaskToggle = async (taskId: number) => {
    // Optimistic update
    addOptimisticUpdate(taskId, { isCompleted: true });
    
    try {
      await save(async () => {
        await apiRequest("PATCH", `/api/thoughtmarks/${taskId}/toggle-completion`);
        queryClient.invalidateQueries({ queryKey: ["/api/thoughtmarks"] });
      });
      removeOptimisticUpdate(taskId);
    } catch (error) {
      removeOptimisticUpdate(taskId);
      toast({
        title: "Failed to update task",
        description: "Please try again",
        variant: "destructive"
      });
    }
  };

  // Smart bin categorization for new thoughtmarks
  const suggestBinForContent = (content: string) => {
    return smartCategorizationEngine.analyzeContent(content, bins).suggestedBin;
  };

  const handlePremiumInvite = async (token: string) => {
    try {
      // Decode token to get duration
      const decoded = atob(token);
      const [email, days, expiryTimestamp] = decoded.split(':');
      
      // Check if token is still valid
      const now = Date.now();
      if (parseInt(expiryTimestamp) < now) {
        toast({
          title: "Link Expired",
          description: "This premium invite link has expired",
          variant: "destructive"
        });
        return;
      }

      // Grant premium access to current user
      if (!user) return;
      const response = await apiRequest("POST", `/api/users/${user.id}`, {
        isPremium: true,
        isTestUser: true,
        premiumExpiresAt: new Date(Date.now() + parseInt(days) * 24 * 60 * 60 * 1000)
      });

      if (response.ok) {
        const updatedUser = await response.json();
        localStorage.setItem('thoughtmarks-user', JSON.stringify(updatedUser));
        
        toast({
          title: "Premium Access Activated!",
          description: `You now have ${days} days of premium features`
        });
        
        setTimeout(() => window.location.reload(), 2000);
      } else {
        throw new Error("Failed to activate premium access");
      }
    } catch (error: any) {
      toast({
        title: "Activation Failed",
        description: error.message || "Could not activate premium access",
        variant: "destructive"
      });
    }
  };



  const handleBinClick = (bin: BinWithCount) => {
    setLocation(`/bin/${bin.id}`);
  };

  const handleBinsReorder = (newOrder: BinWithCount[]) => {
    reorderBinsMutation.mutate(newOrder);
  };



  const handleIntroClose = () => {
    setShowIntro(false);
    const isDemoUser = user?.email === 'hello@thoughtmarks.app' || user?.email === 'applereview@thoughtmarks.app' || user?.email === 'test@thoughtmarks.app' || user?.isTestUser;
    
    if (isDemoUser) {
      // Demo profile: mark as seen for this session only (resets on new login)
      sessionStorage.setItem('hasSeenIntroThisSession', 'true');
    } else {
      // Template users: mark as seen permanently (first session only)
      localStorage.setItem('hasSeenIntro', 'true');
    }
  };

  // Helper function to open auth dialog in specific mode
  const openAuthDialog = (feature: string, mode: "login" | "signup" | "pin" = "login") => {
    setAuthPromptFeature(feature);
    setAuthInitialMode(mode);
    setShowAuthPrompt(true);
  };



  // Get recent thoughtmarks (last 5) with tag filtering
  const filteredThoughtmarks = thoughtmarks
    .filter(t => !t.isDeleted)
    .filter(t => selectedTag === "all" || t.tags.includes(selectedTag));

  const recentThoughtmarks = filteredThoughtmarks
    .sort((a, b) => {
      // First sort by pinned status (pinned items first)
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      // Then sort by creation date (newest first)
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    })
    .slice(0, 5);

  // Get unique tags from all thoughtmarks
  const allTags = Array.from(new Set(thoughtmarks.flatMap(t => t.tags || [])));

  // Tag color mapping function with expanded palette
  const getTagColor = (tag: string) => {
    const colors = [
      '#C6D600', // Bright lime
      '#FF6B6B', // Coral red
      '#4ECDC4', // Turquoise
      '#45B7D1', // Sky blue
      '#96CEB4', // Mint green
      '#FECA57', // Golden yellow
      '#FF9FF3', // Pink
      '#54A0FF', // Blue
      '#5F27CD', // Purple
      '#00D2D3', // Cyan
      '#FF9F43', // Orange
      '#10AC84', // Emerald
      '#EE5A6F', // Rose
      '#C44569', // Magenta
      '#F8B500', // Amber
      '#6C5CE7', // Lavender
      '#A55EEA', // Violet
      '#26DE81', // Green
      '#FC427B', // Hot pink
      '#FD79A8', // Light pink
      '#FDCB6E', // Peach
      '#6C5CE7', // Indigo
      '#74B9FF', // Light blue
      '#00B894', // Teal
      '#E84393', // Dark pink
      '#00CEC9', // Aqua
      '#FDCB6E', // Sand
      '#E17055', // Terracotta
      '#81ECEC', // Light cyan
      '#FAB1A0'  // Salmon
    ];
    const index = tag.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
    return colors[index];
  };

  // Enhanced loading state with meaningful content
  if (binsLoading || thoughtmarksLoading) {
    return <LoadingScreen isVisible={true} />;
  }

  return (
    <div>
      <CanonicalHead {...canonicalConfigs.dashboard} />
      <NativeScroll className="h-full native-scroll">
        <div className="p-6 touch-optimized">
        {/* Header with Logo and Title */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className="w-20 h-20 rounded-lg overflow-hidden mr-6">
              <img 
                src="https://raw.githubusercontent.com/nsaw/imageSrc/main/IMG_4663.jpeg" 
                alt="Thoughtmarks Logo" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="ml-2">
              <h1 className="text-2xl text-white animate-fade-in-up mb-0 site-title dashboard-title" style={{ transform: 'scaleX(1.1)' }}>
                THOUGHTMARKS
              </h1>
              <p className="text-xs neon-gradient-text font-body font-bold -mt-1">bookmarks for your brain</p>
            </div>
          </div>
          <EnhancedButton
            variant="ghost"
            size="sm"
            onClick={() => setLocation('/settings')}
            className="touch-target text-gray-400 hover:text-white transition-colors z-10 h-12 w-12"
            aria-label="Open settings"
          >
            <Settings className="w-6 h-6" />
          </EnhancedButton>
        </div>





        {/* Tasks Section - Only show if there are active tasks */}
        {(() => {
          const activeTasks = enhancedThoughtmarks.filter(t => t.isTask && !t.isCompleted);
          if (activeTasks.length === 0) return null;
          
          return (
            <div className="mb-8">
              <div 
                className="section-header-control section-header-no-effects flex items-center justify-between mb-4" 
                onClick={() => setShowTasksSection(!showTasksSection)}
                role="button"
                tabIndex={0}
                aria-expanded={showTasksSection}
                aria-controls="tasks-section"
                aria-label={`${showTasksSection ? 'Collapse' : 'Expand'} tasks section`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setShowTasksSection(!showTasksSection);
                  }
                }}
              >
                <h2 className="section-title">TASK HIT-LIST</h2>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      setLocation('/thoughtmarks?filter=tasks');
                    }}
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                    aria-label="View all tasks"
                  >
                    View All
                  </Button>
                  {showTasksSection ? <ChevronUp className="w-4 h-4 text-gray-400" aria-hidden="true" /> : <ChevronDown className="w-4 h-4 text-gray-400" aria-hidden="true" />}
                </div>
              </div>
              
              {showTasksSection && (
                <div className="space-y-3">
                  {(() => {
                    const tasks = activeTasks;
                    const overdueTasks = tasks.filter(t => t.dueDate && new Date(t.dueDate) < new Date());
                    const upcomingTasks = tasks.filter(t => !t.dueDate || new Date(t.dueDate) >= new Date());
                    
                    return (
                      <div className="space-y-4">
                        {overdueTasks.length > 0 && (
                          <div>
                            <h3 className="text-sm font-medium text-red-400 mb-2 flex items-center gap-2">
                              <Clock className="w-4 h-4" />
                              Overdue ({overdueTasks.length})
                            </h3>
                            <div className="space-y-2">
                              {overdueTasks.slice(0, 3).map((task) => (
                                <InteractiveCard
                                  key={task.id} 
                                  className="bg-red-900/20 border border-red-700/50 rounded-lg p-3 animate-fade-in cursor-pointer"
                                  onClick={() => setLocation(`/thoughtmarks/${task.id}`)}
                                  isOptimistic={isOptimistic(task.id)}
                                  showSuccessState={task.isCompleted}
                                >
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3 flex-1 min-w-0">
                                      <div
                                        className="tm-completion-toggle"
                                        data-completed={task.isCompleted}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleTaskToggle(task.id);
                                        }}
                                        title={task.isCompleted ? "Mark as incomplete" : "Mark as complete"}
                                        aria-label={task.isCompleted ? "Mark as incomplete" : "Mark as complete"}
                                        role="button"
                                        tabIndex={0}
                                        onKeyDown={(e) => {
                                          if (e.key === 'Enter' || e.key === ' ') {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            handleTaskToggle(task.id);
                                          }
                                        }}
                                      >
                                        <Check className="w-4 h-4" />
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <p className="text-red-200 text-sm font-medium truncate">{task.title}</p>
                                        {task.dueDate && (
                                          <p className="text-red-400 text-xs">
                                            Due {new Date(task.dueDate).toLocaleDateString()}
                                          </p>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </InteractiveCard>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {upcomingTasks.length > 0 && (
                          <div>
                            <h3 className="text-sm font-medium text-blue-400 mb-2 flex items-center gap-2">
                              <CheckSquare className="w-4 h-4" />
                              Active ({upcomingTasks.length})
                            </h3>
                            <div className="space-y-2">
                              {upcomingTasks.slice(0, 5).map((task) => (
                                <InteractiveCard 
                                  key={task.id} 
                                  className="bg-[#202124] border border-border/50 rounded-lg p-3 cursor-pointer"
                                  onClick={() => setLocation(`/thoughtmarks/${task.id}`)}
                                  isOptimistic={isOptimistic(task.id)}
                                  showSuccessState={task.isCompleted}
                                >
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3 flex-1 min-w-0">
                                      <div
                                        className="tm-completion-toggle"
                                        data-completed={task.isCompleted}
                                        onClick={async (e) => {
                                          e.stopPropagation();
                                          try {
                                            await apiRequest("PATCH", `/api/thoughtmarks/${task.id}/toggle-completion`);
                                            queryClient.invalidateQueries({ queryKey: ["/api/thoughtmarks"] });
                                          } catch (error) {
                                            console.error("Failed to toggle task completion:", error);
                                          }
                                        }}
                                        title={task.isCompleted ? "Mark as incomplete" : "Mark as complete"}
                                        aria-label={task.isCompleted ? "Mark as incomplete" : "Mark as complete"}
                                        role="button"
                                        tabIndex={0}
                                        onKeyDown={(e) => {
                                          if (e.key === 'Enter' || e.key === ' ') {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            apiRequest("PATCH", `/api/thoughtmarks/${task.id}/toggle-completion`)
                                              .then(() => queryClient.invalidateQueries({ queryKey: ["/api/thoughtmarks"] }))
                                              .catch(error => console.error("Failed to toggle task completion:", error));
                                          }
                                        }}
                                      >
                                        <Check className="w-4 h-4" />
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <p className="text-white text-sm font-medium truncate">{task.title}</p>
                                        {task.dueDate && (
                                          <p className="text-blue-400 text-xs">
                                            Due {new Date(task.dueDate).toLocaleDateString()}
                                          </p>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </InteractiveCard>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {activeTasks.length > 5 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setLocation('/thoughtmarks/all?filter=tasks')}
                            className="w-full text-blue-400 hover:text-blue-300"
                          >
                            View All Tasks ({activeTasks.length})
                          </Button>
                        )}
                      </div>
                    );
                  })()}
                </div>
              )}
            </div>
          );
        })()}
        
        {/* Bins Section */}
        <div className="bins-section mb-8">
          <div 
            className="section-header-control section-header-no-effects flex items-center justify-between mb-4" 
            onClick={() => setShowBinsSection(!showBinsSection)}
            role="button"
            tabIndex={0}
            aria-expanded={showBinsSection}
            aria-controls="bins-section"
            aria-label={`${showBinsSection ? 'Collapse' : 'Expand'} bins section`}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setShowBinsSection(!showBinsSection);
              }
            }}
          >
            <h2 className="section-title">YOUR BINS</h2>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  setLocation('/bins');
                }}
                className="text-gray-400 hover:text-white transition-colors text-sm section-view-all-button"
              >
                View All
              </Button>
              {showBinsSection ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
            </div>
          </div>
          
          {showBinsSection && (
            <div className="space-y-2">
              {binsLoading ? (
                <div className="grid grid-cols-2 gap-2 enhanced-scroll">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <div key={i} className="h-16 bg-[#202124] rounded-lg animate-pulse shadow-sm" />
                  ))}
                </div>
              ) : (
                <>
                  {/* Template bins in preferred order */}
                  <div className="grid grid-cols-2 gap-2 mb-4 momentum-scroll enhanced-scroll bins-grid">
                    {['Relevant', 'Life Hacks', 'Quotes', 'Inspiration', 'Circle Back', 'Revelations', 'Funny', 'Stories', 'Half-Baked', 'Team-Up', 'Newsworthy'].map((binName) => {
                      // Find the template bin (preferring lower ID for original)
                      const bin = bins.filter(b => b.name === binName).sort((a: any, b: any) => a.id - b.id)[0];
                      if (!bin) return null;
                      return (
                        <button
                          key={bin.id}
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            console.log(`Bin card clicked: ${bin.name}`);
                            console.log(`Navigating to: /thoughtmarks/all?filter=bin&binName=${encodeURIComponent(bin.name)}`);
                            setLocation(`/thoughtmarks/all?filter=bin&binName=${encodeURIComponent(bin.name)}`);
                          }}
                          onPointerDown={() => {
                            console.log(`Pointer down on ${bin.name}`);
                          }}
                          onTouchStart={() => {
                            console.log(`Touch start on ${bin.name}`);
                          }}
                          className="bin-card bg-[#202124] hover:bg-gray-800 rounded-md p-2 cursor-pointer transition-colors duration-200 h-13 flex items-center w-full border-none outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <div className="flex items-center justify-between w-full pointer-events-none">
                            <span className="text-white font-medium text-sm">
                              {bin.name}
                            </span>
                            <span className="text-blue-400 text-xs">
                              {bin?.thoughtmarkCount || 0}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                    
                    {/* New Bin Button */}
                    <div
                      onClick={() => {
                        if (!isAuthenticated) {
                          setAuthPromptFeature("create and organize bins");
                          setShowAuthPrompt(true);
                          return;
                        }
                        setLocation('/create-bin');
                      }}
                      className="bin-card special-bin-card bg-[#202124] hover:bg-gray-800 p-2 cursor-pointer transition-all duration-200 shadow-sm hover:shadow-md border-2 border-dashed border-gray-600 hover:border-blue-500 h-13 flex items-center justify-center"
                    >
                      <div className="flex items-center gap-2">
                        <Plus className="w-4 h-4 text-[#2999ff]" />
                        <span className="text-[#2999ff] font-medium text-sm whitespace-nowrap">New Bin</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Special sections below grid */}
                  <div className="mt-4 space-y-2">
                    {/* Saved to Sort Later */}
                    <div
                      onClick={() => {
                        setLocation('/thoughtmarks?filter=bin&binName=Sort%20Later');
                      }}
                      className="bin-card special-bin-card bg-blue-950 hover:bg-blue-900 border border-blue-800 p-2 cursor-pointer transition-all duration-200 shadow-sm hover:shadow-md h-13 flex items-center"
                      role="button"
                      aria-label="Open Sort Later bin"
                      tabIndex={0}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="text-white font-medium text-sm">Saved to Sort Later</span>
                        <span className="text-blue-400 text-xs">
                          {bins.find((b: any) => b.name === 'Sort Later')?.thoughtmarkCount || 0}
                        </span>
                      </div>
                    </div>
                    
                    {/* Archive */}
                    <div
                      onClick={() => setLocation('/archive')}
                      className="bin-card special-bin-card flex items-center justify-between p-2 hover:bg-gray-900/50 cursor-pointer transition-colors h-13"
                      role="button"
                      aria-label="View archived content"
                      tabIndex={0}
                    >
                      <span className="text-white text-sm">View Archive</span>
                      <Archive className="w-4 h-4 text-blue-400" />
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>





        {/* AI Tools Section - All Users with Premium Overlay */}
        <PremiumFeatureWrapper 
          isPremium={Boolean(user?.isPremium || user?.isTestUser)}
          feature="AI Tools"
          description="Smart insights, auto-categorization, and intelligent organization"
          className="mb-6"
        >
          <div
            onClick={() => user?.isPremium || user?.isTestUser ? setLocation("/ai") : setLocation("/subscribe")}
            className="bg-transparent hover:bg-yellow-400/10 border-2 border-yellow-400 rounded-lg p-5 cursor-pointer transition-all duration-200 shadow-sm hover:shadow-md hover:ring-1 hover:ring-yellow-500/30 flex items-center"
            style={{ minHeight: '80px' }}
            role="button"
            aria-label="Access AI tools and intelligent insights"
            tabIndex={0}
          >
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-3">
                <Brain className="w-6 h-6 text-yellow-400" />
                <span className="text-yellow-400 font-bold text-base">AI Tools</span>
                <Crown className="w-5 h-5 text-yellow-400" />
              </div>
              <ArrowRight className="w-5 h-5 text-yellow-400/80" />
            </div>
          </div>
        </PremiumFeatureWrapper>

        {/* Tag Filter - Horizontal Scroll */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <Filter className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-400" style={{ fontFamily: 'Ubuntu', fontWeight: 400 }}>tags</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-400 hover:text-white transition-colors h-6 px-2 text-xs section-view-all-button"
              style={{ fontFamily: 'Ubuntu', fontWeight: 400 }}
            >
              ...
            </Button>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 pt-2 scrollbar-hide enhanced-scroll">
            <div
              onClick={() => setSelectedTag("all")}
              className={`cursor-pointer transition-all duration-200 whitespace-nowrap flex-shrink-0 px-3 py-2 touch-target flex items-center justify-center tag-chip ${
                selectedTag === "all" 
                  ? "selected" 
                  : "hover:bg-white/12 hover:border-white/20"
              }`}
              style={{ 
                fontFamily: 'Ubuntu', 
                fontSize: '8pt', 
                textTransform: 'lowercase',
                height: '75%',
                minHeight: '75%',
                textAlign: 'center'
              }}
            >
              all ({enhancedThoughtmarks.filter(t => !t.isDeleted).length})
            </div>
            {allTags.sort().map(tag => {
              return (
                <div
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  className={`cursor-pointer transition-all duration-200 whitespace-nowrap flex-shrink-0 px-3 py-2 touch-target flex items-center justify-center tag-chip special-tag-chip ${
                    selectedTag === tag 
                      ? "selected" 
                      : "hover:bg-white/12 hover:border-white/20"
                  }`}
                  style={{ 
                    fontFamily: 'Ubuntu', 
                    fontSize: '8pt', 
                    textTransform: 'lowercase',
                    height: '75%',
                    minHeight: '75%',
                    textAlign: 'center'
                  }}

                >
                  {tag} ({enhancedThoughtmarks.filter(t => !t.isDeleted && t.tags.includes(tag)).length})
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Thoughtmarks Section */}
        <div className="mb-8">
          <div 
            className="section-header-control section-header-no-effects flex items-center justify-between mb-4"
            onClick={() => setShowThoughtmarksSection(!showThoughtmarksSection)}
            role="button"
            aria-label={`${showThoughtmarksSection ? 'Collapse' : 'Expand'} thoughtmarks section`}
            tabIndex={0}
          >
            <h2 className="section-title">
              {selectedTag === "all" ? "RECENT THOUGHTMARKS" : `RECENT "${selectedTag}" THOUGHTMARKS`}
            </h2>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  setLocation('/thoughtmarks');
                }}
                className="text-gray-400 hover:text-white transition-colors text-sm section-view-all-button"
              >
                View All
              </Button>
              {showThoughtmarksSection ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
            </div>
          </div>
          
          {showThoughtmarksSection && (
            <div className="space-y-3">
              {thoughtmarksLoading ? (
                <div className="space-y-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="h-20 bg-gray-800 rounded-lg animate-pulse" />
                  ))}
                </div>
              ) : recentThoughtmarks.length > 0 ? (
                <div className="space-y-3">
                  {recentThoughtmarks.map((thoughtmark) => (
                    <ThoughtmarkCard
                      key={thoughtmark.id}
                      thoughtmark={thoughtmark}
                      onClick={() => setLocation(`/thoughtmarks/${thoughtmark.id}`)}
                      onEdit={() => setLocation(`/thoughtmarks/${thoughtmark.id}/edit`)}
                      onDelete={() => deleteThoughtmarkMutation.mutate(thoughtmark.id)}
                      onArchive={() => archiveThoughtmarkMutation.mutate(thoughtmark.id)}
                    />
                  ))}
                  
                  {/* View More Card */}
                  <div
                    onClick={() => setLocation('/thoughtmarks')}
                    className="activity-card bg-[#202124] hover:bg-gray-800 rounded-lg p-4 cursor-pointer transition-all duration-200 border-2 border-dashed border-gray-600 hover:border-blue-500 flex items-center justify-center min-h-[80px]"
                  >
                    <div className="text-center">
                      <ArrowRight className="w-5 h-5 text-[#2999ff] mx-auto mb-2" />
                      <span className="text-[#2999ff] font-medium text-sm">VIEW ALL THOUGHTMARKS</span>
                      <div className="text-gray-400 text-xs mt-1">
                        {filteredThoughtmarks.length} total
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-400">
                  <p>
                    {selectedTag === "all" 
                      ? "No thoughtmarks yet. Tap the button below to create your first one!" 
                      : `No thoughtmarks with "${selectedTag}" tag found.`
                    }
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        </div>
      </NativeScroll>

      {/* First-time user intro overlay */}
      <IntroOverlay isOpen={showIntro} onClose={handleIntroClose} />
      
      {/* Authentication prompt dialog */}
      <AuthPromptDialog 
        open={showAuthPrompt}
        onOpenChange={setShowAuthPrompt}
        feature={authPromptFeature}
        initialMode={authInitialMode}
      />
    </div>
  );
}