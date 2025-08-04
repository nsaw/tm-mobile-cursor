import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';

export interface BottomNavItem {
  id: string;
  label: string;
  icon: string;
  route: string;
}

export interface BottomNavProps {
  items: BottomNavItem[];
  activeRoute: string;
  onRouteChange: (route: string) => void;
  style?: any;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  items,
  activeRoute,
  onRouteChange,
  style,
}) => {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    container: {
      backgroundColor: theme.colors.surface,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
      flexDirection: 'row',
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs,
    },
    item: {
      flex: 1,
      alignItems: 'center',
      paddingVertical: theme.spacing.sm,
      borderRadius: 8,
    },
    activeItem: {
      backgroundColor: theme.colors.accent,
    },
    icon: {
      fontSize: 20,
      marginBottom: theme.spacing.xs,
    },
    activeIcon: {
      color: theme.colors.onAccent,
    },
    inactiveIcon: {
      color: theme.colors.textSecondary,
    },
    label: {
      fontSize: theme.typography.fontSize.caption,
      fontWeight: theme.typography.fontWeight.medium as any,
    },
    activeLabel: {
      color: theme.colors.onAccent,
    },
    inactiveLabel: {
      color: theme.colors.textSecondary,
    },
  });

  return (
    <View style={[styles.container, style]}>
      {items.map((item) => {
        const isActive = activeRoute === item.route;
        return (
          <TouchableOpacity
            key={item.id}
            style={[styles.item, isActive && styles.activeItem]}
            onPress={() => onRouteChange(item.route)}
            activeOpacity={0.7}
          >
            <Text style={[
              styles.icon,
              isActive ? styles.activeIcon : styles.inactiveIcon
            ]}>
              {item.icon}
            </Text>
            <Text style={[
              styles.label,
              isActive ? styles.activeLabel : styles.inactiveLabel
            ]}>
              {item.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}; 