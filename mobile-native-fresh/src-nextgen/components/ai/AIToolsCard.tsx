import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useTheme } from '../../theme/ThemeProvider';
import { useAppStore } from '../../state/store';

interface AIToolsCardProps {
  onPress: () => void;
}

export const AIToolsCard: React.FC<AIToolsCardProps> = ({ onPress }) => {
  const { tokens: _tokens } = useTheme();
  const { user } = useAppStore();

  const isPremium = user?.isPremium || user?.isTestUser;

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      accessibilityRole='button'
      accessible={true}
      accessibilityLabel='AI Tools card'
    >
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Ionicons name='crown' size={24} color='#FFD700' />
        </View>
        <View style={styles.content}>
          <Text style={styles.title}>AI Tools</Text>
          <Text style={styles.subtitle}>
            {isPremium ? 'Unlock AI-powered features' : 'Upgrade to Premium'}
          </Text>
        </View>
        <Ionicons name='chevron-forward' size={20} color='#666666' />
      </View>
      {!isPremium && (
        <View style={styles.premiumBadge}>
          <Text style={styles.premiumText}>PREMIUM</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#333333',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#2A2A2A',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#CCCCCC',
  },
  premiumBadge: {
    backgroundColor: '#FFD700',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  premiumText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#000000',
  },
});
