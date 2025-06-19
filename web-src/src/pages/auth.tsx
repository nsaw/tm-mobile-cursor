import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ContentBackButton } from "@/components/ui/BackButton";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { loginWithEmail, registerWithEmail, signInWithGoogle, signInWithApple, handleAuthRedirect } from "@/lib/auth";
import { biometricAuth } from "@/lib/biometric-auth";
import { simplePasskeyAuth } from "@/lib/passkeys-simple";
import { nativeIOSAuth } from "@/lib/native-ios-auth";
import { iosOAuthBridge } from "@/lib/ios-oauth-bridge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { GDPRConsent, type ConsentData } from "@/components/gdpr-consent";
import { PinSetup, PinLogin } from "@/components/pin-setup";
import { pinAuth } from "@/lib/pin-auth";
import { errorHandler } from "@/lib/error-handler";
import { userPreferences } from "@/lib/user-preferences";
import { Scan, KeyIcon, Crown, Mail, ArrowLeft, Key, Eye, EyeOff, Settings } from "lucide-react";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Switch } from "@/components/ui/switch";
import { PinSetupModal } from "@/components/pin-setup-modal";

// Extended types for Credential Management API
interface ExtendedCredentialRequestOptions extends CredentialRequestOptions {
  password?: boolean;
  federated?: {
    providers: string[];
  };
}

interface PasswordCredential extends Credential {
  readonly password: string;
  readonly name: string;
}

interface PasswordCredentialData {
  id: string;
  password: string;
  name?: string;
  iconURL?: string;
}

const loginSchema = z.object({
  email: z.string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  password: z.string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters"),
});

