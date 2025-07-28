import React from 'react';
import { SafeAreaView } from 'react-native';
import type { ReactNode } from 'react';

// Layout context interface for navigation and theme integration
export interface LayoutContext {
  navigationState?: any;
  currentRoute?: string;
  themeContext?: any;
  userContext?: any;
  appState?: any;
}

type LayoutProps = { 
  children: ReactNode;
  context?: LayoutContext;
  enableContextBridge?: boolean;
};

export default function LayoutShell({ children, context: _context, enableContextBridge: _enableContextBridge }: LayoutProps) {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      {children}
    </SafeAreaView>
  );
} 