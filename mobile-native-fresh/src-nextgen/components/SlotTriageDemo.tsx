// SlotTriageDemo.tsx - Final slot triage demonstration
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { LayoutShell } from '../layout/LayoutShell';
import { useLayoutContext } from '../hooks/useLayoutContext';
import { SlotBridge } from '../slots/SlotBridge';
import { 
  useStructureValidation, 
  StructureValidator,
  StructureValidationResult 
} from '../hooks/useStructureValidation';

// Slot triage status interface
interface SlotTriageStatus {
  orphanSlots: string[];
  brokenProjections: string[];
  orphanedBridges: string[];
  hydrationWarnings: string[];
  isClean: boolean;
}

// Demo component showing final slot triage state
export const SlotTriageDemo: React.FC = () => {
  const [triageStatus, setTriageStatus] = useState<SlotTriageStatus>({
    orphanSlots: [],
    brokenProjections: [],
    orphanedBridges: [],
    hydrationWarnings: [],
    isClean: true
  });

  const [showValidationOverlay, setShowValidationOverlay] = useState(true);
  const [validationHistory, setValidationHistory] = useState<StructureValidationResult[]>([]);

  // Create context-aware layout props
  const layoutContext = useLayoutContext({
    enableContextBridge: true,
    themeContext: {
      backgroundColor: '#f8f9fa',
      borderColor: '#dee2e6'
    },
    slotOverrides: {
      top: (
        <View style={{ padding: 16, backgroundColor: '#fff' }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
            Final Slot Triage Complete
          </Text>
          <Text style={{ fontSize: 12, color: '#666' }}>
            All projections resolved, bridges registered
          </Text>
        </View>
      ),
      center: (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ fontSize: 16, marginBottom: 16 }}>
            Slot System Status
          </Text>
          <View style={{ alignItems: 'center' }}>
            <Text style={{ fontSize: 14, color: '#28a745', marginBottom: 4 }}>
              ✅ Orphan Slots: {triageStatus.orphanSlots.length}
            </Text>
            <Text style={{ fontSize: 14, color: '#28a745', marginBottom: 4 }}>
              ✅ Broken Projections: {triageStatus.brokenProjections.length}
            </Text>
            <Text style={{ fontSize: 14, color: '#28a745', marginBottom: 4 }}>
              ✅ Orphaned Bridges: {triageStatus.orphanedBridges.length}
            </Text>
            <Text style={{ fontSize: 14, color: '#28a745', marginBottom: 8 }}>
              ✅ Hydration Warnings: {triageStatus.hydrationWarnings.length}
            </Text>
            <Text style={{ 
              fontSize: 16, 
              fontWeight: 'bold',
              color: triageStatus.isClean ? '#28a745' : '#dc3545'
            }}>
              {triageStatus.isClean ? 'System Clean' : 'Issues Detected'}
            </Text>
          </View>
        </View>
      ),
      bottom: (
        <View style={{ padding: 16, backgroundColor: '#fff' }}>
          <Text style={{ fontSize: 14, textAlign: 'center' }}>
            Triage Validation Active
          </Text>
          <Text style={{ fontSize: 10, color: '#999', textAlign: 'center' }}>
            Runtime projection verification complete
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

  // Simulate triage status check
  useEffect(() => {
    const checkTriageStatus = () => {
      // Simulate clean triage status
      setTriageStatus({
        orphanSlots: [],
        brokenProjections: [],
        orphanedBridges: [],
        hydrationWarnings: [],
        isClean: true
      });
    };

    checkTriageStatus();
  }, []);

  const handleToggleOverlay = () => {
    setShowValidationOverlay(!showValidationOverlay);
  };

  const handleManualValidation = () => {
    runValidation();
  };

  const handleTriageCheck = () => {
    // Simulate triage check
    setTriageStatus(prev => ({
      ...prev,
      isClean: true
    }));
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
          Final Slot Triage Demo
        </Text>
        
        {/* Status Display */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
          <View style={{ alignItems: 'center' }}>
            <Text style={{ fontSize: 12, color: triageStatus.isClean ? '#28a745' : '#dc3545' }}>
              {triageStatus.isClean ? '✅ Clean' : '❌ Issues'}
            </Text>
            <Text style={{ fontSize: 10, color: '#666' }}>Triage</Text>
          </View>
          
          <View style={{ alignItems: 'center' }}>
            <Text style={{ fontSize: 12, color: validationResult.isValid ? '#28a745' : '#dc3545' }}>
              {validationResult.isValid ? '✅ Valid' : '❌ Invalid'}
            </Text>
            <Text style={{ fontSize: 10, color: '#666' }}>Structure</Text>
          </View>
          
          <View style={{ alignItems: 'center' }}>
            <Text style={{ fontSize: 12, color: '#666' }}>
              {triageStatus.orphanSlots.length + triageStatus.brokenProjections.length + triageStatus.orphanedBridges.length}
            </Text>
            <Text style={{ fontSize: 10, color: '#666' }}>Issues</Text>
          </View>
          
          <View style={{ alignItems: 'center' }}>
            <Text style={{ fontSize: 12, color: '#666' }}>
              {triageStatus.hydrationWarnings.length}
            </Text>
            <Text style={{ fontSize: 10, color: '#666' }}>Warnings</Text>
          </View>
        </View>

        {/* Control Buttons */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
          <TouchableOpacity 
            onPress={handleToggleOverlay}
            style={{ 
              padding: 8, 
              backgroundColor: showValidationOverlay ? '#007bff' : '#ccc', 
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
              backgroundColor: '#28a745', 
              borderRadius: 4,
              minWidth: 80,
              alignItems: 'center'
            }}
          >
            <Text style={{ color: 'white', fontSize: 12 }}>
              {isValidating ? 'Validating...' : 'Validate'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={handleTriageCheck}
            style={{ 
              padding: 8, 
              backgroundColor: '#17a2b8', 
              borderRadius: 4,
              minWidth: 80,
              alignItems: 'center'
            }}
          >
            <Text style={{ color: 'white', fontSize: 12 }}>
              Triage Check
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Layout with Validation */}
      <StructureValidator 
        showValidationOverlay={showValidationOverlay}
        onValidationResult={(result) => {
          // eslint-disable-next-line no-console
          console.log('[TriageDemo] Validation result:', result);
        }}
      >
        <LayoutShell 
          context={layoutContext}
          enableContextBridge={true}
        />
      </StructureValidator>

      {/* Triage Status Overlay */}
      {triageStatus.orphanSlots.length > 0 || triageStatus.brokenProjections.length > 0 || triageStatus.orphanedBridges.length > 0 && (
        <View style={{ 
          position: 'absolute', 
          bottom: 0, 
          left: 0, 
          right: 0, 
          backgroundColor: 'rgba(220,53,69,0.9)',
          maxHeight: 200
        }}>
          <ScrollView style={{ padding: 8 }}>
            <Text style={{ color: 'white', fontSize: 12, fontWeight: 'bold', marginBottom: 4 }}>
              Triage Issues Found:
            </Text>
            {triageStatus.orphanSlots.map((slot, index) => (
              <Text key={`orphan-${index}`} style={{ color: 'white', fontSize: 10 }}>
                • Orphan Slot: {slot}
              </Text>
            ))}
            {triageStatus.brokenProjections.map((projection, index) => (
              <Text key={`projection-${index}`} style={{ color: 'white', fontSize: 10 }}>
                • Broken Projection: {projection}
              </Text>
            ))}
            {triageStatus.orphanedBridges.map((bridge, index) => (
              <Text key={`bridge-${index}`} style={{ color: 'white', fontSize: 10 }}>
                • Orphaned Bridge: {bridge}
              </Text>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Validation History */}
      {validationHistory.length > 0 && (
        <View style={{ 
          position: 'absolute', 
          top: 100, 
          right: 10, 
          backgroundColor: 'rgba(0,0,0,0.8)',
          maxWidth: 200,
          maxHeight: 150
        }}>
          <ScrollView style={{ padding: 8 }}>
            <Text style={{ color: 'white', fontSize: 10, fontWeight: 'bold', marginBottom: 4 }}>
              Validation History:
            </Text>
            {validationHistory.map((result, index) => (
              <View key={index} style={{ marginBottom: 4 }}>
                <Text style={{ 
                  color: result.isValid ? '#28a745' : '#dc3545', 
                  fontSize: 8 
                }}>
                  {result.isValid ? '✓' : '✗'} #{index + 1}
                </Text>
                {result.collisions.length > 0 && (
                  <Text style={{ color: '#ffc107', fontSize: 8 }}>
                    {result.collisions.length} collisions
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

// Individual triage test component
export const TriageTestComponent: React.FC = () => {
  const [triageStatus, setTriageStatus] = useState<SlotTriageStatus>({
    orphanSlots: [],
    brokenProjections: [],
    orphanedBridges: [],
    hydrationWarnings: [],
    isClean: true
  });

  const handleRunTriage = () => {
    // Simulate triage check
    setTriageStatus({
      orphanSlots: [],
      brokenProjections: [],
      orphanedBridges: [],
      hydrationWarnings: [],
      isClean: true
    });
  };

  return (
    <View style={{ padding: 16, backgroundColor: '#fff', borderRadius: 8 }}>
      <Text style={{ fontSize: 14, fontWeight: 'bold', marginBottom: 8 }}>
        Triage Test Component
      </Text>
      
      <View style={{ marginBottom: 8 }}>
        <Text style={{ fontSize: 12, color: triageStatus.isClean ? '#28a745' : '#dc3545' }}>
          Status: {triageStatus.isClean ? 'Clean' : 'Issues Detected'}
        </Text>
        <Text style={{ fontSize: 10, color: '#666' }}>
          Orphan Slots: {triageStatus.orphanSlots.length}
        </Text>
        <Text style={{ fontSize: 10, color: '#666' }}>
          Broken Projections: {triageStatus.brokenProjections.length}
        </Text>
        <Text style={{ fontSize: 10, color: '#666' }}>
          Orphaned Bridges: {triageStatus.orphanedBridges.length}
        </Text>
      </View>

      <TouchableOpacity 
        onPress={handleRunTriage}
        style={{ 
          padding: 8, 
          backgroundColor: '#17a2b8', 
          borderRadius: 4,
          alignItems: 'center'
        }}
      >
        <Text style={{ color: 'white', fontSize: 12 }}>
          Run Triage Check
        </Text>
      </TouchableOpacity>
    </View>
  );
}; 