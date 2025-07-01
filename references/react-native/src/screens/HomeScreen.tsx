import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, RefreshControl } from 'react-native';
import { ThoughtmarkCard } from '../components/ThoughtmarkCard';
import { SearchBar } from '../components/SearchBar';
import { FloatingActionButton } from '../components/FloatingActionButton';
import { thoughtmarkService } from '../services/api';
import { useThoughtmarks } from '../hooks/useThoughtmarks';
import { Thoughtmark } from '../types';

const HomeScreen = ({ navigation }: any) => {
  const { thoughtmarks, loading, refresh } = useThoughtmarks();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredThoughtmarks = thoughtmarks.filter((item: Thoughtmark) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <SearchBar 
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Search thoughtmarks..."
      />
      
      <FlatList
        data={filteredThoughtmarks}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <ThoughtmarkCard
            thoughtmark={item}
            onPress={() => navigation.navigate('Detail', { id: item.id })}
          />
        )}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={refresh} />
        }
        showsVerticalScrollIndicator={false}
      />
      
      <FloatingActionButton
        onPress={() => navigation.navigate('Create')}
        icon="plus"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  listContainer: {
    padding: 16,
    paddingBottom: 80,
  },
});

export default HomeScreen;