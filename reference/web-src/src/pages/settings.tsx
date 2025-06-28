import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useSwipeNavigation } from "@/hooks/use-swipe-navigation";

import { useVisualTheme } from "@/components/visual-theme-provider";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { BackButton } from "@/components/ui/BackButton";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { PersistentLayout } from "@/components/persistent-layout";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { SiriShortcutGenerator } from "@/lib/siri-shortcuts";
import { errorHandler } from "@/lib/error-handler";
import { 
  Settings as SettingsIcon, 
  Bell, 
  Brain, 
  Edit3, 
  Download, 
  LogOut, 
  Trash2, 
  Shield, 
  HelpCircle, 
  ExternalLink, 
  Palette, 
  Navigation, 
  User, 
  ChevronDown, 
  ChevronRight, 
  Sparkles,
  KeyIcon, 
  Key,
  Crown,
  CheckCircle,
  Lightbulb,
  ArrowLeft,
  ArrowRight,
  Mic,
  FileText,
  Search,
  Users,
  Zap,
  Plus,
  Mail,
  MessageSquare,
  Cookie,
  Beaker
} from "lucide-react";
import { PasskeyManager } from "@/components/passkey-manager";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";



export default function Settings() {
  const [, setLocation] = useLocation();
  const { visualTheme, setVisualTheme } = useVisualTheme();
  const { user, isAuthenticated, logout } = useAuth();
  const { toast } = useToast();
  
  // Visual theme is now handled by VisualThemeProvider
  
  // Local state
  const [showNavLabels, setShowNavLabels] = useState(() => {
    return localStorage.getItem("showNavLabels") !== "false";
  });
  const [notificationsExpanded, setNotificationsExpanded] = useState(false);
  const [showPasskeyManager, setShowPasskeyManager] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showSiriDialog, setShowSiriDialog] = useState(false);
  const [siriTriggerPhrase, setSiriTriggerPhrase] = useState(() => {
    return localStorage.getItem("siriTriggerPhrase") || "add to Thoughtmarks";
  });
  const [tempSiriPhrase, setTempSiriPhrase] = useState("");
  const [marketingEmails, setMarketingEmails] = useState(true);
  const [aiNotifications, setAiNotifications] = useState(true);
  const [smartReminders, setSmartReminders] = useState(true);

  // Load user preferences
  useEffect(() => {
    if (user?.isPremium || user?.isTestUser) {
      setAiNotifications(user?.aiNotifications !== undefined ? user.aiNotifications : true);
      setSmartReminders(user?.smartReminders !== undefined ? user.smartReminders : true);
    }
  }, [user]);

  // Fetch user's marketing preferences
  useEffect(() => {
    if (user?.marketingEmails !== undefined) {
      setMarketingEmails(user.marketingEmails);
    }
  }, [user]);

  // Save nav labels preference
  useEffect(() => {
    localStorage.setItem("showNavLabels", showNavLabels.toString());
    window.dispatchEvent(new CustomEvent("navLabelsChanged", { detail: showNavLabels }));
  }, [showNavLabels]);

  // Save Siri phrase preference
  const handleSiriPhraseSave = () => {
    setSiriTriggerPhrase(tempSiriPhrase);
    localStorage.setItem("siriTriggerPhrase", tempSiriPhrase);
    setShowSiriDialog(false);
    toast({
      title: "Siri Phrase Updated",
      description: `Your Siri trigger phrase is now: "Hey Siri, ${tempSiriPhrase}"`,
      
    });
  };

  // Handle sign out
  const handleSignOut = async () => {
    try {
      await logout();
      toast({
        title: "Signed out successfully",
        description: "You have been signed out of your account.",
        
      });
      setLocation("/auth");
    } catch (error) {
      toast({
        title: "Error signing out",
        description: "There was a problem signing you out. Please try again.",
        variant: "destructive",
        
      });
    }
  };

  // Handle account deletion
  const handleDeleteAccount = async () => {
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
        setLocation("/auth");
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

  // Enable swipe back navigation
  useSwipeNavigation({
    enabled: true,
    threshold: 80,
    maxVerticalThreshold: 120,
    edgeThreshold: 30
  });

  return (
    <PersistentLayout>
      <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-background/90">
        <div className="max-w-2xl mx-auto px-4 py-8 momentum-scroll enhanced-scroll settings-content">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <BackButton />
              <h1 className="section-title text-2xl mb-2">
                SETTINGS
              </h1>
            </div>
            <p className="text-gray-400">Customize your Thoughtmarks experience</p>
          </div>

          {/* Welcome Section */}
          <div className="mb-8">
            <Card className="bg-card/60 backdrop-blur-xl border-border/20 bg-gradient-to-r from-green-500/10 to-green-400/5 border-green-500/20">
              <CardHeader className="pb-3">
                {/* Centered Brain Icon */}
                <div className="welcome-card-brain-icon">
                  <Brain className="w-8 h-8 text-green-500" />
                </div>
                <CardTitle className="text-lg welcome-card-header text-white">
                  Welcome to Thoughtmarks{user ? `, ${user.firstName || user.displayName?.split(' ')[0] || user.email?.split('@')[0]}` : ''}
                </CardTitle>
                <CardDescription className="text-gray-400 welcome-card-description-left">
                  Capture fleeting thoughts without breaking your flow. Use voice commands, quick notes, or AI-powered categorization to build your personal knowledge base effortlessly.
                </CardDescription>
              </CardHeader>
              <CardContent className="welcome-card-content">
                <Button
                  variant="outline"
                  className="card-hover touch-feedback haptic-feedback gpu-accelerated border-border/50 hover:bg-card/50 welcome-card-button"
                  onClick={() => setLocation("/settings/overview")}
                >
                  Learn More
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Account Settings Section */}
          <div className="bg-card/60 backdrop-blur-xl border border-border/20 rounded-lg p-6 mb-8">
            <div className="mb-4">
              <h2 className="section-title text-lg flex items-center gap-2">
                <User className="w-5 h-5 text-green-500" />
                ACCOUNT SETTINGS
              </h2>
              <p className="text-gray-400 text-sm mt-1">
                Manage your profile, account data, and administrative access
              </p>
            </div>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 cursor-pointer p-3 rounded-lg hover:bg-card/50 transition-colors border border-border/50 hover:border-border" onClick={() => setLocation("/settings/profile")}>
                <User className="w-5 h-5 text-green-500" />
                <div>
                  <h3 className="font-medium text-white">Profile & Data</h3>
                  <p className="text-sm text-gray-400">Manage your account, profile picture, and data</p>
                </div>
              </div>
            
              {user?.email === "nick@sawyerdesign.io" && (
                <>
                  <div className="flex items-center space-x-3 cursor-pointer p-3 rounded-lg hover:bg-card/50 transition-colors border border-border/50 hover:border-border" onClick={() => setLocation("/admin-dashboard")}>
                    <Zap className="w-5 h-5 text-yellow-500" />
                    <div>
                      <h3 className="font-medium text-white">Admin Dashboard</h3>
                      <p className="text-sm text-gray-400">System management and testing tools</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 cursor-pointer p-3 rounded-lg hover:bg-card/50 transition-colors border border-border/50 hover:border-border" onClick={() => setLocation("/settings/admin/admin-exports")}>
                    <Download className="w-5 h-5 text-blue-500" />
                    <div>
                      <h3 className="font-medium text-white">Admin Export Suite</h3>
                      <p className="text-sm text-gray-400">Generate iOS SwiftUI apps and export assets</p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Security & Authentication Section */}
          <Card className="section-gap card-standard bg-card/60 dark:bg-card/40 backdrop-blur-xl border-border/20 dark:border-gray-700/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground dark:text-white">
                <Shield className="w-5 h-5 text-blue-500" />
                Security & Authentication
              </CardTitle>
              <CardDescription className="text-muted-foreground dark:text-gray-400">
                Manage your login methods and security preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Passkey Section */}
              <div className="flex items-center justify-between p-3 rounded-lg border border-border/50 dark:border-gray-600/50 bg-card/30 dark:bg-card/20">
                <div className="flex items-center space-x-3">
                  <Key className="w-5 h-5 text-purple-500" />
                  <div>
                    <h3 className="font-medium text-foreground dark:text-white">Passkeys</h3>
                    <p className="text-sm text-muted-foreground dark:text-gray-400">Biometric authentication with Face ID or Touch ID</p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  className="border-border/50 dark:border-gray-600 hover:bg-card/50 dark:hover:bg-card/40"
                  size="sm"
                  onClick={() => setShowPasskeyManager(true)}
                >
                  Manage
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Notifications Section */}
          <Card className="section-gap card-standard bg-card/60 dark:bg-card/40 backdrop-blur-xl border-border/20 dark:border-gray-700/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground dark:text-white">
                <Bell className="w-5 h-5 text-blue-500" />
                Notifications
              </CardTitle>
              <CardDescription className="text-muted-foreground dark:text-gray-400">
                Configure your alert preferences and notification settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                variant="ghost"
                className="w-full justify-between text-left p-3 h-auto hover:bg-card/50 dark:hover:bg-card/30 text-foreground dark:text-white"
                onClick={() => setNotificationsExpanded(!notificationsExpanded)}
              >
                <span className="text-sm font-medium">Manage Notification Settings</span>
                {notificationsExpanded ? (
                  <ChevronDown className="w-4 h-4 text-muted-foreground dark:text-gray-400" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-muted-foreground dark:text-gray-400" />
                )}
              </Button>
              
              {notificationsExpanded && (
                <div className="mt-4 space-y-3 border-t border-border/50 dark:border-gray-600/50 pt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-foreground dark:text-white">Daily Reminders</p>
                      <p className="text-sm text-muted-foreground dark:text-gray-400">Get reminded to capture your thoughts</p>
                    </div>
                    <Switch defaultChecked={true} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-foreground dark:text-white">Task Notifications</p>
                      <p className="text-sm text-muted-foreground dark:text-gray-400">Alerts for due dates and deadlines</p>
                    </div>
                    <Switch defaultChecked={true} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-foreground dark:text-white">AI Insights</p>
                      <p className="text-sm text-muted-foreground dark:text-gray-400">Weekly summaries and pattern discoveries</p>
                    </div>
                    <Switch 
                      checked={aiNotifications}
                      onCheckedChange={async (checked) => {
                        try {
                          const response = await fetch("/api/users/alt-ai-notifications", {
                            method: "PUT",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ aiNotifications: checked })
                          });
                          
                          if (response.ok) {
                            setAiNotifications(checked);
                            toast({
                              title: "AI Notifications Updated",
                            description: checked ? "AI insights enabled" : "AI insights disabled",
                              
                          });
                        }
                      } catch (error) {
                        toast({
                          title: "Update Failed",
                          description: "Could not update AI notification preferences",
                          variant: "destructive",
                          
                        });
                      }
                    }}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Smart Reminders</p>
                    <p className="text-sm text-muted-foreground">Intelligent suggestions based on your patterns</p>
                  </div>
                  <Switch 
                    checked={smartReminders}
                    onCheckedChange={async (checked) => {
                      try {
                        const response = await fetch("/api/users/alt-smart-reminders", {
                          method: "PUT",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ smartReminders: checked })
                        });
                        
                        if (response.ok) {
                          setSmartReminders(checked);
                          toast({
                            title: "Smart Reminders Updated",
                            description: checked ? "Smart reminders enabled" : "Smart reminders disabled",
                          });
                        }
                      } catch (error) {
                        toast({
                          title: "Update Failed",
                          description: "Could not update smart reminder preferences",
                          variant: "destructive",
                        });
                      }
                    }}
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

          {/* Theme & Appearance Section */}
          <Card className="section-gap card-standard bg-card/60 dark:bg-card/40 backdrop-blur-xl border-border/20 dark:border-gray-700/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground dark:text-white">
                <Palette className="w-5 h-5 text-purple-500" />
                Theme & Appearance
              </CardTitle>
              <CardDescription className="text-muted-foreground dark:text-gray-400">
                Customize the visual appearance of your Thoughtmarks experience
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">


              {/* Visual Style */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground dark:text-white">Visual Style</p>
                  <p className="text-sm text-muted-foreground dark:text-gray-400">Choose between modern glass effects or classic solid design</p>
                </div>
                <Select value={visualTheme} onValueChange={(value: "fluid" | "solid") => setVisualTheme(value)}>
                  <SelectTrigger className="w-32 border-border/50 dark:border-gray-600 bg-card/50 dark:bg-card/30">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card dark:bg-gray-800 border-border dark:border-gray-700">
                    <SelectItem value="fluid">Fluid Glass</SelectItem>
                    <SelectItem value="solid">Classic Solid</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Navigation Labels */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground dark:text-white">Navigation Labels</p>
                  <p className="text-sm text-muted-foreground dark:text-gray-400">Show text labels in bottom navigation</p>
                </div>
                <Switch 
                  checked={showNavLabels}
                  onCheckedChange={setShowNavLabels}
                />
              </div>
            </CardContent>
          </Card>

          {/* AI Tools Section */}
          <Card className="section-gap card-standard bg-card/60 dark:bg-card/40 backdrop-blur-xl border-border/20 dark:border-gray-700/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground dark:text-white">
                <Sparkles className="w-5 h-5 text-green-500" />
                AI Tools
              </CardTitle>
              <CardDescription className="text-muted-foreground dark:text-gray-400">
                Discover patterns and insights in your thoughtmarks with AI
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div 
                className="flex items-center space-x-3 cursor-pointer p-3 rounded-lg hover:bg-card/50 dark:hover:bg-card/30 transition-colors border border-border/50 dark:border-gray-600/50 hover:border-border dark:hover:border-gray-500" 
                onClick={() => setLocation("/settings/ai-tools")}
                role="button"
                tabIndex={0}
                aria-label="Open AI insights and smart sorting settings"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setLocation("/settings/ai-tools");
                  }
                }}
              >
                <Sparkles className="w-5 h-5 text-green-500" aria-hidden="true" />
                <div className="flex-1">
                  <h3 className="font-medium text-foreground dark:text-white">AI Insights & Smart Sorting</h3>
                  <p className="text-sm text-muted-foreground dark:text-gray-400">Discover patterns and organize thoughtmarks...</p>
                </div>
                {!user?.isPremium && (
                  <div className="text-xs bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 px-2 py-1 rounded" aria-label="Premium feature">
                    PREMIUM
                  </div>
                )}
              </div>
            
            <div className="flex items-center space-x-3 cursor-pointer p-3 rounded-lg hover:bg-card/50 transition-colors border border-border/50 hover:border-border" onClick={() => setLocation("/settings/interface-guide")}>
              <Zap className="w-5 h-5 text-yellow-500" />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium">ToolTips</h3>
                  <span className="text-xs bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 px-2 py-1 rounded">NEW</span>
                </div>
                <p className="text-sm text-muted-foreground">Master your thoughtmark workflow</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Help Section */}
        <Card className="mb-8 card-hover">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-blue-500" />
              Quick Help
            </CardTitle>
            <CardDescription>
              Common questions and helpful guides to get you started
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-3">
            <div 
              className="flex items-center space-x-3 cursor-pointer p-4 rounded-lg hover:bg-accent/50 transition-all duration-200 border border-border/30 hover:border-border hover:shadow-sm" 
              onClick={() => setLocation("/settings/automation/siri")}
              role="button"
              tabIndex={0}
              aria-label="Open Siri voice capture setup guide"
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setLocation("/settings/automation/siri");
                }
              }}
            >
              <Mic className="w-5 h-5 text-blue-500 flex-shrink-0" aria-hidden="true" />
              <div className="min-w-0 flex-1">
                <h3 className="font-medium text-sm">How do I set up Siri voice capture?</h3>
                <p className="text-xs text-muted-foreground">Quick Siri setup guide</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 cursor-pointer p-4 rounded-lg hover:bg-accent/50 transition-all duration-200 border border-border/30 hover:border-border hover:shadow-sm" onClick={() => setLocation("/ai")}>
              <Brain className="w-5 h-5 text-purple-500 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <h3 className="font-medium text-sm">How does AI categorization work?</h3>
                <p className="text-xs text-muted-foreground">AI features overview</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 cursor-pointer p-4 rounded-lg hover:bg-accent/50 transition-all duration-200 border border-border/30 hover:border-border hover:shadow-sm" onClick={() => setLocation("/bins")}>
              <FileText className="w-5 h-5 text-green-500 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <h3 className="font-medium text-sm">Can I organize into custom bins?</h3>
                <p className="text-xs text-muted-foreground">Organization guide</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 cursor-pointer p-4 rounded-lg hover:bg-accent/50 transition-all duration-200 border border-border/30 hover:border-border hover:shadow-sm" onClick={() => setLocation("/search")}>
              <Search className="w-5 h-5 text-yellow-500 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <h3 className="font-medium text-sm">How do I search thoughtmarks?</h3>
                <p className="text-xs text-muted-foreground">Search tips and tricks</p>
              </div>
            </div>
          </CardContent>
        </Card>


        {/* Premium Benefits Section */}
        {!user?.isPremium && (
          <div className="mb-8">
            <Card className="bg-gradient-to-r from-orange-500/10 to-red-400/5 border-orange-500/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center space-x-2">
                  <Crown className="w-5 h-5 text-orange-500" />
                  <span>Upgrade to Premium</span>
                </CardTitle>
                <CardDescription>
                  Unlock powerful AI features and advanced organization tools
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4 mb-6">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm">AI-powered insights and smart sorting</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm">Advanced AI notifications and reminders</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm">Unlimited thoughtmarks and bins</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm">Priority support and early access</span>
                  </div>
                </div>
                <Button
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                  onClick={() => setLocation("/premium")}
                >
                  <Crown className="w-4 h-4 mr-2" />
                  Upgrade to Premium
                </Button>
              </CardContent>
            </Card>
          </div>
        )}



        {/* Beta Features Section */}
        <Card className="mb-8 card-hover">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Beaker className="w-5 h-5 text-orange-500" />
              Beta Features
            </CardTitle>
            <CardDescription>
              Try experimental features and help shape the future of Thoughtmarks
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div 
              className="flex items-center space-x-3 cursor-pointer p-4 rounded-lg hover:bg-accent/50 transition-all duration-200 border border-border/30 hover:border-border hover:shadow-sm" 
              onClick={() => window.open(SiriShortcutGenerator.generateShortcutFile(), '_blank')}
              role="button"
              tabIndex={0}
              aria-label="Download Siri shortcut for voice capture"
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  window.open(SiriShortcutGenerator.generateShortcutFile(), '_blank');
                }
              }}
            >
              <Download className="w-5 h-5 text-green-500 flex-shrink-0" aria-hidden="true" />
              <div className="min-w-0 flex-1">
                <h3 className="font-medium">Quick Siri Setup</h3>
                <p className="text-sm text-muted-foreground">One-tap install for "Hey Siri, add to Thoughtmarks"</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 cursor-pointer p-4 rounded-lg hover:bg-accent/50 transition-all duration-200 border border-border/30 hover:border-border hover:shadow-sm" onClick={() => {
              setTempSiriPhrase(siriTriggerPhrase);
              setShowSiriDialog(true);
            }}>
              <Edit3 className="w-5 h-5 text-green-500 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <h3 className="font-medium">Customize Siri Phrase</h3>
                <p className="text-sm text-muted-foreground">Currently: "Hey Siri, {siriTriggerPhrase}"</p>
              </div>
            </div>
          </CardContent>
        </Card>

        




        {/* Support & Information Section */}
        <Card className="mb-8 card-hover">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-blue-500" />
              Support & Information
            </CardTitle>
            <CardDescription>
              Get help, review policies, and access important information
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-3">
            <div className="flex items-center space-x-3 cursor-pointer p-4 rounded-lg hover:bg-accent/50 transition-all duration-200 border border-border/30 hover:border-border hover:shadow-sm" onClick={() => setLocation("/settings/help")}>
              <HelpCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <h3 className="font-medium text-sm">Help & Support</h3>
                <p className="text-xs text-muted-foreground">Get assistance and find answers</p>
              </div>
            </div>
            
            <div 
              className="flex items-center space-x-3 cursor-pointer p-4 rounded-lg hover:bg-accent/50 transition-all duration-200 border border-border/30 hover:border-border hover:shadow-sm" 
              onClick={() => setLocation("/settings/legal/terms")}
              role="button"
              tabIndex={0}
              aria-label="View terms of service"
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setLocation("/settings/legal/terms");
                }
              }}
            >
              <FileText className="w-5 h-5 text-blue-500 flex-shrink-0" aria-hidden="true" />
              <div className="min-w-0 flex-1">
                <h3 className="font-medium text-sm">Terms of Service</h3>
                <p className="text-xs text-muted-foreground">Service terms and conditions</p>
              </div>
            </div>
            
            <div 
              className="flex items-center space-x-3 cursor-pointer p-4 rounded-lg hover:bg-accent/50 transition-all duration-200 border border-border/30 hover:border-border hover:shadow-sm" 
              onClick={() => setLocation("/settings/legal/privacy")}
              role="button"
              tabIndex={0}
              aria-label="View privacy policy"
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setLocation("/settings/legal/privacy");
                }
              }}
            >
              <Shield className="w-5 h-5 text-green-500 flex-shrink-0" aria-hidden="true" />
              <div className="min-w-0 flex-1">
                <h3 className="font-medium text-sm">Privacy Policy</h3>
                <p className="text-xs text-muted-foreground">Data handling and privacy</p>
              </div>
            </div>
            
            <div 
              className="flex items-center space-x-3 cursor-pointer p-4 rounded-lg hover:bg-accent/50 transition-all duration-200 border border-border/30 hover:border-border hover:shadow-sm" 
              onClick={() => setLocation("/legal/cookies")}
              role="button"
              tabIndex={0}
              aria-label="View cookie policy"
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setLocation("/legal/cookies");
                }
              }}
            >
              <Cookie className="w-5 h-5 text-orange-500 flex-shrink-0" aria-hidden="true" />
              <div className="min-w-0 flex-1">
                <h3 className="font-medium text-sm">Cookie Policy</h3>
                <p className="text-xs text-muted-foreground">Cookie usage and preferences</p>
              </div>
            </div>
          </CardContent>
        </Card>



          {/* Account Actions */}
          <div className="space-y-4 mb-8">
            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start card-hover touch-feedback haptic-feedback gpu-accelerated border-border/50 dark:border-gray-600 hover:bg-card/50 dark:hover:bg-card/40 text-foreground dark:text-white"
                onClick={handleSignOut}
              >
                <LogOut className="w-5 h-5 mr-3" />
                Sign Out
              </Button>
              
              <Button
                variant="destructive"
                className="w-full justify-start bg-red-600 dark:bg-red-700 hover:bg-red-700 dark:hover:bg-red-800 text-white"
                onClick={() => setShowDeleteDialog(true)}
              >
                <Trash2 className="w-5 h-5 mr-3" />
                Delete Account
              </Button>
            </div>
          </div>

        {/* Passkey Manager Dialog */}
        {showPasskeyManager && (
          <PasskeyManager
            isOpen={showPasskeyManager}
            onClose={() => setShowPasskeyManager(false)}
          />
        )}

        {/* Siri Phrase Dialog */}
        <Dialog open={showSiriDialog} onOpenChange={setShowSiriDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Customize Siri Phrase</DialogTitle>
              <DialogDescription>
                Set your preferred phrase for voice capture. This will be used when creating your Siri shortcut.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="siri-phrase">Trigger Phrase</Label>
                <Input
                  id="siri-phrase"
                  value={tempSiriPhrase}
                  onChange={(e) => setTempSiriPhrase(e.target.value)}
                  placeholder="add to Thoughtmarks"
                />
                <p className="text-sm text-muted-foreground">
                  You'll say: "Hey Siri, {tempSiriPhrase || "add to Thoughtmarks"}"
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowSiriDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleSiriPhraseSave}>
                Save Changes
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
              <Button variant="destructive" onClick={handleDeleteAccount}>
                Delete Account
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        </div>
      </div>
    </PersistentLayout>
  );
}