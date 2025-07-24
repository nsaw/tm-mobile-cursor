// TopSlot.tsx
import React from 'react';
import { View, Text } from 'react-native';

import { SlotBridge } from '../slots/SlotBridge';
import { useTopSlotContent } from '../hooks/useSlotZone';

import { LayoutContext } from './LayoutShell';

// Enhanced TopSlot with context injection and bridge integration
export interface TopSlotProps {
  context?: LayoutContext & { enableContextBridge?: boolean };
  override?: React.ReactNode;
}

export const TopSlot: React.FC<TopSlotProps> = ({ 
  context = {},
  override
}) => {
  const content = useTopSlotContent();
  
  // Use override if provided, otherwise use context-aware content
  const slotContent = override || content;
  
  // Context-aware styling and behavior
  const contextStyle = {
    paddingTop: 12,
    backgroundColor: context.themeContext?.backgroundColor || 'transparent',
    borderBottomColor: context.themeContext?.borderColor || 'transparent',
    borderBottomWidth: context.currentRoute ? 1 : 0
  };

  // Bridge handoff handlers
  const handleBridgeReady = (zone: string, bridgeContext: any) => {
    // eslint-disable-next-line no-console
    console.log(`[TopSlot] Bridge ready for ${zone}:`, bridgeContext);
  };

  const handleContentInjected = (zone: string, injectedContent: React.ReactNode) => {
    // eslint-disable-next-line no-console
    console.log(`[TopSlot] Content injected into ${zone}:`, injectedContent);
  };
  
  if (!slotContent) {
    return (
      <View style={{ 
        height: 50, 
        justifyContent: 'center', 
        alignItems: 'center',
        backgroundColor: context.themeContext?.backgroundColor || 'lightgray',
        borderBottomColor: context.themeContext?.borderColor || 'transparent',
        borderBottomWidth: context.currentRoute ? 1 : 0
      }}>
        <SlotBridge 
          zone="top"
          context={context}
          onBridgeReady={handleBridgeReady}
          onContentInjected={handleContentInjected}
        >
          <Text>Top Slot Placeholder</Text>
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
      <SlotBridge 
        zone="top"
        context={context}
        onBridgeReady={handleBridgeReady}
        onContentInjected={handleContentInjected}
      >
        {slotContent}
      </SlotBridge>
      {context.enableContextBridge && context.currentRoute && (
        <View style={{ height: 1, backgroundColor: 'rgba(0,0,0,0.1)' }} />
      )}
    </View>
  );
}; 