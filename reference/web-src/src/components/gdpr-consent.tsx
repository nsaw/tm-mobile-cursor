import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Info } from "lucide-react";

interface GDPRConsentProps {
  onConsent: (consents: ConsentData) => void;
  isLoading?: boolean;
}

export interface ConsentData {
  essential: boolean;
  analytics: boolean;
  marketing: boolean;
  dataProcessing: boolean;
}

export function GDPRConsent({ onConsent, isLoading = false }: GDPRConsentProps) {
  const [consents, setConsents] = useState<ConsentData>({
    essential: true, // Required for app functionality
    analytics: false,
    marketing: false,
    dataProcessing: true, // Required for thoughtmarks
  });

  const handleConsentChange = (type: keyof ConsentData, checked: boolean) => {
    setConsents(prev => ({
      ...prev,
      [type]: checked
    }));
  };

  const handleSubmit = () => {
    onConsent(consents);
  };

  const canProceed = consents.essential && consents.dataProcessing;

  return (
    <Card className="w-full max-w-2xl bg-black border-gray-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-[#C6D600]">
          <Shield className="w-5 h-5" />
          Privacy & Data Protection
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-sm text-gray-300">
          <p className="mb-4">
            We respect your privacy and comply with GDPR regulations. Please review and consent to how we handle your data:
          </p>
        </div>

        <div className="space-y-4">
          {/* Essential - Required */}
          <div className="flex items-start space-x-3 p-3 bg-gray-900 rounded-lg">
            <Checkbox
              id="essential"
              checked={consents.essential}
              disabled={true}
              className="mt-0.5"
            />
            <div className="flex-1">
              <label htmlFor="essential" className="text-sm font-medium text-white cursor-pointer">
                Essential Functionality (Required)
              </label>
              <p className="text-xs text-gray-400 mt-1">
                Necessary for authentication, security, and core app features. Cannot be disabled.
              </p>
            </div>
          </div>

          {/* Data Processing - Required for thoughtmarks */}
          <div className="flex items-start space-x-3 p-3 bg-gray-900 rounded-lg">
            <Checkbox
              id="dataProcessing"
              checked={consents.dataProcessing}
              disabled={true}
              className="mt-0.5"
            />
            <div className="flex-1">
              <label htmlFor="dataProcessing" className="text-sm font-medium text-white cursor-pointer">
                Personal Data Processing (Required)
              </label>
              <p className="text-xs text-gray-400 mt-1">
                Store and process your thoughtmarks, notes, and organizational data. Required for app functionality.
              </p>
            </div>
          </div>

          {/* Analytics - Optional */}
          <div className="flex items-start space-x-3 p-3 bg-gray-900 rounded-lg">
            <Checkbox
              id="analytics"
              checked={consents.analytics}
              onCheckedChange={(checked) => handleConsentChange('analytics', checked as boolean)}
              className="mt-0.5"
            />
            <div className="flex-1">
              <label htmlFor="analytics" className="text-sm font-medium text-white cursor-pointer">
                Analytics & Performance (Optional)
              </label>
              <p className="text-xs text-gray-400 mt-1">
                Help us improve the app by collecting anonymous usage statistics and performance data.
              </p>
            </div>
          </div>

          {/* Marketing - Optional */}
          <div className="flex items-start space-x-3 p-3 bg-gray-900 rounded-lg">
            <Checkbox
              id="marketing"
              checked={consents.marketing}
              onCheckedChange={(checked) => handleConsentChange('marketing', checked as boolean)}
              className="mt-0.5"
            />
            <div className="flex-1">
              <label htmlFor="marketing" className="text-sm font-medium text-white cursor-pointer">
                Marketing Communications (Optional)
              </label>
              <p className="text-xs text-gray-400 mt-1">
                Receive updates about new features, tips, and product announcements via email.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-blue-900/20 border border-blue-800 rounded-lg p-3">
          <div className="flex items-start gap-2">
            <Info className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
            <div className="text-xs text-blue-200">
              <p className="font-medium mb-1">Your Rights</p>
              <p>
                You can update these preferences anytime in Settings. You have the right to access, 
                rectify, delete, or export your data. Contact us at privacy@thoughtmarks.app for requests.
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            onClick={handleSubmit}
            disabled={!canProceed || isLoading}
            className="flex-1 bg-[#C6D600] text-black hover:bg-[#B5C500]"
          >
            {isLoading ? "Creating Account..." : "Continue"}
          </Button>
        </div>

        <p className="text-xs text-gray-500 text-center">
          By continuing, you agree to our{" "}
          <a href="/privacy" className="text-[#C6D600] hover:underline">Privacy Policy</a>{" "}
          and{" "}
          <a href="/terms" className="text-[#C6D600] hover:underline">Terms of Service</a>
        </p>
      </CardContent>
    </Card>
  );
}