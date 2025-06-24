import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { AIBackButton } from "@/components/ui/BackButton";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { MobilePageLayout } from "@/components/mobile-page-layout";
import { useAuth } from "@/hooks/use-auth";
import { useThoughtmarks } from "@/hooks/use-thoughtmarks";
import { useBins } from "@/hooks/use-bins";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { 
  Brain, 
  Lightbulb, 
  TrendingUp, 
  Target, 
  Zap, 
  ArrowRight,
  Crown,
  Sparkles,
  BarChart3,
  Network,
  Clock,
  Star,
  BookOpen,
  ExternalLink,
  Play,
  Plus
} from "lucide-react";

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

export default function AITools() {
  const [, setLocation] = useLocation();
  const { user, isAuthenticated } = useAuth();
  const { data: thoughtmarks = [] } = useThoughtmarks();
  const { data: bins = [] } = useBins();
  const { toast } = useToast();
  
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
      
      if (response.ok) {
        const data = await response.json();
        setInsights(data.insights || []);
        setLastAnalysis(new Date());
        
        toast({
          title: "AI Insights Generated",
          description: `Found ${data.insights?.length || 0} insights from your thoughtmarks.`,

        });
      }
    } catch (error) {
      console.error("Failed to generate insights:", error);
      toast({
        title: "Analysis Failed",
        description: "Unable to generate insights. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingInsights(false);
    }
  };

  const handleInsightAction = (insight: AIInsight) => {
    switch (insight.type) {
      case 'pattern':
        if (insight.relatedThoughtmarks && insight.relatedThoughtmarks.length > 0) {
          const searchQuery = `Related to ${insight.title.toLowerCase()}`;
          setLocation(`/search?q=${encodeURIComponent(searchQuery)}`);
          toast({
            title: "Navigating to Related Items",
            description: `Showing thoughtmarks related to "${insight.title}"`,

          });
        }
        break;
      case 'recommendation':
        setLocation('/create-thoughtmark');
        toast({
          title: "Creating New Thoughtmark",
          description: `Use this insight: "${insight.description}"`,
          
        });
        break;
      case 'trend':
        setLocation('/all');
        toast({
          title: "Exploring Trends",
          description: `View all thoughtmarks to explore the trend: "${insight.title}"`,
          
        });
        break;
      case 'connection':
        setLocation('/');
        toast({
          title: "Viewing Connections",
          description: `Dashboard shows related items for: "${insight.title}"`,
          
        });
        break;
      default:
        toast({
          title: "Action Available",
          description: `Insight: ${insight.description}`,
          
        });
    }
  };

  const generateSmartSorts = async () => {
    if (!hasPremiumAccess || thoughtmarks.length === 0) return;
    
    setIsGeneratingSorts(true);
    try {
      const response = await apiRequest("POST", "/api/ai/smart-sort", {
        thoughtmarks: thoughtmarks.filter(t => !t.isDeleted).slice(0, 30)
      });
      
      if (response.ok) {
        const data = await response.json();
        setSmartSorts(data.sorts || []);
        
        toast({
          title: "Smart Sorting Complete",
          description: `Organized thoughtmarks into ${data.sorts?.length || 0} intelligent categories.`,
          
        });
      }
    } catch (error) {
      console.error("Failed to generate smart sorts:", error);
      toast({
        title: "Smart Sorting Failed",
        description: "Unable to organize thoughtmarks. Please try again later.",
        variant: "destructive",
        
      });
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
      
      if (response.ok) {
        const data = await response.json();
        setLearningResources(data.resources || []);
        
        toast({
          title: "Learning Resources Generated",
          description: `Found ${data.resources?.length || 0} relevant books and podcasts.`,
          
        });
      }
    } catch (error) {
      console.error("Failed to generate learning resources:", error);
      toast({
        title: "Resource Generation Failed",
        description: "Unable to generate learning resources. Please try again later.",
        variant: "destructive",
        
      });
    } finally {
      setIsGeneratingResources(false);
    }
  };

  const applySuggestedBin = async (thoughtmarkId: number, binName: string) => {
    try {
      const targetBin = bins.find(b => b.name.toLowerCase().includes(binName.toLowerCase()));
      if (!targetBin) {
        toast({
          title: "Bin Not Found",
          description: `Create a bin named "${binName}" first.`,
          variant: "destructive",
        });
        return;
      }

      const response = await apiRequest("PUT", `/api/thoughtmarks/${thoughtmarkId}`, {
        binId: targetBin.id
      });

      if (response.ok) {
        toast({
          title: "Thoughtmark Moved",
          description: `Successfully moved to ${binName}.`,
        });
      }
    } catch (error) {
      toast({
        title: "Move Failed",
        description: "Unable to move thoughtmark. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (!isAuthenticated) {
    return (
      <MobilePageLayout title="AI Tools" showBackButton={true}>
        <div className="max-w-2xl mx-auto text-center py-12 p-6">
          <Brain className="w-16 h-16 text-primary mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Sign In Required</h2>
          <p className="text-muted-foreground mb-6">
            Access AI-powered insights and smart organization tools.
          </p>
          <Button onClick={() => setLocation("/auth")}>
            Sign In to Continue
          </Button>
        </div>
      </MobilePageLayout>
    );
  }

  if (!hasPremiumAccess) {
    return (
      <MobilePageLayout title="AI Tools" showBackButton={true}>
        <div className="max-w-2xl mx-auto text-center py-12 p-6">
          <Crown className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Premium Feature</h2>
          <p className="text-muted-foreground mb-6">
            Unlock AI-powered insights, smart sorting, and personalized recommendations with Premium.
          </p>
          <Button onClick={() => setLocation("/subscribe")} className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600">
            <Crown className="w-4 h-4 mr-2" />
            Upgrade to Premium
          </Button>
        </div>
      </MobilePageLayout>
    );
  }

  return (
    <MobilePageLayout 
      title="AI Tools" 
      showBackButton={true}
      onBack={() => setLocation("/dashboard")}
    >

      <div className="max-w-4xl mx-auto p-6 space-y-6">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Sparkles className="w-8 h-8 text-primary mr-3" />
            <h1 className="text-2xl font-bold">AI-Powered Intelligence</h1>
          </div>
          <p className="text-muted-foreground">
            Discover patterns, get recommendations, and organize your thoughtmarks with artificial intelligence.
          </p>
          {lastAnalysis && (
            <p className="text-sm text-muted-foreground mt-2">
              Last analysis: {lastAnalysis.toLocaleString()}
            </p>
          )}
        </div>

        {/* Quick Actions */}
        <div className="flex flex-col gap-4 mb-8">
          <Button
            onClick={generateInsights}
            disabled={isGeneratingInsights}
            variant="outline"
            className="h-auto p-4 flex items-start space-x-3"
          >
            <Brain className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
            <div className="text-left">
              <div className="font-medium">Generate Insights</div>
              <div className="text-sm text-muted-foreground">
                {isGeneratingInsights ? "Analyzing patterns..." : "Discover hidden patterns and trends"}
              </div>
            </div>
          </Button>

          <Button
            onClick={generateSmartSorts}
            disabled={isGeneratingSorts}
            variant="outline"
            className="h-auto p-4 flex items-start space-x-3"
          >
            <Network className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
            <div className="text-left">
              <div className="font-medium">Smart Sort</div>
              <div className="text-sm text-muted-foreground">
                {isGeneratingSorts ? "Organizing content..." : "Intelligently categorize thoughtmarks"}
              </div>
            </div>
          </Button>

          <Button
            onClick={generateLearningResources}
            disabled={isGeneratingResources}
            variant="outline"
            className="h-auto p-4 flex items-start space-x-3"
          >
            <BookOpen className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
            <div className="text-left">
              <div className="font-medium">Learning Resources</div>
              <div className="text-sm text-muted-foreground">
                {isGeneratingResources ? "Finding resources..." : "Get relevant books and podcasts"}
              </div>
            </div>
          </Button>
        </div>

        {/* AI Insights */}
        {insights.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Lightbulb className="w-5 h-5 mr-2 text-primary" />
                AI Insights
              </CardTitle>
              <CardDescription>
                Patterns and recommendations discovered from your thoughtmarks
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {insights.map((insight, index) => (
                <div key={index} className="p-4 border rounded-lg space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {insight.type === 'pattern' && <BarChart3 className="w-4 h-4 text-blue-500" />}
                      {insight.type === 'recommendation' && <Target className="w-4 h-4 text-green-500" />}
                      {insight.type === 'trend' && <TrendingUp className="w-4 h-4 text-purple-500" />}
                      {insight.type === 'connection' && <Network className="w-4 h-4 text-orange-500" />}
                      <h4 className="font-medium">{insight.title}</h4>
                    </div>
                    <Badge variant="secondary">
                      Pattern match: {Math.round(insight.confidence * 100)}%
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{insight.description}</p>
                  {insight.actionable && (
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleInsightAction(insight)}
                    >
                      <ArrowRight className="w-3 h-3 mr-1" />
                      Take Action
                    </Button>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Smart Sorting Results */}
        {smartSorts.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Network className="w-5 h-5 mr-2 text-primary" />
                Smart Categories
              </CardTitle>
              <CardDescription>
                AI-suggested organization for your thoughtmarks
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {smartSorts.map((sort, index) => (
                <div key={index} className="p-4 border rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">{sort.category}</h4>
                    <Badge variant="secondary">
                      {sort.thoughtmarks.length} items
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{sort.reasoning}</p>
                  <div className="space-y-2">
                    {sort.thoughtmarks.slice(0, 3).map((thoughtmark, tmIndex) => (
                      <div key={tmIndex} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                        <span className="text-sm truncate flex-1">{thoughtmark.title}</span>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => applySuggestedBin(thoughtmark.id, sort.category)}
                        >
                          Move
                        </Button>
                      </div>
                    ))}
                    {sort.thoughtmarks.length > 3 && (
                      <p className="text-xs text-muted-foreground">
                        +{sort.thoughtmarks.length - 3} more items
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Learning Resources */}
        {learningResources.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BookOpen className="w-5 h-5 mr-2 text-primary" />
                Recommended Learning Resources
              </CardTitle>
              <CardDescription>
                Books and podcasts related to your recent thoughts
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {learningResources.map((resource, index) => (
                <div key={index} className="p-4 border rounded-lg space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-2">
                        {resource.type === 'book' && <BookOpen className="w-4 h-4 text-blue-500" />}
                        {resource.type === 'podcast' && <Play className="w-4 h-4 text-green-500" />}
                        {resource.type === 'video' && <Play className="w-4 h-4 text-red-500" />}
                        <h4 className="font-medium truncate">{resource.title}</h4>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">by {resource.author}</p>
                      <p className="text-sm mb-3">{resource.description}</p>
                      <p className="text-xs text-muted-foreground mb-2">
                        <strong>Why relevant:</strong> {resource.relevance}
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {resource.topics.map((topic, topicIndex) => (
                          <Badge key={topicIndex} variant="outline" className="text-xs">
                            {topic}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    {resource.url && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => window.open(resource.url, '_blank')}
                        className="ml-3 flex-shrink-0"
                      >
                        <ExternalLink className="w-3 h-3 mr-1" />
                        View
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Data Visualization */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="w-5 h-5 mr-2 text-primary" />
              Knowledge Analytics
            </CardTitle>
            <CardDescription>
              Visual insights into your thoughtmark patterns
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Key Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center p-3 bg-gray-800/50 rounded-lg">
                <div className="text-2xl font-bold text-[#C6D600]">{thoughtmarks.length}</div>
                <div className="text-sm text-gray-400">Total Thoughtmarks</div>
              </div>
              <div className="text-center p-3 bg-gray-800/50 rounded-lg">
                <div className="text-2xl font-bold text-blue-400">{bins.length}</div>
                <div className="text-sm text-gray-400">Active Bins</div>
              </div>
              <div className="text-center p-3 bg-gray-800/50 rounded-lg">
                <div className="text-2xl font-bold text-purple-400">
                  {Array.from(new Set(thoughtmarks.flatMap(t => t.tags || []))).length}
                </div>
                <div className="text-sm text-gray-400">Unique Tags</div>
              </div>
              <div className="text-center p-3 bg-gray-800/50 rounded-lg">
                <div className="text-2xl font-bold text-orange-400">
                  {insights.length + smartSorts.length + learningResources.length}
                </div>
                <div className="text-sm text-gray-400">AI Insights</div>
              </div>
            </div>

            {/* Activity Chart */}
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-300 mb-3">Weekly Activity</h4>
              <div className="flex items-end justify-between h-32 bg-gray-900/50 rounded-lg p-4">
                {Array.from({ length: 7 }, (_, i) => {
                  const date = new Date();
                  date.setDate(date.getDate() - (6 - i));
                  const dayThoughtmarks = thoughtmarks.filter(t => {
                    const thoughtmarkDate = new Date(t.createdAt);
                    return thoughtmarkDate.toDateString() === date.toDateString();
                  }).length;
                  const maxCount = Math.max(...Array.from({ length: 7 }, (_, j) => {
                    const checkDate = new Date();
                    checkDate.setDate(checkDate.getDate() - (6 - j));
                    return thoughtmarks.filter(t => {
                      const thoughtmarkDate = new Date(t.createdAt);
                      return thoughtmarkDate.toDateString() === checkDate.toDateString();
                    }).length;
                  }));
                  const height = maxCount > 0 ? (dayThoughtmarks / maxCount) * 80 : 4;
                  
                  return (
                    <div key={i} className="flex flex-col items-center">
                      <div 
                        className="w-6 bg-[#C6D600] rounded-t mb-2 transition-all duration-300"
                        style={{ height: `${Math.max(height, 4)}px` }}
                      />
                      <span className="text-xs text-gray-500">
                        {date.toLocaleDateString('en', { weekday: 'short' })}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Tag Distribution */}
            <div>
              <h4 className="text-sm font-medium text-gray-300 mb-3">Most Used Tags</h4>
              <div className="space-y-2">
                {Array.from(new Set(thoughtmarks.flatMap(t => t.tags || [])))
                  .map(tag => ({
                    tag,
                    count: thoughtmarks.filter(t => (t.tags || []).includes(tag)).length
                  }))
                  .sort((a, b) => b.count - a.count)
                  .slice(0, 5)
                  .map((item) => {
                    const maxCount = Math.max(...Array.from(new Set(thoughtmarks.flatMap(t => t.tags || [])))
                      .map(tag => thoughtmarks.filter(t => (t.tags || []).includes(tag)).length));
                    const width = maxCount > 0 ? (item.count / maxCount) * 100 : 0;
                    
                    return (
                      <div key={item.tag} className="flex items-center space-x-3">
                        <div className="w-16 text-xs text-gray-400 truncate">{item.tag}</div>
                        <div className="flex-1 bg-gray-800 rounded-full h-2">
                          <div 
                            className="h-2 rounded-full bg-gradient-to-r from-[#C6D600] to-blue-400 transition-all duration-500"
                            style={{ width: `${width}%` }}
                          />
                        </div>
                        <div className="text-xs text-gray-400 w-8">{item.count}</div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Empty State */}
        {thoughtmarks.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <Brain className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No Data to Analyze</h3>
              <p className="text-muted-foreground mb-6">
                Create some thoughtmarks first, then return here for AI-powered insights.
              </p>
              <Button onClick={() => setLocation("/thoughtmarks/create")}>
                <Zap className="w-4 h-4 mr-2" />
                Create Your First Thoughtmark
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </MobilePageLayout>
  );
}