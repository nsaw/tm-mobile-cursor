import { useState } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";
import { X, ArrowRight, Brain, Focus, Lightbulb, Smartphone } from "lucide-react";

interface IntroOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export function IntroOverlay({ isOpen, onClose }: IntroOverlayProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: "Welcome to Thoughtmarks",
      description: "Bookmarks for your brain - capture thoughts without losing focus",
      icon: <Brain className="w-12 h-12 text-[#C6D600]" />,
      content: "Thoughtmarks help you stay curious and remember to follow up on interesting ideas while maintaining your flow state."
    },
    {
      title: "Stay Focused",
      description: "Don't get sidetracked by interesting tangents",
      icon: <Focus className="w-12 h-12 text-[#C6D600]" />,
      content: "When something interesting pops up but you can't address it now, quickly save it as a thoughtmark and stay on task."
    },
    {
      title: "Organize & Revisit",
      description: "Keep your ideas organized in bins for easy discovery",
      icon: <Lightbulb className="w-12 h-12 text-[#C6D600]" />,
      content: "Organize thoughtmarks in bins, add tags, and use voice recording for quick capture. Review and act on them when you have time."
    },
    {
      title: "Voice Shortcuts",
      description: "Set up Siri for hands-free capture",
      icon: <Smartphone className="w-12 h-12 text-[#C6D600]" />,
      content: "Configure Siri shortcuts to add thoughtmarks using just your voice. Say 'Hey Siri, add to Thoughtmarks' followed by your idea."
    },
    {
      title: "Quick Walkthrough",
      description: "Here's how to get started",
      icon: <ArrowRight className="w-12 h-12 text-[#C6D600]" />,
      content: "• Tap 'New Thoughtmark' to capture ideas\n• Use bins to organize by project or category\n• Add tags for easy filtering\n• Voice record for hands-free capture"
    }
  ];

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  const skipIntro = () => {
    onClose();
  };

  if (!isOpen) return null;

  const modalContent = (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        backdropFilter: 'blur(8px)',
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        margin: 0
      }}
    >
      <div className="bg-gray-900 rounded-2xl p-6 max-w-sm w-full border border-gray-800 animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg overflow-hidden">
              <img 
                src="https://raw.githubusercontent.com/nsaw/imageSrc/main/IMG_4663.jpeg" 
                alt="Thoughtmarks Logo" 
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-sm font-subtitle text-gray-300">
              {currentStep + 1} of {steps.length}
            </span>
          </div>

        </div>

        {/* Content */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            {steps[currentStep].icon}
          </div>
          <h2 className="text-xl font-title text-white mb-2">
            {steps[currentStep].title}
          </h2>
          <p className="text-sm font-subtitle text-gray-400 mb-4">
            {steps[currentStep].description}
          </p>
          <div className="text-sm font-body text-gray-300 text-left bg-gray-800/50 rounded-lg p-4">
            {steps[currentStep].content.split('\n').map((line, index) => (
              <div key={index} className="mb-1">
                {line}
              </div>
            ))}
          </div>
        </div>

        {/* Progress dots */}
        <div className="flex justify-center space-x-2 mb-6">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentStep ? 'bg-[#C6D600]' : 'bg-gray-600'
              }`}
            />
          ))}
        </div>

        {/* Actions */}
        <div className="flex justify-center">
          <Button
            onClick={nextStep}
            className="w-full bg-[#C6D600] text-black hover:bg-[#A8B800] font-subtitle"
          >
            {currentStep === steps.length - 1 ? 'Get Started' : 'Next'}
          </Button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}