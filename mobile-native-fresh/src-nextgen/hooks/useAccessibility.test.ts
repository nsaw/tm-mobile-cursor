import { renderHook, act } from '@testing-library/react-native';

import { useAccessibility } from './useAccessibility';

describe('useAccessibility', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return initial accessibility configuration', async () => {
    const { result } = renderHook(() => useAccessibility());
    
    // Wait for async operations to complete
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });
    
    expect(result.current).toMatchObject({
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
  });

  it('should provide accessibility utility functions', async () => {
    const { result } = renderHook(() => useAccessibility());
    
    // Wait for initial setup
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });
    
    expect(typeof result.current.getAccessibilitySettings).toBe('function');
    expect(typeof result.current.isAccessibilityEnabled).toBe('function');
    expect(typeof result.current.getAccessibilityAnnouncement).toBe('function');
    
    // Test utility functions
    const settings = result.current.getAccessibilitySettings();
    expect(settings).toEqual({
      highContrast: false,
      reduceMotion: false,
      screenReader: false,
      boldText: false,
      grayscale: false,
      invertColors: false,
      reduceTransparency: false,
    });
    
    expect(result.current.isAccessibilityEnabled()).toBe(false);
    
    // Test announcement function - should not call console.log when screen reader is disabled
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    result.current.getAccessibilityAnnouncement('Test announcement');
    expect(consoleSpy).not.toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  it('should handle accessibility state changes', async () => {
    const { result } = renderHook(() => useAccessibility());
    
    // Wait for initial setup
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });
    
    // The hook currently uses mock data, so we can't test real state changes
    // This test verifies the basic structure works
    expect(result.current.isScreenReaderEnabled).toBe(false);
    expect(result.current.isReduceMotionEnabled).toBe(false);
  });

  it('should return correct accessibility settings', async () => {
    const { result } = renderHook(() => useAccessibility());
    
    // Wait for initial setup
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });
    
    const settings = result.current.getAccessibilitySettings();
    expect(settings).toEqual({
      highContrast: false,
      reduceMotion: false,
      screenReader: false,
      boldText: false,
      grayscale: false,
      invertColors: false,
      reduceTransparency: false,
    });
  });

  it('should correctly identify when accessibility is enabled', async () => {
    const { result } = renderHook(() => useAccessibility());
    
    // Wait for initial setup
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });
    
    // With all accessibility features disabled, should return false
    expect(result.current.isAccessibilityEnabled()).toBe(false);
  });
}); 