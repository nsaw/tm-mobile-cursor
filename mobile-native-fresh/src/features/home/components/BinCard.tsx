import {
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';

import { useTheme } from '../../../theme/ThemeProvider';
import { Text } from '../../../components/ui/Text';

interface BinCardProps {
  bin: {
    id: number;
    name: string;
    icon: string;
    color?: string;
    thoughtmarkCount: number;
  };
  onPress: () => void;
}

const { width } = Dimensions.get('window');

export const BinCard: React.FC<BinCardProps> = ({
  bin,
  onPress,
}) => {
  const { tokens } = useTheme();

  const styles = StyleSheet.create({
    container: {
      width: (width - tokens.spacing.lg * 2 - tokens.spacing.sm) / 2,
      aspectRatio: 1,
      backgroundColor: tokens.colors.backgroundSecondary,
      borderRadius: tokens.radius.md * 1.34,
      marginBottom: tokens.spacing.md,
      borderWidth: 1,
      borderColor: tokens.colors.borderHover,
      justifyContent: 'center',
      alignItems: 'center',
      padding: tokens.spacing.lg,
    },
    icon: {
      fontSize: 32,
      marginBottom: tokens.spacing.xs,
    },
    name: {
      color: tokens.colors.accent,
      textAlign: 'center',
      marginBottom: tokens.spacing.xs,
    },
    count: {
      color: tokens.colors.textSecondary,
      textAlign: 'center',
    },
  });

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} accessibilityRole="button" accessible={true} accessibilityLabel="Button">
      <Ionicons 
        name={bin.icon as any} 
        size={32} 
        style={[styles.icon, { color: bin.color || tokens.colors.accent }]} 
      />
      <Text variant="subtitle" style={styles.name}>{bin.name}</Text>
      <Text variant="caption" style={styles.count}>{bin.thoughtmarkCount} thoughtmarks</Text>
    </TouchableOpacity>
  );
}; 