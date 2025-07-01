import { ArrowLeft, Check, Crown, Smartphone, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";

export default function Subscribe() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const handleAppStoreRedirect = () => {
    toast({
      title: "Redirecting to App Store",
      description: "Complete your subscription in the App Store for secure payments.",
    });
    
    // In production, this would redirect to the actual App Store
    window.open('https://apps.apple.com/app/thoughtmarks', '_blank');
  };

  return (
    <div className="full-height bg-black text-white">
      {/* Header */}
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setLocation("/dashboard")}
            className="text-gray-400 hover:text-white"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-bold tracking-wide">UPGRADE TO PREMIUM</h1>
          <div className="w-10" />
        </div>
      </div>

      <div className="p-6 max-w-2xl mx-auto space-y-8">
        {/* Premium Features */}
        <Card className="bg-gradient-to-br from-yellow-900/20 to-orange-900/20 border-yellow-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[#C6D600]">
              <Crown className="w-6 h-6" />
              Thoughtmarks Premium
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3">
              <div className="flex items-center gap-3">
                <Check className="w-5 h-5 text-[#C6D600] flex-shrink-0" />
                <span>Unlimited thoughtmarks and bins</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="w-5 h-5 text-[#C6D600] flex-shrink-0" />
                <span>Advanced AI insights and connections</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="w-5 h-5 text-[#C6D600] flex-shrink-0" />
                <span>Voice-to-text with unlimited recordings</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="w-5 h-5 text-[#C6D600] flex-shrink-0" />
                <span>Priority support and feature requests</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="w-5 h-5 text-[#C6D600] flex-shrink-0" />
                <span>Export and backup capabilities</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="w-5 h-5 text-[#C6D600] flex-shrink-0" />
                <span>Collaboration and sharing features</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* App Store Subscription */}
        <Card className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 border-blue-800">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Smartphone className="w-6 h-6 text-blue-400" />
              <h3 className="text-lg font-semibold text-white">Secure App Store Subscription</h3>
            </div>
            <p className="text-gray-300 mb-6">
              Subscribe through the App Store for the most secure payment experience with Apple's trusted infrastructure.
            </p>
            
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-2 text-sm text-blue-200">
                <Check className="w-4 h-4" />
                <span>Cancel anytime in App Store settings</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-blue-200">
                <Check className="w-4 h-4" />
                <span>Family sharing available</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-blue-200">
                <Check className="w-4 h-4" />
                <span>Protected by Apple's privacy policies</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-blue-200">
                <Check className="w-4 h-4" />
                <span>Automatic syncing across all your devices</span>
              </div>
            </div>
            
            <Button 
              onClick={handleAppStoreRedirect}
              className="w-full bg-[#C6D600] text-black hover:bg-[#B5C500] py-3 text-lg font-semibold"
            >
              <Crown className="w-5 h-5 mr-2" />
              Subscribe via App Store
            </Button>
            
            <p className="text-xs text-gray-500 text-center mt-4">
              Subscription will be charged to your App Store account and will automatically renew unless cancelled.
            </p>
          </CardContent>
        </Card>

        {/* Pricing Info */}
        <div className="text-center space-y-2">
          <p className="text-xl font-bold text-[#C6D600]">$4.99/month</p>
          <p className="text-sm text-gray-400">7-day free trial • Cancel anytime</p>
        </div>

        {/* Already Premium */}
        <div className="text-center">
          <Button
            variant="ghost"
            onClick={() => setLocation("/dashboard")}
            className="text-gray-400 hover:text-white"
          >
            Already have Premium? Return to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}