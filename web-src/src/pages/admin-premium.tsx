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
import { AlertCircle, CheckCircle, Clock, Users, Shield, Settings, Bell } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { PageLayout } from "@/components/page-layout";

export default function AdminPremium() {
  const [userEmail, setUserEmail] = useState("");
  const [durationDays, setDurationDays] = useState("30");
  const [isLoading, setIsLoading] = useState(false);
  const [lastAction, setLastAction] = useState<string | null>(null);
  const [generatedLink, setGeneratedLink] = useState<string | null>(null);
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

  const handleGrantAccess = async () => {
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
      const response = await apiRequest("POST", "/api/admin/grant-test-access", {
        userEmail: userEmail.trim(),
        durationDays: parseInt(durationDays)
      });

      const result = await response.json();
      
      if (response.ok) {
        toast({
          title: "Success",
          description: `Premium test access granted to ${userEmail} for ${durationDays} days`,
        });
        setLastAction(`Granted ${durationDays} days premium access to ${userEmail}`);
        setUserEmail("");
      } else {
        throw new Error(result.message || "Failed to grant access");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to grant test access",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRevokeAccess = async () => {
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
      const response = await apiRequest("POST", "/api/admin/revoke-test-access", {
        userEmail: userEmail.trim()
      });

      const result = await response.json();
      
      if (response.ok) {
        toast({
          title: "Success",
          description: `Premium test access revoked for ${userEmail}`,
        });
        setLastAction(`Revoked premium access for ${userEmail}`);
        setUserEmail("");
      } else {
        throw new Error(result.message || "Failed to revoke access");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to revoke test access",
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
        durationDays: parseInt(durationDays),
        linkExpiryHours: 72
      });

      const result = await response.json();
      
      if (response.ok) {
        setGeneratedLink(result.link);
        toast({
          title: "Success",
          description: "Premium invite link generated successfully",
        });
        setLastAction(`Generated premium invite link for ${userEmail}`);
      } else {
        throw new Error(result.message || "Failed to generate link");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to generate premium link",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: "Link copied to clipboard",
    });
  };

  const quickAccessOptions = [
    { email: "test@example.com", days: 7, label: "7-day test" },
    { email: "beta@example.com", days: 30, label: "30-day beta" },
    { email: "reviewer@example.com", days: 14, label: "14-day review" },
  ];

  return (
    <PageLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <Shield className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold text-primary">Admin Dashboard</h1>
          </div>
          <p className="text-muted-foreground">System administration and user management</p>
        </div>

        {/* User Management Navigation */}
        <Card className="bg-blue-900 border-blue-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-300">
              <Users className="w-5 h-5" />
              Comprehensive User Management
            </CardTitle>
            <CardDescription className="text-blue-200">
              Advanced user search, role management, and permissions control
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-sm text-blue-100">Search users by email or name</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-sm text-blue-100">Manage user roles and permissions</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-sm text-blue-100">Set friends & family access</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-sm text-blue-100">View user activity and status</span>
                </div>
              </div>
              <Button 
                onClick={() => setLocation("/admin/users")}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Users className="w-4 h-4 mr-2" />
                Open User Management Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Apple Notifications Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-blue-500" />
              Apple Authentication Status
            </CardTitle>
            <CardDescription>
              Apple Sign In notifications endpoint is live at /api/admin/apple-notifications
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-sm">Notification endpoint configured</span>
              </div>
              <div className="text-xs text-muted-foreground font-mono bg-muted p-2 rounded">
                https://thoughtmarks-nick479.replit.app/api/admin/apple-notifications
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Grant Access Card */}
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-400">
                <CheckCircle className="w-5 h-5" />
                Grant Test Access
              </CardTitle>
              <CardDescription>
                Provide premium features access for testing purposes
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">User Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="user@example.com"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  className="bg-gray-800 border-gray-700"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration">Duration (Days)</Label>
                <Select value={durationDays} onValueChange={setDurationDays}>
                  <SelectTrigger className="bg-gray-800 border-gray-700">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    <SelectItem value="7">7 days</SelectItem>
                    <SelectItem value="14">14 days</SelectItem>
                    <SelectItem value="30">30 days</SelectItem>
                    <SelectItem value="60">60 days</SelectItem>
                    <SelectItem value="90">90 days</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button 
                onClick={handleGrantAccess}
                disabled={isLoading}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                {isLoading ? "Granting..." : "Grant Premium Access"}
              </Button>
            </CardContent>
          </Card>

          {/* Revoke Access Card */}
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-400">
                <AlertCircle className="w-5 h-5" />
                Revoke Test Access
              </CardTitle>
              <CardDescription>
                Remove premium access from test users
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="revoke-email">User Email</Label>
                <Input
                  id="revoke-email"
                  type="email"
                  placeholder="user@example.com"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  className="bg-gray-800 border-gray-700"
                />
              </div>

              <Button 
                onClick={handleRevokeAccess}
                disabled={isLoading}
                variant="destructive"
                className="w-full"
              >
                {isLoading ? "Revoking..." : "Revoke Premium Access"}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Generate Shareable Link */}
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-400">
              <Clock className="w-5 h-5" />
              Generate Shareable Link
            </CardTitle>
            <CardDescription>
              Create a link that automatically grants premium access when clicked
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={handleGenerateLink}
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              {isLoading ? "Generating..." : "Generate Premium Link"}
            </Button>

            {generatedLink && (
              <div className="space-y-3 p-4 bg-green-900/20 border border-green-500/30 rounded-lg">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <Label className="text-green-400 font-medium">Premium Link Generated</Label>
                </div>
                <div className="space-y-2">
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
                      Copy Link
                    </Button>
                  </div>
                  <Button
                    onClick={() => copyToClipboard(generatedLink)}
                    variant="default"
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    📋 One-Click Copy & Share
                  </Button>
                </div>
                <div className="text-xs text-green-300 space-y-1">
                  <p>✓ Link expires in 72 hours</p>
                  <p>✓ User must be logged in when clicking</p>
                  <p>✓ Grants {durationDays} days of premium access</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[#C6D600]">
              <Clock className="w-5 h-5" />
              Quick Test Access
            </CardTitle>
            <CardDescription>
              Pre-configured test access options
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-3">
              {quickAccessOptions.map((option, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="h-auto p-4 text-left border-gray-700 hover:border-[#C6D600]"
                  onClick={() => {
                    setUserEmail(option.email);
                    setDurationDays(option.days.toString());
                  }}
                >
                  <div className="space-y-1">
                    <div className="font-medium">{option.label}</div>
                    <div className="text-sm text-gray-400">{option.email}</div>
                    <Badge variant="secondary" className="text-xs">
                      {option.days} days
                    </Badge>
                  </div>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Last Action */}
        {lastAction && (
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-400">
                <Users className="w-5 h-5" />
                Recent Action
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300">{lastAction}</p>
            </CardContent>
          </Card>
        )}

        {/* Instructions */}
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-[#C6D600]">Testing Instructions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-gray-300">
            <div className="space-y-2">
              <h3 className="font-semibold text-white">How to Grant Test Access:</h3>
              <ol className="list-decimal list-inside space-y-1 text-sm">
                <li>Enter the user's email address</li>
                <li>Select the duration for test access</li>
                <li>Click "Grant Premium Access"</li>
                <li>User will immediately have premium features</li>
              </ol>
            </div>
            
            <div className="space-y-2">
              <h3 className="font-semibold text-white">Premium Features Include:</h3>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>AI-powered thoughtmark analysis and insights</li>
                <li>Advanced semantic search capabilities</li>
                <li>Unlimited voice recording and transcription</li>
                <li>Export and collaboration features</li>
                <li>Priority customer support</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold text-white">API Endpoints:</h3>
              <div className="space-y-1 text-sm font-mono bg-gray-800 p-3 rounded">
                <div>POST /api/admin/grant-test-access</div>
                <div>POST /api/admin/revoke-test-access</div>
                <div>GET /api/premium/status</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
}