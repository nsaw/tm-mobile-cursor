// StructureValidationDemo.tsx - Demonstration of structure validation capabilities
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';

import { LayoutShell } from '../layout/LayoutShell';
import { useLayoutContext } from '../hooks/useLayoutContext';
import { 
  useStructureValidation, 
  StructureValidator,
  StructureValidationResult 
} from '../hooks/useStructureValidation';

// Demo component showing structure validation
export const StructureValidationDemo: React.FC = () => {
  const [showValidationOverlay, setShowValidationOverlay] = useState(true);
  const [validationHistory, setValidationHistory] = useState<StructureValidationResult[]>([]);

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
            Structure Validation Active
          </Text>
          <Text style={{ fontSize: 12, color: '#666' }}>
            Layout shell structure verification
          </Text>
        </View>
      ),
      center: (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ fontSize: 16, marginBottom: 16 }}>
            Validation Runtime
          </Text>
          <Text style={{ fontSize: 14, color: '#666', textAlign: 'center' }}>
            Collision detection active{'\n'}
            Bounds validation running{'\n'}
            Hydration tracking enabled
          </Text>
        </View>
      ),
      bottom: (
        <View style={{ padding: 16, backgroundColor: '#fff' }}>
          <Text style={{ fontSize: 14, textAlign: 'center' }}>
            Structure Validator Ready
          </Text>
          <Text style={{ fontSize: 10, color: '#999', textAlign: 'center' }}>
            Runtime projection verification
          </Text>
        </View>
      )
    }
  });

  // Structure validation hook
  const { validationResult, isValidating, runValidation } = useStructureValidation({
    enableCollisionDetection: true,
    enableBoundsValidation: true,
    enableHydrationTracking: true,
    onValidationComplete: (result) => {
      setValidationHistory(prev => [result, ...prev.slice(0, 4)]); // Keep last 5 results
    }
  });

  const handleToggleOverlay = () => {
    setShowValidationOverlay(!showValidationOverlay);
  };

  const handleManualValidation = () => {
    runValidation();
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Control Panel */}
      <View style={{ 
        padding: 16, 
        backgroundColor: '#fff', 
        borderBottomWidth: 1, 
        borderBottomColor: '#e0e0e0' 
      }}>
        <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 8 }}>
          Structure Validation Demo
        </Text>
        
        {/* Status Display */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
          <View style={{ alignItems: 'center' }}>
            <Text style={{ fontSize: 12, color: validationResult.isValid ? '#4caf50' : '#f44336' }}>
              {validationResult.isValid ? '✓ Valid' : '✗ Invalid'}
            </Text>
            <Text style={{ fontSize: 10, color: '#666' }}>Status</Text>
          </View>
          
          <View style={{ alignItems: 'center' }}>
            <Text style={{ fontSize: 12, color: '#666' }}>
              {validationResult.errors.length}
            </Text>
            <Text style={{ fontSize: 10, color: '#666' }}>Errors</Text>
          </View>
          
          <View style={{ alignItems: 'center' }}>
            <Text style={{ fontSize: 12, color: '#666' }}>
              {validationResult.warnings.length}
            </Text>
            <Text style={{ fontSize: 10, color: '#666' }}>Warnings</Text>
          </View>
          
          <View style={{ alignItems: 'center' }}>
            <Text style={{ fontSize: 12, color: '#666' }}>
              {validationResult.collisions.length}
            </Text>
            <Text style={{ fontSize: 10, color: '#666' }}>Collisions</Text>
          </View>
        </View>

        {/* Control Buttons */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
          <TouchableOpacity 
            onPress={handleToggleOverlay}
            style={{ 
              padding: 8, 
              backgroundColor: showValidationOverlay ? '#2196f3' : '#ccc', 
              borderRadius: 4,
              minWidth: 80,
              alignItems: 'center'
            }}
          >
            <Text style={{ color: 'white', fontSize: 12 }}>
              {showValidationOverlay ? 'Hide' : 'Show'} Overlay
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={handleManualValidation}
            style={{ 
              padding: 8, 
              backgroundColor: '#4caf50', 
              borderRadius: 4,
              minWidth: 80,
              alignItems: 'center'
            }}
          >
            <Text style={{ color: 'white', fontSize: 12 }}>
              {isValidating ? 'Validating...' : 'Validate'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Layout with Validation */}
      <StructureValidator 
        showValidationOverlay={showValidationOverlay}
        onValidationResult={(result) => {
          // eslint-disable-next-line no-console
          console.log('[Demo] Validation result:', result);
        }}
      >
        <LayoutShell 
          context={layoutContext}
          enableContextBridge={true}
        />
      </StructureValidator>

      {/* Validation History */}
      {validationHistory.length > 0 && (
        <View style={{ 
          position: 'absolute', 
          bottom: 0, 
          left: 0, 
          right: 0, 
          backgroundColor: 'rgba(0,0,0,0.8)',
          maxHeight: 200
        }}>
          <ScrollView style={{ padding: 8 }}>
            <Text style={{ color: 'white', fontSize: 12, fontWeight: 'bold', marginBottom: 4 }}>
              Validation History:
            </Text>
            {validationHistory.map((result, index) => (
              <View key={index} style={{ marginBottom: 4 }}>
                <Text style={{ 
                  color: result.isValid ? '#4caf50' : '#f44336', 
                  fontSize: 10 
                }}>
                  {result.isValid ? '✓' : '✗'} Validation #{index + 1}
                </Text>
                {result.errors.length > 0 && (
                  <Text style={{ color: '#f44336', fontSize: 8 }}>
                    Errors: {result.errors.join(', ')}
                  </Text>
                )}
                {result.collisions.length > 0 && (
                  <Text style={{ color: '#ff9800', fontSize: 8 }}>
                    Collisions: {result.collisions.length}
                  </Text>
                )}
              </View>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
};

// Individual validation test component
export const ValidationTestComponent: React.FC = () => {
  const { validationResult, runValidation } = useStructureValidation({
    enableCollisionDetection: true,
    enableBoundsValidation: true
  });

  return (
    <View style={{ padding: 16, backgroundColor: '#fff', borderRadius: 8 }}>
      <Text style={{ fontSize: 14, fontWeight: 'bold', marginBottom: 8 }}>
        Validation Test Component
      </Text>
      
      <View style={{ marginBottom: 8 }}>
        <Text style={{ fontSize: 12, color: validationResult.isValid ? '#4caf50' : '#f44336' }}>
          Status: {validationResult.isValid ? 'Valid' : 'Invalid'}
        </Text>
        <Text style={{ fontSize: 10, color: '#666' }}>
          Screen: {validationResult.bounds.screen.width}x{validationResult.bounds.screen.height}
        </Text>
      </View>

      <TouchableOpacity 
        onPress={runValidation}
        style={{ 
          padding: 8, 
          backgroundColor: '#2196f3', 
          borderRadius: 4,
          alignItems: 'center'
        }}
      >
        <Text style={{ color: 'white', fontSize: 12 }}>
          Run Validation Test
        </Text>
      </TouchableOpacity>

      {validationResult.errors.length > 0 && (
        <View style={{ marginTop: 8 }}>
          <Text style={{ fontSize: 10, color: '#f44336', fontWeight: 'bold' }}>
            Errors:
          </Text>
          {validationResult.errors.map((error, index) => (
            <Text key={index} style={{ fontSize: 8, color: '#f44336' }}>
              • {error}
            </Text>
          ))}
        </View>
      )}
    </View>
  );
}; 