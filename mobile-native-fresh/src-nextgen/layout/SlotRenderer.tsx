// SlotRenderer.tsx (updated)
import React from 'react';
import { View } from 'react-native';

import { TopSlot } from './TopSlot';
import { CenterSlot } from './CenterSlot';
import { BottomSlot } from './BottomSlot';
import { LayoutContext } from './LayoutShell';

// Enhanced slot renderer with context injection
export interface SlotRendererProps {
  context?: LayoutContext & { enableContextBridge?: boolean };
  slotOverrides?: {
    top?: React.ReactNode;
    center?: React.ReactNode;
    bottom?: React.ReactNode;
  };
}

export const SlotRenderer: React.FC<SlotRendererProps> = ({ 
  context = {},
  slotOverrides = {}
}) => {
  return (
    <View style={{ flex: 1 }}>
      <TopSlot 
        context={context}
        override={slotOverrides.top}
      />
      <CenterSlot 
        context={context}
        override={slotOverrides.center}
      />
      <BottomSlot 
        context={context}
        override={slotOverrides.bottom}
      />
    </View>
  );
}; 