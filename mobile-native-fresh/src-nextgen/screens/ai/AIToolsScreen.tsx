import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { AIToolsCard } from '../../components/ai/AIToolsCard';
import { Text } from '../../components/ui/Text';
import { useAppStore } from '../../state/store';

export const AIToolsScreen: React.FC = () => {
  const { user } = useAppStore();
  const isPremium = user?.isPremium || false;

  const handleAIToolsPress = () => {
    if (!isPremium) {
      // TODO: Show premium upgrade modal
      console.log('Premium feature requires subscription');
      return;
    }
    // TODO: Implement AI tools functionality
    console.log('AI Tools pressed');
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#FFFFFF',
    },
    content: {
      padding: 16,
    },
    header: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 16,
      color: '#000000',
    },
    premiumNotice: {
      fontSize: 14,
      color: '#8E8E93',
      marginBottom: 16,
      fontStyle: 'italic',
    },
  });

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content}>
        <Text style={styles.header}>AI Tools</Text>
        {!isPremium && (
          <Text style={styles.premiumNotice}>
            ⭐ Premium feature - Upgrade to access AI tools
          </Text>
        )}
        <AIToolsCard onPress={handleAIToolsPress} />
      </ScrollView>
    </View>
  );
};
