import { AccessibilityInfo } from 'react-native';

import {
  announceForAccessibility,
  setAccessibilityFocus,
  getRecommendedTimeoutMillis,
  getAccessibilityConfig,
  generateAccessibilityLabel,
  shouldReduceMotion,
  shouldReduceTransparency,
  shouldInvertColors,
  shouldUseBoldText,
  shouldUseGrayscale,
  shouldUseLargeText,
} from './accessibilityUtils';

describe('accessibilityUtils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('announceForAccessibility', () => {
    it('should call AccessibilityInfo.announceForAccessibility', () => {
      announceForAccessibility('Test announcement');
      expect(AccessibilityInfo.announceForAccessibility).toHaveBeenCalledWith('Test announcement');
    });
  });

  describe('setAccessibilityFocus', () => {
    it('should call AccessibilityInfo.setAccessibilityFocus', () => {
      setAccessibilityFocus(123);
      expect(AccessibilityInfo.setAccessibilityFocus).toHaveBeenCalledWith(123);
    });
  });

  describe('getRecommendedTimeoutMillis', () => {
    it('should call AccessibilityInfo.getRecommendedTimeoutMillis', async () => {
      (AccessibilityInfo.getRecommendedTimeoutMillis as jest.Mock).mockResolvedValue(5000);
      const result = await getRecommendedTimeoutMillis();
      expect(AccessibilityInfo.getRecommendedTimeoutMillis).toHaveBeenCalled();
      expect(result).toBe(5000);
    });
  });

  describe('getAccessibilityConfig', () => {
    it('should return accessibility configuration', async () => {
      const mockConfig = {
        isHighContrastEnabled: true,
        isScreenReaderEnabled: true,
        isReduceMotionEnabled: false,
        isReduceTransparencyEnabled: false,
        isInvertColorsEnabled: false,
        isBoldTextEnabled: false,
        isGrayscaleEnabled: false,
        isVoiceOverEnabled: false,
        isTalkBackEnabled: false,
      };

      (AccessibilityInfo.isHighTextContrastEnabled as jest.Mock).mockResolvedValue(mockConfig.isHighContrastEnabled);
      (AccessibilityInfo.isScreenReaderEnabled as jest.Mock).mockResolvedValue(mockConfig.isScreenReaderEnabled);
      (AccessibilityInfo.isReduceMotionEnabled as jest.Mock).mockResolvedValue(mockConfig.isReduceMotionEnabled);
      (AccessibilityInfo.isReduceTransparencyEnabled as jest.Mock).mockResolvedValue(mockConfig.isReduceTransparencyEnabled);
      (AccessibilityInfo.isInvertColorsEnabled as jest.Mock).mockResolvedValue(mockConfig.isInvertColorsEnabled);
      (AccessibilityInfo.isBoldTextEnabled as jest.Mock).mockResolvedValue(mockConfig.isBoldTextEnabled);
      (AccessibilityInfo.isGrayscaleEnabled as jest.Mock).mockResolvedValue(mockConfig.isGrayscaleEnabled);

      const result = await getAccessibilityConfig();
      expect(result).toEqual(mockConfig);
    });
  });

  describe('generateAccessibilityLabel', () => {
    it('should generate label with text only', () => {
      const result = generateAccessibilityLabel('Test Button');
      expect(result).toBe('Test Button');
    });

    it('should generate label with text and role', () => {
      const result = generateAccessibilityLabel('Test Button', 'button');
      expect(result).toBe('Test Button, button');
    });

    it('should generate label with text, role, and state', () => {
      const result = generateAccessibilityLabel('Test Button', 'button', 'pressed');
      expect(result).toBe('Test Button, button, pressed');
    });
  });

  describe('accessibility state helpers', () => {
    const mockConfig = {
      isHighContrastEnabled: true,
      isScreenReaderEnabled: true,
      isReduceMotionEnabled: true,
      isReduceTransparencyEnabled: true,
      isInvertColorsEnabled: true,
      isBoldTextEnabled: true,
      isGrayscaleEnabled: true,
      isVoiceOverEnabled: false,
      isTalkBackEnabled: false,
    };

    it('should check if motion should be reduced', () => {
      expect(shouldReduceMotion(mockConfig)).toBe(true);
    });

    it('should check if transparency should be reduced', () => {
      expect(shouldReduceTransparency(mockConfig)).toBe(true);
    });

    it('should check if colors should be inverted', () => {
      expect(shouldInvertColors(mockConfig)).toBe(true);
    });

    it('should check if bold text should be used', () => {
      expect(shouldUseBoldText(mockConfig)).toBe(true);
    });

    it('should check if grayscale should be used', () => {
      expect(shouldUseGrayscale(mockConfig)).toBe(true);
    });

    it('should check if large text should be used', () => {
      // Since isLargeTextEnabled is not available, this should always return false
      expect(shouldUseLargeText(mockConfig)).toBe(false);
    });
  });
}); 