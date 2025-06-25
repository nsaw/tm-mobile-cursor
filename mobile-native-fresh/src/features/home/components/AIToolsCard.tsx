import { Text ,
  View,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import React from 'react';
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
      marginHorizontal: 0,
      marginBottom: tokens.spacing.md,
      borderWidth: 1,
      borderColor: '#FFD700',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      shadowColor: '#FFD700',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 3,
    },
    content: {
      flex: 1,
      marginLeft: tokens.spacing.sm * 1.34,
      marginRight: tokens.spacing.xs * 1.34,
      flexDirection: 'row',
      alignItems: 'center',
    },
    title: {
      fontFamily: tokens.typography.fontFamily.heading,
      fontSize: tokens.typography.fontSize.body,
      fontWeight: '600',
      color: '#FFD700',
      marginBottom: tokens.spacing.xs,
      marginLeft: tokens.spacing.sm,
    },
    subtitle: {
      fontSize: tokens.typography.fontSize.sm,
      color: tokens.colors.textSecondary,
      lineHeight: 16,
    },
    icon: {
      color: tokens.colors.accent,
    },
    crownIcon: {
      color: '#FFD700',
      marginRight: tokens.spacing.xs,
    },
  });

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7} accessibilityRole="button" accessible={true} accessibilityLabel="Button">
      <View style={styles.content}>
        <Ionicons name={"crown" as any} size={20} style={styles.crownIcon} />
        <View>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>
      </View>
      <Ionicons name={icon as any} size={24} style={styles.icon} />
    </TouchableOpacity>
  );
}; 