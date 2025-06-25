import React from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { useTheme } from '../../../theme/ThemeProvider';
import { Text } from '../../../components/ui/Text';
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
  const { tokens } = useTheme();

  return (
    <TouchableOpacity
      style={[styles.container, {
        width: (width - tokens.spacing.lg * 2 - tokens.spacing.sm) / 2,
        height: 70,
        backgroundColor: tokens.colors.backgroundSecondary,
        borderRadius: tokens.radius.md * 1.34,
        marginBottom: tokens.spacing.sm * 1.34,
        borderWidth: 1,
        borderColor: tokens.colors.border,
      }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.content, {
        paddingHorizontal: tokens.spacing.md * 1.34,
      }]}>
        <Text 
          variant="body" 
          size="sm"
          style={{
            fontWeight: '600',
            flex: 1,
            textTransform: 'capitalize',
          }}
          numberOfLines={1}
        >
          {bin.name}
        </Text>
        <Text 
          variant="caption" 
          size="xs"
          style={{
            color: tokens.colors.accent,
            fontWeight: '500',
          }}
        >
          {bin.thoughtmarkCount || 0}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    // Styles moved to inline for token access
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // Styles moved to inline for token access
  },
}); 