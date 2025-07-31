import { StyleSheet } from 'react-native';
import { ThemeColors } from '../types/theme';

export interface ThemeStyles {
  // Screen containers
  screenContainer: any;
  container: any;
  contentContainer: any;
  
  // Search styles
  searchBar: any;
  input: any;
  voiceButton: any;
  voiceLabel: any;
  clearButton: any;
  clearButtonText: any;
  searchItem: any;
  searchItemContent: any;
  searchItemIcon: any;
  searchItemText: any;
  searchItemLabel: any;
  searchItemDescription: any;
  searchItemTimestamp: any;
  suggestionBadge: any;
  
  // Detail screen styles
  fieldContainer: any;
  fieldHeader: any;
  fieldLabel: any;
  editButton: any;
  editButtonText: any;
  editingContainer: any;
  multilineInput: any;
  inputError: any;
  errorText: any;
  editActions: any;
  saveButton: any;
  saveButtonText: any;
  cancelButton: any;
  cancelButtonText: any;
  displayContainer: any;
  displayText: any;
  
  // Common styles
  loadingContainer: any;
  loadingText: any;
  errorContainer: any;
  retryButton: any;
  retryText: any;
  emptyContainer: any;
  emptyText: any;
  emptySubtext: any;
  
  // Action styles
  primaryButton: any;
  primaryButtonText: any;
  actions: any;
  
  // Header styles
  header: any;
  title: any;
  metadata: any;
  metadataText: any;
  
  // Content styles
  content: any;
  contentText: any;
  editableSection: any;
}

export function createThemeStyles(colors: ThemeColors): ThemeStyles {
  const styles = StyleSheet.create({
    // Screen containers
    screenContainer: {
      flex: 1,
      backgroundColor: colors.background,
    },
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    contentContainer: {
      padding: 16,
    },
    
    // Search styles
    searchBar: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 12,
      backgroundColor: colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    input: {
      flex: 1,
      height: 40,
      paddingHorizontal: 12,
      paddingVertical: 8,
      backgroundColor: colors.background,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 8,
      color: colors.text,
      fontSize: 16,
    },
    voiceButton: {
      marginLeft: 8,
      padding: 8,
      backgroundColor: colors.primary,
      borderRadius: 8,
      justifyContent: 'center',
      alignItems: 'center',
    },
    voiceLabel: {
      fontSize: 18,
      color: '#FFFFFF',
    },
    clearButton: {
      marginLeft: 8,
      padding: 8,
      backgroundColor: colors.error,
      borderRadius: 8,
      justifyContent: 'center',
      alignItems: 'center',
    },
    clearButtonText: {
      fontSize: 16,
      color: '#FFFFFF',
      fontWeight: 'bold',
    },
    searchItem: {
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      backgroundColor: colors.surface,
    },
    searchItemContent: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    searchItemIcon: {
      fontSize: 20,
      marginRight: 12,
    },
    searchItemText: {
      flex: 1,
    },
    searchItemLabel: {
      fontSize: 16,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 4,
    },
    searchItemDescription: {
      fontSize: 14,
      color: colors.textSecondary,
      marginBottom: 2,
    },
    searchItemTimestamp: {
      fontSize: 12,
      color: colors.textSecondary,
    },
    suggestionBadge: {
      fontSize: 12,
      color: colors.primary,
      fontWeight: 'bold',
      backgroundColor: colors.primary + '20',
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: 4,
    },
    
    // Detail screen styles
    fieldContainer: {
      marginBottom: 16,
    },
    fieldHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8,
    },
    fieldLabel: {
      fontSize: 16,
      fontWeight: 'bold',
      color: colors.text,
    },
    editButton: {
      padding: 4,
      backgroundColor: colors.primary,
      borderRadius: 4,
    },
    editButtonText: {
      fontSize: 14,
      color: '#FFFFFF',
    },
    editingContainer: {
      marginTop: 8,
    },
    multilineInput: {
      minHeight: 80,
      textAlignVertical: 'top',
    },
    inputError: {
      borderColor: colors.error,
    },
    errorText: {
      fontSize: 12,
      color: colors.error,
      marginTop: 4,
    },
    editActions: {
      flexDirection: 'row',
      marginTop: 8,
      gap: 8,
    },
    saveButton: {
      flex: 1,
      padding: 8,
      backgroundColor: colors.primary,
      borderRadius: 4,
      alignItems: 'center',
    },
    saveButtonText: {
      fontSize: 14,
      color: '#FFFFFF',
      fontWeight: 'bold',
    },
    cancelButton: {
      flex: 1,
      padding: 8,
      backgroundColor: colors.textSecondary,
      borderRadius: 4,
      alignItems: 'center',
    },
    cancelButtonText: {
      fontSize: 14,
      color: '#FFFFFF',
    },
    displayContainer: {
      padding: 12,
      backgroundColor: colors.surface,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.border,
    },
    displayText: {
      fontSize: 16,
      color: colors.text,
      lineHeight: 24,
    },
    
    // Common styles
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.background,
    },
    loadingText: {
      fontSize: 16,
      color: colors.textSecondary,
      marginTop: 16,
    },
    errorContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.background,
      padding: 16,
    },
    retryButton: {
      marginTop: 16,
      padding: 12,
      backgroundColor: colors.primary,
      borderRadius: 8,
    },
    retryText: {
      fontSize: 16,
      color: '#FFFFFF',
      fontWeight: 'bold',
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.background,
      padding: 16,
    },
    emptyText: {
      fontSize: 18,
      color: colors.text,
      textAlign: 'center',
      marginBottom: 8,
    },
    emptySubtext: {
      fontSize: 14,
      color: colors.textSecondary,
      textAlign: 'center',
    },
    
    // Action styles
    primaryButton: {
      backgroundColor: colors.primary,
      padding: 16,
      borderRadius: 8,
      alignItems: 'center',
    },
    primaryButtonText: {
      fontSize: 16,
      color: '#FFFFFF',
      fontWeight: 'bold',
    },
    actions: {
      marginTop: 24,
    },
    
    // Header styles
    header: {
      marginBottom: 24,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 8,
    },
    metadata: {
      marginBottom: 16,
    },
    metadataText: {
      color: colors.textSecondary,
      fontSize: 14,
    },
    
    // Content styles
    content: {
      marginBottom: 24,
    },
    contentText: {
      color: colors.text,
      fontSize: 16,
      lineHeight: 24,
    },
         editableSection: {
       marginBottom: 24,
     },
   });
   
   return styles as ThemeStyles;
 } 