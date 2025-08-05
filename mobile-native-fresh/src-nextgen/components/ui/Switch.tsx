import React, { useState } from 'react';
import { TouchableOpacity, StyleSheet, Animated } from 'react-native';

export interface SwitchProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const Switch: React.FC<SwitchProps> = ({
  value,
  onValueChange,
  disabled = false,
  size = 'md'
}) => {
  const [animatedValue] = useState(new Animated.Value(value ? 1 : 0));

  const handlePress = () => {
    if (disabled) return;
    
    const newValue = !value;
    onValueChange(newValue);
    
    Animated.timing(animatedValue, {
      toValue: newValue ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const switchStyle = [
    styles.switch,
    styles[size],
    value && styles.active,
    disabled && styles.disabled
  ];

  const thumbStyle = [
    styles.thumb,
    styles[`${size}Thumb`],
    {
      transform: [{
        translateX: animatedValue.interpolate({
          inputRange: [0, 1],
          outputRange: [2, size === 'sm' ? 14 : size === 'md' ? 18 : 22],
        }),
      }],
    },
  ];

  return (
    <TouchableOpacity
      style={switchStyle}
      onPress={handlePress}
      disabled={disabled}
      activeOpacity={0.8}
     accessibilityRole="button" accessible={true} accessibilityLabel="Button">
      <Animated.View style={thumbStyle} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  switch: {
    backgroundColor: '#E5E5EA',
    borderRadius: 20,
    justifyContent: 'center',
  },
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
  active: {
    backgroundColor: '#007AFF',
  },
  disabled: {
    opacity: 0.5,
  },
  thumb: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 2,
  },
  smThumb: {
    width: 16,
    height: 16,
  },
  mdThumb: {
    width: 20,
    height: 20,
  },
  lgThumb: {
    width: 24,
    height: 24,
  },
}); 