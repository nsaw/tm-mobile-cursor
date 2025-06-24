import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { X, ArrowRight, ArrowLeft, Mic, Smartphone, Settings, Sparkles, Zap, Brain, Search } from "lucide-react";
import { SiriShortcutGenerator } from "@/lib/siri-shortcuts";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";

interface OnboardingTutorialProps {
  isOpen: boolean;
  onClose: () => void;
}

interface TooltipStep {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  action?: string;
  target?: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  interactive?: boolean;
  highlight?: boolean;
  allowSkip?: boolean;
}

const tutorialSteps: TooltipStep[] = [
  {
    id: 1,
    title: "Welcome to Thoughtmarks!",
    description: "Your personal knowledge management system for capturing thoughts without breaking flow state.",
    icon: <Brain className="w-6 h-6 text-violet-400" />,
    interactive: true,
  },
  {
    id: 2,
    title: "Voice to Thoughtmark",
    description: "Quickly capture ideas using voice input. Perfect for when you're in the zone and don't want to type.",
    icon: <Mic className="w-6 h-6 text-green-400" />,
    target: ".voice-recorder-button",
    position: 'top',
    interactive: true,
    highlight: true,
  },
  {
    id: 3,
    title: "Siri Shortcuts Setup",
    description: "Enable voice commands like 'Hey Siri, capture thoughtmark' or 'Hey Siri, add to thoughtmarks' from anywhere on your device. You can set this up now or later in Settings.",
    icon: <Smartphone className="w-6 h-6 text-blue-400" />,
    action: "siri-shortcuts",
    interactive: true,
    allowSkip: true,
  },
  {
    id: 4,
    title: "Organize with Smart Bins",
    description: "AI automatically categorizes your thoughts into relevant bins. You can also create custom bins for specific projects.",
    icon: <Sparkles className="w-6 h-6 text-amber-400" />,
    target: ".bins-section",
    position: 'right',
    interactive: true,
    highlight: true,
  },
  {
    id: 5,
    title: "Search & Discover",
    description: "Find your thoughts instantly with semantic search. Related ideas surface automatically as you work.",
    icon: <Search className="w-6 h-6 text-cyan-400" />,
    target: ".search-input",
    position: 'bottom',
    interactive: true,
    highlight: true,
  },
];

export function OnboardingTutorial({ isOpen, onClose }: OnboardingTutorialProps) {
  return OnboardingTutorialLegacy({ isOpen, onClose });
  
  return createPortal(
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: 0,
        padding: 0
      }}
      onClick={onClose}
    >
      <Card 
        className="w-full max-w-md mx-4 bg-gray-900 border-gray-700"
        onClick={(e) => e.stopPropagation()}
      >
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-[#C6D600] rounded-full flex items-center justify-center">
                <Brain className="w-4 h-4 text-black" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Welcome to Thoughtmarks!</h3>
                <p className="text-xs text-gray-400">Quick Tutorial</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-400 hover:text-white p-1"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="mb-6">
            <p className="text-gray-300 text-sm leading-relaxed">
              Capture fleeting thoughts without breaking your flow state. Use voice input, AI categorization, and smart search to organize your ideas effortlessly.
            </p>
          </div>

          <div className="space-y-3 mb-6">
            <div className="flex items-center space-x-3 text-sm">
              <Mic className="w-4 h-4 text-green-400" />
              <span className="text-gray-300">Voice capture with auto-transcription</span>
            </div>
            <div className="flex items-center space-x-3 text-sm">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span className="text-gray-300">AI-powered smart categorization</span>
            </div>
            <div className="flex items-center space-x-3 text-sm">
              <Search className="w-4 h-4 text-blue-400" />
              <span className="text-gray-300">Semantic search and discovery</span>
            </div>
          </div>

          <Button
            onClick={onClose}
            className="w-full bg-[#C6D600] text-black hover:bg-[#B5C100]"
          >
            Get Started
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </CardContent>
      </Card>
    </div>,
    document.body
  );
}

