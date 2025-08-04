import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
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
  const { theme } = useTheme();

  const navItems = [
    {
      id: 'home',
      label: 'Home',
      iconName: 'home',
      route: 'Home'
    },
    {
      id: 'search',
      label: 'Search',
      iconName: 'search',
      route: 'Search'
    },
    {
      id: 'bins',
      label: 'Bins',
      iconName: 'folder',
      route: 'AllBins'
    },
    {
      id: 'profile',
      label: 'Profile',
      iconName: 'person',
      route: 'Profile'
    }
  ];

  return (
    <AutoRoleView
      role="navigation"
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      {navItems.map((item) => (
        <TouchableOpacity
          key={item.id}
          style={styles.navItem}
          onPress={() => onNavigate(item.route)}
          activeOpacity={0.7}
        >
          <IconWrapper
            name="Ionicons"
            iconName={item.iconName}
            size={24}
            color={currentRoute === item.route ? theme.colors.primary : theme.colors.textSecondary}
          />
          <Text
            style={[
              styles.navLabel,
              {
                color: currentRoute === item.route ? theme.colors.primary : theme.colors.textSecondary
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