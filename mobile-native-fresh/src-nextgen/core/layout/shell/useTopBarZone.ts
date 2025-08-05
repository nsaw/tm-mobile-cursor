import React, { useContext } from 'react';
import { ShellSlotContext } from '../ShellSlotContext';

export const useTopBarZone = (): React.ReactNode | undefined => {
  const ctx = useContext(ShellSlotContext);
  return ctx?.topbarSlot;
}; 