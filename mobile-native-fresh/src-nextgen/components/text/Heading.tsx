import React from 'react';
import { Text, TextPropsExtended } from './Text';

export interface HeadingProps extends Omit<TextPropsExtended, 'variant'> {
  level: 1 | 2 | 3 | 4 | 5 | 6;
  children: React.ReactNode;
}

export const Heading: React.FC<HeadingProps> = ({ level, children, ...props }) => {
  const getVariant = (level: number): TextPropsExtended['variant'] => {
    switch (level) {
      case 1: return 'h1';
      case 2: return 'h2';
      case 3: return 'h3';
      default: return 'h1';
    }
  };

  const getDefaultWeight = (level: number): TextPropsExtended['weight'] => {
    return level <= 3 ? 'bold' : '600';
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