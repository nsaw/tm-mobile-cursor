import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../../../theme/theme';

interface QuickActionsProps {
  onCreateThoughtmark: () => void;
  onVoiceRecord: () => void;
  onViewBins: () => void;
}

export const QuickActions: React.FC<QuickActionsProps> = ({
  onCreateThoughtmark,
  onVoiceRecord,
  onViewBins,
}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.actionButton} onPress={onCreateThoughtmark}>
        <Ionicons name="create-outline" size={24} color={colors.background} />
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.actionButton} onPress={onVoiceRecord}>
        <Ionicons name="mic-outline" size={24} color={colors.background} />
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.actionButton} onPress={onViewBins}>
        <Ionicons name="folder-outline" size={24} color={colors.background} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  actionButton: {
    backgroundColor: colors.primary,
    padding: spacing.md,
    borderRadius: spacing.md,
    minWidth: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
});