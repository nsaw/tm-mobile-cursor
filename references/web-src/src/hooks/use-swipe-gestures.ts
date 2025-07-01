import { useState, useRef, useCallback, useEffect } from "react";
import type { TouchEvent } from "react";

interface SwipeGestureOptions {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  threshold?: number;
  preventDefault?: boolean;
  disabled?: boolean;
}

export function useSwipeGestures({
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  threshold = 30, // Reduced for more responsive gestures
  preventDefault = false,
  disabled = false
}: SwipeGestureOptions) {
  const touchStart = useRef<{ x: number; y: number; time: number } | null>(null);
  const touchEnd = useRef<{ x: number; y: number; time: number } | null>(null);
  const velocity = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isSwiping, setIsSwiping] = useState(false);

  const handleTouchStart = useCallback((e: TouchEvent<HTMLDivElement>) => {
    if (disabled) return;
    
    touchEnd.current = null;
    const now = Date.now();
    touchStart.current = {
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
      time: now
    };
    velocity.current = { x: 0, y: 0 };
    setIsSwiping(false);
  }, [disabled]);

  const handleTouchMove = useCallback((e: TouchEvent<HTMLDivElement>) => {
    if (disabled || !touchStart.current) return;
    
    const now = Date.now();
    const currentX = e.targetTouches[0].clientX;
    const currentY = e.targetTouches[0].clientY;
    
    touchEnd.current = {
      x: currentX,
      y: currentY,
      time: now
    };
    
    // Calculate velocity for momentum detection
    const timeDiff = now - touchStart.current.time;
    if (timeDiff > 0) {
      velocity.current = {
        x: (currentX - touchStart.current.x) / timeDiff,
        y: (currentY - touchStart.current.y) / timeDiff
      };
    }
    
    const diffX = Math.abs(currentX - touchStart.current.x);
    const diffY = Math.abs(currentY - touchStart.current.y);
    
    // More responsive detection with lower threshold
    if (diffX > 5 || diffY > 5) {
      setIsSwiping(true);
    }
    
    if (preventDefault && isSwiping) {
      e.preventDefault();
    }
  }, [disabled, preventDefault, isSwiping]);

  const handleTouchEnd = useCallback(() => {
    if (disabled || !touchStart.current || !touchEnd.current) {
      setIsSwiping(false);
      return;
    }
    
    const diffX = touchEnd.current.x - touchStart.current.x;
    const diffY = touchEnd.current.y - touchStart.current.y;
    const timeDiff = touchEnd.current.time - touchStart.current.time;
    
    const absDiffX = Math.abs(diffX);
    const absDiffY = Math.abs(diffY);
    
    // iOS-native velocity threshold (pixels per millisecond)
    const velocityThreshold = 0.5;
    const absVelocityX = Math.abs(velocity.current.x);
    const absVelocityY = Math.abs(velocity.current.y);
    
    // Check if gesture qualifies as swipe (distance OR velocity based)
    const hasMinDistance = Math.max(absDiffX, absDiffY) >= threshold;
    const hasMinVelocity = Math.max(absVelocityX, absVelocityY) >= velocityThreshold;
    
    if (!hasMinDistance && !hasMinVelocity) {
      setIsSwiping(false);
      return;
    }
    
    // Determine primary direction with velocity consideration
    const isHorizontalGesture = (absDiffX > absDiffY) || (absVelocityX > absVelocityY);
    
    if (isHorizontalGesture) {
      // Horizontal swipe - consider both distance and velocity
      if (diffX > 0 || velocity.current.x > velocityThreshold) {
        onSwipeRight?.();
      } else if (diffX < 0 || velocity.current.x < -velocityThreshold) {
        onSwipeLeft?.();
      }
    } else {
      // Vertical swipe - consider both distance and velocity
      if (diffY > 0 || velocity.current.y > velocityThreshold) {
        onSwipeDown?.();
      } else if (diffY < 0 || velocity.current.y < -velocityThreshold) {
        onSwipeUp?.();
      }
    }
    
    setIsSwiping(false);
  }, [disabled, threshold, onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown]);

  const swipeHandlers = {
    onTouchStart: handleTouchStart,
    onTouchMove: handleTouchMove,
    onTouchEnd: handleTouchEnd
  };

  return { swipeHandlers, isSwiping };
}

// Hook for card-specific swipe actions (complete, archive, delete)
export function useCardSwipeActions() {
  const [swipeAction, setSwipeAction] = useState<'complete' | 'archive' | 'delete' | null>(null);
  const [swipeProgress, setSwipeProgress] = useState(0);

  const handleSwipeProgress = useCallback((progress: number, action: 'complete' | 'archive' | 'delete') => {
    setSwipeProgress(progress);
    if (progress > 0.7) {
      setSwipeAction(action);
    } else {
      setSwipeAction(null);
    }
  }, []);

  const resetSwipe = useCallback(() => {
    setSwipeAction(null);
    setSwipeProgress(0);
  }, []);

  return {
    swipeAction,
    swipeProgress,
    handleSwipeProgress,
    resetSwipe
  };
}