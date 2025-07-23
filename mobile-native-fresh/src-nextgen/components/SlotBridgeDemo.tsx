// SlotBridgeDemo.tsx - Demonstration of complete slot bridge handoff chain
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { LayoutShell } from '../layout/LayoutShell';
import { useLayoutContext } from '../hooks/useLayoutContext';
import { SlotBridge, useSlotBridge } from '../slots/SlotBridge';

// Demo component showing complete bridge handoff chain
export const SlotBridgeDemo: React.FC = () => {
  const [handoffStatus, setHandoffStatus] = useState<{
    top: boolean;
    center: boolean;
    bottom: boolean;
  }>({ top: false, center: false, bottom: false });

  const [injectionCounts, setInjectionCounts] = useState<{
    top: number;
    center: number;
    bottom: number;
  }>({ top: 0, center: 0, bottom: 0 });

  // Create context-aware layout props
  const layoutContext = useLayoutContext({
    enableContextBridge: true,
    themeContext: {
      backgroundColor: '#f5f5f5',
      borderColor: '#e0e0e0'
    },
    slotOverrides: {
      top: (
        <View style={{ padding: 16, backgroundColor: '#fff' }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
            Top Slot Bridge Active
          </Text>
          <Text style={{ fontSize: 12, color: '#666' }}>
            Shell → Slot handoff complete
          </Text>
        </View>
      ),
      center: (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ fontSize: 16, marginBottom: 16 }}>
            Center Bridge Runtime
          </Text>
          <Text style={{ fontSize: 14, color: '#666', textAlign: 'center' }}>
            Themed runtime context injected{'\n'}
            Bridge handoff chain operational
          </Text>
        </View>
      ),
      bottom: (
        <View style={{ padding: 16, backgroundColor: '#fff' }}>
          <Text style={{ fontSize: 14, textAlign: 'center' }}>
            Bottom Slot Bridge Ready
          </Text>
          <Text style={{ fontSize: 10, color: '#999', textAlign: 'center' }}>
            Projection injection confirmed
          </Text>
        </View>
      )
    }
  });

  // Bridge handoff handlers
  const handleTopBridgeReady = (zone: string, context: any) => {
    setHandoffStatus(prev => ({ ...prev, top: true }));
    // eslint-disable-next-line no-console
    console.log(`[Demo] Top bridge ready:`, context);
  };

  const handleCenterBridgeReady = (zone: string, context: any) => {
    setHandoffStatus(prev => ({ ...prev, center: true }));
    // eslint-disable-next-line no-console
    console.log(`[Demo] Center bridge ready:`, context);
  };

  const handleBottomBridgeReady = (zone: string, context: any) => {
    setHandoffStatus(prev => ({ ...prev, bottom: true }));
    // eslint-disable-next-line no-console
    console.log(`[Demo] Bottom bridge ready:`, context);
  };

  const handleContentInjected = (zone: string, content: React.ReactNode) => {
    setInjectionCounts(prev => ({
      ...prev,
      [zone]: prev[zone as keyof typeof prev] + 1
    }));
    // eslint-disable-next-line no-console
    console.log(`[Demo] Content injected into ${zone}:`, content);
  };

  // Test bridge injection
  const { injectIntoBridge } = useSlotBridge('center');
  
  const handleTestInjection = () => {
    const testContent = (
      <View style={{ padding: 8, backgroundColor: '#e3f2fd', borderRadius: 4 }}>
        <Text style={{ fontSize: 12, color: '#1976d2' }}>
          Dynamic Injection Test
        </Text>
        <Text style={{ fontSize: 10, color: '#42a5f5' }}>
          Timestamp: {new Date().toLocaleTimeString()}
        </Text>
      </View>
    );

    injectIntoBridge(testContent, {
      themeContext: { backgroundColor: '#e3f2fd' }
    });
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Status Header */}
      <View style={{ 
        padding: 16, 
        backgroundColor: '#fff', 
        borderBottomWidth: 1, 
        borderBottomColor: '#e0e0e0' 
      }}>
        <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 8 }}>
          Slot Bridge Handoff Demo
        </Text>
        
        {/* Handoff Status */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginBottom: 8 }}>
          {Object.entries(handoffStatus).map(([zone, ready]) => (
            <View key={zone} style={{ alignItems: 'center' }}>
              <Text style={{ fontSize: 12, color: ready ? '#4caf50' : '#f44336' }}>
                {ready ? '✓' : '⏳'} {zone}
              </Text>
              <Text style={{ fontSize: 10, color: '#666' }}>
                {injectionCounts[zone as keyof typeof injectionCounts]} injections
              </Text>
            </View>
          ))}
        </View>

        {/* Test Button */}
        <TouchableOpacity 
          onPress={handleTestInjection}
          style={{ 
            padding: 8, 
            backgroundColor: '#2196f3', 
            borderRadius: 4,
            alignItems: 'center'
          }}
        >
          <Text style={{ color: 'white', fontSize: 12 }}>
            Test Bridge Injection
          </Text>
        </TouchableOpacity>
      </View>

      {/* Layout Shell with Bridge Integration */}
      <LayoutShell 
        context={layoutContext}
        enableContextBridge={true}
      />
    </View>
  );
};

// Individual bridge test component
export const BridgeTestComponent: React.FC<{ zone: 'top' | 'center' | 'bottom' }> = ({ zone }) => {
  const [bridgeState, setBridgeState] = useState<any>(null);

  const handleBridgeReady = (bridgeZone: string, context: any) => {
    setBridgeState(context);
    // eslint-disable-next-line no-console
    console.log(`[BridgeTest] ${bridgeZone} bridge ready:`, context);
  };

  return (
    <SlotBridge 
      zone={zone}
      context={{
        enableContextBridge: true,
        themeContext: { backgroundColor: '#f8f9fa' }
      }}
      onBridgeReady={handleBridgeReady}
    >
      <View style={{ padding: 12, backgroundColor: '#fff', borderRadius: 4 }}>
        <Text style={{ fontSize: 14, fontWeight: 'bold' }}>
          {zone.charAt(0).toUpperCase() + zone.slice(1)} Bridge Test
        </Text>
        {bridgeState && (
          <Text style={{ fontSize: 10, color: '#666', marginTop: 4 }}>
            Route: {bridgeState.currentRoute}
          </Text>
        )}
      </View>
    </SlotBridge>
  );
}; 