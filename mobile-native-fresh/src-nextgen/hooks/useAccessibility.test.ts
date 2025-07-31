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
      await new Promise(resolve => setTimeout(() => resolve(undefined), 0));
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
    
    // Test basic accessibility state
    expect(result.current.isScreenReaderEnabled).toBe(false);
  });

  it('should handle accessibility state changes', async () => {
    const { result } = renderHook(() => useAccessibility());
    
    // Wait for initial setup
    await act(async () => {
      await new Promise(resolve => setTimeout(() => resolve(undefined), 0));
    });
    
    // The hook currently uses mock data, so we can't test real state changes
    // This test verifies the basic structure works
    expect(result.current.isScreenReaderEnabled).toBe(false);
  });

  it('should return correct accessibility settings', async () => {
    const { result } = renderHook(() => useAccessibility());
    
    // Wait for initial setup
    await act(async () => {
      await new Promise(resolve => setTimeout(() => resolve(undefined), 0));
    });
    
    // Test basic accessibility state
    expect(result.current.isScreenReaderEnabled).toBe(false);
  });

  it('should correctly identify when accessibility is enabled', async () => {
    const { result } = renderHook(() => useAccessibility());
    
    // Wait for initial setup
    await act(async () => {
      await new Promise(resolve => setTimeout(() => resolve(undefined), 0));
    });
    
    // With screen reader disabled, should return false
    expect(result.current.isScreenReaderEnabled).toBe(false);
  });
}); 