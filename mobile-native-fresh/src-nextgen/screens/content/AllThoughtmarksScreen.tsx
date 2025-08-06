import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { AutoRoleView } from '../../components/AutoRoleView';
import { DualMountToggle } from '../../components/DualMountToggle';

interface Thoughtmark {
  id: string;
  title: string;
  content: string;
  timestamp: string;
}

const mockThoughtmarks: Thoughtmark[] = [
  {
    id: '1',
    title: 'Welcome to Thoughtmarks',
    content: 'This is your first thoughtmark. Start organizing your ideas!',
    timestamp: '2025-01-29',
  },
  {
    id: '2',
    title: 'Project Ideas',
    content: 'Build a mobile app with React Native and Expo',
    timestamp: '2025-01-29',
  },
  {
    id: '3',
    title: 'Learning Notes',
    content: 'Study TypeScript, React Native, and mobile development',
    timestamp: '2025-01-29',
  },
];

export const AllThoughtmarksScreen: React.FC = () => {
  const theme = useTheme();

  const renderThoughtmark = ({ item }: { item: Thoughtmark }) => (
    <TouchableOpacity
      style={[styles.thoughtmarkCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}
      accessibilityRole="button"
      accessible={true}
      accessibilityLabel={`Thoughtmark: ${item.title}`}
    >
      <Text style={[styles.thoughtmarkTitle, { color: theme.colors.text }]}>{item.title}</Text>
      <Text style={[styles.thoughtmarkContent, { color: theme.colors.textSecondary }]}>{item.content}</Text>
      <Text style={[styles.thoughtmarkTimestamp, { color: theme.colors.textMuted }]}>{item.timestamp}</Text>
    </TouchableOpacity>
  );

  return (
    <AutoRoleView componentRole="screen" style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <DualMountToggle position="top-right" showLabel={true} opacity={0.8} />
      
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.text }]}>All Thoughtmarks</Text>
        <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
          {mockThoughtmarks.length} thoughtmarks
        </Text>
      </View>

      <FlatList
        data={mockThoughtmarks}
        renderItem={renderThoughtmark}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </AutoRoleView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 24,
    paddingBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
  },
  listContainer: {
    padding: 24,
    paddingTop: 0,
  },
  thoughtmarkCard: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 16,
  },
  thoughtmarkTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  thoughtmarkContent: {
    fontSize: 14,
    marginBottom: 8,
    lineHeight: 20,
  },
  thoughtmarkTimestamp: {
    fontSize: 12,
  },
}); 
