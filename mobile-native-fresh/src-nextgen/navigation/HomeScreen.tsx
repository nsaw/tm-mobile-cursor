import * as React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import ContextValidator from './ContextValidator';
import TransitionMonitor from './TransitionMonitor';

declare const console: any;

export default function HomeScreen() {
  const navigation = useNavigation();

  const navigateToSlotBridge = () => {
    console.log('[HomeScreen] Navigating to SlotBridge');
    navigation.navigate('SlotBridge' as never);
  };

  const navigateToContextTest = () => {
    console.log('[HomeScreen] Navigating to ContextTest');
    navigation.navigate('ContextTest' as never);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Home Screen</Text>
      <Text style={styles.subtitle}>Navigation Context Test Suite</Text>
      
      <ContextValidator />
      <TransitionMonitor />
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={navigateToSlotBridge}>
          <Text style={styles.buttonText}>Deep Nesting Test</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.button} onPress={navigateToContextTest}>
          <Text style={styles.buttonText}>Context Test Runner</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f9fa'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center'
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
    textAlign: 'center'
  },
  buttonContainer: {
    marginTop: 20,
    gap: 15
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center'
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold'
  }
}); 