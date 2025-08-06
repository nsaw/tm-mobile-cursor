import React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import { IconWrapper } from '../infrastructure/IconWrapper';
import { useTheme } from '../theme/ThemeProvider';
import { AutoRoleView } from './AutoRoleView';

export interface BottomNavProps {
  currentRoute: string;
  onNavigate: (route: string) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentRoute,
  onNavigate
}) => {
  const theme = useTheme();

  const navItems = [
    {
      id: 'home',
      label: 'Home',
      iconName: 'home'
    },
    {
      id: 'search',
      label: 'Search',
      iconName: 'search'
    },
    {
      id: 'bins',
      label: 'Bins',
      iconName: 'folder'
    },
    {
      id: 'profile',
      label: 'Profile',
      iconName: 'person'
    }
  ];

  return (
    <AutoRoleView
      componentRole="navigation"
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      {navItems.map((item) => (
        <TouchableOpacity
          key={item.id}
          style={styles.navItem}
          onPress={() => onNavigate(item.id)}
          accessibilityRole="button"
          accessible={true}
          accessibilityLabel={`${item.label} tab`}
          activeOpacity={0.7}
        >
          <IconWrapper
            name="Ionicons"
            iconName={item.iconName}
            size={24}
            color={currentRoute === item.id ? theme.colors.primary : theme.colors.textSecondary}
          />
          <Text
            style={[
              styles.navLabel,
              {
                color: currentRoute === item.id ? theme.colors.primary : theme.colors.textSecondary
              }
            ]}
          >
            {item.label}
          </Text>
        </TouchableOpacity>
      ))}
    </AutoRoleView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  navLabel: {
    fontSize: 12,
    marginTop: 4,
    fontWeight: '500',
  },
}); 