import { useState, useEffect } from 'react';
import { AIInsight, AIRecommendation, AISortingRule, LearningResource } from '../types/ai-types';
import { aiService } from '../services/aiService';

export const useAIInsights = () => {
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([]);
  const [sortingRules, setSortingRules] = useState<AISortingRule[]>([]);
  const [learningResources, setLearningResources] = useState<LearningResource[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadAIInsights();
  }, []);

  const loadAIInsights = async () => {
    try {
      setLoading(true);
      const [newInsights, newRecommendations, newSortingRules, newLearningResources] = await Promise.all([
        aiService.generateInsights(),
        aiService.generateRecommendations(),
        aiService.getSortingRules(),
        aiService.generateLearningResources(),
      ]);

      setInsights(newInsights);
      setRecommendations(newRecommendations);
      setSortingRules(newSortingRules);
      setLearningResources(newLearningResources);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load AI insights');
    } finally {
      setLoading(false);
    }
  };

  const refreshInsights = async () => {
    await loadAIInsights();
  };

  const updateSortingRule = async (ruleId: string, updates: Partial<AISortingRule>) => {
    try {
      const updatedRule = await aiService.updateSortingRule(ruleId, updates);
      if (updatedRule) {
        setSortingRules(prev => prev.map(rule => rule.id === ruleId ? updatedRule : rule));
      }
      return updatedRule;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update sorting rule');
      throw err;
    }
  };

  const performSmartSorting = async (items: any[]) => {
    try {
      return await aiService.performSmartSorting(items);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to perform smart sorting');
      throw err;
    }
  };

  return {
    insights,
    recommendations,
    sortingRules,
    learningResources,
    loading,
    error,
    refreshInsights,
    updateSortingRule,
    performSmartSorting,
  };
};
