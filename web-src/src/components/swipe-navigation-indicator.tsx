import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface SwipeNavigationIndicatorProps {
  direction: 'left' | 'right' | null;
  progress: number;
  canNavigate: boolean;
}

export function SwipeNavigationIndicator({ 
  direction, 
  progress, 
  canNavigate 
}: SwipeNavigationIndicatorProps) {
  if (!direction || !canNavigate) return null;

  const isLeft = direction === 'left';
  const opacity = Math.min(progress * 2, 0.8);
  const scale = 0.8 + (progress * 0.4);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity, scale }}
        exit={{ opacity: 0, scale: 0.5 }}
        className={`fixed top-1/2 -translate-y-1/2 z-50 pointer-events-none ${
          isLeft ? 'left-4' : 'right-4'
        }`}
      >
        <div className="bg-white/10 backdrop-blur-md rounded-full p-3 border border-white/20">
          {isLeft ? (
            <ChevronLeft className="w-6 h-6 text-white" />
          ) : (
            <ChevronRight className="w-6 h-6 text-white" />
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}