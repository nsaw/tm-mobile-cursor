import {
  TouchableOpacity,
  StyleSheet,
  Dimensions
} from 'react-native';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';

import { useTheme } from '../../../theme/ThemeProvider';
import { Text } from '../../../components/ui/Text';

interface BinCardProps {
  bin: {
    id: string;
    name: string;
    icon: string;
    color?: string;
    thoughtmarkCount: number;
  };
  onPress: () => void;
}

export const BinCard: React.FC<BinCardProps> = ({
  bin,
  onPress
}) => {;
  const { tokens } = useTheme();
  const { width } = Dimensions.get('window');
;
  const styles = StyleSheet.create({
    container: {
      width: (width - tokens.spacing.lg * 2 - tokens.spacing.sm) / 2,
      aspectRatio: 1,
      backgroundColor: tokens.colors.backgroundSecondary,
      borderRadius: tokens.radius.md * 1.34,
      marginBottom: tokens.spacing.lg,
      borderWidth: 1,
      borderColor: tokens.colors.borderHover,
      justifyContent: 'center',
      alignItems: 'center',
      padding: tokens.spacing.lg
    },
    icon: {
      fontSize: 32,
      marginBottom: tokens.spacing.sm
    },
    name: {
      color: tokens.colors.accent,
      textAlign: 'center',
      marginBottom: tokens.spacing.sm,
      fontSize: tokens.typography.fontSize.md,
      fontWeight: '600'
    },
    count: {
      color: tokens.colors.textSecondary,
      textAlign: 'center',
      fontSize: tokens.typography.fontSize.sm
    }
  });

  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={onPress} 
      accessibilityRole="button"
    >
      <Ionicons 
        name={bin.icon as any} 
        size={32} 
        style={[styles.icon, { color: bin.color || tokens.colors.accent }]} 
      />
      <Text style={styles.name}>{bin.name}</Text>
      <Text style={styles.count}>{bin.thoughtmarkCount} thoughtmarks</Text>
    </TouchableOpacity>
  );
}; 