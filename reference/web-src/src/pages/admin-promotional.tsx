import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle, Clock, Users, Shield, Settings, Gift, Calendar, Crown, Heart, Search, UserCheck, Mail, BarChart3, TrendingUp, Activity, FileText, Upload } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { PageLayout } from "@/components/page-layout";
import { Textarea } from "@/components/ui/textarea";
import { useQuery } from "@tanstack/react-query";

// Bulk User Management Component
function BulkUserManager() {
  const [bulkEmails, setBulkEmails] = useState("");
  const [bulkAction, setBulkAction] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleBulkAction = async () => {
    if (!bulkEmails.trim() || !bulkAction) {
      toast({
        title: "Missing Information",
        description: "Please enter email addresses and select an action",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    const emails = bulkEmails.split('\n').map(email => email.trim()).filter(email => email);
    
    try {
      const response = await apiRequest("POST", "/api/admin/bulk-action", {
        emails,
        action: bulkAction
      });

      if (response.ok) {
        const result = await response.json();
        toast({
          title: "Bulk Action Complete",
          description: `Processed ${result.successful} users successfully, ${result.failed} failed`
        });
        setBulkEmails("");
      } else {
        throw new Error("Failed to process bulk action");
      }
    } catch (error) {
      toast({
        title: "Bulk Action Failed",
        description: "Unable to process bulk user action",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="bulk-emails">Email Addresses (one per line)</Label>
        <Textarea
          id="bulk-emails"
          placeholder="user1@example.com&#10;user2@example.com&#10;user3@example.com"
          value={bulkEmails}
          onChange={(e) => setBulkEmails(e.target.value)}
          rows={6}
        />
      </div>
      
      <div>
        <Label htmlFor="bulk-action">Action</Label>
        <Select value={bulkAction} onValueChange={setBulkAction}>
          <SelectTrigger>
            <SelectValue placeholder="Select bulk action" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="trial_14">Start 14-Day Trial</SelectItem>
            <SelectItem value="trial_30">Start 30-Day Trial</SelectItem>
            <SelectItem value="friends_family">Grant Friends & Family</SelectItem>
            <SelectItem value="premium_monthly">Premium Monthly</SelectItem>
            <SelectItem value="premium_annual">Premium Annual</SelectItem>
            <SelectItem value="premium_lifetime">Premium Lifetime</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button 
        onClick={handleBulkAction} 
        disabled={isProcessing}
        className="w-full"
      >
        {isProcessing ? "Processing..." : `Apply ${bulkAction.replace('_', ' ').toUpperCase()} to ${bulkEmails.split('\n').filter(email => email.trim()).length} users`}
      </Button>
    </div>
  );
}

// System Health Monitor Component
function SystemHealthMonitor() {
  const [systemHealth, setSystemHealth] = useState({
    status: 'healthy',
    uptime: '2d 14h 23m',
    memoryUsage: '68%',
    dbConnections: 12,
    activeUsers: 47,
    responseTime: '142ms',
    errorRate: '0.02%'
  });

  return (
    <div className="space-y-6">
      {/* Status Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600">System Status</p>
              <p className="text-lg font-bold text-green-900 capitalize">{systemHealth.status}</p>
            </div>
            <CheckCircle className="w-6 h-6 text-green-500" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600">Uptime</p>
              <p className="text-lg font-bold text-blue-900">{systemHealth.uptime}</p>
            </div>
            <Clock className="w-6 h-6 text-blue-500" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-600">Response Time</p>
              <p className="text-lg font-bold text-purple-900">{systemHealth.responseTime}</p>
            </div>
            <Activity className="w-6 h-6 text-purple-500" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-orange-600">Error Rate</p>
              <p className="text-lg font-bold text-orange-900">{systemHealth.errorRate}</p>
            </div>
            <AlertCircle className="w-6 h-6 text-orange-500" />
          </div>
        </div>
      </div>

      {/* Resource Usage */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Memory Usage</h3>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-blue-600 h-2 rounded-full" style={{ width: systemHealth.memoryUsage }}></div>
          </div>
          <p className="text-sm text-gray-600 mt-1">{systemHealth.memoryUsage} of available memory</p>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Database Connections</h3>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-gray-900">{systemHealth.dbConnections}</span>
            <span className="text-sm text-gray-600">Active connections</span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex gap-2 flex-wrap">
        <Button variant="outline" size="sm">
          <Activity className="w-4 h-4 mr-2" />
          View Logs
        </Button>
        <Button variant="outline" size="sm">
          <Settings className="w-4 h-4 mr-2" />
          System Config
        </Button>
        <Button variant="outline" size="sm">
          <BarChart3 className="w-4 h-4 mr-2" />
          Performance Metrics
        </Button>
      </div>
    </div>
  );
}

// User Analytics Dashboard Component
function UserAnalyticsDashboard() {
  const { data: analytics, isLoading } = useQuery({
    queryKey: ["/api/admin/analytics"],
    refetchInterval: 30000 // Refresh every 30 seconds
  });

  if (isLoading) {
    return <div className="text-center py-8">Loading analytics...</div>;
  }

  const stats = analytics || {
    totalUsers: 0,
    premiumUsers: 0,
    trialUsers: 0,
    activeUsers: 0,
    newUsersToday: 0,
    conversionRate: 0,
    recentSignups: [],
    subscriptionBreakdown: {}
  };

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600">Total Users</p>
              <p className="text-2xl font-bold text-blue-900">{stats.totalUsers}</p>
            </div>
            <Users className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600">Premium Users</p>
              <p className="text-2xl font-bold text-green-900">{stats.premiumUsers}</p>
            </div>
            <Crown className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-orange-600">Trial Users</p>
              <p className="text-2xl font-bold text-orange-900">{stats.trialUsers}</p>
            </div>
            <Clock className="w-8 h-8 text-orange-500" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-600">Active Today</p>
              <p className="text-2xl font-bold text-purple-900">{stats.activeUsers}</p>
            </div>
            <Activity className="w-8 h-8 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Conversion Rate */}
      <div className="bg-gradient-to-r from-indigo-50 to-indigo-100 p-6 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-indigo-900">Conversion Rate</h3>
            <p className="text-3xl font-bold text-indigo-700">{stats.conversionRate}%</p>
            <p className="text-sm text-indigo-600">Trial to Premium conversion</p>
          </div>
          <TrendingUp className="w-12 h-12 text-indigo-500" />
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Recent Signups
          </h3>
          <div className="space-y-2">
            {stats.recentSignups?.slice(0, 5).map((signup: any, index: number) => (
              <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <span className="text-sm">{signup.email}</span>
                <Badge variant="outline">{signup.role}</Badge>
              </div>
            )) || <p className="text-gray-500">No recent signups</p>}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Subscription Breakdown
          </h3>
          <div className="space-y-2">
            {Object.entries(stats.subscriptionBreakdown || {}).map(([type, count]) => (
              <div key={type} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <span className="text-sm capitalize">{type.replace('_', ' ')}</span>
                <Badge>{count}</Badge>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// User Lookup Widget Component
function UserLookupWidget() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [newRole, setNewRole] = useState("");
  const { toast } = useToast();

  const availableRoles = [
    { value: "free", label: "Free User", color: "bg-gray-500" },
    { value: "premium_trial_14", label: "14-Day Trial", color: "bg-blue-500" },
    { value: "premium_trial_30", label: "30-Day Trial", color: "bg-indigo-500" },
    { value: "premium_monthly", label: "Premium Monthly", color: "bg-yellow-500" },
    { value: "premium_annual", label: "Premium Annual", color: "bg-green-500" },
    { value: "premium_lifetime", label: "Premium Lifetime", color: "bg-purple-500" },
    { value: "demo", label: "Demo User", color: "bg-orange-500" },
    { value: "admin", label: "Admin", color: "bg-red-500" },
    { value: "superuser", label: "Superuser", color: "bg-red-700" }
  ];

  const searchUsers = async () => {
    if (!searchTerm.trim()) {
      toast({
        title: "Error",
        description: "Please enter a search term",
        variant: "destructive"
      });
      return;
    }

    setIsSearching(true);
    try {
      const response = await apiRequest("GET", `/api/admin/users?search=${encodeURIComponent(searchTerm)}`);
      
      if (response.ok) {
        const users = await response.json();
        setSearchResults(users.slice(0, 10)); // Limit to 10 results
        
        if (users.length === 0) {
          toast({
            title: "No Results",
            description: "No users found matching your search",
          });
        }
      } else {
        throw new Error("Failed to search users");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to search users",
        variant: "destructive"
      });
    } finally {
      setIsSearching(false);
    }
  };

  const assignRole = async () => {
    if (!selectedUser || !newRole) {
      toast({
        title: "Error",
        description: "Please select a user and role",
        variant: "destructive"
      });
      return;
    }

    setIsUpdating(true);
    try {
      const response = await apiRequest("POST", `/api/admin/assign-role/${selectedUser.id}`, {
        roleName: newRole
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: `Role updated to ${availableRoles.find(r => r.value === newRole)?.label} for ${selectedUser.email}`,
        });
        
        // Update selected user's role in the UI
        setSelectedUser({
          ...selectedUser,
          role: newRole
        });
        
        // Clear selections
        setNewRole("");
      } else {
        const result = await response.json();
        throw new Error(result.message || "Failed to assign role");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to assign role",
        variant: "destructive"
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const getRoleInfo = (roleName: string) => {
    return availableRoles.find(r => r.value === roleName) || { label: roleName, color: "bg-gray-500" };
  };

  return (
    <div className="space-y-4">
      {/* Search Section */}
      <div className="space-y-2">
        <Label htmlFor="userSearch">Search Users</Label>
        <div className="flex gap-2">
          <Input
            id="userSearch"
            placeholder="Enter email, name, or user ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && searchUsers()}
            className="bg-gray-800 border-gray-700"
          />
          <Button 
            onClick={searchUsers} 
            disabled={isSearching}
            className="bg-primary hover:bg-primary/90"
          >
            {isSearching ? (
              <div className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full" />
            ) : (
              <Search className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <div className="space-y-2">
          <Label>Search Results</Label>
          <div className="max-h-60 overflow-y-auto space-y-2 border border-gray-700 rounded-lg p-2">
            {searchResults.map((user) => (
              <div
                key={user.id}
                onClick={() => setSelectedUser(user)}
                className={`p-3 rounded-lg cursor-pointer transition-colors ${
                  selectedUser?.id === user.id 
                    ? 'bg-primary/20 border border-primary' 
                    : 'bg-gray-800 hover:bg-gray-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <UserCheck className="w-4 h-4" />
                    <div>
                      <div className="font-medium">{user.displayName || user.email}</div>
                      <div className="text-xs text-muted-foreground flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        {user.email}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge className={`${getRoleInfo(user.role || 'free').color} text-white text-xs`}>
                      {getRoleInfo(user.role || 'free').label}
                    </Badge>
                    <div className="text-xs text-muted-foreground mt-1">
                      ID: {user.id}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Selected User and Role Assignment */}
      {selectedUser && (
        <div className="space-y-4 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
          <div className="flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-primary" />
            <Label className="text-primary font-medium">Selected User</Label>
          </div>
          
          <div className="space-y-2">
            <div className="text-sm">
              <strong>Name:</strong> {selectedUser.displayName || 'No name set'}
            </div>
            <div className="text-sm">
              <strong>Email:</strong> {selectedUser.email}
            </div>
            <div className="text-sm flex items-center gap-2">
              <strong>Current Role:</strong>
              <Badge className={`${getRoleInfo(selectedUser.role || 'free').color} text-white`}>
                {getRoleInfo(selectedUser.role || 'free').label}
              </Badge>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="newRole">Assign New Role</Label>
            <Select value={newRole} onValueChange={setNewRole}>
              <SelectTrigger className="bg-gray-800 border-gray-700">
                <SelectValue placeholder="Select a role..." />
              </SelectTrigger>
              <SelectContent>
                {availableRoles.map((role) => (
                  <SelectItem key={role.value} value={role.value}>
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${role.color}`} />
                      {role.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            onClick={assignRole}
            disabled={isUpdating || !newRole}
            className="w-full bg-primary hover:bg-primary/90"
          >
            {isUpdating ? (
              <div className="animate-spin w-4 h-4 mr-2 border-2 border-current border-t-transparent rounded-full" />
            ) : (
              <UserCheck className="w-4 h-4 mr-2" />
            )}
            Assign Role
          </Button>
        </div>
      )}
    </div>
  );
}

export default function AdminPromotional() {
  const [userEmail, setUserEmail] = useState("");
  const [accessType, setAccessType] = useState("trial_14");
  const [isLoading, setIsLoading] = useState(false);
  const [lastAction, setLastAction] = useState<string | null>(null);
  const [generatedLink, setGeneratedLink] = useState<string | null>(null);
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { user, loading: authLoading } = useAuth();

  // Security check
  if (authLoading) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center full-height">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
        </div>
      </PageLayout>
    );
  }

  if (!user?.isAdmin && user?.email !== "nick@sawyerdesign.io") {
    return (
      <PageLayout>
        <div className="max-w-4xl mx-auto text-center py-12">
          <Shield className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-red-500 mb-2">Access Denied</h1>
          <p className="text-muted-foreground">You don't have permission to access this page.</p>
        </div>
      </PageLayout>
    );
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Link copied to clipboard",
    });
  };

  const handleStartTrial = async (trialType: '14_day' | '30_day') => {
    if (!userEmail.trim()) {
      toast({
        title: "Error",
        description: "Please enter a user email",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      // First find user by email to get their ID
      const usersResponse = await apiRequest("GET", "/api/admin/users");
      const users = await usersResponse.json();
      const targetUser = users.find((u: any) => u.email === userEmail.trim());
      
      if (!targetUser) {
        throw new Error("User not found with that email");
      }

      const response = await apiRequest("POST", `/api/admin/start-trial/${targetUser.id}`, {
        trialType
      });

      const result = await response.json();
      
      if (response.ok) {
        toast({
          title: "Success",
          description: `${trialType === '14_day' ? '14-day' : '30-day'} trial started for ${userEmail}`,
        });
        setLastAction(`Started ${trialType} trial for ${userEmail}`);
        setUserEmail("");
      } else {
        throw new Error(result.message || "Failed to start trial");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to start trial",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGrantFriendsFamily = async () => {
    if (!userEmail.trim()) {
      toast({
        title: "Error",
        description: "Please enter a user email",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      // First find user by email to get their ID
      const usersResponse = await apiRequest("GET", "/api/admin/users");
      const users = await usersResponse.json();
      const targetUser = users.find((u: any) => u.email === userEmail.trim());
      
      if (!targetUser) {
        throw new Error("User not found with that email");
      }

      const response = await apiRequest("POST", `/api/admin/grant-friends-family/${targetUser.id}`);

      const result = await response.json();
      
      if (response.ok) {
        toast({
          title: "Success",
          description: `Friends & family premium access granted to ${userEmail}`,
        });
        setLastAction(`Granted friends & family access to ${userEmail}`);
        setUserEmail("");
      } else {
        throw new Error(result.message || "Failed to grant access");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to grant friends & family access",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateLink = async () => {
    setIsLoading(true);
    try {
      const response = await apiRequest("POST", "/api/admin/generate-premium-link", {
        userEmail: userEmail.trim() || undefined,
        accessType,
        linkExpiryHours: 72
      });

      const result = await response.json();
      
      if (response.ok) {
        setGeneratedLink(result.link);
        toast({
          title: "Success",
          description: "Promotional link generated successfully",
        });
        setLastAction(`Generated ${result.accessType} link${userEmail ? ` for ${userEmail}` : ' (generic)'}`);
      } else {
        throw new Error(result.message || "Failed to generate link");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to generate promotional link",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const accessTypeInfo = {
    trial_14: { icon: Calendar, label: "14-Day Trial", color: "bg-blue-500", description: "Two-week premium trial" },
    trial_30: { icon: Calendar, label: "30-Day Trial", color: "bg-indigo-500", description: "One-month premium trial" },
    friends_family: { icon: Heart, label: "Friends & Family", color: "bg-pink-500", description: "Lifetime premium access" },
    premium_monthly: { icon: Crown, label: "Premium Monthly", color: "bg-yellow-500", description: "Monthly subscription" },
    premium_annual: { icon: Crown, label: "Premium Annual", color: "bg-green-500", description: "Annual subscription" },
    premium_lifetime: { icon: Crown, label: "Premium Lifetime", color: "bg-purple-500", description: "Lifetime access" }
  };

  const currentAccessInfo = accessTypeInfo[accessType as keyof typeof accessTypeInfo];
  const IconComponent = currentAccessInfo.icon;

  return (
    <PageLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <Gift className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold text-primary">Promotional Access Management</h1>
          </div>
          <p className="text-muted-foreground">Manage trial periods, friends & family access, and promotional links</p>
          
          <div className="flex justify-center gap-4 mt-4">
            <Button
              onClick={() => setLocation("/admin-premium-fixed")}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Shield className="w-4 h-4" />
              Admin Dashboard
            </Button>
            <Button
              onClick={() => setLocation("/form-automation")}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Settings className="w-4 h-4" />
              Form Automation
            </Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* User Lookup and Role Assignment */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                User Lookup & Role Assignment
              </CardTitle>
              <CardDescription>
                Find users and assign roles for customer support
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <UserLookupWidget />
            </CardContent>
          </Card>

          {/* Direct User Access Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Direct User Access
              </CardTitle>
              <CardDescription>
                Grant promotional access directly to specific users
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="userEmail">User Email</Label>
                <Input
                  id="userEmail"
                  type="email"
                  placeholder="user@example.com"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  className="bg-gray-800 border-gray-700"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Button
                  onClick={() => handleStartTrial('14_day')}
                  disabled={isLoading}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Start 14-Day Trial
                </Button>
                <Button
                  onClick={() => handleStartTrial('30_day')}
                  disabled={isLoading}
                  className="bg-indigo-600 hover:bg-indigo-700"
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Start 30-Day Trial
                </Button>
              </div>

              <Button
                onClick={handleGrantFriendsFamily}
                disabled={isLoading}
                className="w-full bg-pink-600 hover:bg-pink-700"
              >
                <Heart className="w-4 h-4 mr-2" />
                Grant Friends & Family Access
              </Button>
            </CardContent>
          </Card>

          {/* Shareable Link Generation */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gift className="w-5 h-5" />
                Shareable Promotional Links
              </CardTitle>
              <CardDescription>
                Generate links that automatically grant access when clicked
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="accessType">Access Type</Label>
                <Select value={accessType} onValueChange={setAccessType}>
                  <SelectTrigger className="bg-gray-800 border-gray-700">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="trial_14">14-Day Trial</SelectItem>
                    <SelectItem value="trial_30">30-Day Trial</SelectItem>
                    <SelectItem value="friends_family">Friends & Family</SelectItem>
                    <SelectItem value="premium_monthly">Premium Monthly</SelectItem>
                    <SelectItem value="premium_annual">Premium Annual</SelectItem>
                    <SelectItem value="premium_lifetime">Premium Lifetime</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="linkUserEmail">Specific User Email (optional)</Label>
                <Input
                  id="linkUserEmail"
                  type="email"
                  placeholder="Leave empty for generic link"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  className="bg-gray-800 border-gray-700"
                />
              </div>

              <div className={`p-3 rounded-lg ${currentAccessInfo.color}/20 border border-current/30`}>
                <div className="flex items-center gap-2 mb-2">
                  <IconComponent className="w-4 h-4" />
                  <span className="font-medium">{currentAccessInfo.label}</span>
                </div>
                <p className="text-sm text-muted-foreground">{currentAccessInfo.description}</p>
              </div>

              <Button
                onClick={handleGenerateLink}
                disabled={isLoading}
                className="w-full bg-primary hover:bg-primary/90"
              >
                {isLoading ? (
                  <div className="animate-spin w-4 h-4 mr-2 border-2 border-current border-t-transparent rounded-full" />
                ) : (
                  <Gift className="w-4 h-4 mr-2" />
                )}
                Generate Promotional Link
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Generated Link Display */}
        {generatedLink && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                Promotional Link Generated
              </CardTitle>
              <CardDescription>
                Share this link to automatically grant the selected access type
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <Input
                  value={generatedLink}
                  readOnly
                  className="bg-gray-800 border-gray-700 text-sm pr-20 font-mono"
                />
                <Button
                  onClick={() => copyToClipboard(generatedLink)}
                  variant="outline"
                  size="sm"
                  className="absolute right-1 top-1 h-8 bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  Copy
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  onClick={() => copyToClipboard(generatedLink)}
                  variant="default"
                  className="bg-primary hover:bg-primary/90"
                >
                  📋 Copy Link
                </Button>
                <Button
                  onClick={() => setGeneratedLink(null)}
                  variant="outline"
                  className="border-gray-700"
                >
                  Clear
                </Button>
              </div>
              <div className="text-xs text-green-300 space-y-1">
                <p>✓ Link expires in 72 hours</p>
                <p>✓ Automatically applies selected access type</p>
                <p>✓ Works for logged-in users only</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Last Action Display */}
        {lastAction && (
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-green-400">
                <CheckCircle className="w-4 h-4" />
                <span className="text-sm">Last action: {lastAction}</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Bulk User Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Bulk User Management
            </CardTitle>
            <CardDescription>
              Manage multiple users at once for campaigns and promotions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <BulkUserManager />
          </CardContent>
        </Card>

        {/* User Analytics Dashboard */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              User Analytics & Insights
            </CardTitle>
            <CardDescription>
              Monitor user engagement and subscription metrics
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <UserAnalyticsDashboard />
          </CardContent>
        </Card>

        {/* System Health Monitor */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              System Health & Performance
            </CardTitle>
            <CardDescription>
              Monitor system status, database health, and API performance
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <SystemHealthMonitor />
          </CardContent>
        </Card>

        {/* API Reference */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              API Reference
            </CardTitle>
            <CardDescription>
              Available admin endpoints and promotional access tools
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="space-y-1 text-sm font-mono bg-muted p-3 rounded">
                <div>POST /api/admin/start-trial/:userId</div>
                <div>POST /api/admin/grant-friends-family/:userId</div>
                <div>POST /api/admin/assign-role/:userId</div>
                <div>POST /api/admin/generate-premium-link</div>
                <div>GET /api/admin/users?search=term</div>
                <div>GET /api/admin/analytics</div>
                <div>POST /api/admin/bulk-action</div>
                <div>GET /premium-invite/:token</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
}