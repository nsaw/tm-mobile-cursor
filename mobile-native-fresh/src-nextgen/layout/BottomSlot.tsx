// BottomSlot.tsx
import React from 'react';
import { View, Text } from 'react-native';

import { SlotBridge } from '../slots/SlotBridge';
import { useBottomSlotContent } from '../hooks/useSlotZone';

import { LayoutContext } from './LayoutShell';

// Enhanced BottomSlot with context injection and bridge integration
export interface BottomSlotProps {
  context?: LayoutContext & { enableContextBridge?: boolean };
  override?: React.ReactNode;
}

export const BottomSlot: React.FC<BottomSlotProps> = ({ 
  context = {},
  override
}) => {
  const content = useBottomSlotContent();
  
  // Use override if provided, otherwise use context-aware content
  const slotContent = override || content;
  
  // Context-aware styling and behavior
  const contextStyle = {
    paddingBottom: 12,
    backgroundColor: context.themeContext?.backgroundColor || 'transparent',
    borderTopColor: context.themeContext?.borderColor || 'transparent',
    borderTopWidth: context.currentRoute ? 1 : 0
  };

  // Bridge handoff handlers
  const handleBridgeReady = (zone: string, bridgeContext: any) => {
    // eslint-disable-next-line no-console
    console.log(`[BottomSlot] Bridge ready for ${zone}:`, bridgeContext);
  };

  const handleContentInjected = (zone: string, injectedContent: React.ReactNode) => {
    // eslint-disable-next-line no-console
    console.log(`[BottomSlot] Content injected into ${zone}:`, injectedContent);
  };
  
  if (!slotContent) {
    return (
      <View style={{ 
        height: 50, 
        justifyContent: 'center', 
        alignItems: 'center',
        backgroundColor: context.themeContext?.backgroundColor || 'lightgray',
        borderTopColor: context.themeContext?.borderColor || 'transparent',
        borderTopWidth: context.currentRoute ? 1 : 0
      }}>
        <SlotBridge 
          zone="bottom"
          context={context}
          onBridgeReady={handleBridgeReady}
          onContentInjected={handleContentInjected}
        >
          <Text>Bottom Slot Placeholder</Text>
          {context.currentRoute && (
            <Text style={{ fontSize: 10, color: 'gray' }}>
              Route: {context.currentRoute}
            </Text>
          )}
        </SlotBridge>
      </View>
    );
  }
  
  return (
    <View style={contextStyle}>
      {context.enableContextBridge && context.currentRoute && (
        <View style={{ height: 1, backgroundColor: 'rgba(0,0,0,0.1)' }} />
      )}
      <SlotBridge 
        zone="bottom"
        context={context}
        onBridgeReady={handleBridgeReady}
        onContentInjected={handleContentInjected}
      >
        {slotContent}
      </SlotBridge>
    </View>
  );
}; 