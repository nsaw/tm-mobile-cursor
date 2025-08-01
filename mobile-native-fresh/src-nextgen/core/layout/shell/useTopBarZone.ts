import { useContext } from 'react';
import { ShellSlotContext } from '../ShellSlotContext';

export const useTopBarZone = () => {
  const ctx = useContext(ShellSlotContext);
  return ctx?.topbarSlot;
}; 