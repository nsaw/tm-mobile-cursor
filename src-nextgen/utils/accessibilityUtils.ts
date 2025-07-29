import { AccessibilityInfo } from 'react-native';
import { AccessibilityConfig } from '../hooks/useAccessibility';

export const announceForAccessibility = (announcement: string): void => {
  AccessibilityInfo.announceForAccessibility(announcement);
};

export const setAccessibilityFocus = (reactTag: number): void => {
  // Note: setAccessibilityFocus is not available in all React Native versions
  // This is a placeholder for future implementation
  console.log('setAccessibilityFocus called with reactTag:', reactTag);
};

export const getRecommendedTimeoutMillis = (): Promise<number> => {
  // Note: getRecommendedTimeoutMillis requires a parameter in some versions
  // This is a placeholder for future implementation
  return Promise.resolve(5000);
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
    isLargeTextEnabled,
  ] = await Promise.all([
    AccessibilityInfo.isHighTextContrastEnabled(),
    AccessibilityInfo.isScreenReaderEnabled(),
    AccessibilityInfo.isReduceMotionEnabled(),
    AccessibilityInfo.isReduceTransparencyEnabled(),
    AccessibilityInfo.isInvertColorsEnabled(),
    AccessibilityInfo.isBoldTextEnabled(),
    AccessibilityInfo.isGrayscaleEnabled(),
    AccessibilityInfo.isBoldTextEnabled(), // Fallback for large text
  ]);

  return {
    isHighContrastEnabled,
    isScreenReaderEnabled,
    isReduceMotionEnabled,
    isReduceTransparencyEnabled,
    isInvertColorsEnabled,
    isBoldTextEnabled,
    isGrayscaleEnabled,
    isLargeTextEnabled,
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