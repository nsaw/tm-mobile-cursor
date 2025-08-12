import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export const AllThoughtmarksScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>All Thoughtmarks</Text>
      <Text style={styles.subtitle}>View all your thoughtmarks</Text>
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
