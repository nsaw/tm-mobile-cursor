import React, { useEffect, useRef } from 'react';
import { View, ViewStyle } from 'react-native';
import { ZIndexProtectionProps, ZIndexLayer } from './types';
import { getZIndexValue, validateZIndexProtection } from './utils';

/**
 * ZIndexProtection Component
 * 
 * A component that provides z-index protection and ensures
 * proper layering for the hybrid renderer shell.
 */
export const ZIndexProtection: React.FC<ZIndexProtectionProps> = ({
  layer,
  children,
  protected: isProtected = false,
  fallback = 0,
  className,
  style,
  testID
}) => {
  const componentRef = useRef<View>(null);
  const protectionId = useRef(`z-index-protection-${layer}-${Date.now()}`);

  // Validation effect
  useEffect(() => {
    const validation = validateZIndexProtection(layer, isProtected, fallback);
    if (!validation.valid) {
      console.error('Z-index protection validation failed:', validation.errors);
    }
    if (validation.warnings.length > 0) {
      console.warn('Z-index protection warnings:', validation.warnings);
    }
  }, [layer, isProtected, fallback]);

  // Debug logging effect
  useEffect(() => {
    if (__DEV__) {
      console.log(`🔧 ZIndexProtection: ${protectionId.current}`, {
        layer,
        value: getZIndexValue(layer),
        protected: isProtected,
        fallback,
        timestamp: new Date().toISOString()
      });
    }
  }, [layer, isProtected, fallback]);

  // Get z-index style
  const getZIndexStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      position: 'relative',
      zIndex: getZIndexValue(layer),
    };

    // Apply fallback if protection is enabled and value is invalid
    if (isProtected && getZIndexValue(layer) === 0) {
      baseStyle.zIndex = fallback;
    }

    // Debug styling for protected layers
    if (__DEV__ && isProtected) {
      baseStyle.borderWidth = 1;
      baseStyle.borderColor = '#DC2626';
      baseStyle.backgroundColor = '#FEE2E2';
    }

    return { ...baseStyle, ...style };
  };

  return (
    <View
      ref={componentRef}
      style={getZIndexStyle()}
      className={className}
      testID={testID || `z-index-protection-${layer}`}
      accessibilityRole="none"
      accessibilityLabel={`Z-index protection for ${layer} layer`}
    >
      {children}
    </View>
  );
};

export default ZIndexProtection; 