import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { BlurView } from 'expo-blur';

interface GlassmorphicContainerProps {
  children: React.ReactNode;
  intensity?: number;
  tint?: 'light' | 'dark' | 'default';
  backgroundColor?: string;
  borderRadius?: number;
  borderTopLeftRadius?: number;
  borderTopRightRadius?: number;
  borderBottomLeftRadius?: number;
  borderBottomRightRadius?: number;
  borderWidth?: number;
  borderColor?: string;
  style?: ViewStyle;
  overflow?: 'visible' | 'hidden' | 'scroll';
}

export const GlassmorphicContainer: React.FC<GlassmorphicContainerProps> = ({
  children,
  intensity = 80,
  tint = 'dark',
  backgroundColor = 'rgba(24, 24, 24, 0.6)',
  borderRadius,
  borderTopLeftRadius,
  borderTopRightRadius,
  borderBottomLeftRadius,
  borderBottomRightRadius,
  borderWidth,
  borderColor,
  style,
  overflow = 'hidden',
}) => {
  return (
    <BlurView 
      intensity={intensity} 
      tint={tint} 
      style={[
        styles.container,
        {
          backgroundColor,
          ...(borderRadius !== undefined ? { borderRadius } : {}),
          ...(borderTopLeftRadius !== undefined ? { borderTopLeftRadius } : {}),
          ...(borderTopRightRadius !== undefined ? { borderTopRightRadius } : {}),
          ...(borderBottomLeftRadius !== undefined ? { borderBottomLeftRadius } : {}),
          ...(borderBottomRightRadius !== undefined ? { borderBottomRightRadius } : {}),
          ...(borderWidth !== undefined ? { borderWidth } : {}),
          ...(borderColor !== undefined ? { borderColor } : {}),
          overflow,
        },
        style,
      ]}
    >
      {children}
    </BlurView>
  );
};

const styles = StyleSheet.create({
  container: {
    // Base glassmorphic styling
  },
}); 