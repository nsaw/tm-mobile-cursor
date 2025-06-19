import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle, Clock, Users, Shield, Settings, Bell, Mail, Trash2, RefreshCw, Plus } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { PageLayout } from "@/components/page-layout";

interface ReceivedEmail {
  id: string;
  from: string;
  to: string;
  subject: string;
  body: string;
  timestamp: string;
  raw: string;
}

export default function AdminPremium() {
  const [userEmail, setUserEmail] = useState("");
  const [durationDays, setDurationDays] = useState("30");
  const [isLoading, setIsLoading] = useState(false);
  const [lastAction, setLastAction] = useState<string | null>(null);
  const [generatedLink, setGeneratedLink] = useState<string | null>(null);
  const [selectedEmail, setSelectedEmail] = useState<ReceivedEmail | null>(null);
  const [simulateFrom, setSimulateFrom] = useState("");
  const [simulateSubject, setSimulateSubject] = useState("");
  const [simulateBody, setSimulateBody] = useState("");
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { user, loading: authLoading } = useAuth();
  const queryClient = useQueryClient();

  // Email inbox queries
  const { data: emails = [], isLoading: emailsLoading, refetch: refetchEmails } = useQuery({
    queryKey: ['/api/emails'],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/emails");
      return await response.json();
    },
  });

  const clearEmailsMutation = useMutation({
    mutationFn: () => apiRequest("DELETE", "/api/emails"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/emails'] });
      setSelectedEmail(null);
      toast({
        title: "Emails cleared",
        description: "All emails have been removed from the inbox",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to clear emails",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const simulateEmailMutation = useMutation({
    mutationFn: (data: any) => apiRequest("POST", "/api/emails/simulate", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/emails'] });
      setSimulateFrom("");
      setSimulateSubject("");
      setSimulateBody("");
      toast({
        title: "Test email added",
        description: "Email has been added to the inbox",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to add test email",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSimulateEmail = () => {
    if (!simulateFrom.trim() || !simulateSubject.trim()) {
      toast({
        title: "Missing information",
        description: "Please fill in sender and subject fields",
        variant: "destructive"
      });
      return;
    }

    simulateEmailMutation.mutate({
      from: simulateFrom,
      to: "hello@thoughtmarks.app",
      subject: simulateSubject,
      body: simulateBody
    });
  };

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
        description: error.message || "Failed to grant premium access",
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
          description: `Premium access revoked for ${userEmail}`,
        });
        setLastAction(`Revoked premium access for ${userEmail}`);
        setUserEmail("");
      } else {
        throw new Error(result.message || "Failed to revoke access");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to revoke premium access",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateLink = async () => {
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
      const response = await apiRequest("POST", "/api/admin/generate-premium-link", {
        userEmail: userEmail.trim(),
        durationDays: parseInt(durationDays),
        linkExpiryHours: 72
      });

      const result = await response.json();
      
      if (response.ok) {
        setGeneratedLink(result.link);
        toast({
          title: "Success",
          description: "Premium invitation link generated",
        });
        setLastAction(`Generated premium link for ${userEmail}`);
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

  return (
    <PageLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <Shield className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold text-primary">Admin Dashboard</h1>
          </div>
          <p className="text-muted-foreground">System administration and user management</p>
          
          <div className="flex justify-center gap-4 mt-4">
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
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-600">
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
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration">Duration (Days)</Label>
                <Select value={durationDays} onValueChange={setDurationDays}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
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
                className="w-full"
              >
                {isLoading ? "Granting..." : "Grant Premium Access"}
              </Button>
            </CardContent>
          </Card>

          {/* Revoke Access Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-600">
                <AlertCircle className="w-5 h-5" />
                Revoke Test Access
              </CardTitle>
              <CardDescription>
                Remove premium access from test users
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
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

        {/* Generate Link Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-500" />
              Generate Premium Link
            </CardTitle>
            <CardDescription>
              Create shareable premium invitation links
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={handleGenerateLink}
              disabled={isLoading}
              variant="outline"
              className="w-full"
            >
              {isLoading ? "Generating..." : "Generate Premium Link"}
            </Button>
            
            {generatedLink && (
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-sm font-medium mb-2">Generated Link:</p>
                <p className="text-xs font-mono break-all">{generatedLink}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Status Card */}
        {lastAction && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Recent Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Badge variant="outline">{lastAction}</Badge>
            </CardContent>
          </Card>
        )}

        {/* API Reference Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              API Reference
            </CardTitle>
            <CardDescription>
              Available admin endpoints
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="space-y-1 text-sm font-mono bg-muted p-3 rounded">
                <div>POST /api/admin/grant-test-access</div>
                <div>POST /api/admin/revoke-test-access</div>
                <div>POST /api/admin/generate-premium-link</div>
                <div>POST /api/admin/apple-notifications</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Email Inbox for Domain Verification */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="w-5 h-5" />
              Email Inbox for Domain Verification
            </CardTitle>
            <CardDescription>
              Monitor received emails for Mailchimp domain verification
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Simulate Email for Testing */}
            <div className="border rounded-lg p-4 space-y-3">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Plus className="w-4 h-4" />
                Add Test Email
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Input
                  placeholder="sender@mailchimp.com"
                  value={simulateFrom}
                  onChange={(e) => setSimulateFrom(e.target.value)}
                />
                <Input
                  placeholder="Domain Verification Required"
                  value={simulateSubject}
                  onChange={(e) => setSimulateSubject(e.target.value)}
                />
              </div>
              <Input
                placeholder="Email body content..."
                value={simulateBody}
                onChange={(e) => setSimulateBody(e.target.value)}
              />
              <Button 
                onClick={handleSimulateEmail} 
                disabled={simulateEmailMutation.isPending}
                size="sm"
              >
                {simulateEmailMutation.isPending ? "Adding..." : "Add Test Email"}
              </Button>
            </div>

            {/* Email List */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium">
                  Received Emails ({emails.length})
                </div>
                <div className="flex gap-2">
                  <Button onClick={() => refetchEmails()} size="sm" variant="outline">
                    <RefreshCw className="w-3 h-3" />
                  </Button>
                  <Button 
                    onClick={() => clearEmailsMutation.mutate()} 
                    size="sm" 
                    variant="destructive"
                    disabled={clearEmailsMutation.isPending || emails.length === 0}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>

              {emailsLoading ? (
                <div className="text-center py-4 text-muted-foreground text-sm">
                  Loading emails...
                </div>
              ) : emails.length === 0 ? (
                <div className="text-center py-4 text-muted-foreground text-sm">
                  No emails received yet
                </div>
              ) : (
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {emails.map((email: ReceivedEmail) => (
                    <div
                      key={email.id}
                      className={`p-3 border rounded cursor-pointer transition-colors text-sm ${
                        selectedEmail?.id === email.id
                          ? "bg-primary/10 border-primary"
                          : "hover:bg-muted/50"
                      }`}
                      onClick={() => setSelectedEmail(email)}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="font-medium truncate">{email.from}</div>
                        <Badge variant="outline" className="text-xs">
                          {new Date(email.timestamp).toLocaleDateString()}
                        </Badge>
                      </div>
                      <div className="font-medium mb-1 truncate">{email.subject}</div>
                      <div className="text-xs text-muted-foreground truncate">
                        To: {email.to}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Selected Email Details */}
              {selectedEmail && (
                <div className="border rounded-lg p-4 mt-4">
                  <div className="text-sm font-medium mb-2">Email Details</div>
                  <div className="space-y-2 text-xs">
                    <div><strong>From:</strong> {selectedEmail.from}</div>
                    <div><strong>To:</strong> {selectedEmail.to}</div>
                    <div><strong>Subject:</strong> {selectedEmail.subject}</div>
                    <div><strong>Date:</strong> {new Date(selectedEmail.timestamp).toLocaleString()}</div>
                    <div><strong>Body:</strong></div>
                    <div className="bg-muted p-2 rounded text-xs font-mono max-h-32 overflow-y-auto">
                      {selectedEmail.body}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="text-xs text-muted-foreground">
              Webhook endpoint: {window.location.origin}/api/webhook/email
            </div>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
}