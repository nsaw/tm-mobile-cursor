import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { colors, spacing, typography } from '../../../theme/theme';
import { designTokens } from '../../../theme/tokens';
import { Bin } from '../../../types';

const { width } = Dimensions.get('window');

interface BinCardProps {
  bin: Bin;
  onPress: () => void;
}

export const BinCard: React.FC<BinCardProps> = ({
  bin,
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={1}>
          {bin.name}
        </Text>
        <Text style={styles.count}>
          {bin.thoughtmarkCount || 0}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: (width - spacing.lg * 2 - spacing.sm) / 2,
    height: 70,
    backgroundColor: colors.card,
    borderRadius: designTokens.radius.md * 1.34,
    marginBottom: spacing.sm * 1.34,
    borderWidth: 1,
    borderColor: colors.border,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md * 1.34,
  },
  name: {
    ...typography.body,
    color: colors.text,
    fontWeight: '600',
    fontSize: 14,
    flex: 1,
    textTransform: 'capitalize',
  },
  count: {
    fontSize: 9,
    color: colors.primary,
    fontWeight: '500',
  },
}); 