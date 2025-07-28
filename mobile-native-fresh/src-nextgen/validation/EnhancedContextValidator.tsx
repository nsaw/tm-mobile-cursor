import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ContextValidator from './ContextValidator';
import ContextOverrideDetector from './ContextOverrideDetector';

export default function EnhancedContextValidator() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enhanced Context Validation</Text>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Context Validation</Text>
        <ContextValidator />
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Context Override Detection</Text>
        <ContextOverrideDetector />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#f8f9fa'
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center'
  },
  section: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10
  }
}); 