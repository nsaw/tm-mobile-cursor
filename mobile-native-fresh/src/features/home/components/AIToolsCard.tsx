import {
  View,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import React from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { useTheme } from '../../../theme/ThemeProvider';
import { Text, SectionHeader } from '../../../components/ui/Text';
import { AutoRoleView } from '../../../components/ui/AutoRoleView';

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
  const { tokens: designTokens } = useTheme();

  const styles = StyleSheet.create({
    container: {
      backgroundColor: 'transparent',
      borderRadius: 12,
      paddingVertical: designTokens.spacing.md,
      paddingLeft: designTokens.spacing.lg,
      paddingRight: designTokens.spacing.lg,
      marginHorizontal: 0,
      marginTop: designTokens.spacing.md,
      marginBottom: designTokens.spacing.md,
      borderWidth: 0.25,
      borderColor: designTokens.colors.accent,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      shadowColor: designTokens.colors.accent,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 3,
    },
    content: {
      flex: 1,
      marginRight: designTokens.spacing.sm,
      flexDirection: 'row',
      alignItems: 'center',
    },
    title: {
      color: designTokens.colors.accent,
      marginBottom: designTokens.spacing.xs,
      marginTop: 0,
      marginLeft: 0,
    },
    subtitle: {
      color: designTokens.colors.textSecondary,
      lineHeight: 16,
    },
    crownIcon: {
      color: designTokens.colors.accent,
    },
  });

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7} accessibilityRole="button" accessible={true} accessibilityLabel="AI Tools">
      <AutoRoleView role="main" accessibilityRole="none" style={styles.content}>
        <AutoRoleView>
          <SectionHeader style={styles.title}>{title}</SectionHeader>
          <Text variant="body" style={styles.subtitle}>{subtitle}</Text>
        </AutoRoleView>
      </AutoRoleView>
      <MaterialCommunityIcons name="crown" size={20} style={styles.crownIcon} />
    </TouchableOpacity>
  );
}; 