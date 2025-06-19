import { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Settings } from 'lucide-react';
import { useGestureNavigation, useBackNavigation } from '@/hooks/use-gesture-navigation';
import { useLocation } from 'wouter';

interface MobilePageLayoutProps {
  children: ReactNode;
  title?: string;
  showBackButton?: boolean;
  showSettingsButton?: boolean;
  rightActions?: ReactNode;
  onBack?: () => void;
  className?: string;
  enableGestureNavigation?: boolean;
}

export function MobilePageLayout({
  children,
  title,
  showBackButton = true,
  showSettingsButton = false,
  rightActions,
  onBack,
  className = "",
  enableGestureNavigation = true
}: MobilePageLayoutProps) {
  const [, setLocation] = useLocation();
  const navigateBack = useBackNavigation();
  
  const handleBack = onBack || navigateBack;
  
  const gestureRef = useGestureNavigation({
    onSwipeRight: showBackButton ? handleBack : undefined,
    enabled: enableGestureNavigation && showBackButton,
    threshold: 100
  });

  return (
    <div 
      ref={gestureRef}
      className="full-height bg-gradient-to-br from-black via-gray-900 to-black text-white relative content-underlap"
    >
      {/* Animated gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-green-900/10 via-transparent to-blue-900/10 animate-pulse opacity-50"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-green-400/20 via-transparent to-transparent"></div>
      
      <div className="relative z-10">
        {/* Navigation Header */}
        <div className="sticky top-0 z-50 bg-gray-900/95 backdrop-blur-sm border-b border-gray-700">
          <div className="flex items-center justify-between h-16 px-4">
            {/* Left Section */}
            <div className="flex items-center space-x-3 min-w-0 flex-1">
              {showBackButton && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleBack}
                  className="text-gray-400 hover:text-white transition-colors flex-shrink-0"
                >
                  <ArrowLeft className="w-4 h-4" />
                </Button>
              )}
              {title && (
                <h1 className="text-xl font-semibold text-white truncate">
                  {title}
                </h1>
              )}
            </div>
            
            {/* Right Section */}
            <div className="flex items-center space-x-2 flex-shrink-0">
              {rightActions}
              {showSettingsButton && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setLocation("/settings")}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <Settings className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className={`ios-safe-bottom ${className}`}>
          {children}
        </div>
      </div>
    </div>
  );
}

// Standard form actions component with consistent positioning
interface FormActionsProps {
  onCancel: () => void;
  onSave: () => void;
  saveLabel?: string;
  cancelLabel?: string;
  isSaving?: boolean;
  saveDisabled?: boolean;
}

export function FormActions({
  onCancel,
  onSave,
  saveLabel = "Save",
  cancelLabel = "Cancel",
  isSaving = false,
  saveDisabled = false
}: FormActionsProps) {
  return (
    <div className="sticky bottom-0 bg-gray-900/95 backdrop-blur-sm border-t border-gray-700 p-4 ios-safe-bottom">
      <div className="flex items-center justify-end space-x-3 max-w-sm ml-auto">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="border-gray-600 text-gray-300 hover:bg-gray-800 flex-1"
        >
          {cancelLabel}
        </Button>
        <Button
          type="submit"
          onClick={onSave}
          disabled={saveDisabled || isSaving}
          className="bg-[#C6D600] text-black hover:bg-[#B8C500] disabled:opacity-50 flex-1"
        >
          {isSaving ? "Saving..." : saveLabel}
        </Button>
      </div>
    </div>
  );
}

// Quick action button for consistent styling
interface QuickActionButtonProps {
  onClick: () => void;
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'default' | 'lg';
  disabled?: boolean;
  className?: string;
}

export function QuickActionButton({
  onClick,
  children,
  variant = 'primary',
  size = 'default',
  disabled = false,
  className = ""
}: QuickActionButtonProps) {
  const baseClasses = "transition-colors font-medium rounded-lg";
  
  const variantClasses = {
    primary: "bg-[#C6D600] text-black hover:bg-[#B8C500] disabled:bg-gray-600 disabled:text-gray-400",
    secondary: "bg-gray-700 text-white hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-500",
    danger: "bg-red-600 text-white hover:bg-red-700 disabled:bg-gray-600 disabled:text-gray-400"
  };
  
  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    default: "px-4 py-2",
    lg: "px-6 py-3 text-lg"
  };
  
  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
    >
      {children}
    </Button>
  );
}