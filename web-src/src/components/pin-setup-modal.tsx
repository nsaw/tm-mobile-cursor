import { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { toast } from "@/hooks/use-toast";
import { Shield, Check, AlertCircle } from "lucide-react";
import { pinAuth } from "@/lib/pin-auth";
import { userPreferences } from "@/lib/user-preferences";

interface PinSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function PinSetupModal({ isOpen, onClose, onSuccess }: PinSetupModalProps) {
  const [step, setStep] = useState<'setup' | 'confirm'>('setup');
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      // Focus the input when modal opens or step changes
      setTimeout(() => {
        const otpInput = document.querySelector('[data-input-otp]') as HTMLInputElement;
        if (otpInput) {
          otpInput.focus();
        }
      }, 200);
    }
  }, [isOpen, step]);

  useEffect(() => {
    // Reset state when modal closes
    if (!isOpen) {
      setStep('setup');
      setPin('');
      setConfirmPin('');
      setError('');
      setIsLoading(false);
    }
  }, [isOpen]);

  const handlePinChange = (value: string) => {
    setError('');
    if (step === 'setup') {
      setPin(value);
      if (value.length === 4) {
        // Auto-advance to confirmation step
        setTimeout(() => {
          setStep('confirm');
        }, 200);
      }
    } else {
      setConfirmPin(value);
    }
  };

  const handleSetupPin = async () => {
    if (pin.length !== 4) {
      setError('PIN must be 4 digits');
      return;
    }

    if (step === 'setup') {
      setStep('confirm');
      return;
    }

    if (pin !== confirmPin) {
      setError('PINs do not match');
      setStep('setup');
      setPin('');
      setConfirmPin('');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const result = await pinAuth.setupPin(pin);
      
      if (result.success) {
        // Enable PIN authentication preference
        userPreferences.togglePinAuth(true);
        
        toast({
          title: "PIN Setup Complete",
          description: "Your 4-digit PIN has been created successfully. You can now use it for quick login.",
        });

        onSuccess?.();
        handleClose();
      } else {
        setError(result.error || 'Failed to setup PIN');
      }
    } catch (error) {
      console.error('PIN setup error:', error);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setStep('setup');
    setPin('');
    setConfirmPin('');
    setError('');
    setIsLoading(false);
    onClose();
  };

  const handleBackToSetup = () => {
    setStep('setup');
    setConfirmPin('');
    setError('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-500" />
            {step === 'setup' ? 'Create Your PIN' : 'Confirm Your PIN'}
          </DialogTitle>
          <DialogDescription>
            {step === 'setup' 
              ? 'Choose a 4-digit PIN for quick and secure access to your account.'
              : 'Please enter your PIN again to confirm.'
            }
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* PIN Input */}
          <div className="flex flex-col items-center space-y-4">
            {/* Custom PIN Input */}
            <div className="flex gap-2">
              {[0, 1, 2, 3].map((index) => (
                <input
                  key={index}
                  type="number"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={1}
                  value={(step === 'setup' ? pin : confirmPin)[index] || ''}
                  onChange={(e) => {
                    const value = e.target.value.slice(-1); // Only take last digit
                    const currentPin = step === 'setup' ? pin : confirmPin;
                    const newPin = currentPin.split('');
                    newPin[index] = value;
                    
                    const updatedPin = newPin.join('').slice(0, 4);
                    handlePinChange(updatedPin);
                    
                    // Auto-focus next input
                    if (value && index < 3) {
                      const nextInput = document.querySelector(`input[data-pin-index="${index + 1}"]`) as HTMLInputElement;
                      if (nextInput) {
                        nextInput.focus();
                      }
                    }
                  }}
                  onKeyDown={(e) => {
                    // Handle backspace
                    if (e.key === 'Backspace' && !e.currentTarget.value && index > 0) {
                      const prevInput = document.querySelector(`input[data-pin-index="${index - 1}"]`) as HTMLInputElement;
                      if (prevInput) {
                        prevInput.focus();
                      }
                    }
                  }}
                  onFocus={(e) => e.target.select()}
                  data-pin-index={index}
                  disabled={isLoading}
                  autoFocus={index === 0}
                  className="w-12 h-12 text-lg text-center border-2 border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-black dark:text-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 disabled:opacity-50"
                />
              ))}
            </div>

            {error && (
              <div className="flex items-center gap-2 text-sm text-red-500">
                <AlertCircle className="w-4 h-4" />
                {error}
              </div>
            )}
          </div>

          {/* Step Indicator */}
          <div className="flex items-center justify-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${step === 'setup' ? 'bg-blue-500' : 'bg-green-500'}`} />
            <div className={`w-2 h-2 rounded-full ${step === 'confirm' ? 'bg-blue-500' : 'bg-gray-300'}`} />
          </div>

          {/* Security Notice */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <Check className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-700 dark:text-blue-300">
                <p className="font-medium mb-1">Security Features:</p>
                <ul className="text-xs space-y-1">
                  <li>• PIN is encrypted and stored securely</li>
                  <li>• Automatic lockout after failed attempts</li>
                  <li>• Can be disabled anytime in settings</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between">
          {step === 'confirm' ? (
            <Button 
              variant="ghost" 
              onClick={handleBackToSetup}
              disabled={isLoading}
            >
              Back
            </Button>
          ) : (
            <Button variant="ghost" onClick={handleClose} disabled={isLoading}>
              Cancel
            </Button>
          )}

          <Button 
            onClick={handleSetupPin}
            disabled={isLoading || (step === 'setup' ? pin.length !== 4 : confirmPin.length !== 4)}
            className="min-w-[100px]"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : step === 'setup' ? 'Continue' : 'Create PIN'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}