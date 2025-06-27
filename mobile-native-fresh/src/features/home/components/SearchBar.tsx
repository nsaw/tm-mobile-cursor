import { 
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import React, { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';

import { useTheme } from '../../../theme/ThemeProvider';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  placeholder = 'Search...',
  value,
  onChangeText,
}) => {
  const { tokens } = useTheme();




















  const [searchQuery, setSearchQuery] = useState(value || '');

  const styles = StyleSheet.create({
    container: {
      paddingHorizontal: tokens.spacing.lg,
      paddingVertical: tokens.spacing.md,
    },
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: tokens.colors.surface,
      borderRadius: tokens.radius.md,
      paddingHorizontal: tokens.spacing.md,
      paddingVertical: tokens.spacing.sm,
    },
    searchIcon: {
      marginRight: tokens.spacing.sm,
    },
    searchInput: {
      flex: 1,
      fontSize: tokens.typography.fontSize.body,
      color: tokens.colors.text,
      paddingVertical: tokens.spacing.xs,
    },
    clearButton: {
      padding: tokens.spacing.xs,
    },
  });

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    if (onChangeText) {
      onChangeText(text);
    }
    onSearch(text);
  };

  const handleClear = () => {
    setSearchQuery('');
    if (onChangeText) {
      onChangeText('');
    }
    onSearch('');
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Ionicons 
          name="search" 
          size={20} 
          color={tokens.colors.textMuted}
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder={placeholder}
          placeholderTextColor={tokens.colors.textMuted}
          value={searchQuery}
          onChangeText={handleSearch}
          returnKeyType="search"
          autoCapitalize="none"
          autoCorrect={false}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={handleClear} style={styles.clearButton} accessibilityRole="button" accessible={true} >
            <Ionicons name="close-circle" size={20} color={tokens.colors.textMuted} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};