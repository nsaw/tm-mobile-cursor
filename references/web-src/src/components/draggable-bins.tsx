import { useState } from "react";
import { 
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from "lucide-react";
import { BinCard } from "@/components/bin-card";
import type { BinWithCount } from "@shared/schema";

interface SortableBinItemProps {
  bin: BinWithCount;
  onClick: () => void;
}

function SortableBinItem({ bin, onClick }: SortableBinItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: bin.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative group ${isDragging ? 'dragging z-50' : ''}`}
    >
      {/* Drag Handle */}
      <div
        {...attributes}
        {...listeners}
        className="absolute left-2 top-1/2 -translate-y-1/2 z-10 drag-handle opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        aria-label={`Drag to reorder ${bin.name} bin`}
        role="button"
        tabIndex={0}
      >
        <GripVertical className="w-4 h-4 text-gray-400 hover:text-gray-300" />
      </div>
      
      {/* Bin Card with padding for drag handle */}
      <div className="pl-8">
        <BinCard
          bin={bin}
          onClick={onClick}
          compact={true}
        />
      </div>
    </div>
  );
}

interface DraggableBinsProps {
  bins: BinWithCount[];
  onBinClick: (bin: BinWithCount) => void;
  onBinsReorder: (newOrder: BinWithCount[]) => void;
}

export function DraggableBins({ bins, onBinClick, onBinsReorder }: DraggableBinsProps) {
  const [items, setItems] = useState(bins);
  
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        delay: 100,
        tolerance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex(item => item.id === active.id);
      const newIndex = items.findIndex(item => item.id === over.id);
      
      const newOrder = arrayMove(items, oldIndex, newIndex);
      setItems(newOrder);
      onBinsReorder(newOrder);
    }
  }

  // Update items when bins prop changes
  if (bins.length !== items.length || bins.some((bin, index) => bin.id !== items[index]?.id)) {
    setItems(bins);
  }

  return (
    <DndContext 
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext 
        items={items.map(bin => bin.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-3">
          {items.map((bin) => (
            <SortableBinItem
              key={bin.id}
              bin={bin}
              onClick={() => onBinClick(bin)}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}