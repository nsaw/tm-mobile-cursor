import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme/ThemeProvider';

interface AlertButton {
  text: string;
  onPress?: () => void;
  style?: 'default' | 'cancel' | 'destructive';
}

interface DarkAlertDialogProps {
  visible: boolean;
  title: string;
  message: string;
  buttons: AlertButton[];
  onDismiss?: () => void;
}

export const DarkAlertDialog: React.FC<DarkAlertDialogProps> = ({
  visible,
  title,
  message,
  buttons,
  onDismiss,
}) => {
  const { tokens } = useTheme();

  const handleButtonPress = (button: AlertButton) => {
    if (button.onPress) {
      button.onPress();
    }
    if (onDismiss) {
      onDismiss();
    }
  };

  const getButtonStyle = (style?: string) => {
    switch (style) {
      case 'destructive':
        return {
          backgroundColor: tokens.colors.danger,
          borderColor: tokens.colors.danger,
        };
      case 'cancel':
        return {
          backgroundColor: 'transparent',
          borderColor: tokens.colors.border,
        };
      default:
        return {
          backgroundColor: tokens.colors.accent,
          borderColor: tokens.colors.accent,
        };
    }
  };

  const getButtonTextStyle = (style?: string) => {
    switch (style) {
      case 'destructive':
        return { color: '#FFFFFF' };
      case 'cancel':
        return { color: tokens.colors.textSecondary };
      default:
        return { color: '#FFFFFF' };
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onDismiss}
    >
      <View style={styles.overlay}>
        <View style={[styles.container, { backgroundColor: tokens.colors.backgroundSecondary }]}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: tokens.colors.text }]}>{title}</Text>
            <Text style={[styles.message, { color: tokens.colors.textSecondary }]}>{message}</Text>
          </View>
          
          <View style={styles.buttonContainer}>
            {buttons.map((button, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.button,
                  getButtonStyle(button.style),
                  index < buttons.length - 1 && styles.buttonMargin
                ]}
                onPress={() => handleButtonPress(button)}
                activeOpacity={0.7}
              >
                <Text style={[styles.buttonText, getButtonTextStyle(button.style)]}>
                  {button.text}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  container: {
    width: '100%',
    maxWidth: 320,
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  message: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonMargin: {
    marginRight: 8,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '500',
  },
}); 