import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
declare const console: any;

export default function ContentScreen() {
  const items = Array.from({ length: 40 }, (_, i) => `Item ${i + 1}`);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Content List</Text>
      {items.map((item, index) => (
        <View key={index} style={styles.itemBox}>
          <Text style={styles.itemText}>{item}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center'
  },
  title: {
    fontSize: 24,
    marginBottom: 20
  },
  itemBox: {
    width: '90%',
    padding: 15,
    backgroundColor: '#f0f0f0',
    marginBottom: 10,
    borderRadius: 6
  },
  itemText: {
    fontSize: 16
  }
}); 