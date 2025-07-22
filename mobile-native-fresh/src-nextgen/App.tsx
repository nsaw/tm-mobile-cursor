// src-nextgen/App.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useAppState } from './state/store';
import { ThemeProvider } from './providers/ThemeProvider';

export default function NextGenApp() {
  useAppState();

  return (
    <ThemeProvider>
      <SafeAreaProvider>
        <SafeAreaView style={styles.container}>
          <View style={styles.content}>
            <Text style={styles.title}>🚀 NextGen Environment</Text>
            <Text style={styles.subtitle}>Coming soon...</Text>
            <Text style={styles.description}>
              This is the nextgen environment that will contain the new codebase.
            </Text>
          </View>
        </SafeAreaView>
      </SafeAreaProvider>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    lineHeight: 24,
  },
}); 