import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Vibration,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../../../theme/theme';
import { TagChip } from '../../../components/ui/TagChip';
import { ActionSheet } from '../../../components/ui/ActionSheet';
import { ThoughtmarkWithBin } from '../../../types';

interface ThoughtmarkCardProps {
  thoughtmark: ThoughtmarkWithBin;
  onEdit?: () => void;
  onDelete?: () => void;
  onArchive?: () => void;
  onClick?: () => void;
  enableSwipeDelete?: boolean;
  showSimilarity?: boolean;
  similarity?: number;
  isSelectable?: boolean;
  isSelected?: boolean;
  onSelectionToggle?: (id: number) => void;
}

export const ThoughtmarkCard: React.FC<ThoughtmarkCardProps> = ({
  thoughtmark,
  onEdit,
  onDelete,
  onArchive,
  onClick,
  enableSwipeDelete = false,
  showSimilarity = false,
  similarity,
  isSelectable = false,
  isSelected = false,
  onSelectionToggle,
}) => {
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [isLongPressing, setIsLongPressing] = useState(false);

  const handleLongPress = () => {
    Vibration.vibrate(50);
    setIsLongPressing(true);
    setTimeout(() => {
      if (isLongPressing) {
        setShowContextMenu(true);
      }
    }, 500);
  };

  const handlePressOut = () => {
    setIsLongPressing(false);
  };

  const handleCardPress = () => {
    if (isSelectable && onSelectionToggle) {
      onSelectionToggle(thoughtmark.id);
    } else if (onClick) {
      onClick();
    }
  };

  const handleTogglePin = async () => {
    try {
      // TODO: Implement API call to toggle pin status
      // await apiRequest("POST", `/api/thoughtmarks/${thoughtmark.id}/toggle-pin`);
      Alert.alert(
        thoughtmark.isPinned ? "Unpinned" : "Pinned",
        `Thoughtmark ${thoughtmark.isPinned ? "unpinned from" : "pinned to"} top`
      );
    } catch (error) {
      Alert.alert("Error", "Failed to update pin status");
    }
  };

  const handleShare = () => {
    // TODO: Implement share functionality
    Alert.alert("Share", "Share functionality coming soon!");
  };

  const formatDate = (dateString: string) => {
    if (!dateString || isNaN(new Date(dateString).getTime())) {
      return new Date().toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
    }

    const createdDate = new Date(dateString);
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    // Show day of the week for items created within the last 7 days
    if (createdDate >= sevenDaysAgo) {
      return createdDate.toLocaleDateString('en-US', { 
        weekday: 'short'
      });
    }

    // Show date for older items
    return createdDate.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: createdDate.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  };

  const contextMenuItems = [
    {
      label: 'View',
      icon: 'eye-outline',
      onPress: onClick || (() => {}),
    },
    ...(onEdit ? [{
      label: 'Edit',
      icon: 'create-outline',
      onPress: onEdit,
    }] : []),
    {
      label: thoughtmark.isPinned ? 'Unpin' : 'Pin to top',
      icon: 'pin-outline',
      onPress: handleTogglePin,
    },
    {
      label: 'Share',
      icon: 'share-outline',
      onPress: handleShare,
    },
    ...(onArchive ? [{
      label: 'Archive',
      icon: 'archive-outline',
      onPress: onArchive,
    }] : []),
  ];

  return (
    <>
      <TouchableOpacity
        style={[
          styles.container,
          thoughtmark.isPinned && styles.pinned,
          isSelected && styles.selected,
        ]}
        onPress={handleCardPress}
        onLongPress={handleLongPress}
        onPressOut={handlePressOut}
        activeOpacity={0.7}
      >
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              {isSelectable && (
                <TouchableOpacity
                  style={styles.checkbox}
                  onPress={() => onSelectionToggle?.(thoughtmark.id)}
                >
                  <Ionicons
                    name={isSelected ? 'checkbox' : 'square-outline'}
                    size={16}
                    color={colors.primary}
                  />
                </TouchableOpacity>
              )}
            </View>

            <Text style={styles.title} numberOfLines={1}>
              {thoughtmark.title}
            </Text>

            <View style={styles.headerRight}>
              {showSimilarity && similarity !== undefined && (
                <View style={styles.similarityBadge}>
                  <Text style={styles.similarityText}>
                    {Math.round(similarity * 100)}% match
                  </Text>
                </View>
              )}
              
              <Text style={styles.date}>
                {formatDate(thoughtmark.createdAt)}
              </Text>
              
              {thoughtmark.isPinned && (
                <Ionicons
                  name="pin"
                  size={12}
                  color={colors.primary}
                />
              )}
              
              <TouchableOpacity
                style={styles.menuButton}
                onPress={() => setShowContextMenu(true)}
              >
                <Ionicons
                  name="ellipsis-vertical"
                  size={16}
                  color={colors.subtext}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Content */}
          <Text style={styles.contentText} numberOfLines={2}>
            {thoughtmark.content}
          </Text>

          {/* Footer */}
          <View style={styles.footer}>
            <View style={styles.tagsContainer}>
              {thoughtmark.tags.map((tag) => (
                <TagChip key={tag} tag={tag} />
              ))}
            </View>
            
            {thoughtmark.binName && (
              <Text style={styles.binName}>
                {thoughtmark.binName}
              </Text>
            )}
          </View>
        </View>
      </TouchableOpacity>

      <ActionSheet
        visible={showContextMenu}
        onClose={() => setShowContextMenu(false)}
        items={contextMenuItems}
        title="Thoughtmark Options"
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.card,
    borderRadius: 8,
    marginVertical: 4,
    borderWidth: 0,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  pinned: {
    borderColor: colors.primary,
    borderWidth: 2,
  },
  selected: {
    backgroundColor: colors.primary + '20',
    borderColor: colors.primary,
  },
  content: {
    padding: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  checkbox: {
    marginRight: spacing.xs,
  },
  menuButton: {
    padding: spacing.xs,
  },
  title: {
    ...typography.body,
    fontSize: typography.body.fontSize * 0.9,
    color: colors.text,
    fontWeight: '600',
    flex: 1,
    marginHorizontal: 0,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 0,
  },
  similarityBadge: {
    backgroundColor: '#C6D60020',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 12,
    marginRight: spacing.sm,
  },
  similarityText: {
    fontSize: 10,
    color: '#C6D600',
    fontWeight: '600',
  },
  date: {
    fontSize: 10,
    color: colors.subtext,
    marginRight: 4,
  },
  contentText: {
    fontSize: typography.body.fontSize * 0.65,
    color: colors.subtext,
    marginBottom: 8,
    lineHeight: 16,
    fontWeight: '400',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    flex: 1,
  },
  binName: {
    fontSize: 10,
    color: colors.subtext,
    marginLeft: 8,
  },
});