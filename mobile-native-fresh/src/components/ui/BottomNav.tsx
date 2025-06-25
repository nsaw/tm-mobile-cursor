import React from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Dimensions,
  Platform,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Brain } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, spacing, typography } from '../../theme/theme';

const { width } = Dimensions.get('window');

interface BottomNavProps {
  onNavigate: (path: string) => void;
  onVoiceRecord?: () => void;
  showCreateButton?: boolean;
  currentRoute?: string;
  onCreateNew?: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  onNavigate,
  onVoiceRecord,
  showCreateButton = true,
  currentRoute = '/',
  onCreateNew,
}) => {
  const insets = useSafeAreaInsets();

  const handleAIToolsClick = () => {
    // TODO: Check if user is premium
    onNavigate('/ai-tools');
  };

  const navItems = [
    { icon: 'home-outline', label: 'Home', path: '/', iconType: 'material' },
    { icon: 'magnify', label: 'Search', path: '/search', iconType: 'material' },
    { icon: 'microphone-outline', label: 'Voice', action: 'voice', iconType: 'material' },
    { icon: 'crown-outline', label: 'AI', action: 'ai-tools', iconType: 'material' },
    { icon: 'brain', label: 'All', path: '/all-thoughtmarks', iconType: 'lucide' },
  ];

  const renderIcon = (item: any, isActive: boolean, isHome: boolean, isVoice: boolean) => {
    const iconColor = isHome
      ? '#007AFF' // Always blue for Home
      : isActive
      ? '#007AFF' // Blue active tint for other active items
      : isVoice
      ? '#FF3B30' // Red tint for Voice
      : item.action === 'ai-tools'
      ? '#FFD700' // Gold tint for AI
      : '#8E8E93'; // Light gray for inactive

    if (item.iconType === 'lucide') {
      return (
        <Brain
          size={27}
          strokeWidth={2}
          color={iconColor}
        />
      );
    }

    return (
      <MaterialCommunityIcons
        name={item.icon as any}
        size={32}
        color={iconColor}
      />
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.navBackground}>
        <View style={styles.navContent}>
          {navItems.map((item, index) => {
            const { icon, label, path, action, iconType } = item;
            const isActive = currentRoute === path;
            const isVoice = action === 'voice';
            const isHome = path === '/';

            return (
              <TouchableOpacity
                key={path || action || label}
                style={[
                  styles.navButton,
                  isActive && styles.activeNavButton,
                ]}
                onPress={() => {
                  if (isVoice && onVoiceRecord) {
                    onVoiceRecord();
                  } else if (action === 'ai-tools') {
                    handleAIToolsClick();
                  } else if (path) {
                    onNavigate(path);
                  }
                }}
                accessibilityRole="button"
                accessibilityLabel={`${label} ${isActive ? 'selected' : ''}`}
              >
                {renderIcon(item, isActive, isHome, isVoice)}
                {isActive && <View style={styles.activeGlow} />}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Floating New Thoughtmark Button */}
      {showCreateButton && currentRoute !== '/' && (
        <View style={[styles.fabWrapper, { bottom: (insets.bottom + 40) * 1.34 }]}>
          <View style={styles.fabRing}>
            <TouchableOpacity
              style={styles.fab}
              onPress={() => {
                if (onCreateNew) {
                  onCreateNew();
                } else {
                  onNavigate('/create');
                }
              }}
              accessibilityRole="button"
              accessibilityLabel="Create new thoughtmark"
            >
              <MaterialCommunityIcons name="plus" size={47} color="#007AFF" />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    maxWidth: 440,
    alignSelf: 'center',
    width: '100%',
    zIndex: 2000,
    paddingBottom: 0,
  },
  navBackground: {
    backgroundColor: 'rgba(24, 24, 24, 0.95)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    // Cross-platform shadow
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: {
          width: 0,
          height: -2,
        },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 12,
      },
    }),
  },
  navContent: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: spacing.lg,
    minHeight: 107,
  },
  navButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 11,
    paddingHorizontal: 11,
    borderRadius: 11,
    backgroundColor: 'transparent',
    minHeight: 59,
    minWidth: 59,
    position: 'relative',
  },
  activeNavButton: {
    backgroundColor: 'transparent',
  },
  activeGlow: {
    position: 'absolute',
    top: -2,
    left: -2,
    right: -2,
    bottom: -2,
    borderRadius: 10,
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(0, 122, 255, 0.3)',
  },
  fabWrapper: {
    position: 'absolute',
    left: '50%',
    transform: [{ translateX: -43 }],
    zIndex: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fabRing: {
    width: 83,
    height: 83,
    borderRadius: 56,
    padding: 4,
    backgroundColor: 'rgba(0, 122, 255, 0.9)',
    borderWidth: 4,
    borderColor: 'rgba(0, 122, 255, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    // Cross-platform shadow
    ...Platform.select({
      ios: {
        shadowColor: '#007AFF',
        shadowOffset: {
          width: 0,
          height: 0,
        },
        shadowOpacity: 0.6,
        shadowRadius: 32,
      },
      android: {
        elevation: 27,
      },
    }),
  },
  fab: {
    width: 78,
    height: 78,
    borderRadius: 21,
    backgroundColor: '#0A0A0A',
    alignItems: 'center',
    justifyContent: 'center',
    // Cross-platform shadow
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: {
          width: 0,
          height: 5,
        },
        shadowOpacity: 0.4,
        shadowRadius: 16,
      },
      android: {
        elevation: 16,
      },
    }),
  },
}); 