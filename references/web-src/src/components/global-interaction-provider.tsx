import React, { createContext, useContext, useEffect } from 'react';
import { hapticFeedback } from '@/hooks/use-haptic-feedback';

interface GlobalInteractionContextType {
  triggerHaptic: (type: 'light' | 'medium' | 'heavy') => void;
}

const GlobalInteractionContext = createContext<GlobalInteractionContextType>({
  triggerHaptic: () => {}
});

export function useGlobalInteraction() {
  return useContext(GlobalInteractionContext);
}

export function GlobalInteractionProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Global event listeners for haptic feedback on all interactive elements
    const handleTouchStart = (e: TouchEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('button, [role="button"], .interactive-card, .clickable')) {
        hapticFeedback.light();
      }
    };

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      // Button clicks
      if (target.closest('button, [role="button"]')) {
        hapticFeedback.light();
        return;
      }
      
      // Card/interactive element clicks
      if (target.closest('.interactive-card, .thoughtmark-card, .bin-card')) {
        hapticFeedback.medium();
        return;
      }
      
      // Navigation clicks
      if (target.closest('[data-nav-item]')) {
        hapticFeedback.light();
        return;
      }
      
      // Form interactions
      if (target.closest('input, textarea, select')) {
        hapticFeedback.light();
        return;
      }
    };

    const handleLongPress = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('.thoughtmark-card, .bin-card')) {
        hapticFeedback.heavy();
      }
    };

    // Add global listeners
    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('click', handleClick, { passive: true });
    document.addEventListener('contextmenu', handleLongPress, { passive: true });

    // Global CSS class additions for micro-animations
    const addInteractiveClasses = () => {
      const interactiveElements = document.querySelectorAll(
        'button, [role="button"], .interactive-card, .thoughtmark-card, .bin-card, input, textarea, select'
      );
      
      interactiveElements.forEach(element => {
        element.classList.add('interactive-element');
      });
    };

    // Run immediately and on DOM changes
    addInteractiveClasses();
    const observer = new MutationObserver(addInteractiveClasses);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('click', handleClick);
      document.removeEventListener('contextmenu', handleLongPress);
      observer.disconnect();
    };
  }, []);

  const triggerHaptic = (type: 'light' | 'medium' | 'heavy') => {
    hapticFeedback[type]();
  };

  return (
    <GlobalInteractionContext.Provider value={{ triggerHaptic }}>
      {children}
    </GlobalInteractionContext.Provider>
  );
}