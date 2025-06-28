import {
  View,
  TouchableOpacity,
  StyleSheet,
  Text
} from 'react-native';
import React from 'react';
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
  icon = "crown"
}) => {;
  const { tokens } = useTheme();
;
  const styles = StyleSheet.create({
    container: {
      backgroundColor: 'transparent',
      borderRadius: 12,
      paddingVertical: tokens.spacing.md,
      paddingLeft: tokens.spacing.lg,
      paddingRight: tokens.spacing.lg,
      marginHorizontal: 0,
      marginTop: tokens.spacing.md,
      marginBottom: tokens.spacing.lg,
      borderWidth: 0.25,
      borderColor: '#FFD700',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      shadowColor: '#FFD700',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 3
    },
    content: {
      flex: 1,
      marginRight: tokens.spacing.md,
      flexDirection: 'row',
      alignItems: 'center'
    },
    title: {
      color: '#FFD700',
      marginBottom: tokens.spacing.sm,
      marginTop: 0,
      marginLeft: 0,
      fontSize: tokens.typography.fontSize.lg,
      fontWeight: '600'
    },
    subtitle: {
      color: tokens.colors.textSecondary,
      lineHeight: 16,
      fontSize: tokens.typography.fontSize.body
    },
    crownIcon: {
      color: '#FFD700'
    }
  });

  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={onPress} 
      activeOpacity={0.7} 
      accessibilityRole="button"
    >
      <View style={styles.content}>
        <View>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>
      </View>
      <MaterialCommunityIcons name="crown" size={20} style={styles.crownIcon} />
    </TouchableOpacity>
  );
}; 