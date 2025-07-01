import {
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';

import { useTheme } from '../../../theme/ThemeProvider';
import { Text } from '../../../components/ui/Text';
import { spacingTokens } from '../../../theme/spacing';

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

  const styles = StyleSheet.create({
    container: {
      width: (width - designTokens.spacing.lg * 2 - designTokens.spacing.sm) / 2,
      aspectRatio: 1,
      backgroundColor: designTokens.colors.backgroundSecondary,
      borderRadius: designTokens.radius.md * 1.34,
      marginBottom: spacingTokens.cardMarginBottom,
      borderWidth: 1,
      borderColor: designTokens.colors.borderHover,
      justifyContent: 'center',
      alignItems: 'center',
      padding: spacingTokens.cardPaddingHorizontal,
    },
    icon: {
      fontSize: 32,
      marginBottom: spacingTokens.textMarginBottom,
    },
    name: {
      color: designTokens.colors.accent,
      textAlign: 'center',
      marginBottom: spacingTokens.textMarginBottom,
    },
    count: {
      color: designTokens.colors.textSecondary,
      textAlign: 'center',
    },
  });

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} accessibilityRole="button"
                accessible={true}
                accessibilityLabel="Button">
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