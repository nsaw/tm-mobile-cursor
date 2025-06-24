import { useState, useRef, useEffect } from "react";

interface SimpleTooltipProps {
  content: string;
  children: React.ReactNode;
  delay?: number;
  elementId: string;
}

export function SimpleTooltip({ content, children, delay = 2000, elementId }: SimpleTooltipProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const [hasShown, setHasShown] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    // Check if this tooltip has been shown before in this session
    const sessionKey = `tooltip-shown-${elementId}`;
    if (sessionStorage.getItem(sessionKey)) {
      setHasShown(true);
      return;
    }

    // Simple timer-based activation
    timeoutRef.current = setTimeout(() => {
      if (!hasShown) {
        setShowTooltip(true);
        setHasShown(true);
        sessionStorage.setItem(sessionKey, 'true');
        
        // Auto-hide after 6 seconds
        setTimeout(() => {
          setShowTooltip(false);
        }, 6000);
      }
    }, delay);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [delay, elementId, hasShown]);

  return (
    <div className="relative inline-block">
      {children}
      {showTooltip && (
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 z-50 animate-fade-in">
          <div className="bg-black/90 text-white text-sm rounded-lg px-3 py-2 max-w-xs shadow-lg border border-gray-700">
            <div className="relative">
              {content}
              <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-black/90 border-l border-t border-gray-700 rotate-45"></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}