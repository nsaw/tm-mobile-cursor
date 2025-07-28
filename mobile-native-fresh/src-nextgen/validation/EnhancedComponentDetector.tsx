import * as React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

import ComponentDetector from './ComponentDetector';
import PerformanceImpactAnalyzer from './PerformanceImpactAnalyzer';

export default function EnhancedComponentDetector() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Enhanced Component Detection & Performance Analysis</Text>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Duplicate Component Detection</Text>
        <ComponentDetector />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Performance Impact Analysis</Text>
        <PerformanceImpactAnalyzer />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa'
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    padding: 15
  },
  section: {
    marginBottom: 20
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    paddingHorizontal: 15,
    color: '#333'
  }
}); 