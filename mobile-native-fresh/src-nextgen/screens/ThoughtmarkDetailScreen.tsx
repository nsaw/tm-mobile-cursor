import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Text, StyleSheet } from 'react-native';
import { AutoRoleView } from '../components/AutoRoleView';

interface ThoughtmarkDetailScreenProps {
  thoughtmarkId: string;
}

export const ThoughtmarkDetailScreen: React.FC<ThoughtmarkDetailScreenProps> = ({ thoughtmarkId }) => {
  const [details, setDetails] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);
  const mounted = useRef(false);

  const loadDetails = useCallback(async () => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(() => resolve(undefined), 1000));
      setDetails({ id: thoughtmarkId, title: 'Sample Thoughtmark', content: 'Sample content' });
    } catch (error) {
      console.error('Failed to load thoughtmark details:', error);
    } finally {
      setLoading(false);
    }
  }, [thoughtmarkId]);

  // DUAL-MOUNT OVERHEAD OPTIMIZATION: Prevent duplicate useEffect triggers
  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      loadDetails();
    }
  }, [loadDetails, thoughtmarkId]);

  if (loading) {
    return (
      <AutoRoleView style={styles.container}>
        <Text>Loading thoughtmark details...</Text>
      </AutoRoleView>
    );
  }

  if (!details) {
    return (
      <AutoRoleView style={styles.container}>
        <Text>Failed to load thoughtmark details</Text>
      </AutoRoleView>
    );
  }

  return (
    <AutoRoleView style={styles.container}>
      <Text style={styles.title}>{details.title as string}</Text>
      <Text style={styles.content}>{details.content as string}</Text>
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