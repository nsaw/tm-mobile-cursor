import React from 'react';
import { TouchableOpacity, View, Animated, ViewStyle } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';

export interface SwitchProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  style?: ViewStyle;
  accessibilityLabel?: string;
  accessibilityHint?: string;
}

export const Switch: React.FC<SwitchProps> = ({
  value,
  onValueChange,
  disabled = false,
  size = 'md',
  style,
  accessibilityLabel,
  accessibilityHint,
}) => {
  const { tokens: designTokens } = useTheme();
  const animatedValue = React.useRef(new Animated.Value(value ? 1 : 0)).current;

  React.useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: value ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [value, animatedValue]);

  const getSwitchStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      borderRadius: 20,
      backgroundColor: value ? designTokens.colors.primary : designTokens.colors.border,
      justifyContent: 'center',
      alignItems: 'center',
    };

    const sizeStyles: Record<string, ViewStyle> = {
      sm: {
        width: 36,
        height: 20,
      },
      md: {
        width: 44,
        height: 24,
      },
      lg: {
        width: 52,
        height: 28,
      },
    };

    const disabledStyle: ViewStyle = disabled ? {
      opacity: 0.5,
    } : {};

    return {
      ...baseStyle,
      ...sizeStyles[size],
      ...disabledStyle,
      ...style,
    };
  };

  const getThumbStyle = (): ViewStyle => {
    const baseThumbStyle: ViewStyle = {
      backgroundColor: '#FFFFFF',
      borderRadius: 10,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    };

    const sizeThumbStyles: Record<string, ViewStyle> = {
      sm: {
        width: 16,
        height: 16,
      },
      md: {
        width: 20,
        height: 20,
      },
      lg: {
        width: 24,
        height: 24,
      },
    };

    const translateX = animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [2, size === 'sm' ? 18 : size === 'md' ? 22 : 26],
    });

    return {
      ...baseThumbStyle,
      ...sizeThumbStyles[size],
      transform: [{ translateX }],
    };
  };

  const handlePress = () => {
    if (!disabled) {
      onValueChange(!value);
    }
  };

  return (
    <TouchableOpacity
      style={getSwitchStyle()}
      onPress={handlePress}
      disabled={disabled}
      accessibilityRole="switch"
      accessibilityLabel={accessibilityLabel || `Switch ${value ? 'on' : 'off'}`}
      accessibilityHint={accessibilityHint || `Double tap to ${value ? 'turn off' : 'turn on'}`}
      accessibilityState={{ checked: value, disabled }}
    >
      <Animated.View style={getThumbStyle()} />
    </TouchableOpacity>
  );
}; 