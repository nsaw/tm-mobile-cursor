import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Star } from "lucide-react";
import { useAccessibility } from "./accessibility-provider";

interface ReviewPromptState {
  shown: boolean;
  dismissed: boolean;
  reviewGiven: boolean;
  lastShown: number;
}

const REVIEW_TRIGGERS = {
  DAYS_USED: 7,
  THOUGHTMARKS_CREATED: 10,
  AI_FEATURES_USED: 3,
  ONBOARDING_COMPLETED: 1
};

export function AppReviewPrompt() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [promptReason, setPromptReason] = useState<string>("");
  const { announceMessage } = useAccessibility();

  useEffect(() => {
    checkForReviewPrompt();
  }, []);

  const checkForReviewPrompt = () => {
    const reviewState = getReviewState();
    
    if (reviewState.reviewGiven || reviewState.dismissed) {
      return;
    }

    // Don't show more than once per day
    const daysSinceLastShown = (Date.now() - reviewState.lastShown) / (1000 * 60 * 60 * 24);
    if (daysSinceLastShown < 1) {
      return;
    }

    const stats = getUserStats();
    let shouldShow = false;
    let reason = "";

    // Check triggers
    if (stats.daysUsed >= REVIEW_TRIGGERS.DAYS_USED && !reviewState.shown) {
      shouldShow = true;
      reason = "Loving Thoughtmarks? You've been using it for a week!";
    } else if (stats.thoughtmarksCreated >= REVIEW_TRIGGERS.THOUGHTMARKS_CREATED) {
      shouldShow = true;
      reason = "You're building something great! Mind rating us?";
    } else if (stats.aiFeaturesUsed >= REVIEW_TRIGGERS.AI_FEATURES_USED) {
      shouldShow = true;
      reason = "How was your AI experience? Share a review!";
    } else if (stats.onboardingCompleted && !reviewState.shown) {
      shouldShow = true;
      reason = "Ready to capture every thought? Rate us!";
    }

    if (shouldShow) {
      setPromptReason(reason);
      setShowPrompt(true);
      updateReviewState({ lastShown: Date.now() });
      announceMessage("App review prompt opened");
    }
  };

  const getUserStats = () => {
    const firstUse = localStorage.getItem('thoughtmarks-first-use');
    const thoughtmarksCreated = JSON.parse(localStorage.getItem('thoughtmarks') || '[]').length;
    const aiFeaturesUsed = parseInt(localStorage.getItem('ai-features-used') || '0');
    const onboardingCompleted = localStorage.getItem('onboarding-completed') === 'true';
    
    const daysUsed = firstUse ? 
      Math.floor((Date.now() - parseInt(firstUse)) / (1000 * 60 * 60 * 24)) : 0;

    return {
      daysUsed,
      thoughtmarksCreated,
      aiFeaturesUsed,
      onboardingCompleted
    };
  };

  const getReviewState = (): ReviewPromptState => {
    const state = localStorage.getItem('review-prompt-state');
    if (state) {
      return JSON.parse(state);
    }
    return {
      shown: false,
      dismissed: false,
      reviewGiven: false,
      lastShown: 0
    };
  };

  const updateReviewState = (updates: Partial<ReviewPromptState>) => {
    const currentState = getReviewState();
    const newState = { ...currentState, ...updates };
    localStorage.setItem('review-prompt-state', JSON.stringify(newState));
  };

  const handleRateApp = () => {
    // In a real app, this would open the App Store
    // For web version, could redirect to testimonials or feedback form
    updateReviewState({ reviewGiven: true, shown: true });
    setShowPrompt(false);
    announceMessage("Thank you for rating Thoughtmarks!");
    
    // Simulate App Store rating
    window.open('https://apps.apple.com/app/thoughtmarks', '_blank');
  };

  const handleNotNow = () => {
    updateReviewState({ lastShown: Date.now() });
    setShowPrompt(false);
    announceMessage("Review prompt dismissed");
  };

  const handleNeverAsk = () => {
    updateReviewState({ dismissed: true, shown: true });
    setShowPrompt(false);
    announceMessage("Review prompts disabled");
  };

  const trackAIFeatureUsed = () => {
    const current = parseInt(localStorage.getItem('ai-features-used') || '0');
    localStorage.setItem('ai-features-used', (current + 1).toString());
  };

  // Export function to be called when AI features are used
  (window as any).trackAIFeatureUsed = trackAIFeatureUsed;

  return (
    <Dialog open={showPrompt} onOpenChange={setShowPrompt}>
      <DialogContent className="sm:max-w-md bg-[#1a1a1a] border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-400 fill-current" />
            Rate Thoughtmarks
          </DialogTitle>
          <DialogDescription className="text-gray-300">
            {promptReason}
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col gap-3 mt-4">
          <Button 
            onClick={handleRateApp}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            ⭐ Rate on App Store
          </Button>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={handleNotNow}
              className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-800"
            >
              Not Now
            </Button>
            <Button 
              variant="ghost" 
              onClick={handleNeverAsk}
              className="flex-1 text-gray-400 hover:bg-gray-800"
            >
              Don't Ask Again
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}