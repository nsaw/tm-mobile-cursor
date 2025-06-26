import { Text ,
  View,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { useTheme } from '../../../theme/ThemeProvider';

interface AIToolsCardProps {
  onPress: () => void;
  title?: string;
  subtitle?: string;
  icon?: string;
}

export const AIToolsCard: React.FC<AIToolsCardProps> = ({
  onPress,
  title = "AI TOOLS",
  subtitle = "Generate insights and suggestions",
  icon = "sparkles",
}) => {
  const { tokens } = useTheme();

  const styles = StyleSheet.create({
    container: {
      backgroundColor: tokens.colors.surface ?? '#fff',
      borderRadius: tokens.radius.md,
      paddingVertical: tokens.spacing.md * 0.7,
      paddingLeft: tokens.spacing.sm * 2.5,
      paddingRight: tokens.spacing.sm * 2.5,
      marginHorizontal: 0,
      marginTop: tokens.spacing.md,
      marginBottom: tokens.spacing.md,
      borderWidth: .25,
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
      textTransform: 'uppercase',
    },
    subtitle: {
      fontSize: tokens.typography.fontSize.sm,
      color: tokens.colors.textSecondary,
      lineHeight: 16,
    },
    crownIcon: {
      color: '#FFD700',
    },
  });

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7} accessibilityRole="button" accessible={true} accessibilityLabel="Button">
      <View style={styles.content}>
        <View>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>
      </View>
      <MaterialCommunityIcons name={"crown" as any} size={20} style={styles.crownIcon} />
    </TouchableOpacity>
  );
}; 