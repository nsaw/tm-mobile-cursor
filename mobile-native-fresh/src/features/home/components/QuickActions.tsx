import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useTheme } from '../../../theme/ThemeProvider';
import { AutoRoleView } from '../../../components/ui/AutoRoleView';

interface QuickActionsProps {
  onCreateThoughtmark: () => void;
  onVoiceRecord: () => void;
  onOpenBins: () => void;
}

export const QuickActions: React.FC<QuickActionsProps> = ({
  onCreateThoughtmark,
  onVoiceRecord,
  onOpenBins,
}) => {
  const { tokens: designTokens } = useTheme();

  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      paddingHorizontal: designTokens.spacing.lg,
      paddingVertical: designTokens.spacing.md,
    },
    actionButton: {
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: designTokens.colors.accent,
      padding: designTokens.spacing.md,
      borderRadius: designTokens.radius.md,
      minWidth: 80,
    },
    actionIcon: {
      color: designTokens.colors.background,
    },
    actionButton2: {
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: designTokens.colors.accent,
      padding: designTokens.spacing.md,
      borderRadius: designTokens.radius.md,
      minWidth: 80,
    },
    actionButton3: {
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: designTokens.colors.accent,
      padding: designTokens.spacing.md,
      borderRadius: designTokens.radius.md,
      minWidth: 80,
    },
  });

  return (
    <AutoRoleView role="group" accessibilityRole="none" style={styles.container}>
      <TouchableOpacity style={styles.actionButton} onPress={onCreateThoughtmark} accessibilityRole="button" accessible={true} accessibilityLabel="Button">
        <Ionicons name="create-outline" size={24} color={designTokens.colors.background} />
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.actionButton2} onPress={onVoiceRecord} accessibilityRole="button" accessible={true} accessibilityLabel="Button">
        <Ionicons name="mic-outline" size={24} color={designTokens.colors.background} />
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.actionButton3} onPress={onOpenBins} accessibilityRole="button" accessible={true} accessibilityLabel="Button">
        <Ionicons name="folder-outline" size={24} color={designTokens.colors.background} />
      </TouchableOpacity>
    </AutoRoleView>
  );
};