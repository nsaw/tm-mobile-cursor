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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SvgXml } from 'react-native-svg';
import { colors, spacing, typography } from '../../../theme/theme';
import { designTokens } from '../../../theme/tokens';
import { TagChip } from '../../../components/ui/TagChip';
import { ActionSheet } from '../../../components/ui/ActionSheet';
import { ThoughtmarkWithBin } from '../../../types';

// Keep icon SVG content
const keepIconSvg = `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="m640-480 80 80v80H520v240l-40 40-40-40v-240H240v-80l80-80v-280h-40v-80h400v80h-40v280Zm-286 80h252l-46-46v-314H400v314l-46 46Zm126 0Z"/></svg>`;

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
        <SvgXml
          xml={keepIconSvg}
          width={20}
          height={20}
          style={{
            opacity: pinned ? 0.4 : 0.15,
          }}
          fill={pinned ? 'rgba(0,122,255,1)' : '#ffffff'}
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
        {/* Interactive Pin Icon - Always visible */}
        <PinIcon pinned={pinned || false} onPress={handleTogglePin} />
        
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            {/* Left: Checkbox */}
            <View style={styles.headerLeft}>
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
            <View style={styles.tagsContainer}>
              {(thoughtmark.tags || []).map((tag: string) => (
                <TagChip key={tag} tag={tag} size="sm" />
              ))}
            </View>
            
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
    borderRadius: 8,
    padding: spacing.sm,
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
    position: 'absolute',
    top: 8,
    right: 8,
    zIndex: 10,
    padding: 4,
  },
  content: {
    marginTop: spacing.xs,
    marginLeft: 0,
    color: colors.subtext,
    fontSize: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    justifyContent: 'space-between',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  headerCenter: {
    flex: 1,
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  title: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
    textAlign: 'left',
    paddingLeft: 0,
    fontFamily: 'Ubuntu_500Medium',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 0,
    marginLeft: 'auto',
  },
  similarityBadge: {
    backgroundColor: '#C6D60020',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: designTokens.radius.md,
    marginRight: spacing.sm,
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
    marginRight: 4,
    fontFamily: 'Ubuntu_400Regular',
  },
  contentText: {
    fontSize: typography.body.fontSize * 0.65,
    color: colors.subtext,
    marginBottom: 8,
    lineHeight: 16,
    fontWeight: '400',
    paddingLeft: 0,
    fontFamily: 'Ubuntu_400Regular',
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
    fontFamily: 'Ubuntu_400Regular',
  },
  checkbox: {
    marginRight: spacing.xs,
  },
  menuButton: {
    padding: spacing.xs,
  },
});