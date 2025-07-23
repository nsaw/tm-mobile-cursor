// src-nextgen/hooks/index.ts
// Export nextgen hooks

export { 
  default as useSlotZone, 
  SlotZoneProvider, 
  useTopSlotContent, 
  useCenterSlotContent, 
  useBottomSlotContent,
  useSlotNavigation
} from './useSlotZone';

export {
  useLayoutContext,
  useSlotInjection,
  useCurrentLayoutContext,
  type EnhancedLayoutContext
} from './useLayoutContext';

export {
  useStructureValidation,
  StructureValidator,
  type StructureValidationResult,
  type SlotCollision,
  type LayoutBounds,
  type HydrationStatus
} from './useStructureValidation';

// Export SlotBridge from slots directory
export { SlotBridge } from '../slots/SlotBridge'; 