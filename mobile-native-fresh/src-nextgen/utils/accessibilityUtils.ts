import { AccessibilityInfo } from 'react-native';
import { AccessibilityConfig } from '../hooks/useAccessibility';

export const announceForAccessibility = (announcement: string): void => {
  // Note: announceForAccessibility is not available in React Native
  console.log('Accessibility announcement:', announcement);
};

export const setAccessibilityFocus = (reactTag: number): void => {
  AccessibilityInfo.setAccessibilityFocus(reactTag);
};

export const getRecommendedTimeoutMillis = (): Promise<number> => {
  return AccessibilityInfo.getRecommendedTimeoutMillis();
};

// Note: getRecommendedTimeoutMillisSync and shouldShowAccessibilityMenu are not available in React Native
export const getRecommendedTimeoutMillisSync = (): number => {
  return 5000; // Default timeout
};

export const shouldShowAccessibilityMenu = (): boolean => {
  return true; // Default to showing menu
};

export const getAccessibilityConfig = async (): Promise<AccessibilityConfig> => {
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
    isLargeTextEnabled: false, // Not directly available in React Native
  };
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

export const shouldUseLargeText = (config: AccessibilityConfig): boolean => {
  return config.isLargeTextEnabled;
}; 