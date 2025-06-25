import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../theme/ThemeProvider';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  placeholder = 'Search thoughtmarks...',
}) => {
  const [query, setQuery] = useState('');
  const { tokens } = useTheme();

  const handleSearch = () => {
    onSearch(query);
  };

  const handleClear = () => {
    setQuery('');
    onSearch('');
  };

  return (
    <View style={[styles.container, { paddingHorizontal: designTokens.spacing.lg, paddingVertical: designTokens.spacing.md }]}>
      <View style={[styles.searchContainer, {
        backgroundColor: designTokens.colors.surface,
        borderRadius: designTokens.radius.md,
        paddingHorizontal: designTokens.spacing.md,
        paddingVertical: designTokens.spacing.sm,
      }]}>
        <Ionicons 
          name="search-outline" 
          size={20} 
          color={designTokens.colors.textMuted} 
          style={[styles.searchIcon, { marginRight: designTokens.spacing.sm }]} 
        />
        <TextInput
          style={[styles.input, {
            fontSize: designTokens.typography.fontSize.body,
            color: designTokens.colors.text,
            paddingVertical: designTokens.spacing.xs,
          }]}
          placeholder={placeholder}
          placeholderTextColor={designTokens.colors.textMuted}
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={handleClear} style={[styles.clearButton, { padding: designTokens.spacing.xs }]}>
            <Ionicons name="close-circle" size={20} color={designTokens.colors.textMuted} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // Styles moved to inline for token access
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    // Styles moved to inline for token access
  },
  searchIcon: {
    // Styles moved to inline for token access
  },
  input: {
    flex: 1,
    // Styles moved to inline for token access
  },
  clearButton: {
    // Styles moved to inline for token access
  },
});