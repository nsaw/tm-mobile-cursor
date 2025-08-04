import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import { useThoughtmarks } from '../hooks/useThoughtmarks';
import { useSearch } from '../hooks/useSearch';
import { ThoughtmarkCard } from '../components/ThoughtmarkCard';

export const SearchScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { thoughtmarks } = useThoughtmarks();
  const [searchResults, searchThoughtmarks] = useSearch();

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      searchThoughtmarks(query);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#000' }}>
      <View style={{ padding: 16, gap: 16 }}>
        {/* Screen Reader Optimization — Improve voiceover support for key flows */}
        <Text 
          accessibilityLabel='Search title input' 
          accessibilityRole='header'
          style={{ color: 'white', fontSize: 24, fontWeight: 'bold' }}
        >
          Search
        </Text>
        <TextInput
          style={{ 
            backgroundColor: '#333', 
            color: 'white', 
            padding: 12, 
            borderRadius: 8,
            fontSize: 16
          }}
          placeholder="Search thoughtmarks..."
          placeholderTextColor="#666"
          value={searchQuery}
          onChangeText={handleSearch}
          accessibilityLabel="Search input field"
          accessibilityHint="Enter text to search for thoughtmarks"
        />
        <ScrollView 
          style={{ flex: 1 }}
          accessibilityLabel="Search results list"
        >
          {searchResults.length > 0 ? (
            <View style={{ gap: 8 }}>
              <Text 
                style={{ color: 'white', fontSize: 18, fontWeight: '600' }}
                accessibilityLabel={`${searchResults.length} search results found`}
              >
                Results
              </Text>
              {searchResults.map(tm => (
                <ThoughtmarkCard key={tm.id} slotType="SEARCH_RESULT" />
              ))}
            </View>
          ) : searchQuery.trim() ? (
            <Text 
              style={{ color: '#666', textAlign: 'center', marginTop: 20 }}
              accessibilityLabel="No search results found"
            >
              No results found
            </Text>
          ) : null}
        </ScrollView>
      </View>
    </View>
  );
}; 