const registerSchema = loginSchema.extend({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type LoginFormData = z.infer<typeof loginSchema>;
type RegisterFormData = z.infer<typeof registerSchema>;

interface AuthProps {
  initialMode?: "login" | "signup";
}

export default function Auth({ initialMode = "login" }: AuthProps) {
  // Check URL params for mode
  const urlParams = new URLSearchParams(window.location.search);
  const modeFromUrl = urlParams.get('mode') as "login" | "signup" | null;
  const effectiveMode = modeFromUrl === "signup" ? "signup" : initialMode;
  const [isLogin, setIsLogin] = useState(effectiveMode === "login");
  
  // Dynamic welcome message based on time of day
  const getWelcomeMessage = () => {
    const hour = new Date().getHours();
    const messages = {
      earlyMorning: [
        "DAWN OF BRILLIANCE AWAITS!",
        "EARLY BIRD CATCHES THE IDEA!",
        "SUNRISE THOUGHTS LOADING..."
      ],
      morning: [
        "MORNING GENIUS ACTIVATED!",
        "COFFEE + THOUGHTS = MAGIC!",
        "FRESH IDEAS, FRESH START!",
        "BRAIN FUEL STATION OPEN!"
      ],
      midday: [
        "MIDDAY MIND MELD TIME!",
        "PEAK PERFORMANCE MODE!",
        "LUNCH BREAK? MORE LIKE THINK BREAK!",
        "HIGH NOON, HIGH THOUGHTS!"
      ],
      afternoon: [
        "AFTERNOON ENLIGHTENMENT!",
        "THE LEGEND RETURNS!",
        "POST-LUNCH POWER SURGE!",
        "THOUGHTS BREWING STRONGER!"
      ],
      evening: [
        "EVENING GENIUS HOUR!",
        "TWILIGHT WISDOM CALLS!",
        "NIGHT OWL MODE ENGAGED!",
        "GOLDEN HOUR, GOLDEN IDEAS!"
      ],
      lateNight: [
        "MIDNIGHT INSPIRATION STRIKES!",
        "WHEN DARKNESS SPARKS LIGHT!",
        "3AM THOUGHTS HIT DIFFERENT!",
        "INSOMNIA = IDEA FESTIVAL!"
      ]
    };
    
    let timeOfDay: keyof typeof messages;
    if (hour >= 4 && hour < 7) timeOfDay = 'earlyMorning';
    else if (hour >= 7 && hour < 12) timeOfDay = 'morning';
    else if (hour >= 12 && hour < 14) timeOfDay = 'midday';
    else if (hour >= 14 && hour < 18) timeOfDay = 'afternoon';
    else if (hour >= 18 && hour < 22) timeOfDay = 'evening';
    else timeOfDay = 'lateNight';
    
    const timeMessages = messages[timeOfDay];
    return timeMessages[Math.floor(Math.random() * timeMessages.length)];
  };
  const [showConsent, setShowConsent] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [biometricSupported, setBiometricSupported] = useState(false);
  const [passkeySupported, setPasskeySupported] = useState(false);
  const [hasPasskey, setHasPasskey] = useState(false);
  const [pendingRegistration, setPendingRegistration] = useState<any>(null);
  const [forgotEmail, setForgotEmail] = useState("");
  const [resetCode, setResetCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isResetting, setIsResetting] = useState(false);

  const [showPinSetup, setShowPinSetup] = useState(false);
  const [showPinLogin, setShowPinLogin] = useState(false);
  const [showPinSetupModal, setShowPinSetupModal] = useState(false);
  const [authenticatedUserId, setAuthenticatedUserId] = useState<string | null>(null);
  const [currentScreen, setCurrentScreen] = useState<"login" | "register" | "forgot" | "reset" | "pin">("login");
  const [userHasPin, setUserHasPin] = useState(false);
  const [pinAuthPreference, setPinAuthPreference] = useState(false);
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    const initializeAuth = async () => {
      // Initialize error handling for auth component
      const removeErrorListener = errorHandler.onError((error) => {
        toast({
          title: "Authentication Error",
          description: error.userMessage,
          variant: "destructive",
        });
      });

      // Always check for remembered email and pre-fill it
      const rememberedEmail = localStorage.getItem('thoughtmarks_remembered_email');
      if (rememberedEmail) {
        loginForm.setValue('email', rememberedEmail);
      }

      // Check user preferences for PIN authentication
      const preferences = userPreferences.getPreferences();
      setPinAuthPreference(preferences.pinAuthEnabled);
      
      // Check if PIN is set up and user prefers PIN auth
      const hasPinSetup = pinAuth.isPinSetup();
      setUserHasPin(hasPinSetup);
      
      // Check if this is a demo user by checking stored PIN data
      const storedPinData = localStorage.getItem('thoughtmarks_pin_auth');
      let isDemoUser = false;
      if (storedPinData) {
        try {
          const pinData = JSON.parse(storedPinData);
          isDemoUser = pinData.email === 'test@thoughtmarks.app' || pinData.email === 'hello@thoughtmarks.app';
        } catch (e) {
          // Invalid pin data, ignore
        }
      }
      
      // If user has PIN setup and prefers PIN auth, show PIN login directly (but not for demo users on initial load)
      if (hasPinSetup && preferences.pinAuthEnabled && !isDemoUser) {
        setCurrentScreen('pin');
        return;
      }

      // Check native iOS authentication
      if (nativeIOSAuth.isAvailable()) {
        const nativeSupported = await nativeIOSAuth.isBiometricSupported();
        setBiometricSupported(nativeSupported);
        nativeIOSAuth.enablePasswordAutofill();
      } else {
        const supported = await biometricAuth.isSupported();
        setBiometricSupported(supported);
        
        // Try conditional UI authentication
        if (supported && biometricAuth.isBiometricEnabled()) {
          try {
            const result = await biometricAuth.authenticateWithConditionalUI();
            if (result.success) {
              window.location.href = "/dashboard";
            }
          } catch (error) {
            // Conditional authentication not available
          }
        }
      }
    };
    
    // Handle redirect result for Google/Apple authentication
    const handleRedirect = async () => {
      await handleAuthRedirect();
    };
    
    const checkPasskey = () => {
      const supported = simplePasskeyAuth.isPasskeySupported();
      const hasKey = simplePasskeyAuth.hasPasskey();
      setPasskeySupported(supported);
      setHasPasskey(hasKey);
    };
    
    const requestStoredCredentials = async () => {
      if (navigator.credentials && 'get' in navigator.credentials) {
        try {
          const credential = await navigator.credentials.get({
            password: true,
            mediation: 'optional'
          } as ExtendedCredentialRequestOptions);
          
          if (credential && credential.type === 'password') {
            const passwordCred = credential as PasswordCredential;
            loginForm.setValue('email', passwordCred.id);
            if (passwordCred.password) {
              loginForm.setValue('password', passwordCred.password);
            }
          }
        } catch (error) {
          console.log('Credential mediation not available');
        }
      }
    };
    
    initializeAuth();
    checkPasskey();
    handleRedirect();
    requestStoredCredentials();
  }, [setLocation]);

  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onSubmit",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const registerForm = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: "onSubmit",
    defaultValues: {
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      confirmPassword: "",
    },
  });

  const handleLogin = async (data: LoginFormData) => {
    try {
      // Check if this is a demo account and handle differently
      if ((data.email === 'test@thoughtmarks.app' || data.email === 'hello@thoughtmarks.app') && data.password === 'password') {
        // Demo account - use direct API authentication
        const response = await fetch("/api/auth/demo", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: data.email, password: data.password }),
          credentials: "include",
        });
        
        if (response.ok) {
          const authData = await response.json();
          localStorage.setItem('thoughtmarks-user', JSON.stringify(authData.user));
          localStorage.setItem('thoughtmarks-demo-token', authData.token);
          localStorage.setItem('thoughtmarks_remembered_email', data.email);
          localStorage.setItem('thoughtmarks_keep_signed_in', 'true');
          
          toast({
            title: "Success",
            description: "Demo login successful!",
          });
          window.location.href = "/dashboard";
          return;
        } else {
          throw new Error("Demo authentication failed");
        }
      }
      
      // Regular Firebase authentication for non-demo users
      const result = await loginWithEmail(data.email, data.password);
      
      // Always remember email and keep users signed in for low friction access
      localStorage.setItem('thoughtmarks_remembered_email', data.email);
      localStorage.setItem('thoughtmarks_keep_signed_in', 'true');
      localStorage.setItem('thoughtmarks_session_expiry', (Date.now() + 30 * 24 * 60 * 60 * 1000).toString());
      
      // Get user data and confirm profile reset on login
      try {
        const userResponse = await apiRequest('GET', `/api/users/by-firebase/${result.user.uid}`);
        const userData = await userResponse.json() as any;
        const userId = userData.id.toString();
        
        // Profile reset confirmation on every session login
        const lastLoginConfirmation = sessionStorage.getItem('profile_reset_confirmed');
        if (!lastLoginConfirmation) {
          sessionStorage.setItem('profile_reset_confirmed', 'true');
          // Clear any cached onboarding states to ensure fresh experience
          sessionStorage.removeItem('hasSeenIntroThisSession');
        }
        
        // Offer PIN setup if not already set up and user has PIN preference enabled
        if (!pinAuth.isPinSetup() && pinAuthPreference) {
          setAuthenticatedUserId(userId);
          setShowPinSetupModal(true);
          return; // Don't redirect yet, let user set up PIN first
        }
      } catch (userError) {
        console.log('Could not fetch user for PIN setup:', userError);
      }
      
      // Native iOS credential storage
      if (nativeIOSAuth.isAvailable()) {
        nativeIOSAuth.saveCredentials(data.email, data.password);
      } else {
        // Web credential storage fallback
        if (navigator.credentials && 'store' in navigator.credentials) {
          try {
            const form = document.getElementById('loginForm') as HTMLFormElement;
            if (form && (window as any).PasswordCredential) {
              const credential = new (window as any).PasswordCredential(form);
              await navigator.credentials.store(credential);
            }
          } catch (credError) {
            console.log('Password credential storage not supported:', credError);
          }
        }
      }
      
      toast({
        title: "Success",
        description: "Logged in successfully!",
      });
      window.location.href = "/dashboard";
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to log in",
        variant: "destructive",
      });
    }
  };

  const handlePinLogin = async (pin: string) => {
    const result = await errorHandler.withErrorHandling(
      async () => {
        const authResult = await pinAuth.authenticateWithPin(pin);
        
        if (!authResult.success) {
          throw new Error(authResult.error || "PIN authentication failed");
        }

        if (!authResult.user) {
          throw new Error("User data not available after PIN authentication");
        }

        // Update user preferences on successful PIN login
        userPreferences.setLastLoginMethod('pin', authResult.userId);
        
        return authResult;
      },
      {
        component: 'Auth',
        action: 'pinLogin'
      },
      "PIN authentication failed. Please try again or use email login."
    );

    if (result.success && result.data) {
      toast({
        title: "Welcome back!",
        description: "PIN authentication successful",
      });
      
      // Use navigation instead of page reload to preserve auth state
      setLocation("/dashboard");
    }
  };

  const handleBiometricLogin = async () => {
    try {
      if (nativeIOSAuth.isAvailable()) {
        // Use native iOS biometric authentication
        const result = await nativeIOSAuth.authenticateWithBiometric();
        if (result.success) {
          toast({
            title: "Success",
            description: "Authenticated with Face ID!",
          });
          window.location.href = "/dashboard";
        } else {
          toast({
            title: "Authentication Failed",
            description: result.error || "Face ID authentication failed",
            variant: "destructive",
          });
        }
      } else if (!biometricAuth.isBiometricEnabled()) {
        toast({
          title: "Face ID Setup Required",
          description: "Please log in with email first to set up Face ID authentication.",
        });
        return;
      }

      const result = await biometricAuth.authenticateWithBiometric();
      if (result.success) {
        toast({
          title: "Success",
          description: "Authenticated with Face ID!",
        });
        // Force page reload to update authentication state
        window.location.href = "/dashboard";
      } else {
        toast({
          title: "Authentication Failed",
          description: "Face ID authentication failed. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Face ID authentication not available",
        variant: "destructive",
      });
    }
  };

  const handleForgotPassword = async () => {
    if (!forgotEmail) {
      toast({
        title: "Email required",
        description: "Please enter your email address",
        variant: "destructive"
      });
      return;
    }

    setIsResetting(true);
    try {
      const response = await apiRequest("POST", "/api/auth/forgot-password", {
        email: forgotEmail
      });

      if (response.ok) {
        const result = await response.json();
        toast({
          title: "Reset code sent",
          description: "Check your email for the reset code"
        });
        
        // In development, show the code
        if (result.code) {
          setResetCode(result.code);
        }
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to send reset code",
        variant: "destructive"
      });
    } finally {
      setIsResetting(false);
    }
  };

  const handleResetPassword = async () => {
    if (!resetCode || !newPassword) {
      toast({
        title: "Missing information",
        description: "Please enter both reset code and new password",
        variant: "destructive"
      });
      return;
    }

    setIsResetting(true);
    try {
      const response = await apiRequest("POST", "/api/auth/reset-password", {
        email: forgotEmail,
        code: resetCode,
        newPassword
      });

      if (response.ok) {
        toast({
          title: "Password reset successful",
          description: "You can now log in with your new password"
        });
        setShowForgotPassword(false);
        setForgotEmail("");
        setResetCode("");
        setNewPassword("");
      } else {
        const result = await response.json();
        throw new Error(result.message || "Failed to reset password");
      }
    } catch (error: any) {
      toast({
        title: "Reset failed",
        description: error.message || "Invalid reset code",
        variant: "destructive"
      });
    } finally {
      setIsResetting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      if (nativeIOSAuth.isAvailable()) {
        // Use native iOS OAuth
        await nativeIOSAuth.signInWithGoogle();
      } else {
        // Fallback to web OAuth
        await signInWithGoogle();
      }
    } catch (error: any) {
      toast({
        title: "Error", 
        description: "Failed to initialize Google sign-in. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleAppleSignIn = async () => {
    try {
      if (nativeIOSAuth.isAvailable()) {
        // Use native iOS OAuth
        await nativeIOSAuth.signInWithApple();
      } else {
        // Fallback to web OAuth
        await signInWithApple();
      }
      // Redirect happens automatically in the auth library
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to initialize Apple sign-in. Please try again.", 
        variant: "destructive",
      });
    }
  };

  const handleRegister = async (data: RegisterFormData) => {
    try {
      const displayName = `${data.firstName} ${data.lastName}`;
      const user = await registerWithEmail(data.email, data.password, displayName, data.firstName, data.lastName);
      toast({
        title: "Success",
        description: "Account created successfully!",
      });
      // Small delay to ensure user data is properly stored
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 500);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create account",
        variant: "destructive",
      });
    }
  };

  // Show PIN login if available and not setting up PIN
  if (showPinLogin && !showPinSetup) {
    return (
      <div className="full-height bg-black flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <img 
                src="https://raw.githubusercontent.com/nsaw/imageSrc/main/IMG_4663.jpeg" 
                alt="Thoughtmarks Logo"
                className="w-12 h-12 rounded-lg mr-3"
              />
              <h1 className="text-2xl text-white uppercase" style={{ fontFamily: 'Oswald, sans-serif', fontWeight: '600', letterSpacing: '-0.02em' }}>THOUGHTMARKS</h1>
            </div>
            <p className="text-[#C6D600]" style={{ fontFamily: 'Ubuntu, system-ui' }}>bookmarks for your brain</p>
          </div>

          <PinLogin 
            onSuccess={() => window.location.href = "/dashboard"}
            onSwitchToEmail={() => setShowPinLogin(false)}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="full-height bg-black flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-between mb-4">
            <ContentBackButton />
            <div className="flex items-center justify-center flex-1">
              <img 
                src="https://raw.githubusercontent.com/nsaw/imageSrc/main/IMG_4663.jpeg" 
                alt="Thoughtmarks Logo"
                className="w-12 h-12 rounded-lg mr-3"
              />
              <h1 className="text-2xl text-white uppercase" style={{ fontFamily: 'Oswald, sans-serif', fontWeight: '600', letterSpacing: '-0.02em' }}>THOUGHTMARKS</h1>
            </div>
            <div className="w-10"></div>
          </div>
          <p className="text-[#C6D600]" style={{ fontFamily: 'Ubuntu, system-ui' }}>bookmarks for your brain</p>
        </div>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-center">
              {currentScreen === "login" ? (
                <span style={{ fontFamily: 'Ubuntu, sans-serif', fontWeight: '500', fontSize: '1.5rem', textTransform: 'uppercase', color: '#C6D600' }}>
                  {getWelcomeMessage()}
                </span>
              ) : currentScreen === "register" ? (
                <div>
                  <div style={{ fontFamily: 'Ubuntu, sans-serif', fontWeight: '500', fontSize: '1.5rem', textTransform: 'uppercase', color: '#C6D600' }}>
                    THINKING BIG?
                  </div>
                  <div style={{ fontFamily: 'Ubuntu, sans-serif', fontWeight: '500', fontSize: '1.25rem', textTransform: 'uppercase', color: 'white', marginTop: '4px' }}>
                    LET'S CAPTURE EVERY IDEA
                  </div>
                </div>
              ) : currentScreen === "forgot" ? (
                <span style={{ fontFamily: 'Ubuntu, sans-serif', fontWeight: '500', fontSize: '1.5rem', textTransform: 'uppercase', color: '#C6D600' }}>
                  RESET PASSWORD
                </span>
              ) : (
                <span style={{ fontFamily: 'Ubuntu, sans-serif', fontWeight: '500', fontSize: '1.5rem', textTransform: 'uppercase', color: '#C6D600' }}>
                  NEW PASSWORD
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {currentScreen === "login" ? (
              <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4" autoComplete="on" name="login" id="loginForm">
                {/* Quick Authentication Options */}
                <div className="space-y-3">
                  {/* PIN Authentication Toggle */}
                  <div className="flex items-center justify-between p-3 rounded-lg bg-gray-700/50 border border-gray-600">
                    <div className="flex items-center space-x-3">
                      <KeyIcon className="w-4 h-4 text-[#C6D600]" />
                      <div className="text-sm">
                        <div className="font-medium text-white">
                          Use PIN?
                        </div>
                        <div className="text-gray-400 text-xs">
                          {userHasPin 
                            ? "4-digit PIN for quick access" 
                            : "Set up PIN for faster login"
                          }
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Switch
                        checked={userHasPin ? pinAuthPreference : false}
                        onCheckedChange={async (checked) => {
                          if (checked) {
                            // User wants to enable PIN
                            const email = loginForm.getValues("email");
                            
                            if (!email) {
                              toast({
                                title: "Email required",
                                description: "Please enter your email first to use PIN login",
                                variant: "destructive",
                              });
                              return;
                            }

                            // Check if user already has PIN setup (refresh check)
                            const hasPinSetup = pinAuth.isPinSetup();
                            if (hasPinSetup) {
                              // User has PIN, just enable preference and show PIN login
                              const success = userPreferences.togglePinAuth(true);
                              if (success) {
                                setPinAuthPreference(true);
                                setUserHasPin(true);
                                userPreferences.setLastLoginMethod('pin');
                                setCurrentScreen("pin");
                              }
                            } else {
                              // User doesn't have PIN - they need to authenticate with email first
                              toast({
                                title: "PIN Setup Required",
                                description: "Please log in with your email first to set up PIN authentication.",
                                variant: "default",
                              });
                            }
                          } else {
                            // User wants to disable PIN
                            try {
                              const success = userPreferences.togglePinAuth(false);
                              if (success) {
                                setPinAuthPreference(false);
                                userPreferences.setLastLoginMethod('email');
                                // Return to login screen if currently on PIN screen
                                if (currentScreen === "pin") {
                                  setCurrentScreen("login");
                                }
                              }
                            } catch (error) {
                              toast({
                                title: "Error updating PIN preference",
                                description: "Please try again",
                                variant: "destructive",
                              });
                            }
                          }
                        }}
                      />
                    </div>
                  </div>

                  {/* Quick Sign-In - Commented out until native bridge is ready
                  {passkeySupported && hasPasskey && (
                    <Button
                      type="button"
                      onClick={async () => {
                        const result = await simplePasskeyAuth.authenticateWithPasskey();
                        if (result.success && result.email) {
                          toast({
                            title: "Success",
                            description: "Authenticated with passkey!",
                          });
                          window.location.href = "/dashboard";
                        } else if (result.error) {
                          toast({
                            title: "Passkey Error",
                            description: result.error,
                            variant: "destructive",
                          });
                        }
                      }}
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium"
                    >
                      <Key className="w-4 h-4 mr-2" />
                      Sign in with Passkey
                    </Button>
                  )}

                  {passkeySupported && !hasPasskey && (
                    <Button
                      type="button"
                      onClick={async () => {
                        const email = loginForm.getValues("email");
                        if (!email) {
                          toast({
                            title: "Email Required",
                            description: "Please enter your email first to set up a passkey",
                            variant: "destructive",
                          });
                          return;
                        }
                        
                        const result = await simplePasskeyAuth.setupPasskey(email);
                        if (result.success) {
                          setHasPasskey(true);
                          toast({
                            title: "Passkey Setup Complete",
                            description: "You can now sign in quickly with your passkey",
                          });
                        } else if (result.error) {
                          toast({
                            title: "Passkey Setup Failed",
                            description: result.error,
                            variant: "destructive",
                          });
                        }
                      }}
                      variant="outline"
                      className="w-full border-purple-500 text-purple-400 hover:bg-purple-600 hover:text-white"
                    >
                      <Key className="w-4 h-4 mr-2" />
                      Set up Quick Sign-In
                    </Button>
                  )}
                  */}


                </div>

                <div>
                  <Input
                    {...loginForm.register("email")}
                    type="email"
                    placeholder="Email"
                    autoComplete="username"
                    autoCapitalize="none"
                    spellCheck={false}
                    className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  />
                  {loginForm.formState.errors.email && loginForm.formState.isSubmitted && (
                    <p className="text-red-400 text-sm mt-1">
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
                    className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 pr-10"
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
                  {loginForm.formState.errors.password && loginForm.formState.isSubmitted && (
                    <p className="text-red-400 text-sm mt-1">
                      {loginForm.formState.errors.password.message}
                    </p>
                  )}
                </div>

                {/* Forgot Password Link */}
                <div className="text-center">
                  <Button
                    type="button"
                    variant="link"
                    onClick={() => setCurrentScreen("forgot")}
                    className="text-[#C6D600] hover:text-[#B5C100] p-0 h-auto font-normal"
                  >
                    Forgot your password?
                  </Button>
                </div>

                <Button
                  type="submit"
                  disabled={loginForm.formState.isSubmitting}
                  className="w-full bg-[#C6D600] hover:bg-[#B5C100] text-black font-medium"
                >
                  {loginForm.formState.isSubmitting ? "Logging in..." : "Log In"}
                </Button>


              </form>
            ) : (
              <form onSubmit={registerForm.handleSubmit(handleRegister)} className="space-y-4" autoComplete="on">
                {/* Why Account Needed */}
                <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4 mb-4">
                  <h3 className="text-blue-300 font-semibold text-sm mb-2">Why create an account?</h3>
                  <p className="text-blue-200 text-xs">
                    Your account securely stores all your thoughtmarks, notes, and personal organization system across all your devices. We never share your data with third parties.
                  </p>
                </div>



                {/* Registration Benefits */}
                <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-3">
                  <p className="text-green-100 text-sm text-center">
                    Create your secure account with email - all your thoughtmarks synced across devices
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Input
                      {...registerForm.register("firstName")}
                      type="text"
                      placeholder="First Name"
                      autoComplete="given-name"
                      className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                    />
                    {registerForm.formState.errors.firstName && registerForm.formState.isSubmitted && (
                      <p className="text-red-400 text-sm mt-1">
                        {registerForm.formState.errors.firstName.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <Input
                      {...registerForm.register("lastName")}
                      type="text"
                      placeholder="Last Name"
                      autoComplete="family-name"
                      className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                    />
                    {registerForm.formState.errors.lastName && registerForm.formState.isSubmitted && (
                      <p className="text-red-400 text-sm mt-1">
                        {registerForm.formState.errors.lastName.message}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <Input
                    {...registerForm.register("email")}
                    type="email"
                    placeholder="Email"
                    className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  />
                  {registerForm.formState.errors.email && registerForm.formState.isSubmitted && (
                    <p className="text-red-400 text-sm mt-1">
                      {registerForm.formState.errors.email.message}
                    </p>
                  )}
                </div>

                <div>
                  <Input
                    {...registerForm.register("password")}
                    type="password"
                    placeholder="Password"
                    className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  />
                  {registerForm.formState.errors.password && registerForm.formState.isSubmitted && (
                    <p className="text-red-400 text-sm mt-1">
                      {registerForm.formState.errors.password.message}
                    </p>
                  )}
                </div>

                <div>
                  <Input
                    {...registerForm.register("confirmPassword")}
                    type="password"
                    placeholder="Confirm Password"
                    className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  />
                  {registerForm.formState.errors.confirmPassword && registerForm.formState.isSubmitted && (
                    <p className="text-red-400 text-sm mt-1">
                      {registerForm.formState.errors.confirmPassword.message}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={registerForm.formState.isSubmitting}
                  className="w-full bg-[#C6D600] hover:bg-[#B5C100] text-black font-medium"
                >
                  {registerForm.formState.isSubmitting ? "Creating account..." : "Create Account"}
                </Button>

                {/* Premium Upsell for Signup */}
                <div className="mt-4 p-4 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-lg border border-yellow-500/20">
                  <div className="flex items-center space-x-2 mb-2">
                    <Crown className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm font-medium text-yellow-500">Unlock Premium Features</span>
                  </div>
                  <ul className="text-xs text-gray-400 space-y-1 mb-3">
                    <li>• AI-powered insights and smart sorting</li>
                    <li>• Learning resource recommendations</li>
                    <li>• Advanced pattern recognition</li>
                    <li>• Unlimited thoughtmarks and sync</li>
                  </ul>
                  <Button
                    onClick={() => setLocation("/premium")}
                    size="sm"
                    className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-black text-xs"
                  >
                    Learn About Premium
                  </Button>
                </div>
              </form>
            )}

            <div className="mt-6 text-center">
              <Button
                variant="link"
                onClick={() => setCurrentScreen(currentScreen === "login" ? "register" : "login")}
                className="text-[#C6D600] hover:text-[#B5C100]"
              >
                {currentScreen === "login" 
                  ? "Don't have an account? Create Account" 
                  : "Already have an account? Log in"
                }
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Forgot Password Dialog */}
        {showForgotPassword && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-md bg-gray-800 border-gray-700">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowForgotPassword(false)}
                    className="p-1 h-auto"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </Button>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Mail className="w-5 h-5" />
                    Reset Password
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {!resetCode ? (
                  <>
                    <p className="text-sm text-gray-400">
                      Enter your email address and we'll send you a reset code.
                    </p>
                    <Input
                      type="email"
                      placeholder="Email address"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                    <Button
                      onClick={handleForgotPassword}
                      disabled={isResetting || !forgotEmail}
                      className="w-full bg-[#C6D600] hover:bg-[#B5C100] text-black"
                    >
                      {isResetting ? "Sending..." : "Send Reset Code"}
                    </Button>
                  </>
                ) : (
                  <>
                    <p className="text-sm text-gray-400">
                      Enter the reset code and your new password.
                    </p>
                    <Input
                      type="text"
                      placeholder="Reset code"
                      value={resetCode}
                      onChange={(e) => setResetCode(e.target.value)}
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                    <Input
                      type="password"
                      placeholder="New password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                    <Button
                      onClick={handleResetPassword}
                      disabled={isResetting || !resetCode || !newPassword}
                      className="w-full bg-[#C6D600] hover:bg-[#B5C100] text-black"
                    >
                      {isResetting ? "Resetting..." : "Reset Password"}
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* PIN Login Screen */}
        {currentScreen === "pin" && (
          <div className="fixed inset-0 bg-black/90 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-md bg-gray-800 border-gray-700">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setCurrentScreen("login")}
                    className="p-1 h-auto"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </Button>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <KeyIcon className="w-5 h-5" />
                    Enter PIN
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-sm text-gray-400 text-center">
                  Enter your 4-digit PIN to access Thoughtmarks
                </p>
                <div className="flex justify-center">
                  <div className="flex gap-2">
                    {[0, 1, 2, 3].map((index) => (
                      <input
                        key={index}
                        type="number"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        maxLength={1}
                        onChange={(e) => {
                          const value = e.target.value.slice(-1); // Only take last digit
                          const inputs = document.querySelectorAll('[data-pin-login-index]') as NodeListOf<HTMLInputElement>;
                          const currentPin = Array.from(inputs).map(input => input.value).join('');
                          const newPin = currentPin.split('');
                          newPin[index] = value;
                          
                          const updatedPin = newPin.join('').slice(0, 4);
                          
                          // Auto-focus next input
                          if (value && index < 3) {
                            const nextInput = document.querySelector(`input[data-pin-login-index="${index + 1}"]`) as HTMLInputElement;
                            if (nextInput) {
                              nextInput.focus();
                            }
                          }
                          
                          // Auto-submit when PIN is complete
                          if (updatedPin.length === 4) {
                            handlePinLogin(updatedPin);
                          }
                        }}
                        onKeyDown={(e) => {
                          // Handle backspace
                          if (e.key === 'Backspace' && !e.currentTarget.value && index > 0) {
                            const prevInput = document.querySelector(`input[data-pin-login-index="${index - 1}"]`) as HTMLInputElement;
                            if (prevInput) {
                              prevInput.focus();
                            }
                          }
                        }}
                        onFocus={(e) => e.target.select()}
                        data-pin-login-index={index}
                        autoFocus={index === 0}
                        className="w-12 h-12 text-lg text-center border-2 border-gray-600 rounded-md bg-gray-700 text-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800"
                      />
                    ))}
                  </div>
                </div>
                <div className="text-center">
                  <Button
                    variant="link"
                    onClick={() => setCurrentScreen("login")}
                    className="text-gray-400 hover:text-white text-sm"
                  >
                    Use email and password instead
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* PIN Setup Modal */}
        {showPinSetup && authenticatedUserId && (
          <PinSetup
            email={loginForm.getValues('email')}
            userId={authenticatedUserId}
            onComplete={() => {
              setShowPinSetup(false);
              setAuthenticatedUserId(null);
              toast({
                title: "PIN Setup Complete",
                description: "You can now sign in quickly with your PIN",
              });
              window.location.href = "/dashboard";
            }}
            onCancel={() => {
              setShowPinSetup(false);
              setAuthenticatedUserId(null);
              window.location.href = "/dashboard";
            }}
          />
        )}

        {/* PIN Setup Modal for New Users */}
        <PinSetupModal
          isOpen={showPinSetupModal}
          onClose={() => setShowPinSetupModal(false)}
          onSuccess={() => {
            setShowPinSetupModal(false);
            setUserHasPin(true);
            setPinAuthPreference(true);
            
            // Set PIN as preferred login method for future visits
            userPreferences.togglePinAuth(true);
            userPreferences.setLastLoginMethod('pin');
            
            toast({
              title: "PIN Setup Complete",
              description: "PIN authentication enabled for quick login",
            });
            
            // If user was authenticated during setup, redirect to dashboard
            if (authenticatedUserId) {
              setAuthenticatedUserId(null);
              window.location.href = "/dashboard";
            } else {
              // Otherwise, show PIN login screen
              setCurrentScreen("pin");
            }
          }}
        />
      </div>
    </div>
  );
}
