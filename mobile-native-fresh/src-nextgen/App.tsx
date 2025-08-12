import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';

const App: React.FC = () => {
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Text style={styles.text}>🚀 NextGen App Loading...</Text>
      <Text style={styles.subtext}>Authentication and navigation will be restored once basic boot is confirmed</Text>
    </View>
  );
};

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
  },
});

export default App; 