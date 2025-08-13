import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SearchResult } from '../types/search';

interface SearchResultItemProps {
  result: SearchResult;
  onPress?: (result: SearchResult) => void;
}

export const SearchResultItem: React.FC<SearchResultItemProps> = ({
  result,
  onPress,
}) => {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'thoughtmark': return 'document-text';
      case 'task': return 'checkbox';
      case 'note': return 'create';
      case 'bin': return 'folder';
      case 'tag': return 'pricetag';
      default: return 'help-circle';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'thoughtmark': return '#007AFF';
      case 'task': return '#34C759';
      case 'note': return '#FF9500';
      case 'bin': return '#AF52DE';
      case 'tag': return '#FF3B30';
      default: return '#666';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    return date.toLocaleDateString();
  };

  const highlightText = (text: string, highlights: any[]) => {
    if (highlights.length === 0) return text;

    let highlightedText = text;
    highlights.forEach(highlight => {
      if (highlight.field === 'title' || highlight.field === 'content') {
        const regex = new RegExp(`(${highlight.snippet})`, 'gi');
        highlightedText = highlightedText.replace(regex, '**$1**');
      }
    });

    return highlightedText;
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onPress?.(result)}
    >
      <View style={styles.header}>
        <View style={styles.typeContainer}>
          <Ionicons
            name={getTypeIcon(result.type) as any}
            size={16}
            color={getTypeColor(result.type)}
          />
          <Text style={[styles.typeText, { color: getTypeColor(result.type) }]}>
            {result.type.charAt(0).toUpperCase() + result.type.slice(1)}
          </Text>
        </View>
        <View style={styles.metaContainer}>
          <Text style={styles.dateText}>{formatDate(result.metadata.updatedAt)}</Text>
          <View style={styles.relevanceContainer}>
            <Text style={styles.relevanceText}>{Math.round(result.relevance * 100)}%</Text>
          </View>
        </View>
      </View>

      <Text style={styles.title} numberOfLines={2}>
        {highlightText(result.title, result.highlights.filter(h => h.field === 'title'))}
      </Text>

      {result.content && (
        <Text style={styles.content} numberOfLines={3}>
          {highlightText(result.content, result.highlights.filter(h => h.field === 'content'))}
        </Text>
      )}

      {result.metadata.tags.length > 0 && (
        <View style={styles.tagsContainer}>
          {result.metadata.tags.slice(0, 3).map(tag => (
            <View key={tag} style={styles.tagBadge}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
          {result.metadata.tags.length > 3 && (
            <Text style={styles.moreTagsText}>+{result.metadata.tags.length - 3}</Text>
          )}
        </View>
      )}

      {result.matchedTerms.length > 0 && (
        <View style={styles.matchedTermsContainer}>
          <Text style={styles.matchedTermsLabel}>Matched: </Text>
          {result.matchedTerms.map((term, index) => (
            <Text key={index} style={styles.matchedTerm}>
              {term}{index < result.matchedTerms.length - 1 ? ', ' : ''}
            </Text>
          ))}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e1e5e9',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  typeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  typeText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  metaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 12,
    color: '#666',
    marginRight: 8,
  },
  relevanceContainer: {
    backgroundColor: '#f0f8ff',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  relevanceText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#007AFF',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  content: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 8,
  },
  tagsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  tagBadge: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: 4,
  },
  tagText: {
    fontSize: 10,
    color: '#666',
  },
  moreTagsText: {
    fontSize: 10,
    color: '#999',
  },
  matchedTermsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  matchedTermsLabel: {
    fontSize: 12,
    color: '#999',
  },
  matchedTerm: {
    fontSize: 12,
    color: '#007AFF',
    backgroundColor: '#f0f8ff',
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 2,
    marginRight: 4,
  },
});
