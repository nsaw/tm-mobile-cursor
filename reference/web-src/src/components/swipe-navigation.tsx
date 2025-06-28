import { useState, useRef, useEffect } from "react";
import { useLocation } from "wouter";

interface SwipeNavigationProps {
  children: React.ReactNode;
  currentPage: string;
}

const pageOrder = [
  "/dashboard",
  "/all-thoughtmarks",
  "/ai-tools",
  "/all-bins",
  "/account"
];

export function SwipeNavigation({ children, currentPage }: SwipeNavigationProps) {
  const [location, setLocation] = useLocation();
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [currentX, setCurrentX] = useState(0);
  const [translateX, setTranslateX] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentIndex = pageOrder.indexOf(currentPage);
  const threshold = 50; // Minimum swipe distance to trigger navigation

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setStartX(e.touches[0].clientX);
    setCurrentX(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    
    const x = e.touches[0].clientX;
    setCurrentX(x);
    const diff = x - startX;
    
    // Limit the drag distance
    const maxDrag = 100;
    const limitedDiff = Math.max(-maxDrag, Math.min(maxDrag, diff));
    setTranslateX(limitedDiff);
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    
    const diff = currentX - startX;
    
    if (Math.abs(diff) > threshold) {
      if (diff > 0 && currentIndex > 0) {
        // Swipe right - go to previous page
        const prevPage = pageOrder[currentIndex - 1];
        setLocation(prevPage);
      } else if (diff < 0 && currentIndex < pageOrder.length - 1) {
        // Swipe left - go to next page
        const nextPage = pageOrder[currentIndex + 1];
        // Skip AI tools if not premium user
        if (nextPage === "/ai-tools") {
          const nextNextPage = pageOrder[currentIndex + 2];
          if (nextNextPage) {
            setLocation(nextNextPage);
          }
        } else {
          setLocation(nextPage);
        }
      }
    }
    
    // Reset state
    setIsDragging(false);
    setTranslateX(0);
    setStartX(0);
    setCurrentX(0);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.clientX);
    setCurrentX(e.clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    
    const x = e.clientX;
    setCurrentX(x);
    const diff = x - startX;
    
    // Limit the drag distance
    const maxDrag = 100;
    const limitedDiff = Math.max(-maxDrag, Math.min(maxDrag, diff));
    setTranslateX(limitedDiff);
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    
    const diff = currentX - startX;
    
    if (Math.abs(diff) > threshold) {
      if (diff > 0 && currentIndex > 0) {
        // Swipe right - go to previous page
        const prevPage = pageOrder[currentIndex - 1];
        setLocation(prevPage);
      } else if (diff < 0 && currentIndex < pageOrder.length - 1) {
        // Swipe left - go to next page
        const nextPage = pageOrder[currentIndex + 1];
        // Skip AI tools if not premium user
        if (nextPage === "/ai-tools") {
          const nextNextPage = pageOrder[currentIndex + 2];
          if (nextNextPage) {
            setLocation(nextNextPage);
          }
        } else {
          setLocation(nextPage);
        }
      }
    }
    
    // Reset state
    setIsDragging(false);
    setTranslateX(0);
    setStartX(0);
    setCurrentX(0);
  };

  useEffect(() => {
    const handleGlobalMouseUp = () => {
      if (isDragging) {
        handleMouseUp();
      }
    };

    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const x = e.clientX;
        setCurrentX(x);
        const diff = x - startX;
        
        const maxDrag = 100;
        const limitedDiff = Math.max(-maxDrag, Math.min(maxDrag, diff));
        setTranslateX(limitedDiff);
      }
    };

    if (isDragging) {
      document.addEventListener('mouseup', handleGlobalMouseUp);
      document.addEventListener('mousemove', handleGlobalMouseMove);
    }

    return () => {
      document.removeEventListener('mouseup', handleGlobalMouseUp);
      document.removeEventListener('mousemove', handleGlobalMouseMove);
    };
  }, [isDragging, startX, currentX]);

  return (
    <>
      <div
        ref={containerRef}
        className="touch-pan-y select-none relative"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        style={{
          transform: `translateX(${translateX}px)`,
          transition: isDragging ? 'none' : 'transform 0.3s ease-out',
          cursor: isDragging ? 'grabbing' : 'grab'
        }}
      >
        {children}
      </div>
      
      {/* Navigation indicators - positioned independently */}
      <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 z-50 pointer-events-none">
        <div className="flex space-x-2 bg-gray-900/80 backdrop-blur-sm rounded-full px-3 py-2">
          {pageOrder.map((page, index) => {
            // Skip AI tools indicator if not premium
            if (page === "/ai-tools") return null;
            
            return (
              <div
                key={page}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentIndex ? 'bg-cyan-400' : 'bg-gray-600'
                }`}
              />
            );
          })}
        </div>
      </div>
    </>
  );
}