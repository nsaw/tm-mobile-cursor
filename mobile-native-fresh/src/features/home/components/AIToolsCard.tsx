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
          <MaterialCommunityIcons name="crown-outline" size={24} color="#FFD700" />
          <Text style={styles.title}>AI Tools</Text>
          {isPremium && (
            <Ionicons name="diamond" size={16} color="#FCD34D" />
          )}
        </View>
        <Ionicons name="arrow-forward" size={20} color="#FCD34D" />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    borderRadius: 12,
    padding: spacing.lg,
    borderWidth: 2,
    borderColor: '#FCD34D',
    minHeight: 80,
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
    ...typography.subheading,
    color: '#FCD34D',
    fontWeight: '700',
    marginLeft: spacing.sm,
    marginRight: spacing.xs,
  },
}); 