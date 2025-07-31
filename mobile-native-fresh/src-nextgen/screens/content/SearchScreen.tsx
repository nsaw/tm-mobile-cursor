import React, { useState, useCallback } from 'react';
import { View, TextInput, FlatList, Text, TouchableOpacity } from 'react-native';
import { AutoRoleView } from '../../components/AutoRoleView';
import { useThemeWithStyles } from '../../hooks/useThemeWithStyles';
import { useSearch } from '../../hooks/useSearch';

const SearchScreen: React.FC = () => {
  const theme = useThemeWithStyles();
  const { suggestions, results, handleQueryChange, handleVoiceSearch } = useSearch();
  const [query, setQuery] = useState('');

  const handleChange = (text: string) => {
    setQuery(text);
    handleQueryChange(text);
  };

  return (
    <AutoRoleView style={theme.styles.screenContainer}>
      <View style={theme.styles.searchBar}>
        <TextInput
          value={query}
          onChangeText={handleChange}
          placeholder="Search..."
          accessibilityLabel="Search bar"
          style={theme.styles.input}
        />
        <TouchableOpacity
          onPress={handleVoiceSearch}
          accessibilityRole="button"
          accessibilityLabel="Voice Search"
          style={theme.styles.voiceButton}
        >
          <Text style={theme.styles.voiceLabel}>🎤</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={suggestions.length ? suggestions : results}
        keyExtractor={(item: any) => item.id.toString()}
        renderItem={({ item }: { item: any }) => (
          <Text style={theme.styles.searchItem}>{item.label}</Text>
        )}
        accessibilityLabel="Search results list"
      />
    </AutoRoleView>
  );
};

export default SearchScreen; 