import {
  View,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import React from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { useTheme } from '../../../theme/ThemeProvider';
import { Text, SectionHeader } from '../../../components/ui/Text';

interface AIToolsCardProps {
  onPress: () => void;
  title?: string;
  subtitle?: string;
}

export const AIToolsCard: React.FC<AIToolsCardProps> = ({
  onPress,
  title = "AI TOOLS",
  subtitle = "Generate insights and suggestions",
}) => {
  const { tokens } = useTheme();

  const styles = StyleSheet.create({
    container: {
      backgroundColor: 'transparent',
      borderRadius: 12,
      paddingVertical: tokens.spacing.md,
      paddingLeft: tokens.spacing.lg,
      paddingRight: tokens.spacing.lg,
      marginHorizontal: 0,
      marginTop: tokens.spacing.md,
      marginBottom: tokens.spacing.md,
      borderWidth: 0.25,
      borderColor: tokens.colors.accent,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      shadowColor: tokens.colors.accent,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 3,
    },
    content: {
      flex: 1,
      marginRight: tokens.spacing.sm,
      flexDirection: 'row',
      alignItems: 'center',
    },
    title: {
      color: tokens.colors.accent,
      marginBottom: tokens.spacing.xs,
      marginTop: 0,
      marginLeft: 0,
    },
    subtitle: {
      color: tokens.colors.textSecondary,
      lineHeight: 16,
    },
    crownIcon: {
      color: tokens.colors.accent,
    },
  });

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7} accessibilityRole="button" accessible={true} accessibilityLabel="AI Tools">
      <View style={styles.content}>
        <View>
          <SectionHeader style={styles.title}>{title}</SectionHeader>
          <Text variant="body" style={styles.subtitle}>{subtitle}</Text>
        </View>
      </View>
      <MaterialCommunityIcons name="crown" size={20} style={styles.crownIcon} />
    </TouchableOpacity>
  );
}; 