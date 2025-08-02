import { renderHook } from '@testing-library/react-native';
import { useAccessibility } from './useAccessibility';

// Mock React Native AccessibilityInfo
jest.mock('react-native', () => ({
  ...jest.requireActual('react-native'),
  AccessibilityInfo: {
    isHighTextContrastEnabled: jest.fn().mockResolvedValue(false),
    isScreenReaderEnabled: jest.fn().mockResolvedValue(false),
    isReduceMotionEnabled: jest.fn().mockResolvedValue(false),
    isReduceTransparencyEnabled: jest.fn().mockResolvedValue(false),
    isInvertColorsEnabled: jest.fn().mockResolvedValue(false),
    isBoldTextEnabled: jest.fn().mockResolvedValue(false),
    isGrayscaleEnabled: jest.fn().mockResolvedValue(false),
    addEventListener: jest.fn().mockReturnValue({ remove: jest.fn() }),
  },
}));

describe('useAccessibility', () => {
  it('should return initial accessibility configuration', () => {
    const { result } = renderHook(() => useAccessibility());
    
    expect(result.current).toEqual({
      isHighContrastEnabled: false,
      isScreenReaderEnabled: false,
      isReduceMotionEnabled: false,
      isReduceTransparencyEnabled: false,
      isInvertColorsEnabled: false,
      isBoldTextEnabled: false,
      isGrayscaleEnabled: false,
      isLargeTextEnabled: false,
    });
  });

  it('should set up accessibility event listeners', () => {
    renderHook(() => useAccessibility());
    
    // Verify that event listeners are set up
    expect(jest.mocked(require('react-native').AccessibilityInfo.addEventListener)).toHaveBeenCalled();
  });
}); 