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
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContent: {
      backgroundColor: designTokens.colors.surface,
      borderRadius: designTokens.radius.lg,
      padding: designTokens.spacing.xl,
      margin: designTokens.spacing.lg,
      width: width - designTokens.spacing.lg * 2,
      maxWidth: 400,
    },
    title: {
      fontSize: designTokens.typography.fontSize.lg,
      fontWeight: '600',
      color: designTokens.colors.text,
      marginBottom: designTokens.spacing.sm,
      textAlign: 'center',
    },
    message: {
      fontSize: designTokens.typography.fontSize.body,
      color: designTokens.colors.textSecondary,
      marginBottom: designTokens.spacing.xl,
      textAlign: 'center',
      lineHeight: 20,
    },
    buttonRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: designTokens.spacing.md,
    },
    button: {
      flex: 1,
      paddingVertical: designTokens.spacing.md,
      borderRadius: designTokens.radius.md,
      alignItems: 'center',
      justifyContent: 'center',
    },
    cancelButton: {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: designTokens.colors.border,
    },
    confirmButton: {
      backgroundColor: designTokens.colors.accent,
      borderWidth: 1,
      borderColor: designTokens.colors.accent,
    },
    dangerButton: {
      backgroundColor: designTokens.colors.danger,
      borderColor: designTokens.colors.danger,
    },
    buttonText: {
      fontSize: designTokens.typography.fontSize.body,
      fontWeight: '600',
    },
    cancelButtonText: {
      color: designTokens.colors.textSecondary,
    },
    confirmButtonText: {
      color: designTokens.colors.background,
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