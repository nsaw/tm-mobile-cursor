import {
  View,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import React from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { useTheme } from '../../../theme/ThemeProvider';
import { Text, SectionHeader } from '../../../components/ui/Text';
import { spacingTokens } from '../../../theme/spacing';

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
  

  const styles = StyleSheet.create({
    container: {
      backgroundColor: 'transparent',
      borderRadius: 12,
      paddingVertical: spacingTokens.cardPaddingVertical,
      paddingLeft: spacingTokens.cardPaddingHorizontal,
      paddingRight: spacingTokens.cardPaddingHorizontal,
      marginHorizontal: 0,
      marginTop: spacingTokens.sectionHeaderMarginBottom,
      marginBottom: spacingTokens.cardMarginBottom,
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
      marginRight: spacingTokens.iconMarginRight,
      flexDirection: 'row',
      alignItems: 'center',
    },
    title: {
      color: '#FFD700',
      marginBottom: spacingTokens.textMarginBottom,
      marginTop: 0,
      marginLeft: 0,
    },
    subtitle: {
      color: tokens.colors.textSecondary,
      lineHeight: 16,
    },
    crownIcon: {
      color: '#FFD700',
    },
  });

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7} accessibilityRole="button"  >
      <View style={styles.content}>
        <View>
          <SectionHeader><Text>{title}</Text></SectionHeader>
          <Text variant="body" style={styles.subtitle}>{subtitle}</Text>
        </View>
      </View>
      <MaterialCommunityIcons name="crown" size={20} style={styles.crownIcon} />
    </TouchableOpacity>
  );
}; 