import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export const VoiceRecorderScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Voice Recorder</Text>
      <Text style={styles.subtitle}>Record your thoughts</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
});
