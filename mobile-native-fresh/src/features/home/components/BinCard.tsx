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
  const { tokens: designTokens } = useTheme();

  const styles = StyleSheet.create({
    container: {
      alignItems: 'center',
      aspectRatio: 1,
      backgroundColor: designTokens.colors.backgroundSecondary,
      borderColor: designTokens.colors.borderHover,
      borderRadius: designTokens.radius.md * 1.34,
      borderWidth: 1,
      justifyContent: 'center',
      marginBottom: designTokens.spacing.md,
      padding: designTokens.spacing.lg,
      width: (width - designTokens.spacing.lg * 2 - designTokens.spacing.sm) / 2,
    },
    count: {
      color: designTokens.colors.textSecondary,
      textAlign: 'center',
    },
    icon: {
      fontSize: 32,
      marginBottom: designTokens.spacing.xs,
    },
    name: {
      color: designTokens.colors.accent,
      marginBottom: designTokens.spacing.xs,
      textAlign: 'center',
    },
  });

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} accessibilityRole="button" accessible={true} accessibilityLabel="Button">
      <Ionicons 
        name={bin.icon as any} 
        size={32} 
        style={[styles.icon, { color: bin.color || designTokens.colors.accent }]} 
      />
      <Text variant="subtitle" style={styles.name}>{bin.name}</Text>
      <Text variant="caption" style={styles.count}>{bin.thoughtmarkCount} thoughtmarks</Text>
    </TouchableOpacity>
  );
}; 