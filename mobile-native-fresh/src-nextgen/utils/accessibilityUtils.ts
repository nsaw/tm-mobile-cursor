import React from 'react';
import { AccessibilityInfo, Platform } from 'react-native';

export interface AccessibilityConfig {
  accessible: boolean;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  accessibilityRole?: string;
  accessibilityState?: any;
  accessibilityValue?: any;
  importantForAccessibility?: 'auto' | 'yes' | 'no' | 'no-hide-descendants';
}

export const createAccessibilityProps = (
  config: AccessibilityConfig,
  screenReaderEnabled = true
): AccessibilityConfig => {
  if (!screenReaderEnabled && config.importantForAccessibility !== 'yes') {
    return {
      ...config,
      accessible: false,
    };
  }

  return config;
};

export const useAccessibility = () => {
  const [screenReaderEnabled, setScreenReaderEnabled] = React.useState(false);
  const [highContrastEnabled, setHighContrastEnabled] = React.useState(false);

  React.useEffect(() => {
    const checkAccessibility = async () => {
      try {
        const isScreenReaderEnabled = await AccessibilityInfo.isScreenReaderEnabled();
        const isHighContrastEnabled = await AccessibilityInfo.isHighTextContrastEnabled();

        setScreenReaderEnabled(isScreenReaderEnabled);
        setHighContrastEnabled(isHighContrastEnabled);
      } catch (error) {
        console.warn('Failed to check accessibility settings:', error);
      }
    };

    checkAccessibility();

    const screenReaderSubscription = AccessibilityInfo.addEventListener(
      'screenReaderChanged',
      setScreenReaderEnabled
    );

    const highContrastSubscription = AccessibilityInfo.addEventListener(
      'highTextContrastChanged',
      setHighContrastEnabled
    );

    return () => {
      screenReaderSubscription?.remove();
      highContrastSubscription?.remove();
    };
  }, []);

  return {
    screenReaderEnabled,
    highContrastEnabled,
    createAccessibilityProps: (config: AccessibilityConfig) =>
      createAccessibilityProps(config, screenReaderEnabled),
  };
};

export const announceForAccessibility = (message: string): void => {
  if (Platform.OS === 'ios') {
    AccessibilityInfo.announceForAccessibility(message);
  } else {
    AccessibilityInfo.announce(message);
  }
};

export const setAccessibilityFocus = (reactTag: number): void => {
  AccessibilityInfo.setAccessibilityFocus(reactTag);
};

export const getRecommendedTimeoutMillis = (): Promise<number> => {
  return AccessibilityInfo.getRecommendedTimeoutMillis();
};

export const getRecommendedTimeoutMillisSync = (): number => {
  // Note: This method may not be available in all React Native versions
  // Using a fallback implementation
  return 5000;
};

export const shouldShowAccessibilityMenu = (): boolean => {
  // Note: This method may not be available in all React Native versions
  // Using a fallback implementation
  return false;
};

export const getAccessibilityConfig = async (): Promise<AccessibilityConfig> => {
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

    return {
      isHighContrastEnabled,
      isScreenReaderEnabled,
      isReduceMotionEnabled,
      isReduceTransparencyEnabled,
      isInvertColorsEnabled,
      isBoldTextEnabled,
      isGrayscaleEnabled,
      isVoiceOverEnabled: false, // Not available in current React Native version
      isTalkBackEnabled: false, // Not available in current React Native version
    };
  } catch (error) {
    // Fallback to mock values if AccessibilityInfo methods fail
    return {
      isHighContrastEnabled: false,
      isScreenReaderEnabled: false,
      isReduceMotionEnabled: false,
      isReduceTransparencyEnabled: false,
      isInvertColorsEnabled: false,
      isBoldTextEnabled: false,
      isGrayscaleEnabled: false,
      isVoiceOverEnabled: false,
      isTalkBackEnabled: false,
    };
  }
};

export const generateAccessibilityLabel = (
  text: string,
  role?: string,
  state?: string
): string => {
  let label = text;
  
  if (role) {
    label += `, ${role}`;
  }
  
  if (state) {
    label += `, ${state}`;
  }
  
  return label;
};

export const shouldReduceMotion = (config: AccessibilityConfig): boolean => {
  return config.isReduceMotionEnabled;
};

export const shouldReduceTransparency = (config: AccessibilityConfig): boolean => {
  return config.isReduceTransparencyEnabled;
};

export const shouldInvertColors = (config: AccessibilityConfig): boolean => {
  return config.isInvertColorsEnabled;
};

export const shouldUseBoldText = (config: AccessibilityConfig): boolean => {
  return config.isBoldTextEnabled;
};

export const shouldUseGrayscale = (config: AccessibilityConfig): boolean => {
  return config.isGrayscaleEnabled;
};

export const shouldUseLargeText = (_config: AccessibilityConfig): boolean => {
  // Since isLargeTextEnabled is not available, we'll use a fallback
  return false;
}; 