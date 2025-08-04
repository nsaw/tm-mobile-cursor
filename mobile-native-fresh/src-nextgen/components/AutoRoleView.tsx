import React from 'react';
import { View, ViewProps } from 'react-native';
import { ComponentRole } from '../shell/wrappers/types';

interface AutoRoleViewProps extends Omit<ViewProps, 'role'> {
  role?: ComponentRole;
}

export const AutoRoleView: React.FC<AutoRoleViewProps> = ({ role, children, style, ...props }) => {
  return (
    <View 
      style={style} 
      accessibilityRole={role as any}
      {...props}
    >
      {children}
    </View>
  );
};

export default AutoRoleView; 