import React from 'react';
import { View, ViewProps } from 'react-native';

interface AutoRoleViewProps extends ViewProps {
  role?: string;
}

export const AutoRoleView: React.FC<AutoRoleViewProps> = ({ role, children, style, ...props }) => {
  return (
    <View 
      style={style} 
      {...props}
    >
      {children}
    </View>
  );
};

export default AutoRoleView; 