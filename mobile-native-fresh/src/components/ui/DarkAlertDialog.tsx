import { Text ,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Dimensions,
} from 'react-native';
import React from 'react';

import { useTheme } from '../../theme/ThemeProvider';
import AutoRoleView from '../wrappers/AutoRoleView';

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
  const { tokens } = useTheme();

  const styles = StyleSheet.create({
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContent: {
      backgroundColor: tokens.colors.surface,
      borderRadius: tokens.radius.lg,
      padding: tokens.spacing.xl,
      margin: tokens.spacing.lg,
      width: width - tokens.spacing.lg * 2,
      maxWidth: 400,
    },
    title: {
      fontSize: tokens.typography.fontSize.lg,
      fontWeight: '600',
      color: tokens.colors.text,
      marginBottom: tokens.spacing.sm,
      textAlign: 'center',
    },
    message: {
      fontSize: tokens.typography.fontSize.body,
      color: tokens.colors.textSecondary,
      marginBottom: tokens.spacing.xl,
      textAlign: 'center',
      lineHeight: 20,
    },
    buttonRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: tokens.spacing.md,
    },
    button: {
      flex: 1,
      paddingVertical: tokens.spacing.md,
      borderRadius: tokens.radius.md,
      alignItems: 'center',
      justifyContent: 'center',
    },
    cancelButton: {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: tokens.colors.border,
    },
    confirmButton: {
      backgroundColor: tokens.colors.accent,
      borderWidth: 1,
      borderColor: tokens.colors.accent,
    },
    dangerButton: {
      backgroundColor: tokens.colors.danger,
      borderColor: tokens.colors.danger,
    },
    buttonText: {
      fontSize: tokens.typography.fontSize.body,
      fontWeight: '600',
    },
    cancelButtonText: {
      color: tokens.colors.textSecondary,
    },
    confirmButtonText: {
      color: tokens.colors.background,
    },
  });

  const getButtonStyle = () => {
    if (type === 'danger') {
      return styles.dangerButton;
    }
    return styles.confirmButton;
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
     accessible={false} >
      <AutoRoleView style={styles.modalOverlay} forceRole="modal">
        <AutoRoleView style={[styles.modalContent, { backgroundColor: tokens.colors.backgroundSecondary }]} forceRole="card">
          <Text style={[styles.title, { color: tokens.colors.text }]}>{title}</Text>
          <Text style={[styles.message, { color: tokens.colors.textSecondary }]}>{message}</Text>
          
          <AutoRoleView style={styles.buttonRow} forceRole="section">
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={onCancel}
             accessibilityRole="button" accessible={true} >
              <Text style={[styles.buttonText, styles.cancelButtonText]}>
                {cancelText}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.button, getButtonStyle()]}
              onPress={onConfirm}
             accessibilityRole="button" accessible={true} >
              <Text style={[styles.buttonText, styles.confirmButtonText]}>
                {confirmText}
              </Text>
            </TouchableOpacity>
          </AutoRoleView>
        </AutoRoleView>
      </AutoRoleView>
    </Modal>
  );
}; 