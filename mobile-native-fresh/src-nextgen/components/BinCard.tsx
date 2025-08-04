import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { AutoRoleView } from './AutoRoleView';

interface Bin {
  id: string;
  name: string;
  content: string[];
  createdAt: Date;
}

interface BinCardProps {
  bin: Bin;
  onPress?: () => void;
}

// Memoization — Cache expensive computations in components and hooks
export const BinCard: React.FC<BinCardProps> = ({ bin, onPress }) => {
  // MEMOIZATION: Cache expensive selector calculations
  const summary = useMemo(() => summarizeBinContent(bin), [bin.id]);
  
  const itemCount = useMemo(() => bin.content.length, [bin.content.length]);
  
  const formattedDate = useMemo(() => {
    return bin.createdAt.toLocaleDateString();
  }, [bin.createdAt]);

  return (
    <TouchableOpacity onPress={onPress}>
      <AutoRoleView role="content" style={styles.container}>
        <Text style={styles.title}>{bin.name}</Text>
        <Text style={styles.summary}>{summary}</Text>
        <View style={styles.metadata}>
          <Text style={styles.count}>{itemCount} items</Text>
          <Text style={styles.date}>{formattedDate}</Text>
        </View>
      </AutoRoleView>
    </TouchableOpacity>
  );
};

// Expensive computation function that benefits from memoization
const summarizeBinContent = (bin: Bin): string => {
  // Simulate expensive computation
  const words = bin.content.join(' ').split(' ');
  const uniqueWords = new Set(words);
  const averageLength = words.reduce((sum, word) => sum + word.length, 0) / words.length;
  
  return `${uniqueWords.size} unique words, avg length: ${averageLength.toFixed(1)}`;
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginVertical: 8,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  summary: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  metadata: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  count: {
    fontSize: 12,
    color: '#999',
  },
  date: {
    fontSize: 12,
    color: '#999',
  },
});

export default BinCard; 