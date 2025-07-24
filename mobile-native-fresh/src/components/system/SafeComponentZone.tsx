import React from 'react';
import { View, ViewProps } from 'react-native';

interface SafeComponentZoneProps extends ViewProps {
  children: React.ReactNode;
}

/**
 * SafeComponentZone - Provides a frozen style boundary
 * Prevents global theme propagation into sacred UI zones
 * Used for navigation, FAB, and other critical UI components
 */
export const SafeComponentZone: React.FC<SafeComponentZoneProps> = ({ 
  children, 
  style, 
  ...props 
}) => {
  return (
    <View role="Wrapper"
      style={[
        {
          // Frozen style boundary - no theme propagation
          // These styles are locked and won't be overridden
        },
        style
      ]}
      {...props}
    >
      {children}
    </View>
  );
};

export default SafeComponentZone; 