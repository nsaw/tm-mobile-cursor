import { useState, useEffect, useRef } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Sparkles } from "lucide-react";

interface AiTooltipProps {
  children: React.ReactNode;
  content: string;
  side?: "top" | "right" | "bottom" | "left";
  delay?: number;
  className?: string;
}

export function AiTooltip({ children, content, side = "top", delay = 0, className = "" }: AiTooltipProps) {
  const [isEnabled, setIsEnabled] = useState(true);
  const [showSparkle, setShowSparkle] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [hasActivated, setHasActivated] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Create a unique key for this tooltip instance based on content
  const tooltipKey = `tooltip_${content.slice(0, 50).replace(/\s+/g, '_')}`;

  useEffect(() => {
    const enabled = localStorage.getItem('aiTooltipsEnabled');
    setIsEnabled(enabled !== null ? JSON.parse(enabled) : true);
    
    // Check if this specific tooltip has already been shown on this page
    const hasShown = sessionStorage.getItem(tooltipKey);
    if (hasShown) {
      setHasActivated(true);
    }
  }, [tooltipKey]);

  useEffect(() => {
    if (!containerRef.current || !isEnabled || hasActivated) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          setHasActivated(true);
          
          // Mark this tooltip as shown for this session
          sessionStorage.setItem(tooltipKey, 'true');
          
          // Start sparkle animation with slower pulsing effect
          setTimeout(() => {
            setShowSparkle(true);
            
            // Create a pulsing effect for 10 seconds
            let pulseCount = 0;
            const maxPulses = 5; // 5 pulses over 10 seconds
            
            const pulseInterval = setInterval(() => {
              if (pulseCount >= maxPulses) {
                clearInterval(pulseInterval);
                // Final fade out after 10 seconds
                setTimeout(() => setShowSparkle(false), 500);
                return;
              }
              
              // Fade out and back in for pulsing effect
              setShowSparkle(false);
              setTimeout(() => {
                setShowSparkle(true);
                pulseCount++;
              }, 1000); // 1 second fade out, then fade back in
            }, 2000); // Every 2 seconds
            
          }, Math.max(500, delay)); // Minimum 500ms delay to ensure visibility
          
          // Stop observing once triggered
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0.1,
        rootMargin: '20px'
      }
    );

    observer.observe(containerRef.current);

    return () => {
      observer.disconnect();
    };
  }, [isEnabled, delay, hasActivated]);

  if (!isEnabled) {
    return <>{children}</>;
  }

  return (
    <div 
      ref={containerRef}
      className={`relative tooltip ${isVisible ? 'visible' : ''} ${className}`}
    >
      <TooltipProvider delayDuration={100}>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="relative">
              {children}
              {showSparkle && (
                <div 
                  className={`absolute -top-1 -right-1 pointer-events-none tooltip-sparkle ${isVisible ? 'visible' : ''}`}
                  onMouseEnter={() => setShowSparkle(true)}
                >
                  <Sparkles 
                    className="w-4 h-4 text-yellow-400 cursor-pointer" 
                    style={{
                      animation: "sparkleGlow 2s ease-in-out infinite",
                      filter: "drop-shadow(0 0 4px rgba(234, 179, 8, 0.5))",
                      transition: "opacity 1s ease-in-out"
                    }}
                  />
                </div>
              )}
            </div>
          </TooltipTrigger>
          <TooltipContent 
            side={side} 
            className="max-w-xs z-50"
            sideOffset={5}
          >
            <div className="flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm">{content}</p>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}

// Add sparkle animation to global CSS
const sparkleAnimation = `
@keyframes sparkle {
  0%, 100% { 
    opacity: 0.3; 
    transform: scale(1) rotate(0deg); 
  }
  50% { 
    opacity: 1; 
    transform: scale(1.2) rotate(180deg); 
  }
}

@keyframes sparkleGlow {
  0%, 100% { 
    opacity: 0.6; 
    transform: scale(1) rotate(0deg);
  }
  50% { 
    opacity: 1; 
    transform: scale(1.15) rotate(180deg);
  }
}

.tooltip-sparkle {
  transition: opacity 1s ease-in-out;
}
`;

// Inject the animation into the document head
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = sparkleAnimation;
  document.head.appendChild(style);
}