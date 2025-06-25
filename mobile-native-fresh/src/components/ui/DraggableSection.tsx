import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Vibration,
} from 'react-native';
import {
  PanGestureHandler,
  State,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../../theme/theme';

interface DraggableSectionProps {
  id: string;
  title: string;
  children: React.ReactNode;
  isExpanded: boolean;
  onToggle: () => void;
  onReorder?: (fromIndex: number, toIndex: number) => void;
  index: number;
  isDragging: boolean;
  onDragStart: (index: number) => void;
  onDragEnd: () => void;
  showViewAll?: boolean;
  onViewAll?: () => void;
  totalSections: number;
}

export const DraggableSection: React.FC<DraggableSectionProps> = ({
  id,
  title,
  children,
  isExpanded,
  onToggle,
  index,
  isDragging,
  onDragStart,
  onDragEnd,
  showViewAll = false,
  onViewAll,
  onReorder,
  totalSections,
}) => {
  const [isLongPressing, setIsLongPressing] = useState(false);
  const [isPressing, setIsPressing] = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const elevationAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;
  const panRef = useRef(null);

  const handleLongPress = () => {
    Vibration.vibrate(50);
    setIsLongPressing(true);
    onDragStart(index);
    
    // Animate scale and elevation for drag feedback
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 1.02,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(elevationAnim, {
        toValue: 8,
        duration: 200,
        useNativeDriver: false,
      }),
    ]).start();
  };

  const handlePressOut = () => {
    if (isLongPressing) {
      setIsLongPressing(false);
      onDragEnd();
      
      // Reset animations
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(elevationAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: false,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
    
    // Reset press animation
    if (isPressing) {
      setIsPressing(false);
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }).start();
    }
  };

  const handlePress = () => {
    if (!isLongPressing) {
      // Add subtle press feedback
      setIsPressing(true);
      Animated.timing(opacityAnim, {
        toValue: 0.7,
        duration: 100,
        useNativeDriver: true,
      }).start();
      
      // Navigate to view all if available, otherwise toggle
      if (showViewAll && onViewAll) {
        onViewAll();
      } else {
        onToggle();
      }
    }
  };

  const onGestureEvent = Animated.event(
    [{ nativeEvent: { translationY: translateY } }],
    { useNativeDriver: true }
  );

  const onHandlerStateChange = (event: any) => {
    if (event.nativeEvent.state === State.END) {
      // Calculate new position based on translation
      const translationY = event.nativeEvent.translationY;
      const sectionHeight = 100; // Approximate section height
      const newIndex = Math.max(0, Math.min(totalSections - 1, 
        Math.round(index + translationY / sectionHeight)
      ));
      
      if (newIndex !== index && onReorder) {
        onReorder(index, newIndex);
      }
      
      // Reset position
      Animated.timing(translateY, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
      
      handlePressOut();
    }
  };

  return (
    <GestureHandlerRootView>
      <Animated.View
        style={[
          styles.container,
          {
            transform: [
              { scale: scaleAnim },
              { translateY: translateY }
            ],
            elevation: elevationAnim,
            shadowOpacity: elevationAnim.interpolate({
              inputRange: [0, 8],
              outputRange: [0, 0.3],
            }),
          },
          isDragging && styles.dragging,
        ]}
      >
        <PanGestureHandler
          ref={panRef}
          onGestureEvent={onGestureEvent}
          onHandlerStateChange={onHandlerStateChange}
          enabled={isLongPressing}
        >
          <Animated.View>
            <TouchableOpacity
              style={styles.sectionHeader}
              onPress={handlePress}
              onLongPress={handleLongPress}
              onPressOut={handlePressOut}
              activeOpacity={1} // We handle opacity manually
              delayLongPress={500}
            >
              <View style={styles.headerLeft}>
                <Ionicons name="chevron-down" size={16} color={colors.subtext} style={styles.chevronIcon} />
                <Animated.Text style={[styles.sectionTitle, { opacity: opacityAnim }]}>
                  {title}
                </Animated.Text>
              </View>
              
              <View style={styles.headerRight}>
                <Ionicons name="menu-outline" size={16} color={colors.subtext} style={styles.dragHandle} />
              </View>
            </TouchableOpacity>

            {isExpanded && (
              <View style={styles.sectionContent}>
                {children}
              </View>
            )}
          </Animated.View>
        </PanGestureHandler>
      </Animated.View>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.lg,
    backgroundColor: 'transparent', // Removed custom background color
    borderRadius: 8,
  },
  dragging: {
    opacity: 0.8,
    zIndex: 1000,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg, // Added horizontal padding
    paddingBottom: spacing.sm, // Reduced bottom padding
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  chevronIcon: {
    marginRight: spacing.sm,
  },
  sectionTitle: {
    fontSize: typography.subheading.fontSize,
    fontWeight: '700',
    color: colors.text,
    letterSpacing: 0.5,
    fontFamily: 'Ubuntu_700Bold',
    flex: 1,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionContent: {
    paddingHorizontal: spacing.lg, // Added horizontal padding
    paddingBottom: spacing.md,
  },
  dragHandle: {
    marginLeft: spacing.sm,
  },
}); 