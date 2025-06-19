import { motion, PanInfo, useMotionValue, useTransform } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

interface SwipeGestureProps {
  children: React.ReactNode;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  threshold?: number;
  velocityThreshold?: number;
  className?: string;
  disabled?: boolean;
}

export const SwipeGesture = ({
  children,
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  threshold = 50,
  velocityThreshold = 300,
  className,
  disabled = false,
}: SwipeGestureProps) => {
  const constraintsRef = useRef(null);

  const handleDragEnd = (event: any, info: PanInfo) => {
    if (disabled) return;

    const { offset, velocity } = info;
    const { x, y } = offset;
    const { x: vx, y: vy } = velocity;

    // Horizontal swipes
    if (Math.abs(x) > Math.abs(y)) {
      if (x > threshold || vx > velocityThreshold) {
        onSwipeRight?.();
      } else if (x < -threshold || vx < -velocityThreshold) {
        onSwipeLeft?.();
      }
    }
    // Vertical swipes
    else {
      if (y > threshold || vy > velocityThreshold) {
        onSwipeDown?.();
      } else if (y < -threshold || vy < -velocityThreshold) {
        onSwipeUp?.();
      }
    }
  };

  return (
    <motion.div
      ref={constraintsRef}
      drag={!disabled}
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={0.1}
      dragMomentum={false}
      onDragEnd={handleDragEnd}
      className={cn("touch-none", className)}
      style={{
        willChange: "transform",
        backfaceVisibility: "hidden",
      }}
    >
      {children}
    </motion.div>
  );
};

// Tab swipe navigation
interface TabSwipeProps {
  activeTab: number;
  onTabChange: (index: number) => void;
  children: React.ReactNode[];
  className?: string;
}

export const TabSwipe = ({ activeTab, onTabChange, children, className }: TabSwipeProps) => {
  const x = useMotionValue(0);
  const background = useTransform(
    x,
    [-100, 0, 100],
    ["rgba(0,0,0,0.1)", "rgba(0,0,0,0)", "rgba(0,0,0,0.1)"]
  );

  const handleDragEnd = (event: any, info: PanInfo) => {
    const { offset, velocity } = info;
    const threshold = 50;
    const velocityThreshold = 300;

    if (offset.x > threshold || velocity.x > velocityThreshold) {
      // Swipe right - previous tab
      if (activeTab > 0) {
        onTabChange(activeTab - 1);
      }
    } else if (offset.x < -threshold || velocity.x < -velocityThreshold) {
      // Swipe left - next tab
      if (activeTab < children.length - 1) {
        onTabChange(activeTab + 1);
      }
    }
  };

  return (
    <motion.div
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.2}
      onDragEnd={handleDragEnd}
      style={{ 
        x,
        background,
        WebkitOverflowScrolling: "touch",
      }}
      className={cn("relative overflow-hidden touch-none", className)}
    >
      <motion.div
        animate={{ x: `-${activeTab * 100}%` }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="flex w-full"
        style={{ width: `${children.length * 100}%` }}
      >
        {children.map((child, index) => (
          <div key={index} className="w-full flex-shrink-0">
            {child}
          </div>
        ))}
      </motion.div>
    </motion.div>
  );
};

// Pull to refresh with visual feedback
interface PullToRefreshIndicatorProps {
  progress: number;
  isRefreshing: boolean;
}

export const PullToRefreshIndicator = ({ progress, isRefreshing }: PullToRefreshIndicatorProps) => {
  return (
    <motion.div
      className="flex items-center justify-center h-16"
      animate={{ opacity: progress > 0 ? 1 : 0 }}
      transition={{ duration: 0.2 }}
    >
      <motion.div
        className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full"
        animate={{ rotate: isRefreshing ? 360 : progress * 180 }}
        transition={{
          duration: isRefreshing ? 1 : 0,
          repeat: isRefreshing ? Infinity : 0,
          ease: "linear",
        }}
      />
    </motion.div>
  );
};

// Long press gesture
interface LongPressProps {
  children: React.ReactNode;
  onLongPress: () => void;
  onPress?: () => void;
  duration?: number;
  className?: string;
}

export const LongPress = ({ 
  children, 
  onLongPress, 
  onPress,
  duration = 500,
  className 
}: LongPressProps) => {
  const [isPressed, setIsPressed] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const handlePointerDown = () => {
    setIsPressed(true);
    timeoutRef.current = setTimeout(() => {
      onLongPress();
      setIsPressed(false);
    }, duration);
  };

  const handlePointerUp = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      if (isPressed && onPress) {
        onPress();
      }
    }
    setIsPressed(false);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <motion.div
      className={cn("touch-none select-none", className)}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      whileTap={{ scale: 0.98 }}
      animate={{ scale: isPressed ? 0.96 : 1 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
    >
      {children}
    </motion.div>
  );
};

// Haptic feedback hook for iOS
export const useHapticFeedback = () => {
  const triggerImpact = (style: "light" | "medium" | "heavy" = "medium") => {
    if (typeof window !== "undefined" && "navigator" in window) {
      // iOS haptic feedback via webkit
      try {
        (window as any).webkit?.messageHandlers?.hapticFeedback?.postMessage({ style });
      } catch (e) {
        // Fallback for web - vibration API
        if ("vibrate" in navigator) {
          const patterns = {
            light: [10],
            medium: [20],
            heavy: [30],
          };
          navigator.vibrate(patterns[style]);
        }
      }
    }
  };

  const triggerSelection = () => {
    try {
      (window as any).webkit?.messageHandlers?.hapticFeedback?.postMessage({ type: "selection" });
    } catch (e) {
      if ("vibrate" in navigator) {
        navigator.vibrate([5]);
      }
    }
  };

  const triggerNotification = (type: "success" | "warning" | "error" = "success") => {
    try {
      (window as any).webkit?.messageHandlers?.hapticFeedback?.postMessage({ type: "notification", style: type });
    } catch (e) {
      if ("vibrate" in navigator) {
        const patterns = {
          success: [10, 50, 10],
          warning: [20, 100, 20],
          error: [50, 200, 50],
        };
        navigator.vibrate(patterns[type]);
      }
    }
  };

  return { triggerImpact, triggerSelection, triggerNotification };
};