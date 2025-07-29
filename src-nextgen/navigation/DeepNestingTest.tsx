import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ContextValidator from './ContextValidator';

export default function DeepNestingTest() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Deep Nesting Context Test</Text>
      <View style={styles.nestedLevel1}>
        <Text style={styles.levelText}>Level 1</Text>
        <ContextValidator />
        <View style={styles.nestedLevel2}>
          <Text style={styles.levelText}>Level 2</Text>
          <ContextValidator />
          <View style={styles.nestedLevel3}>
            <Text style={styles.levelText}>Level 3</Text>
            <ContextValidator />
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 15,
    backgroundColor: '#e8f4f8',
    margin: 10,
    borderRadius: 8
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center'
  },
  nestedLevel1: {
    padding: 10,
    backgroundColor: '#f0f8ff',
    borderRadius: 5,
    marginBottom: 5
  },
  nestedLevel2: {
    padding: 8,
    backgroundColor: '#f5f5f5',
    borderRadius: 4,
    marginTop: 5,
    marginBottom: 5
  },
  nestedLevel3: {
    padding: 6,
    backgroundColor: '#fafafa',
    borderRadius: 3,
    marginTop: 5
  },
  levelText: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 5
  }
}); 