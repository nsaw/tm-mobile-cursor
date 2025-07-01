import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { loginWithEmail, registerWithEmail, getCurrentUser } from "@/lib/auth";
import { simplePasskeyAuth } from "@/lib/passkeys-simple";
import { pinAuth } from "@/lib/pin-auth";
import { useToast } from "@/hooks/use-toast";
import { Brain, Plus, Mic, Tags, Key, Eye, EyeOff, Crown, CheckCircle, ArrowLeft, AlertCircle } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { apiRequest } from "@/lib/queryClient";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const signupSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Password must be at least 6 characters"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const pinSchema = z.object({
  pin: z.string().min(4, "PIN must be at least 4 digits").max(6, "PIN must be at most 6 digits").regex(/^\d+$/, "PIN must contain only numbers"),
});

type LoginFormData = z.infer<typeof loginSchema>;
type SignupFormData = z.infer<typeof signupSchema>;
type PinFormData = z.infer<typeof pinSchema>;

interface AuthPromptDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  feature: string;
  initialMode?: "login" | "signup" | "pin";
}

export function AuthPromptDialog({ open, onOpenChange, feature, initialMode = "login" }: AuthPromptDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [mode, setMode] = useState<"login" | "signup" | "pin">(initialMode);
  const [passkeySupported, setPasskeySupported] = useState(false);
  const [hasPasskey, setHasPasskey] = useState(false);
  const [usePinToggle, setUsePinToggle] = useState(false);
  const [userHasPin, setUserHasPin] = useState(false);
  const { toast } = useToast();

  // Reset mode when dialog opens to respect initialMode
  useEffect(() => {
    if (open) {
      setMode(initialMode);
    }
  }, [open, initialMode]);

  // Debug mode changes
  useEffect(() => {
    console.log('Auth modal mode changed to:', mode);
  }, [mode]);

  // Comprehensive error handling function
  const handleAuthError = (error: any) => {
    console.error('Authentication error:', error);
    
    // Firebase-specific errors
    if (error.code) {
      switch (error.code) {
        case 'auth/invalid-credential':
        case 'auth/user-not-found':
        case 'auth/wrong-password':
          toast({
            title: "Login Failed",
            description: "Invalid email or password. Please check your credentials and try again.",
            variant: "destructive",
          });
          break;
        case 'auth/email-already-in-use':
          toast({
            title: "Email Already Registered",
            description: "This email is already associated with an account. Try logging in instead.",
            variant: "destructive",
          });
          break;
        case 'auth/weak-password':
          toast({
            title: "Weak Password",
            description: "Password should be at least 6 characters long.",
            variant: "destructive",
          });
          break;
        case 'auth/too-many-requests':
          toast({
            title: "Too Many Attempts",
            description: "Account temporarily locked due to too many failed attempts. Please try again later.",
            variant: "destructive",
          });
          break;
        case 'auth/network-request-failed':
          toast({
            title: "Network Error",
            description: "Please check your internet connection and try again.",
            variant: "destructive",
          });
          break;
        default:
          toast({
            title: "Authentication Error",
            description: error.message || "An unexpected error occurred. Please try again.",
            variant: "destructive",
          });
      }
    } else {
      // General error handling
      toast({
        title: "Error",
        description: error.message || "Failed to authenticate. Please try again.",
        variant: "destructive",
      });
    }
  };

  // User status verification and redirection
  const verifyUserStatusAndRedirect = async (user: any, isNewSignup = false) => {
    try {
      // Validate user exists and has proper Firebase authentication
      if (!user || !user.uid) {
        throw new Error("Invalid user authentication");
      }

      // Get user data from our database
      const dbUser = await getCurrentUser(user.uid);
      
      if (!dbUser) {
        throw new Error("User profile not found. Please contact support.");
      }

      // Verify premium status if needed
      try {
        const premiumResponse = await apiRequest("GET", "/api/premium/status");
        const premiumData = await premiumResponse.json();
        
        if (!premiumResponse.ok) {
          console.warn("Premium status check failed:", premiumData);
        }
      } catch (premiumError) {
        console.warn("Premium status validation failed:", premiumError);
        // Don't block authentication for premium check failures
      }

      // Handle new signup trial setup
      if (isNewSignup) {
        try {
          const trialResponse = await apiRequest("POST", "/api/premium/start-trial", {
            trialType: "trial_7"
          });
          
          if (!trialResponse.ok) {
            console.warn("Trial setup failed, but continuing with authentication");
          }
        } catch (trialError) {
          console.warn("Trial setup error:", trialError);
          // Don't block authentication for trial setup failures
        }
      }

      // Successful authentication - redirect to dashboard
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 100);

    } catch (error: any) {
      console.error("User status verification failed:", error);
      
      // Provide helpful error resolution
      toast({
        title: "Account Setup Required",
        description: "There was an issue with your account setup. Please contact support or try signing up again.",
        variant: "destructive",
      });
      
      throw error;
    }
  };

  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const signupForm = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const pinForm = useForm<PinFormData>({
    resolver: zodResolver(pinSchema),
    defaultValues: {
      pin: "",
    },
  });

  const handleLogin = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      const result = await loginWithEmail(data.email, data.password);
      
      // If PIN toggle is enabled but user doesn't have PIN, prompt to set up PIN
      if (usePinToggle && !userHasPin) {
        toast({
          title: "PIN Setup Required",
          description: "Please set up a PIN for quick access in the future.",
        });
        // Here you could redirect to PIN setup flow, but for now we'll continue with normal login
      }
      
      // Verify user status and handle premium/role validation
      await verifyUserStatusAndRedirect(result);
      
      toast({
        title: "Welcome back!",
        description: "Successfully logged in to your account.",
      });
      onOpenChange(false);
    } catch (error: any) {
      handleAuthError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (data: SignupFormData) => {
    setIsLoading(true);
    console.log('Starting signup process with data:', { email: data.email, hasPassword: !!data.password });
    
    try {
      console.log('Calling registerWithEmail...');
      const result = await registerWithEmail(data.email, data.password);
      console.log('Registration successful, result:', result);
      
      // Verify user status and handle premium trial setup
      console.log('Verifying user status and setting up trial...');
      await verifyUserStatusAndRedirect(result, true);
      
      toast({
        title: "Welcome to Thoughtmarks!",
        description: "Account created successfully. Starting your 7-day free trial.",
      });
      onOpenChange(false);
    } catch (error: any) {
      console.error('Signup error details:', error);
      handleAuthError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePinSubmit = async (data: PinFormData) => {
    setIsLoading(true);
    try {
      const result = await pinAuth.authenticateWithPin(data.pin);
      
      if (result.success) {
        // Verify user status and handle redirection
        await verifyUserStatusAndRedirect(result.user);
        
        toast({
          title: "Welcome back!",
          description: "PIN verified successfully",
        });
        onOpenChange(false);
      } else {
        toast({
          title: "Invalid PIN",
          description: result.error || "Please check your PIN and try again",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      handleAuthError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasskeyAuth = async () => {
    try {
      const result = await simplePasskeyAuth.authenticateWithPasskey();
      if (result.success && result.email) {
        toast({
          title: "Success",
          description: "Authenticated with passkey!",
        });
        onOpenChange(false);
        window.location.reload();
      } else {
        toast({
          title: "Error",
          description: result.error || "Passkey authentication failed",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Passkey authentication failed",
        variant: "destructive",
      });
    }
  };

  // Check authentication support on mount
  useEffect(() => {
    const checkSupport = async () => {
      setPasskeySupported(simplePasskeyAuth.isPasskeySupported());
      setHasPasskey(simplePasskeyAuth.hasPasskey());
      
      // Check if user has PIN set up
      try {
        const hasPinSetup = await pinAuth.hasPin();
        setUserHasPin(hasPinSetup);
        
        // If PIN toggle is enabled and user has PIN, automatically show PIN entry
        // But only if we're in login mode (preserve explicit signup/pin mode switches)
        if (usePinToggle && hasPinSetup && mode === "login") {
          setMode("pin");
        }
      } catch (error) {
        console.log("PIN check failed:", error);
        setUserHasPin(false);
      }
    };
    
    if (open) {
      checkSupport();
    }
  }, [open, usePinToggle]);

  const renderPremiumBenefits = () => (
    <div className="mt-4 p-4 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-lg border border-yellow-500/20">
      <div className="flex items-center space-x-2 mb-3">
        <Crown className="w-5 h-5 text-yellow-500" />
        <span className="font-medium text-yellow-500">Premium Benefits</span>
      </div>
      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-green-500" />
          <span className="text-sm text-gray-300">AI-powered insights and smart sorting</span>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-green-500" />
          <span className="text-sm text-gray-300">Advanced AI notifications and reminders</span>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-green-500" />
          <span className="text-sm text-gray-300">Unlimited thoughtmarks and sync</span>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-green-500" />
          <span className="text-sm text-gray-300">Priority support and early access</span>
        </div>
      </div>
      <div className="text-center">
        <p className="text-lg font-bold text-[#C6D600] mb-1">$4.99/month</p>
        <p className="text-xs text-gray-400">7-day free trial • Cancel anytime</p>
      </div>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg bg-black border-gray-800 animate-spring-in">
        <DialogHeader>
          <DialogTitle className="text-[#C6D600] flex items-center gap-2 font-oswald">
            <Brain className="w-5 h-5" />
            {mode === "pin" ? "Enter PIN" : mode === "signup" ? "Create Account" : "Sign In"}
          </DialogTitle>
          <DialogDescription className="text-gray-400 font-normal">
            {mode === "pin" 
              ? "Enter your 4 or 6-digit PIN to access your account"
              : mode === "signup" 
              ? "Join Thoughtmarks and start your 7-day free trial"
              : `You're currently browsing sample thoughtmarks. Sign in to ${feature} and access your personal knowledge management system.`
            }
          </DialogDescription>
        </DialogHeader>
        
        {mode === "login" && (
          <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4">
            {/* Quick Authentication Options */}
            {passkeySupported && hasPasskey && (
              <Button
                type="button"
                onClick={handlePasskeyAuth}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium"
              >
                <Key className="w-4 h-4 mr-2" />
                Sign in with Passkey
              </Button>
            )}

            <div>
              <Input
                {...loginForm.register("email")}
                type="email"
                placeholder="Email"
                autoComplete="username"
                className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 font-normal"
              />
              {loginForm.formState.errors.email && (
                <p className="text-red-400 text-sm mt-1 font-normal">
                  {loginForm.formState.errors.email.message}
                </p>
              )}
            </div>

            <div className="relative">
              <Input
                {...loginForm.register("password")}
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                autoComplete="current-password"
                className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 pr-10 font-normal"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 text-gray-400 hover:text-white"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </Button>
              {loginForm.formState.errors.password && (
                <p className="text-red-400 text-sm mt-1 font-normal">
                  {loginForm.formState.errors.password.message}
                </p>
              )}
            </div>

            {/* PIN Quick Access Toggle */}
            <div className="flex items-center justify-between py-2 px-1">
              <div className="flex items-center space-x-2">
                <Switch
                  id="pin-toggle"
                  checked={usePinToggle}
                  onCheckedChange={setUsePinToggle}
                />
                <Label htmlFor="pin-toggle" className="text-sm text-gray-300 font-normal">
                  {userHasPin ? "Use PIN for quick access" : "Enable PIN after login"}
                </Label>
              </div>
              <Key className="w-4 h-4 text-gray-400" />
            </div>

            <div className="flex justify-between text-sm">
              {!usePinToggle && (
                <Button
                  type="button"
                  variant="link"
                  onClick={() => setMode("pin")}
                  className="text-gray-400 hover:text-white p-0"
                >
                  Use PIN instead
                </Button>
              )}
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#C6D600] hover:bg-[#B5C100] text-black font-medium animate-press"
            >
              {isLoading ? "Logging in..." : "Log In"}
            </Button>

            <div className="flex gap-2">
              <Button 
                type="button"
                variant="outline" 
                onClick={() => onOpenChange(false)}
                className="flex-1 border-gray-700 text-gray-300 hover:bg-gray-800"
              >
                Continue browsing
              </Button>
              <Button 
                type="button"
                variant="ghost"
                onClick={() => {
                  console.log('Switching to signup mode...');
                  setMode("signup");
                }}
                className="flex-1 text-gray-400 hover:text-white"
              >
                Create Account
              </Button>
              <Button 
                type="button"
                variant="ghost"
                onClick={() => setMode("pin")}
                className="flex-1 text-gray-400 hover:text-white"
              >
                Use PIN
              </Button>
            </div>
          </form>
        )}

        {mode === "signup" && (
          <form onSubmit={signupForm.handleSubmit(handleSignup)} className="space-y-4">
            <div>
              <Input
                {...signupForm.register("email")}
                type="email"
                placeholder="Email"
                autoComplete="username"
                className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 font-normal"
              />
              {signupForm.formState.errors.email && (
                <p className="text-red-400 text-sm mt-1 font-normal">
                  {signupForm.formState.errors.email.message}
                </p>
              )}
            </div>

            <div className="relative">
              <Input
                {...signupForm.register("password")}
                type={showPassword ? "text" : "password"}
                placeholder="Password (min 6 characters)"
                autoComplete="new-password"
                className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 pr-10 font-normal"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 text-gray-400 hover:text-white"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </Button>
              {signupForm.formState.errors.password && (
                <p className="text-red-400 text-sm mt-1 font-normal">
                  {signupForm.formState.errors.password.message}
                </p>
              )}
            </div>

            <div className="relative">
              <Input
                {...signupForm.register("confirmPassword")}
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm password"
                autoComplete="new-password"
                className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 pr-10 font-normal"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 text-gray-400 hover:text-white"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </Button>
              {signupForm.formState.errors.confirmPassword && (
                <p className="text-red-400 text-sm mt-1 font-normal">
                  {signupForm.formState.errors.confirmPassword.message}
                </p>
              )}
            </div>

            {renderPremiumBenefits()}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-black font-medium animate-press"
            >
              {isLoading ? "Creating account..." : "Start Free Trial"}
            </Button>

            <div className="flex gap-2">
              <Button 
                type="button"
                variant="outline" 
                onClick={() => onOpenChange(false)}
                className="flex-1 border-gray-700 text-gray-300 hover:bg-gray-800"
              >
                Continue browsing
              </Button>
              <Button 
                type="button"
                variant="ghost"
                onClick={() => setMode("login")}
                className="flex-1 text-gray-400 hover:text-white"
              >
                Sign In
              </Button>
              <Button 
                type="button"
                variant="ghost"
                onClick={() => setMode("signup")}
                className="flex-1 text-gray-400 hover:text-white"
              >
                Create Account
              </Button>
            </div>
          </form>
        )}

        {mode === "pin" && (
          <form onSubmit={pinForm.handleSubmit(handlePinSubmit)} className="space-y-4">
            <div className="text-center">
              <Input
                {...pinForm.register("pin")}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={6}
                placeholder="0000 or 000000"
                autoComplete="off"
                className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 text-center text-2xl tracking-widest font-mono"
              />
              {pinForm.formState.errors.pin && (
                <p className="text-red-400 text-sm mt-1">
                  {pinForm.formState.errors.pin.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#C6D600] hover:bg-[#B5C100] text-black font-medium"
            >
              {isLoading ? "Verifying..." : "Verify PIN"}
            </Button>

            <div className="flex gap-2">
              <Button 
                type="button"
                variant="ghost" 
                onClick={() => setMode("login")}
                className="flex-1 text-gray-400 hover:text-white"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Sign In
              </Button>
              <Button 
                type="button"
                variant="ghost"
                onClick={() => setMode("signup")}
                className="flex-1 text-gray-400 hover:text-white"
              >
                Create Account
              </Button>
              <Button 
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="flex-1 border-gray-700 text-gray-300 hover:bg-gray-800"
              >
                Continue browsing
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}