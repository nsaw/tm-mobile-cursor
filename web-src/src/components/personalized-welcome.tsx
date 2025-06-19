import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent } from "@/components/ui/card";
import { Brain, Lightbulb, TrendingUp, Clock } from "lucide-react";
import type { Thoughtmark, Bin } from "@shared/schema";

interface PersonalizedWelcomeProps {
  className?: string;
}

export function PersonalizedWelcome({ className }: PersonalizedWelcomeProps) {
  const { user } = useAuth();
  
  const { data: thoughtmarks } = useQuery<Thoughtmark[]>({
    queryKey: ['/api/thoughtmarks'],
    enabled: !!user
  });

  const { data: bins } = useQuery<Bin[]>({
    queryKey: ['/api/bins'],
    enabled: !!user
  });

  if (!user || !thoughtmarks || !bins) {
    return null;
  }

  const thoughtmarkCount = thoughtmarks.length;
  const binCount = bins.length;
  const recentThoughtmarks = thoughtmarks.slice(0, 3);
  
  // Get most active bin
  const binActivity = bins.map(bin => ({
    ...bin,
    count: thoughtmarks.filter(tm => tm.binId === bin.id).length
  }));
  const mostActiveBin = binActivity.reduce((prev, current) => 
    (prev.count > current.count) ? prev : current
  );

  // Get user's most common tags
  const allTags = thoughtmarks.flatMap(tm => tm.tags || []);
  const tagCounts = allTags.reduce((acc, tag) => {
    acc[tag] = (acc[tag] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const topTags = Object.entries(tagCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 3)
    .map(([tag]) => tag);

  const getTimeOfDayGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  const getPersonalizedMessage = () => {
    if (thoughtmarkCount === 0) {
      return `Welcome to Thoughtmarks! Ready to capture your first brilliant idea?`;
    }
    
    if (thoughtmarkCount < 10) {
      return `You're building momentum with ${thoughtmarkCount} thoughtmarks. Your ideas are taking shape!`;
    }
    
    if (mostActiveBin.count > 0) {
      return `You've been especially creative in ${mostActiveBin.name} with ${mostActiveBin.count} thoughtmarks. What's next?`;
    }
    
    return `${thoughtmarkCount} thoughtmarks and counting! Your knowledge base is growing beautifully.`;
  };

  const getInsightMessage = () => {
    if (topTags.length > 0) {
      return `You're exploring themes around ${topTags.slice(0, 2).join(' and ')}`;
    }
    
    if (binCount > 3) {
      return `Your ${binCount} collections show diverse thinking patterns`;
    }
    
    return "Your thoughts are creating meaningful connections";
  };

  return (
    <Card className={className}>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-primary">
              {getTimeOfDayGreeting()}, {user.firstName || user.displayName?.split(' ')[0] || user.email?.split('@')[0] || 'there'}!
            </h2>
            <p className="text-muted-foreground">
              {getPersonalizedMessage()}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2 text-sm">
              <Brain className="w-4 h-4 text-primary" />
              <span>{thoughtmarkCount} thoughtmarks</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <Lightbulb className="w-4 h-4 text-primary" />
              <span>{binCount} collections</span>
            </div>
          </div>

          {topTags.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">Current focus</span>
              </div>
              <p className="text-sm text-muted-foreground">
                {getInsightMessage()}
              </p>
              <div className="flex flex-wrap gap-1">
                {topTags.map(tag => (
                  <span
                    key={tag}
                    className="px-2 py-1 text-xs bg-primary/10 text-primary rounded-md"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {recentThoughtmarks.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">Recent activity</span>
              </div>
              <div className="space-y-1">
                {recentThoughtmarks.slice(0, 2).map(thoughtmark => (
                  <div key={thoughtmark.id} className="text-sm text-muted-foreground truncate">
                    • {thoughtmark.title}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}