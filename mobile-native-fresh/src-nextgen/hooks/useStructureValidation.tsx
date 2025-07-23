// useStructureValidation.tsx - Runtime and visual validation hooks for layout structure
import React, { useEffect, useState, useRef, useCallback } from 'react';
import { View, Text, Dimensions } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

// Structure validation interface
export interface StructureValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  collisions: SlotCollision[];
  bounds: LayoutBounds;
  hydrationStatus: HydrationStatus;
}

// Slot collision detection
export interface SlotCollision {
  zone: 'top' | 'center' | 'bottom';
  type: 'overlap' | 'overflow' | 'missing' | 'duplicate';
  severity: 'error' | 'warning' | 'info';
  message: string;
  bounds?: { x: number; y: number; width: number; height: number };
}

// Layout bounds validation
export interface LayoutBounds {
  screen: { width: number; height: number };
  safeArea: { top: number; bottom: number; left: number; right: number };
  zones: {
    top: { y: number; height: number };
    center: { y: number; height: number };
    bottom: { y: number; height: number };
  };
}

// Hydration status tracking
export interface HydrationStatus {
  layoutShell: boolean;
  slotRenderer: boolean;
  topSlot: boolean;
  centerSlot: boolean;
  bottomSlot: boolean;
  slotBridge: boolean;
  contextBridge: boolean;
}

// Hook for structure validation
export const useStructureValidation = (options?: {
  enableCollisionDetection?: boolean;
  enableBoundsValidation?: boolean;
  enableHydrationTracking?: boolean;
  onValidationComplete?: (result: StructureValidationResult) => void;
}) => {
  const navigation = useNavigation();
  const route = useRoute();
  const [validationResult, setValidationResult] = useState<StructureValidationResult>({
    isValid: false,
    errors: [],
    warnings: [],
    collisions: [],
    bounds: {
      screen: { width: 0, height: 0 },
      safeArea: { top: 0, bottom: 0, left: 0, right: 0 },
      zones: {
        top: { y: 0, height: 0 },
        center: { y: 0, height: 0 },
        bottom: { y: 0, height: 0 }
      }
    },
    hydrationStatus: {
      layoutShell: false,
      slotRenderer: false,
      topSlot: false,
      centerSlot: false,
      bottomSlot: false,
      slotBridge: false,
      contextBridge: false
    }
  });

  const [isValidating, setIsValidating] = useState(false);
  const validationTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Get screen dimensions
  const screenDimensions = Dimensions.get('window');

  // Validate layout bounds
  const validateBounds = useCallback(() => {
    const bounds: LayoutBounds = {
      screen: {
        width: screenDimensions.width,
        height: screenDimensions.height
      },
      safeArea: {
        top: 0, // Would be calculated from useSafeAreaInsets
        bottom: 0,
        left: 0,
        right: 0
      },
      zones: {
        top: { y: 0, height: 50 },
        center: { y: 50, height: screenDimensions.height - 100 },
        bottom: { y: screenDimensions.height - 50, height: 50 }
      }
    };

    // Check for zone overlaps
    const collisions: SlotCollision[] = [];
    
    if (bounds.zones.top.y + bounds.zones.top.height > bounds.zones.center.y) {
      collisions.push({
        zone: 'top',
        type: 'overlap',
        severity: 'error',
        message: 'Top zone overlaps with center zone',
        bounds: { x: 0, y: bounds.zones.top.y, width: bounds.screen.width, height: bounds.zones.top.height }
      });
    }

    if (bounds.zones.center.y + bounds.zones.center.height > bounds.zones.bottom.y) {
      collisions.push({
        zone: 'center',
        type: 'overlap',
        severity: 'error',
        message: 'Center zone overlaps with bottom zone',
        bounds: { x: 0, y: bounds.zones.center.y, width: bounds.screen.width, height: bounds.zones.center.height }
      });
    }

    // Check for screen overflow
    if (bounds.zones.bottom.y + bounds.zones.bottom.height > bounds.screen.height) {
      collisions.push({
        zone: 'bottom',
        type: 'overflow',
        severity: 'warning',
        message: 'Bottom zone overflows screen bounds',
        bounds: { x: 0, y: bounds.zones.bottom.y, width: bounds.screen.width, height: bounds.zones.bottom.height }
      });
    }

    return { bounds, collisions };
  }, [screenDimensions]);

  // Validate hydration status
  const validateHydration = useCallback(() => {
    const hydrationStatus: HydrationStatus = {
      layoutShell: true, // Assume true if hook is being used
      slotRenderer: true,
      topSlot: true,
      centerSlot: true,
      bottomSlot: true,
      slotBridge: true,
      contextBridge: true
    };

    const errors: string[] = [];
    const warnings: string[] = [];

    // Check for missing components (this would be more sophisticated in real implementation)
    if (!hydrationStatus.layoutShell) {
      errors.push('LayoutShell component not hydrated');
    }

    if (!hydrationStatus.slotRenderer) {
      errors.push('SlotRenderer component not hydrated');
    }

    if (!hydrationStatus.slotBridge) {
      warnings.push('SlotBridge component not detected');
    }

    return { hydrationStatus, errors, warnings };
  }, []);

  // Run complete validation
  const runValidation = useCallback(() => {
    setIsValidating(true);

    // Clear previous timeout
    if (validationTimeoutRef.current) {
      clearTimeout(validationTimeoutRef.current);
    }

    // Run validation with timeout
    validationTimeoutRef.current = setTimeout(() => {
      try {
        const { bounds, collisions } = validateBounds();
        const { hydrationStatus, errors, warnings } = validateHydration();

        // Additional validation logic
        const additionalErrors: string[] = [];
        const additionalWarnings: string[] = [];

        // Check for navigation integration
        if (!navigation) {
          additionalWarnings.push('Navigation context not available');
        }

        // Check for route context
        if (!route) {
          additionalWarnings.push('Route context not available');
        }

        // Check for screen dimensions
        if (bounds.screen.width === 0 || bounds.screen.height === 0) {
          additionalErrors.push('Invalid screen dimensions detected');
        }

        const result: StructureValidationResult = {
          isValid: errors.length === 0 && additionalErrors.length === 0,
          errors: [...errors, ...additionalErrors],
          warnings: [...warnings, ...additionalWarnings],
          collisions,
          bounds,
          hydrationStatus
        };

        setValidationResult(result);
        options?.onValidationComplete?.(result);

        // eslint-disable-next-line no-console
        console.log('[StructureValidation] Validation complete:', result);

      } catch (error) {
        const errorResult: StructureValidationResult = {
          isValid: false,
          errors: [`Validation error: ${error}`],
          warnings: [],
          collisions: [],
          bounds: validationResult.bounds,
          hydrationStatus: validationResult.hydrationStatus
        };

        setValidationResult(errorResult);
        options?.onValidationComplete?.(errorResult);
      } finally {
        setIsValidating(false);
      }
    }, 100);
  }, [validateBounds, validateHydration, navigation, route, options, validationResult.bounds, validationResult.hydrationStatus]);

  // Auto-validate on mount and route changes
  useEffect(() => {
    runValidation();
  }, [runValidation, route.name]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (validationTimeoutRef.current) {
        clearTimeout(validationTimeoutRef.current);
      }
    };
  }, []);

  return {
    validationResult,
    isValidating,
    runValidation,
    validateBounds,
    validateHydration
  };
};

