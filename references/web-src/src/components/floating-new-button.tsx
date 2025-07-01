import { Plus } from "lucide-react";
import { useLocation } from "wouter";
import { createPortal } from "react-dom";
import { BottomNav } from "@/components/ui/bottom-nav";

interface FloatingUIProps {
  onVoiceRecord?: () => void;
}

export function FloatingNewButton({ onVoiceRecord }: FloatingUIProps = {}) {
  const [, setLocation] = useLocation();

  return createPortal(
    <>
      {/* Navigation Bar */}
      <div className="tm-nav-bar">
        <BottomNav 
          onNavigate={setLocation} 
          onVoiceRecord={onVoiceRecord}
        />
      </div>

      {/* Floating New Button */}
      <button
        className="tm-fab"
        onClick={() => setLocation('/thoughtmarks/create')}
        aria-label="Create new thoughtmark"
        type="button"
      >
        <div className="w-full h-full rounded-full flex items-center justify-center text-white">
          <Plus className="w-6 h-6" strokeWidth="1.5" />
        </div>
      </button>
    </>,
    document.body
  );
}