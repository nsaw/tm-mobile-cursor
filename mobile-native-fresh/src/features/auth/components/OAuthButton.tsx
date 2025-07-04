import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useTheme } from '../../../theme/ThemeProvider';

interface OAuthButtonProps {
  provider: 'google' | 'apple';
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
}

export const OAuthButton: React.FC<OAuthButtonProps> = ({
  provider,
  onPress,
  disabled = false,
  loading = false,
}) => {
  const { tokens } = useTheme();

  const styles = StyleSheet.create({
    button: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: tokens.spacing.md,
      paddingHorizontal: tokens.spacing.lg,
      borderRadius: tokens.radius.md,
      backgroundColor: provider === 'google' ? tokens.colors.surface : tokens.colors.background,
      borderWidth: 1,
      borderColor: provider === 'google' ? tokens.colors.border : 'transparent',
      opacity: disabled ? 0.6 : 1,
    },
    icon: {
      marginRight: tokens.spacing.sm,
    },
    text: {
      fontSize: tokens.typography.fontSize.body,
      fontWeight: tokens.typography.fontWeight.semibold,
      color: provider === 'google' ? tokens.colors.text : tokens.colors.text,
    },
  });

  const getProviderConfig = () => {
    switch (provider) {
      case 'google':
        return {
          icon: 'logo-google',
          text: 'Continue with Google',
        };
      case 'apple':
        return {
          icon: 'logo-apple',
          text: 'Continue with Apple',
        };
      default:
        return {
          icon: 'help-circle',
          text: 'Continue',
        };
    }
  };

  const config = getProviderConfig();

  return (
    <TouchableOpacity
      style={styles.button}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      accessibilityRole="button" 
      accessible={true} 
      accessibilityLabel="Button"
    >
      <Ionicons
        name={loading ? 'hourglass-outline' : config.icon as any}
        size={20}
        color={provider === 'google' ? '#000' : '#fff'}
        style={styles.icon}
      />
      <Text style={styles.text}>
        {loading ? 'Loading...' : config.text}
      </Text>
    </TouchableOpacity>
  );
};