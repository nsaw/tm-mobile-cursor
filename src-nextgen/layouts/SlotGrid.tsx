import React, { createContext, useContext, useReducer, useCallback, useMemo, ReactNode } from 'react';
import { View, StyleSheet } from 'react-native';
import { SlotGridContextType, GridState, SlotState, SlotConfig, SlotContent, SlotPosition, GridConfig, SlotProps, SlotGridProps } from './SlotGrid.types';

declare const console: any;

// Action types
type SlotGridAction =
  | { type: 'ADD_SLOT'; payload: { config: SlotConfig } }
  | { type: 'REMOVE_SLOT'; payload: { slotId: string } }
  | { type: 'UPDATE_SLOT'; payload: { slotId: string; updates: Partial<SlotConfig> } }
  | { type: 'SET_SLOT_CONTENT'; payload: { slotId: string; content: SlotContent } }
  | { type: 'CLEAR_SLOT_CONTENT'; payload: { slotId: string } }
  | { type: 'SELECT_SLOT'; payload: { slotId: string } }
  | { type: 'FOCUS_SLOT'; payload: { slotId: string } }
  | { type: 'RESIZE_SLOT'; payload: { slotId: string; position: SlotPosition } }
  | { type: 'MOVE_SLOT'; payload: { slotId: string; position: SlotPosition } }
  | { type: 'SET_GRID_CONFIG'; payload: { config: Partial<GridConfig> } }
  | { type: 'RESET_GRID' }
  | { type: 'IMPORT_GRID'; payload: { state: GridState } };

// Initial grid config
const defaultGridConfig: GridConfig = {
  id: 'default-grid',
  name: 'Default Grid',
  columns: 12,
  rows: 8,
  cellWidth: 60,
  cellHeight: 60,
  gap: 8,
  padding: 16,
  responsive: true,
  autoLayout: true,
  snapToGrid: true,
};

// Initial state
const initialState: GridState = {
  config: defaultGridConfig,
  slots: new Map(),
  activeSlot: null,
  focusedSlot: null,
  isEditing: false,
  isDragging: false,
};

// Reducer
function slotGridReducer(state: GridState, action: SlotGridAction): GridState {
  switch (action.type) {
    case 'ADD_SLOT': {
      const { config } = action.payload;
      const newSlots = new Map(state.slots);
      
      const slotState: SlotState = {
        config,
        content: null,
        isActive: false,
        isFocused: false,
        isResizing: false,
        isDragging: false,
      };
      
      newSlots.set(config.id, slotState);

      if (console && console.log) {
        console.log(`[SlotGrid] Added slot: ${config.id}`);
      }

      return {
        ...state,
        slots: newSlots,
      };
    }

    case 'REMOVE_SLOT': {
      const { slotId } = action.payload;
      const newSlots = new Map(state.slots);
      const removed = newSlots.delete(slotId);

      if (removed) {
        // Clear active/focused slot if it was removed
        let newActiveSlot = state.activeSlot;
        let newFocusedSlot = state.focusedSlot;
        
        if (newActiveSlot === slotId) {
          newActiveSlot = null;
        }
        if (newFocusedSlot === slotId) {
          newFocusedSlot = null;
        }

        if (console && console.log) {
          console.log(`[SlotGrid] Removed slot: ${slotId}`);
        }

        return {
          ...state,
          slots: newSlots,
          activeSlot: newActiveSlot,
          focusedSlot: newFocusedSlot,
        };
      }

      return state;
    }

    case 'UPDATE_SLOT': {
      const { slotId, updates } = action.payload;
      const slot = state.slots.get(slotId);
      
      if (slot) {
        const newSlots = new Map(state.slots);
        newSlots.set(slotId, {
          ...slot,
          config: { ...slot.config, ...updates },
        });

        if (console && console.log) {
          console.log(`[SlotGrid] Updated slot: ${slotId}`, updates);
        }

        return {
          ...state,
          slots: newSlots,
        };
      }

      return state;
    }

    case 'SET_SLOT_CONTENT': {
      const { slotId, content } = action.payload;
      const slot = state.slots.get(slotId);
      
      if (slot) {
        const newSlots = new Map(state.slots);
        newSlots.set(slotId, {
          ...slot,
          content,
        });

        if (console && console.log) {
          console.log(`[SlotGrid] Set content for slot: ${slotId}`);
        }

        return {
          ...state,
          slots: newSlots,
        };
      }

      return state;
    }

    case 'CLEAR_SLOT_CONTENT': {
      const { slotId } = action.payload;
      const slot = state.slots.get(slotId);
      
      if (slot) {
        const newSlots = new Map(state.slots);
        newSlots.set(slotId, {
          ...slot,
          content: null,
        });

        if (console && console.log) {
          console.log(`[SlotGrid] Cleared content for slot: ${slotId}`);
        }

        return {
          ...state,
          slots: newSlots,
        };
      }

      return state;
    }

    case 'SELECT_SLOT': {
      const { slotId } = action.payload;
      
      if (console && console.log) {
        console.log(`[SlotGrid] Selected slot: ${slotId}`);
      }

      return {
        ...state,
        activeSlot: slotId,
      };
    }

    case 'FOCUS_SLOT': {
      const { slotId } = action.payload;
      
      if (console && console.log) {
        console.log(`[SlotGrid] Focused slot: ${slotId}`);
      }

      return {
        ...state,
        focusedSlot: slotId,
      };
    }

    case 'RESIZE_SLOT': {
      const { slotId, position } = action.payload;
      const slot = state.slots.get(slotId);
      
      if (slot) {
        const newSlots = new Map(state.slots);
        newSlots.set(slotId, {
          ...slot,
          config: { ...slot.config, position },
        });

        if (console && console.log) {
          console.log(`[SlotGrid] Resized slot: ${slotId}`, position);
        }

        return {
          ...state,
          slots: newSlots,
        };
      }

      return state;
    }

    case 'MOVE_SLOT': {
      const { slotId, position } = action.payload;
      const slot = state.slots.get(slotId);
      
      if (slot) {
        const newSlots = new Map(state.slots);
        newSlots.set(slotId, {
          ...slot,
          config: { ...slot.config, position },
        });

        if (console && console.log) {
          console.log(`[SlotGrid] Moved slot: ${slotId}`, position);
        }

        return {
          ...state,
          slots: newSlots,
        };
      }

      return state;
    }

    case 'SET_GRID_CONFIG': {
      const { config } = action.payload;
      
      if (console && console.log) {
        console.log('[SlotGrid] Updated grid config', config);
      }

      return {
        ...state,
        config: { ...state.config, ...config },
      };
    }

    case 'RESET_GRID': {
      if (console && console.log) {
        console.log('[SlotGrid] Reset grid');
      }

      return initialState;
    }

    case 'IMPORT_GRID': {
      const { state: importedState } = action.payload;
      
      if (console && console.log) {
        console.log('[SlotGrid] Imported grid state');
      }

      return importedState;
    }

    default:
      return state;
  }
}

