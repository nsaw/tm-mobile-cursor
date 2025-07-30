import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

import { ThoughtmarkWithBin } from '../types/Thoughtmark';
import { useTheme } from '../hooks/useTheme';

interface ThoughtmarkCardProps {
  thoughtmark: ThoughtmarkWithBin;
  onPress: () => void;
  style?: any;
}

export const ThoughtmarkCard: React.FC<ThoughtmarkCardProps> = ({
  thoughtmark,
  onPress,
  style,
}) => {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: colors.surface }, style]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Thoughtmark: ${thoughtmark.title}`}
      accessibilityHint="Tap to view thoughtmark details"
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>
          {thoughtmark.title}
        </Text>
        {thoughtmark.isFavorite && (
          <Text style={[styles.favorite, { color: colors.primary }]}>
            ★
          </Text>
        )}
      </View>
      
      <Text 
        style={[styles.content, { color: colors.textSecondary }]}
        numberOfLines={3}
      >
        {thoughtmark.content}
      </Text>
      
      <View style={styles.footer}>
        <Text style={[styles.binName, { color: colors.textSecondary }]}>
          {thoughtmark.binName || 'No Bin'}
        </Text>
        <Text style={[styles.date, { color: colors.textSecondary }]}>
          {new Date(thoughtmark.createdAt).toLocaleDateString()}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  binName: {
    fontSize: 12,
    fontWeight: '500',
  },
  card: {
    borderRadius: 8,
    elevation: 5,
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  content: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  date: {
    fontSize: 12,
  },
  favorite: {
    fontSize: 16,
    marginLeft: 8,
  },
  footer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  title: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
  },
}); 