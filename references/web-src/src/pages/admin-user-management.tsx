import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Badge } from "@/components/ui/badge";
import { Search, Users, Shield, Settings, Crown, UserCheck, UserX, Clock, Mail, Calendar } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { PageLayout } from "@/components/page-layout";
import { formatDistanceToNow } from "date-fns";

interface User {
  id: number;
  email: string;
  displayName?: string;
  isPremium: boolean;
  isTestUser: boolean;
  isFriendsFamily: boolean;
  isAdmin: boolean;
  premiumExpiresAt?: Date;
  createdAt: Date;
  lastLoginAt?: Date;
}

export default function AdminUserManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isUpdatingRole, setIsUpdatingRole] = useState(false);
  const [lastAction, setLastAction] = useState<string | null>(null);
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { user, loading: authLoading } = useAuth();

  // Check admin access
  useEffect(() => {
    if (!authLoading && (!user || !user.isAdmin)) {
      toast({
        title: "Access Denied",
        description: "Admin access required",
        variant: "destructive"
      });
      setLocation("/dashboard");
    }
  }, [user, authLoading, setLocation, toast]);

  // Load all users on component mount
  useEffect(() => {
    if (user?.isAdmin) {
      loadAllUsers();
    }
  }, [user]);

  const loadAllUsers = async () => {
    setIsLoading(true);
    try {
      const response = await apiRequest("GET", "/api/admin/users");
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users || []);
      }
    } catch (error) {
      console.error("Failed to load users:", error);
      toast({
        title: "Error",
        description: "Failed to load users",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const searchUsers = async () => {
    if (!searchQuery.trim() || searchQuery.trim().length < 2) {
      toast({
        title: "Search Error",
        description: "Please enter at least 2 characters to search",
        variant: "destructive"
      });
      return;
    }

    setIsSearching(true);
    try {
      const response = await apiRequest("GET", `/api/admin/users/search?query=${encodeURIComponent(searchQuery.trim())}`);
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users || []);
        setLastAction(`Found ${data.users?.length || 0} users matching "${searchQuery}"`);
      } else {
        const error = await response.json();
        throw new Error(error.message || "Search failed");
      }
    } catch (error: any) {
      toast({
        title: "Search Error",
        description: error.message || "Failed to search users",
        variant: "destructive"
      });
    } finally {
      setIsSearching(false);
    }
  };

  const updateUserRole = async (userId: number, role: string) => {
    setIsUpdatingRole(true);
    try {
      const response = await apiRequest("POST", `/api/admin/users/${userId}/role`, { role });
      
      if (response.ok) {
        const data = await response.json();
        toast({
          title: "Success",
          description: data.message,
        });
        
        // Update the user in our local state
        setUsers(prevUsers => 
          prevUsers.map(u => 
            u.id === userId ? { ...u, ...data.user } : u
          )
        );
        
        if (selectedUser?.id === userId) {
          setSelectedUser({ ...selectedUser, ...data.user });
        }
        
        setLastAction(`Updated user ${data.user.email} to ${role} role`);
      } else {
        const error = await response.json();
        throw new Error(error.message || "Failed to update role");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update user role",
        variant: "destructive"
      });
    } finally {
      setIsUpdatingRole(false);
    }
  };

  const getUserRoleDisplay = (user: User) => {
    if (user.isAdmin) return { label: "Admin", color: "bg-purple-600", icon: Shield };
    if (user.isFriendsFamily) return { label: "Friends & Family", color: "bg-green-600", icon: UserCheck };
    if (user.isTestUser) return { label: "Test User", color: "bg-blue-600", icon: Settings };
    if (user.isPremium) return { label: "Premium", color: "bg-yellow-600", icon: Crown };
    return { label: "Free", color: "bg-gray-600", icon: UserX };
  };

  const getUserStatusBadges = (user: User) => {
    const badges = [];
    const role = getUserRoleDisplay(user);
    
    badges.push(
      <Badge key="role" className={`${role.color} text-white !text-white`} style={{ color: 'white !important' }}>
        <role.icon className="w-3 h-3 mr-1" />
        {role.label}
      </Badge>
    );

    // Only show expiration for users who aren't test users, demo accounts, or lifetime subscribers
    if (user.premiumExpiresAt && !user.isTestUser && !user.isFriendsFamily && (user as any).subscriptionTier !== 'lifetime') {
      const expiryDate = new Date(user.premiumExpiresAt);
      const isExpired = expiryDate < new Date();
      badges.push(
        <Badge key="expiry" className={`${isExpired ? "bg-red-600" : "bg-orange-600"} text-white !text-white`} style={{ color: 'white !important' }}>
          <Clock className="w-3 h-3 mr-1" />
          {isExpired ? "Expired" : `Expires ${formatDistanceToNow(expiryDate)}`}
        </Badge>
      );
    }

    return badges;
  };

  if (authLoading) {
    return (
      <PageLayout>
        <div className="h-screen flex items-center justify-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
        </div>
      </PageLayout>
    );
  }

  if (!user?.isAdmin) {
    return null;
  }

  return (
    <PageLayout>
      <div className="max-w-7xl mx-auto space-y-8 admin-user-management">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <Users className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold text-primary">User Management</h1>
          </div>
          <p className="text-muted-foreground">Search and manage user roles and permissions</p>
        </div>

        {/* Search Section */}
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-400">
              <Search className="w-5 h-5" />
              User Search
            </CardTitle>
            <CardDescription>
              Search users by email or display name
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-3">
              <div className="flex-1">
                <Input
                  placeholder="Search by email or name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && searchUsers()}
                  className="bg-gray-800 border-gray-700"
                />
              </div>
              <Button 
                onClick={searchUsers}
                disabled={isSearching}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isSearching ? "Searching..." : "Search"}
              </Button>
              <Button 
                onClick={loadAllUsers}
                disabled={isLoading}
                variant="outline"
                className="border-gray-700"
              >
                {isLoading ? "Loading..." : "Show All"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Users List */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Users Grid */}
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-400">
                <Users className="w-5 h-5" />
                Users ({users.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full mx-auto mb-2" />
                  <p className="text-muted-foreground">Loading users...</p>
                </div>
              ) : users.length > 0 ? (
                <div className="space-y-3 max-h-96 overflow-y-auto smooth-scroll">
                  {users.map((user) => (
                    <div
                      key={user.id}
                      onClick={() => setSelectedUser(user)}
                      className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                        selectedUser?.id === user.id 
                          ? 'border-primary bg-primary/10' 
                          : 'border-gray-700 hover:border-gray-600 hover:bg-gray-800/50'
                      }`}
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-white">{user.displayName || user.email}</p>
                            {user.displayName && (
                              <p className="text-sm text-gray-400">{user.email}</p>
                            )}
                          </div>
                          <div className="text-xs text-gray-500">ID: {user.id}</div>
                        </div>
                        
                        <div className="flex flex-wrap gap-1">
                          {getUserStatusBadges(user)}
                        </div>
                        
                        <div className="text-xs text-gray-500">
                          Created {formatDistanceToNow(new Date(user.createdAt))} ago
                          {user.lastLoginAt && (
                            <> • Last login {formatDistanceToNow(new Date(user.lastLoginAt))} ago</>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-400">
                  <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No users found</p>
                  <p className="text-sm">Try adjusting your search or load all users</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* User Details & Role Management */}
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-yellow-400">
                <Settings className="w-5 h-5" />
                Role Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedUser ? (
                <div className="space-y-6">
                  {/* User Info */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                        <span className="text-primary-foreground font-medium">
                          {(selectedUser.displayName || selectedUser.email).charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-medium text-white">{selectedUser.displayName || selectedUser.email}</h3>
                        <p className="text-sm text-gray-400">{selectedUser.email}</p>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {getUserStatusBadges(selectedUser)}
                    </div>
                  </div>

                  {/* Role Selection */}
                  <div className="space-y-4">
                    <Label className="text-white">Change User Role</Label>
                    <div className="grid gap-2">
                      <Button
                        onClick={() => updateUserRole(selectedUser.id, 'free')}
                        disabled={isUpdatingRole}
                        variant="outline"
                        className="justify-start border-gray-700 hover:border-gray-600"
                      >
                        <UserX className="w-4 h-4 mr-2" />
                        Free User
                      </Button>
                      <Button
                        onClick={() => updateUserRole(selectedUser.id, 'premium')}
                        disabled={isUpdatingRole}
                        variant="outline"
                        className="justify-start border-gray-700 hover:border-yellow-600"
                      >
                        <Crown className="w-4 h-4 mr-2" />
                        Premium (1 month)
                      </Button>
                      <Button
                        onClick={() => updateUserRole(selectedUser.id, 'test')}
                        disabled={isUpdatingRole}
                        variant="outline"
                        className="justify-start border-gray-700 hover:border-blue-600"
                      >
                        <Settings className="w-4 h-4 mr-2" />
                        Test User (30 days)
                      </Button>
                      <Button
                        onClick={() => updateUserRole(selectedUser.id, 'friends_family')}
                        disabled={isUpdatingRole}
                        variant="outline"
                        className="justify-start border-gray-700 hover:border-green-600"
                      >
                        <UserCheck className="w-4 h-4 mr-2" />
                        Friends & Family
                      </Button>
                      <Button
                        onClick={() => updateUserRole(selectedUser.id, 'admin')}
                        disabled={isUpdatingRole}
                        variant="outline"
                        className="justify-start border-gray-700 hover:border-purple-600"
                      >
                        <Shield className="w-4 h-4 mr-2" />
                        Admin
                      </Button>
                    </div>
                  </div>

                  {/* User Details */}
                  <div className="space-y-3 pt-4 border-t border-gray-700">
                    <h4 className="font-medium text-white">User Details</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">User ID</span>
                        <span className="text-white">{selectedUser.id}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Email</span>
                        <span className="text-white">{selectedUser.email}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Created</span>
                        <span className="text-white">{formatDistanceToNow(new Date(selectedUser.createdAt))} ago</span>
                      </div>
                      {selectedUser.lastLoginAt && (
                        <div className="flex justify-between">
                          <span className="text-gray-400">Last Login</span>
                          <span className="text-white">{formatDistanceToNow(new Date(selectedUser.lastLoginAt))} ago</span>
                        </div>
                      )}
                      {selectedUser.premiumExpiresAt && (
                        <div className="flex justify-between">
                          <span className="text-gray-400">Premium Expires</span>
                          <span className="text-white">
                            {new Date(selectedUser.premiumExpiresAt).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-gray-400">
                  <Settings className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium">No User Selected</p>
                  <p className="text-sm">Select a user from the list to manage their role and permissions</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recent Actions */}
        {lastAction && (
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-400">
                <UserCheck className="w-5 h-5" />
                Recent Action
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300">{lastAction}</p>
            </CardContent>
          </Card>
        )}

        {/* Usage Instructions */}
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-[#C6D600]">Usage Instructions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-gray-300">
            <div className="space-y-2">
              <h3 className="font-semibold text-white">How to Manage Users:</h3>
              <ol className="list-decimal list-inside space-y-1 text-sm">
                <li>Search for users by email or display name</li>
                <li>Click on a user from the list to select them</li>
                <li>Choose a new role from the role management panel</li>
                <li>Changes take effect immediately</li>
              </ol>
            </div>
            
            <div className="space-y-2">
              <h3 className="font-semibold text-white">Role Definitions:</h3>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li><strong>Free:</strong> Basic features, limited thoughtmarks</li>
                <li><strong>Premium:</strong> Full features, 1 month access</li>
                <li><strong>Test User:</strong> Premium features for 30 days (for testing)</li>
                <li><strong>Friends & Family:</strong> Permanent premium access</li>
                <li><strong>Admin:</strong> Full system access and user management</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
}