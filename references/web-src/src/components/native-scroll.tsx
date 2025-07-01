import { forwardRef, HTMLAttributes } from "react";
import { motion, MotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

interface NativeScrollProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  bounces?: boolean;
  overscrollBehavior?: "auto" | "contain" | "none";
}

// Native iOS-style scrolling container
export const NativeScroll = forwardRef<HTMLDivElement, NativeScrollProps>(
  ({ children, className, bounces = true, overscrollBehavior = "auto", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("overflow-auto", className)}
        style={{
          WebkitOverflowScrolling: "touch",
          scrollBehavior: "smooth",
          overscrollBehavior,
          // iOS momentum scrolling
          ...(bounces && {
            WebkitScrollbar: {
              display: "none",
            },
          }),
        }}
        {...props}
      >
        {children}
      </div>
    );
  }
);

NativeScroll.displayName = "NativeScroll";

// Smooth motion scroll container with spring physics
interface MotionScrollProps extends NativeScrollProps, MotionProps {
  springConfig?: {
    stiffness?: number;
    damping?: number;
    mass?: number;
  };
}

export const MotionScroll = forwardRef<HTMLDivElement, MotionScrollProps>(
  ({ 
    children, 
    className, 
    bounces = true, 
    overscrollBehavior = "auto",
    springConfig = { stiffness: 300, damping: 30, mass: 0.8 },
    ...motionProps 
  }, ref) => {
    return (
      <motion.div
        ref={ref}
        className={cn("overflow-auto", className)}
        style={{
          WebkitOverflowScrolling: "touch",
          scrollBehavior: "smooth",
          overscrollBehavior,
          willChange: "transform",
          backfaceVisibility: "hidden",
        }}
        transition={{ type: "spring", ...springConfig }}
        {...motionProps}
      >
        {children}
      </motion.div>
    );
  }
);

MotionScroll.displayName = "MotionScroll";

// Pull-to-refresh container
interface PullToRefreshProps extends NativeScrollProps {
  onRefresh: () => Promise<void> | void;
  refreshThreshold?: number;
  isRefreshing?: boolean;
  pullIndicator?: React.ReactNode;
}

export const PullToRefresh = forwardRef<HTMLDivElement, PullToRefreshProps>(
  ({ 
    children, 
    className,
    onRefresh,
    refreshThreshold = 80,
    isRefreshing = false,
    pullIndicator,
    ...props 
  }, ref) => {
    return (
      <motion.div
        ref={ref}
        className={cn("relative overflow-auto", className)}
        style={{
          WebkitOverflowScrolling: "touch",
          scrollBehavior: "smooth",
          overscrollBehavior: "auto",
        }}
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={0.2}
        onDragEnd={async (e, info) => {
          if (info.offset.y > refreshThreshold && !isRefreshing) {
            await onRefresh();
          }
        }}
        {...props}
      >
        {pullIndicator && (
          <motion.div
            className="absolute top-0 left-0 right-0 flex justify-center items-center h-16 -mt-16"
            animate={{ y: isRefreshing ? 16 : 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {pullIndicator}
          </motion.div>
        )}
        {children}
      </motion.div>
    );
  }
);

PullToRefresh.displayName = "PullToRefresh";