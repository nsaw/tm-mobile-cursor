// CenterSlot.tsx
import React from 'react';
import { View, Text } from 'react-native';

import { SlotBridge } from '../slots/SlotBridge';
import { useCenterSlotContent } from '../hooks/useSlotZone';

import { LayoutContext } from './LayoutShell';

// Enhanced CenterSlot with context injection and bridge integration
export interface CenterSlotProps {
  context?: LayoutContext & { enableContextBridge?: boolean };
  override?: React.ReactNode;
}

export const CenterSlot: React.FC<CenterSlotProps> = ({ 
  context = {},
  override
}) => {
  const content = useCenterSlotContent();
  
  // Use override if provided, otherwise use context-aware content
  const slotContent = override || content;
  
  // Context-aware styling and behavior
  const contextStyle = {
    flex: 1,
    backgroundColor: context.themeContext?.backgroundColor || 'transparent',
    paddingHorizontal: context.currentRoute ? 16 : 0
  };

  // Bridge handoff handlers
  const handleBridgeReady = (zone: string, bridgeContext: any) => {
    // eslint-disable-next-line no-console
    console.log(`[CenterSlot] Bridge ready for ${zone}:`, bridgeContext);
  };

  const handleContentInjected = (zone: string, injectedContent: React.ReactNode) => {
    // eslint-disable-next-line no-console
    console.log(`[CenterSlot] Content injected into ${zone}:`, injectedContent);
  };
  
  if (!slotContent) {
    return (
      <View style={{ 
        justifyContent: 'center', 
        alignItems: 'center',
        flex: 1,
        backgroundColor: context.themeContext?.backgroundColor || 'lightgray',
        paddingHorizontal: context.currentRoute ? 16 : 0
      }}>
        <SlotBridge 
          zone="center"
          context={context}
          onBridgeReady={handleBridgeReady}
          onContentInjected={handleContentInjected}
        >
          <Text>Center Slot Placeholder</Text>
          {context.currentRoute && (
            <Text style={{ fontSize: 10, color: 'gray', marginTop: 8 }}>
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
        zone="center"
        context={context}
        onBridgeReady={handleBridgeReady}
        onContentInjected={handleContentInjected}
      >
        {slotContent}
      </SlotBridge>
    </View>
  );
}; 