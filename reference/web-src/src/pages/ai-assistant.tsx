import { useState, useEffect } from "react";
import { ArrowLeft, Brain, Sparkles, BookOpen, Headphones, FileText, Zap, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useLocation } from "wouter";
import { useThoughtmarks } from "@/hooks/use-thoughtmarks";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface AIInsight {
  type: 'summary' | 'connections' | 'recommendations';
  title: string;
  content: string;
  items?: {
    title: string;
    description: string;
    url?: string;
    type: 'book' | 'podcast' | 'article';
  }[];
}

export default function AIAssistant() {
  const [, setLocation] = useLocation();
  const [query, setQuery] = useState("");
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { data: thoughtmarks = [] } = useThoughtmarks();
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();

  const analyzeThoughtmarksMutation = useMutation({
    mutationFn: async (analysisQuery: string) => {
      const response = await apiRequest("POST", "/api/ai/analyze", {
        query: analysisQuery,
        thoughtmarks: thoughtmarks.slice(0, 10) // Limit for analysis
      });
      return response.json();
    },
    onSuccess: (data) => {
      setInsights(data.insights || []);
      setIsAnalyzing(false);
    },
    onError: (error) => {
      toast({
        title: "Analysis Failed",
        description: "AI analysis requires an OpenAI API key. Please check settings.",
        variant: "destructive"
      });
      setIsAnalyzing(false);
    }
  });

  const handleAnalyze = () => {
    if (!query.trim()) {
      toast({
        title: "Enter a Query",
        description: "Please describe what you'd like to analyze about your thoughtmarks.",
        variant: "destructive"
      });
      return;
    }

    setIsAnalyzing(true);
    analyzeThoughtmarksMutation.mutate(query);
  };

  const quickAnalysis = [
    {
      title: "Summarize All",
      description: "Get a high-level overview of all your thoughtmarks",
      query: "Provide a comprehensive summary of all my thoughtmarks, identifying key themes and patterns."
    },
    {
      title: "Find Connections",
      description: "Discover hidden relationships between your ideas",
      query: "Analyze my thoughtmarks to find unexpected connections and relationships between different ideas."
    },
    {
      title: "Content Recommendations",
      description: "Get personalized book, podcast, and article suggestions",
      query: "Based on my thoughtmarks, recommend relevant books, podcasts, and articles to explore these topics deeper."
    }
  ];

  return (
    <div className="full-height bg-black text-white">
      <div className="max-w-md mx-auto p-6 pb-24">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button
            onClick={() => setLocation("/")}
            variant="ghost"
            size="icon"
            className="text-gray-400 hover:text-white"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-bold">AI Assistant</h1>
          <div className="w-10" />
        </div>

        {/* Premium Feature Notice */}
        {!isAuthenticated && (
          <Card className="bg-gradient-to-br from-blue-950 to-purple-950 border-blue-700 p-4 mb-6">
            <div className="flex items-start space-x-3">
              <Lock className="w-5 h-5 text-[#C6D600] mt-1" />
              <div>
                <h3 className="font-medium mb-1 text-[#C6D600]">Premium Feature</h3>
                <p className="text-gray-300 text-sm mb-3">
                  AI analysis requires premium access with cross-device sync. Your thoughtmarks are currently stored locally.
                </p>
                <div className="bg-gray-800 rounded-lg p-3 mb-3">
                  <h4 className="text-xs font-medium text-gray-300 mb-2">What AI Features Include:</h4>
                  <ul className="text-gray-400 text-xs space-y-1">
                    <li>• Intelligent thoughtmark summaries</li>
                    <li>• Connection discovery between ideas</li>
                    <li>• Personalized content recommendations</li>
                    <li>• Advanced pattern recognition</li>
                  </ul>
                </div>
                <Button
                  onClick={() => setLocation("/auth")}
                  className="w-full bg-[#C6D600] text-black hover:bg-[#C6D600]/90 text-sm"
                >
                  Upgrade to Premium
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Thoughtmark Stats */}
        <Card className="bg-gray-900 border-gray-700 p-4 mb-6">
          <div className="flex items-center space-x-3 mb-2">
            <Brain className="w-5 h-5 text-[#C6D600]" />
            <h3 className="font-medium">Your Thoughtmark Collection</h3>
          </div>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-lg font-bold text-[#C6D600]">{thoughtmarks.length}</div>
              <div className="text-xs text-gray-400">Total</div>
            </div>
            <div>
              <div className="text-lg font-bold text-[#C6D600]">
                {Array.from(new Set(thoughtmarks.flatMap(tm => tm.tags || []))).length}
              </div>
              <div className="text-xs text-gray-400">Tags</div>
            </div>
            <div>
              <div className="text-lg font-bold text-[#C6D600]">
                {thoughtmarks.filter(tm => tm.tags?.includes('voice')).length}
              </div>
              <div className="text-xs text-gray-400">Voice Notes</div>
            </div>
          </div>
        </Card>

        {/* Quick Analysis Options */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-300 mb-3">Quick Analysis</h3>
          <div className="space-y-2">
            {quickAnalysis.map((option, index) => (
              <Card 
                key={index} 
                className="bg-gray-900 border-gray-700 hover:border-[#C6D600] transition-colors cursor-pointer"
                onClick={() => setQuery(option.query)}
              >
                <div className="p-3">
                  <h4 className="font-medium text-sm mb-1">{option.title}</h4>
                  <p className="text-gray-400 text-xs">{option.description}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Custom Query */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-300 mb-3">Custom Analysis</h3>
          <Textarea
            placeholder="Ask me anything about your thoughtmarks... What patterns do you see? What should I read next?"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="bg-gray-900 border-gray-700 text-white placeholder-gray-500 mb-3"
            rows={3}
          />
          <Button
            onClick={handleAnalyze}
            disabled={isAnalyzing || !query.trim() || !isAuthenticated}
            className="w-full bg-[#C6D600] text-black hover:bg-[#C6D600]/90"
          >
            {isAnalyzing ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                <span>Analyzing...</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4" />
                <span>Analyze Thoughtmarks</span>
              </div>
            )}
          </Button>
        </div>

        {/* AI Insights */}
        {insights.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">AI Insights</h3>
            
            {insights.map((insight, index) => (
              <Card key={index} className="bg-gray-900 border-gray-700 p-4">
                <div className="flex items-start space-x-3 mb-3">
                  {insight.type === 'summary' && <FileText className="w-5 h-5 text-[#C6D600] mt-1" />}
                  {insight.type === 'connections' && <Zap className="w-5 h-5 text-[#C6D600] mt-1" />}
                  {insight.type === 'recommendations' && <BookOpen className="w-5 h-5 text-[#C6D600] mt-1" />}
                  <div className="flex-1">
                    <h4 className="font-medium mb-2">{insight.title}</h4>
                    <p className="text-gray-300 text-sm leading-relaxed">{insight.content}</p>
                  </div>
                </div>

                {/* Recommendations */}
                {insight.items && insight.items.length > 0 && (
                  <div className="space-y-2 mt-4">
                    {insight.items.map((item, itemIndex) => (
                      <div key={itemIndex} className="bg-gray-800 rounded-lg p-3">
                        <div className="flex items-start space-x-2">
                          {item.type === 'book' && <BookOpen className="w-4 h-4 text-blue-400 mt-1" />}
                          {item.type === 'podcast' && <Headphones className="w-4 h-4 text-green-400 mt-1" />}
                          {item.type === 'article' && <FileText className="w-4 h-4 text-orange-400 mt-1" />}
                          <div className="flex-1">
                            <h5 className="font-medium text-sm">{item.title}</h5>
                            <p className="text-gray-400 text-xs">{item.description}</p>
                            {item.url && (
                              <a 
                                href={item.url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-[#C6D600] text-xs hover:underline"
                              >
                                Learn More →
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}

        {/* Feature Explanation */}
        <Card className="bg-gradient-to-br from-gray-900 to-blue-950 border-blue-700 p-4 mt-8">
          <h3 className="font-medium mb-2 text-[#C6D600]">How AI Analysis Works</h3>
          <p className="text-gray-300 text-sm leading-relaxed">
            Our AI analyzes your thoughtmarks to identify patterns, themes, and connections 
            you might miss. It provides summaries, suggests related content, and helps you 
            discover insights from your collected thoughts. Your data remains private and 
            is never used for training other models.
          </p>
        </Card>
      </div>
    </div>
  );
}