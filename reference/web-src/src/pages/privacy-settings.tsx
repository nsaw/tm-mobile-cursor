import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { PersistentLayout } from "@/components/persistent-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Shield, Download, Trash2, Eye, Mail, Globe, Database, AlertTriangle } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

interface ConsentPreferences {
  essential: boolean;
  analytics: boolean;
  marketing: boolean;
  emailUpdates: boolean;
}

export default function PrivacySettings() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [consents, setConsents] = useState<ConsentPreferences>({
    essential: true,
    analytics: false,
    marketing: false,
    emailUpdates: false
  });
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // Get current consent preferences
  const { data: currentConsents, isLoading } = useQuery<ConsentPreferences>({
    queryKey: ["/api/privacy/consent"],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/privacy/consent");
      return response.json();
    }
  });

  // Update consent preferences
  const updateConsentMutation = useMutation({
    mutationFn: async (newConsents: ConsentPreferences) => {
      const response = await apiRequest("POST", "/api/privacy/consent", newConsents);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Privacy preferences updated",
        description: "Your consent preferences have been saved.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/privacy/consent"] });
    },
    onError: () => {
      toast({
        title: "Error updating preferences",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  });





  useEffect(() => {
    if (currentConsents) {
      setConsents(currentConsents);
    }
  }, [currentConsents]);

  // Save consent preferences
  const saveConsentMutation = useMutation({
    mutationFn: async (newConsents: ConsentPreferences) => {
      const response = await apiRequest("POST", "/api/privacy/consent", newConsents);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Privacy preferences saved",
        description: "Your consent preferences have been updated successfully."
      });
      queryClient.invalidateQueries({ queryKey: ["/api/privacy/consent"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to save privacy preferences. Please try again.",
        variant: "destructive"
      });
    }
  });

  // Export user data
  const exportDataMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("GET", "/api/privacy/export");
      const data = await response.json();
      
      // Create and download file
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `thoughtmarks-data-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Data exported",
        description: "Your data has been downloaded to your device."
      });
    },
    onError: () => {
      toast({
        title: "Export failed",
        description: "Failed to export your data. Please try again.",
        variant: "destructive"
      });
    }
  });

  // Delete account
  const deleteAccountMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("DELETE", "/api/privacy/delete-account");
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Account deleted",
        description: "Your account and all data have been permanently deleted."
      });
      setTimeout(() => setLocation("/"), 2000);
    },
    onError: () => {
      toast({
        title: "Deletion failed",
        description: "Failed to delete account. Please contact support.",
        variant: "destructive"
      });
    }
  });

  const handleConsentChange = (type: keyof ConsentPreferences, checked: boolean) => {
    if (type === 'essential') return; // Essential cannot be changed
    
    const newConsents = { ...consents, [type]: checked };
    setConsents(newConsents);
    saveConsentMutation.mutate(newConsents);
  };

  const handleDeleteAccount = () => {
    setShowDeleteDialog(false);
    deleteAccountMutation.mutate();
  };

  if (isLoading) {
    return (
      <PersistentLayout>
        <div className="max-w-md mx-auto px-4 py-8">
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-800 rounded-lg animate-pulse" />
            ))}
          </div>
        </div>
      </PersistentLayout>
    );
  }

  return (
    <PersistentLayout>
      <div className="max-w-md mx-auto px-4 py-8 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <Shield className="w-12 h-12 text-[#C6D600] mx-auto" />
          <h1 className="text-2xl font-bold text-white">Privacy & Data Protection</h1>
          <p className="text-gray-400">
            Manage your privacy preferences and data in accordance with GDPR
          </p>
        </div>

        {/* Consent Preferences */}
        <Card className="bg-gray-900 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Database className="w-5 h-5" />
              Consent Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Essential */}
            <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Label className="text-white font-medium">Essential Cookies</Label>
                  <span className="text-xs bg-[#C6D600]/20 text-[#C6D600] px-2 py-1 rounded-full">Required</span>
                </div>
                <p className="text-sm text-gray-400">
                  Necessary for the website to function properly. Cannot be disabled.
                </p>
              </div>
              <Switch checked={true} disabled={true} />
            </div>

            {/* Analytics */}
            <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-blue-400" />
                  <Label className="text-white font-medium">Analytics</Label>
                </div>
                <p className="text-sm text-gray-400">
                  Help us understand how you use the app to improve functionality.
                </p>
              </div>
              <Switch 
                checked={consents.analytics}
                onCheckedChange={(checked) => handleConsentChange('analytics', checked)}
                disabled={saveConsentMutation.isPending}
              />
            </div>

            {/* Marketing */}
            <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-purple-400" />
                  <Label className="text-white font-medium">Marketing</Label>
                </div>
                <p className="text-sm text-gray-400">
                  Personalized content and advertisements to support our services.
                </p>
              </div>
              <Switch 
                checked={consents.marketing}
                onCheckedChange={(checked) => handleConsentChange('marketing', checked)}
                disabled={saveConsentMutation.isPending}
              />
            </div>

            {/* Email Updates */}
            <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-green-400" />
                  <Label className="text-white font-medium">Email Updates</Label>
                </div>
                <p className="text-sm text-gray-400">
                  Receive updates about new features and product news.
                </p>
              </div>
              <Switch 
                checked={consents.emailUpdates}
                onCheckedChange={(checked) => handleConsentChange('emailUpdates', checked)}
                disabled={saveConsentMutation.isPending}
              />
            </div>
          </CardContent>
        </Card>

        {/* Data Rights */}
        <Card className="bg-gray-900 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Your Data Rights</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-400 text-sm">
              Under GDPR, you have the following rights regarding your personal data:
            </p>
            
            <div className="space-y-3">
              <Button
                onClick={() => exportDataMutation.mutate()}
                disabled={exportDataMutation.isPending}
                variant="outline"
                className="w-full justify-start border-gray-600 text-gray-300 hover:bg-gray-800"
              >
                <Download className="w-4 h-4 mr-2" />
                {exportDataMutation.isPending ? "Exporting..." : "Export My Data"}
              </Button>
              
              <p className="text-xs text-gray-500 ml-6">
                Download a copy of all your data in JSON format
              </p>
            </div>

            <Separator className="bg-gray-700" />

            <div className="space-y-3">
              <Button
                onClick={() => setShowDeleteDialog(true)}
                variant="destructive"
                className="w-full justify-start"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete My Account
              </Button>
              
              <p className="text-xs text-gray-500 ml-6">
                Permanently delete your account and all associated data
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card className="bg-blue-950/30 border-blue-800/50">
          <CardContent className="pt-6">
            <h3 className="text-white font-medium mb-2">Questions about your privacy?</h3>
            <p className="text-sm text-gray-300 mb-3">
              Contact our Data Protection Officer or your local supervisory authority if you have concerns about how we handle your data.
            </p>
            <div className="text-xs text-gray-400 space-y-1">
              <p>Email: privacy@thoughtmarks.app</p>
              <p>More info: <a href="/privacy" className="text-[#C6D600] hover:underline">Privacy Policy</a></p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Delete Account Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="bg-gray-900 border-gray-700">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-400" />
              Delete Account
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-300">
              This action cannot be undone. This will permanently delete your account and all your thoughtmarks, bins, and personal data.
              
              <div className="mt-4 p-3 bg-red-950/30 border border-red-800/50 rounded-lg">
                <p className="text-sm font-medium text-red-300">What will be deleted:</p>
                <ul className="text-sm text-red-200 mt-2 space-y-1">
                  <li>• All your thoughtmarks and content</li>
                  <li>• All your bins and organization</li>
                  <li>• Your account and profile information</li>
                  <li>• All usage data and preferences</li>
                </ul>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteAccount}
              disabled={deleteAccountMutation.isPending}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {deleteAccountMutation.isPending ? "Deleting..." : "Delete Account"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </PersistentLayout>
  );
}