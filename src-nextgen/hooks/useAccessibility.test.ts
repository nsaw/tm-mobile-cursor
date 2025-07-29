import { renderHook, act } from '@testing-library/react-native';
import { AccessibilityInfo } from 'react-native';
import { useAccessibility } from './useAccessibility';

// Mock AccessibilityInfo
jest.mock('react-native', () => ({
  ...jest.requireActual('react-native'),
  AccessibilityInfo: {
    isHighTextContrastEnabled: jest.fn(),
    isScreenReaderEnabled: jest.fn(),
    isReduceMotionEnabled: jest.fn(),
    isReduceTransparencyEnabled: jest.fn(),
    isInvertColorsEnabled: jest.fn(),
    isBoldTextEnabled: jest.fn(),
    isGrayscaleEnabled: jest.fn(),
    addEventListener: jest.fn(),
  },
}));

const mockAddEventListener = AccessibilityInfo.addEventListener as jest.MockedFunction<
  typeof AccessibilityInfo.addEventListener
>;

describe('useAccessibility', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock initial accessibility state
    (AccessibilityInfo.isHighTextContrastEnabled as jest.Mock).mockResolvedValue(false);
    (AccessibilityInfo.isScreenReaderEnabled as jest.Mock).mockResolvedValue(false);
    (AccessibilityInfo.isReduceMotionEnabled as jest.Mock).mockResolvedValue(false);
    (AccessibilityInfo.isReduceTransparencyEnabled as jest.Mock).mockResolvedValue(false);
    (AccessibilityInfo.isInvertColorsEnabled as jest.Mock).mockResolvedValue(false);
    (AccessibilityInfo.isBoldTextEnabled as jest.Mock).mockResolvedValue(false);
    (AccessibilityInfo.isGrayscaleEnabled as jest.Mock).mockResolvedValue(false);
    
    mockAddEventListener.mockReturnValue({ remove: jest.fn() });
  });

  it('should return initial accessibility configuration', async () => {
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
    
    expect(mockAddEventListener).toHaveBeenCalledWith(
      'screenReaderChanged',
      expect.any(Function)
    );
    expect(mockAddEventListener).toHaveBeenCalledWith(
      'reduceMotionChanged',
      expect.any(Function)
    );
    expect(mockAddEventListener).toHaveBeenCalledWith(
      'reduceTransparencyChanged',
      expect.any(Function)
    );
    expect(mockAddEventListener).toHaveBeenCalledWith(
      'invertColorsChanged',
      expect.any(Function)
    );
    expect(mockAddEventListener).toHaveBeenCalledWith(
      'boldTextChanged',
      expect.any(Function)
    );
    expect(mockAddEventListener).toHaveBeenCalledWith(
      'grayscaleChanged',
      expect.any(Function)
    );
  });

  it('should handle accessibility state changes', async () => {
    const { result } = renderHook(() => useAccessibility());
    
    // Get the callback functions from the event listeners
    const screenReaderCallback = mockAddEventListener.mock.calls.find(
      call => call[0] === 'screenReaderChanged'
    )?.[1] as (enabled: boolean) => void;
    
    const reduceMotionCallback = mockAddEventListener.mock.calls.find(
      call => call[0] === 'reduceMotionChanged'
    )?.[1] as (enabled: boolean) => void;
    
    expect(screenReaderCallback).toBeDefined();
    expect(reduceMotionCallback).toBeDefined();
    
    // Simulate accessibility state changes
    act(() => {
      screenReaderCallback?.(true);
      reduceMotionCallback?.(true);
    });
    
    expect(result.current.isScreenReaderEnabled).toBe(true);
    expect(result.current.isReduceMotionEnabled).toBe(true);
  });
}); 