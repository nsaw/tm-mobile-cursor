import { useState } from 'react';
import { ThemeColors } from '../types/theme';

export interface ThemeState {
  theme: 'light' | 'dark';
  colors: ThemeColors;
  styles: {
    screenContainer: any;
    input: any;
    binItem: any;
    binTitle: any;
    binOwner: any;
    binPrivacyRow: any;
    binPrivacyLabel: any;
    inviteButton: any;
    inviteLabel: any;
    searchBar: any;
    voiceButton: any;
    voiceLabel: any;
    searchItem: any;
    detailHeader: any;
    detailTitle: any;
    actionButtons: any;
    editButton: any;
    editButtonText: any;
    shareButton: any;
    shareButtonText: any;
    deleteButton: any;
    deleteButtonText: any;
    saveButton: any;
    saveButtonText: any;
    cancelButton: any;
    cancelButtonText: any;
    detailContent: any;
    editTitleInput: any;
    editContentInput: any;
    detailTitleText: any;
    detailContentText: any;
    detailDate: any;
    loadingText: any;
    createTitle: any;
    formSection: any;
    label: any;
    textArea: any;
    switchRow: any;
    helpText: any;
    createButton: any;
    createButtonDisabled: any;
    createButtonText: any;
  };
}

export function useTheme(): ThemeState {
  const [theme] = useState<'light' | 'dark'>('light');

  const colors: ThemeColors = theme === 'light' ? {
    background: '#FFFFFF',
    surface: '#F8F9FA',
    text: '#1A1A1A',
    textSecondary: '#6C757D',
    primary: '#007AFF',
    error: '#DC3545',
    border: '#DEE2E6',
  } : {
    background: '#1A1A1A',
    surface: '#2D2D2D',
    text: '#FFFFFF',
    textSecondary: '#ADB5BD',
    primary: '#0A84FF',
    error: '#FF453A',
    border: '#404040',
  };

  const styles = {
    screenContainer: {
      flex: 1,
      backgroundColor: colors.background,
      padding: 16,
    },
    input: {
      flex: 1,
      height: 44,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 8,
      paddingHorizontal: 12,
      fontSize: 16,
      color: colors.text,
      backgroundColor: colors.surface,
    },
    binItem: {
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      backgroundColor: colors.surface,
      marginBottom: 8,
      borderRadius: 8,
    },
    binTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 4,
    },
    binOwner: {
      fontSize: 14,
      color: colors.textSecondary,
      marginBottom: 8,
    },
    binPrivacyRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 8,
    },
    binPrivacyLabel: {
      fontSize: 14,
      color: colors.text,
    },
    inviteButton: {
      backgroundColor: colors.primary,
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 6,
      alignSelf: 'flex-start',
    },
    inviteLabel: {
      color: '#FFFFFF',
      fontSize: 14,
      fontWeight: '500',
    },
    searchBar: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 16,
      gap: 8,
    },
    voiceButton: {
      backgroundColor: colors.primary,
      width: 44,
      height: 44,
      borderRadius: 22,
      justifyContent: 'center',
      alignItems: 'center',
    },
    voiceLabel: {
      fontSize: 20,
      color: '#FFFFFF',
    },
    searchItem: {
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      fontSize: 16,
      color: colors.text,
    },
    detailHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
    },
    detailTitle: {
      fontSize: 24,
      fontWeight: '700',
      color: colors.text,
    },
    actionButtons: {
      flexDirection: 'row',
      gap: 8,
    },
    editButton: {
      backgroundColor: colors.primary,
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 6,
    },
    editButtonText: {
      color: '#FFFFFF',
      fontSize: 14,
      fontWeight: '500',
    },
    shareButton: {
      backgroundColor: colors.primary,
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 6,
    },
    shareButtonText: {
      color: '#FFFFFF',
      fontSize: 14,
      fontWeight: '500',
    },
    deleteButton: {
      backgroundColor: colors.error,
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 6,
    },
    deleteButtonText: {
      color: '#FFFFFF',
      fontSize: 14,
      fontWeight: '500',
    },
    saveButton: {
      backgroundColor: colors.primary,
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 6,
    },
    saveButtonText: {
      color: '#FFFFFF',
      fontSize: 14,
      fontWeight: '500',
    },
    cancelButton: {
      backgroundColor: colors.textSecondary,
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 6,
    },
    cancelButtonText: {
      color: '#FFFFFF',
      fontSize: 14,
      fontWeight: '500',
    },
    detailContent: {
      flex: 1,
    },
    editTitleInput: {
      height: 44,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 8,
      paddingHorizontal: 12,
      fontSize: 18,
      fontWeight: '600',
      color: colors.text,
      backgroundColor: colors.surface,
      marginBottom: 16,
    },
    editContentInput: {
      minHeight: 120,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 8,
      paddingHorizontal: 12,
      paddingVertical: 12,
      fontSize: 16,
      color: colors.text,
      backgroundColor: colors.surface,
      textAlignVertical: 'top',
    },
    detailTitleText: {
      fontSize: 24,
      fontWeight: '700',
      color: colors.text,
      marginBottom: 16,
    },
    detailContentText: {
      fontSize: 16,
      lineHeight: 24,
      color: colors.text,
      marginBottom: 16,
    },
    detailDate: {
      fontSize: 14,
      color: colors.textSecondary,
      fontStyle: 'italic',
    },
    loadingText: {
      fontSize: 16,
      color: colors.textSecondary,
      textAlign: 'center',
      marginTop: 20,
    },
    createTitle: {
      fontSize: 28,
      fontWeight: '700',
      color: colors.text,
      marginBottom: 24,
      textAlign: 'center',
    },
    formSection: {
      marginBottom: 20,
    },
    label: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 8,
    },
    textArea: {
      minHeight: 100,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 8,
      paddingHorizontal: 12,
      paddingVertical: 12,
      fontSize: 16,
      color: colors.text,
      backgroundColor: colors.surface,
      textAlignVertical: 'top',
    },
    switchRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 4,
    },
    helpText: {
      fontSize: 14,
      color: colors.textSecondary,
      fontStyle: 'italic',
    },
    createButton: {
      backgroundColor: colors.primary,
      paddingVertical: 16,
      paddingHorizontal: 24,
      borderRadius: 8,
      alignItems: 'center',
      marginTop: 20,
    },
    createButtonDisabled: {
      backgroundColor: colors.textSecondary,
      opacity: 0.6,
    },
    createButtonText: {
      color: '#FFFFFF',
      fontSize: 18,
      fontWeight: '600',
    },
  };

  return {
    theme,
    colors,
    styles,
  };
} 
