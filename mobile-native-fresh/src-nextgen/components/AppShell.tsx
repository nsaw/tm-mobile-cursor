// AppShell.tsx - JSX baseline role prop hydration
import React from 'react';
import { View } from 'react-native';
import type { RoleProps } from '/Users/sawyer/gitSync/tm-mobile-cursor/mobile-native-fresh/src-reference-complete/types/roles';

interface AppShellProps extends RoleProps {
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ layoutRole, contentRole, interactiveRole, children }) => {
  return (
    <View testID="AppShell-Root">
      {children}
    </View>
  );
}; 