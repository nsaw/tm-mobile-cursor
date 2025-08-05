import React from 'react';
import { View, ViewStyle, Text } from 'react-native';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  _style?: ViewStyle;
}

export const Card: React.FC<CardProps> = ({ children, _style }) => {
  return (
    <View><Text>{children}</Text></View>
  );
}; 
