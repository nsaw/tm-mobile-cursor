import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  View,
} from 'react-native';
import { designTokens } from '../../../theme/tokens';

interface OAuthButtonProps {
  provider: 'google' | 'apple';
  onPress: () => void;
  loading?: boolean;
  text?: string;
}

export const OAuthButton: React.FC<OAuthButtonProps> = ({ 
  provider, 
  onPress, 
  loading = false,
  text 
}) => {
  const getButtonStyle = () => {
    switch (provider) {
      case 'google':
        return [styles.button, styles.googleButton];
      case 'apple':
        return [styles.button, styles.appleButton];
      default:
        return styles.button;
    }
  };

  const getTextStyle = () => {
    switch (provider) {
      case 'google':
        return [styles.buttonText, styles.googleText];
      case 'apple':
        return [styles.buttonText, styles.appleText];
      default:
        return styles.buttonText;
    }
  };

  const getIcon = () => {
    switch (provider) {
      case 'google':
        return 'G';
      case 'apple':
        return '';
      default:
        return '';
    }
  };

  const getDefaultText = () => {
    switch (provider) {
      case 'google':
        return 'Sign in with Google';
      case 'apple':
        return 'Sign in with Apple';
      default:
        return 'Sign in';
    }
  };

  return (
    <TouchableOpacity
      style={[getButtonStyle(), loading && styles.buttonDisabled]}
      onPress={onPress}
      disabled={loading}
      accessibilityRole="button"
      accessibilityLabel={text || getDefaultText()}
    >
      {loading ? (
        <ActivityIndicator 
          color={provider === 'apple' ? '#ffffff' : '#1a1a1a'} 
        />
      ) : (
        <View style={styles.buttonContent}>
          <Text style={styles.icon}>{getIcon()}</Text>
          <Text style={getTextStyle()}>
            {text || getDefaultText()}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: designTokens.radius.md,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 6,
    minHeight: 52,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  icon: {
    fontSize: 18,
    marginRight: 12,
    width: 20,
    textAlign: 'center',
  },
  googleButton: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#dadce0',
  },
  googleText: {
    color: '#1a1a1a',
  },
  appleButton: {
    backgroundColor: '#000000',
  },
  appleText: {
    color: '#ffffff',
  },
});