// LayoutShell.tsx
import React from 'react';
import { View } from 'react-native';

import { SlotRenderer } from './SlotRenderer';

// Context-aware slot interface
export interface LayoutContext {
  navigationState?: any;
  currentRoute?: string;
  themeContext?: any;
  userContext?: any;
  appState?: any;
}

// Enhanced prop types for context injection
export interface LayoutShellProps {
  context?: LayoutContext;
  enableContextBridge?: boolean;
  slotOverrides?: {
    top?: React.ReactNode;
    center?: React.ReactNode;
    bottom?: React.ReactNode;
  };
}

export const LayoutShell: React.FC<LayoutShellProps> = ({ 
  context = {},
  enableContextBridge = true,
  slotOverrides = {}
}) => {
  // Context bridge for slot injection
  const slotContext = {
    navigationState: context.navigationState,
    currentRoute: context.currentRoute,
    themeContext: context.themeContext,
    userContext: context.userContext,
    appState: context.appState,
    enableContextBridge
  };

  return (
    <View style={{ flex: 1 }}>
      <SlotRenderer 
        context={slotContext}
        slotOverrides={slotOverrides}
      />
    </View>
  );
}; 