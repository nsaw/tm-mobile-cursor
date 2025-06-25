import React, { useState } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NavigationProp } from '../../../navigation/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../../../theme/ThemeProvider';
import { useAuth } from '../../auth/hooks/useAuth';
import { Card, CardHeader, CardContent, CardFooter } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Heading, Caption, Text } from '../../../components/ui/Text';
import { BottomNav } from '../../../components/ui/BottomNav';
import { TagChip } from '../../../components/ui/TagChip';
import { apiService } from '../../../services/api';
import { MaterialCommunityIcons } from '@expo/vector-icons';

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
  const { tokens } = useTheme();
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
      console.log('[AIToolsScreen] API result:', result);
      setInsights(Array.isArray(result.data.insights) ? result.data.insights : []);
      console.log('[AIToolsScreen] insights after set:', Array.isArray(result.data.insights) ? result.data.insights : []);
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
        return tokens.colors.accent;
      case 'recommendation':
        return '#FFD700';
      case 'trend':
        return tokens.colors.success;
      case 'connection':
        return tokens.colors.brand;
      default:
        return tokens.colors.accent;
    }
  };

  const renderAICard = (item: any, index: number, type: string) => (
    <Card key={index} style={{ marginBottom: tokens.spacing.md }}>
      <CardContent>
        <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: tokens.spacing.sm }}>
          <MaterialCommunityIcons 
            name={getIconForType(item.type || type) as any}
            size={24}
            color={getIconColorForType(item.type || type)}
            style={{ marginRight: tokens.spacing.sm, marginTop: 2 }}
          />
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: tokens.spacing.xs }}>
              <Text style={{ fontWeight: 'bold', color: tokens.colors.text, flex: 1 }}>
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
            <Text style={{ color: tokens.colors.textSecondary, marginBottom: tokens.spacing.sm }}>
              {item.description}
            </Text>
            {item.relatedThoughtmarks && item.relatedThoughtmarks.length > 0 && (
              <View style={{ marginTop: tokens.spacing.sm }}>
                <Text style={{ color: tokens.colors.textMuted, fontSize: 12, marginBottom: tokens.spacing.xs }}>
                  Related Thoughtmarks:
                </Text>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                  {item.relatedThoughtmarks.map((thoughtmarkId: number, idx: number) => (
                    <TouchableOpacity
                      key={idx}
                      onPress={() => navigation.navigate('ThoughtmarkDetail' as never, { id: thoughtmarkId } as never)}
                      style={{
                        backgroundColor: tokens.colors.accent + '20',
                        paddingHorizontal: tokens.spacing.sm,
                        paddingVertical: tokens.spacing.xs,
                        borderRadius: tokens.radius.sm,
                        marginRight: tokens.spacing.xs,
                        marginBottom: tokens.spacing.xs,
                      }}
                      accessibilityRole="button"
                      accessibilityLabel={`View thoughtmark ${thoughtmarkId}`}
                    >
                      <Text style={{ color: tokens.colors.accent, fontSize: 12 }}>
                        #{thoughtmarkId}
                      </Text>
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
      <SafeAreaView style={[styles.container, { backgroundColor: tokens.colors.background }]}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <Ionicons name="arrow-back" size={24} color={tokens.colors.text} />
          </TouchableOpacity>
          <Text style={{ ...styles.headerTitle, color: tokens.colors.text }}>AI Tools</Text>
          <View style={styles.headerSpacer} />
        </View>

        <View style={styles.upgradeContainer}>
          <Ionicons name="star" size={64} color={tokens.colors.accent} />
          <Text style={{ ...styles.upgradeTitle, color: tokens.colors.text }}>
            Upgrade to Premium
          </Text>
          <Text style={{ ...styles.upgradeDescription, color: tokens.colors.textSecondary }}>
            Unlock AI-powered insights, smart sorting, and personalized recommendations with Premium.
          </Text>
          
          <View style={styles.featuresList}>
            <View style={styles.featureItem}>
              <Ionicons name="bulb" size={20} color={tokens.colors.accent} />
              <Text style={{ ...styles.featureText, color: tokens.colors.textSecondary }}>
                Intelligent pattern recognition
              </Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="trending-up" size={20} color={tokens.colors.accent} />
              <Text style={{ ...styles.featureText, color: tokens.colors.textSecondary }}>
                Smart content organization
              </Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="book" size={20} color={tokens.colors.accent} />
              <Text style={{ ...styles.featureText, color: tokens.colors.textSecondary }}>
                Personalized learning recommendations
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.upgradeButton, { backgroundColor: tokens.colors.accent }]}
            onPress={() => navigation.navigate('Subscribe' as never)}
            accessibilityRole="button"
            accessibilityLabel="Upgrade to Premium"
          >
            <Ionicons name="star" size={20} color={tokens.colors.text} />
            <Text style={{ ...styles.upgradeButtonText, color: tokens.colors.text }}>
              Upgrade to Premium
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: tokens.colors.background }}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Ionicons name="arrow-back" size={24} color={tokens.colors.text} />
        </TouchableOpacity>
        <Text style={{ ...styles.headerTitle, color: tokens.colors.text }}>AI Tools</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* AI Insights */}
        <Card variant="elevated" style={{ marginBottom: tokens.spacing.lg }}>
          <CardContent>
            <Heading level={2} style={{ color: tokens.colors.text, marginBottom: tokens.spacing.sm }}>AI Insights</Heading>
            <Text style={{ color: tokens.colors.textSecondary, marginBottom: tokens.spacing.md }}>
              Get a summary of your recent thoughtmarks, trends, and patterns discovered by AI.
            </Text>
            <Button onPress={generateInsights} disabled={isGeneratingInsights} style={{ marginBottom: tokens.spacing.md }}>
              {isGeneratingInsights ? (
                <>
                  <ActivityIndicator color={tokens.colors.background} style={{ marginRight: 8 }} />
                  <Text style={{ color: tokens.colors.buttonText, fontWeight: '600' }}>Generating...</Text>
                </>
              ) : (
                <Text style={{ color: tokens.colors.buttonText, fontWeight: '600' }}>Generate Insights</Text>
              )}
            </Button>
            {insights && insights.length > 0 ? (
              insights.map((insight, idx) => renderAICard(insight, idx, 'insight'))
            ) : (
              <Text style={{ color: tokens.colors.textSecondary }}>
                No insights generated yet.
              </Text>
            )}
          </CardContent>
        </Card>

        {/* Smart Sorting */}
        <Card variant="elevated" style={{ marginBottom: tokens.spacing.lg }}>
          <CardContent>
            <Heading level={2} style={{ color: tokens.colors.text, marginBottom: tokens.spacing.sm }}>Smart Sorting</Heading>
            <Text style={{ color: tokens.colors.textSecondary, marginBottom: tokens.spacing.md }}>
              Let AI automatically organize your thoughtmarks into the most relevant bins.
            </Text>
            <Button onPress={performSmartSorting} disabled={isSmartSorting} style={{ marginBottom: tokens.spacing.md }}>
              {isSmartSorting ? (
                <>
                  <ActivityIndicator color={tokens.colors.background} style={{ marginRight: 8 }} />
                  <Text style={{ color: tokens.colors.buttonText, fontWeight: '600' }}>Sorting...</Text>
                </>
              ) : (
                <Text style={{ color: tokens.colors.buttonText, fontWeight: '600' }}>Run Smart Sort</Text>
              )}
            </Button>
            {smartSortResults && smartSortResults.suggestions ? (
              smartSortResults.suggestions.map((suggestion: any, idx: number) => renderAICard(suggestion, idx, 'smart-sort'))
            ) : (
              <Text style={{ color: tokens.colors.textSecondary }}>
                No smart sort results yet.
              </Text>
            )}
          </CardContent>
        </Card>

        {/* AI Recommendations */}
        <Card variant="elevated" style={{ marginBottom: tokens.spacing.lg }}>
          <CardContent>
            <Heading level={2} style={{ color: tokens.colors.text, marginBottom: tokens.spacing.sm }}>AI Recommendations</Heading>
            <Text style={{ color: tokens.colors.textSecondary, marginBottom: tokens.spacing.md }}>
              Get personalized suggestions for next actions, topics, or organization improvements.
            </Text>
            <Button onPress={generateRecommendations} disabled={isGeneratingRecommendations} style={{ marginBottom: tokens.spacing.md }}>
              {isGeneratingRecommendations ? (
                <>
                  <ActivityIndicator color={tokens.colors.background} style={{ marginRight: 8 }} />
                  <Text style={{ color: tokens.colors.buttonText, fontWeight: '600' }}>Generating...</Text>
                </>
              ) : (
                <Text style={{ color: tokens.colors.buttonText, fontWeight: '600' }}>Generate Recommendations</Text>
              )}
            </Button>
            {recommendations && recommendations.recommendations ? (
              recommendations.recommendations.map((recommendation: any, idx: number) => renderAICard(recommendation, idx, 'recommendation'))
            ) : (
              <Text style={{ color: tokens.colors.textSecondary }}>
                No recommendations generated yet.
              </Text>
            )}
          </CardContent>
        </Card>

        {/* Learning Resources */}
        <Card variant="elevated" style={{ marginBottom: tokens.spacing.lg }}>
          <CardContent>
            <Heading level={2} style={{ color: tokens.colors.text, marginBottom: tokens.spacing.sm }}>Learning Resources</Heading>
            <Text style={{ color: tokens.colors.textSecondary, marginBottom: tokens.spacing.md }}>
              Discover personalized learning materials and resources based on your thoughtmarks.
            </Text>
            <Button onPress={generateLearningResources} disabled={isGeneratingLearningResources} style={{ marginBottom: tokens.spacing.md }}>
              {isGeneratingLearningResources ? (
                <>
                  <ActivityIndicator color={tokens.colors.background} style={{ marginRight: 8 }} />
                  <Text style={{ color: tokens.colors.buttonText, fontWeight: '600' }}>Generating...</Text>
                </>
              ) : (
                <Text style={{ color: tokens.colors.buttonText, fontWeight: '600' }}>Generate Learning Resources</Text>
              )}
            </Button>
            {learningResources && learningResources.learningResources ? (
              learningResources.learningResources.map((resource: any, idx: number) => renderAICard(resource, idx, 'learning-resource'))
            ) : (
              <Text style={{ color: tokens.colors.textSecondary }}>
                No learning resources generated yet.
              </Text>
            )}
          </CardContent>
        </Card>
      </ScrollView>
      
      {/* Floating Action Button */}
      <TouchableOpacity
        style={[styles.fab, { backgroundColor: tokens.colors.accent }]}
        onPress={() => navigation.navigate('CreateThoughtmark' as never)}
      >
        <Ionicons name="add" size={24} color="#FFFFFF" />
      </TouchableOpacity>
      
      {/* Bottom Nav Bar */}
      <BottomNav onNavigate={handleNavigate} />
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
  fab: {
    position: 'absolute',
    bottom: 80,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
}); 