// Visual validation component
export const StructureValidator: React.FC<{
  children: React.ReactNode;
  showValidationOverlay?: boolean;
  onValidationResult?: (result: StructureValidationResult) => void;
}> = ({ children, showValidationOverlay = false, onValidationResult }) => {
  const { validationResult, isValidating } = useStructureValidation({
    onValidationComplete: onValidationResult
  });

  if (!showValidationOverlay) {
    return <>{children}</>;
  }

  return (
    <View style={{ flex: 1 }}>
      {children}
      
      {/* Validation Overlay */}
      <View style={{
        position: 'absolute',
        top: 10,
        right: 10,
        backgroundColor: validationResult.isValid ? 'rgba(0,255,0,0.8)' : 'rgba(255,0,0,0.8)',
        padding: 8,
        borderRadius: 4,
        minWidth: 120
      }}>
        <Text style={{ 
          color: 'white', 
          fontSize: 12, 
          fontWeight: 'bold',
          textAlign: 'center'
        }}>
          {isValidating ? 'Validating...' : (validationResult.isValid ? '✓ Valid' : '✗ Invalid')}
        </Text>
        
        {validationResult.errors.length > 0 && (
          <Text style={{ color: 'white', fontSize: 10, marginTop: 4 }}>
            {validationResult.errors.length} errors
          </Text>
        )}
        
        {validationResult.warnings.length > 0 && (
          <Text style={{ color: 'white', fontSize: 10 }}>
            {validationResult.warnings.length} warnings
          </Text>
        )}
        
        {validationResult.collisions.length > 0 && (
          <Text style={{ color: 'white', fontSize: 10 }}>
            {validationResult.collisions.length} collisions
          </Text>
        )}
      </View>

      {/* Collision Indicators */}
      {validationResult.collisions.map((collision, index) => (
        <View
          key={index}
          style={{
            position: 'absolute',
            left: collision.bounds?.x || 0,
            top: collision.bounds?.y || 0,
            width: collision.bounds?.width || 100,
            height: collision.bounds?.height || 50,
            borderWidth: 2,
            borderColor: collision.severity === 'error' ? 'red' : 'orange',
            backgroundColor: collision.severity === 'error' ? 'rgba(255,0,0,0.1)' : 'rgba(255,165,0,0.1)',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <Text style={{ 
            color: collision.severity === 'error' ? 'red' : 'orange',
            fontSize: 10,
            textAlign: 'center',
            fontWeight: 'bold'
          }}>
            {collision.type.toUpperCase()}
          </Text>
        </View>
      ))}
    </View>
  );
};

export default useStructureValidation; 