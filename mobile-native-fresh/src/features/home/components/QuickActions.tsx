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
  const { tokens } = useTheme();

  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      paddingHorizontal: tokens.spacing.lg,
      paddingVertical: tokens.spacing.md,
    },
    actionButton: {
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: tokens.colors.accent,
      padding: tokens.spacing.md,
      borderRadius: tokens.radius.md,
      minWidth: 80,
    },
    actionIcon: {
      color: tokens.colors.background,
    },
    actionButton2: {
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: tokens.colors.accent,
      padding: tokens.spacing.md,
      borderRadius: tokens.radius.md,
      minWidth: 80,
    },
    actionButton3: {
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: tokens.colors.accent,
      padding: tokens.spacing.md,
      borderRadius: tokens.radius.md,
      minWidth: 80,
    },
  });

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.actionButton} onPress={onCreateThoughtmark} accessibilityRole="button"
                accessible={true}
                accessibilityLabel="Button">
        <Ionicons name="create-outline" size={24} color={tokens.colors.background} />
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.actionButton2} onPress={onVoiceRecord} accessibilityRole="button"
                accessible={true}
                accessibilityLabel="Button">
        <Ionicons name="mic-outline" size={24} color={tokens.colors.background} />
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.actionButton3} onPress={onOpenBins} accessibilityRole="button"
                accessible={true}
                accessibilityLabel="Button">
        <Ionicons name="folder-outline" size={24} color={tokens.colors.background} />
      </TouchableOpacity>
    </View>
  );
};