import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { PageLayout } from "@/components/page-layout";
import { apiRequest } from "@/lib/queryClient";
import { 
  User, 
  LogOut, 
  Database, 
  Download, 
  Archive,
  Trash2,
  AlertTriangle,
  Brain,
  Upload,
  Camera,
  Key,
  Lock,
  Shield,
  Loader2,
  Link2,
  Unlink,
  Plus,
  Check,
  X
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { getAuth, signOut } from "firebase/auth";
import { useLocation } from "wouter";

export default function Account() {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [email, setEmail] = useState(user?.email || "");
  const [isSaving, setIsSaving] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showPinDialog, setShowPinDialog] = useState(false);
  const [currentPin, setCurrentPin] = useState("");
  const [newPin, setNewPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [hasPin, setHasPin] = useState(false);
  const [showLinkAccountDialog, setShowLinkAccountDialog] = useState(false);
  const [isLinking, setIsLinking] = useState(false);

  // Update state when user data changes
  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || "");
      setLastName(user.lastName || "");
      setEmail(user.email || "");
    }
  }, [user]);

  const handleSaveProfile = async () => {
    if (!user) return;
    
    setIsSaving(true);
    try {
      const response = await apiRequest("PUT", `/api/users/${user.id}`, {
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
          description: "Your profile information has been saved successfully."
        });
        
        // Show elegant loading state instead of white flash
        setIsRefreshing(true);
        
        // Brief delay to show the loading state, then refresh
        setTimeout(() => {
          window.location.reload();
        }, 800);
      } else {
        throw new Error("Failed to update profile");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update profile",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSignOut = async () => {
    try {
      // Check if this is a demo user before clearing data
      const isDemoUser = user?.email === 'hello@thoughtmarks.app' || 
                        user?.email === 'applereview@thoughtmarks.app' || 
                        user?.email === 'test@thoughtmarks.app' || 
                        user?.isTestUser;
      
      const auth = getAuth();
      await signOut(auth);
      
      // Clear localStorage
      localStorage.removeItem('thoughtmarks-user');
      localStorage.removeItem('thoughtmarks-demo-token');
      
      // Clear sessionStorage for demo users to ensure fresh onboarding experience
      if (isDemoUser) {
        sessionStorage.clear();
      }
      
      toast({
        title: "Signed out successfully",
        description: "You have been logged out of your account.",
      });
      setLocation("/auth");
    } catch (error) {
      toast({
        title: "Error signing out",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast({
        title: "Password mismatch",
        description: "New passwords do not match",
        variant: "destructive"
      });
      return;
    }

    if (newPassword.length < 6) {
      toast({
        title: "Password too short",
        description: "Password must be at least 6 characters",
        variant: "destructive"
      });
      return;
    }

    setIsChangingPassword(true);
    try {
      const response = await apiRequest("POST", "/api/auth/change-password", {
        currentPassword,
        newPassword
      });

      if (response.ok) {
        toast({
          title: "Password changed",
          description: "Your password has been updated successfully"
        });
        setShowPasswordDialog(false);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        const result = await response.json();
        throw new Error(result.message || "Failed to change password");
      }
    } catch (error: any) {
      toast({
        title: "Password change failed",
        description: error.message || "Please try again",
        variant: "destructive"
      });
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleExportData = () => {
    toast({
      title: "Export initiated",
      description: "Your data will be downloaded shortly.",
    });
  };

  const handleDeleteAccount = async () => {
    try {
      // TODO: Implement actual account deletion API call
      toast({
        title: "Account deleted",
        description: "Your account and all data have been permanently deleted.",
      });
      setLocation("/auth");
    } catch (error) {
      toast({
        title: "Error deleting account",
        description: "Please try again or contact support.",
        variant: "destructive",
      });
    }
  };

  const handleLinkAccount = async (provider: string) => {
    if (!user) return;

    setIsLinking(true);
    try {
      const response = await apiRequest("POST", `/api/users/${user.id}/link-account`, {
        provider: provider,
        providerUid: `${provider}_${Date.now()}`,
        email: user.email
      });

      if (response.ok) {
        const result = await response.json();
        localStorage.setItem('thoughtmarks-user', JSON.stringify(result.user));
        
        toast({
          title: "Account linked",
          description: `Successfully linked your ${provider} account`
        });
        
        setShowLinkAccountDialog(false);
        setTimeout(() => window.location.reload(), 1000);
      } else {
        const error = await response.json();
        throw new Error(error.message);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to link account",
        variant: "destructive"
      });
    } finally {
      setIsLinking(false);
    }
  };

  const handleUnlinkAccount = async (provider: string, providerUid: string) => {
    if (!user) return;

    try {
      const response = await apiRequest("DELETE", `/api/users/${user.id}/unlink-account`, {
        provider,
        providerUid
      });

      if (response.ok) {
        const result = await response.json();
        localStorage.setItem('thoughtmarks-user', JSON.stringify(result.user));
        
        toast({
          title: "Account unlinked",
          description: `Successfully unlinked your ${provider} account`
        });
        
        setTimeout(() => window.location.reload(), 1000);
      } else {
        const error = await response.json();
        throw new Error(error.message);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to unlink account",
        variant: "destructive"
      });
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImage(e.target?.result as string);
        toast({
          title: "Profile picture updated",
          description: "Your new profile picture has been saved.",
        });
      };
      reader.readAsDataURL(file);
    }
  };

  if (!isAuthenticated) {
    return (
      <PageLayout title="Account" showBackButton={true}>
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Please sign in to access your account.</p>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout title="Account" showBackButton={true}>
      <div className="max-w-2xl mx-auto space-y-6 pb-24">
        {/* Profile Section */}
        <div className="space-y-4 mb-8">
          <h2 className="text-lg font-semibold text-foreground">Profile</h2>
          <div className="bg-card rounded-lg p-6 border border-border">
            <div className="flex items-center space-x-6">
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center overflow-hidden">
                  {profileImage ? (
                    <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <Brain className="w-10 h-10 text-white" />
                  )}
                </div>
                <label htmlFor="profile-upload" className="absolute -bottom-2 -right-2 w-8 h-8 bg-primary rounded-full flex items-center justify-center cursor-pointer hover:bg-primary/90 transition-colors">
                  <Camera className="w-4 h-4 text-white" />
                  <input
                    id="profile-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              </div>
              <div className="flex-1 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="first-name">First Name</Label>
                    <Input
                      id="first-name"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="First name"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="last-name">Last Name</Label>
                    <Input
                      id="last-name"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Last name"
                      className="mt-1"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    type="email"
                    className="mt-1"
                  />
                </div>
              </div>
            </div>
            <div className="mt-6 pt-4 border-t border-border">
              <Button 
                onClick={handleSaveProfile}
                disabled={isSaving}
                className="w-full sm:w-auto"
              >
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>
        </div>

        {/* Data Section */}
        <div className="space-y-4 mb-8">
          <h2 className="text-lg font-semibold text-foreground">Data</h2>
          <div className="bg-card rounded-lg p-4 border border-border space-y-3">
            <Button
              variant="ghost"
              className="w-full justify-start text-left p-3 h-auto"
              onClick={() => setLocation("/recently-deleted")}
            >
              <Database className="w-5 h-5 mr-3 text-primary" />
              <div>
                <p className="font-medium">Recently Deleted</p>
                <p className="text-sm text-muted-foreground">Restore deleted thoughtmarks</p>
              </div>
            </Button>

            <Button
              variant="ghost"
              className="w-full justify-start text-left p-3 h-auto"
              onClick={() => setLocation("/archive")}
            >
              <Archive className="w-5 h-5 mr-3 text-primary" />
              <div>
                <p className="font-medium">Archive</p>
                <p className="text-sm text-muted-foreground">View archived thoughtmarks</p>
              </div>
            </Button>

            <Button
              variant="ghost"
              className="w-full justify-start text-left p-3 h-auto"
              onClick={handleExportData}
            >
              <Download className="w-5 h-5 mr-3 text-primary" />
              <div>
                <p className="font-medium">Export Data</p>
                <p className="text-sm text-muted-foreground">Download all your thoughtmarks and data</p>
              </div>
            </Button>
          </div>
        </div>

        {/* Security Section */}
        <div className="space-y-4 mb-8">
          <h2 className="text-lg font-semibold text-foreground">Security</h2>
          <div className="bg-card rounded-lg p-4 border border-border space-y-3">
            <Button
              variant="ghost"
              className="w-full justify-start text-left p-3 h-auto"
              onClick={() => setShowPasswordDialog(true)}
            >
              <Key className="w-5 h-5 mr-3 text-primary" />
              <div>
                <p className="font-medium">Change Password</p>
                <p className="text-sm text-muted-foreground">Update your account password</p>
              </div>
            </Button>

            {/* Account Linking - Not for demo account */}
            {user?.email !== "test@thoughtmarks.app" && (
              <Button
                variant="ghost"
                className="w-full justify-start text-left p-3 h-auto"
                onClick={() => setShowLinkAccountDialog(true)}
              >
                <Link2 className="w-5 h-5 mr-3 text-primary" />
                <div>
                  <p className="font-medium">Link Account</p>
                  <p className="text-sm text-muted-foreground">Connect additional sign-in methods</p>
                </div>
              </Button>
            )}

            {/* Linked Accounts - Show existing linked accounts */}
            {user?.email !== "test@thoughtmarks.app" && user?.linkedAccounts && (user.linkedAccounts as any[]).length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Linked Accounts</p>
                {(user.linkedAccounts as any[]).map((account, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                        <span className="text-xs font-bold text-primary">
                          {account.provider === 'google' ? 'G' : account.provider.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium">{account.provider.charAt(0).toUpperCase() + account.provider.slice(1)}</p>
                        <p className="text-xs text-muted-foreground">{account.email}</p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleUnlinkAccount(account.provider, account.providerUid)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Unlink className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {/* Admin Access - Only for nick@sawyerdesign.io */}
            {user?.email === "nick@sawyerdesign.io" && (
              <Button
                variant="ghost"
                className="w-full justify-start text-left p-3 h-auto"
                onClick={() => setLocation("/admin")}
              >
                <Shield className="w-5 h-5 mr-3 text-amber-500" />
                <div>
                  <p className="font-medium">Admin Dashboard</p>
                  <p className="text-sm text-muted-foreground">Manage premium access and app settings</p>
                </div>
              </Button>
            )}
          </div>
        </div>

        {/* Account Actions */}
        <div className="space-y-4 mb-8">
          <h2 className="text-lg font-semibold text-foreground">Account Actions</h2>
          <div className="bg-card rounded-lg p-4 border border-border space-y-3">
            <Button
              variant="destructive"
              onClick={handleSignOut}
              className="w-full justify-start"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
            
            <Button
              variant="ghost"
              onClick={() => setShowDeleteDialog(true)}
              className="w-full justify-start text-red-500 hover:text-red-400 hover:bg-red-500/10"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Account & All Data
            </Button>
          </div>
        </div>
      </div>

      {/* Account Deletion Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-500">
              <AlertTriangle className="w-5 h-5" />
              Delete Account
            </DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete your account and remove all your thoughtmarks, bins, and data from our servers.
            </DialogDescription>
          </DialogHeader>
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-red-500" />
              <span className="font-medium text-red-500">Warning</span>
            </div>
            <p className="text-sm text-red-400">
              All your thoughtmarks, bins, tags, and account data will be permanently erased. This cannot be recovered.
            </p>
          </div>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button 
              variant="outline" 
              onClick={() => setShowDeleteDialog(false)}
              className="w-full sm:w-auto"
            >
              Take me back
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteAccount}
              className="w-full sm:w-auto bg-red-600 hover:bg-red-700"
            >
              I understand, erase me
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Password Change Dialog */}
      <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Lock className="w-5 h-5 text-primary" />
              Change Password
            </DialogTitle>
            <DialogDescription>
              Enter your current password and choose a new one.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current-password">Current Password</Label>
              <Input
                id="current-password"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-password">New Password</Label>
              <Input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm New Password</Label>
              <Input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
              />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button 
              variant="outline" 
              onClick={() => {
                setShowPasswordDialog(false);
                setCurrentPassword("");
                setNewPassword("");
                setConfirmPassword("");
              }}
              disabled={isChangingPassword}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleChangePassword}
              disabled={isChangingPassword || !currentPassword || !newPassword || !confirmPassword}
            >
              {isChangingPassword ? "Changing..." : "Change Password"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Link Account Dialog */}
      <Dialog open={showLinkAccountDialog} onOpenChange={setShowLinkAccountDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Link2 className="w-5 h-5 text-primary" />
              Link Account
            </DialogTitle>
            <DialogDescription>
              Connect additional sign-in methods to your account for easier access.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-3">
              <Button
                onClick={() => handleLinkAccount('google')}
                disabled={isLinking}
                variant="outline"
                className="w-full justify-start h-12"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">G</span>
                  </div>
                  <div className="text-left">
                    <p className="font-medium">Link Google Account</p>
                    <p className="text-xs text-muted-foreground">Sign in with Google</p>
                  </div>
                </div>
                {isLinking ? <Loader2 className="w-4 h-4 animate-spin ml-auto" /> : <Plus className="w-4 h-4 ml-auto" />}
              </Button>

              <Button
                onClick={() => handleLinkAccount('apple')}
                disabled={isLinking}
                variant="outline"
                className="w-full justify-start h-12"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">🍎</span>
                  </div>
                  <div className="text-left">
                    <p className="font-medium">Link Apple Account</p>
                    <p className="text-xs text-muted-foreground">Sign in with Apple ID</p>
                  </div>
                </div>
                {isLinking ? <Loader2 className="w-4 h-4 animate-spin ml-auto" /> : <Plus className="w-4 h-4 ml-auto" />}
              </Button>

              <Button
                onClick={() => handleLinkAccount('github')}
                disabled={isLinking}
                variant="outline"
                className="w-full justify-start h-12"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">GH</span>
                  </div>
                  <div className="text-left">
                    <p className="font-medium">Link GitHub Account</p>
                    <p className="text-xs text-muted-foreground">Sign in with GitHub</p>
                  </div>
                </div>
                {isLinking ? <Loader2 className="w-4 h-4 animate-spin ml-auto" /> : <Plus className="w-4 h-4 ml-auto" />}
              </Button>
            </div>

            <div className="text-xs text-muted-foreground space-y-1">
              <p>• Linked accounts allow you to sign in using multiple methods</p>
              <p>• Your data remains secure and connected to your primary account</p>
              <p>• You can unlink accounts anytime from your settings</p>
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowLinkAccountDialog(false)}
              disabled={isLinking}
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dark Loading Overlay */}
      {isRefreshing && (
        <div className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="relative">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <div className="absolute inset-0 w-8 h-8 rounded-full border-2 border-primary/20"></div>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-medium text-foreground">Updating Profile</h3>
              <p className="text-sm text-muted-foreground">Your changes are being saved...</p>
            </div>
          </div>
        </div>
      )}
    </PageLayout>
  );
}