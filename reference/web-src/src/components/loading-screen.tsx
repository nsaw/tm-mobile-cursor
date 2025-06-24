import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Lottie from "lottie-react";
import brainAnimation from "../assets/animations/brain2lottie.json";

// Simple animated neural pulse fallback
const NeuralPulse = () => (
  <div
    style={{
      width: 110,
      height: 110,
      borderRadius: "50%",
      background: "radial-gradient(circle at 50% 45%, #393e46 65%, #23272b 100%)",
      boxShadow: "0 0 50px 10px #282a2d, 0 0 0 0 #2225",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      opacity: 0.5,
      animation: "neuralPulse 1.2s ease-in-out infinite alternate"
    }}
  >
    {/* Optionally, tiny neuron branches or dots can be added here for flair */}
    <style>{`
      @keyframes neuralPulse {
        from { transform: scale(1); box-shadow: 0 0 36px 4px #2225; opacity: 0.5; }
        to   { transform: scale(1.08); box-shadow: 0 0 60px 24px #393e46; opacity: 0.95; }
      }
    `}</style>
  </div>
);

const ThinkingLoader = ({ animationData }: { animationData: any }) => (
  <div
    style={{
      position: "fixed",
      zIndex: 999999, // Increased z-index to ensure it covers navigation
      inset: 0,
      background: "#181b1c",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      width: "100vw",
      height: "100vh",
      minHeight: "100svh", // iOS 16+ supports small viewport height including under nav bar
      minWidth: "100vw",
      overscrollBehavior: "none",
      touchAction: "none",
      WebkitTapHighlightColor: "transparent",
    }}
  >
    <div
      style={{
        width: 180,
        height: 180,
        marginBottom: 8,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        filter: "drop-shadow(0 0 12px #21242a)",
      }}
    >
      {animationData ? (
        <Lottie
          animationData={animationData}
          style={{
            width: "100%",
            height: "100%",
          }}
          loop={true}
          autoplay={true}
        />
      ) : (
        <NeuralPulse />
      )}
    </div>
    <div
      style={{
        fontFamily: "'Ubuntu', sans-serif",
        color: "#393e46",
        fontWeight: 400,
        fontSize: 22,
        textAlign: "center",
        letterSpacing: "0.01em",
        opacity: 0.82,
        textShadow: "0 2px 6px #141518",
        userSelect: "none",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
        marginTop: 2,
      }}
    >
      let me think about that…
    </div>
  </div>
);

interface LoadingScreenProps {
  isVisible: boolean;
  onComplete?: () => void;
}

export function LoadingScreen({ isVisible, onComplete }: LoadingScreenProps) {
  const [animationData, setAnimationData] = useState<any>(brainAnimation);

  useEffect(() => {
    if (isVisible) {
      const completeTimer = setTimeout(() => {
        onComplete?.();
      }, 1200);
      return () => clearTimeout(completeTimer);
    }
  }, [isVisible, onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 999999,
            pointerEvents: "all"
          }}
        >
          <ThinkingLoader animationData={animationData} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}