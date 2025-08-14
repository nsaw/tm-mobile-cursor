import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAIInsights } from '../hooks/useAIInsights';
import { AIInsightsCard } from '../components/AIInsightsCard';
import { AIInsight, AIRecommendation, LearningResource } from '../types/ai-types';

export const AIToolsScreen: React.FC = () => {
  const {
    insights,
    recommendations,
    learningResources,
    loading,
    error,
    refreshInsights,
  } = useAIInsights();

  const [activeTab, setActiveTab] = useState<'insights' | 'recommendations' | 'learning'>('insights');

  const handleInsightAction = (insight: AIInsight) => {
    console.log('Executing insight action:', insight.action);
    // Implement action execution logic here
  };

  const handleRecommendationPress = (recommendation: AIRecommendation) => {
    console.log('Opening recommendation:', recommendation.title);
    // Implement recommendation navigation logic here
  };

  const handleLearningResourcePress = (resource: LearningResource) => {
    console.log('Opening learning resource:', resource.title);
    // Implement learning resource navigation logic here
  };

  const renderInsights = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>AI Insights</Text>
      {insights.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="bulb" size={48} color="#ccc" />
          <Text style={styles.emptyStateText}>No insights available yet</Text>
          <Text style={styles.emptyStateSubtext}>Create some content to get personalized insights</Text>
        </View>
      ) : (
        insights.map(insight => (
          <AIInsightsCard
            key={insight.id}
            insight={insight}
            onAction={handleInsightAction}
          />
        ))
      )}
    </View>
  );

  const renderRecommendations = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>AI Recommendations</Text>
      {recommendations.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="star" size={48} color="#ccc" />
          <Text style={styles.emptyStateText}>No recommendations yet</Text>
          <Text style={styles.emptyStateSubtext}>Start using the app to get personalized recommendations</Text>
        </View>
      ) : (
        recommendations.map(recommendation => (
          <TouchableOpacity
            key={recommendation.id}
            style={styles.recommendationCard}
            onPress={() = accessibilityRole="button" accessible={true} accessibilityLabel="Button"> handleRecommendationPress(recommendation)}
          >
            <View style={styles.recommendationHeader}>
              <Ionicons name="star" size={20} color="#FF9500" />
              <Text style={styles.recommendationTitle}>{recommendation.title}</Text>
              <View style={styles.confidenceBadge}>
                <Text style={styles.confidenceText}>{recommendation.confidence}%</Text>
              </View>
            </View>
            <Text style={styles.recommendationDescription}>{recommendation.description}</Text>
            <View style={styles.recommendationTags}>
              {recommendation.tags.map(tag => (
                <View key={tag} style={styles.tagBadge}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
            </View>
          </TouchableOpacity>
        ))
      )}
    </View>
  );

  const renderLearningResources = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Learning Resources</Text>
      {learningResources.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="school" size={48} color="#ccc" />
          <Text style={styles.emptyStateText}>No learning resources available</Text>
        </View>
      ) : (
        learningResources.map(resource => (
          <TouchableOpacity
            key={resource.id}
            style={styles.learningCard}
            onPress={() = accessibilityRole="button" accessible={true} accessibilityLabel="Button"> handleLearningResourcePress(resource)}
          >
            <View style={styles.learningHeader}>
              <Ionicons
                name={resource.type === 'video' ? 'play-circle' : resource.type === 'article' ? 'document-text' : 'book'}
                size={20}
                color="#007AFF"
              />
              <Text style={styles.learningTitle}>{resource.title}</Text>
              <View style={styles.difficultyBadge}>
                <Text style={styles.difficultyText}>{resource.difficulty}</Text>
              </View>
            </View>
            <Text style={styles.learningDescription}>{resource.description}</Text>
            <View style={styles.learningMeta}>
              <Text style={styles.learningTime}>{resource.estimatedTime} min</Text>
              <View style={styles.learningTags}>
                {resource.tags.map(tag => (
                  <View key={tag} style={styles.tagBadge}>
                    <Text style={styles.tagText}>{tag}</Text>
                  </View>
                ))}
              </View>
            </View>
          </TouchableOpacity>
        ))
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="bulb" size={24} color="#007AFF" />
        <Text style={styles.title}>AI Tools</Text>
      </View>

      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'insights' && styles.activeTab]}
          onPress={() = accessibilityRole="button" accessible={true} accessibilityLabel="Button"> setActiveTab('insights')}
        >
          <Ionicons
            name="bulb"
            size={20}
            color={activeTab === 'insights' ? '#007AFF' : '#666'}
          />
          <Text style={[styles.tabText, activeTab === 'insights' && styles.activeTabText]}>
            Insights
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'recommendations' && styles.activeTab]}
          onPress={() = accessibilityRole="button" accessible={true} accessibilityLabel="Button"> setActiveTab('recommendations')}
        >
          <Ionicons
            name="star"
            size={20}
            color={activeTab === 'recommendations' ? '#007AFF' : '#666'}
          />
          <Text style={[styles.tabText, activeTab === 'recommendations' && styles.activeTabText]}>
            Recommendations
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'learning' && styles.activeTab]}
          onPress={() = accessibilityRole="button" accessible={true} accessibilityLabel="Button"> setActiveTab('learning')}
        >
          <Ionicons
            name="school"
            size={20}
            color={activeTab === 'learning' ? '#007AFF' : '#666'}
          />
          <Text style={[styles.tabText, activeTab === 'learning' && styles.activeTabText]}>
            Learning
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={refreshInsights} />
        }
      >
        {error && (
          <View style={styles.errorContainer}>
            <Ionicons name="warning" size={24} color="#FF4444" />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {activeTab === 'insights' && renderInsights()}
        {activeTab === 'recommendations' && renderRecommendations()}
        {activeTab === 'learning' && renderLearningResources()}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e1e5e9',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginLeft: 12,
    color: '#1a1a1a',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e1e5e9',
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#007AFF',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
    marginLeft: 6,
  },
  activeTabText: {
    color: '#007AFF',
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    marginTop: 12,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 4,
    textAlign: 'center',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffebee',
    padding: 16,
    margin: 16,
    borderRadius: 8,
  },
  errorText: {
    fontSize: 14,
    color: '#d32f2f',
    marginLeft: 8,
  },
  recommendationCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e1e5e9',
  },
  recommendationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  recommendationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    flex: 1,
    marginLeft: 8,
  },
  confidenceBadge: {
    backgroundColor: '#34C75920',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  confidenceText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#34C759',
  },
  recommendationDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 8,
  },
  recommendationTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  learningCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e1e5e9',
  },
  learningHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  learningTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    flex: 1,
    marginLeft: 8,
  },
  difficultyBadge: {
    backgroundColor: '#007AFF20',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  difficultyText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#007AFF',
    textTransform: 'capitalize',
  },
  learningDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 8,
  },
  learningMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  learningTime: {
    fontSize: 12,
    color: '#999',
  },
  learningTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  tagBadge: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  tagText: {
    fontSize: 10,
    color: '#666',
  },
});
