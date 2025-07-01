import { ChevronLeft } from "lucide-react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface BackButtonProps {
  fallback?: "/" | "none" | string;
  variant?: "icon" | "label";
  label?: string;
  className?: string;
}

export function BackButton({ 
  fallback = "/", 
  variant = "icon", 
  label = "Back",
  className 
}: BackButtonProps) {
  const [, setLocation] = useLocation();

  const handleBack = () => {
    // Check if browser history is available
    if (window.history.length > 2) {
      window.history.back();
    } else if (fallback !== "none") {
      setLocation(fallback);
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleBack}
      className={cn(
        "back-button flex items-center gap-2 font-medium text-gray-400 hover:text-white transition-colors p-2 h-auto",
        className
      )}
    >
      <ChevronLeft className="w-4 h-4" />
      {variant === "label" && <span>{label}</span>}
    </Button>
  );
}

// Context-specific back button variants
export function SettingsBackButton({ className }: { className?: string }) {
  return (
    <BackButton 
      fallback="/settings" 
      variant="label" 
      label="Settings"
      className={className}
    />
  );
}

export function AIBackButton({ className }: { className?: string }) {
  return (
    <BackButton 
      fallback="/ai" 
      variant="icon"
      className={className}
    />
  );
}

export function BinsBackButton({ className }: { className?: string }) {
  return (
    <BackButton 
      fallback="/bins" 
      variant="icon"
      className={className}
    />
  );
}

export function ContentBackButton({ className }: { className?: string }) {
  return (
    <BackButton 
      fallback="/content" 
      variant="icon"
      className={className}
    />
  );
}