import { useEffect, useState } from 'react';

interface SwipeTransitionOverlayProps {
  direction: 'left' | 'right' | null;
  progress: number;
  isTransitioning: boolean;
}

export function SwipeTransitionOverlay({ 
  direction, 
  progress, 
  isTransitioning 
}: SwipeTransitionOverlayProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(direction !== null || isTransitioning);
  }, [direction, isTransitioning]);

  if (!isVisible || (!direction && !isTransitioning)) {
    return null;
  }

  // Calculate transform based on direction and progress
  const getTransform = () => {
    if (!direction) return 'translateX(0)';
    
    if (direction === 'right') {
      // Swiping right (going back) - new page slides in from left
      return `translateX(${-100 + (progress * 100)}%)`;
    } else {
      // Swiping left (going forward) - new page slides in from right  
      return `translateX(${100 - (progress * 100)}%)`;
    }
  };

  const getBackgroundTransform = () => {
    if (!direction) return 'translateX(0)';
    
    if (direction === 'right') {
      // Current page slides out to the right
      return `translateX(${progress * 100}%)`;
    } else {
      // Current page slides out to the left
      return `translateX(${-progress * 100}%)`;
    }
  };

  return (
    <>
      {/* Subtle background overlay */}
      <div 
        className="fixed inset-0 pointer-events-none z-20"
        style={{
          background: `linear-gradient(90deg, 
            ${direction === 'right' ? 'rgba(0,0,0,0.05)' : 'transparent'} 0%, 
            rgba(0,0,0,0.02) 50%, 
            ${direction === 'left' ? 'rgba(0,0,0,0.05)' : 'transparent'} 100%)`,
          opacity: progress * 0.4,
          transform: getBackgroundTransform(),
          transition: isTransitioning ? 'all 400ms cubic-bezier(0.25, 0.46, 0.45, 0.94)' : 'none'
        }}
      />
      
      {/* Minimal edge indicator */}
      <div 
        className="fixed pointer-events-none z-25"
        style={{
          [direction === 'right' ? 'left' : 'right']: 0,
          top: 0,
          bottom: 0,
          width: '3px',
          background: `linear-gradient(to ${direction === 'right' ? 'right' : 'left'}, 
            rgba(198, 214, 0, ${progress * 0.6}) 0%, 
            transparent 100%)`,
          transform: direction === 'right' 
            ? `translateX(${-3 + (progress * 3)}px)` 
            : `translateX(${3 - (progress * 3)}px)`,
          transition: isTransitioning ? 'all 400ms cubic-bezier(0.25, 0.46, 0.45, 0.94)' : 'none'
        }}
      />
    </>
  );
}