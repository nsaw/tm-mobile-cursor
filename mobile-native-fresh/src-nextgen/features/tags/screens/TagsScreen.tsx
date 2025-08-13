import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TagChip } from '../components/TagChip';
import { tagService } from '../services/tagService';
import { Tag, TagFilters } from '../types/tagTypes';

export const TagsScreen: React.FC = () => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filters, setFilters] = useState<TagFilters>({
    includeSystem: true,
    sortBy: 'usageCount',
    sortOrder: 'desc',
  });

  useEffect(() => {
    loadTags();
  }, [filters]);

  const loadTags = async () => {
    try {
      setLoading(true);
      const data = await tagService.getTags(filters);
      setTags(data);
    } catch (error) {
      console.error('Error loading tags:', error);
      Alert.alert('Error', 'Failed to load tags');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadTags();
    setRefreshing(false);
  };

  const handleTagPress = (tag: Tag) => {
    // Navigate to tag details or thoughts with this tag
    console.log('Open tag:', tag.id);
  };

  const handleEditTag = (tag: Tag) => {
    // Navigate to edit screen or show edit modal
    console.log('Edit tag:', tag.id);
  };

  const handleDeleteTag = (tag: Tag) => {
    if (tag.isSystem) {
      Alert.alert('Cannot Delete', 'System tags cannot be deleted');
      return;
    }

    Alert.alert(
      'Delete Tag',
      `Are you sure you want to delete '${tag.name}'? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await tagService.deleteTag(tag.id);
              setTags(prev => prev.filter(t => t.id !== tag.id));
            } catch (error) {
              console.error('Error deleting tag:', error);
              Alert.alert('Error', 'Failed to delete tag');
            }
          },
        },
      ]
    );
  };

  const renderTag = ({ item }: { item: Tag }) => (
    <TouchableOpacity
      style={styles.tagItem}
      onPress={() => handleTagPress(item)}
      activeOpacity={0.7}
    >
      <View style={styles.tagInfo}>
        <TagChip tag={item} size='medium' showCount />
        {item.description && (
          <Text style={styles.description} numberOfLines={2}>
            {item.description}
          </Text>
        )}
      </View>
      <View style={styles.actions}>
        {!item.isSystem && (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleEditTag(item)}
          >
            <Ionicons name='pencil' size={16} color='#666' />
          </TouchableOpacity>
        )}
        {!item.isSystem && (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleDeleteTag(item)}
          >
            <Ionicons name='trash' size={16} color='#ff4444' />
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name='pricetag' size={64} color='#ccc' />
      <Text style={styles.emptyTitle}>No Tags Yet</Text>
      <Text style={styles.emptySubtitle}>
        Tags will appear here as you create and use them
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Tags</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => console.log('Create new tag')}
        >
          <Ionicons name='add' size={24} color='#fff' />
        </TouchableOpacity>
      </View>

      <FlatList
        data={tags}
        renderItem={renderTag}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        ListEmptyComponent={!loading && renderEmptyState()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
  },
  addButton: {
    backgroundColor: '#007AFF',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {
    padding: 16,
  },
  tagItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tagInfo: {
    flex: 1,
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
    lineHeight: 20,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    padding: 4,
    marginLeft: 8,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    marginTop: 100,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
});
