import { AccessibilityInfo } from 'react-native';
import {
  announceForAccessibility,
  setAccessibilityFocus,
  getRecommendedTimeoutMillis,
  getRecommendedTimeoutMillisSync,
  shouldShowAccessibilityMenu,
  getAccessibilityConfig,
  generateAccessibilityLabel,
  shouldReduceMotion,
  shouldReduceTransparency,
  shouldInvertColors,
  shouldUseBoldText,
  shouldUseGrayscale,
  shouldUseLargeText,
} from './accessibilityUtils';

// Mock AccessibilityInfo
jest.mock('react-native', () => ({
  ...jest.requireActual('react-native'),
  AccessibilityInfo: {
    announceForAccessibility: jest.fn(),
    setAccessibilityFocus: jest.fn(),
    getRecommendedTimeoutMillis: jest.fn(),
    isHighTextContrastEnabled: jest.fn(),
    isScreenReaderEnabled: jest.fn(),
    isReduceMotionEnabled: jest.fn(),
    isReduceTransparencyEnabled: jest.fn(),
    isInvertColorsEnabled: jest.fn(),
    isBoldTextEnabled: jest.fn(),
    isGrayscaleEnabled: jest.fn(),
  },
}));

describe('accessibilityUtils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('announceForAccessibility', () => {
    it('should log accessibility announcement', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      announceForAccessibility('Test announcement');
      expect(consoleSpy).toHaveBeenCalledWith('Accessibility announcement:', 'Test announcement');
      consoleSpy.mockRestore();
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

  describe('getRecommendedTimeoutMillisSync', () => {
    it('should return default timeout', () => {
      const result = getRecommendedTimeoutMillisSync();
      expect(result).toBe(5000);
    });
  });

  describe('shouldShowAccessibilityMenu', () => {
    it('should return true by default', () => {
      const result = shouldShowAccessibilityMenu();
      expect(result).toBe(true);
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
      };

      (AccessibilityInfo.isHighTextContrastEnabled as jest.Mock).mockResolvedValue(mockConfig.isHighContrastEnabled);
      (AccessibilityInfo.isScreenReaderEnabled as jest.Mock).mockResolvedValue(mockConfig.isScreenReaderEnabled);
      (AccessibilityInfo.isReduceMotionEnabled as jest.Mock).mockResolvedValue(mockConfig.isReduceMotionEnabled);
      (AccessibilityInfo.isReduceTransparencyEnabled as jest.Mock).mockResolvedValue(mockConfig.isReduceTransparencyEnabled);
      (AccessibilityInfo.isInvertColorsEnabled as jest.Mock).mockResolvedValue(mockConfig.isInvertColorsEnabled);
      (AccessibilityInfo.isBoldTextEnabled as jest.Mock).mockResolvedValue(mockConfig.isBoldTextEnabled);
      (AccessibilityInfo.isGrayscaleEnabled as jest.Mock).mockResolvedValue(mockConfig.isGrayscaleEnabled);

      const result = await getAccessibilityConfig();
      expect(result).toEqual({
        ...mockConfig,
        isLargeTextEnabled: false,
      });
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
      isLargeTextEnabled: true,
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
      expect(shouldUseLargeText(mockConfig)).toBe(true);
    });
  });
}); 