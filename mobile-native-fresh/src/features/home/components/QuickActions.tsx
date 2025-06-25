import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../theme/ThemeProvider';

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
  const { tokens } = useTheme();

  return (
    <View style={[styles.container, {
      paddingHorizontal: designTokens.spacing.lg,
      paddingVertical: designTokens.spacing.md,
    }]}>
      <TouchableOpacity 
        style={[styles.actionButton, {
          backgroundColor: designTokens.colors.accent,
          padding: designTokens.spacing.md,
          borderRadius: designTokens.radius.md,
          minWidth: 60,
        }]} 
        onPress={onCreateThoughtmark}
      >
        <Ionicons name="create-outline" size={24} color={designTokens.colors.background} />
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[styles.actionButton, {
          backgroundColor: designTokens.colors.accent,
          padding: designTokens.spacing.md,
          borderRadius: designTokens.radius.md,
          minWidth: 60,
        }]} 
        onPress={onVoiceRecord}
      >
        <Ionicons name="mic-outline" size={24} color={designTokens.colors.background} />
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[styles.actionButton, {
          backgroundColor: designTokens.colors.accent,
          padding: designTokens.spacing.md,
          borderRadius: designTokens.radius.md,
          minWidth: 60,
        }]} 
        onPress={onViewBins}
      >
        <Ionicons name="folder-outline" size={24} color={designTokens.colors.background} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  actionButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});