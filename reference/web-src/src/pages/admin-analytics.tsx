import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Activity, Users, Eye, AlertTriangle, TrendingUp, Clock, BarChart3, Zap } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

interface AnalyticsSummary {
  summary: {
    title: string;
    period: string;
    status: 'healthy' | 'warning' | 'critical';
  };
  keyMetrics: {
    activeUsers: {
      today: number;
      week: number;
    };
    engagement: {
      pageViewsToday: number;
      avgPageViewsPerUser: number;
    };
    stability: {
      errorRate: number;
      errorsToday: number;
      status: 'good' | 'warning' | 'poor';
    };
  };
  insights: string[];
  topIssues: {
    description: string;
    occurrences: number;
  }[];
}

export default function AdminAnalytics() {
  const [timeframe, setTimeframe] = useState('24h');

  const { data: summary, isLoading } = useQuery<AnalyticsSummary>({
    queryKey: ['/api/analytics/executive-summary', timeframe],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
      case 'good':
        return 'text-green-600 bg-green-50';
      case 'warning':
        return 'text-yellow-600 bg-yellow-50';
      case 'critical':
      case 'poor':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
      case 'good':
        return <TrendingUp className="h-4 w-4" />;
      case 'warning':
        return <Clock className="h-4 w-4" />;
      case 'critical':
      case 'poor':
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-sm text-muted-foreground">Loading analytics data...</p>
        </div>
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertTriangle className="h-8 w-8 text-yellow-500 mx-auto mb-4" />
          <p className="text-sm text-muted-foreground">Unable to load analytics data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{summary.summary.title}</h1>
          <p className="text-muted-foreground">{summary.summary.period}</p>
        </div>
        <div className="flex items-center gap-4">
          <Badge className={getStatusColor(summary.summary.status)}>
            {getStatusIcon(summary.summary.status)}
            <span className="ml-2 capitalize">{summary.summary.status}</span>
          </Badge>
          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">Last 24h</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users Today</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.keyMetrics.activeUsers.today}</div>
            <p className="text-xs text-muted-foreground">
              {summary.keyMetrics.activeUsers.week} this week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Page Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.keyMetrics.engagement.pageViewsToday}</div>
            <p className="text-xs text-muted-foreground">
              {summary.keyMetrics.engagement.avgPageViewsPerUser} avg per user
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Error Rate</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.keyMetrics.stability.errorRate}%</div>
            <p className="text-xs text-muted-foreground">
              {summary.keyMetrics.stability.errorsToday} errors today
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Status</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Badge className={getStatusColor(summary.keyMetrics.stability.status)}>
                {getStatusIcon(summary.keyMetrics.stability.status)}
                <span className="ml-2 capitalize">{summary.keyMetrics.stability.status}</span>
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-2">All systems operational</p>
          </CardContent>
        </Card>
      </div>

      {/* Insights and Issues */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Key Insights */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Key Insights
            </CardTitle>
            <CardDescription>
              Quick overview of beta user behavior patterns
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {summary.insights.map((insight, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mt-2"></div>
                  <p className="text-sm">{insight}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Issues */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Top Issues
            </CardTitle>
            <CardDescription>
              Most frequent problems requiring attention
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {summary.topIssues.length > 0 ? (
                summary.topIssues.map((issue, index) => (
                  <div key={index} className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <p className="text-sm font-medium">{issue.description}</p>
                      <p className="text-xs text-muted-foreground">
                        {issue.occurrences} occurrence{issue.occurrences !== 1 ? 's' : ''}
                      </p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {issue.occurrences}
                    </Badge>
                  </div>
                ))
              ) : (
                <div className="text-center py-4">
                  <TrendingUp className="h-8 w-8 text-green-500 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">No major issues detected</p>
                  <p className="text-xs text-muted-foreground">All systems running smoothly</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics Tabs */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Analytics</CardTitle>
          <CardDescription>
            Comprehensive beta user behavior analysis and system performance metrics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="navigation">Navigation</TabsTrigger>
              <TabsTrigger value="features">Features</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="text-center py-8">
                <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium">Analytics Overview</h3>
                <p className="text-sm text-muted-foreground max-w-md mx-auto">
                  Comprehensive analytics tracking is active. Data collection includes page views, 
                  user interactions, error tracking, and performance monitoring.
                </p>
                <div className="mt-6 grid grid-cols-2 gap-4 max-w-md mx-auto">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">✓</div>
                    <p className="text-xs">Privacy Compliant</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">✓</div>
                    <p className="text-xs">Real-time Tracking</p>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="navigation" className="space-y-4">
              <div className="text-center py-8">
                <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium">Navigation Flow Analysis</h3>
                <p className="text-sm text-muted-foreground">
                  Track user journey through the application, identifying popular paths and drop-off points.
                </p>
              </div>
            </TabsContent>

            <TabsContent value="features" className="space-y-4">
              <div className="text-center py-8">
                <Zap className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium">Feature Usage Analytics</h3>
                <p className="text-sm text-muted-foreground">
                  Monitor which features are most popular and identify areas for improvement.
                </p>
              </div>
            </TabsContent>

            <TabsContent value="performance" className="space-y-4">
              <div className="text-center py-8">
                <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium">Performance Monitoring</h3>
                <p className="text-sm text-muted-foreground">
                  Track page load times, API response times, and system stability metrics.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Privacy Notice */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 rounded-full bg-blue-500 mt-2"></div>
            <div>
              <h4 className="text-sm font-medium text-blue-900">Privacy & Data Protection</h4>
              <p className="text-xs text-blue-800 mt-1">
                All analytics data is anonymized and aggregated. No personally identifiable information 
                is stored. Data collection respects user privacy preferences and GDPR compliance.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}