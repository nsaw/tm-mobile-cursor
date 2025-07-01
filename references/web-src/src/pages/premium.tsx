import { PageLayout } from "@/components/page-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "wouter";
import { Crown, Check, Brain, Zap, Star, ArrowRight } from "lucide-react";

export default function Premium() {
  const [, setLocation] = useLocation();

  return (
    <PageLayout title="Premium" showBackButton={true}>
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <div className="bg-gradient-to-r from-yellow-500 to-orange-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
            <Crown className="w-8 h-8 text-black" />
          </div>
          <h1 className="text-3xl font-bold text-white">Thoughtmarks Premium</h1>
          <p className="text-gray-400">Unlock the full power of AI-driven knowledge management</p>
        </div>

        {/* AI Tools Highlight */}
        <Card className="bg-gradient-to-br from-purple-950 to-blue-950 border-purple-500/30">
          <CardHeader>
            <CardTitle className="flex items-center text-white">
              <Brain className="w-6 h-6 mr-3 text-purple-400" />
              AI Tools Suite
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center space-x-3">
              <Check className="w-5 h-5 text-green-400" />
              <span className="text-gray-300">Smart Insights & Pattern Recognition</span>
            </div>
            <div className="flex items-center space-x-3">
              <Check className="w-5 h-5 text-green-400" />
              <span className="text-gray-300">Intelligent Auto-Categorization</span>
            </div>
            <div className="flex items-center space-x-3">
              <Check className="w-5 h-5 text-green-400" />
              <span className="text-gray-300">Learning Resource Recommendations</span>
            </div>
            <div className="flex items-center space-x-3">
              <Check className="w-5 h-5 text-green-400" />
              <span className="text-gray-300">Smart Sorting & Organization</span>
            </div>
          </CardContent>
        </Card>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 gap-4">
          <Card className="bg-gray-900 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center text-white">
                <Zap className="w-5 h-5 mr-2 text-yellow-500" />
                Enhanced Features
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-green-400" />
                <span className="text-gray-300 text-sm">Unlimited thoughtmarks</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-green-400" />
                <span className="text-gray-300 text-sm">Cross-device sync</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-green-400" />
                <span className="text-gray-300 text-sm">Priority support</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center text-white">
                <Star className="w-5 h-5 mr-2 text-purple-500" />
                Premium Only
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-green-400" />
                <span className="text-gray-300 text-sm">Advanced analytics</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-green-400" />
                <span className="text-gray-300 text-sm">Custom themes</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-green-400" />
                <span className="text-gray-300 text-sm">Export capabilities</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pricing */}
        <Card className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/30">
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <div>
                <div className="text-3xl font-bold text-white">$9.99</div>
                <div className="text-gray-400">per month</div>
              </div>
              <Badge className="bg-yellow-500 text-black">Most Popular</Badge>
            </div>
          </CardContent>
        </Card>

        {/* CTA Buttons */}
        <div className="space-y-3">
          <Button
            onClick={() => {
              // For iOS WebView, this will trigger native App Store subscription
              if ((window as any).webkit?.messageHandlers?.subscription) {
                (window as any).webkit.messageHandlers.subscription.postMessage({
                  action: 'subscribe',
                  plan: 'monthly'
                });
              } else {
                // Fallback for web - redirect to App Store or show instructions
                window.open('https://apps.apple.com/app/thoughtmarks', '_blank');
              }
            }}
            className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-black font-semibold py-4 text-lg"
          >
            <Crown className="w-5 h-5 mr-2" />
            Subscribe via App Store
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
          
          <Button
            onClick={() => setLocation("/")}
            variant="outline"
            className="w-full border-gray-600 text-gray-300 hover:bg-gray-800"
          >
            Continue with Free
          </Button>
        </div>

        {/* Money Back Guarantee */}
        <div className="text-center text-sm text-gray-400">
          <p>30-day money-back guarantee • Cancel anytime</p>
        </div>
      </div>
    </PageLayout>
  );
}