import {
  View,
  TouchableOpacity,
  Alert,
  Vibration,
  ViewStyle,
  Animated,
  ScrollView
} from 'react-native';
import React, { useState, useRef } from 'react';
import { Ionicons, FontAwesome } from '@expo/vector-icons';

import { Text } from '../../../components/ui/Text';
import { useTheme } from '../../../theme/ThemeProvider';
import { TagChip } from '../../../components/ui/TagChip';
import { ActionSheet } from '../../../components/ui/ActionSheet';

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
  const { tokens } = useTheme();
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePress = () => {
    // Animate scale on press
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.2,
        duration: 100,
        useNativeDriver: true
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true
      }),
    ]).start();
    
    onPress();
  };

  return (
    <TouchableOpacity 
      onPress={handlePress} 
      style={{ marginRight: tokens.spacing.xs, padding: 2 }}
      activeOpacity={0.7}
      accessibilityRole="button"
    >
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <FontAwesome
          name="thumb-tack"
          size={20}
          color={pinned ? `${tokens.colors.accent}99` : `${tokens.colors.text}4D`}
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
  style
}: ThoughtmarkCardProps) => {
  const { tokens } = useTheme();
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
    };
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
      onPress: onClick || (() => {})
    },
    ...(onEdit ? [{
      label: 'Edit',
      icon: 'create-outline',
      onPress: onEdit
    }] : []),
    {
      label: pinned ? 'Unpin' : 'Pin to top',
      icon: 'pin-outline',
      onPress: handleTogglePin
    },
    {
      label: 'Share',
      icon: 'share-outline',
      onPress: handleShare
    },
    ...(onArchive ? [{
      label: 'Archive',
      icon: 'archive-outline',
      onPress: onArchive
    }] : []),
  ];

  return (
    <>
      <TouchableOpacity
        style={[
          {
            backgroundColor: selected 
              ? `${tokens.colors.accent}33` 
              : tokens.colors.backgroundSecondary,
            borderRadius: tokens.radius.sm,
            padding: tokens.spacing.sm,
            borderWidth: 1,
            borderColor: tokens.colors.border,
            position: 'relative'
          },
          style,
        ]}
        onPress={handleCardPress}
        onLongPress={handleLongPress}
        onPressOut={handlePressOut}
        activeOpacity={0.7}
        accessibilityRole="button"
      >
        <View style={{ marginTop: tokens.spacing.xs, marginLeft: 0 }}>
          {/* Header */}
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 8,
            justifyContent: 'space-between'
          }}>
            {/* Left: Checkbox */}
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginRight: tokens.spacing.sm
            }}>
              <PinIcon pinned={pinned || false} onPress={handleTogglePin} />
              {selected && (
                <TouchableOpacity
                  style={{ marginRight: tokens.spacing.xs }}
                  onPress={() => onSelectionToggle?.()} accessibilityRole="button" >
                  <Ionicons
                    name={selected ? 'checkbox' : 'square-outline'}
                    size={16}
                    color={tokens?.colors?.accent ?? "#000000"}
                  />
                </TouchableOpacity>
              )}
            </View>

            {/* Center: Title */}
            <View style={{
              flex: 1,
              justifyContent: 'center',
              marginRight: tokens.spacing.sm
            }}>
              <Text 
                size="md"
                weight="medium"
                style={{ 
                  textAlign: 'left',
                  textTransform: 'capitalize',
                  fontSize: tokens.typography.fontSize.sm + 2
                }}
                numberOfLines={1}
              >
                {thoughtmark.title || 'Untitled'}
              </Text>
            </View>

            {/* Right: Date, Similarity, Dropdown */}
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              flexShrink: 0,
              marginLeft: 'auto'
            }}>
              {similarity !== undefined && (
                <View style={{
                  backgroundColor: `${tokens.colors.brand}33`,
                  paddingHorizontal: tokens.spacing.sm,
                  paddingVertical: tokens.spacing.xs,
                  borderRadius: tokens.radius.md,
                  marginRight: tokens.spacing.sm
                }}>
                  <Text 
                    size="xs"
                    style={{ 
                      color: tokens.colors.brand,
                      fontWeight: '600'
                    }}
                  >
                    {Math.round(similarity * 100)}% match
                  </Text>
                </View>
              )}
              <Text 
                size="xs"
                style={{ 
                  marginRight: 5
                }}
              >
                {formatDate(thoughtmark.createdAt)}
              </Text>
              <TouchableOpacity
                style={{ padding: tokens.spacing.xs }}
                onPress={() => setShowContextMenu(true)} accessibilityRole="button" >
                <Ionicons
                  name="ellipsis-vertical"
                  size={16}
                  color={tokens?.colors?.textMuted ?? "#000000"}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Content */}
          <Text 
            variant="body" 
            style={{ 
              marginBottom: 11,
              lineHeight: 28,
              fontSize: tokens.typography.fontSize.sm + 1
            }}
            numberOfLines={2}
          >
            {thoughtmark.content || 'No content'}
          </Text>

          {/* Footer */}
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'flex-end'
          }}>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={{ flex: 1, marginRight: tokens.spacing.sm }}
              contentContainerStyle={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingRight: tokens.spacing.sm
              }}
            >
              {(thoughtmark.tags || []).map((tag: string) => (
                <TagChip key={tag} tag={tag} />
              ))}
            </ScrollView>
            
            {thoughtmark.binName && thoughtmark.binName.trim() && (
              <Text 
                size="xs"
                style={{ marginLeft: 11 }}
              >
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