import React from 'react';
import { TouchableOpacity, TouchableOpacityProps } from 'react-native';

import { useTheme } from '../../theme';
import { useAccessibilityProps } from '../../hooks/useAccessibilityProps';

import { Text, TextProps } from './Text';

export interface LinkProps extends Omit<TextProps, 'color'> {
  onPress: () => void;
  disabled?: boolean;
  underline?: boolean;
  children: React.ReactNode;
  touchableProps?: TouchableOpacityProps;
}

export const Link: React.FC<LinkProps> = ({
  onPress,
  disabled = false,
  underline = true,
  children,
  touchableProps,
  style,
  ...props
}) => {
  const { theme } = useTheme();
  const accessibilityProps = useAccessibilityProps({
    role: 'link',
    label: typeof children === 'string' ? children : undefined,
    hint: 'Double tap to activate',
  });

  const linkStyle = {
    textDecorationLine: underline ? ('underline' as const) : ('none' as const),
    color: disabled ? theme.colors.textSecondary : theme.colors.primary,
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
      {...touchableProps}
    >
      <Text
        variant="body"
        weight="medium"
        style={[linkStyle, style]}
        {...accessibilityProps}
        {...props}
      >
        {children}
      </Text>
    </TouchableOpacity>
  );
}; 