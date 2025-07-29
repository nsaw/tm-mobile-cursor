import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AccessibilityInfo, Platform } from 'react-native';

interface AccessibilityContextType {
  isScreenReaderEnabled: boolean;
  isReduceMotionEnabled: boolean;
  isReduceTransparencyEnabled: boolean;
  isInvertColorsEnabled: boolean;
  announceForAccessibility: (announcement: string) => void;
  setAccessibilityFocus: (reactTag: number) => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

interface AccessibilityProviderProps {
  children: ReactNode;
}

export const AccessibilityProvider: React.FC<AccessibilityProviderProps> = ({ children }) => {
  const [isScreenReaderEnabled, setIsScreenReaderEnabled] = useState(false);
  const [isReduceMotionEnabled, setIsReduceMotionEnabled] = useState(false);
  const [isReduceTransparencyEnabled, setIsReduceTransparencyEnabled] = useState(false);
  const [isInvertColorsEnabled, setIsInvertColorsEnabled] = useState(false);

  useEffect(() => {
    // Check initial state
    const checkScreenReader = async () => {
      try {
        const enabled = await AccessibilityInfo.isScreenReaderEnabled();
        setIsScreenReaderEnabled(enabled);
      } catch (error) {
        console.warn('Failed to check screen reader status:', error);
      }
    };

    const checkReduceMotion = async () => {
      try {
        const enabled = await AccessibilityInfo.isReduceMotionEnabled();
        setIsReduceMotionEnabled(enabled);
      } catch (error) {
        console.warn('Failed to check reduce motion status:', error);
      }
    };

    const checkReduceTransparency = async () => {
      try {
        const enabled = await AccessibilityInfo.isReduceTransparencyEnabled();
        setIsReduceTransparencyEnabled(enabled);
      } catch (error) {
        console.warn('Failed to check reduce transparency status:', error);
      }
    };

    const checkInvertColors = async () => {
      try {
        const enabled = await AccessibilityInfo.isInvertColorsEnabled();
        setIsInvertColorsEnabled(enabled);
      } catch (error) {
        console.warn('Failed to check invert colors status:', error);
      }
    };

    // Check initial states
    checkScreenReader();
    checkReduceMotion();
    checkReduceTransparency();
    checkInvertColors();

    // Set up listeners
    const screenReaderListener = AccessibilityInfo.addEventListener(
      'screenReaderChanged',
      setIsScreenReaderEnabled
    );

    const reduceMotionListener = AccessibilityInfo.addEventListener(
      'reduceMotionChanged',
      setIsReduceMotionEnabled
    );

    const reduceTransparencyListener = AccessibilityInfo.addEventListener(
      'reduceTransparencyChanged',
      setIsReduceTransparencyEnabled
    );

    const invertColorsListener = AccessibilityInfo.addEventListener(
      'invertColorsChanged',
      setIsInvertColorsEnabled
    );

    return () => {
      screenReaderListener?.remove();
      reduceMotionListener?.remove();
      reduceTransparencyListener?.remove();
      invertColorsListener?.remove();
    };
  }, []);

  const announceForAccessibility = (announcement: string) => {
    if (Platform.OS === 'ios') {
      AccessibilityInfo.announceForAccessibility(announcement);
    } else {
      AccessibilityInfo.announceForAccessibility(announcement);
    }
  };

  const setAccessibilityFocus = (reactTag: number) => {
    if (Platform.OS === 'ios') {
      AccessibilityInfo.setAccessibilityFocus(reactTag);
    }
  };

  const value: AccessibilityContextType = {
    isScreenReaderEnabled,
    isReduceMotionEnabled,
    isReduceTransparencyEnabled,
    isInvertColorsEnabled,
    announceForAccessibility,
    setAccessibilityFocus,
  };

  return (
    <AccessibilityContext.Provider value={value}>
      {children}
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = (): AccessibilityContextType => {
  const context = useContext(AccessibilityContext);
  if (context === undefined) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
};

export default AccessibilityProvider; 