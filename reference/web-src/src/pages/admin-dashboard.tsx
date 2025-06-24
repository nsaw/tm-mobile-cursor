import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SettingsBackButton } from "@/components/ui/BackButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, Users, Mail, Settings, Database, Shield, Wrench, ArrowLeft, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface DashboardStats {
  totalUsers: number;
  premiumUsers: number;
  totalThoughtmarks: number;
  activeTrials: number;
}

export default function AdminDashboard() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [targetEmail, setTargetEmail] = useState("");
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    users: true,
    emails: false,
    system: false
  });

  const { data: stats } = useQuery<DashboardStats>({
    queryKey: ["/api/admin/stats"],
    staleTime: 30000
  });

  const toggleSection = (section: string) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Query for new user count (users signed up in last 24 hours)
  const { data: newUserCount } = useQuery<number>({
    queryKey: ["/api/admin/new-users-count"],
    staleTime: 60000, // Refresh every minute
    refetchInterval: 60000
  });

  return (
    <div className="container mx-auto p-6 space-y-6 glass-surface-admin">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <SettingsBackButton />
          <h1 className="text-3xl font-bold text-white drop-shadow-lg">Admin Dashboard</h1>
        </div>
        <div className="flex items-center gap-3">
          {/* New User Notification Badge */}
          {newUserCount && newUserCount > 0 && (
            <Badge className="bg-orange-500 text-white border-orange-400 animate-pulse">
              {newUserCount} New User{newUserCount > 1 ? 's' : ''}
            </Badge>
          )}
          <Badge variant="outline" className="text-neon-green border-neon-green bg-black/20 backdrop-blur-sm">
            Production Ready
          </Badge>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="stats-grid section-gap">
        <Card className="stat-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalUsers || 0}</div>
          </CardContent>
        </Card>
        
        <Card className="stat-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Premium Users</CardTitle>
            <Shield className="h-4 w-4 text-neon-green" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-neon-green">{stats?.premiumUsers || 0}</div>
          </CardContent>
        </Card>
        
        <Card className="stat-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Thoughtmarks</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalThoughtmarks || 0}</div>
          </CardContent>
        </Card>
        
        <Card className="stat-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Trials</CardTitle>
            <Mail className="h-4 w-4 text-orange-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-400">{stats?.activeTrials || 0}</div>
          </CardContent>
        </Card>
      </div>

      {/* User Management */}
      <Card className="section-gap card-standard">
        <Collapsible open={openSections.users} onOpenChange={() => toggleSection('users')}>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5 text-neon-green" />
                  <div>
                    <CardTitle>User Management</CardTitle>
                    <CardDescription>Manage users, trials, and premium access</CardDescription>
                  </div>
                </div>
                <ChevronDown className={`h-4 w-4 transition-transform ${openSections.users ? 'rotate-180' : ''}`} />
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button asChild className="justify-start h-auto p-4">
                <Link href="/admin/users">
                  <div className="text-left">
                    <div className="font-semibold">User Database Lookup</div>
                    <div className="text-sm text-muted-foreground">Search users by email/name and manage roles</div>
                  </div>
                </Link>
              </Button>
              
              <Button asChild variant="outline" className="justify-start h-auto p-4">
                <Link href="/admin-premium">
                  <div className="text-left">
                    <div className="font-semibold">Premium Trial Management</div>
                    <div className="text-sm text-muted-foreground">Activate trials and manage premium users</div>
                  </div>
                </Link>
              </Button>
              
              <Button asChild variant="outline" className="justify-start h-auto p-4">
                <Link href="/form-automation">
                  <div className="text-left">
                    <div className="font-semibold">Form Automation</div>
                    <div className="text-sm text-muted-foreground">Google Apps Script integration</div>
                  </div>
                </Link>
              </Button>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      {/* Email Management */}
      <Card className="section-gap card-standard">
        <Collapsible open={openSections.emails} onOpenChange={() => toggleSection('emails')}>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-blue-400" />
                  <div>
                    <CardTitle>Email System</CardTitle>
                    <CardDescription>SendGrid delivery, Mailchimp audience, templates</CardDescription>
                  </div>
                </div>
                <ChevronDown className={`h-4 w-4 transition-transform ${openSections.emails ? 'rotate-180' : ''}`} />
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2">Template Files</h4>
                  <div className="space-y-2 text-sm">
                    <div>• trial-signup-welcome.html</div>
                    <div>• day-7-followup.html</div>
                    <div>• day-14-review-request.html</div>
                    <div>• monthly-followup.html</div>
                  </div>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2">System Status</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      SendGrid Integration
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      Mailchimp Audience (f5d7a0f38a)
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      Google Apps Script Ready
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Email Testing Section */}
              <div className="border-t pt-4">
                <h4 className="font-semibold mb-3">Email Testing</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Button
                    variant="outline"
                    className="justify-start h-auto p-3"
                    onClick={async () => {
                      try {
                        const response = await apiRequest('POST', '/api/emails/test-welcome', {});
                        const result = await response.json();
                        toast({
                          title: "Email Test",
                          description: result.message
                        });
                      } catch (error) {
                        toast({
                          title: "Error",
                          description: "Failed to send test email",
                          variant: "destructive"
                        });
                      }
                    }}
                  >
                    <Mail className="w-4 h-4 mr-2 text-primary" />
                    <div className="text-left">
                      <div className="font-medium">Test Welcome Email</div>
                      <div className="text-xs text-muted-foreground">Send styled welcome email</div>
                    </div>
                  </Button>
                  
                  <Button
                    variant="outline"
                    className="justify-start h-auto p-3"
                    onClick={() => window.open('/api/emails/preview-welcome', '_blank')}
                  >
                    <Mail className="w-4 h-4 mr-2 text-primary" />
                    <div className="text-left">
                      <div className="font-medium">Preview Templates</div>
                      <div className="text-xs text-muted-foreground">View email templates</div>
                    </div>
                  </Button>
                </div>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      {/* System Tools */}
      <Card className="section-gap card-standard">
        <Collapsible open={openSections.system} onOpenChange={() => toggleSection('system')}>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Settings className="h-5 w-5 text-gray-400" />
                  <div>
                    <CardTitle>System & Development</CardTitle>
                    <CardDescription>Database, security, configuration files</CardDescription>
                  </div>
                </div>
                <ChevronDown className={`h-4 w-4 transition-transform ${openSections.system ? 'rotate-180' : ''}`} />
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Database className="h-4 w-4" />
                    Database
                  </h4>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <div>PostgreSQL Active</div>
                    <div>Drizzle ORM</div>
                    <div>Auto-migrations</div>
                  </div>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Security
                  </h4>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <div>Firebase Auth</div>
                    <div>Rate Limiting</div>
                    <div>CORS Protected</div>
                  </div>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Wrench className="h-4 w-4" />
                    Configuration
                  </h4>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <div>Environment Ready</div>
                    <div>API Keys Set</div>
                    <div>Production Config</div>
                  </div>
                </div>
              </div>
              
              {/* Template Data Copy Section */}
              <div className="border-t pt-4">
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Copy className="h-4 w-4" />
                  Copy Template Data
                </h4>
                <div className="space-y-3">
                  <div className="text-sm text-muted-foreground">
                    Copy the template thoughtmarks and bins to any user account. This will clear existing data.
                  </div>
                  <div className="flex gap-3">
                    <div className="flex-1">
                      <Label htmlFor="targetEmail" className="text-sm">Target User Email</Label>
                      <Input
                        id="targetEmail"
                        type="email"
                        placeholder="user@example.com or superuser@thoughtmarks.app"
                        value={targetEmail}
                        onChange={(e) => setTargetEmail(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div className="flex items-end">
                      <Button
                        onClick={async () => {
                          if (!targetEmail.trim()) {
                            toast({
                              title: "Error",
                              description: "Please enter a target email",
                              variant: "destructive"
                            });
                            return;
                          }
                          
                          try {
                            const response = await apiRequest('POST', '/api/admin/copy-template', {
                              targetEmail: targetEmail.trim()
                            });
                            const result = await response.json();
                            
                            if (result.success) {
                              toast({
                                title: "Success",
                                description: result.message
                              });
                              setTargetEmail("");
                            } else {
                              toast({
                                title: "Error",
                                description: result.message || "Failed to copy template data",
                                variant: "destructive"
                              });
                            }
                          } catch (error) {
                            toast({
                              title: "Error",
                              description: "Failed to copy template data",
                              variant: "destructive"
                            });
                          }
                        }}
                        disabled={!targetEmail.trim()}
                        className="whitespace-nowrap"
                      >
                        <Copy className="w-4 h-4 mr-2" />
                        Copy Template
                      </Button>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Common targets: test@thoughtmarks.app, superuser@thoughtmarks.app
                  </div>
                </div>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>
    </div>
  );
}