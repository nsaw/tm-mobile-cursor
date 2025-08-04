import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';

export interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'outlined';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  style?: ViewStyle;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  padding = 'md',
  style
}) => {
  const getPaddingStyle = () => {
    switch (padding) {
      case 'none': return styles.paddingNone;
      case 'sm': return styles.paddingSm;
      case 'md': return styles.paddingMd;
      case 'lg': return styles.paddingLg;
      default: return styles.paddingMd;
    }
  };

  const cardStyle = [
    styles.card,
    styles[variant],
    getPaddingStyle(),
    style
  ];

  return (
    <View style={cardStyle}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
  },
  default: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  elevated: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 8,
  },
  outlined: {
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  paddingNone: {
    padding: 0,
  },
  paddingSm: {
    padding: 8,
  },
  paddingMd: {
    padding: 16,
  },
  paddingLg: {
    padding: 24,
  },
}); 