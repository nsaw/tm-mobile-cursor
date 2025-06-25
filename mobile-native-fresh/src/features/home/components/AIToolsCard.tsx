import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../theme/ThemeProvider';

interface AIToolsCardProps {
  onPress: () => void;
  title?: string;
  subtitle?: string;
  icon?: string;
}

export const AIToolsCard: React.FC<AIToolsCardProps> = ({
  onPress,
  title = "AI Tools",
  subtitle = "Generate insights and suggestions",
  icon = "sparkles",
}) => {
  const { tokens } = useTheme();

  const styles = StyleSheet.create({
    container: {
      backgroundColor: tokens.colors.surface ?? '#fff',
      borderRadius: tokens.radius.md,
      paddingVertical: tokens.spacing.md * 0.7,
      paddingHorizontal: tokens.spacing.lg * 1.34,
      marginHorizontal: tokens.spacing.lg,
      marginBottom: tokens.spacing.md,
      borderWidth: 1,
      borderColor: tokens.colors.border,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    content: {
      flex: 1,
      marginLeft: tokens.spacing.sm * 1.34,
      marginRight: tokens.spacing.xs * 1.34,
    },
    title: {
      fontFamily: tokens.typography.fontFamily.heading,
      fontSize: tokens.typography.fontSize.body,
      fontWeight: '600',
      color: tokens.colors.text,
      marginBottom: tokens.spacing.xs,
    },
    subtitle: {
      fontSize: tokens.typography.fontSize.sm,
      color: tokens.colors.textSecondary,
      lineHeight: 16,
    },
    icon: {
      color: tokens.colors.accent,
    },
  });

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>
      <Ionicons name={icon as any} size={24} style={styles.icon} />
    </TouchableOpacity>
  );
}; 