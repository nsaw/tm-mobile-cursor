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
  const { tokens: designTokens } = useTheme();

  const styles = StyleSheet.create({
    button: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: designTokens.spacing.md,
      paddingHorizontal: designTokens.spacing.lg,
      borderRadius: designTokens.radius.md,
      backgroundColor: provider === 'google' ? designTokens.colors.surface : designTokens.colors.background,
      borderWidth: 1,
      borderColor: provider === 'google' ? designTokens.colors.border : 'transparent',
      opacity: disabled ? 0.6 : 1,
    },
    icon: {
      marginRight: designTokens.spacing.sm,
    },
    text: {
      fontSize: designTokens.typography.fontSize.body,
      fontWeight: designTokens.typography.fontWeight.semibold,
      color: provider === 'google' ? designTokens.colors.text : designTokens.colors.text,
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