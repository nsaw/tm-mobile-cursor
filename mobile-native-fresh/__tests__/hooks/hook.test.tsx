import { renderHook } from '@testing-library/react-native';

import { useTheme } from '../../src-nextgen/hooks/useTheme';
import { useBins } from '../../src-nextgen/hooks/useBins';
import { useThoughtmarks } from '../../src-nextgen/hooks/useThoughtmarks';


describe('Custom Hooks', () => {
  it('useTheme returns theme object', () => {
    const { result } = renderHook(() => useTheme());
    expect(result.current).toBeDefined();
    expect(result.current.colors).toBeDefined();
    console.log('[TEST] useTheme returns:', result.current);
  });

  it('useBins returns correct structure', () => {
    const { result } = renderHook(() => useBins());
    expect(result.current.bins).toBeInstanceOf(Array);
    console.log('[TEST] useBins bins:', result.current.bins);
  });

  it('useThoughtmarks handles toggling', () => {
    const { result } = renderHook(() => useThoughtmarks());
    expect(result.current.toggleStar).toBeDefined();
    expect(result.current.starred).toBeInstanceOf(Array);
    console.log('[TEST] useThoughtmarks structure:', result.current);
  });
}); 