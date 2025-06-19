import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'wouter';

interface SwipeNavigationOptions {
  enabled?: boolean;
  threshold?: number;
  maxVerticalThreshold?: number;
  edgeThreshold?: number;
  onSwipeProgress?: (direction: 'left' | 'right' | null, progress: number) => void;
}

export function useSwipeNavigation(options: SwipeNavigationOptions = {}) {
  const [location, setLocation] = useLocation();
  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const isSwipingRef = useRef(false);
  const transitionRef = useRef<{ animationFrame?: number; startTime?: number }>({});
  const [swipeState, setSwipeState] = useState<{
    direction: 'left' | 'right' | null;
    progress: number;
    isTransitioning: boolean;
  }>({ direction: null, progress: 0, isTransitioning: false });
  
  const {
    enabled = true,
    threshold = 40, // Lower threshold for more responsive navigation
    maxVerticalThreshold = 80, // Tighter vertical tolerance
    edgeThreshold = 20, // Smaller edge zone for precise gesture detection
    onSwipeProgress
  } = options;

  // Define comprehensive navigation history and routes
  const navigationStack = [
    '/',
    '/all-bins',
    '/create',
    '/all',
    '/search',
    '/settings',
    '/profile',
    '/premium',
    '/onboarding'
  ];

  const getRouteIndex = (path: string) => {
    // Handle parameterized routes
    if (path.startsWith('/bin/')) return navigationStack.indexOf('/all-bins');
    if (path.startsWith('/thoughtmark/')) return navigationStack.indexOf('/all');
    if (path.startsWith('/edit/')) return navigationStack.indexOf('/create');
    if (path.startsWith('/onboarding')) return navigationStack.indexOf('/onboarding');
    if (path === '/tasks') return -1; // Tasks route redirects, don't include in navigation stack
    
    return navigationStack.indexOf(path);
  };

  const canNavigateBack = () => {
    const currentIndex = getRouteIndex(location);
    return currentIndex > 0;
  };

  const canNavigateForward = () => {
    const currentIndex = getRouteIndex(location);
    return currentIndex >= 0 && currentIndex < navigationStack.length - 1;
  };

  // S-curve easing function for smooth transitions
  const easeInOutCubic = (t: number): number => {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  };

  const smoothTransition = (targetRoute: string, direction: 'left' | 'right') => {
    setSwipeState({ direction, progress: 0, isTransitioning: true });
    
    // Subtle audio feedback for successful navigation
    if ('vibrate' in navigator) {
      navigator.vibrate([20, 10, 20]); // Success pattern
    }
    
    const duration = 300; // ms
    const startTime = Date.now();
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeInOutCubic(progress);
      
      setSwipeState({ direction, progress: easedProgress, isTransitioning: true });
      
      if (progress < 1) {
        transitionRef.current.animationFrame = requestAnimationFrame(animate);
      } else {
        // Complete transition
        setLocation(targetRoute);
        setTimeout(() => {
          setSwipeState({ direction: null, progress: 0, isTransitioning: false });
        }, 50);
      }
    };
    
    animate();
  };

  const navigateBack = () => {
    // Special case: Settings page should always go back to home
    if (location === '/settings') {
      smoothTransition('/', 'right');
      return true;
    }
    
    const currentIndex = getRouteIndex(location);
    if (currentIndex > 0) {
      smoothTransition(navigationStack[currentIndex - 1], 'right');
      return true;
    }
    return false;
  };

  const navigateForward = () => {
    const currentIndex = getRouteIndex(location);
    if (currentIndex >= 0 && currentIndex < navigationStack.length - 1) {
      smoothTransition(navigationStack[currentIndex + 1], 'left');
      return true;
    }
    return false;
  };

  useEffect(() => {
    if (!enabled) return;

    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      const startX = touch.clientX;
      const startY = touch.clientY;
      
      // Only start swipe detection from screen edges for back navigation
      // or anywhere for forward navigation
      const isFromLeftEdge = startX <= edgeThreshold;
      const isFromRightEdge = startX >= window.innerWidth - edgeThreshold;
      
      if (isFromLeftEdge && canNavigateBack() || isFromRightEdge && canNavigateForward()) {
        touchStartRef.current = {
          x: startX,
          y: startY,
          time: Date.now()
        };
        isSwipingRef.current = false;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!touchStartRef.current) return;

      const touch = e.touches[0];
      const currentX = touch.clientX;
      const currentY = touch.clientY;
      
      const deltaX = currentX - touchStartRef.current.x;
      const deltaY = Math.abs(currentY - touchStartRef.current.y);
      
      // Ignore if too much vertical movement (likely scrolling)
      if (deltaY > maxVerticalThreshold) {
        touchStartRef.current = null;
        isSwipingRef.current = false;
        setSwipeState({ direction: null, progress: 0, isTransitioning: false });
        return;
      }

      // Check if we're swiping horizontally enough
      if (Math.abs(deltaX) > 20) {
        isSwipingRef.current = true;
        
        // Determine direction and calculate progress
        const direction = deltaX > 0 ? 'right' : 'left';
        const canNavigate = (direction === 'right' && canNavigateBack()) || 
                           (direction === 'left' && canNavigateForward());
        
        if (canNavigate) {
          e.preventDefault();
          
          // Calculate smooth progress (0 to 1)
          const progress = Math.min(Math.abs(deltaX) / (window.innerWidth * 0.6), 1);
          
          // Haptic feedback when swipe is recognized (first time reaching 15% progress)
          if (progress > 0.15 && swipeState.progress <= 0.15) {
            if ('vibrate' in navigator) {
              navigator.vibrate(10); // Light vibration
            }
          }
          
          setSwipeState({ 
            direction, 
            progress: Math.max(0, Math.min(progress, 0.8)), // Cap at 80% during drag
            isTransitioning: false 
          });
          
          // Call progress callback if provided
          if (onSwipeProgress) {
            onSwipeProgress(direction, progress);
          }
        }
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!touchStartRef.current || !isSwipingRef.current) {
        touchStartRef.current = null;
        isSwipingRef.current = false;
        setSwipeState({ direction: null, progress: 0, isTransitioning: false });
        return;
      }

      const touch = e.changedTouches[0];
      const endX = touch.clientX;
      const deltaX = endX - touchStartRef.current.x;
      const deltaTime = Date.now() - touchStartRef.current.time;
      
      // Calculate swipe velocity
      const velocity = Math.abs(deltaX) / deltaTime;
      const isQuickSwipe = velocity > 0.5; // pixels per ms
      const progress = Math.abs(deltaX) / (window.innerWidth * 0.6);
      
      // Determine if swipe meets threshold (either distance or velocity)
      const meetsThreshold = Math.abs(deltaX) > threshold || isQuickSwipe || progress > 0.3;
      
      if (meetsThreshold) {
        let navigationHandled = false;
        
        // Swipe right (positive deltaX) = go back
        if (deltaX > 0 && canNavigateBack()) {
          navigationHandled = navigateBack();
        }
        // Swipe left (negative deltaX) = go forward  
        else if (deltaX < 0 && canNavigateForward()) {
          navigationHandled = navigateForward();
        }
        
        // Prevent any default behavior if we handled navigation
        if (navigationHandled) {
          e.preventDefault();
        }
      } else {
        // Snap back with easing if threshold not met
        const snapDuration = 200;
        const startTime = Date.now();
        const startProgress = swipeState.progress;
        
        const snapBack = () => {
          const elapsed = Date.now() - startTime;
          const progress = Math.min(elapsed / snapDuration, 1);
          const easedProgress = easeInOutCubic(progress);
          const currentProgress = startProgress * (1 - easedProgress);
          
          setSwipeState({ 
            direction: swipeState.direction, 
            progress: currentProgress, 
            isTransitioning: true 
          });
          
          if (progress < 1) {
            requestAnimationFrame(snapBack);
          } else {
            setSwipeState({ direction: null, progress: 0, isTransitioning: false });
          }
        };
        
        snapBack();
      }
      
      touchStartRef.current = null;
      isSwipingRef.current = false;
    };

    const handleTouchCancel = () => {
      touchStartRef.current = null;
      isSwipingRef.current = false;
    };

    // Add event listeners with passive: false to allow preventDefault
    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd, { passive: false });
    document.addEventListener('touchcancel', handleTouchCancel, { passive: true });

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
      document.removeEventListener('touchcancel', handleTouchCancel);
    };
  }, [enabled, location, threshold, maxVerticalThreshold, edgeThreshold]);

  return {
    canNavigateBack: canNavigateBack(),
    canNavigateForward: canNavigateForward(),
    navigateBack,
    navigateForward,
    isSwipeEnabled: enabled,
    swipeState
  };
}