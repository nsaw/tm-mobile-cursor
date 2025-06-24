import { Home, Search, Brain, Mic, Crown, Plus } from "lucide-react";
import { useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";

interface BottomNavProps {
  onNavigate: (path: string) => void;
  onVoiceRecord?: () => void;
  showCreateButton?: boolean;
}

export function BottomNav({ onNavigate, onVoiceRecord, showCreateButton = true }: BottomNavProps) {
  const [location] = useLocation();
  const { user } = useAuth();

  // Navigation labels preference state
  const [showNavLabels, setShowNavLabels] = useState(() => {
    const stored = localStorage.getItem('showNavLabels');
    return stored ? JSON.parse(stored) : false;
  });

  // Listen for navigation labels preference changes
  useEffect(() => {
    const handleNavLabelsChange = (event: CustomEvent) => {
      setShowNavLabels(event.detail);
    };

    window.addEventListener('navLabelsChanged', handleNavLabelsChange as EventListener);
    return () => {
      window.removeEventListener('navLabelsChanged', handleNavLabelsChange as EventListener);
    };
  }, []);

  const handleAIToolsClick = () => {
    if (user?.isPremium || user?.isTestUser || user?.email === "test@thoughtmarks.app") {
      onNavigate("/ai-tools");
    } else {
      onNavigate("/subscribe");
    }
  };

  const navItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: Search, label: "Search", path: "/search" },
    { icon: Mic, label: "Voice", action: "voice" },
    { icon: Crown, label: "AI", action: "ai-tools" },
    { icon: Brain, label: "All", path: "/all" },
  ];

  return (
    <div className="tm-nav-container">
      <div className="grid grid-cols-5 gap-0 px-4 w-full justify-items-center items-center mx-auto">
          {navItems.map((item, index) => {
            const { icon: Icon, label, path, action } = item;
            const isActive = location === path;
            const isVoice = action === "voice";

            return (
              <button
                key={path || action || label}
                aria-label={label}
                onClick={() => {
                    if (isVoice && onVoiceRecord) {
                      onVoiceRecord();
                    } else if (action === "ai-tools") {
                      handleAIToolsClick();
                    } else if (path) {
                      onNavigate(path);
                    }
                  }}
                  className={cn(
                    "tm-nav-button flex flex-col items-center touch-target haptic-light",
                    showNavLabels ? "space-y-1 p-2" : "p-3",
                    isActive && "active",
                    isVoice && "voice-recorder-button",
                    isVoice && "hover:bg-red-500/20 hover:border-red-400/30",
                    action === "ai-tools" && "hover:bg-yellow-500/20 hover:border-yellow-400/30"
                  )}
                >
                  <Icon 
                    className={cn(
                      showNavLabels ? "w-5 h-5" : "w-6 h-6",
                      isActive ? "text-[#C6D600]" : isVoice ? "text-red-400" : action === "ai-tools" ? "text-yellow-400" : "text-gray-400"
                    )} 
                  />
                  {showNavLabels && (
                    <span 
                      className={cn(
                        "text-xs",
                        isActive ? "text-[#C6D600] font-medium" : isVoice ? "text-red-400" : action === "ai-tools" ? "text-yellow-400" : "text-gray-400"
                      )}
                    >
                      {label}
                    </span>
                  )}
                </button>
            );
          })}
        </div>

        {/* Floating New Thoughtmark Button */}
        {showCreateButton && location !== "/" && (
          <div className="tm-fab-wrapper">
            <div className="tm-fab-ring">
              <button
                onClick={() => onNavigate("/create")}
                className="tm-fab w-[50px] h-[50px] text-[#C6D600] hover:opacity-90 font-bold rounded-full transition-all duration-300 flex items-center justify-center hover:scale-105"
                aria-label="Create new thoughtmark"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>
  );
}