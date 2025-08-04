import { useState, useEffect } from 'react';
import { AccessibilityInfo, AccessibilityRole, AccessibilityState } from 'react-native';

export interface AccessibilityConfig {
  isHighContrastEnabled: boolean;
  isScreenReaderEnabled: boolean;
  isReduceMotionEnabled: boolean;
  isReduceTransparencyEnabled: boolean;
  isInvertColorsEnabled: boolean;
  isBoldTextEnabled: boolean;
  isGrayscaleEnabled: boolean;
  isLargeTextEnabled: boolean;
}

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

export const useAccessibility = (): AccessibilityConfig => {
  const [config, setConfig] = useState<AccessibilityConfig>({
    isHighContrastEnabled: false,
    isScreenReaderEnabled: false,
    isReduceMotionEnabled: false,
    isReduceTransparencyEnabled: false,
    isInvertColorsEnabled: false,
    isBoldTextEnabled: false,
    isGrayscaleEnabled: false,
    isLargeTextEnabled: false,
  });

  useEffect(() => {
    const updateAccessibilityConfig = async () => {
      try {
        const [
          isHighContrastEnabled,
          isScreenReaderEnabled,
          isReduceMotionEnabled,
          isReduceTransparencyEnabled,
          isInvertColorsEnabled,
          isBoldTextEnabled,
          isGrayscaleEnabled,
        ] = await Promise.all([
          AccessibilityInfo.isHighTextContrastEnabled(),
          AccessibilityInfo.isScreenReaderEnabled(),
          AccessibilityInfo.isReduceMotionEnabled(),
          AccessibilityInfo.isReduceTransparencyEnabled(),
          AccessibilityInfo.isInvertColorsEnabled(),
          AccessibilityInfo.isBoldTextEnabled(),
          AccessibilityInfo.isGrayscaleEnabled(),
        ]);

        // Large text is not directly available, we'll use a default value
        const isLargeTextEnabled = false;

        setConfig({
          isHighContrastEnabled,
          isScreenReaderEnabled,
          isReduceMotionEnabled,
          isReduceTransparencyEnabled,
          isInvertColorsEnabled,
          isBoldTextEnabled,
          isGrayscaleEnabled,
          isLargeTextEnabled,
        });
      } catch (error) {
        console.warn('Failed to get accessibility configuration:', error);
      }
    };

    updateAccessibilityConfig();

    // Note: highTextContrastDidChange is not a valid AccessibilityInfo event
    // We'll rely on the initial check and manual updates

    const screenReaderListener = AccessibilityInfo.addEventListener(
      'screenReaderChanged',
      (isScreenReaderEnabled: boolean) => {
        setConfig(prev => ({ ...prev, isScreenReaderEnabled }));
      }
    );

    const reduceMotionListener = AccessibilityInfo.addEventListener(
      'reduceMotionChanged',
      (isReduceMotionEnabled: boolean) => {
        setConfig(prev => ({ ...prev, isReduceMotionEnabled }));
      }
    );

    const reduceTransparencyListener = AccessibilityInfo.addEventListener(
      'reduceTransparencyChanged',
      (isReduceTransparencyEnabled: boolean) => {
        setConfig(prev => ({ ...prev, isReduceTransparencyEnabled }));
      }
    );

    const invertColorsListener = AccessibilityInfo.addEventListener(
      'invertColorsChanged',
      (isInvertColorsEnabled: boolean) => {
        setConfig(prev => ({ ...prev, isInvertColorsEnabled }));
      }
    );

    const boldTextListener = AccessibilityInfo.addEventListener(
      'boldTextChanged',
      (isBoldTextEnabled: boolean) => {
        setConfig(prev => ({ ...prev, isBoldTextEnabled }));
      }
    );

    const grayscaleListener = AccessibilityInfo.addEventListener(
      'grayscaleChanged',
      (isGrayscaleEnabled: boolean) => {
        setConfig(prev => ({ ...prev, isGrayscaleEnabled }));
      }
    );

    // Large text listener is not available in React Native, so we'll skip it

    return () => {
      screenReaderListener?.remove();
      reduceMotionListener?.remove();
      reduceTransparencyListener?.remove();
      invertColorsListener?.remove();
      boldTextListener?.remove();
      grayscaleListener?.remove();
      // largeTextListener is null, so no need to remove
    };
  }, []);

  return config;
}; 