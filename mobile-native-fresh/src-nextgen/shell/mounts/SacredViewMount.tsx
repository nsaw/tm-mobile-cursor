import React from 'react';
import { View, ViewStyle } from 'react-native';

export interface SacredViewMountProps {
  children: React.ReactNode;
  mountId: string;
  style?: ViewStyle;
  testID?: string;
}

/**
 * SacredViewMount - Protected mount point for sacred components
 * 
 * This component provides a protected mount point for components that should
 * not be wrapped with role assignments. Sacred components maintain their
 * original behavior and are isolated from the role system.
 * 
 * Usage:
 * <SacredViewMount mountId="bottom-nav">
 *   <BottomNavigation />
 * </SacredViewMount>
 */
export const SacredViewMount: React.FC<SacredViewMountProps> = ({
  children,
  mountId,
  style,
  testID,
}) => {
  return (
    <View
      style={[
        {
          position: 'relative',
          zIndex: 1000, // High z-index to ensure sacred components stay on top
        },
        style,
      ]}
      testID={`sacred-mount-${mountId}`}
      accessibilityLabel={`Sacred mount point: ${mountId}`}
    >
      {children}
    </View>
  );
};

export default SacredViewMount; 