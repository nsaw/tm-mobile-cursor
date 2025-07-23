// LayoutContextDemo.tsx - Demonstration of context-aware layout system
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { LayoutShell } from '../layout/LayoutShell';
import { useLayoutContext, useSlotInjection } from '../hooks/useLayoutContext';

// Demo component showing context injection
export const LayoutContextDemo: React.FC = () => {
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
            Context-Aware Top Slot
          </Text>
          <Text style={{ fontSize: 12, color: '#666' }}>
            Navigation state and theme context injected
          </Text>
        </View>
      ),
      center: (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ fontSize: 16, marginBottom: 16 }}>
            Context Bridge Active
          </Text>
          <Text style={{ fontSize: 14, color: '#666', textAlign: 'center' }}>
            This center slot receives navigation context{'\n'}
            and theme bindings from the layout shell
          </Text>
        </View>
      ),
      bottom: (
        <View style={{ padding: 16, backgroundColor: '#fff' }}>
          <Text style={{ fontSize: 14, textAlign: 'center' }}>
            Context-Aware Bottom Slot
          </Text>
          <Text style={{ fontSize: 10, color: '#999', textAlign: 'center' }}>
            Route-aware styling and behavior
          </Text>
        </View>
      )
    }
  });

  return (
    <LayoutShell 
      context={layoutContext}
      enableContextBridge={true}
    />
  );
};

// Hook demonstration component
export const ContextInjectionDemo: React.FC = () => {
  const { injectSlot } = useSlotInjection('top');
  
  const handleInjectContent = () => {
    const injectedContent = injectSlot(
      <View style={{ padding: 8, backgroundColor: '#e3f2fd' }}>
        <Text>Dynamically Injected Content</Text>
      </View>,
      {
        themeContext: { backgroundColor: '#e3f2fd' }
      }
    );
    
    // eslint-disable-next-line no-console
    console.log('Injected content with context:', injectedContent);
  };

  return (
    <View style={{ padding: 16 }}>
      <Text style={{ fontSize: 16, marginBottom: 16 }}>
        Context Injection Demo
      </Text>
      <TouchableOpacity 
        onPress={handleInjectContent}
        style={{ 
          padding: 12, 
          backgroundColor: '#2196f3', 
          borderRadius: 8 
        }}
      >
        <Text style={{ color: 'white', textAlign: 'center' }}>
          Inject Content with Context
        </Text>
      </TouchableOpacity>
    </View>
  );
}; 