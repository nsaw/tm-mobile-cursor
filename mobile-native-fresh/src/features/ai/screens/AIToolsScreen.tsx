import {
  View,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import type { NavigationProp } from '../../../navigation/types';
import { useTheme } from '../../../theme/ThemeProvider';
import { useAuth } from '../../auth/hooks/useAuth';
import { Card, CardContent } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Heading, Text } from '../../../components/ui/Text';
import { BottomNav } from '../../../components/ui/BottomNav';
import { TagChip } from '../../../components/ui/TagChip';
import { apiService } from '../../../services/api';
import { PremiumFeatureWrapper } from '../../../components/ui/PremiumFeatureWrapper';

// Define the AIInsight type
type AIInsight = {
  type: string;
  title: string;
  description: string;
  content?: string;
  confidence?: number;
  actionable?: boolean;
  relatedThoughtmarks?: number[];
};

export const AIToolsScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { tokens: designTokens } = useTheme();
  const { user } = useAuth();

  const [isGeneratingInsights, setIsGeneratingInsights] = useState(false);
  const [isSmartSorting, setIsSmartSorting] = useState(false);
  const [isGeneratingRecommendations, setIsGeneratingRecommendations] = useState(false);
  const [isGeneratingLearningResources, setIsGeneratingLearningResources] = useState(false);
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [smartSortResults, setSmartSortResults] = useState<any>(null);
  const [recommendations, setRecommendations] = useState<any>(null);
  const [learningResources, setLearningResources] = useState<any>(null);

  const hasPremiumAccess = user?.isPremium || user?.isTestUser;

  const generateInsights = async () => {
    console.log('[AIToolsScreen] generateInsights called');
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
      const result = await apiService.generateInsights();
      setInsights(Array.isArray(result.data.insights) ? result.data.insights : []);
      Alert.alert(
        'Insights Generated',
        'Your AI insights have been generated successfully!'
      );
    } catch (error) {
      console.error('Error generating insights:', error);
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
      const result = await apiService.smartSort();
      if (result.success) {
        setSmartSortResults(result.data);
        Alert.alert(
          'Smart Sorting Complete',
          'Your thoughtmarks have been intelligently organized.',
          [{ text: 'OK' }]
        );
      } else {
        throw new Error(result.error || 'Failed to perform smart sorting');
      }
    } catch (error) {
      console.error('Error performing smart sorting:', error);
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
      const result = await apiService.recommendations();
      if (result.success) {
        setRecommendations(result.data);
        Alert.alert(
          'Recommendations Generated',
          'Your personalized AI recommendations have been generated!',
          [{ text: 'OK' }]
        );
      } else {
        throw new Error(result.error || 'Failed to generate recommendations');
      }
    } catch (error) {
      console.error('Error generating recommendations:', error);
      Alert.alert('Error', 'Failed to generate recommendations. Please try again.');
    } finally {
      setIsGeneratingRecommendations(false);
    }
  };

  const generateLearningResources = async () => {
    if (!hasPremiumAccess) {
      Alert.alert(
        'Premium Feature',
        'Learning resources are available for premium users. Upgrade to unlock this feature.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Upgrade', onPress: () => navigation.navigate('Subscribe' as never) }
        ]
      );
      return;
    }

    setIsGeneratingLearningResources(true);
    try {
      const result = await apiService.learningResources();
      if (result.success) {
        setLearningResources(result.data);
        Alert.alert(
          'Learning Resources Generated',
          'Your personalized learning resources have been generated!',
          [{ text: 'OK' }]
        );
      } else {
        throw new Error(result.error || 'Failed to generate learning resources');
      }
    } catch (error) {
      console.error('Error generating learning resources:', error);
      Alert.alert('Error', 'Failed to generate learning resources. Please try again.');
    } finally {
      setIsGeneratingLearningResources(false);
    }
  };

  const handleNavigate = (path: string) => {
    switch (path) {
      case '/':
      case 'Dashboard':
        navigation.navigate('Dashboard');
        break;
      case '/search':
      case 'Search':
        navigation.navigate('Search');
        break;
      case '/all-thoughtmarks':
      case 'AllThoughtmarks':
        navigation.navigate('AllThoughtmarks');
        break;
      case '/ai-tools':
      case 'AITools':
        navigation.navigate('AITools');
        break;
      default:
        console.log('Unknown navigation path:', path);
        break;
    }
  };

  const getIconForType = (type: string) => {
    switch (type) {
      case 'pattern':
        return 'lightbulb-outline';
      case 'recommendation':
        return 'star-outline';
      case 'trend':
        return 'trending-up';
      case 'connection':
        return 'link-variant';
      default:
        return 'lightbulb-outline';
    }
  };

  const getIconColorForType = (type: string) => {
    switch (type) {
      case 'pattern':
        return designTokens.colors.accent;
      case 'recommendation':
        return '#FFD700';
      case 'trend':
        return designTokens.colors.success;
      case 'connection':
        return designTokens.colors.brand;
      default:
        return designTokens.colors.accent;
    }
  };

  const renderAICard = (item: any, index: number, type: string) => (
    <Card key={index} style={{ marginBottom: designTokens.spacing.md }}>
      <CardContent>
        <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: designTokens.spacing.sm }}>
          <MaterialCommunityIcons 
            name={getIconForType(item.type || type) as any}
            size={24}
            color={getIconColorForType(item.type || type)}
            style={{ marginRight: designTokens.spacing.sm, marginTop: 2 }}
          />
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: designTokens.spacing.xs }}>
              <Text style={{ fontWeight: 'bold', color: designTokens.colors.text, flex: 1 }}>
                {item.title}
              </Text>
              {item.actionable && (
                <TagChip
                  tag="Actionable"
                  variant="success"
                  size="sm"
                />
              )}
            </View>
            <Text style={{ color: designTokens.colors.textSecondary, marginBottom: designTokens.spacing.sm }}>
              {item.description}
            </Text>
            {item.relatedThoughtmarks && item.relatedThoughtmarks.length > 0 && (
              <View style={{ marginTop: designTokens.spacing.sm }}>
                <Text style={{ color: designTokens.colors.textMuted, fontSize: 12, marginBottom: designTokens.spacing.xs }}>
                  Related Thoughtmarks:
                </Text>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                  {item.relatedThoughtmarks.map((thoughtmarkId: number, idx: number) => (
                    <TouchableOpacity
                      key={idx}
                      onPress={() => navigation.navigate('ThoughtmarkDetail' as never, { id: thoughtmarkId } as never)}
                      accessibilityRole="button"
                      accessible={true}
                      accessibilityLabel="Open thoughtmark detail"
                      style={{
                        backgroundColor: designTokens.colors.accent + '20',
                        paddingHorizontal: designTokens.spacing.sm,
                        // ...other styles
                      }}
                    >
                      {/* ...child content */}
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}
          </View>
        </View>
      </CardContent>
    </Card>
  );

  if (!hasPremiumAccess) {
    return (
      <PremiumFeatureWrapper
        fallbackText="AI Tools are available for premium users. Upgrade to unlock AI-powered insights, smart sorting, and recommendations."
        onUpgrade={() => navigation.navigate('Premium' as never)}
      >
        <View style={styles.upgradeContainer}>
          <Text style={[styles.upgradeTitle, { color: designTokens.colors.text }]}>
            Upgrade to Premium
          </Text>
          <Text style={[styles.upgradeDescription, { color: designTokens.colors.textSecondary }]}>
            Unlock AI-powered insights, smart sorting, and personalized recommendations.
          </Text>
        </View>
      </PremiumFeatureWrapper>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: designTokens.colors.background }}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          accessibilityRole="button"
          accessible={true}
          accessibilityLabel="Go back"
        >
          <Ionicons name="arrow-back" size={24} color={designTokens.colors.text} />
        </TouchableOpacity>
        <Text style={{ ...styles.headerTitle, color: designTokens.colors.text }}>AI Tools</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* AI Insights */}
        <Card variant="elevated" style={{ marginBottom: designTokens.spacing.lg }}>
          <CardContent>
            <Heading><Text>AI Insights</Text></Heading>
            <Text style={{ color: designTokens.colors.textSecondary, marginBottom: designTokens.spacing.md }}>
              Get a summary of your recent thoughtmarks, trends, and patterns discovered by AI.
            </Text>
            <Button onPress={generateInsights} disabled={isGeneratingInsights} style={{ marginBottom: designTokens.spacing.md }}>
              {isGeneratingInsights ? (
                <>
                  <ActivityIndicator color={designTokens.colors.background} style={{ marginRight: 8 }} />
                  <Text style={{ color: designTokens.colors.buttonText, fontWeight: '600' }}>Generating...</Text>
                </>
              ) : (
                <Text style={{ color: designTokens.colors.buttonText, fontWeight: '600' }}>Generate Insights</Text>
              )}
            </Button>
            {insights && insights.length > 0 ? (
              insights.map((insight, idx) => renderAICard(insight, idx, 'insight'))
            ) : (
              <Text style={{ color: designTokens.colors.textSecondary }}>
                No insights generated yet.
              </Text>
            )}
          </CardContent>
        </Card>

        {/* Smart Sorting */}
        <Card variant="elevated" style={{ marginBottom: designTokens.spacing.lg }}>
          <CardContent>
            <Heading><Text>Smart Sorting</Text></Heading>
            <Text style={{ color: designTokens.colors.textSecondary, marginBottom: designTokens.spacing.md }}>
              Let AI automatically organize your thoughtmarks into the most relevant bins.
            </Text>
            <Button onPress={performSmartSorting} disabled={isSmartSorting} style={{ marginBottom: designTokens.spacing.md }}>
              {isSmartSorting ? (
                <>
                  <ActivityIndicator color={designTokens.colors.background} style={{ marginRight: 8 }} />
                  <Text style={{ color: designTokens.colors.buttonText, fontWeight: '600' }}>Sorting...</Text>
                </>
              ) : (
                <Text style={{ color: designTokens.colors.buttonText, fontWeight: '600' }}>Run Smart Sort</Text>
              )}
            </Button>
            {smartSortResults && smartSortResults.suggestions ? (
              smartSortResults.suggestions.map((suggestion: any, idx: number) => renderAICard(suggestion, idx, 'smart-sort'))
            ) : (
              <Text style={{ color: designTokens.colors.textSecondary }}>
                No smart sort results yet.
              </Text>
            )}
          </CardContent>
        </Card>

        {/* AI Recommendations */}
        <Card variant="elevated" style={{ marginBottom: designTokens.spacing.lg }}>
          <CardContent>
            <Heading><Text>AI Recommendations</Text></Heading>
            <Text style={{ color: designTokens.colors.textSecondary, marginBottom: designTokens.spacing.md }}>
              Get personalized suggestions for next actions, topics, or organization improvements.
            </Text>
            <Button onPress={generateRecommendations} disabled={isGeneratingRecommendations} style={{ marginBottom: designTokens.spacing.md }}>
              {isGeneratingRecommendations ? (
                <>
                  <ActivityIndicator color={designTokens.colors.background} style={{ marginRight: 8 }} />
                  <Text style={{ color: designTokens.colors.buttonText, fontWeight: '600' }}>Generating...</Text>
                </>
              ) : (
                <Text style={{ color: designTokens.colors.buttonText, fontWeight: '600' }}>Generate Recommendations</Text>
              )}
            </Button>
            {recommendations && recommendations.recommendations ? (
              recommendations.recommendations.map((recommendation: any, idx: number) => renderAICard(recommendation, idx, 'recommendation'))
            ) : (
              <Text style={{ color: designTokens.colors.textSecondary }}>
                No recommendations generated yet.
              </Text>
            )}
          </CardContent>
        </Card>

        {/* Learning Resources */}
        <Card variant="elevated" style={{ marginBottom: designTokens.spacing.lg }}>
          <CardContent>
            <Heading><Text>Learning Resources</Text></Heading>
            <Text style={{ color: designTokens.colors.textSecondary, marginBottom: designTokens.spacing.md }}>
              Discover personalized learning materials and resources based on your thoughtmarks.
            </Text>
            <Button onPress={generateLearningResources} disabled={isGeneratingLearningResources} style={{ marginBottom: designTokens.spacing.md }}>
              {isGeneratingLearningResources ? (
                <>
                  <ActivityIndicator color={designTokens.colors.background} style={{ marginRight: 8 }} />
                  <Text style={{ color: designTokens.colors.buttonText, fontWeight: '600' }}>Generating...</Text>
                </>
              ) : (
                <Text style={{ color: designTokens.colors.buttonText, fontWeight: '600' }}>Generate Learning Resources</Text>
              )}
            </Button>
            {learningResources && learningResources.learningResources ? (
              learningResources.learningResources.map((resource: any, idx: number) => renderAICard(resource, idx, 'learning-resource'))
            ) : (
              <Text style={{ color: designTokens.colors.textSecondary }}>
                No learning resources generated yet.
              </Text>
            )}
          </CardContent>
        </Card>
      </ScrollView>
      
      {/* Floating Action Button */}
      <TouchableOpacity
        style={[styles.fab, { backgroundColor: designTokens.colors.accent }]}
        onPress={() => navigation.navigate('CreateThoughtmark' as never)}
        accessibilityRole="button"
        accessible={true}
        accessibilityLabel="Create new thoughtmark"
      >
        <Ionicons name="add" size={24} color="#FFFFFF" />
      </TouchableOpacity>
      
      {/* Bottom Nav Bar */}
      <BottomNav onNavigate={handleNavigate} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  backButton: {
    padding: 8,
  },
  confidenceText: {
    fontSize: 12,
    fontWeight: '600',
  },
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  fab: {
    alignItems: 'center',
    borderRadius: 28,
    bottom: 80,
    elevation: 8,
    height: 56,
    justifyContent: 'center',
    position: 'absolute',
    right: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    width: 56,
  },
  featureItem: {
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 16,
  },
  featureText: {
    fontSize: 16,
    marginLeft: 12,
  },
  featuresList: {
    marginBottom: 32,
    width: '100%',
  },
  header: {
    alignItems: 'center',
    borderBottomColor: '#2E2E2E',
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerSpacer: {
    width: 40,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  insightsSection: {
    marginBottom: 20,
  },
  patternDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  patternHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  patternItem: {
    marginBottom: 16,
  },
  patternType: {
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  recommendationItem: {
    marginBottom: 12,
  },
  recommendationReason: {
    fontSize: 12,
    lineHeight: 16,
  },
  recommendationTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  resultsCard: {
    marginBottom: 16,
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  scrollView: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  suggestionItem: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    marginBottom: 8,
  },
  suggestionText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    marginLeft: 8,
  },
  toolCard: {
    alignItems: 'center',
    borderRadius: 16,
    flex: 1,
    minWidth: 150,
    padding: 20,
    position: 'relative',
  },
  toolDescription: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },
  toolIcon: {
    marginBottom: 12,
  },
  toolLoader: {
    position: 'absolute',
    right: 12,
    top: 12,
  },
  toolTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  toolsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  upgradeButton: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  upgradeButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  upgradeContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  upgradeDescription: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 32,
    textAlign: 'center',
  },
  upgradeTitle: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 16,
  },
});
