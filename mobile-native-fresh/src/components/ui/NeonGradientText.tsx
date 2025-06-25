import React from 'react';
import { StyleSheet, TextStyle } from 'react-native';

import { useTheme } from '../../theme/ThemeProvider';
import { Text } from './Text';

interface NeonGradientTextProps {
  children: React.ReactNode;
  style?: TextStyle;
  variant?: 'tagline' | 'body' | 'heading' | 'title' | 'subtitle' | 'caption' | 'muted';
}

export const NeonGradientText: React.FC<NeonGradientTextProps> = ({ 
  children, 
  style,
  variant = 'tagline'
}) => {
  const { tokens } = useTheme();

  const neonStyle: TextStyle = {
    ...tokens.typography.tagline, // Use tagline variant from tokens
    color: '#C6D600',
    // Remove glow effects for tagline variant
    ...style,
  };

  return (
    <Text
      variant={variant}
      style={neonStyle}
    >
      {children}
    </Text>
  );
};

const getStyles = (tokens: any) => StyleSheet.create({
  neonText: {
    fontSize: tokens.typography.fontSize.sm, // Use tagline variant size
    fontWeight: tokens.typography.fontWeight.medium, // Medium weight for tagline
    fontFamily: tokens.typography.fontFamily.body,
    color: '#C6D600', // Use the accent color directly
    textShadowColor: '#C6D600',
    textShadowOffset: { width: 1, height: 1 }, // 45deg angle (1,1)
    textShadowRadius: 2,
    letterSpacing: 0.2,
  },
}); 