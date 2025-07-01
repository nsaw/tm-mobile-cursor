import { Switch, Route, useLocation } from "wouter";
import { useEffect, lazy, useState } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ErrorBoundary } from "@/components/error-boundary";
import { VisualThemeProvider } from "@/components/visual-theme-provider";
import { GlobalInteractionProvider } from "@/components/global-interaction-provider";
import { PersistentLayout } from "@/components/persistent-layout";
import { useAuth } from "@/hooks/use-auth";
import { useScrollToTop } from "@/hooks/use-scroll-to-top";
import { voiceHandler } from "@/lib/voice-handler";
import { useEnhancedScroll } from "@/hooks/use-enhanced-scroll";
import { LoadingScreen } from "@/components/loading-screen";

// Pages
import Dashboard from "@/pages/dashboard";
import BinDetail from "@/pages/bin-detail";
import BinDetailByName from "@/pages/bin-detail-by-name";
import AllBins from "@/pages/all-bins";
import CreateThoughtmark from "@/pages/create-thoughtmark";
import UnifiedThoughtmark from "@/pages/thoughtmark-unified";
import CreateBin from "@/pages/create-bin";
// DEPRECATED: Individual thoughtmark pages - use UnifiedThoughtmark instead
// import ThoughtmarkDetail from "@/pages/thoughtmark-detail";
// import ThoughtmarkView from "@/pages/thoughtmark-view";
import SearchResults from "@/pages/search-results";
import Auth from "@/pages/auth";
import RecentlyDeleted from "@/pages/recently-deleted";
import Archive from "@/pages/archive";
import Settings from "@/pages/settings";
import AllThoughtmarks from "@/pages/all-thoughtmarks";
import About from "@/pages/about";
import FAQ from "@/pages/faq";
import AIAssistant from "@/pages/ai-assistant";
import AITools from "@/pages/ai-tools";
import Subscribe from "@/pages/subscribe";
import Premium from "@/pages/premium";
import Collaborate from "@/pages/collaborate";
import Privacy from "@/pages/privacy";
import Terms from "@/pages/terms";
import PrivacyPolicy from "@/pages/settings/legal/privacy";
import TermsOfService from "@/pages/settings/legal/terms";
import LegalIndex from "@/pages/settings/legal/index";
import LiabilityLimitations from "@/pages/settings/legal/liability";
import DisputeResolution from "@/pages/settings/legal/dispute-resolution";
import IntellectualProperty from "@/pages/settings/legal/intellectual-property";
import { PrivacyRedirect, TermsRedirect } from "@/components/redirect";
import AdminDashboard from "@/pages/admin-dashboard";
import AdminPremium from "@/pages/admin-premium-fixed";
import AdminAnalytics from "@/pages/admin-analytics";
import AdminUsers from "@/pages/admin-users";
import AdminExports from "@/pages/admin-exports";
import AdminUserManagement from "@/pages/admin-user-management";
import NotFoundPage from "@/pages/404";

// Hierarchical Index Pages
import ContentIndex from "@/pages/content/index";
import BinsIndex from "@/pages/bins/index";
import AIIndex from "@/pages/ai/index";
import AccountIndex from "@/pages/settings/account/index";
import AutomationIndex from "@/pages/settings/automation/index";
import FormAutomation from "@/pages/form-automation";
import SiriSetup from "@/pages/siri-setup";
import Account from "@/pages/account";
import Tasks from "@/pages/tasks";
import PrivacySettings from "@/pages/privacy-settings";
import InterfaceGuide from "@/pages/interface-guide";
import NotFound from "@/pages/not-found";
import Overview from "@/pages/overview";
import Profile from "@/pages/profile";
import Help from "@/pages/help";