// Context
const SlotGridContext = createContext<SlotGridContextType | null>(null);

// Hook
export function useSlotGrid(): SlotGridContextType {
  const context = useContext(SlotGridContext);
  if (!context) {
    throw new Error('useSlotGrid must be used within a SlotGridProvider');
  }
  return context;
}

// Provider component
interface SlotGridProviderProps {
  children: ReactNode;
  initialConfig?: Partial<GridConfig>;
  onGridChange?: (state: GridState) => void;
}

export function SlotGridProvider({ children, initialConfig = {}, onGridChange }: SlotGridProviderProps) {
  const [state, dispatch] = useReducer(slotGridReducer, {
    ...initialState,
    config: { ...initialState.config, ...initialConfig },
  });

  // Notify parent of grid changes
  React.useEffect(() => {
    if (onGridChange) {
      onGridChange(state);
    }
  }, [state, onGridChange]);

  const addSlot = useCallback((config: SlotConfig) => {
    dispatch({ type: 'ADD_SLOT', payload: { config } });
  }, []);

  const removeSlot = useCallback((slotId: string) => {
    dispatch({ type: 'REMOVE_SLOT', payload: { slotId } });
  }, []);

  const updateSlot = useCallback((slotId: string, updates: Partial<SlotConfig>) => {
    dispatch({ type: 'UPDATE_SLOT', payload: { slotId, updates } });
  }, []);

  const setSlotContent = useCallback((slotId: string, content: SlotContent) => {
    dispatch({ type: 'SET_SLOT_CONTENT', payload: { slotId, content } });
  }, []);

  const clearSlotContent = useCallback((slotId: string) => {
    dispatch({ type: 'CLEAR_SLOT_CONTENT', payload: { slotId } });
  }, []);

  const selectSlot = useCallback((slotId: string) => {
    dispatch({ type: 'SELECT_SLOT', payload: { slotId } });
  }, []);

  const focusSlot = useCallback((slotId: string) => {
    dispatch({ type: 'FOCUS_SLOT', payload: { slotId } });
  }, []);

  const resizeSlot = useCallback((slotId: string, position: SlotPosition) => {
    dispatch({ type: 'RESIZE_SLOT', payload: { slotId, position } });
  }, []);

  const moveSlot = useCallback((slotId: string, position: SlotPosition) => {
    dispatch({ type: 'MOVE_SLOT', payload: { slotId, position } });
  }, []);

  const getSlot = useCallback((slotId: string): SlotState | null => {
    return state.slots.get(slotId) || null;
  }, [state.slots]);

  const getSlots = useCallback((): SlotState[] => {
    return Array.from(state.slots.values());
  }, [state.slots]);

  const getActiveSlot = useCallback((): SlotState | null => {
    return state.activeSlot ? state.slots.get(state.activeSlot) || null : null;
  }, [state.slots, state.activeSlot]);

  const getFocusedSlot = useCallback((): SlotState | null => {
    return state.focusedSlot ? state.slots.get(state.focusedSlot) || null : null;
  }, [state.slots, state.focusedSlot]);

  const setGridConfig = useCallback((config: Partial<GridConfig>) => {
    dispatch({ type: 'SET_GRID_CONFIG', payload: { config } });
  }, []);

  const resetGrid = useCallback(() => {
    dispatch({ type: 'RESET_GRID' });
  }, []);

  const exportGrid = useCallback((): GridState => {
    return state;
  }, [state]);

  const importGrid = useCallback((importedState: GridState) => {
    dispatch({ type: 'IMPORT_GRID', payload: { state: importedState } });
  }, []);

  const contextValue: SlotGridContextType = useMemo(() => ({
    gridState: state,
    addSlot,
    removeSlot,
    updateSlot,
    setSlotContent,
    clearSlotContent,
    selectSlot,
    focusSlot,
    resizeSlot,
    moveSlot,
    getSlot,
    getSlots,
    getActiveSlot,
    getFocusedSlot,
    setGridConfig,
    resetGrid,
    exportGrid,
    importGrid,
  }), [
    state,
    addSlot,
    removeSlot,
    updateSlot,
    setSlotContent,
    clearSlotContent,
    selectSlot,
    focusSlot,
    resizeSlot,
    moveSlot,
    getSlot,
    getSlots,
    getActiveSlot,
    getFocusedSlot,
    setGridConfig,
    resetGrid,
    exportGrid,
    importGrid,
  ]);

  return (
    <SlotGridContext.Provider value={contextValue}>
      {children}
    </SlotGridContext.Provider>
  );
}

