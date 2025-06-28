import { useEffect } from 'react';

interface ScrollPhysicsOptions {
  momentum?: number;
  friction?: number;
  maxVelocity?: number;
  velocityMultiplier?: number;
  enabled?: boolean;
}

export function useEnhancedScroll(options: ScrollPhysicsOptions = {}) {
  const {
    momentum = 0.99, // iOS-native high momentum
    friction = 0.005, // Reduced friction for smoother deceleration
    maxVelocity = 150,
    velocityMultiplier = 25,
    enabled = true
  } = options;

  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return;

    let isScrolling = false;
    let velocity = 0;
    let lastTouchY = 0;
    let lastTime = 0;
    let animationFrame: number;

    const applyMomentum = (element: HTMLElement) => {
      if (Math.abs(velocity) < 0.05) {
        isScrolling = false;
        return;
      }

      element.scrollTop += velocity;
      
      // iOS-native deceleration curve with exponential falloff
      velocity *= momentum;
      velocity -= Math.sign(velocity) * Math.min(Math.abs(velocity * friction), 0.1);
      
      // Ensure smooth stop near the end
      if (Math.abs(velocity) < 0.5) {
        velocity *= 0.95;
      }

      animationFrame = requestAnimationFrame(() => applyMomentum(element));
    };

    const handleTouchStart = (e: TouchEvent) => {
      const target = e.target as HTMLElement;
      if (!target || !target.closest('[data-enhanced-scroll]')) return;

      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
      
      isScrolling = false;
      velocity = 0;
      lastTouchY = e.touches[0].clientY;
      lastTime = Date.now();
    };

    const handleTouchMove = (e: TouchEvent) => {
      const target = e.target as HTMLElement;
      const scrollContainer = target.closest('[data-enhanced-scroll]') as HTMLElement;
      if (!scrollContainer) return;

      const currentY = e.touches[0].clientY;
      const currentTime = Date.now();
      const deltaY = lastTouchY - currentY;
      const deltaTime = currentTime - lastTime;

      if (deltaTime > 0) {
        // Increased velocity multiplier for more responsive fling
        velocity = Math.min(Math.max((deltaY / deltaTime) * velocityMultiplier, -maxVelocity), maxVelocity);
      }

      lastTouchY = currentY;
      lastTime = currentTime;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const target = e.target as HTMLElement;
      const scrollContainer = target.closest('[data-enhanced-scroll]') as HTMLElement;
      if (!scrollContainer || Math.abs(velocity) < 1) return;

      isScrolling = true;
      applyMomentum(scrollContainer);
    };

    const handleWheel = (e: WheelEvent) => {
      const target = e.target as HTMLElement;
      const scrollContainer = target.closest('[data-enhanced-scroll]') as HTMLElement;
      if (!scrollContainer) return;

      e.preventDefault();
      
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }

      // Convert wheel delta to velocity with higher multiplier for more fling
      velocity = Math.min(Math.max(e.deltaY * 1.5, -maxVelocity), maxVelocity);
      
      if (Math.abs(velocity) > 0.1) {
        isScrolling = true;
        applyMomentum(scrollContainer);
      }
    };

    // Apply enhanced scroll attributes to scrollable containers
    const enhanceScrollContainers = () => {
      const scrollableSelectors = [
        '.overflow-y-auto',
        '.overflow-auto',
        '.space-y-3',
        '.space-y-4',
        '.space-y-6',
        '[role="main"]'
      ];

      scrollableSelectors.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(element => {
          if (!element.hasAttribute('data-enhanced-scroll')) {
            element.setAttribute('data-enhanced-scroll', 'true');
            
            // Set CSS properties for enhanced physics
            (element as HTMLElement).style.setProperty('scroll-behavior', 'auto');
            (element as HTMLElement).style.setProperty('-webkit-overflow-scrolling', 'touch');
            (element as HTMLElement).style.setProperty('overscroll-behavior', 'auto');
          }
        });
      });
    };

    // Initial enhancement
    enhanceScrollContainers();

    // Re-enhance on DOM changes
    const observer = new MutationObserver(enhanceScrollContainers);
    observer.observe(document.body, { childList: true, subtree: true });

    // Add event listeners
    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchmove', handleTouchMove, { passive: true });
    document.addEventListener('touchend', handleTouchEnd, { passive: true });
    document.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
      
      observer.disconnect();
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
      document.removeEventListener('wheel', handleWheel);
    };
  }, [enabled, momentum, friction, maxVelocity]);

  return {
    enabled
  };
}