function AppRoutes() {
  return (
    <PersistentLayout>
      <Switch>
        {/* Core App Pages */}
      <Route path="/" component={Dashboard} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/search" component={SearchResults} />
      
      {/* Thoughtmarks Hierarchy */}
      <Route path="/thoughtmarks" component={AllThoughtmarks} />
      <Route path="/thoughtmarks/create" component={CreateThoughtmark} />
      <Route path="/thoughtmarks/archive" component={Archive} />
      <Route path="/thoughtmarks/trash" component={RecentlyDeleted} />
      
      {/* Bin Management Hierarchy */}
      <Route path="/bins" component={AllBins} />
      <Route path="/bins/create" component={CreateBin} />
      <Route path="/bins/:id(\d+)" component={BinDetail} />
      <Route path="/bins/:name" component={BinDetailByName} />
      
      {/* AI & Tools Hierarchy */}
      <Route path="/ai" component={AIIndex} />
      <Route path="/ai/assistant" component={AIAssistant} />
      <Route path="/ai/search" component={SearchResults} />
      <Route path="/ai/insights" component={AITools} />
      
      {/* Content Management (Archive & Trash for both Bins and Thoughtmarks) */}
      <Route path="/content" component={ContentIndex} />
      <Route path="/content/archive" component={Archive} />
      <Route path="/content/trash" component={RecentlyDeleted} />
      
      {/* Legacy Routes (maintained for compatibility) */}
      <Route path="/content/create" component={CreateThoughtmark} />
      <Route path="/content/all" component={AllThoughtmarks} />
      <Route path="/thoughtmarks/all" component={AllThoughtmarks} />
      <Route path="/thoughtmarks/create">
        {() => <UnifiedThoughtmark mode="create" />}
      </Route>
      <Route path="/bins/all" component={AllBins} />
      <Route path="/create">
        {() => {
          console.log('Create route matched, rendering UnifiedThoughtmark with mode="create"');
          return <UnifiedThoughtmark mode="create" />;
        }}
      </Route>
      <Route path="/all" component={AllThoughtmarks} />
      <Route path="/all-thoughtmarks" component={AllThoughtmarks} />
      <Route path="/all-bins" component={AllBins} />
      <Route path="/bin/:name" component={BinDetailByName} />
      <Route path="/bin/:id" component={BinDetail} />
      <Route path="/create-bin" component={CreateBin} />
      <Route path="/trash" component={RecentlyDeleted} />
      <Route path="/recently-deleted" component={RecentlyDeleted} />
      <Route path="/archive" component={Archive} />
      <Route path="/tasks">
        {() => {
          const [, setLocation] = useLocation();
          setLocation("/thoughtmarks/all?filter=tasks");
          return null;
        }}
      </Route>
      <Route path="/ai-assistant" component={AIAssistant} />
      <Route path="/ai">
        {() => {
          const [, setLocation] = useLocation();
          setLocation("/ai-tools");
          return null;
        }}
      </Route>
      <Route path="/ai-tools" component={AITools} />
      <Route path="/settings/ai-tools" component={AITools} />
      
      {/* Individual Content Pages - Unified Routes */}
      <Route path="/thoughtmarks/create">
        {() => <UnifiedThoughtmark mode="create" />}
      </Route>
      <Route path="/thoughtmarks/:id/view">
        {(params) => <UnifiedThoughtmark mode="view" />}
      </Route>
      <Route path="/thoughtmarks/:id/edit">
        {(params) => <UnifiedThoughtmark mode="edit" />}
      </Route>
      <Route path="/thoughtmarks/:id">
        {(params) => <UnifiedThoughtmark mode="view" />}
      </Route>
      
      {/* Deprecated Routes - Redirects to Unified Structure */}
      <Route path="/create">
        {() => {
          const [, setLocation] = useLocation();
          setLocation("/thoughtmarks/create");
          return null;
        }}
      </Route>
      <Route path="/thoughtmark/:id">
        {(params) => {
          const [, setLocation] = useLocation();
          setLocation(`/thoughtmarks/${params.id}`);
          return null;
        }}
      </Route>
      <Route path="/thoughtmark/:id/edit">
        {(params) => {
          const [, setLocation] = useLocation();
          setLocation(`/thoughtmarks/${params.id}/edit`);
          return null;
        }}
      </Route>
      <Route path="/thoughtmark/:id/view">
        {(params) => {
          const [, setLocation] = useLocation();
          setLocation(`/thoughtmarks/${params.id}/view`);
          return null;
        }}
      </Route>
      <Route path="/edit/:id">
        {(params) => {
          const [, setLocation] = useLocation();
          setLocation(`/thoughtmarks/${params.id}/edit`);
          return null;
        }}
      </Route>
      <Route path="/view/:id">
        {(params) => {
          const [, setLocation] = useLocation();
          setLocation(`/thoughtmarks/${params.id}/view`);
          return null;
        }}
      </Route>
      
      {/* Premium Features */}
      <Route path="/premium" component={Premium} />
      <Route path="/subscribe" component={Subscribe} />
      
      {/* Information Pages */}
      <Route path="/about" component={About} />
      <Route path="/faq" component={FAQ} />
      <Route path="/collaborate" component={Collaborate} />
      {/* Settings Hierarchy */}
      <Route path="/settings" component={Settings} />
      
      {/* Account & Profile Settings */}
      <Route path="/settings/account" component={AccountIndex} />
      <Route path="/settings/account/profile" component={Profile} />
      <Route path="/settings/account/privacy" component={PrivacySettings} />
      <Route path="/settings/account/security" component={Account} />
      
      {/* Automation & Integration Settings */}
      <Route path="/settings/automation" component={AutomationIndex} />
      <Route path="/settings/automation/forms" component={FormAutomation} />
      <Route path="/settings/automation/siri" component={SiriSetup} />
      <Route path="/settings/automation/voice" component={SiriSetup} />
      
      {/* Interface & Experience Settings */}
      <Route path="/settings/interface" component={InterfaceGuide} />
      <Route path="/settings/interface/guide" component={InterfaceGuide} />
      <Route path="/settings/interface/tasks" component={Tasks} />
      <Route path="/settings/interface/overview" component={Overview} />
      
      {/* Help & Support Settings */}
      <Route path="/settings/help" component={Help} />
      <Route path="/settings/help/guides" component={Help} />
      <Route path="/settings/help/support" component={Help} />
      <Route path="/settings/help/faq" component={FAQ} />
      
      {/* Legal Documents */}
      <Route path="/settings/legal" component={LegalIndex} />
      <Route path="/settings/legal/terms" component={TermsOfService} />
      <Route path="/settings/legal/privacy" component={PrivacyPolicy} />
      <Route path="/settings/legal/liability" component={LiabilityLimitations} />
      <Route path="/settings/legal/dispute-resolution" component={DisputeResolution} />
      <Route path="/settings/legal/intellectual-property" component={IntellectualProperty} />
      
      {/* Legacy Settings Routes */}
      <Route path="/settings/form-automation" component={FormAutomation} />
      <Route path="/settings/siri-setup" component={SiriSetup} />
      <Route path="/settings/tasks" component={Tasks} />
      <Route path="/settings/privacy-settings" component={PrivacySettings} />
      <Route path="/settings/interface-guide" component={InterfaceGuide} />
      <Route path="/settings/overview" component={Overview} />
      <Route path="/settings/profile" component={Profile} />
      
      {/* Admin Pages */}
      <Route path="/admin" component={AdminDashboard} />
      <Route path="/settings/admin/admin-exports" component={AdminExports} />
      <Route path="/admin-dashboard" component={AdminDashboard} />
      <Route path="/admin/analytics" component={AdminAnalytics} />
      <Route path="/admin-premium" component={AdminPremium} />
      <Route path="/admin/users" component={AdminUserManagement} />
      <Route path="/admin/users-legacy" component={AdminUsers} />
      
      {/* Legacy Legal Routes */}
      <Route path="/privacy" component={Privacy} />
      <Route path="/terms" component={Terms} />
      <Route path="/legal/terms" component={lazy(() => import("./pages/legal/terms-of-service").then(m => ({ default: m.default })))} />
      <Route path="/legal/privacy" component={lazy(() => import("./pages/legal/privacy-policy").then(m => ({ default: m.default })))} />
      <Route path="/legal/cookies" component={lazy(() => import("./pages/legal/cookie-policy").then(m => ({ default: m.default })))} />
      <Route path="/auth">
        {() => <Auth />}
      </Route>
      <Route path="/signup">
        {() => <Auth initialMode="signup" />}
      </Route>
      <Route path="/login">
        {() => <Auth />}
      </Route>
      <Route component={NotFoundPage} />
      </Switch>
    </PersistentLayout>
  );
}

