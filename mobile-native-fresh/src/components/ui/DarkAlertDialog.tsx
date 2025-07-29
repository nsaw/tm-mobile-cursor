import { Text ,
  View,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Dimensions,
} from 'react-native';
import React from 'react';

import { useTheme } from '../../theme/ThemeProvider';

interface DarkAlertDialogProps {
  visible: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  type?: 'danger' | 'warning' | 'info';
}

const { width } = Dimensions.get('window');

export const DarkAlertDialog: React.FC<DarkAlertDialogProps> = ({
  visible,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  type = 'info',
}) => {
  const { tokens: designTokens } = useTheme();

  const styles = StyleSheet.create({
    button: {
      alignItems: 'center',
      borderRadius: designTokens.radius.md,
      flex: 1,
      justifyContent: 'center',
      paddingVertical: designTokens.spacing.md,
    },
    buttonRow: {
      flexDirection: 'row',
      gap: designTokens.spacing.md,
      justifyContent: 'space-between',
    },
    buttonText: {
      fontSize: designTokens.typography.fontSize.body,
      fontWeight: '600',
    },
    cancelButton: {
      backgroundColor: 'transparent',
      borderColor: designTokens.colors.border,
      borderWidth: 1,
    },
    cancelButtonText: {
      color: designTokens.colors.textSecondary,
    },
    confirmButton: {
      backgroundColor: designTokens.colors.accent,
      borderColor: designTokens.colors.accent,
      borderWidth: 1,
    },
    confirmButtonText: {
      color: designTokens.colors.background,
    },
    dangerButton: {
      backgroundColor: designTokens.colors.danger,
      borderColor: designTokens.colors.danger,
    },
    message: {
      color: designTokens.colors.textSecondary,
      fontSize: designTokens.typography.fontSize.body,
      lineHeight: 20,
      marginBottom: designTokens.spacing.xl,
      textAlign: 'center',
    },
    modalContent: {
      backgroundColor: designTokens.colors.surface,
      borderRadius: designTokens.radius.lg,
      margin: designTokens.spacing.lg,
      maxWidth: 400,
      padding: designTokens.spacing.xl,
      width: width - designTokens.spacing.lg * 2,
    },
    modalOverlay: {
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      flex: 1,
      justifyContent: 'center',
    },
    title: {
      color: designTokens.colors.text,
      fontSize: designTokens.typography.fontSize.lg,
      fontWeight: '600',
      marginBottom: designTokens.spacing.sm,
      textAlign: 'center',
    },
  });

  const getButtonStyle = () => {
    if (type === 'danger') {
      return styles.dangerButton;
    }
    return styles.confirmButton;
  };

  const getIconColor = () => {
    switch (type) {
      case 'danger':
        return designTokens.colors.danger;
      case 'warning':
        return designTokens.colors.warning;
      default:
        return designTokens.colors.textSecondary;
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
     accessible={false} accessibilityLabel="Modal">
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, { backgroundColor: designTokens.colors.backgroundSecondary }]}>
          <Text style={[styles.title, { color: designTokens.colors.text }]}>{title}</Text>
          <Text style={[styles.message, { color: designTokens.colors.textSecondary }]}>{message}</Text>
          
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={onCancel}
             accessibilityRole="button" accessible={true} accessibilityLabel="Button">
              <Text style={[styles.buttonText, styles.cancelButtonText]}>
                {cancelText}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.button, getButtonStyle()]}
              onPress={onConfirm}
             accessibilityRole="button" accessible={true} accessibilityLabel="Button">
              <Text style={[styles.buttonText, styles.confirmButtonText]}>
                {confirmText}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}; 