import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../../../theme/theme';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { useAuth } from '../../auth/hooks/useAuth';
import { useThoughtmarks } from '../../home/hooks/useThoughtmarks';
import { useBins } from '../../home/hooks/useBins';
import { apiRequest } from '../../../services/api';
import { useNavigation } from '@react-navigation/native';
import { ModernHeader } from '../../../components/ui/ModernHeader';
import { BottomNav } from '../../../components/ui/BottomNav';

interface AIInsight {
  type: 'pattern' | 'recommendation' | 'trend' | 'connection';
  title: string;
  description: string;
  confidence: number;
  actionable: boolean;
  relatedThoughtmarks?: number[];
}

interface SmartSort {
  category: string;
  thoughtmarks: any[];
  reasoning: string;
  confidence: number;
}

interface LearningResource {
  type: 'book' | 'podcast' | 'video';
  title: string;
  author: string;
  description: string;
  url?: string;
  relevance: string;
  topics: string[];
}

export const AIToolsScreen: React.FC = () => {
  const navigation = useNavigation();
  const { user, isAuthenticated } = useAuth();
  const { thoughtmarks } = useThoughtmarks();
  const { bins } = useBins();
  
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [smartSorts, setSmartSorts] = useState<SmartSort[]>([]);
  const [learningResources, setLearningResources] = useState<LearningResource[]>([]);
  const [isGeneratingInsights, setIsGeneratingInsights] = useState(false);
  const [isGeneratingSorts, setIsGeneratingSorts] = useState(false);
  const [isGeneratingResources, setIsGeneratingResources] = useState(false);
  const [lastAnalysis, setLastAnalysis] = useState<Date | null>(null);

  // Check if user has premium access
  const hasPremiumAccess = user?.isPremium || user?.isTestUser;

  useEffect(() => {
    if (hasPremiumAccess && thoughtmarks.length > 0) {
      generateInsights();
    }
  }, [hasPremiumAccess, thoughtmarks.length]);

  const generateInsights = async () => {
    if (!hasPremiumAccess || thoughtmarks.length === 0) return;
    
    setIsGeneratingInsights(true);
    try {
      const response = await apiRequest("POST", "/api/ai/insights", {
        thoughtmarks: thoughtmarks.slice(0, 50) // Limit to avoid token limits
      });
      
      if (response.success) {
        setInsights(response.data.insights || []);
        setLastAnalysis(new Date());
        Alert.alert(
          "AI Insights Generated",
          `Found ${response.data.insights?.length || 0} insights from your thoughtmarks.`
        );
      }
    } catch (error) {
      console.error("Failed to generate insights:", error);
      Alert.alert(
        "Analysis Failed",
        "Unable to generate insights. Please try again later."
      );
    } finally {
      setIsGeneratingInsights(false);
    }
  };

  const handleInsightAction = (insight: AIInsight) => {
    switch (insight.type) {
      case 'pattern':
        if (insight.relatedThoughtmarks && insight.relatedThoughtmarks.length > 0) {
          const searchQuery = `Related to ${insight.title.toLowerCase()}`;
          navigation.navigate('Search', { query: searchQuery });
          Alert.alert(
            "Navigating to Related Items",
            `Showing thoughtmarks related to "${insight.title}"`
          );
        }
        break;
      case 'recommendation':
        navigation.navigate('CreateThoughtmark');
        Alert.alert(
          "Creating New Thoughtmark",
          `Use this insight: "${insight.description}"`
        );
        break;
      case 'trend':
        navigation.navigate('AllThoughtmarks');
        Alert.alert(
          "Exploring Trends",
          `View all thoughtmarks to explore the trend: "${insight.title}"`
        );
        break;
      case 'connection':
        navigation.navigate('Dashboard');
        Alert.alert(
          "Viewing Connections",
          `Dashboard shows related items for: "${insight.title}"`
        );
        break;
      default:
        Alert.alert(
          "Action Available",
          `Insight: ${insight.description}`
        );
    }
  };

  const generateSmartSorts = async () => {
    if (!hasPremiumAccess || thoughtmarks.length === 0) return;
    
    setIsGeneratingSorts(true);
    try {
      const response = await apiRequest("POST", "/api/ai/smart-sort", {
        thoughtmarks: thoughtmarks.filter(t => !t.isDeleted).slice(0, 30)
      });
      
      if (response.success) {
        setSmartSorts(response.data.sorts || []);
        Alert.alert(
          "Smart Sorting Complete",
          `Organized thoughtmarks into ${response.data.sorts?.length || 0} intelligent categories.`
        );
      }
    } catch (error) {
      console.error("Failed to generate smart sorts:", error);
      Alert.alert(
        "Smart Sorting Failed",
        "Unable to organize thoughtmarks. Please try again later."
      );
    } finally {
      setIsGeneratingSorts(false);
    }
  };

  const generateLearningResources = async () => {
    if (!hasPremiumAccess || thoughtmarks.length === 0) return;
    
    setIsGeneratingResources(true);
    try {
      const response = await apiRequest("POST", "/api/ai/learning-resources", {
        thoughtmarks: thoughtmarks.slice(0, 20)
      });
      
      if (response.success) {
        setLearningResources(response.data.resources || []);
        Alert.alert(
          "Learning Resources Generated",
          `Found ${response.data.resources?.length || 0} relevant books and podcasts.`
        );
      }
    } catch (error) {
      console.error("Failed to generate learning resources:", error);
      Alert.alert(
        "Resource Generation Failed",
        "Unable to generate learning resources. Please try again later."
      );
    } finally {
      setIsGeneratingResources(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <View style={styles.container}>
        <View style={styles.centerContent}>
          <Ionicons name="brain" size={64} color={colors.primary} />
          <Text style={styles.title}>Sign In Required</Text>
          <Text style={styles.subtitle}>
            Access AI-powered insights and smart organization tools.
          </Text>
          <Button
            title="Sign In to Continue"
            onPress={() => navigation.navigate('SignIn')}
            style={styles.button}
          />
        </View>
      </View>
    );
  }

  if (!hasPremiumAccess) {
    return (
      <View style={styles.container}>
        <View style={styles.centerContent}>
          <Ionicons name="crown" size={64} color="#FFD700" />
          <Text style={styles.title}>Premium Feature</Text>
          <Text style={styles.subtitle}>
            Unlock AI-powered insights, smart sorting, and personalized recommendations with Premium.
          </Text>
          <Button
            title="Upgrade to Premium"
            onPress={() => navigation.navigate('Subscribe')}
            style={[styles.button, styles.premiumButton]}
          />
        </View>
      </View>
    );
  }

  const aiTools = [
    {
      id: 1,
      title: 'Smart Categorization',
      description: 'Automatically organize your thoughtmarks into relevant bins',
      icon: 'folder-open',
      color: '#3B82F6',
      premium: false,
    },
    {
      id: 2,
      title: 'Tag Suggestions',
      description: 'Get intelligent tag recommendations for your content',
      icon: 'pricetag',
      color: '#10B981',
      premium: false,
    },
    {
      id: 3,
      title: 'Content Summarization',
      description: 'Generate concise summaries of your longer thoughtmarks',
      icon: 'document-text',
      color: '#F59E0B',
      premium: true,
    },
    {
      id: 4,
      title: 'Related Content',
      description: 'Discover connections between your thoughtmarks',
      icon: 'git-network',
      color: '#8B5CF6',
      premium: true,
    },
    {
      id: 5,
      title: 'Voice Transcription',
      description: 'Convert voice notes to text with AI accuracy',
      icon: 'mic',
      color: '#EF4444',
      premium: true,
    },
    {
      id: 6,
      title: 'Smart Search',
      description: 'Find content using natural language queries',
      icon: 'search',
      color: '#06B6D4',
      premium: true,
    },
  ];

  const handleToolPress = (tool: any) => {
    // TODO: Implement AI tool functionality
    console.log('AI Tool pressed:', tool.title);
  };

  const handleNavigate = (path: string) => {
    switch (path) {
      case '/':
        navigation.navigate('Dashboard');
        break;
      case '/search':
        navigation.navigate('Search');
        break;
      case '/all-thoughtmarks':
        navigation.navigate('AllThoughtmarks');
        break;
      case '/ai-tools':
        navigation.navigate('AITools');
        break;
      default:
        break;
    }
  };

  const handleVoiceRecord = () => {
    // TODO: Implement voice recording
    console.log('Voice recording started');
  };

  const handleCreateThoughtmark = () => {
    navigation.navigate('CreateThoughtmark');
  };

  return (
    <View style={styles.container}>
      <ModernHeader 
        title="AI TOOLS" 
        subtitle="Enhance your thoughtmarks with AI"
      />

      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.introSection}>
          <Card style={styles.introCard}>
            <View style={styles.introContent}>
              <Ionicons name="sparkles" size={32} color={colors.primary} />
              <Text style={styles.introTitle}>AI-Powered Features</Text>
              <Text style={styles.introDescription}>
                Unlock the full potential of your thoughtmarks with intelligent AI tools that help you organize, discover, and create more effectively.
              </Text>
            </View>
          </Card>
        </View>

        <View style={styles.toolsSection}>
          <Text style={styles.sectionTitle}>Available Tools</Text>
          {aiTools.map((tool) => (
            <TouchableOpacity
              key={tool.id}
              style={styles.toolCard}
              onPress={() => handleToolPress(tool)}
            >
              <Card style={styles.toolCardContent}>
                <View style={styles.toolIconContainer}>
                  <View style={[styles.toolIcon, { backgroundColor: tool.color }]}>
                    <Ionicons name={tool.icon as any} size={24} color="#FFFFFF" />
                  </View>
                  {tool.premium && (
                    <View style={styles.premiumBadge}>
                      <Ionicons name="star" size={12} color="#FFD700" />
                    </View>
                  )}
                </View>
                <View style={styles.toolContent}>
                  <View style={styles.toolHeader}>
                    <Text style={styles.toolTitle}>{tool.title}</Text>
                    {tool.premium && (
                      <Text style={styles.premiumText}>PREMIUM</Text>
                    )}
                  </View>
                  <Text style={styles.toolDescription}>{tool.description}</Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color={colors.subtext} />
              </Card>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.upgradeSection}>
          <Card style={styles.upgradeCard}>
            <View style={styles.upgradeContent}>
              <Ionicons name="diamond" size={32} color="#FFD700" />
              <Text style={styles.upgradeTitle}>Upgrade to Premium</Text>
              <Text style={styles.upgradeDescription}>
                Get access to all AI tools and unlock advanced features for the ultimate thoughtmark experience.
              </Text>
              <TouchableOpacity style={styles.upgradeButton}>
                <Text style={styles.upgradeButtonText}>Upgrade Now</Text>
              </TouchableOpacity>
            </View>
          </Card>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <BottomNav
        onNavigate={handleNavigate}
        onVoiceRecord={handleVoiceRecord}
        showCreateButton={true}
        currentRoute="/ai-tools"
        onCreateNew={handleCreateThoughtmark}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: 120,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  title: {
    fontSize: typography.heading.fontSize,
    fontWeight: '600',
    color: colors.text,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: typography.body.fontSize,
    color: colors.subtext,
    textAlign: 'center',
    marginBottom: spacing.xl,
    lineHeight: 20,
  },
  button: {
    marginTop: spacing.md,
  },
  premiumButton: {
    backgroundColor: '#FFD700',
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  headerTitle: {
    fontSize: typography.heading.fontSize,
    fontWeight: '700',
    color: colors.text,
    marginLeft: spacing.sm,
  },
  headerSubtitle: {
    fontSize: typography.body.fontSize,
    color: colors.subtext,
    textAlign: 'center',
    lineHeight: 20,
  },
  lastAnalysis: {
    fontSize: 12,
    color: colors.subtext,
    marginTop: spacing.sm,
  },
  actionsSection: {
    marginBottom: spacing.xl,
  },
  actionButton: {
    backgroundColor: colors.card,
    borderRadius: spacing.md,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  actionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionText: {
    flex: 1,
    marginLeft: spacing.md,
  },
  actionTitle: {
    fontSize: typography.body.fontSize,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  actionDescription: {
    fontSize: 12,
    color: colors.subtext,
  },
  card: {
    marginBottom: spacing.lg,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  cardTitle: {
    fontSize: typography.subheading.fontSize,
    fontWeight: '600',
    color: colors.text,
    marginLeft: spacing.sm,
  },
  cardDescription: {
    fontSize: typography.body.fontSize,
    color: colors.subtext,
    marginBottom: spacing.md,
  },
  insightsList: {
    gap: spacing.md,
  },
  insightItem: {
    padding: spacing.md,
    backgroundColor: colors.background,
    borderRadius: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  insightIcon: {
    marginRight: spacing.sm,
  },
  insightTitle: {
    flex: 1,
    fontSize: typography.body.fontSize,
    fontWeight: '600',
    color: colors.text,
  },
  confidenceBadge: {
    backgroundColor: colors.primary + '20',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: spacing.sm,
  },
  confidenceText: {
    fontSize: 10,
    color: colors.primary,
    fontWeight: '600',
  },
  insightDescription: {
    fontSize: typography.body.fontSize,
    color: colors.subtext,
    marginBottom: spacing.sm,
    lineHeight: 18,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
  },
  actionButtonText: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '500',
    marginLeft: spacing.xs,
  },
  sortsList: {
    gap: spacing.md,
  },
  sortItem: {
    padding: spacing.md,
    backgroundColor: colors.background,
    borderRadius: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sortTitle: {
    fontSize: typography.body.fontSize,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  sortReasoning: {
    fontSize: typography.body.fontSize,
    color: colors.subtext,
    marginBottom: spacing.xs,
    lineHeight: 18,
  },
  sortCount: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '500',
  },
  resourcesList: {
    gap: spacing.md,
  },
  resourceItem: {
    padding: spacing.md,
    backgroundColor: colors.background,
    borderRadius: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  resourceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  resourceTitle: {
    flex: 1,
    fontSize: typography.body.fontSize,
    fontWeight: '600',
    color: colors.text,
    marginLeft: spacing.sm,
  },
  resourceAuthor: {
    fontSize: 12,
    color: colors.subtext,
    marginBottom: spacing.xs,
  },
  resourceDescription: {
    fontSize: typography.body.fontSize,
    color: colors.subtext,
    marginBottom: spacing.xs,
    lineHeight: 18,
  },
  resourceRelevance: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '500',
  },
  introSection: {
    marginBottom: spacing.xl,
  },
  introCard: {
    padding: spacing.lg,
  },
  introContent: {
    alignItems: 'center',
  },
  introTitle: {
    fontSize: typography.heading.fontSize,
    fontWeight: '700',
    color: colors.text,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  introDescription: {
    fontSize: typography.body.fontSize,
    color: colors.subtext,
    textAlign: 'center',
    lineHeight: 20,
  },
  toolsSection: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: typography.heading.fontSize,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.md,
  },
  toolCard: {
    marginBottom: spacing.md,
  },
  toolCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  toolIconContainer: {
    marginRight: spacing.md,
  },
  toolIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  toolContent: {
    flex: 1,
  },
  toolHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  toolTitle: {
    fontSize: typography.body.fontSize,
    fontWeight: '600',
    color: colors.text,
  },
  premiumText: {
    fontSize: 10,
    color: colors.primary,
    fontWeight: '600',
    marginLeft: spacing.sm,
  },
  toolDescription: {
    fontSize: typography.body.fontSize,
    color: colors.subtext,
  },
  premiumBadge: {
    backgroundColor: colors.primary + '20',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: spacing.sm,
    position: 'absolute',
    top: 0,
    right: 0,
  },
  upgradeSection: {
    marginBottom: spacing.xl,
  },
  upgradeCard: {
    padding: spacing.lg,
  },
  upgradeContent: {
    alignItems: 'center',
  },
  upgradeTitle: {
    fontSize: typography.heading.fontSize,
    fontWeight: '700',
    color: colors.text,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  upgradeDescription: {
    fontSize: typography.body.fontSize,
    color: colors.subtext,
    textAlign: 'center',
    lineHeight: 20,
  },
  upgradeButton: {
    backgroundColor: '#FFD700',
    padding: spacing.md,
    borderRadius: spacing.md,
    marginTop: spacing.md,
  },
  upgradeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  content: {
    flex: 1,
  },
}); 