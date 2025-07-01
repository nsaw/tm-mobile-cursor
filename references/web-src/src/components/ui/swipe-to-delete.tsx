import { useState, useRef, useEffect } from "react";
import { Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface SwipeToDeleteProps {
  children: React.ReactNode;
  onDelete: () => void;
  deleteThreshold?: number;
  className?: string;
}

export function SwipeToDelete({ 
  children, 
  onDelete, 
  deleteThreshold = 120,
  className 
}: SwipeToDeleteProps) {
  const [translateX, setTranslateX] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const startX = useRef(0);
  const currentX = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    
    currentX.current = e.touches[0].clientX;
    const deltaX = currentX.current - startX.current;
    
    // Only allow left swipe (negative deltaX)
    if (deltaX < 0) {
      setTranslateX(Math.max(deltaX, -deleteThreshold - 20));
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    
    if (Math.abs(translateX) >= deleteThreshold) {
      setIsDeleting(true);
      setTranslateX(-deleteThreshold);
    } else {
      setTranslateX(0);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    startX.current = e.clientX;
    setIsDragging(true);
    e.preventDefault();
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    
    currentX.current = e.clientX;
    const deltaX = currentX.current - startX.current;
    
    // Only allow left swipe (negative deltaX)
    if (deltaX < 0) {
      setTranslateX(Math.max(deltaX, -deleteThreshold - 20));
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    
    if (Math.abs(translateX) >= deleteThreshold) {
      setIsDeleting(true);
      setTranslateX(-deleteThreshold);
    } else {
      setTranslateX(0);
    }
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, translateX]);

  const handleDeleteClick = () => {
    onDelete();
    setTranslateX(0);
    setIsDeleting(false);
  };

  const handleCancel = () => {
    setTranslateX(0);
    setIsDeleting(false);
  };

  return (
    <div 
      ref={containerRef}
      className={cn("relative overflow-hidden touch-pan-y", className)}
      onClick={isDeleting ? handleCancel : undefined}
    >
      {/* Delete action background */}
      <div 
        className="absolute inset-y-0 right-0 bg-red-600 flex items-center justify-center transition-all duration-200"
        style={{ 
          width: Math.min(Math.abs(translateX), deleteThreshold),
          opacity: Math.abs(translateX) / deleteThreshold
        }}
      >
        <Trash2 className="w-5 h-5 text-white" />
      </div>

      {/* Main content */}
      <div
        className="transition-transform duration-200 ease-out select-none"
        style={{ 
          transform: `translateX(${translateX}px)`,
          transition: isDragging ? 'none' : 'transform 0.2s ease-out'
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
      >
        {children}
      </div>

      {/* Delete button overlay */}
      {isDeleting && (
        <div className="absolute inset-0 bg-red-600/20 flex items-center justify-end pr-4">
          <button
            onClick={handleDeleteClick}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}