import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, Clock, Target, Lightbulb, BarChart3, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";

interface InsightData {
  totalThoughtmarks: number;
  completedTasks: number;
  totalTasks: number;
  mostActiveBin: string;
  mostUsedTags: string[];
  weeklyActivity: number[];
  streakDays: number;
  averageThoughtmarkLength: number;
  lastActivity: string;
  productivityTrend: 'up' | 'down' | 'stable';
}

export function ThoughtmarkInsights() {
  const [showInsights, setShowInsights] = useState(false);

  const { data: insights, isLoading } = useQuery<InsightData>({
    queryKey: ["/api/insights"],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/insights");
      return response.json();
    },
    staleTime: 10 * 60 * 1000, // Cache for 10 minutes
  });

  // Auto-show insights if user has enough data
  useEffect(() => {
    if (insights && insights.totalThoughtmarks > 5 && !showInsights) {
      setShowInsights(true);
    }
  }, [insights, showInsights]);

  if (!insights || insights.totalThoughtmarks < 3) return null;

  const taskCompletionRate = insights.totalTasks > 0 
    ? (insights.completedTasks / insights.totalTasks) * 100 
    : 0;

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up': return 'text-green-400';
      case 'down': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4" />;
      case 'down': return <TrendingUp className="w-4 h-4 rotate-180" />;
      default: return <BarChart3 className="w-4 h-4" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-4"
    >
      <Card className="bg-gradient-to-br from-blue-950/30 to-indigo-950/30 border-blue-800/50">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-white">
            <Lightbulb className="w-5 h-5 text-yellow-400" />
            Your Insights
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          {/* Total Thoughtmarks */}
          <motion.div 
            className="text-center p-3 bg-gray-800/50 rounded-lg"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="text-2xl font-bold text-[#C6D600]">
              {insights.totalThoughtmarks}
            </div>
            <div className="text-xs text-gray-400">Thoughtmarks</div>
          </motion.div>

          {/* Streak */}
          <motion.div 
            className="text-center p-3 bg-gray-800/50 rounded-lg"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="text-2xl font-bold text-orange-400">
              {insights.streakDays}
            </div>
            <div className="text-xs text-gray-400">Day Streak</div>
          </motion.div>

          {/* Task Completion */}
          {insights.totalTasks > 0 && (
            <motion.div 
              className="col-span-2 p-3 bg-gray-800/50 rounded-lg space-y-2"
              whileHover={{ scale: 1.01 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-blue-400" />
                  <span className="text-sm text-white">Task Progress</span>
                </div>
                <span className="text-sm text-gray-400">
                  {insights.completedTasks}/{insights.totalTasks}
                </span>
              </div>
              <Progress 
                value={taskCompletionRate} 
                className="h-2 bg-gray-700"
              />
              <div className="text-xs text-gray-400 text-center">
                {Math.round(taskCompletionRate)}% completed
              </div>
            </motion.div>
          )}

          {/* Productivity Trend */}
          <motion.div 
            className="col-span-2 p-3 bg-gray-800/50 rounded-lg"
            whileHover={{ scale: 1.01 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-purple-400" />
                <span className="text-sm text-white">Productivity</span>
              </div>
              <div className={`flex items-center gap-1 ${getTrendColor(insights.productivityTrend)}`}>
                {getTrendIcon(insights.productivityTrend)}
                <span className="text-sm capitalize">
                  {insights.productivityTrend}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Most Active Bin */}
          {insights.mostActiveBin && (
            <motion.div 
              className="col-span-2 p-3 bg-gray-800/50 rounded-lg"
              whileHover={{ scale: 1.01 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="text-sm text-gray-400 mb-1">Most Active Bin</div>
              <div className="text-white font-medium">
                {insights.mostActiveBin}
              </div>
            </motion.div>
          )}

          {/* Top Tags */}
          {insights.mostUsedTags.length > 0 && (
            <motion.div 
              className="col-span-2 p-3 bg-gray-800/50 rounded-lg"
              whileHover={{ scale: 1.01 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="text-sm text-gray-400 mb-2">Top Tags</div>
              <div className="flex flex-wrap gap-1">
                {insights.mostUsedTags.slice(0, 4).map((tag, index) => (
                  <motion.div
                    key={tag}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Badge 
                      variant="outline" 
                      className="text-xs border-gray-600 text-gray-300"
                    >
                      {tag}
                    </Badge>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Last Activity */}
          <motion.div 
            className="col-span-2 p-3 bg-gray-800/50 rounded-lg"
            whileHover={{ scale: 1.01 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-400">Last activity</span>
              <span className="text-sm text-white">
                {formatDistanceToNow(new Date(insights.lastActivity), { addSuffix: true })}
              </span>
            </div>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}