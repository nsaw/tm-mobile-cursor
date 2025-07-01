import { createPortal } from "react-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, ArrowLeft, ArrowRight } from "lucide-react";

interface SimpleOnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentStep: number;
  totalSteps: number;
  title: string;
  content: string;
  onNext: () => void;
  onPrevious: () => void;
}

export function SimpleOnboardingModal({
  isOpen,
  onClose,
  currentStep,
  totalSteps,
  title,
  content,
  onNext,
  onPrevious
}: SimpleOnboardingModalProps) {
  if (!isOpen) return null;

  const modalContent = (
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
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingTop: '500px',
        margin: 0,
        padding: '500px 20px 20px 20px',
        boxSizing: 'border-box'
      }}

    >
      <Card 
        className="w-full max-w-md bg-gray-900 border-gray-700"
        onClick={(e) => e.stopPropagation()}
      >
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-[#C6D600] rounded-full flex items-center justify-center">
                <span className="text-black font-bold text-sm">{currentStep + 1}</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">{title}</h3>
                <p className="text-xs text-gray-400">{currentStep + 1} of {totalSteps}</p>
              </div>
            </div>

          </div>

          <div className="mb-6">
            <p className="text-gray-300 text-sm leading-relaxed">
              {content}
            </p>
          </div>

          <div className="flex justify-between items-center">
            <Button
              variant="ghost"
              onClick={onPrevious}
              disabled={currentStep === 0}
              className="text-gray-400 hover:text-white disabled:opacity-50"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>

            <div className="flex space-x-1">
              {Array.from({ length: totalSteps }).map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentStep ? 'bg-[#C6D600]' : 'bg-gray-600'
                  }`}
                />
              ))}
            </div>

            <Button
              onClick={onNext}
              className="bg-[#C6D600] text-black hover:bg-[#B5C100]"
            >
              {currentStep === totalSteps - 1 ? "Get Started" : "Next"}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return createPortal(modalContent, document.body);
}