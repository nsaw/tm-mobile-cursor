import { 
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import React, { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';

import { useTheme } from '../../../theme/ThemeProvider';
import { AutoRoleView } from '../../../components/ui/AutoRoleView';

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
  const { tokens: designTokens } = useTheme();
  const [searchQuery, setSearchQuery] = useState(value || '');

  const styles = StyleSheet.create({
    container: {
      paddingHorizontal: designTokens.spacing.lg,
      paddingVertical: designTokens.spacing.md,
    },
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: designTokens.colors.surface,
      borderRadius: designTokens.radius.md,
      paddingHorizontal: designTokens.spacing.md,
      paddingVertical: designTokens.spacing.sm,
    },
    searchIcon: {
      marginRight: designTokens.spacing.sm,
    },
    searchInput: {
      flex: 1,
      fontSize: designTokens.typography.fontSize.body,
      color: designTokens.colors.text,
      paddingVertical: designTokens.spacing.xs,
    },
    clearButton: {
      padding: designTokens.spacing.xs,
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
    <AutoRoleView role="group" accessibilityRole="none" style={styles.container}>
      <AutoRoleView role="group" accessibilityRole="none" style={styles.searchContainer}>
        <Ionicons 
          name="search" 
          size={20} 
          color={designTokens.colors.textMuted}
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder={placeholder}
          placeholderTextColor={designTokens.colors.textMuted}
          value={searchQuery}
          onChangeText={handleSearch}
          returnKeyType="search"
          autoCapitalize="none"
          autoCorrect={false}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={handleClear} style={styles.clearButton} accessibilityRole="button" accessible={true} accessibilityLabel="Button">
            <Ionicons name="close-circle" size={20} color={designTokens.colors.textMuted} />
          </TouchableOpacity>
        )}
      </AutoRoleView>
    </AutoRoleView>
  );
};