import React from 'react';
import { View, ViewProps } from 'react-native';
import { ShellRole } from '../types';

export interface SacredViewMountProps {
  role: ShellRole;
  children: React.ReactNode;
  style?: any;
  accessibilityRole?: any;
  accessibilityLabel?: string;
  [key: string]: any; // Allow other props
}

export const SacredViewMount: React.FC<SacredViewMountProps> = ({ 
  role, 
  children, 
  style,
  accessibilityRole,
  accessibilityLabel,
  ...props 
}) => {
  return (
    <View 
      {...props} 
      style={style}
      accessibilityRole={role as any}
      accessibilityLabel={accessibilityLabel}
    >
      {children}
    </View>
  );
}; 