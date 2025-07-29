import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useTheme } from '../../../theme/ThemeProvider';

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
    actionButton: {
      alignItems: 'center',
      backgroundColor: designTokens.colors.accent,
      borderRadius: designTokens.radius.md,
      justifyContent: 'center',
      minWidth: 80,
      padding: designTokens.spacing.md,
    },
    actionButton2: {
      alignItems: 'center',
      backgroundColor: designTokens.colors.accent,
      borderRadius: designTokens.radius.md,
      justifyContent: 'center',
      minWidth: 80,
      padding: designTokens.spacing.md,
    },
    actionButton3: {
      alignItems: 'center',
      backgroundColor: designTokens.colors.accent,
      borderRadius: designTokens.radius.md,
      justifyContent: 'center',
      minWidth: 80,
      padding: designTokens.spacing.md,
    },
    actionIcon: {
      color: designTokens.colors.background,
    },
    container: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      paddingHorizontal: designTokens.spacing.lg,
      paddingVertical: designTokens.spacing.md,
    },
  });

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.actionButton} onPress={onCreateThoughtmark} accessibilityRole="button" accessible={true} accessibilityLabel="Button">
        <Ionicons name="create-outline" size={24} color={designTokens.colors.background} />
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.actionButton2} onPress={onVoiceRecord} accessibilityRole="button" accessible={true} accessibilityLabel="Button">
        <Ionicons name="mic-outline" size={24} color={designTokens.colors.background} />
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.actionButton3} onPress={onOpenBins} accessibilityRole="button" accessible={true} accessibilityLabel="Button">
        <Ionicons name="folder-outline" size={24} color={designTokens.colors.background} />
      </TouchableOpacity>
    </View>
  );
};