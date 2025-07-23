// SlotBridge.tsx - Synchronize slot runtime bridge with shell projection injection logic
import React, { useEffect, useState, useRef, useCallback } from 'react';
import { View, Text } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { LayoutContext } from '../layout/LayoutShell';

// Slot bridge interface for themed runtime propagation
export interface SlotBridgeProps {
  zone: 'top' | 'center' | 'bottom';
  context?: LayoutContext & { enableContextBridge?: boolean };
  children?: React.ReactNode;
  onBridgeReady?: (zone: string, context: any) => void;
  onContentInjected?: (zone: string, content: React.ReactNode) => void;
}

// Runtime bridge state for slot injection
interface BridgeState {
  isReady: boolean;
  injectedContent: React.ReactNode | null;
  bridgeContext: any;
  lastInjection: number;
  injectionCount: number;
}

// SlotBridge component for shell → slot handoff
export const SlotBridge: React.FC<SlotBridgeProps> = ({
  zone,
  context = {},
  children,
  onBridgeReady,
  onContentInjected
}) => {
  const navigation = useNavigation();
  const route = useRoute();
  const bridgeRef = useRef<BridgeState>({
    isReady: false,
    injectedContent: null,
    bridgeContext: null,
    lastInjection: 0,
    injectionCount: 0
  });

  const [bridgeState, setBridgeState] = useState<BridgeState>(bridgeRef.current);
  const [isHandoffComplete, setIsHandoffComplete] = useState(false);

  // Initialize bridge with shell context
  const initializeBridge = useCallback(() => {
    const bridgeContext = {
      navigationState: navigation.getState(),
      currentRoute: route.name,
      themeContext: context.themeContext,
      userContext: context.userContext,
      appState: context.appState,
      enableContextBridge: context.enableContextBridge,
      zone,
      timestamp: Date.now()
    };

    const newState: BridgeState = {
      isReady: true,
      injectedContent: children || null,
      bridgeContext,
      lastInjection: Date.now(),
      injectionCount: bridgeRef.current.injectionCount + 1
    };

    bridgeRef.current = newState;
    setBridgeState(newState);

    // Notify bridge ready
    onBridgeReady?.(zone, bridgeContext);

    // eslint-disable-next-line no-console
    console.log(`[SlotBridge] Bridge initialized for ${zone} zone on route: ${route.name}`);

    return newState;
  }, [zone, context, children, navigation, route.name, onBridgeReady]);

  // Inject content into bridge
  const injectContent = useCallback((content: React.ReactNode) => {
    const newState: BridgeState = {
      ...bridgeRef.current,
      injectedContent: content,
      lastInjection: Date.now(),
      injectionCount: bridgeRef.current.injectionCount + 1
    };

    bridgeRef.current = newState;
    setBridgeState(newState);

    // Notify content injection
    onContentInjected?.(zone, content);

    // eslint-disable-next-line no-console
    console.log(`[SlotBridge] Content injected into ${zone} zone (count: ${newState.injectionCount})`);

    return newState;
  }, [zone, onContentInjected]);

  // Complete handoff from shell to slot
  const completeHandoff = useCallback(() => {
    if (!bridgeState.isReady) {
      initializeBridge();
    }

    setIsHandoffComplete(true);

    // eslint-disable-next-line no-console
    console.log(`[SlotBridge] Handoff completed for ${zone} zone`);
  }, [bridgeState.isReady, initializeBridge, zone]);

  // Initialize bridge on mount
  useEffect(() => {
    const state = initializeBridge();
    
    // Complete handoff after initialization
    setTimeout(() => {
      completeHandoff();
    }, 100);

    return () => {
      // Cleanup bridge state
      bridgeRef.current = {
        isReady: false,
        injectedContent: null,
        bridgeContext: null,
        lastInjection: 0,
        injectionCount: 0
      };
    };
  }, [initializeBridge, completeHandoff]);

  // Update bridge context on route changes
  useEffect(() => {
    if (bridgeState.isReady) {
      const updatedContext = {
        ...bridgeState.bridgeContext,
        navigationState: navigation.getState(),
        currentRoute: route.name,
        timestamp: Date.now()
      };

      const newState: BridgeState = {
        ...bridgeState,
        bridgeContext: updatedContext
      };

      bridgeRef.current = newState;
      setBridgeState(newState);

      // eslint-disable-next-line no-console
      console.log(`[SlotBridge] Context updated for ${zone} zone: ${route.name}`);
    }
  }, [route.name, navigation, bridgeState.isReady, zone]);

  // Inject children when they change
  useEffect(() => {
    if (bridgeState.isReady && children !== bridgeState.injectedContent) {
      injectContent(children || null);
    }
  }, [children, bridgeState.isReady, bridgeState.injectedContent, injectContent]);

  // Render bridge content with themed runtime context
  const renderBridgeContent = () => {
    if (!bridgeState.isReady) {
      return (
        <View style={{ 
          padding: 8, 
          backgroundColor: context.themeContext?.backgroundColor || '#f0f0f0',
          borderRadius: 4
        }}>
          <Text style={{ fontSize: 12, color: '#666' }}>
            Initializing {zone} bridge...
          </Text>
        </View>
      );
    }

    if (!bridgeState.injectedContent) {
      return (
        <View style={{ 
          padding: 8, 
          backgroundColor: context.themeContext?.backgroundColor || '#f8f8f8',
          borderRadius: 4,
          borderWidth: 1,
          borderColor: context.themeContext?.borderColor || '#e0e0e0'
        }}>
          <Text style={{ fontSize: 12, color: '#999' }}>
            {zone} slot bridge ready
          </Text>
          {bridgeState.bridgeContext?.currentRoute && (
            <Text style={{ fontSize: 10, color: '#ccc' }}>
              Route: {bridgeState.bridgeContext.currentRoute}
            </Text>
          )}
        </View>
      );
    }

    return (
      <View style={{ 
        flex: 1,
        backgroundColor: context.themeContext?.backgroundColor || 'transparent'
      }}>
        {bridgeState.injectedContent}
        {context.enableContextBridge && (
          <View style={{ 
            position: 'absolute', 
            top: 2, 
            right: 2, 
            backgroundColor: 'rgba(0,0,0,0.1)', 
            borderRadius: 2, 
            padding: 1 
          }}>
            <Text style={{ fontSize: 8, color: '#666' }}>
              {bridgeState.injectionCount}
            </Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={{ 
      flex: 1,
      position: 'relative',
      backgroundColor: context.themeContext?.backgroundColor || 'transparent'
    }}>
      {renderBridgeContent()}
      
      {/* Bridge status indicator */}
      {context.enableContextBridge && isHandoffComplete && (
        <View style={{
          position: 'absolute',
          bottom: 2,
          left: 2,
          backgroundColor: 'rgba(0,255,0,0.2)',
          borderRadius: 2,
          padding: 1
        }}>
          <Text style={{ fontSize: 8, color: '#0a0' }}>
            ✓
          </Text>
        </View>
      )}
    </View>
  );
};

// Hook to use slot bridge
export const useSlotBridge = (zone: 'top' | 'center' | 'bottom') => {
  const [bridgeState, setBridgeState] = useState<BridgeState | null>(null);

  const injectIntoBridge = useCallback((content: React.ReactNode, context?: Partial<LayoutContext>) => {
    // This would integrate with the SlotBridge component
    const injection = {
      content,
      context: {
        zone,
        timestamp: Date.now(),
        ...context
      }
    };

    // eslint-disable-next-line no-console
    console.log(`[useSlotBridge] Injecting into ${zone} bridge:`, injection);

    return injection;
  }, [zone]);

  return {
    bridgeState,
    injectIntoBridge,
    isReady: bridgeState?.isReady || false
  };
};

export default SlotBridge; 