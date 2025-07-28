// useLayoutContext.tsx - Context bridge for layout shell components
import React, { useEffect, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';

declare const console: any;

// Base layout context interface
interface BaseLayoutContext {
  navigationState?: any;
}

// Enhanced layout context with navigation and theme integration
export interface EnhancedLayoutContext extends BaseLayoutContext {
  enableContextBridge: boolean;
  currentRoute?: string;
  themeContext?: any;
  userContext?: any;
  appState?: any;
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
export const useSlotInjection = (_slotType: 'top' | 'center' | 'bottom') => {
  const navigation = useNavigation();
  const route = useRoute();
  
  const injectSlot = (content: React.ReactNode, context?: Partial<BaseLayoutContext>) => {
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