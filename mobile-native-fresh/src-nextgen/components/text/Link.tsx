import React from 'react';
import { TouchableOpacity, TouchableOpacityProps } from 'react-native';
import { Text, TextPropsExtended } from './Text';
import { useTheme } from '../../hooks/useTheme';
import { useAccessibilityProps } from '../../hooks/useAccessibilityProps';

export interface LinkProps extends Omit<TextPropsExtended, 'color' | 'role'> {
  onPress: () => void;
  disabled?: boolean;
  underline?: boolean;
  children: React.ReactNode;
  touchableProps?: TouchableOpacityProps;
  role?: 'text' | 'label';
}

export const Link: React.FC<LinkProps> = ({
  onPress,
  disabled = false,
  underline = true,
  children,
  touchableProps,
  style,
  role = 'text',
  ...props
}) => {
  const theme = useTheme();
  const accessibilityProps = useAccessibilityProps({
    role: 'button',
    label: typeof children === 'string' ? children : undefined,
    hint: 'Double tap to activate',
  });

  const linkStyle = {
    textDecorationLine: underline ? ('underline' as const) : ('none' as const),
    color: disabled ? theme.colors.textSecondary : theme.colors.accent,
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
      {...touchableProps}
     accessibilityRole="button" accessible={true} accessibilityLabel="Button">
      <Text
        variant="body"
        weight="medium"
        role={role}
        style={[linkStyle, style]}
        {...accessibilityProps}
        {...props}
      >
        {children}
      </Text>
    </TouchableOpacity>
  );
}; 