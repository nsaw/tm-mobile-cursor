import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';
import { IconWrapper } from '../infrastructure/IconWrapper';
import { useTheme } from '../theme/ThemeProvider';
import { AutoRoleView } from './AutoRoleView';
import { Bin } from '../hooks/useBins';

export interface BinCardProps {
  bin: Bin;
  onPress?: () => void;
  style?: ViewStyle;
}

export const BinCard: React.FC<BinCardProps> = ({
  bin,
  onPress,
  style
}) => {
  const { theme } = useTheme();

  const cardStyle = [
    styles.card,
    {
      backgroundColor: theme.colors.surface,
      borderColor: theme.colors.outline,
    },
    style
  ];

  const titleStyle = [
    styles.title,
    { color: theme.colors.onSurface }
  ];

  const descriptionStyle = [
    styles.description,
    { color: theme.colors.onSurfaceVariant }
  ];

  const metaStyle = [
    styles.meta,
    { color: theme.colors.onSurfaceVariant }
  ];

  return (
    <TouchableOpacity
      style={cardStyle}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <AutoRoleView role="card">
        <Text style={titleStyle}>{bin.name}</Text>
        {bin.description && (
          <Text style={descriptionStyle}>{bin.description}</Text>
        )}
        <AutoRoleView role="content" style={styles.metaContainer}>
          <AutoRoleView role="item" style={styles.metaItem}>
            <IconWrapper
              name="MaterialCommunityIcons"
              iconName="file-document-outline"
              size={16}
              color={theme.colors.onSurfaceVariant}
            />
            <Text style={metaStyle}>{bin.thoughtmarkCount} thoughtmarks</Text>
          </AutoRoleView>
          <AutoRoleView role="item" style={styles.metaItem}>
            <IconWrapper
              name="MaterialCommunityIcons"
              iconName={bin.isPrivate ? 'lock' : 'lock-open-variant'}
              size={16}
              color={theme.colors.onSurfaceVariant}
            />
            <Text style={metaStyle}>{bin.isPrivate ? 'Private' : 'Public'}</Text>
          </AutoRoleView>
          {bin.isCollaborative && (
            <AutoRoleView role="item" style={styles.metaItem}>
              <IconWrapper
                name="MaterialCommunityIcons"
                iconName="account-group"
                size={16}
                color={theme.colors.onSurfaceVariant}
              />
              <Text style={metaStyle}>Collaborative</Text>
            </AutoRoleView>
          )}
        </AutoRoleView>
      </AutoRoleView>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginVertical: 8,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    marginBottom: 12,
    lineHeight: 20,
  },
  metaContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  meta: {
    fontSize: 12,
    fontWeight: '500',
  },
}); 