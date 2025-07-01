import { useCallback } from 'react';

type HapticType = 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error';

interface HapticOptions {
  fallbackAnimation?: boolean;
  duration?: number;
}

export function useHapticFeedback() {
  const triggerHaptic = useCallback((type: HapticType = 'light', options: HapticOptions = {}) => {
    const { fallbackAnimation = true, duration = 100 } = options;

    // Try native haptic feedback first (iOS Safari)
    if ('vibrate' in navigator && navigator.vibrate) {
      const patterns: Record<HapticType, number | number[]> = {
        light: 10,
        medium: 20,
        heavy: 40,
        success: [10, 50, 10],
        warning: [20, 50, 20],
        error: [40, 100, 40]
      };
      
      navigator.vibrate(patterns[type]);
    }

    // Visual haptic feedback fallback
    if (fallbackAnimation) {
      const activeElement = document.activeElement as HTMLElement;
      if (activeElement) {
        // Remove any existing haptic classes
        activeElement.classList.remove('haptic-light', 'haptic-medium', 'haptic-heavy');
        
        // Add appropriate haptic class
        const hapticClass = `haptic-${type === 'success' ? 'light' : type === 'warning' ? 'medium' : type === 'error' ? 'heavy' : type}`;
        activeElement.classList.add(hapticClass);
        
        // Remove class after animation
        setTimeout(() => {
          activeElement.classList.remove(hapticClass);
        }, duration + 50);
      }
    }
  }, []);

  // Convenience methods for common interactions
  const tapFeedback = useCallback(() => triggerHaptic('light'), [triggerHaptic]);
  const selectFeedback = useCallback(() => triggerHaptic('medium'), [triggerHaptic]);
  const deleteFeedback = useCallback(() => triggerHaptic('heavy'), [triggerHaptic]);
  const successFeedback = useCallback(() => triggerHaptic('success'), [triggerHaptic]);
  const errorFeedback = useCallback(() => triggerHaptic('error'), [triggerHaptic]);

  return {
    triggerHaptic,
    tapFeedback,
    selectFeedback,
    deleteFeedback,
    successFeedback,
    errorFeedback
  };
}

// Global haptic feedback utility
export const hapticFeedback = {
  light: () => {
    if ('vibrate' in navigator) navigator.vibrate(10);
  },
  medium: () => {
    if ('vibrate' in navigator) navigator.vibrate(20);
  },
  heavy: () => {
    if ('vibrate' in navigator) navigator.vibrate(40);
  },
  success: () => {
    if ('vibrate' in navigator) navigator.vibrate([10, 50, 10]);
  },
  error: () => {
    if ('vibrate' in navigator) navigator.vibrate([40, 100, 40]);
  }
};