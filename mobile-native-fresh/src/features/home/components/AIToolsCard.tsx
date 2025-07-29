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
  const { tokens: designTokens } = useTheme();

  const styles = StyleSheet.create({
    container: {
      alignItems: 'center',
      backgroundColor: 'transparent',
      borderColor: designTokens.colors.accent,
      borderRadius: 12,
      borderWidth: 0.25,
      elevation: 3,
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: designTokens.spacing.md,
      marginHorizontal: 0,
      marginTop: designTokens.spacing.md,
      paddingLeft: designTokens.spacing.lg,
      paddingRight: designTokens.spacing.lg,
      paddingVertical: designTokens.spacing.md,
      shadowColor: designTokens.colors.accent,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
    },
    content: {
      alignItems: 'center',
      flex: 1,
      flexDirection: 'row',
      marginRight: designTokens.spacing.sm,
    },
    crownIcon: {
      color: designTokens.colors.accent,
    },
    subtitle: {
      color: designTokens.colors.textSecondary,
      lineHeight: 16,
    },
    title: {
      color: designTokens.colors.accent,
      marginBottom: designTokens.spacing.xs,
      marginLeft: 0,
      marginTop: 0,
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