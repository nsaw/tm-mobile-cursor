// App.tsx - Simplified test version
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';

export default function App(): React.JSX.Element {
  console.log('[APP] 🚀 Simplified App function executed');

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <Text style={styles.text}>🚀 App Loading Successfully!</Text>
      <Text style={styles.subtext}>Basic Expo setup is working</Text>
      <Text style={styles.subtext}>Environment: {process.env.EXPO_PUBLIC_USE_NEXTGEN || 'not set'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  text: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  subtext: {
    color: '#ccc',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 10,
  },
});
