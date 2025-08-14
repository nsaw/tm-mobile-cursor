import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TagChip } from './TagChip';
import { Tag } from '../types/tagTypes';
import { tagService } from '../services/tagService';

interface TagSelectorProps {
  selectedTags: Tag[];
  onTagsChange: (tags: Tag[]) => void;
  maxTags?: number;
  placeholder?: string;
}

export const TagSelector: React.FC<TagSelectorProps> = ({
  selectedTags,
  onTagsChange,
  maxTags = 10,
  placeholder = 'Select tags...',
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isModalVisible) {
      loadTags();
    }
  }, [isModalVisible]);

  const loadTags = async () => {
    try {
      setLoading(true);
      const tags = await tagService.getTags({
        includeSystem: true,
        sortBy: 'usageCount',
        sortOrder: 'desc',
      });
      setAvailableTags(tags);
    } catch (error) {
      console.error('Error loading tags:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTags = availableTags.filter(tag =>
    tag.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleTagSelect = (tag: Tag) => {
    const isSelected = selectedTags.some(t => t.id === tag.id);
    if (isSelected) {
      onTagsChange(selectedTags.filter(t => t.id !== tag.id));
    } else if (selectedTags.length < maxTags) {
      onTagsChange([...selectedTags, tag]);
    }
  };

  const handleTagRemove = (tag: Tag) => {
    onTagsChange(selectedTags.filter(t => t.id !== tag.id));
  };

  const renderTag = ({ item }: { item: Tag }) => {
    const isSelected = selectedTags.some(t => t.id === item.id);
    return (
      <TouchableOpacity
        style={[styles.tagItem, isSelected && styles.selectedTagItem]}
        onPress={() => handleTagSelect(item)}
      >
        <TagChip tag={item} size='medium' showCount />
        {isSelected && (
          <Ionicons name='checkmark-circle' size={20} color='#007AFF' style={styles.checkIcon} />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.selector}
        onPress={() => setIsModalVisible(true)}
      >
        {selectedTags.length > 0 ? (
          <View style={styles.selectedTagsContainer}>
            {selectedTags.map(tag => (
              <TagChip
                key={tag.id}
                tag={tag}
                onRemove={handleTagRemove}
                size='small'
              />
            ))}
            {selectedTags.length < maxTags && (
              <Text style={styles.addMoreText}>+ Add more</Text>
            )}
          </View>
        ) : (
          <Text style={styles.placeholder}>{placeholder}</Text>
        )}
        <Ionicons name='chevron-down' size={16} color='#666' />
      </TouchableOpacity>

      <Modal
        visible={isModalVisible}
        animationType='slide'
        presentationStyle='pageSheet'
        onRequestClose={() => setIsModalVisible(false)}
        accessible={false}
        accessibilityLabel="Modal"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Select Tags</Text>
            <TouchableOpacity
              onPress={() => setIsModalVisible(false)}
              style={styles.closeButton}
            >
              <Ionicons name='close' size={24} color='#666' />
            </TouchableOpacity>
          </View>

          <View style={styles.searchContainer}>
            <Ionicons name='search' size={20} color='#666' style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder='Search tags...'
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          <FlatList
            data={filteredTags}
            renderItem={renderTag}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.tagList}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  selector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
  },
  selectedTagsContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  placeholder: {
    flex: 1,
    color: '#999',
    fontSize: 16,
  },
  addMoreText: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
  closeButton: {
    padding: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 8,
  },
  tagList: {
    padding: 16,
  },
  tagItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  selectedTagItem: {
    backgroundColor: '#f0f8ff',
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  checkIcon: {
    marginLeft: 8,
  },
});
