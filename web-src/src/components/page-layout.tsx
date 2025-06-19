import { ReactNode, useRef, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Plus, ArrowLeft, Settings } from "lucide-react";

interface PageLayoutProps {
  children: ReactNode;
  title?: string;
  showBackButton?: boolean;
  showNewButton?: boolean;
  className?: string;
}

export function PageLayout({ 
  children, 
  title, 
  showBackButton = false, 
  showNewButton = true,
  className = ""
}: PageLayoutProps) {
  const [, setLocation] = useLocation();
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number>(0);
  const touchStartY = useRef<number>(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !showBackButton) return;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartX.current = e.touches[0].clientX;
      touchStartY.current = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const touchEndX = e.changedTouches[0].clientX;
      const touchEndY = e.changedTouches[0].clientY;
      
      const deltaX = touchEndX - touchStartX.current;
      const deltaY = touchEndY - touchStartY.current;
      
      // Check if this is a horizontal swipe (more horizontal than vertical)
      const isHorizontalSwipe = Math.abs(deltaX) > Math.abs(deltaY);
      
      // Check if it's a rightward swipe with sufficient distance (at least 100px)
      const isRightSwipe = deltaX > 100;
      
      // Only trigger navigation if it's a clear rightward swipe
      if (isHorizontalSwipe && isRightSwipe) {
        setLocation("/");
      }
    };

    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    container.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, [showBackButton]);

  return (
    <div 
      ref={containerRef}
      className="full-height bg-gradient-to-br from-black via-gray-900 to-black text-white relative content-underlap"
    >
      {/* Animated gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-green-900/10 via-transparent to-blue-900/10 animate-pulse opacity-50"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-green-400/20 via-transparent to-transparent"></div>
      
      <div className="relative z-10">
        {/* Navigation Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-800/50 backdrop-blur-sm bg-black/20">
          <div className="flex items-center space-x-3">
            {showBackButton && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setLocation("/")}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
            )}
            {title && (
              <h1 className="text-2xl font-black text-white tracking-tight uppercase">
                {title}
              </h1>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLocation("/settings")}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Page Content */}
        <div className={`p-4 ios-safe-bottom ${className}`}>
          {children}
        </div>

        {/* Floating Action Button - Now handled by FloatingNewButton component */}
      </div>
    </div>
  );
}