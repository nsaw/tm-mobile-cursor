export interface LayoutConfig {
  id: string;
  name: string;
  type: 'grid' | 'flex' | 'absolute' | 'relative';
  columns?: number;
  rows?: number;
  gap?: number;
  padding?: number;
  margin?: number;
  width?: number | string;
  height?: number | string;
  minWidth?: number;
  minHeight?: number;
  maxWidth?: number;
  maxHeight?: number;
  responsive: boolean;
  breakpoints?: Record<string, any>;
}

export interface LayoutSlot {
  id: string;
  name: string;
  position: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  priority: number;
  resizable: boolean;
  draggable: boolean;
  visible: boolean;
  zIndex: number;
}

export interface LayoutState {
  config: LayoutConfig;
  slots: Map<string, LayoutSlot>;
  activeSlot: string | null;
  focusedSlot: string | null;
  isEditing: boolean;
  isDragging: boolean;
}

export interface LayoutManager {
  addSlot: (slot: LayoutSlot) => void;
  removeSlot: (slotId: string) => void;
  updateSlot: (slotId: string, updates: Partial<LayoutSlot>) => void;
  getSlot: (slotId: string) => LayoutSlot | null;
  getSlots: () => LayoutSlot[];
  selectSlot: (slotId: string) => void;
  focusSlot: (slotId: string) => void;
  resizeSlot: (slotId: string, position: LayoutSlot['position']) => void;
  moveSlot: (slotId: string, position: LayoutSlot['position']) => void;
  setLayoutConfig: (config: Partial<LayoutConfig>) => void;
  resetLayout: () => void;
  exportLayout: () => LayoutState;
  importLayout: (state: LayoutState) => void;
}

export interface LayoutHook {
  layoutState: LayoutState;
  layoutManager: LayoutManager;
}

export interface LayoutValidator {
  validate: (config: LayoutConfig) => boolean;
  errors: string[];
  warnings: string[];
}

export interface LayoutRenderer {
  render: (state: LayoutState) => any;
  shouldUpdate: (prevState: LayoutState, nextState: LayoutState) => boolean;
} 