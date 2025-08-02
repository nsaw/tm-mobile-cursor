import { renderHook } from '@testing-library/react-native';
import { useAccessibilityProps } from './useAccessibilityProps';
import { useAccessibility } from './useAccessibility';

// Mock useAccessibility
jest.mock('./useAccessibility', () => ({
  useAccessibility: jest.fn(),
}));

const mockUseAccessibility = useAccessibility as jest.MockedFunction<typeof useAccessibility>;

describe('useAccessibilityProps', () => {
  beforeEach(() => {
    mockUseAccessibility.mockReturnValue({
      isScreenReaderEnabled: true,
      isHighContrastEnabled: false,
      isReduceMotionEnabled: false,
      isReduceTransparencyEnabled: false,
      isInvertColorsEnabled: false,
      isBoldTextEnabled: false,
      isGrayscaleEnabled: false,
      isLargeTextEnabled: false,
    });
  });

  it('should generate basic accessibility props', () => {
    const { result } = renderHook(() =>
      useAccessibilityProps({
        role: 'button',
        label: 'Test Button',
        hint: 'Press to test',
      })
    );
    
    expect(result.current).toEqual({
      accessible: true,
      accessibilityRole: 'button',
      accessibilityLabel: 'Test Button',
      accessibilityHint: 'Press to test',
      importantForAccessibility: 'auto',
    });
  });

  it('should include accessibility state', () => {
    const { result } = renderHook(() =>
      useAccessibilityProps({
        role: 'checkbox',
        label: 'Test Checkbox',
        state: { checked: true },
      })
    );
    
    expect(result.current.accessibilityState).toEqual({ checked: true });
  });

  it('should include accessibility value', () => {
    const { result } = renderHook(() =>
      useAccessibilityProps({
        role: 'adjustable',
        label: 'Test Slider',
        value: { min: 0, max: 100, now: 50 },
      })
    );
    
    expect(result.current.accessibilityValue).toEqual({
      min: 0,
      max: 100,
      now: 50,
    });
  });

  it('should include accessibility actions', () => {
    const onAction = jest.fn();
    const { result } = renderHook(() =>
      useAccessibilityProps({
        role: 'button',
        label: 'Test Button',
        actions: [{ name: 'activate', label: 'Activate' }],
        onAction,
      })
    );
    
    expect(result.current.accessibilityActions).toEqual([
      { name: 'activate', label: 'Activate' },
    ]);
    expect(result.current.onAccessibilityAction).toBeDefined();
  });

  it('should disable accessibility when screen reader is disabled', () => {
    mockUseAccessibility.mockReturnValue({
      isScreenReaderEnabled: false,
      isHighContrastEnabled: false,
      isReduceMotionEnabled: false,
      isReduceTransparencyEnabled: false,
      isInvertColorsEnabled: false,
      isBoldTextEnabled: false,
      isGrayscaleEnabled: false,
      isLargeTextEnabled: false,
    });
    
    const { result } = renderHook(() =>
      useAccessibilityProps({
        role: 'button',
        label: 'Test Button',
      })
    );
    
    expect(result.current.accessible).toBe(false);
  });

  it('should force accessibility when importantForAccessibility is yes', () => {
    mockUseAccessibility.mockReturnValue({
      isScreenReaderEnabled: false,
      isHighContrastEnabled: false,
      isReduceMotionEnabled: false,
      isReduceTransparencyEnabled: false,
      isInvertColorsEnabled: false,
      isBoldTextEnabled: false,
      isGrayscaleEnabled: false,
      isLargeTextEnabled: false,
    });
    
    const { result } = renderHook(() =>
      useAccessibilityProps({
        role: 'button',
        label: 'Test Button',
        importantForAccessibility: 'yes',
      })
    );
    
    expect(result.current.accessible).toBe(true);
  });
}); 