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
      marginBottom: tokens.spacing.sm * 1.34,
      borderWidth: 1,
      borderColor: tokens.colors.borderHover,
      justifyContent: 'center',
      alignItems: 'center',
      padding: tokens.spacing.md * 1.34,
    },
    icon: {
      fontSize: 32,
      marginBottom: tokens.spacing.sm,
    },
    name: {
      fontSize: tokens.typography.fontSize.xs,
      fontWeight: tokens.typography.fontWeight.light,
      color: tokens.colors.accent,
      textAlign: 'center',
      marginBottom: tokens.spacing.xs,
    },
    count: {
      fontSize: tokens.typography.fontSize.xs,
      color: tokens.colors.textSecondary,
      textAlign: 'center',
      fontWeight: tokens.typography.fontWeight.light,
    },
  });

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} accessibilityRole="button" accessible={true} accessibilityLabel="Button">
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