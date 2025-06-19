import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, UserCheck, Shield, Crown, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface User {
  id: number;
  email: string;
  displayName: string | null;
  firstName: string | null;
  lastName: string | null;
  isAdmin: boolean;
  isPremium: boolean;
  isTestUser: boolean;
  createdAt: string;
  roleId?: number;
}

interface Role {
  id: number;
  name: string;
  description?: string;
}

export default function AdminUsers() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch users based on search term
  const { data: users = [], isLoading: usersLoading } = useQuery({
    queryKey: ["/api/admin/users", searchTerm],
    enabled: searchTerm.length > 0,
  });

  // Fetch available roles
  const { data: roles = [], isLoading: rolesLoading } = useQuery({
    queryKey: ["/api/admin/roles"],
  });

  // Role assignment mutation
  const assignRoleMutation = useMutation({
    mutationFn: ({ userId, roleId }: { userId: number; roleId: number }) =>
      apiRequest(`/api/admin/assign-role/${userId}`, "POST", { roleId }),
    onSuccess: () => {
      toast({
        title: "Role Updated",
        description: "User role has been successfully updated.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      setSelectedUser(null);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update user role.",
        variant: "destructive",
      });
    },
  });

  const getRoleBadgeVariant = (user: User) => {
    if (user.isAdmin) return "destructive";
    if (user.isTestUser) return "secondary";
    if (user.isPremium) return "default";
    return "outline";
  };

  const getRoleIcon = (user: User) => {
    if (user.isAdmin) return <Crown className="w-3 h-3" />;
    if (user.isTestUser) return <Users className="w-3 h-3" />;
    if (user.isPremium) return <Shield className="w-3 h-3" />;
    return <UserCheck className="w-3 h-3" />;
  };

  const getRoleText = (user: User) => {
    if (user.isAdmin) return "Admin";
    if (user.isTestUser) return "Demo";
    if (user.isPremium) return "Premium";
    return "Free";
  };

  const handleRoleAssignment = (roleId: string) => {
    if (!selectedUser) return;
    
    assignRoleMutation.mutate({
      userId: selectedUser.id,
      roleId: parseInt(roleId),
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">User Management</h1>
          <p className="text-muted-foreground">
            Search and manage user roles and permissions
          </p>
        </div>
      </div>

      {/* Search Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            User Lookup
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-4">
              <Input
                placeholder="Search by email or name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1"
              />
            </div>
            
            {searchTerm && (
              <div className="text-sm text-muted-foreground">
                {usersLoading ? "Searching..." : `Found ${users.length} users`}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Users List */}
      {searchTerm && users.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Search Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {users.map((user: User) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{user.email}</span>
                      <Badge variant={getRoleBadgeVariant(user)} className="flex items-center gap-1">
                        {getRoleIcon(user)}
                        {getRoleText(user)}
                      </Badge>
                    </div>
                    {(user.displayName || user.firstName) && (
                      <p className="text-sm text-muted-foreground">
                        {user.displayName || `${user.firstName || ""} ${user.lastName || ""}`.trim()}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      User ID: {user.id} • Created: {new Date(user.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedUser(user)}
                    disabled={assignRoleMutation.isPending}
                  >
                    Manage Role
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Role Assignment Modal */}
      {selectedUser && (
        <Card>
          <CardHeader>
            <CardTitle>Assign Role - {selectedUser.email}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-sm">
                  <strong>Current Role:</strong> {getRoleText(selectedUser)}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  User ID: {selectedUser.id}
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">New Role</label>
                <Select onValueChange={handleRoleAssignment}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((role: Role) => (
                      <SelectItem key={role.id} value={role.id.toString()}>
                        <div className="flex items-center gap-2">
                          <span className="capitalize">{role.name}</span>
                          {role.description && (
                            <span className="text-xs text-muted-foreground">
                              - {role.description}
                            </span>
                          )}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setSelectedUser(null)}
                  disabled={assignRoleMutation.isPending}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty States */}
      {searchTerm && !usersLoading && users.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <Search className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No users found</h3>
            <p className="text-muted-foreground">
              Try searching with a different email or name.
            </p>
          </CardContent>
        </Card>
      )}

      {!searchTerm && (
        <Card>
          <CardContent className="text-center py-8">
            <Users className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Search for Users</h3>
            <p className="text-muted-foreground">
              Enter an email address or name to find and manage users.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}