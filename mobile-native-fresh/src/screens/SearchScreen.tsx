import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
declare const console: any;

export default function SearchScreen() {
  const navigation = useNavigation();
  const [query, setQuery] = useState('');

  const handleSearch = () => {
    console.log(`[SEARCH] Searching for "${query}"`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Search</Text>
      <TextInput
        style={styles.input}
        placeholder='Enter search query'
        value={query}
        onChangeText={setQuery}
      />
      <Button title='Search' onPress={handleSearch} />
      <Button title='Back to Home' onPress={() => navigation.goBack()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center'
  },
  label: {
    fontSize: 18,
    marginBottom: 10
  },
  input: {
    borderWidth: 1,
    padding: 10,
    marginBottom: 20,
    borderRadius: 4
  }
}); 