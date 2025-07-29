import React from 'react';

import { Text, TextProps } from './Text';

export interface HeadingProps extends Omit<TextProps, 'variant'> {
  level: 1 | 2 | 3 | 4 | 5 | 6;
  children: React.ReactNode;
}

export const Heading: React.FC<HeadingProps> = ({ level, children, ...props }) => {
  const getVariant = (level: number): TextProps['variant'] => {
    switch (level) {
      case 1: return 'h1';
      case 2: return 'h2';
      case 3: return 'h3';
      case 4: return 'h4';
      case 5: return 'h5';
      case 6: return 'h6';
      default: return 'h1';
    }
  };

  const getDefaultWeight = (level: number): TextProps['weight'] => {
    return level <= 3 ? 'bold' : 'semibold';
  };

  return (
    <Text
      variant={getVariant(level)}
      weight={props.weight || getDefaultWeight(level)}
      {...props}
    >
      {children}
    </Text>
  );
}; 