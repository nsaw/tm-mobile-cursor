import { useState } from 'react';

export type SlotMode = 'mock' | 'live';

export function useSlotMode(): [SlotMode, () => void] {
  const [mode, setMode] = useState<SlotMode>('mock');
  
  const toggleMode = () => {
    setMode(prev => prev === 'mock' ? 'live' : 'mock');
  };
  
  return [mode, toggleMode];
} 