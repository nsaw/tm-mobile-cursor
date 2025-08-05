import React from 'react';

export interface BaseComponentProps {
  children?: React.ReactNode;
  style?: React.CSSProperties | Record<string, unknown>;
  className?: string;
  testID?: string;
  accessibilityLabel?: string;
  accessibilityRole?: string;
  accessibilityHint?: string;
}

export interface ButtonProps extends BaseComponentProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
}

export interface InputProps extends BaseComponentProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  multiline?: boolean;
  numberOfLines?: number;
  error?: string;
}

export interface CardProps extends BaseComponentProps {
  title?: string;
  subtitle?: string;
  image?: string;
  onPress?: () => void;
  elevation?: number;
}

export interface ModalProps extends BaseComponentProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  showCloseButton?: boolean;
  animationType?: 'none' | 'slide' | 'fade';
}

export interface ListItemProps extends BaseComponentProps {
  title: string;
  subtitle?: string;
  leftIcon?: string;
  rightIcon?: string;
  onPress?: () => void;
  chevron?: boolean;
}

export interface AvatarProps extends BaseComponentProps {
  source?: string;
  size?: number;
  fallback?: string;
  shape?: 'circle' | 'square';
}

export interface BadgeProps extends BaseComponentProps {
  count: number;
  maxCount?: number;
  showZero?: boolean;
  color?: string;
}

export interface DividerProps extends BaseComponentProps {
  orientation?: 'horizontal' | 'vertical';
  color?: string;
  thickness?: number;
}

export interface SpinnerProps extends BaseComponentProps {
  size?: 'small' | 'large';
  color?: string;
  animating?: boolean;
}

export interface SwitchProps extends BaseComponentProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
  trackColor?: {
    false?: string;
    true?: string;
  };
  thumbColor?: string;
} 