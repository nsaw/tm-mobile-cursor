import { renderHook, act } from '@testing-library/react-native';

import { useTheme } from '../../src-nextgen/hooks/useTheme';
import { useBins } from '../../src-nextgen/hooks/useBins';
import { useThoughtmarks } from '../../src-nextgen/hooks/useThoughtmarks';


describe('Custom Hooks', () => {
  it('useTheme returns theme object', () => {
    const { result } = renderHook(() => useTheme());
    expect(result.current.theme).toBeDefined();
    console.log('[TEST] useTheme returns:', result.current);
  });

  it('useBins returns correct structure', () => {
    const { result } = renderHook(() => useBins());
    expect(result.current.bins).toBeInstanceOf(Array);
    console.log('[TEST] useBins bins:', result.current.bins);
  });

  it('useThoughtmarks handles toggling', () => {
    const { result } = renderHook(() => useThoughtmarks());
    act(() => result.current.toggleStar('abc'));
    expect(result.current.starred.includes('abc')).toBe(true);
    console.log('[TEST] useThoughtmarks toggled abc:', result.current.starred);
  });
}); 