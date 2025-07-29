import { ReactNode } from 'react';
import { ViewStyle, TextStyle, ImageStyle } from 'react-native';

export interface BaseComponentProps {
  children?: ReactNode;
  style?: ViewStyle | TextStyle | ImageStyle;
  testID?: string;
  accessible?: boolean;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  accessibilityRole?: string;
}

export interface LayoutProps extends BaseComponentProps {
  flex?: number;
  flexDirection?: 'row' | 'column';
  justifyContent?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around';
  alignItems?: 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline';
  padding?: number;
  margin?: number;
  width?: number | string;
  height?: number | string;
}

export interface InteractiveProps extends BaseComponentProps {
  onPress?: () => void;
  onLongPress?: () => void;
  disabled?: boolean;
  loading?: boolean;
  pressed?: boolean;
}

export interface FormFieldProps extends BaseComponentProps {
  value?: string | number;
  onChange?: (value: string | number) => void;
  onBlur?: () => void;
  onFocus?: () => void;
  placeholder?: string;
  error?: string;
  required?: boolean;
  maxLength?: number;
  keyboardType?: 'default' | 'numeric' | 'email-address' | 'phone-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  autoCorrect?: boolean;
  secureTextEntry?: boolean;
} 