import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';
import { IconWrapper } from '../infrastructure/IconWrapper';
import { useTheme } from '../theme/ThemeProvider';

export interface BiometricButtonProps {
  onPress: () => void;
  type: 'fingerprint' | 'face';
  disabled?: boolean;
  style?: ViewStyle;
}

export const BiometricButton: React.FC<BiometricButtonProps> = ({
  onPress,
  type,
  disabled = false,
  style
}) => {
  const { theme } = useTheme();

  const buttonStyle = [
    styles.button,
    { backgroundColor: theme.colors.primary },
    disabled && { opacity: 0.5 },
    style
  ];

  const textStyle = [
    styles.text,
    { color: theme.colors.text }
  ];

  const iconName = type === 'fingerprint' ? 'fingerprint' : 'face';
  const label = type === 'fingerprint' ? 'Use Fingerprint' : 'Use Face ID';

  return (
    <TouchableOpacity
      style={buttonStyle}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
    >
      <IconWrapper
        name="MaterialCommunityIcons"
        iconName={iconName}
        size={24}
        color={theme.colors.text}
        style={styles.icon}
      />
      <Text style={textStyle}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    marginVertical: 8,
  },
  icon: {
    marginRight: 8,
  },
  text: {
    fontSize: 16,
    fontWeight: '500',
  },
}); 