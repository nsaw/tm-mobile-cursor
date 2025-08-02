import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import FastImage from 'react-native-fast-image';
import { AutoRoleView } from '../components/AutoRoleView';

interface Thoughtmark {
  id: string;
  title: string;
  content: string;
  image?: string;
  createdAt: Date;
}

interface AllThoughtmarksScreenProps {
  visible?: boolean;
}

// Lazy Loading — Load screen assets + images only when needed
export const AllThoughtmarksScreen: React.FC<AllThoughtmarksScreenProps> = ({ visible = true }) => {
  const [thoughtmarks, setThoughtmarks] = useState<Thoughtmark[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call to load thoughtmarks
    const loadThoughtmarks = async () => {
      try {
        setLoading(true);
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const mockThoughtmarks: Thoughtmark[] = [
          {
            id: '1',
            title: 'Sample Thoughtmark 1',
            content: 'This is a sample thoughtmark content',
            image: 'https://via.placeholder.com/300x200',
            createdAt: new Date(),
          },
          {
            id: '2',
            title: 'Sample Thoughtmark 2',
            content: 'Another sample thoughtmark content',
            image: 'https://via.placeholder.com/300x200',
            createdAt: new Date(),
          },
        ];
        
        setThoughtmarks(mockThoughtmarks);
      } catch (error) {
        console.error('Failed to load thoughtmarks:', error);
      } finally {
        setLoading(false);
      }
    };

    if (visible) {
      loadThoughtmarks();
    }
  }, [visible]);

  const renderThoughtmark = ({ item }: { item: Thoughtmark }) => (
    <AutoRoleView role="listitem" style={styles.thoughtmarkItem}>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.content}>{item.content}</Text>
      {/* LAZY LOADING: Only load image when visible */}
      {visible && item.image && (
        <FastImage 
          source={{ uri: item.image }} 
          style={{ height: 200, width: '100%', marginTop: 8 }}
          resizeMode={FastImage.resizeMode.cover}
        />
      )}
    </AutoRoleView>
  );

  if (loading) {
    return (
      <AutoRoleView role="loading" style={styles.container}>
        <Text>Loading thoughtmarks...</Text>
      </AutoRoleView>
    );
  }

  return (
    <AutoRoleView role="screen" style={styles.container}>
      <FlatList
        data={thoughtmarks}
        renderItem={renderThoughtmark}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />
    </AutoRoleView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  listContainer: {
    padding: 16,
  },
  thoughtmarkItem: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 16,
    borderRadius: 8,
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
  content: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});

export default AllThoughtmarksScreen; 