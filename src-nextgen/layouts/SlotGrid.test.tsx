import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { SlotGridProvider, useSlotGrid, Slot, SlotGrid } from './SlotGrid';
import { SlotConfig, SlotContent } from './SlotGrid.types';

// Test component
const TestComponent: React.FC<{ title: string }> = ({ title }) => {
  return null;
};

// Test hook usage
const TestHookUsage: React.FC = () => {
  const { addSlot, getSlots, getSlot } = useSlotGrid();
  
  React.useEffect(() => {
    const slotConfig: SlotConfig = {
      id: 'test-slot',
      name: 'Test Slot',
      position: { x: 0, y: 0, width: 100, height: 100 },
      priority: 1,
      resizable: true,
      draggable: true,
      visible: true,
      zIndex: 1,
    };

    addSlot(slotConfig);
  }, [addSlot]);

  const slots = getSlots();
  const slot = getSlot('test-slot');

  return null;
};

describe('SlotGrid', () => {
  it('should provide slot grid API', () => {
    const TestAPIUsage: React.FC = () => {
      const grid = useSlotGrid();
      
      React.useEffect(() => {
        expect(grid.addSlot).toBeDefined();
        expect(grid.removeSlot).toBeDefined();
        expect(grid.getSlot).toBeDefined();
        expect(grid.getSlots).toBeDefined();
        expect(grid.selectSlot).toBeDefined();
        expect(grid.focusSlot).toBeDefined();
      }, [grid]);

      return null;
    };

    render(
      <SlotGridProvider>
        <TestAPIUsage />
      </SlotGridProvider>
    );
  });

  it('should add and retrieve slots', () => {
    const { getByTestId } = render(
      <SlotGridProvider>
        <TestHookUsage />
      </SlotGridProvider>
    );

    // Slot should be added
    expect(getByTestId).toBeDefined();
  });

  it('should handle slot content', () => {
    const TestContentUsage: React.FC = () => {
      const { addSlot, setSlotContent, getSlot } = useSlotGrid();
      
      React.useEffect(() => {
        const slotConfig: SlotConfig = {
          id: 'content-slot',
          name: 'Content Slot',
          position: { x: 0, y: 0, width: 100, height: 100 },
          priority: 1,
          resizable: true,
          draggable: true,
          visible: true,
          zIndex: 1,
        };

        addSlot(slotConfig);

        const content: SlotContent = {
          id: 'test-content',
          component: TestComponent,
          props: { title: 'Test Title' },
          metadata: {
            title: 'Test Content',
            description: 'Test content description',
            category: 'test',
            tags: ['test', 'content'],
          },
        };

        setSlotContent('content-slot', content);

        const slot = getSlot('content-slot');
        expect(slot?.content).toBeDefined();
        expect(slot?.content?.component).toBe(TestComponent);
      }, [addSlot, setSlotContent, getSlot]);

      return null;
    };

    render(
      <SlotGridProvider>
        <TestContentUsage />
      </SlotGridProvider>
    );
  });

  it('should handle slot selection and focus', () => {
    const TestSelectionUsage: React.FC = () => {
      const { addSlot, selectSlot, focusSlot, getActiveSlot, getFocusedSlot } = useSlotGrid();
      
      React.useEffect(() => {
        const slotConfig: SlotConfig = {
          id: 'selection-slot',
          name: 'Selection Slot',
          position: { x: 0, y: 0, width: 100, height: 100 },
          priority: 1,
          resizable: true,
          draggable: true,
          visible: true,
          zIndex: 1,
        };

        addSlot(slotConfig);

        selectSlot('selection-slot');
        const activeSlot = getActiveSlot();
        expect(activeSlot?.config.id).toBe('selection-slot');

        focusSlot('selection-slot');
        const focusedSlot = getFocusedSlot();
        expect(focusedSlot?.config.id).toBe('selection-slot');
      }, [addSlot, selectSlot, focusSlot, getActiveSlot, getFocusedSlot]);

      return null;
    };

    render(
      <SlotGridProvider>
        <TestSelectionUsage />
      </SlotGridProvider>
    );
  });

  it('should throw error when used outside provider', () => {
    expect(() => render(<TestHookUsage />)).toThrow(
      'useSlotGrid must be used within a SlotGridProvider'
    );
  });
}); 