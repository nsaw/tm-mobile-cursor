import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BottomNav } from "@/components/ui/bottom-nav";
import { EnhancedVoiceRecorder } from "@/components/enhanced-voice-recorder";
import { FloatingPortal } from "@/components/floating-portal";
import { useSwipeNavigation } from "@/hooks/use-swipe-navigation";
import { SwipeTransitionOverlay } from "@/components/swipe-transition-overlay";

interface PersistentLayoutProps {
  children: React.ReactNode;
}

export function PersistentLayout({ children }: PersistentLayoutProps) {
  const [location, setLocation] = useLocation();
  const [isVoiceRecorderOpen, setIsVoiceRecorderOpen] = useState(false);

  // Listen for voice recorder trigger events (from Siri shortcuts)
  useEffect(() => {
    const handleVoiceTrigger = () => {
      setIsVoiceRecorderOpen(true);
    };

    window.addEventListener('trigger-voice-recorder', handleVoiceTrigger);
    
    return () => {
      window.removeEventListener('trigger-voice-recorder', handleVoiceTrigger);
    };
  }, []);

  // Enable iOS-style swipe navigation with improved physics
  const { swipeState } = useSwipeNavigation({
    enabled: true,
    threshold: 50,
    maxVerticalThreshold: 80,
    edgeThreshold: 20
  });

  return (
    <>
      <div className="relative full-height bg-black">
        {/* Status bar fade overlay */}
        <div className="header-fade-overlay"></div>
        
        {/* Swipe transition overlay */}
        <SwipeTransitionOverlay
          direction={swipeState.direction}
          progress={swipeState.progress}
          isTransitioning={swipeState.isTransitioning}
        />
        
        {/* Main content with proper iOS safe area spacing */}
        <div className="content-underlap" style={{ paddingBottom: 'calc(12rem + env(safe-area-inset-bottom))' }}>
          {children}
        </div>
        
        {/* Bottom Navigation - Persistent across all pages */}
        <BottomNav
          onNavigate={setLocation}
          onVoiceRecord={() => setIsVoiceRecorderOpen(true)}
          showCreateButton={true}
        />
      </div>
      
      {/* Enhanced Voice Recorder - Global Modal */}
      {isVoiceRecorderOpen && (
        <FloatingPortal>
          <EnhancedVoiceRecorder
            isOpen={isVoiceRecorderOpen}
            onClose={() => setIsVoiceRecorderOpen(false)}
            onSubmit={(content) => {
              setIsVoiceRecorderOpen(false);
              setLocation(`/create?content=${encodeURIComponent(content)}`);
            }}
          />
        </FloatingPortal>
      )}

      {/* Floating Navigation Portal Layer */}
      <FloatingPortal zIndex={50}>
        {/* Black gradient overlay behind navigation - extends higher to fade page content behind button */}
        <div className="fixed bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-black via-black/98 via-black/92 via-black/85 via-black/70 via-black/50 via-black/30 to-transparent pointer-events-none"></div>

        {/* Enhanced shadow effect for New Thoughtmark button - casts onto nav bar and page */}
        <div 
          className="fixed left-0 right-0 px-4 max-w-[440px] mx-auto pointer-events-none"
          style={{ bottom: `calc(7.75rem + env(safe-area-inset-bottom))` }}
        >
          <div 
            className="absolute inset-0 rounded-xl"
            style={{
              boxShadow: '0 -4px 6px rgba(0, 0, 0, 0.4), 0 -8px 12px rgba(0, 0, 0, 0.3), 0 4px 6px rgba(0, 0, 0, 0.3)',
              filter: 'blur(1px)',
              transform: 'scale(1.05)',
              background: 'radial-gradient(circle, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.2) 50%, transparent 70%)'
            }}
          ></div>
        </div>

        {/* Universal New Thoughtmark Button - Available on all pages */}
        <div 
          className="fixed left-1/2 transform -translate-x-1/2 pointer-events-auto"
          style={{ bottom: `calc(112px + env(safe-area-inset-bottom))` }}
        >
          <div 
            className="p-0.5 rounded-full"
            style={{
              background: 'linear-gradient(135deg, #C6D600 0%, #00D9FF 100%)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.8), 0 16px 64px rgba(0, 0, 0, 0.6)',
              opacity: 0.75,
            }}
          >
            <button
              onClick={() => setLocation('/create')}
              className="w-[60px] h-[60px] text-[#C6D600] hover:opacity-90 font-bold rounded-full transition-all duration-300 flex items-center justify-center hover:scale-105"
              style={{
                background: 'linear-gradient(135deg, #000000 0%, #1e3a8a 100%)',
                border: 'none',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4), inset 0 0 20px rgba(59, 130, 246, 0.2), 0 -4px 16px rgba(0, 0, 0, 0.5)'
              }}
              aria-label="Create new thoughtmark"
            >
              <Plus className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 flex justify-center w-full pointer-events-auto z-50">
          <BottomNav 
            onNavigate={setLocation} 
            onVoiceRecord={() => setIsVoiceRecorderOpen(true)}
            showCreateButton={false}
          />
        </div>
      </FloatingPortal>

      {/* Voice Recorder Modal - Available on all pages */}
      <EnhancedVoiceRecorder
        isOpen={isVoiceRecorderOpen}
        onClose={() => setIsVoiceRecorderOpen(false)}
      />
    </>
  );
}