import React from 'react';
import { View, ViewStyle, Text } from 'react-native';

export interface SacredViewMountProps {
  children: React.ReactNode;
  mountId: string;
  style?: ViewStyle;
  testID?: string;
  _mountId?: string;
  _style?: ViewStyle;
  _testID?: string;
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
  _mountId,
  _style,
  testID: _testID,
}) => {
  return (
    <View><Text>{children}</Text></View>
  );
};

export default SacredViewMount; 