import React from 'react';

export interface SlotPosition {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface SlotConfig {
  id: string;
  name: string;
  position: SlotPosition;
  priority: number;
  minWidth?: number;
  minHeight?: number;
  maxWidth?: number;
  maxHeight?: number;
  aspectRatio?: number;
  resizable: boolean;
  draggable: boolean;
  visible: boolean;
  zIndex: number;
}

export interface SlotContent {
  id: string;
  component: React.ComponentType<any>;
  props: Record<string, any>;
  metadata: {
    title: string;
    description: string;
    category: string;
    tags: string[];
  };
}

export interface SlotState {
  config: SlotConfig;
  content: SlotContent | null;
  isActive: boolean;
  isFocused: boolean;
  isResizing: boolean;
  isDragging: boolean;
}

export interface GridConfig {
  id: string;
  name: string;
  columns: number;
  rows: number;
  cellWidth: number;
  cellHeight: number;
  gap: number;
  padding: number;
  responsive: boolean;
  autoLayout: boolean;
  snapToGrid: boolean;
}

export interface GridState {
  config: GridConfig;
  slots: Map<string, SlotState>;
  activeSlot: string | null;
  focusedSlot: string | null;
  isEditing: boolean;
  isDragging: boolean;
}

export interface SlotGridProps {
  config: GridConfig;
  children?: React.ReactNode;
  onSlotChange?: (slotId: string, state: SlotState) => void;
  onSlotSelect?: (slotId: string) => void;
  onSlotResize?: (slotId: string, position: SlotPosition) => void;
  onSlotMove?: (slotId: string, position: SlotPosition) => void;
  onGridChange?: (state: GridState) => void;
  style?: any;
  testID?: string;
}

export interface SlotGridContextType {
  gridState: GridState;
  addSlot: (config: SlotConfig) => void;
  removeSlot: (slotId: string) => void;
  updateSlot: (slotId: string, updates: Partial<SlotConfig>) => void;
  setSlotContent: (slotId: string, content: SlotContent) => void;
  clearSlotContent: (slotId: string) => void;
  selectSlot: (slotId: string) => void;
  focusSlot: (slotId: string) => void;
  resizeSlot: (slotId: string, position: SlotPosition) => void;
  moveSlot: (slotId: string, position: SlotPosition) => void;
  getSlot: (slotId: string) => SlotState | null;
  getSlots: () => SlotState[];
  getActiveSlot: () => SlotState | null;
  getFocusedSlot: () => SlotState | null;
  setGridConfig: (config: Partial<GridConfig>) => void;
  resetGrid: () => void;
  exportGrid: () => GridState;
  importGrid: (state: GridState) => void;
}

export interface SlotProps {
  id: string;
  children?: React.ReactNode;
  style?: any;
  onPress?: () => void;
  onLongPress?: () => void;
  onLayout?: (event: any) => void;
  testID?: string;
}

export interface SlotGridHook {
  gridState: GridState;
  addSlot: (config: SlotConfig) => void;
  removeSlot: (slotId: string) => void;
  updateSlot: (slotId: string, updates: Partial<SlotConfig>) => void;
  setSlotContent: (slotId: string, content: SlotContent) => void;
  clearSlotContent: (slotId: string) => void;
  selectSlot: (slotId: string) => void;
  focusSlot: (slotId: string) => void;
  resizeSlot: (slotId: string, position: SlotPosition) => void;
  moveSlot: (slotId: string, position: SlotPosition) => void;
  getSlot: (slotId: string) => SlotState | null;
  getSlots: () => SlotState[];
  getActiveSlot: () => SlotState | null;
  getFocusedSlot: () => SlotState | null;
  setGridConfig: (config: Partial<GridConfig>) => void;
  resetGrid: () => void;
  exportGrid: () => GridState;
  importGrid: (state: GridState) => void;
} 