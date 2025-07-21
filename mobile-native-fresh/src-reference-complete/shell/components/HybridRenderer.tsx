import React from 'react';
import { View, ViewProps } from 'react-native';

export interface HybridRendererProps extends ViewProps {
  children: React.ReactNode;
  environment?: 'legacy' | 'nextgen';
}

export const HybridRenderer: React.FC<HybridRendererProps> = ({ 
  children, 
  environment = 'nextgen',
  ...props 
}) => {
  return (
    <View {...props} accessibilityRole="none">
      {children}
    </View>
  );
}; 