import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../../theme/ThemeProvider';
import { useAuth } from '../../auth/hooks/useAuth';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';

export const AIToolsScreen: React.FC = () => {
  const navigation = useNavigation();
  const { tokens } = useTheme();
  const { user } = useAuth();

  const [isGeneratingInsights, setIsGeneratingInsights] = useState(false);
  const [isSmartSorting, setIsSmartSorting] = useState(false);
  const [isGeneratingRecommendations, setIsGeneratingRecommendations] = useState(false);
  const [insights, setInsights] = useState<any>(null);
  const [recommendations, setRecommendations] = useState<any>(null);

  const hasPremiumAccess = user?.isPremium || user?.isTestUser;

  const generateInsights = async () => {
    if (!hasPremiumAccess) {
      Alert.alert(
        'Premium Feature',
        'AI insights are available for premium users. Upgrade to unlock this feature.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Upgrade', onPress: () => navigation.navigate('Subscribe' as never) }
        ]
      );
      return;
    }

    setIsGeneratingInsights(true);
    try {
      // TODO: Implement AI insights API call
      // For now, simulate the API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setInsights({
        patterns: [
          { type: 'productivity', confidence: 0.85, description: 'You often write about productivity and time management' },
          { type: 'creativity', confidence: 0.72, description: 'Creative ideas and inspiration appear frequently' },
          { type: 'learning', confidence: 0.68, description: 'You document learning experiences and insights' },
        ],
        trends: [
          { trend: 'Increasing focus on AI and technology', confidence: 0.78 },
          { trend: 'Growing interest in mindfulness practices', confidence: 0.65 },
        ],
        suggestions: [
          'Consider creating a dedicated bin for AI-related content',
          'You might benefit from a "Learning Insights" tag',
          'Try setting up weekly review reminders for your productivity notes',
        ]
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to generate insights. Please try again.');
    } finally {
      setIsGeneratingInsights(false);
    }
  };

  const performSmartSorting = async () => {
    if (!hasPremiumAccess) {
      Alert.alert(
        'Premium Feature',
        'Smart sorting is available for premium users. Upgrade to unlock this feature.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Upgrade', onPress: () => navigation.navigate('Subscribe' as never) }
        ]
      );
      return;
    }

    setIsSmartSorting(true);
    try {
      // TODO: Implement smart sorting API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      Alert.alert(
        'Smart Sorting Complete',
        'Your thoughtmarks have been intelligently organized based on content patterns and relationships.',
        [{ text: 'OK' }]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to perform smart sorting. Please try again.');
    } finally {
      setIsSmartSorting(false);
    }
  };

  const generateRecommendations = async () => {
    if (!hasPremiumAccess) {
      Alert.alert(
        'Premium Feature',
        'AI recommendations are available for premium users. Upgrade to unlock this feature.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Upgrade', onPress: () => navigation.navigate('Subscribe' as never) }
        ]
      );
      return;
    }

    setIsGeneratingRecommendations(true);
    try {
      // TODO: Implement AI recommendations API call
      await new Promise(resolve => setTimeout(resolve, 1800));
      
      setRecommendations({
        learning: [
          { title: 'Atomic Habits by James Clear', reason: 'Based on your productivity interests' },
          { title: 'Deep Work by Cal Newport', reason: 'Aligns with your focus on efficiency' },
        ],
        connections: [
          { from: 'Productivity Tips', to: 'Time Management', strength: 0.89 },
          { from: 'AI Ideas', to: 'Technology Trends', strength: 0.76 },
        ],
        actions: [
          'Review your productivity thoughtmarks weekly',
          'Consider creating a "Weekly Goals" thoughtmark',
          'Connect related ideas using tags more consistently',
        ]
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to generate recommendations. Please try again.');
    } finally {
      setIsGeneratingRecommendations(false);
    }
  };

  if (!hasPremiumAccess) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: tokens.colors.background }]}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={tokens.colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: tokens.colors.text }]}>AI Tools</Text>
          <View style={styles.headerSpacer} />
        </View>

        <View style={styles.upgradeContainer}>
          <Ionicons name="star" size={64} color={tokens.colors.accent} />
          <Text style={[styles.upgradeTitle, { color: tokens.colors.text }]}>
            Upgrade to Premium
          </Text>
          <Text style={[styles.upgradeDescription, { color: tokens.colors.textSecondary }]}>
            Unlock AI-powered insights, smart sorting, and personalized recommendations with Premium.
          </Text>
          
          <View style={styles.featuresList}>
            <View style={styles.featureItem}>
              <Ionicons name="bulb" size={20} color={tokens.colors.accent} />
              <Text style={[styles.featureText, { color: tokens.colors.textSecondary }]}>
                Intelligent pattern recognition
              </Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="trending-up" size={20} color={tokens.colors.accent} />
              <Text style={[styles.featureText, { color: tokens.colors.textSecondary }]}>
                Smart content organization
              </Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="book" size={20} color={tokens.colors.accent} />
              <Text style={[styles.featureText, { color: tokens.colors.textSecondary }]}>
                Personalized learning recommendations
              </Text>
            </View>
          </View>

          <Button
            variant="primary"
            onPress={() => navigation.navigate('Subscribe' as never)}
            style={styles.upgradeButton}
          >
            <Ionicons name="star" size={20} color={tokens.colors.text} />
            <Text style={[styles.upgradeButtonText, { color: tokens.colors.text }]}>
              Upgrade to Premium
            </Text>
          </Button>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: tokens.colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={tokens.colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: tokens.colors.text }]}>AI Tools</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* AI Tools Grid */}
          <View style={styles.toolsGrid}>
            <TouchableOpacity
              style={[styles.toolCard, { backgroundColor: tokens.colors.backgroundSecondary }]}
              onPress={generateInsights}
              disabled={isGeneratingInsights}
            >
              <View style={styles.toolIcon}>
                <Ionicons name="bulb" size={32} color={tokens.colors.accent} />
              </View>
              <Text style={[styles.toolTitle, { color: tokens.colors.text }]}>
                AI Insights
              </Text>
              <Text style={[styles.toolDescription, { color: tokens.colors.textSecondary }]}>
                Discover patterns and trends in your thoughtmarks
              </Text>
              {isGeneratingInsights && (
                <ActivityIndicator size="small" color={tokens.colors.accent} style={styles.toolLoader} />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.toolCard, { backgroundColor: tokens.colors.backgroundSecondary }]}
              onPress={performSmartSorting}
              disabled={isSmartSorting}
            >
              <View style={styles.toolIcon}>
                <Ionicons name="trending-up" size={32} color={tokens.colors.accent} />
              </View>
              <Text style={[styles.toolTitle, { color: tokens.colors.text }]}>
                Smart Sort
              </Text>
              <Text style={[styles.toolDescription, { color: tokens.colors.textSecondary }]}>
                Automatically organize content by relevance
              </Text>
              {isSmartSorting && (
                <ActivityIndicator size="small" color={tokens.colors.accent} style={styles.toolLoader} />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.toolCard, { backgroundColor: tokens.colors.backgroundSecondary }]}
              onPress={generateRecommendations}
              disabled={isGeneratingRecommendations}
            >
              <View style={styles.toolIcon}>
                <Ionicons name="book" size={32} color={tokens.colors.accent} />
              </View>
              <Text style={[styles.toolTitle, { color: tokens.colors.text }]}>
                Learning Resources
              </Text>
              <Text style={[styles.toolDescription, { color: tokens.colors.textSecondary }]}>
                Get personalized recommendations
              </Text>
              {isGeneratingRecommendations && (
                <ActivityIndicator size="small" color={tokens.colors.accent} style={styles.toolLoader} />
              )}
            </TouchableOpacity>
          </View>

          {/* Insights Results */}
          {insights && (
            <Card variant="elevated" style={styles.resultsCard}>
              <Text style={[styles.resultsTitle, { color: tokens.colors.text }]}>
                AI Insights
              </Text>
              
              <View style={styles.insightsSection}>
                <Text style={[styles.sectionTitle, { color: tokens.colors.text }]}>Patterns</Text>
                {insights.patterns.map((pattern: any, index: number) => (
                  <View key={index} style={styles.patternItem}>
                    <View style={styles.patternHeader}>
                      <Text style={[styles.patternType, { color: tokens.colors.accent }]}>
                        {pattern.type}
                      </Text>
                      <View style={{ paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8, borderWidth: 1, borderColor: tokens.colors.accent, marginLeft: 8 }}>
                        <Text style={{ fontSize: 12, fontWeight: '600', color: tokens.colors.accent }}>{Math.round(pattern.confidence * 100)}%</Text>
                      </View>
                    </View>
                    <Text style={[styles.patternDescription, { color: tokens.colors.textSecondary }]}>
                      {pattern.description}
                    </Text>
                  </View>
                ))}
              </View>

              <View style={styles.insightsSection}>
                <Text style={[styles.sectionTitle, { color: tokens.colors.text }]}>Suggestions</Text>
                {insights.suggestions.map((suggestion: string, index: number) => (
                  <View key={index} style={styles.suggestionItem}>
                    <Ionicons name="checkmark-circle" size={16} color={tokens.colors.accent} />
                    <Text style={[styles.suggestionText, { color: tokens.colors.textSecondary }]}>
                      {suggestion}
                    </Text>
                  </View>
                ))}
              </View>
            </Card>
          )}

          {/* Recommendations Results */}
          {recommendations && (
            <Card variant="elevated" style={styles.resultsCard}>
              <Text style={[styles.resultsTitle, { color: tokens.colors.text }]}>
                AI Recommendations
              </Text>
              
              <View style={styles.insightsSection}>
                <Text style={[styles.sectionTitle, { color: tokens.colors.text }]}>Learning Resources</Text>
                {recommendations.learning.map((item: any, index: number) => (
                  <View key={index} style={styles.recommendationItem}>
                    <Text style={[styles.recommendationTitle, { color: tokens.colors.text }]}>
                      {item.title}
                    </Text>
                    <Text style={[styles.recommendationReason, { color: tokens.colors.textSecondary }]}>
                      {item.reason}
                    </Text>
                  </View>
                ))}
              </View>

              <View style={styles.insightsSection}>
                <Text style={[styles.sectionTitle, { color: tokens.colors.text }]}>Suggested Actions</Text>
                {recommendations.actions.map((action: string, index: number) => (
                  <View key={index} style={styles.suggestionItem}>
                    <Ionicons name="arrow-forward" size={16} color={tokens.colors.accent} />
                    <Text style={[styles.suggestionText, { color: tokens.colors.textSecondary }]}>
                      {action}
                    </Text>
                  </View>
                ))}
              </View>
            </Card>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#2E2E2E',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  headerSpacer: {
    width: 40,
  },
  upgradeContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  upgradeTitle: {
    fontSize: 24,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  upgradeDescription: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  featuresList: {
    width: '100%',
    marginBottom: 32,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  featureText: {
    fontSize: 16,
    marginLeft: 12,
  },
  upgradeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  upgradeButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  toolsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  toolCard: {
    flex: 1,
    minWidth: 150,
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    position: 'relative',
  },
  toolIcon: {
    marginBottom: 12,
  },
  toolTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  toolDescription: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  toolLoader: {
    position: 'absolute',
    top: 12,
    right: 12,
  },
  resultsCard: {
    marginBottom: 16,
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  insightsSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  patternItem: {
    marginBottom: 16,
  },
  patternHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  patternType: {
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  confidenceText: {
    fontSize: 12,
    fontWeight: '600',
  },
  patternDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  suggestionText: {
    fontSize: 14,
    lineHeight: 20,
    marginLeft: 8,
    flex: 1,
  },
  recommendationItem: {
    marginBottom: 12,
  },
  recommendationTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  recommendationReason: {
    fontSize: 12,
    lineHeight: 16,
  },
}); 