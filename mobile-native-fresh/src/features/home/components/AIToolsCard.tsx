import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors, spacing, typography } from '../../../theme/theme';
import { designTokens } from '../../../theme/tokens';

interface AIToolsCardProps {
  onPress: () => void;
  isPremium?: boolean;
}

export const AIToolsCard: React.FC<AIToolsCardProps> = ({
  onPress,
  isPremium = false,
}) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        <View style={styles.leftContent}>
          <MaterialCommunityIcons name="crown-outline" size={32} color="rgba(255, 221, 0, 0.6)" />
          <Text style={styles.title}>AI TOOLS</Text>
          {isPremium && (
            <Ionicons name="diamond" size={21} color="rgba(252, 211, 77, 0.6)" />
          )}
        </View>
        <Ionicons name="arrow-forward" size={27} color="rgba(252, 211, 77, 0.6)" />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    borderRadius: 11,
    paddingVertical: spacing.md * 0.7,
    paddingHorizontal: spacing.lg * 1.34,
    borderWidth: 3,
    borderColor: 'rgba(255, 221, 0, 0.25)',
    minHeight: 75,
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    color: 'rgba(255, 221, 0, 0.7)',
    fontWeight: '700',
    marginLeft: spacing.sm * 1.34,
    marginRight: spacing.xs * 1.34,
    textTransform: 'uppercase',
    fontFamily: designTokens.typography.fontFamily.heading,
  },
}); 