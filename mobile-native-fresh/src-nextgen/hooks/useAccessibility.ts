import { useState, useEffect } from 'react';
import { AccessibilityRole, AccessibilityState } from 'react-native';

export interface AccessibilityConfig {
  isHighContrastEnabled: boolean;
  isReduceMotionEnabled: boolean;
  isScreenReaderEnabled: boolean;
  isBoldTextEnabled: boolean;
  isGrayscaleEnabled: boolean;
  isInvertColorsEnabled: boolean;
  isReduceTransparencyEnabled: boolean;
  isVoiceOverEnabled: boolean;
  isTalkBackEnabled: boolean;
}

export interface AccessibilitySettings {
  highContrast: boolean;
  reduceMotion: boolean;
  screenReader: boolean;
  boldText: boolean;
  grayscale: boolean;
  invertColors: boolean;
  reduceTransparency: boolean;
}

// Re-export React Native accessibility types for convenience
export type { AccessibilityRole, AccessibilityState };

export interface AccessibilityProps {
  accessible?: boolean;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  accessibilityRole?: AccessibilityRole;
  accessibilityState?: AccessibilityState;
  accessibilityValue?: {
    min?: number;
    max?: number;
    now?: number;
    text?: string;
  };
  accessibilityActions?: Array<{
    name: string;
    label?: string;
  }>;
  onAccessibilityAction?: (event: { nativeEvent: { actionName: string } }) => void;
  importantForAccessibility?: 'auto' | 'yes' | 'no' | 'no-hide-descendants';
}

export const useAccessibility = () => {
  const [accessibilityState, setAccessibilityState] = useState<AccessibilityConfig>({
    isHighContrastEnabled: false,
    isReduceMotionEnabled: false,
    isScreenReaderEnabled: false,
    isBoldTextEnabled: false,
    isGrayscaleEnabled: false,
    isInvertColorsEnabled: false,
    isReduceTransparencyEnabled: false,
    isVoiceOverEnabled: false,
    isTalkBackEnabled: false,
  });

  useEffect(() => {
    // Mock accessibility state for now - will be replaced with actual React Native calls
    const mockAccessibilityState: AccessibilityConfig = {
      isHighContrastEnabled: false,
      isReduceMotionEnabled: false,
      isScreenReaderEnabled: false,
      isBoldTextEnabled: false,
      isGrayscaleEnabled: false,
      isInvertColorsEnabled: false,
      isReduceTransparencyEnabled: false,
      isVoiceOverEnabled: false,
      isTalkBackEnabled: false,
    };

    setAccessibilityState(mockAccessibilityState);
  }, []);

  const getAccessibilitySettings = (): AccessibilitySettings => ({
    highContrast: accessibilityState.isHighContrastEnabled,
    reduceMotion: accessibilityState.isReduceMotionEnabled,
    screenReader: accessibilityState.isScreenReaderEnabled,
    boldText: accessibilityState.isBoldTextEnabled,
    grayscale: accessibilityState.isGrayscaleEnabled,
    invertColors: accessibilityState.isInvertColorsEnabled,
    reduceTransparency: accessibilityState.isReduceTransparencyEnabled,
  });

  const isAccessibilityEnabled = (): boolean => {
    return Object.values(accessibilityState).some(Boolean);
  };

  const getAccessibilityAnnouncement = (message: string): void => {
    if (accessibilityState.isScreenReaderEnabled) {
      console.log('Accessibility announcement:', message);
    }
  };

  return {
    ...accessibilityState,
    getAccessibilitySettings,
    isAccessibilityEnabled,
    getAccessibilityAnnouncement,
  };
};

export default useAccessibility; 