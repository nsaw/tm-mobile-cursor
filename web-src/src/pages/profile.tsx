import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { PersistentLayout } from "@/components/persistent-layout";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { 
  User, 
  Mail, 
  Shield, 
  Download, 
  Trash2, 
  Save,
  Settings,
  FileText,
  Eye,
  EyeOff,
  ArrowLeft,
  Key as KeyIcon
} from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PinSetup } from "@/components/pin-setup";
import { pinAuth } from "@/lib/pin-auth";

export default function Profile() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const handleBackNavigation = () => {
    setLocation("/settings");
  };

  // Add swipe gesture support
  const handleTouchStart = (e: React.TouchEvent) => {
    const touchStartX = e.touches[0].clientX;
    
    const handleTouchEnd = (endEvent: TouchEvent) => {
      const touchEndX = endEvent.changedTouches[0].clientX;
      const swipeDistance = touchEndX - touchStartX;
      
      if (swipeDistance > 100) { // Swipe right threshold
        handleBackNavigation();
      }
      
      document.removeEventListener('touchend', handleTouchEnd);
    };
    
    document.addEventListener('touchend', handleTouchEnd);
  };
  
  // Profile form state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPasswords, setShowPasswords] = useState(false);
  
  // Privacy settings
  const [dataProcessing, setDataProcessing] = useState(true);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);
  
  // Dialog states
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showPinSetup, setShowPinSetup] = useState(false);
  const [showRemovePinDialog, setShowRemovePinDialog] = useState(false);
  
  // Initialize form with user data
  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || "");
      setLastName(user.lastName || "");
      setEmail(user.email || "");
    }
  }, [user]);

  const handleProfileUpdate = async () => {
    if (!user) return;
    
    try {
      const response = await apiRequest('PUT', `/api/users/${user.id}`, {
        firstName,
        lastName,
        email,
        displayName: `${firstName} ${lastName}`.trim()
      });

      if (response.ok) {
        const updatedUser = await response.json();
        
        // Update localStorage with new user data
        localStorage.setItem('thoughtmarks-user', JSON.stringify(updatedUser));
        
        toast({
          title: "Profile updated",
          description: "Your profile information has been saved successfully.",
        });
        
        // Refresh the page to show updated user data
        setTimeout(() => {
          window.location.reload();
        }, 500);
      } else {
        throw new Error("Failed to update profile");
      }
    } catch (error: any) {
      toast({
        title: "Error updating profile",
        description: "There was a problem updating your profile. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please ensure both password fields match.",
        variant: "destructive",
      });
      return;
    }

    if (newPassword.length < 8) {
      toast({
        title: "Password too short",
        description: "Password must be at least 8 characters long.",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      if (response.ok) {
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        toast({
          title: "Password changed",
          description: "Your password has been updated successfully.",
        });
      } else {
        const error = await response.json();
        throw new Error(error.message || "Failed to change password");
      }
    } catch (error: any) {
      toast({
        title: "Error changing password",
        description: error.message || "There was a problem changing your password.",
        variant: "destructive",
      });
    }
  };

  const handleDataExport = async () => {
    try {
      const response = await fetch('/api/users/export', {
        method: 'GET',
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'thoughtmarks-data-export.json';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
        toast({
          title: "Data exported",
          description: "Your data has been downloaded successfully.",
        });
      } else {
        throw new Error("Failed to export data");
      }
    } catch (error) {
      toast({
        title: "Export failed",
        description: "There was a problem exporting your data. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleAccountDeletion = async () => {
    if (!user) return;
    
    try {
      const response = await fetch(`/api/users/${user.id}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        toast({
          title: "Account deleted",
          description: "Your account has been successfully deleted.",
        });
        window.location.href = "/auth";
      } else {
        throw new Error("Failed to delete account");
      }
    } catch (error) {
      toast({
        title: "Error deleting account",
        description: "There was a problem deleting your account. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <PersistentLayout>
      <div 
        className="max-w-2xl mx-auto px-4 py-8 momentum-scroll enhanced-scroll profile-content"
        onTouchStart={handleTouchStart}
      >
        {/* Back Navigation */}
        <div className="mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBackNavigation}
            className="flex items-center gap-2 text-gray-400 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4" />
            Settings
          </Button>
        </div>
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl text-white mb-2 uppercase" style={{ fontFamily: 'Oswald, sans-serif', fontWeight: '600', letterSpacing: '-0.02em' }}>
            PROFILE & DATA
          </h1>
          <p className="text-gray-400">Manage your account, profile picture, and data</p>
        </div>

        {/* Profile Information */}
        <Card className="mb-8 card-hover">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Profile Information
            </CardTitle>
            <CardDescription>
              Update your personal information and account details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Enter your first name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Enter your last name"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
              />
            </div>
            
            <Button onClick={handleProfileUpdate} className="w-full touch-feedback">
              <Save className="w-4 h-4 mr-2" />
              Save Profile Changes
            </Button>
          </CardContent>
        </Card>

        {/* Password Security */}
        <Card className="mb-8 card-hover">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Password & Security
            </CardTitle>
            <CardDescription>
              Change your password and manage security settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <div className="relative">
                <Input
                  id="currentPassword"
                  type={showPasswords ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter your current password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPasswords(!showPasswords)}
                >
                  {showPasswords ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type={showPasswords ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter a new password"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                type={showPasswords ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your new password"
              />
            </div>
            
            <Button 
              onClick={handlePasswordChange} 
              className="w-full touch-feedback"
              disabled={!currentPassword || !newPassword || !confirmPassword}
            >
              <Shield className="w-4 h-4 mr-2" />
              Change Password
            </Button>
            
            {/* Security & Authentication Section */}
            <div className="pt-4 border-t border-gray-700">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-white mb-2">Security & Authentication</h4>
                  <p className="text-sm text-muted-foreground">Additional security options for your account</p>
                </div>
                
                <Card className="bg-card border-border">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <KeyIcon className="w-5 h-5 text-green-500" />
                        <div>
                          <h3 className="font-medium">Quick PIN Login</h3>
                          <p className="text-sm text-muted-foreground">
                            {pinAuth.isPinSetup() ? "Use 4-digit PIN for quick login" : "Set up a 4-digit PIN for faster login"}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant={pinAuth.isPinSetup() ? "outline" : "default"}
                        size="sm"
                        onClick={() => setShowPinSetup(true)}
                        className={pinAuth.isPinSetup() ? "text-orange-500 border-orange-500" : "bg-green-600 hover:bg-green-700"}
                      >
                        {pinAuth.isPinSetup() ? "Change PIN" : "Setup PIN"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                
                {pinAuth.isPinSetup() && (
                  <Card className="bg-card border-border">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Shield className="w-5 h-5 text-red-500" />
                          <div>
                            <h3 className="font-medium">Remove PIN Login</h3>
                            <p className="text-sm text-muted-foreground">Disable PIN and return to email login only</p>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setShowRemovePinDialog(true)}
                          className="text-red-500 border-red-500 hover:bg-red-500/10"
                        >
                          Remove PIN
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Privacy Settings */}
        <Card className="mb-8 card-hover">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Privacy Settings
            </CardTitle>
            <CardDescription>
              Control how your data is processed and used
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Data Processing</h4>
                <p className="text-sm text-muted-foreground">Allow processing of your thoughtmarks for AI features</p>
              </div>
              <Switch
                checked={dataProcessing}
                onCheckedChange={setDataProcessing}
              />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Analytics</h4>
                <p className="text-sm text-muted-foreground">Help improve the app with usage analytics</p>
              </div>
              <Switch
                checked={analytics}
                onCheckedChange={setAnalytics}
              />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Marketing Communications</h4>
                <p className="text-sm text-muted-foreground">Receive updates about new features and tips</p>
              </div>
              <Switch
                checked={marketing}
                onCheckedChange={setMarketing}
              />
            </div>
          </CardContent>
        </Card>

        {/* Data Management */}
        <Card className="mb-8 card-hover">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Data Management
            </CardTitle>
            <CardDescription>
              Export or delete your account data
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              variant="outline"
              onClick={() => setShowExportDialog(true)}
              className="w-full justify-start touch-feedback"
            >
              <Download className="w-4 h-4 mr-2" />
              Export My Data
            </Button>
            
            <Button
              variant="destructive"
              onClick={() => setShowDeleteDialog(true)}
              className="w-full justify-start"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Account
            </Button>
          </CardContent>
        </Card>

        {/* Export Data Dialog */}
        <Dialog open={showExportDialog} onOpenChange={setShowExportDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Export Your Data</DialogTitle>
              <DialogDescription>
                Download a complete copy of your Thoughtmarks data including all thoughtmarks, bins, and settings.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowExportDialog(false)}>
                Cancel
              </Button>
              <Button onClick={() => {
                handleDataExport();
                setShowExportDialog(false);
              }}>
                Export Data
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Account Dialog */}
        <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Account</DialogTitle>
              <DialogDescription>
                This action cannot be undone. This will permanently delete your account and remove all your data from our servers.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={() => {
                handleAccountDeletion();
                setShowDeleteDialog(false);
              }}>
                Delete Account
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* PIN Setup Dialog */}
        {showPinSetup && user && (
          <PinSetup
            email={user.email}
            userId={user.id.toString()}
            onComplete={() => {
              setShowPinSetup(false);
              toast({
                title: "PIN Setup Complete",
                description: "You can now sign in quickly with your 4-digit PIN",
              });
            }}
            onCancel={() => setShowPinSetup(false)}
          />
        )}

        {/* Remove PIN Dialog */}
        <Dialog open={showRemovePinDialog} onOpenChange={setShowRemovePinDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Remove PIN Login</DialogTitle>
              <DialogDescription>
                Are you sure you want to remove PIN login? You'll need to use your email and password to sign in.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowRemovePinDialog(false)}>
                Cancel
              </Button>
              <Button 
                variant="destructive" 
                onClick={() => {
                  pinAuth.removePin();
                  setShowRemovePinDialog(false);
                  toast({
                    title: "PIN Removed",
                    description: "PIN login has been disabled",
                  });
                }}
              >
                Remove PIN
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </PersistentLayout>
  );
}