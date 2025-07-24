// useLayoutContext.tsx - Context bridge for layout shell components
import React, { useEffect, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';

import { LayoutContext } from '../layout/LayoutShell';

// Enhanced layout context with navigation and theme integration
export interface EnhancedLayoutContext extends LayoutContext {
  enableContextBridge: boolean;
  slotInjection?: {
    top?: React.ReactNode;
    center?: React.ReactNode;
    bottom?: React.ReactNode;
  };
}

// Hook to create context-aware layout props
export const useLayoutContext = (options?: {
  enableContextBridge?: boolean;
  slotOverrides?: {
    top?: React.ReactNode;
    center?: React.ReactNode;
    bottom?: React.ReactNode;
  };
  themeContext?: any;
  userContext?: any;
  appState?: any;
}): EnhancedLayoutContext => {
  const navigation = useNavigation();
  const route = useRoute();
  const [navigationState, setNavigationState] = useState<any>(null);
  const [currentRoute, setCurrentRoute] = useState<string | null>(null);

  // Update navigation context on route changes
  useEffect(() => {
    setCurrentRoute(route.name);
    setNavigationState(navigation.getState());
    
    // eslint-disable-next-line no-console
    console.log(`[LayoutContext] Route changed to: ${route.name}`);
  }, [route.name, navigation]);

  // Create enhanced context
  const enhancedContext: EnhancedLayoutContext = {
    navigationState,
    currentRoute: currentRoute || undefined,
    themeContext: options?.themeContext,
    userContext: options?.userContext,
    appState: options?.appState,
    enableContextBridge: options?.enableContextBridge ?? true,
    slotInjection: options?.slotOverrides
  };

  return enhancedContext;
};

// Hook to inject content into specific slots with context
export const useSlotInjection = (slotType: 'top' | 'center' | 'bottom') => {
  const navigation = useNavigation();
  const route = useRoute();
  
  const injectSlot = (content: React.ReactNode, context?: Partial<LayoutContext>) => {
    // This would integrate with the existing slot zone system
    // For now, return the content with context metadata
    return {
      content,
      context: {
        navigationState: navigation.getState(),
        currentRoute: route.name,
        ...context
      }
    };
  };

  return { injectSlot };
};

// Hook to get current layout context
export const useCurrentLayoutContext = (): EnhancedLayoutContext => {
  const navigation = useNavigation();
  const route = useRoute();
  
  return {
    navigationState: navigation.getState(),
    currentRoute: route.name,
    enableContextBridge: true
  };
}; 