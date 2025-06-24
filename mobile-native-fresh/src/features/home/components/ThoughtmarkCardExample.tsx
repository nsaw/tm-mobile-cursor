import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { ThoughtmarkCard } from './ThoughtmarkCard';
import { colors, spacing, typography } from '../../../theme/theme';
import { ThoughtmarkWithBin } from '../../../types';

// Sample data for demonstration
const sampleThoughtmarks: ThoughtmarkWithBin[] = [
  {
    id: 1,
    title: 'React Native Best Practices',
    content: 'Always use StyleSheet.create for better performance. Avoid inline styles and use proper component composition. Remember to handle loading states and error boundaries.',
    tags: ['react-native', 'performance', 'best-practices'],
    binName: 'Development',
    isPinned: true,
    isArchived: false,
    isDeleted: false,
    userId: 1,
    aiSummary: 'Best practices for React Native development',
    aiCategorySuggestions: ['mobile', 'development'],
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
  },
  {
    id: 2,
    title: 'Grocery Shopping List',
    content: 'Milk, bread, eggs, cheese, tomatoes, onions, garlic, olive oil, pasta, chicken breast, spinach, bananas, apples',
    tags: ['shopping', 'food', 'groceries'],
    binName: 'Personal',
    isPinned: false,
    isArchived: false,
    isDeleted: false,
    userId: 1,
    aiSummary: 'Grocery shopping list with essential items',
    aiCategorySuggestions: ['shopping', 'food'],
    createdAt: '2024-01-14T16:45:00Z',
    updatedAt: '2024-01-14T16:45:00Z',
  },
  {
    id: 3,
    title: 'Meeting Notes - Q1 Planning',
    content: 'Discussed Q1 goals and objectives. Key focus areas: user acquisition, feature development, and team expansion. Budget approved for new hires.',
    tags: ['meeting', 'planning', 'business'],
    binName: 'Work',
    isPinned: false,
    isArchived: false,
    isDeleted: false,
    userId: 1,
    aiSummary: 'Q1 planning meeting notes with key objectives',
    aiCategorySuggestions: ['business', 'planning'],
    createdAt: '2024-01-13T14:20:00Z',
    updatedAt: '2024-01-13T14:20:00Z',
  },
];

export const ThoughtmarkCardExample: React.FC = () => {
  const handleCardPress = (thoughtmark: ThoughtmarkWithBin) => {
    console.log('Card pressed:', thoughtmark.title);
  };

  const handleEdit = (thoughtmark: ThoughtmarkWithBin) => {
    console.log('Edit pressed:', thoughtmark.title);
  };

  const handleArchive = (thoughtmark: ThoughtmarkWithBin) => {
    console.log('Archive pressed:', thoughtmark.title);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>ThoughtmarkCard Examples</Text>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Basic Cards</Text>
        {sampleThoughtmarks.map((thoughtmark) => (
          <ThoughtmarkCard
            key={thoughtmark.id}
            thoughtmark={thoughtmark}
            onClick={() => handleCardPress(thoughtmark)}
            onEdit={() => handleEdit(thoughtmark)}
            onArchive={() => handleArchive(thoughtmark)}
          />
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>With Similarity Score</Text>
        <ThoughtmarkCard
          thoughtmark={sampleThoughtmarks[0]}
          showSimilarity={true}
          similarity={0.85}
          onClick={() => handleCardPress(sampleThoughtmarks[0])}
          onEdit={() => handleEdit(sampleThoughtmarks[0])}
          onArchive={() => handleArchive(sampleThoughtmarks[0])}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Selectable Mode</Text>
        <ThoughtmarkCard
          thoughtmark={sampleThoughtmarks[1]}
          isSelectable={true}
          isSelected={true}
          onSelectionToggle={(id) => console.log('Selection toggled:', id)}
          onClick={() => handleCardPress(sampleThoughtmarks[1])}
          onEdit={() => handleEdit(sampleThoughtmarks[1])}
          onArchive={() => handleArchive(sampleThoughtmarks[1])}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Read-only Mode</Text>
        <ThoughtmarkCard
          thoughtmark={sampleThoughtmarks[2]}
          onClick={() => handleCardPress(sampleThoughtmarks[2])}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.md,
  },
  title: {
    ...typography.heading,
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    ...typography.subheading,
    color: colors.text,
    marginBottom: spacing.md,
  },
}); 