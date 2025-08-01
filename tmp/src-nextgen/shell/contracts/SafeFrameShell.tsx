import React, { useEffect, useRef } from 'react';
import { View, ViewStyle } from 'react-native';
import { SafeFrameShell as SafeFrameShellType, LayoutContract } from './types';
import { validateSafeFrameShell } from './utils';

/**
 * SafeFrameShell Component
 * 
 * A component that provides safe frame shells for layout contracts
 * and ensures proper content boundaries for the hybrid renderer shell.
 */
export const SafeFrameShell: React.FC<SafeFrameShellType> = ({
  id,
  contract,
  children,
  className,
  style,
  testID
}) => {
  const componentRef = useRef<View>(null);
  const shellId = useRef(id || `safe-frame-shell-${Date.now()}`);

  // Validation effect
  useEffect(() => {
    const validation = validateSafeFrameShell({ id: shellId.current, contract, children });
    if (!validation.valid) {
      console.error('Safe frame shell validation failed:', validation.errors);
    }
    if (validation.warnings.length > 0) {
      console.warn('Safe frame shell warnings:', validation.warnings);
    }
  }, [contract, children]);

  // Debug logging effect
  useEffect(() => {
    if (__DEV__) {
      console.log(`🔧 SafeFrameShell: ${shellId.current}`, {
        contractId: contract.id,
        zIndex: contract.zIndex,
        safeFrame: contract.safeFrame,
        timestamp: new Date().toISOString()
      });
    }
  }, [contract]);

  // Get safe frame style
  const getSafeFrameStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      position: 'relative',
      paddingHorizontal: 16,
      paddingVertical: 8,
      marginHorizontal: 8,
      marginVertical: 4,
    };

    // Apply contract constraints
    if (contract.constraints.minWidth) {
      baseStyle.minWidth = contract.constraints.minWidth;
    }
    if (contract.constraints.maxWidth) {
      baseStyle.maxWidth = contract.constraints.maxWidth;
    }
    if (contract.constraints.minHeight) {
      baseStyle.minHeight = contract.constraints.minHeight;
    }
    if (contract.constraints.maxHeight) {
      baseStyle.maxHeight = contract.constraints.maxHeight;
    }

    // Apply safe frame specific styling
    if (contract.safeFrame) {
      baseStyle.borderRadius = 8;
      baseStyle.backgroundColor = '#F8FAFC';
      baseStyle.borderWidth = 1;
      baseStyle.borderColor = '#E2E8F0';
    }

    // Debug styling
    if (__DEV__) {
      baseStyle.borderWidth = 1;
      baseStyle.borderColor = '#10B981';
      baseStyle.backgroundColor = '#D1FAE5';
    }

    return { ...baseStyle, ...style };
  };

  return (
    <View
      ref={componentRef}
      style={getSafeFrameStyle()}
      className={className}
      testID={testID || `safe-frame-shell-${contract.zIndex}`}
      accessibilityRole="none"
      accessibilityLabel={`Safe frame shell for ${contract.zIndex} layer`}
    >
      {children}
    </View>
  );
};

export default SafeFrameShell; 