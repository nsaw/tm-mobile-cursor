import React from 'react';
import { SafeAreaView } from 'react-native';
import type { ReactNode } from 'react';

type LayoutProps = { children: ReactNode };

export default function LayoutShell({ children }: LayoutProps) {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      {children}
    </SafeAreaView>
  );
} 