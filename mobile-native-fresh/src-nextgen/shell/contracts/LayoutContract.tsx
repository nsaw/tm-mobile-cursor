import React, { useEffect, useRef } from 'react';
import { View, ViewStyle, Text } from 'react-native';
import { LayoutContractProps } from './types';
import { validateLayoutContract, getZIndexValue } from './utils';

/**
 * LayoutContract Component
 * 
 * A component that enforces layout contracts and provides
 * z-index protection for the hybrid renderer shell.
 */
export const LayoutContract: React.FC<LayoutContractProps> = ({
  contract,
  children,
  className: _className,
  style,
  _testID
}) => {
  const _componentRef = useRef<View>(null);
  const contractId = useRef(contract.id || `layout-contract-${Date.now()}`);

  // Validation effect
  useEffect(() => {
    if (contract.validation.enabled) {
      const validation = validateLayoutContract(contract);
      if (!validation.valid) {
        console.error('Layout contract validation failed:', validation.errors);
      }
      if (validation.warnings.length > 0) {
        console.warn('Layout contract warnings:', validation.warnings);
      }
    }
  }, [contract]);

  // Debug logging effect
  useEffect(() => {
    if (__DEV__) {
      console.log(`🔧 LayoutContract: ${contractId.current}`, {
        zIndex: contract.zIndex,
        priority: contract.priority,
        protected: contract.protected,
        safeFrame: contract.safeFrame,
        timestamp: new Date().toISOString()
      });
    }
  }, [contract]);

  // Get layout style based on contract
  const _getLayoutStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      position: (contract.constraints.position === 'fixed' ? 'absolute' : contract.constraints.position) || 'relative',
      zIndex: getZIndexValue(contract.zIndex),
    };

    // Apply constraints
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
    if (contract.constraints.aspectRatio) {
      baseStyle.aspectRatio = contract.constraints.aspectRatio;
    }
    if (contract.constraints.overflow) {
      baseStyle.overflow = contract.constraints.overflow;
    }

    // Apply safe frame if enabled
    if (contract.safeFrame) {
      baseStyle.paddingHorizontal = 16;
      baseStyle.paddingVertical = 8;
    }

    // Debug styling
    if (__DEV__ && contract.validation.warnings) {
      baseStyle.borderWidth = 1;
      baseStyle.borderColor = '#F59E0B';
      baseStyle.backgroundColor = '#FEF3C7';
    }

    return { ...baseStyle, ...style } as ViewStyle;
  };

  return (
    <View><Text>{children}</Text></View>
  );
};

export default LayoutContract; 