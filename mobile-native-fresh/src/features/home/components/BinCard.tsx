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
        width: (width - designTokens.spacing.lg * 2 - designTokens.spacing.sm) / 2,
        height: 70,
        backgroundColor: designTokens.colors.backgroundSecondary,
        borderRadius: designTokens.radius.md * 1.34,
        marginBottom: designTokens.spacing.sm * 1.34,
        borderWidth: 1,
        borderColor: designTokens.colors.border,
      }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.content, {
        paddingHorizontal: designTokens.spacing.md * 1.34,
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
            color: designTokens.colors.accent,
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