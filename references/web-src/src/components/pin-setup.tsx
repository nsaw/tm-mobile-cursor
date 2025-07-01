import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Eye, EyeOff, Check, X } from "lucide-react";
import { pinAuth } from "@/lib/pin-auth";
import { useToast } from "@/hooks/use-toast";

interface PinSetupProps {
  email: string;
  userId: string;
  onComplete: () => void;
  onCancel: () => void;
}

export function PinSetup({ email, userId, onComplete, onCancel }: PinSetupProps) {
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [showPin, setShowPin] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (pin.length !== 4) {
      toast({
        title: "Invalid PIN",
        description: "PIN must be exactly 4 digits",
        variant: "destructive"
      });
      return;
    }

    if (pin !== confirmPin) {
      toast({
        title: "PIN Mismatch",
        description: "PINs don't match. Please try again.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const result = await pinAuth.setupPin(email, userId, pin);
      
      if (result.success) {
        toast({
          title: "PIN Setup Complete",
          description: "You can now sign in quickly with your 4-digit PIN",
        });
        onComplete();
      } else {
        toast({
          title: "Setup Failed",
          description: result.error || "Failed to set up PIN",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Setup Error",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePinChange = (value: string) => {
    // Only allow digits and limit to 4 characters
    const digits = value.replace(/\D/g, '').slice(0, 4);
    setPin(digits);
  };

  const handleConfirmPinChange = (value: string) => {
    // Only allow digits and limit to 4 characters
    const digits = value.replace(/\D/g, '').slice(0, 4);
    setConfirmPin(digits);
  };

  const isPinValid = pin.length === 4;
  const isConfirmPinValid = confirmPin.length === 4;
  const pinsMatch = pin === confirmPin && pin.length === 4;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Shield className="w-5 h-5 text-green-400" />
            Set Up Quick PIN
          </CardTitle>
          <p className="text-sm text-gray-400">
            Create a 4-digit PIN for faster sign-in on this device
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Choose your 4-digit PIN
              </label>
              <div className="relative">
                <Input
                  type={showPin ? "text" : "password"}
                  value={pin}
                  onChange={(e) => handlePinChange(e.target.value)}
                  placeholder="••••"
                  className="bg-gray-700 border-gray-600 text-white text-center text-2xl tracking-widest"
                  maxLength={4}
                  inputMode="numeric"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                  onClick={() => setShowPin(!showPin)}
                >
                  {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
                {isPinValid && (
                  <Check className="w-4 h-4 text-green-400 absolute right-8 top-1/2 -translate-y-1/2" />
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Confirm your PIN
              </label>
              <div className="relative">
                <Input
                  type={showPin ? "text" : "password"}
                  value={confirmPin}
                  onChange={(e) => handleConfirmPinChange(e.target.value)}
                  placeholder="••••"
                  className="bg-gray-700 border-gray-600 text-white text-center text-2xl tracking-widest"
                  maxLength={4}
                  inputMode="numeric"
                />
                {isConfirmPinValid && (
                  pinsMatch ? (
                    <Check className="w-4 h-4 text-green-400 absolute right-3 top-1/2 -translate-y-1/2" />
                  ) : (
                    <X className="w-4 h-4 text-red-400 absolute right-3 top-1/2 -translate-y-1/2" />
                  )
                )}
              </div>
            </div>

            <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-3">
              <p className="text-blue-200 text-xs">
                Your PIN is stored securely on this device only. You can still use your email and password on other devices.
              </p>
            </div>

            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                className="flex-1"
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!pinsMatch || isSubmitting}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white"
              >
                {isSubmitting ? "Setting up..." : "Set Up PIN"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

interface PinLoginProps {
  onSuccess: () => void;
  onSwitchToEmail: () => void;
}

export function PinLogin({ onSuccess, onSwitchToEmail }: PinLoginProps) {
  const [pin, setPin] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPin, setShowPin] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (pin.length !== 4) {
      toast({
        title: "Invalid PIN",
        description: "Please enter your 4-digit PIN",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const result = await pinAuth.authenticateWithPin(pin);
      
      if (result.success) {
        toast({
          title: "Welcome back!",
          description: "Signed in successfully with PIN",
        });
        onSuccess();
      } else {
        toast({
          title: "Sign In Failed",
          description: result.error || "Incorrect PIN",
          variant: "destructive"
        });
        setPin(""); // Clear PIN on failure
      }
    } catch (error) {
      toast({
        title: "Sign In Error",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
      setPin("");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePinChange = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 4);
    setPin(digits);
  };

  const storedEmail = pinAuth.getStoredEmail();

  return (
    <Card className="w-full max-w-md mx-auto bg-gray-800 border-gray-700">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2 text-white">
          <Shield className="w-5 h-5 text-green-400" />
          Quick Sign In
        </CardTitle>
        {storedEmail && (
          <p className="text-sm text-gray-400">
            Welcome back, {storedEmail}
          </p>
        )}
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Enter your 4-digit PIN
            </label>
            <div className="relative">
              <Input
                type={showPin ? "text" : "password"}
                value={pin}
                onChange={(e) => handlePinChange(e.target.value)}
                placeholder="••••"
                className="bg-gray-700 border-gray-600 text-white text-center text-2xl tracking-widest"
                maxLength={4}
                inputMode="numeric"
                autoFocus
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                onClick={() => setShowPin(!showPin)}
              >
                {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </Button>
            </div>
          </div>

          <Button
            type="submit"
            disabled={pin.length !== 4 || isSubmitting}
            className="w-full bg-green-600 hover:bg-green-700 text-white"
          >
            {isSubmitting ? "Signing in..." : "Sign In"}
          </Button>

          <Button
            type="button"
            variant="ghost"
            onClick={onSwitchToEmail}
            className="w-full text-sm text-gray-400 hover:text-white"
          >
            Use email instead
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}