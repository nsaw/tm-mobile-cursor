import { useEffect, useRef } from 'react';
import { useLocation } from 'wouter';

interface UseGestureNavigationProps {
  onSwipeRight?: () => void;
  onSwipeLeft?: () => void;
  enabled?: boolean;
  threshold?: number;
}

export function useGestureNavigation({ 
  onSwipeRight, 
  onSwipeLeft, 
  enabled = true, 
  threshold = 100 
}: UseGestureNavigationProps) {
  const touchStartX = useRef<number>(0);
  const touchStartY = useRef<number>(0);
  const touchStartTime = useRef<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !enabled) return;

    const handleTouchStart = (e: TouchEvent) => {
      // Only handle single finger touches
      if (e.touches.length !== 1) return;
      
      // Avoid interfering with iOS system gestures from screen edges
      const touch = e.touches[0];
      const isNearLeftEdge = touch.clientX < 20;
      const isNearRightEdge = touch.clientX > window.innerWidth - 20;
      const isNearTopEdge = touch.clientY < 44; // iOS status bar height
      const isNearBottomEdge = touch.clientY > window.innerHeight - 100; // iOS home indicator area
      
      if (isNearLeftEdge || isNearRightEdge || isNearTopEdge || isNearBottomEdge) {
        return; // Let iOS handle system gestures
      }
      
      touchStartX.current = touch.clientX;
      touchStartY.current = touch.clientY;
      touchStartTime.current = Date.now();
    };

    const handleTouchEnd = (e: TouchEvent) => {
      // Only handle single finger touches
      if (e.changedTouches.length !== 1) return;
      
      const touchEndX = e.changedTouches[0].clientX;
      const touchEndY = e.changedTouches[0].clientY;
      const touchEndTime = Date.now();
      
      const deltaX = touchEndX - touchStartX.current;
      const deltaY = touchEndY - touchStartY.current;
      const deltaTime = touchEndTime - touchStartTime.current;
      
      // More conservative gesture detection to avoid conflicts
      const isHorizontalSwipe = Math.abs(deltaX) > Math.abs(deltaY) * 2; // More horizontal emphasis
      const isQuickSwipe = deltaTime < 400; // Shorter time window
      const isSufficientDistance = Math.abs(deltaX) > threshold;
      const isNotTooFast = deltaTime > 50; // Prevent accidental triggers
      
      if (isHorizontalSwipe && isQuickSwipe && isSufficientDistance && isNotTooFast) {
        if (deltaX > 0 && onSwipeRight) {
          // Right swipe - typically "back" navigation
          e.preventDefault();
          onSwipeRight();
        } else if (deltaX < 0 && onSwipeLeft) {
          // Left swipe - typically "forward" navigation
          e.preventDefault();
          onSwipeLeft();
        }
      }
    };

    // Use passive listeners for better performance
    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    container.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, [onSwipeRight, onSwipeLeft, enabled, threshold]);

  return containerRef;
}

// Navigation helper hook
export function useBackNavigation() {
  const [, setLocation] = useLocation();
  
  const navigateBack = () => {
    // Check if there's browser history to go back to
    if (window.history.length > 1) {
      window.history.back();
    } else {
      // Fallback to dashboard
      setLocation('/dashboard');
    }
  };

  return navigateBack;
}