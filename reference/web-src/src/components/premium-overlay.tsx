import { Crown, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useLocation } from "wouter";

interface PremiumOverlayProps {
  feature: string;
  description?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
  showButton?: boolean;
}

export function PremiumOverlay({ 
  feature, 
  description, 
  className = "", 
  size = "md",
  showButton = true 
}: PremiumOverlayProps) {
  const [, setLocation] = useLocation();

  const sizes = {
    sm: "text-xs p-2",
    md: "text-sm p-3", 
    lg: "text-base p-4"
  };

  return (
    <div className={`absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-10 rounded-lg ${className}`}>
      <Card className="bg-gradient-to-br from-orange-500/90 to-yellow-500/90 border-orange-400 max-w-xs mx-2">
        <CardContent className={`text-center ${sizes[size]}`}>
          <div className="flex items-center justify-center mb-2">
            <Crown className="w-6 h-6 text-white mr-2" />
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <h3 className="font-semibold text-white mb-1">Premium Feature</h3>
          <p className="text-white/90 text-xs mb-2">
            {description || `Unlock ${feature} with Premium`}
          </p>
          {showButton && (
            <Button
              size="sm"
              onClick={() => setLocation("/premium")}
              className="bg-white text-orange-600 hover:bg-gray-100 text-xs font-medium"
            >
              <Crown className="w-3 h-3 mr-1" />
              Upgrade Now
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

interface PremiumFeatureWrapperProps {
  isPremium: boolean;
  feature: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  overlaySize?: "sm" | "md" | "lg";
}

export function PremiumFeatureWrapper({ 
  isPremium, 
  feature, 
  description, 
  children, 
  className = "",
  overlaySize = "md"
}: PremiumFeatureWrapperProps) {
  return (
    <div className={`relative ${className}`}>
      {children}
      {!isPremium && (
        <PremiumOverlay 
          feature={feature} 
          description={description}
          size={overlaySize}
        />
      )}
    </div>
  );
}