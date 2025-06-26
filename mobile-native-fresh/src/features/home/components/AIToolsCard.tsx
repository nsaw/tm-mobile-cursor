import { Text ,
  View,
  TouchableOpacity,
  StyleSheet,
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
  icon = "crown",
}) => {
  const { typography, spacing } = useTheme();

  const styles = StyleSheet.create({
    container: {
      backgroundColor: '#fff',
      borderRadius: 12,
      paddingVertical: spacing.cardPaddingVertical,
      paddingLeft: spacing.cardPaddingHorizontal,
      paddingRight: spacing.cardPaddingHorizontal,
      marginHorizontal: 0,
      marginTop: spacing.sectionHeaderMarginBottom,
      marginBottom: spacing.cardMarginBottom,
      borderWidth: 0.25,
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
      marginRight: spacing.iconMarginRight,
      flexDirection: 'row',
      alignItems: 'center',
    },
    title: {
      ...typography.sectionTitle,
      color: '#FFD700',
      marginBottom: spacing.textMarginBottom,
      textTransform: 'uppercase',
      marginTop: 0,
      marginLeft: 0,
    },
    subtitle: {
      ...typography.body,
      color: '#6B7280',
      lineHeight: 16,
    },
    crownIcon: {
      color: '#FFD700',
    },
  });

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7} accessibilityRole="button" accessible={true} accessibilityLabel="AI Tools">
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