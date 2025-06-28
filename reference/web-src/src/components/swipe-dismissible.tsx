import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

interface SwipeDismissibleProps {
  children: React.ReactNode;
  isOpen: boolean;
  onDismiss: () => void;
  direction?: "y" | "x";
  threshold?: number;
  velocityThreshold?: number;
  className?: string;
}

export const SwipeDismissible = ({
  children,
  isOpen,
  onDismiss,
  direction = "y",
  threshold = 100,
  velocityThreshold = 500,
  className = "",
}: SwipeDismissibleProps) => {
  const [isDragging, setIsDragging] = useState(false);

  const variants = {
    hidden: {
      [direction]: direction === "y" ? 200 : 300,
      opacity: 0,
    },
    visible: {
      [direction]: 0,
      opacity: 1,
    },
    exit: {
      [direction]: direction === "y" ? 200 : 300,
      opacity: 0,
    },
  };

  const dragConstraints = direction === "y" 
    ? { top: 0, bottom: 0 }
    : { left: 0, right: 0 };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="swipe-dismissible"
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={variants}
          transition={{ 
            type: "spring", 
            stiffness: 300, 
            damping: 30,
            mass: 0.8
          }}
          drag={direction}
          dragConstraints={dragConstraints}
          dragElastic={0.4}
          dragMomentum={false}
          onDragStart={() => setIsDragging(true)}
          onDragEnd={(e, info) => {
            setIsDragging(false);
            const offset = direction === "y" ? info.offset.y : info.offset.x;
            const velocity = direction === "y" ? info.velocity.y : info.velocity.x;
            
            if (Math.abs(offset) > threshold || Math.abs(velocity) > velocityThreshold) {
              onDismiss();
            }
          }}
          className={`touch-none ${className}`}
          style={{
            WebkitOverflowScrolling: "touch",
            willChange: "transform",
            backfaceVisibility: "hidden",
          }}
        >
          <div 
            style={{ 
              pointerEvents: isDragging ? "none" : "auto",
              userSelect: isDragging ? "none" : "auto",
            }}
          >
            {children}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Modal variant with native iOS-style presentation
export const SwipeModal = ({
  children,
  isOpen,
  onDismiss,
  className = "",
}: Omit<SwipeDismissibleProps, "direction">) => {
  return (
    <SwipeDismissible
      isOpen={isOpen}
      onDismiss={onDismiss}
      direction="y"
      threshold={80}
      velocityThreshold={400}
      className={`fixed inset-0 bg-background z-50 rounded-t-2xl ${className}`}
    >
      <div className="h-full overflow-hidden">
        {/* iOS-style handle */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-10 h-1 bg-muted-foreground/30 rounded-full" />
        </div>
        <div className="h-full overflow-y-auto" style={{ WebkitOverflowScrolling: "touch" }}>
          {children}
        </div>
      </div>
    </SwipeDismissible>
  );
};

// Card variant for swipe-to-dismiss items
export const SwipeCard = ({
  children,
  onDismiss,
  className = "",
}: {
  children: React.ReactNode;
  onDismiss: () => void;
  className?: string;
}) => {
  const [isVisible, setIsVisible] = useState(true);

  const handleDismiss = () => {
    setIsVisible(false);
    setTimeout(onDismiss, 200);
  };

  return (
    <SwipeDismissible
      isOpen={isVisible}
      onDismiss={handleDismiss}
      direction="x"
      threshold={120}
      velocityThreshold={600}
      className={`relative ${className}`}
    >
      {children}
    </SwipeDismissible>
  );
};