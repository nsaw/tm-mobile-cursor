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
              >
                {iconType === 'lucide' ? (
                  <Brain
                    size={20}
                    strokeWidth={2}
                    color={
                      isHome
                        ? '#007AFF' // Always blue for Home
                        : isActive
                        ? '#007AFF' // Blue active tint for other active items
                        : isVoice
                        ? '#FF3B30' // Red tint for Voice
                        : action === 'ai-tools'
                        ? '#FFD700' // Gold tint for AI
                        : '#8E8E93' // Light gray for inactive
                    }
                  />
                ) : (
                  <MaterialCommunityIcons
                    name={icon as any}
                    size={24}
                    color={
                      isHome
                        ? '#007AFF' // Always blue for Home
                        : isActive
                        ? '#007AFF' // Blue active tint for other active items
                        : isVoice
                        ? '#FF3B30' // Red tint for Voice
                        : action === 'ai-tools'
                        ? '#FFD700' // Gold tint for AI
                        : '#8E8E93' // Light gray for inactive
                    }
                  />
                )}
                {isActive && <View style={styles.activeGlow} />}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Floating New Thoughtmark Button */}
      {showCreateButton && currentRoute !== '/' && (
        <View style={[styles.fabWrapper, { bottom: insets.bottom + 40 }]}>
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
            >
              <MaterialCommunityIcons name="plus" size={26} color="#007AFF" />
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
    paddingVertical: 12,
    paddingHorizontal: spacing.lg,
    minHeight: 80,
  },
  navButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 8,
    backgroundColor: 'transparent',
    minHeight: 44,
    minWidth: 44,
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
    transform: [{ translateX: -32 }],
    zIndex: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fabRing: {
    width: 62,
    height: 62,
    borderRadius: 42,
    padding: 3,
    backgroundColor: 'rgba(0, 122, 255, 0.9)',
    borderWidth: 3,
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
        shadowRadius: 24,
      },
      android: {
        elevation: 20,
      },
    }),
  },
  fab: {
    width: 58,
    height: 58,
    borderRadius: 16,
    backgroundColor: '#0A0A0A',
    alignItems: 'center',
    justifyContent: 'center',
    // Cross-platform shadow
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: {
          width: 0,
          height: 4,
        },
        shadowOpacity: 0.4,
        shadowRadius: 12,
      },
      android: {
        elevation: 12,
      },
    }),
  },
}); 