// Legacy implementation follows for reference but won't execute
function OnboardingTutorialLegacy({ isOpen, onClose }: OnboardingTutorialProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [targetElement, setTargetElement] = useState<HTMLElement | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      setCurrentStep(0);
    }
  }, [isOpen]);

  // Calculate tooltip position when step changes
  useEffect(() => {
    const currentStepData = tutorialSteps[currentStep];
    if (currentStepData?.target) {
      const element = document.querySelector(currentStepData.target) as HTMLElement;
      if (element) {
        setTargetElement(element);
        const rect = element.getBoundingClientRect();
        const scrollX = window.scrollX;
        const scrollY = window.scrollY;
        
        let x = rect.left + scrollX + rect.width / 2;
        let y = rect.top + scrollY;
        
        // Adjust position based on tooltip position preference
        switch (currentStepData.position) {
          case 'top':
            y = rect.top + scrollY - 20;
            break;
          case 'bottom':
            y = rect.bottom + scrollY + 20;
            break;
          case 'left':
            x = rect.left + scrollX - 20;
            y = rect.top + scrollY + rect.height / 2;
            break;
          case 'right':
            x = rect.right + scrollX + 20;
            y = rect.top + scrollY + rect.height / 2;
            break;
        }
        
        setTooltipPosition({ x, y });
      }
    } else {
      setTargetElement(null);
    }
  }, [currentStep, isOpen]);

  const handleNext = async () => {
    if (currentStep < tutorialSteps.length - 1) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentStep(currentStep + 1);
        setIsAnimating(false);
      }, 150);
    } else {
      onClose();
    }
  };

  const handleSkipSiri = () => {
    handleNext();
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentStep(currentStep - 1);
        setIsAnimating(false);
      }, 150);
    }
  };

  const handleSiriShortcuts = async () => {
    try {
      // This will trigger the iOS native Siri shortcut installation
      const webkit = (window as any).webkit;
      if (webkit?.messageHandlers?.siriShortcuts) {
        webkit.messageHandlers.siriShortcuts.postMessage({
          action: 'installShortcuts'
        });
        toast({
          title: "Siri Shortcuts Added!",
          description: "You can now say 'Hey Siri, capture thoughtmark' to create new thoughts.",
        });
      } else {
        // Fallback for web browsers
        toast({
          title: "Setup Instructions",
          description: "To set up Siri Shortcuts, add this app to your home screen and enable shortcuts in iOS Settings.",
          variant: "default",
        });
      }
      handleNext();
    } catch (error) {
      toast({
        title: "Setup Instructions",
        description: "To set up Siri Shortcuts manually, go to Settings > Siri & Search > Add to Siri and search for Thoughtmarks.",
        variant: "default",
      });
      handleNext();
    }
  };

  // Swipe detection
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && currentStep < tutorialSteps.length - 1) {
      handleNext();
    }
    if (isRightSwipe && currentStep > 0) {
      handlePrevious();
    }
  };

  const currentTutorialStep = tutorialSteps[currentStep];

  if (!isOpen) return null;

  const renderTooltip = () => {
    if (!targetElement || !currentTutorialStep.target) return null;

    const rect = targetElement.getBoundingClientRect();
    const position = currentTutorialStep.position || 'bottom';
    
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        className="fixed z-[60] pointer-events-none"
        style={{
          left: tooltipPosition.x - 150,
          top: tooltipPosition.y - (position === 'bottom' ? 0 : 100),
        }}
      >
        <div className="relative bg-gray-900 border border-gray-600 rounded-lg p-4 w-80 shadow-2xl">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              {currentTutorialStep.icon}
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-white mb-1">
                {currentTutorialStep.title}
              </h3>
              <p className="text-xs text-gray-300 leading-relaxed">
                {currentTutorialStep.description}
              </p>
            </div>
          </div>
          
          {/* Tooltip arrow */}
          <div 
            className={`absolute w-3 h-3 bg-gray-900 border-gray-600 transform rotate-45 ${
              position === 'top' ? 'bottom-[-6px] border-b border-r' :
              position === 'bottom' ? 'top-[-6px] border-t border-l' :
              position === 'left' ? 'right-[-6px] border-r border-t' :
              'left-[-6px] border-l border-b'
            }`}
            style={{ 
              left: position === 'left' || position === 'right' ? undefined : '50%',
              top: position === 'top' || position === 'bottom' ? undefined : '50%',
              transform: `${position === 'left' || position === 'right' ? 'translateY(-50%)' : 'translateX(-50%)'} rotate(45deg)`
            }}
          />
        </div>
      </motion.div>
    );
  };

  const renderHighlight = () => {
    if (!targetElement || !currentTutorialStep.highlight) return null;

    const rect = targetElement.getBoundingClientRect();
    
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed z-[55] pointer-events-none"
        style={{
          left: rect.left - 8,
          top: rect.top - 8,
          width: rect.width + 16,
          height: rect.height + 16,
        }}
      >
        <div className="w-full h-full rounded-lg border-2 border-[#C6D600] bg-[#C6D600]/10 animate-pulse" />
      </motion.div>
    );
  };

  if (!isOpen) return null;

  const modalContent = (
    <>
      {/* Overlay */}
      <div 
        className="bg-black/60 backdrop-blur-sm"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 9999,
          margin: 0,
          padding: 0
        }}
        onClick={targetElement ? undefined : onClose}
      />

      {/* Highlight overlay for targeted elements */}
      <AnimatePresence>
        {renderHighlight()}
      </AnimatePresence>

      {/* Tooltip for targeted elements */}
      <AnimatePresence>
        {renderTooltip()}
      </AnimatePresence>

      {/* Main tutorial modal (for non-targeted steps) */}
      {!targetElement && (
        <div 
          style={{
            position: 'fixed !important',
            top: '500px !important',
            left: '50% !important',
            transform: 'translateX(-50%) !important',
            zIndex: 99999,
            margin: '0 !important',
            padding: '0 !important',
            pointerEvents: 'none',
            width: 'auto'
          }}
        >
          <Card 
            className={`w-full max-w-md mx-4 bg-gray-900 border-gray-700 transform transition-all duration-300 ${
              isAnimating ? 'scale-95 opacity-50' : 'scale-100 opacity-100'
            }`}
            style={{ pointerEvents: 'auto' }}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            <CardContent className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring" }}
                    className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-violet-500 to-cyan-500"
                  >
                    {currentTutorialStep.icon}
                  </motion.div>
                  <div>
                    <span className="text-sm text-gray-400">
                      Step {currentStep + 1} of {tutorialSteps.length}
                    </span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-gray-800 rounded-full h-2 mb-6">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${((currentStep + 1) / tutorialSteps.length) * 100}%` }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className="bg-gradient-to-r from-[#C6D600] to-cyan-400 h-2 rounded-full"
                />
              </div>

              {/* Content */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-center mb-8"
              >
                <h2 className="text-xl font-bold text-white mb-3">
                  {currentTutorialStep.title}
                </h2>
                <p className="text-gray-300 leading-relaxed">
                  {currentTutorialStep.description}
                </p>
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="text-xs text-gray-500 mt-4 flex items-center justify-center space-x-2"
                >
                  <Zap className="w-3 h-3" />
                  <span>Swipe left/right or use buttons to navigate</span>
                </motion.p>
              </motion.div>

              {/* Action buttons for specific steps */}
              {currentTutorialStep.action === "siri-shortcuts" && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="mb-6 space-y-3"
                >
                  <Button
                    onClick={handleSiriShortcuts}
                    className="w-full bg-[#C6D600] text-black hover:bg-[#B5C100] transition-all duration-200 hover:scale-105"
                  >
                    <Smartphone className="w-4 h-4 mr-2" />
                    Setup Now
                  </Button>
                  <Button
                    onClick={handleSkipSiri}
                    variant="outline"
                    className="w-full border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white transition-all duration-200"
                  >
                    Setup Later
                  </Button>
                  <p className="text-xs text-gray-400 text-center">
                    Voice commands can be configured anytime in Settings
                  </p>
                </motion.div>
              )}

              {/* Navigation */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="flex justify-between items-center"
              >
                <Button
                  variant="ghost"
                  onClick={handlePrevious}
                  disabled={currentStep === 0}
                  className="text-gray-400 hover:text-white disabled:opacity-50 transition-all duration-200 hover:scale-105"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Previous
                </Button>

                <div className="flex space-x-2">
                  {tutorialSteps.map((_, index) => (
                    <motion.div
                      key={index}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.1 * index, type: "spring" }}
                      className={`w-3 h-3 rounded-full transition-all duration-300 cursor-pointer hover:scale-125 ${
                        index === currentStep
                          ? 'bg-[#C6D600] shadow-lg shadow-[#C6D600]/50'
                          : index < currentStep
                          ? 'bg-[#C6D600]/60'
                          : 'bg-gray-600 hover:bg-gray-500'
                      }`}
                      onClick={() => {
                        setIsAnimating(true);
                        setTimeout(() => {
                          setCurrentStep(index);
                          setIsAnimating(false);
                        }, 150);
                      }}
                    />
                  ))}
                </div>

                <Button
                  onClick={handleNext}
                  className="bg-[#C6D600] text-black hover:bg-[#B5C100] transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-[#C6D600]/30"
                >
                  {currentStep === tutorialSteps.length - 1 ? "Get Started" : "Next"}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Floating navigation for tooltip mode */}
      {targetElement && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-[65] flex items-center space-x-4 bg-gray-900 border border-gray-600 rounded-full px-6 py-3 shadow-2xl"
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className="text-gray-400 hover:text-white disabled:opacity-50 p-2 rounded-full"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>

          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-300 font-medium">
              {currentStep + 1} / {tutorialSteps.length}
            </span>
            <div className="flex space-x-1">
              {tutorialSteps.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentStep
                      ? 'bg-[#C6D600]'
                      : index < currentStep
                      ? 'bg-[#C6D600]/60'
                      : 'bg-gray-600'
                  }`}
                />
              ))}
            </div>
          </div>

          <Button
            onClick={handleNext}
            size="sm"
            className="bg-[#C6D600] text-black hover:bg-[#B5C100] px-4 py-2 rounded-full"
          >
            {currentStep === tutorialSteps.length - 1 ? "Finish" : "Next"}
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>


        </motion.div>
      )}
    </>
  );

  // Force viewport positioning by rendering directly to body with absolute coordinates
  useEffect(() => {
    if (!isOpen) return;
    
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999,
        margin: 0,
        padding: 0,
      }}
    >
      {modalContent}
    </div>,
    document.body
  );
}