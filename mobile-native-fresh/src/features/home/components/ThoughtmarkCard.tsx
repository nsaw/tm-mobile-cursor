import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Vibration,
  ViewStyle,
  Animated,
  ScrollView,
} from 'react-native';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { colors, spacing, typography } from '../../../theme/theme';
import { designTokens } from '../../../theme/tokens';
import { TagChip } from '../../../components/ui/TagChip';
import { ActionSheet } from '../../../components/ui/ActionSheet';
import { ThoughtmarkWithBin } from '../../../types';

interface ThoughtmarkCardProps {
  thoughtmark: any;
  onClick?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onArchive?: () => void;
  selected?: boolean;
  pinned?: boolean;
  similarity?: number;
  onSelectionToggle?: () => void;
  onPinToggle?: (thoughtmarkId: string, pinned: boolean) => void;
  style?: ViewStyle;
}

// PinIcon component with animation
const PinIcon: React.FC<{ pinned: boolean; onPress: () => void }> = ({ pinned, onPress }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePress = () => {
    // Animate scale on press
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.2,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
    
    onPress();
  };

  return (
    <TouchableOpacity 
      onPress={handlePress} 
      style={styles.pinButton}
      activeOpacity={0.7}
    >
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <FontAwesome
          name="thumb-tack"
          size={20}
          color={pinned ? 'rgba(0, 122, 255, 0.6)' : 'rgba(255, 255, 255, 0.3)'}
        />
      </Animated.View>
    </TouchableOpacity>
  );
};

export const ThoughtmarkCard: React.FC<ThoughtmarkCardProps> = ({
  thoughtmark,
  onEdit,
  onDelete,
  onArchive,
  onClick,
  selected,
  pinned,
  similarity,
  onSelectionToggle,
  onPinToggle,
  style,
}: ThoughtmarkCardProps) => {
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
    if (selected && onSelectionToggle) {
      onSelectionToggle();
    } else if (onClick) {
      onClick();
    }
  };

  const handleTogglePin = async () => {
    try {
      // Call the onPinToggle callback if provided
      if (onPinToggle) {
        onPinToggle(thoughtmark.id, !pinned);
      } else {
        // Fallback to the old implementation
        // TODO: Implement API call to toggle pin status
        // await apiRequest("POST", `/api/thoughtmarks/${thoughtmark.id}/toggle-pin`);
        Alert.alert(
          pinned ? "Unpinned" : "Pinned",
          `Thoughtmark ${pinned ? "unpinned from" : "pinned to"} top`
        );
      }
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
      label: pinned ? 'Unpin' : 'Pin to top',
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
          pinned && styles.pinned,
          selected && styles.selected,
          style,
        ]}
        onPress={handleCardPress}
        onLongPress={handleLongPress}
        onPressOut={handlePressOut}
        activeOpacity={0.7}
      >
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            {/* Left: Checkbox */}
            <View style={styles.headerLeft}>
              <PinIcon pinned={pinned || false} onPress={handleTogglePin} />
              {selected && (
                <TouchableOpacity
                  style={styles.checkbox}
                  onPress={() => onSelectionToggle?.()}
                >
                  <Ionicons
                    name={selected ? 'checkbox' : 'square-outline'}
                    size={16}
                    color={colors.primary}
                  />
                </TouchableOpacity>
              )}
            </View>

            {/* Center: Title */}
            <View style={styles.headerCenter}>
              <Text style={styles.title} numberOfLines={1}>
                {thoughtmark.title || 'Untitled'}
              </Text>
            </View>

            {/* Right: Date, Similarity, Dropdown */}
            <View style={styles.headerRight}>
              {similarity !== undefined && (
                <View style={styles.similarityBadge}>
                  <Text style={styles.similarityText}>
                    {Math.round(similarity * 100)}% match
                  </Text>
                </View>
              )}
              <Text style={styles.date}>
                {formatDate(thoughtmark.createdAt)}
              </Text>
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
            {thoughtmark.content || 'No content'}
          </Text>

          {/* Footer */}
          <View style={styles.footer}>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={styles.tagsScrollView}
              contentContainerStyle={styles.tagsContainer}
            >
              {(thoughtmark.tags || []).map((tag: string) => (
                <TagChip key={tag} tag={tag} size="sm" />
              ))}
            </ScrollView>
            
            {thoughtmark.binName && thoughtmark.binName.trim() && (
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
    borderRadius: 11,
    padding: spacing.sm * 1.34,
    borderWidth: 1,
    borderColor: colors.border,
    position: 'relative',
  },
  pinned: {
    borderColor: colors.border,
    borderWidth: 1,
  },
  selected: {
    backgroundColor: colors.primary + '20',
    borderColor: colors.border,
    borderWidth: 1,
  },
  pinButton: {
    marginRight: spacing.xs,
    padding: 2,
  },
  content: {
    marginTop: spacing.xs * 1.34,
    marginLeft: 0,
    color: colors.subtext,
    fontSize: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    justifyContent: 'space-between',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: spacing.sm * 1.34,
  },
  headerCenter: {
    flex: 1,
    justifyContent: 'center',
    marginRight: spacing.sm * 1.34,
  },
  title: {
    fontSize: 20,
    fontWeight: '500',
    color: colors.text,
    textAlign: 'left',
    paddingLeft: 0,
    fontFamily: 'Ubuntu_500Medium',
    textTransform: 'capitalize',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 0,
    marginLeft: 'auto',
  },
  similarityBadge: {
    backgroundColor: '#C6D60020',
    paddingHorizontal: spacing.sm * 1.34,
    paddingVertical: spacing.xs * 1.34,
    borderRadius: designTokens.radius.md * 1.34,
    marginRight: spacing.sm * 1.34,
  },
  similarityText: {
    fontSize: 10,
    color: '#C6D600',
    fontWeight: '600',
    fontFamily: 'Ubuntu_600SemiBold',
  },
  date: {
    fontSize: 10,
    color: colors.subtext,
    marginRight: 5,
    fontFamily: 'Ubuntu_400Regular',
  },
  contentText: {
    fontSize: typography.body.fontSize * 0.80,
    color: colors.subtext,
    marginBottom: 11,
    lineHeight: 28,
    fontWeight: '400',
    paddingLeft: 0,
    fontFamily: 'Ubuntu_400Regular',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  tagsScrollView: {
    flex: 1,
    marginRight: spacing.sm,
  },
  tagsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: spacing.sm,
  },
  binName: {
    fontSize: 10,
    color: colors.subtext,
    marginLeft: 11,
    fontFamily: 'Ubuntu_400Regular',
  },
  checkbox: {
    marginRight: spacing.xs * 1.34,
  },
  menuButton: {
    padding: spacing.xs * 1.34,
  },
});