// Slot component
export const Slot: React.FC<SlotProps> = ({ id, children, style, onPress, onLongPress, onLayout, testID }) => {
  const { getSlot, selectSlot, focusSlot } = useSlotGrid();
  const slot = getSlot(id);

  if (!slot) {
    return null;
  }

  const { config, content, isActive, isFocused } = slot;
  const { position, visible } = config;

  if (!visible) {
    return null;
  }

  const slotStyle = [
    styles.slot,
    {
      left: position.x,
      top: position.y,
      width: position.width,
      height: position.height,
      zIndex: config.zIndex,
    },
    isActive && styles.activeSlot,
    isFocused && styles.focusedSlot,
    style,
  ];

  const handlePress = () => {
    selectSlot(id);
    onPress?.();
  };

  const handleLongPress = () => {
    focusSlot(id);
    onLongPress?.();
  };

  return (
    <View
      style={slotStyle}
      onTouchEnd={handlePress}
      onTouchEndCapture={handleLongPress}
      onLayout={onLayout}
      testID={testID}
    >
      {content ? React.createElement(content.component, content.props) : children}
    </View>
  );
};

// Main SlotGrid component
export const SlotGrid: React.FC<SlotGridProps> = ({
  config,
  children,
  onSlotChange,
  onSlotSelect,
  onSlotResize,
  onSlotMove,
  onGridChange,
  style,
  testID,
}) => {
  const { gridState, getSlots } = useSlotGrid();
  const slots = getSlots();

  const gridStyle = [
    styles.grid,
    {
      padding: config.padding,
      gap: config.gap,
    },
    style,
  ];

  return (
    <View style={gridStyle} testID={testID}>
      {slots.map((slot) => (
        <Slot
          key={slot.config.id}
          id={slot.config.id}
          onPress={() => onSlotSelect?.(slot.config.id)}
          onLongPress={() => onSlotChange?.(slot.config.id, slot)}
        />
      ))}
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  grid: {
    position: 'relative',
    width: '100%',
    height: '100%',
  },
  slot: {
    position: 'absolute',
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 4,
  },
  activeSlot: {
    borderColor: '#007AFF',
    borderWidth: 2,
  },
  focusedSlot: {
    borderColor: '#FF9500',
    borderWidth: 2,
  },
});

export default SlotGridProvider; 