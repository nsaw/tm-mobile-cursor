import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AutoRoleView } from '../components/AutoRoleView';

interface ThoughtmarkDetailScreenProps {
  thoughtmarkId: string;
}

export const ThoughtmarkDetailScreen: React.FC<ThoughtmarkDetailScreenProps> = ({ thoughtmarkId }) => {
  const [details, setDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const mounted = useRef(false);

  const loadDetails = async () => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setDetails({ id: thoughtmarkId, title: 'Sample Thoughtmark', content: 'Sample content' });
    } catch (error) {
      console.error('Failed to load thoughtmark details:', error);
    } finally {
      setLoading(false);
    }
  };

  // DUAL-MOUNT OVERHEAD OPTIMIZATION: Prevent duplicate useEffect triggers
  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      loadDetails();
    }
  }, []);

  if (loading) {
    return (
      <AutoRoleView role="loading" style={styles.container}>
        <Text>Loading thoughtmark details...</Text>
      </AutoRoleView>
    );
  }

  if (!details) {
    return (
      <AutoRoleView role="error" style={styles.container}>
        <Text>Failed to load thoughtmark details</Text>
      </AutoRoleView>
    );
  }

  return (
    <AutoRoleView role="screen" style={styles.container}>
      <Text style={styles.title}>{details.title}</Text>
      <Text style={styles.content}>{details.content}</Text>
    </AutoRoleView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  content: {
    fontSize: 16,
    lineHeight: 24,
  },
});

export default ThoughtmarkDetailScreen; 