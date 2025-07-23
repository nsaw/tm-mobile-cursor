// ✅ TestNavBridgeScreen demonstrates navigation + slot integration
import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

import useSlotZone from '../hooks/useSlotZone';

const TestNavBridgeScreen = () => {
  const { navigation, route, currentRoute } = useSlotZone('center', 
    <View style={styles.centerContent}>
      <Text style={styles.centerText}>🎯 Navigation-Aware Center Slot</Text>
      <Text style={styles.routeText}>Route: {currentRoute}</Text>
    </View>
  );

  // Dynamic slot content based on navigation state
  useEffect(() => {
    // Update top slot with navigation info
    useSlotZone('top', 
      <View style={styles.topContent}>
        <Text style={styles.topText}>🧭 Navigation Bridge Active</Text>
        <Text style={styles.routeText}>Current: {currentRoute}</Text>
      </View>
    );

    // Update bottom slot with navigation actions
    useSlotZone('bottom',
      <View style={styles.bottomContent}>
        <TouchableOpacity 
          style={styles.navButton}
          onPress={() => navigation.navigate('Home')}
        >
          <Text style={styles.buttonText}>🏠 Go Home</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.navButton}
          onPress={() => navigation.navigate('TestZone')}
        >
          <Text style={styles.buttonText}>🧪 Test Zone</Text>
        </TouchableOpacity>
      </View>
    );
  }, [currentRoute, navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🧭 TestNavBridgeScreen</Text>
      <Text style={styles.subtitle}>Navigation + Slot Integration Test</Text>
      <Text style={styles.description}>
        This screen demonstrates how slots can react to navigation context.
        The layout updates dynamically based on the current route and navigation state.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  centerContent: {
    alignItems: 'center',
    padding: 16,
  },
  centerText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  routeText: {
    fontSize: 14,
    color: '#666',
  },
  topContent: {
    alignItems: 'center',
    padding: 12,
  },
  topText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  bottomContent: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 12,
  },
  navButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginHorizontal: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default TestNavBridgeScreen; 