function Router() {
  const { isAuthenticated, loading, guestMode } = useAuth();
  const [, setLocation] = useLocation();
  const [appLoading, setAppLoading] = useState(true);
  
  // Add scroll-to-top functionality for all authenticated routes
  useScrollToTop();

  // Handle initial app boot loading
  useEffect(() => {
    const bootTimer = setTimeout(() => {
      setAppLoading(false);
    }, 3000); // Show loading for 3 seconds minimum

    return () => clearTimeout(bootTimer);
  }, []);

  // Voice processing is now handled directly in the enhanced voice recorder
  
  // Debug authentication state
  console.log('Router auth state:', { isAuthenticated, loading, guestMode });
  console.log('Current URL in Router:', window.location.href);

  // Check for pending voice content when authenticated (only once per session)
  useEffect(() => {
    if (isAuthenticated && !loading) {
      const storedVoiceData = localStorage.getItem('thoughtmarks-voice-content');
      console.log('Checking for voice content in Router after auth:', storedVoiceData);
      
      if (storedVoiceData) {
        try {
          const voiceData = JSON.parse(storedVoiceData);
          const isRecent = Date.now() - voiceData.timestamp < 5 * 60 * 1000;
          
          if (isRecent && voiceData.content) {
            console.log('Found pending voice content, encoding in URL');
            
            // Clear the original storage FIRST to prevent redirect loops
            localStorage.removeItem('thoughtmarks-voice-content');
            
            // Encode voice data in URL parameters
            const encodedContent = encodeURIComponent(voiceData.content);
            const encodedTitle = encodeURIComponent(voiceData.title || "Voice Note");
            
            console.log('Voice content cleared, navigating to create with URL params');
            
            // Navigate with voice data in URL
            setLocation(`/create?voice=true&content=${encodedContent}&title=${encodedTitle}&tags=voice`);
          } else {
            // Clear expired data
            localStorage.removeItem('thoughtmarks-voice-content');
          }
        } catch (error) {
          console.error('Error parsing voice data in Router:', error);
          localStorage.removeItem('thoughtmarks-voice-content');
        }
      }
    }
  }, [isAuthenticated, loading, setLocation]);

  // Show custom loading screen during app boot or auth loading
  if (appLoading || loading) {
    console.log('App loading, showing custom loading screen');
    return <LoadingScreen isVisible={true} onComplete={() => setAppLoading(false)} />;
  }

  // Require authentication to access the app
  if (!isAuthenticated) {
    console.log('User not authenticated, showing Auth component');
    return <Auth />;
  }

  console.log('User authenticated, loading AppRoutes');
  return <AppRoutes />;
}

function App() {
  // Initialize voice handler for background processing
  useEffect(() => {
    // Initialize voice handler singleton
    voiceHandler;
  }, []);

  // Enable enhanced scroll physics with maximum fling behavior
  useEnhancedScroll({
    momentum: 0.99,           // Maximum inertia
    friction: 0.005,          // Minimal friction  
    maxVelocity: 150,         // Much higher max velocity
    velocityMultiplier: 35,   // Aggressive velocity scaling
    enabled: true
  });

  return (
    <ErrorBoundary>
      <VisualThemeProvider defaultTheme="fluid">
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <GlobalInteractionProvider>
              <div className="relative full-height">
                {/* iOS Toolbar Mask */}
                <div className="ios-toolbar-mask" />
                {/* iOS-style header fade overlay */}
                <div className="header-fade-overlay" />
                <Toaster />
                <div className="ios-content-offset">
                  <Router />
                </div>
              </div>
            </GlobalInteractionProvider>
          </TooltipProvider>
        </QueryClientProvider>
      </VisualThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
