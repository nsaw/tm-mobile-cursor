import { AIInsight, AIRecommendation, AISortingRule, LearningResource } from '../types/ai-types';
import useAppStore, { Thoughtmark, Task } from '../../../state/stores/appStore';

class AIService {
  private insights: AIInsight[] = [];
  private recommendations: AIRecommendation[] = [];
  private sortingRules: AISortingRule[] = [
    {
      id: 'priority-sort',
      name: 'Priority-based Sorting',
      criteria: { priority: 'desc' },
      priority: 1,
      enabled: true,
    },
    {
      id: 'date-sort',
      name: 'Date-based Sorting',
      criteria: { createdAt: 'desc' },
      priority: 2,
      enabled: true,
    },
    {
      id: 'tag-sort',
      name: 'Tag-based Grouping',
      criteria: { groupBy: 'tags' },
      priority: 3,
      enabled: true,
    },
  ];

  async generateInsights(): Promise<AIInsight[]> {
    const store = useAppStore.getState();
    const insights: AIInsight[] = [];

    // Analyze thoughtmarks for insights
    const thoughtmarks = store.thoughtmarks;
    if (thoughtmarks.length > 0) {
      // Productivity insight
      const recentThoughtmarks = thoughtmarks.filter((t: Thoughtmark) => {
        const createdAt = new Date(t.createdAt);
        const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        return createdAt > weekAgo;
      });

      if (recentThoughtmarks.length > 10) {
        insights.push({
          id: Date.now().toString(),
          type: 'productivity',
          title: 'High Activity Week',
          description: `You've created ${recentThoughtmarks.length} thoughtmarks this week. Consider organizing them into bins for better structure.`,
          confidence: 85,
          actionable: true,
          action: 'Create organization bins',
          priority: 'medium',
          createdAt: new Date().toISOString(),
        });
      }

      // Organization insight
      const untaggedThoughtmarks = thoughtmarks.filter((t: Thoughtmark) => !t.tags || t.tags.length === 0);
      if (untaggedThoughtmarks.length > 5) {
        insights.push({
          id: (Date.now() + 1).toString(),
          type: 'organization',
          title: 'Untagged Content',
          description: `You have ${untaggedThoughtmarks.length} thoughtmarks without tags. Adding tags can help with organization and search.`,
          confidence: 90,
          actionable: true,
          action: 'Add tags to thoughtmarks',
          priority: 'high',
          createdAt: new Date().toISOString(),
        });
      }
    }

    // Analyze tasks for insights
    const tasks = store.tasks;
    if (tasks.length > 0) {
      const incompleteTasks = tasks.filter((t: Task) => !t.isCompleted);
      if (incompleteTasks.length > 10) {
        insights.push({
          id: (Date.now() + 2).toString(),
          type: 'productivity',
          title: 'Task Backlog',
          description: `You have ${incompleteTasks.length} incomplete tasks. Consider prioritizing or breaking them down into smaller tasks.`,
          confidence: 75,
          actionable: true,
          action: 'Review and prioritize tasks',
          priority: 'high',
          createdAt: new Date().toISOString(),
        });
      }
    }

    this.insights = insights;
    return insights;
  }

  async generateRecommendations(): Promise<AIRecommendation[]> {
    const store = useAppStore.getState();
    const recommendations: AIRecommendation[] = [];

    // Content recommendations based on existing thoughtmarks
    const thoughtmarks = store.thoughtmarks;
    if (thoughtmarks.length > 0) {
      // Find common themes
      const allTags = thoughtmarks.flatMap((t: Thoughtmark) => t.tags || []);
      const tagCounts = allTags.reduce((acc: Record<string, number>, tag: string) => {
        acc[tag] = (acc[tag] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const topTags = Object.entries(tagCounts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 3);

      topTags.forEach(([tag, count]: [string, number]) => {
        recommendations.push({
          id: Date.now().toString() + Math.random(),
          type: 'content',
          title: `Explore ${tag} further`,
          description: `You've used the '${tag}' tag ${count} times. Consider creating more content in this area or exploring related topics.`,
          confidence: Math.min(70 + count * 5, 95),
          relatedItems: thoughtmarks.filter((t: Thoughtmark) => t.tags?.includes(tag)).map((t: Thoughtmark) => t.id),
          tags: [tag],
          createdAt: new Date().toISOString(),
        });
      });
    }

    this.recommendations = recommendations;
    return recommendations;
  }

  async performSmartSorting(items: any[], criteria?: Record<string, any>): Promise<any[]> {
    const activeRules = this.sortingRules.filter(rule => rule.enabled);
    activeRules.sort((a, b) => a.priority - b.priority);

    let sortedItems = [...items];

    activeRules.forEach(rule => {
      sortedItems = this.applySortingRule(sortedItems, rule);
    });

    return sortedItems;
  }

  private applySortingRule(items: any[], rule: AISortingRule): any[] {
    const { criteria } = rule;

    if (criteria.priority) {
      return items.sort((a, b) => {
        const aPriority = a.priority || 0;
        const bPriority = b.priority || 0;
        return criteria.priority === 'desc' ? bPriority - aPriority : aPriority - bPriority;
      });
    }

    if (criteria.createdAt) {
      return items.sort((a, b) => {
        const aDate = new Date(a.createdAt || 0);
        const bDate = new Date(b.createdAt || 0);
        return criteria.createdAt === 'desc' ? bDate.getTime() - aDate.getTime() : aDate.getTime() - bDate.getTime();
      });
    }

    if (criteria.groupBy === 'tags') {
      const grouped = items.reduce((acc, item) => {
        const tags = item.tags || [];
        tags.forEach((tag: any) => {
          if (!acc[tag]) acc[tag] = [];
          acc[tag].push(item);
        });
        return acc;
      }, {} as Record<string, any[]>);

      return Object.values(grouped).flat();
    }

    return items;
  }

  async generateLearningResources(): Promise<LearningResource[]> {
    const resources: LearningResource[] = [
      {
        id: '1',
        title: 'Getting Started with ThoughtMarks',
        description: 'Learn the basics of organizing your thoughts and ideas effectively.',
        type: 'guide',
        tags: ['getting-started', 'organization'],
        difficulty: 'beginner',
        estimatedTime: 15,
      },
      {
        id: '2',
        title: 'Advanced Tagging Strategies',
        description: 'Master the art of tagging for better content discovery and organization.',
        type: 'article',
        tags: ['tagging', 'organization', 'advanced'],
        difficulty: 'intermediate',
        estimatedTime: 10,
      },
      {
        id: '3',
        title: 'Productivity Workflows',
        description: 'Create efficient workflows to boost your productivity with ThoughtMarks.',
        type: 'tutorial',
        tags: ['productivity', 'workflow'],
        difficulty: 'intermediate',
        estimatedTime: 20,
      },
    ];

    return resources;
  }

  async getInsights(): Promise<AIInsight[]> {
    return this.insights;
  }

  async getRecommendations(): Promise<AIRecommendation[]> {
    return this.recommendations;
  }

  async getSortingRules(): Promise<AISortingRule[]> {
    return this.sortingRules;
  }

  async updateSortingRule(ruleId: string, updates: Partial<AISortingRule>): Promise<AISortingRule | null> {
    const ruleIndex = this.sortingRules.findIndex(r => r.id === ruleId);
    if (ruleIndex === -1) return null;

    this.sortingRules[ruleIndex] = { ...this.sortingRules[ruleIndex], ...updates };
    return this.sortingRules[ruleIndex];
  }
}

export const aiService = new AIService();
