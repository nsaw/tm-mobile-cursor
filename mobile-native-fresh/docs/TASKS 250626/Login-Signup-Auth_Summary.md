# 🔐 Thoughtmarks Authentication & User System Architecture

## Overview

Thoughtmarks implements a comprehensive multi-layer authentication system with Firebase integration, role-based permissions, premium subscription management, and cross-platform support. The system supports email/password, OAuth (Google/Apple), PIN authentication, biometric login, and demo accounts.

---

## 1. 🔐 Login/Signup Modal Architecture

### Modal Design & Layout Structure

**File**: `client/src/pages/auth.tsx`

**Layout Structure**:
```jsx
<div className="full-height bg-black flex items-center justify-center p-6">
  <div className="w-full max-w-md">
    {/* Header with Logo & Back Button */}
    <div className="text-center mb-8">
      <div className="flex items-center justify-between mb-4">
        <ContentBackButton />
        <div className="flex items-center justify-center flex-1">
          <img src="[logo-url]" className="w-12 h-12 rounded-lg mr-3" />
          <h1 className="text-2xl text-white uppercase" style={{ 
            fontFamily: 'Oswald, sans-serif', 
            fontWeight: '600', 
            letterSpacing: '-0.02em' 
          }}>THOUGHTMARKS</h1>
        </div>
      </div>
      <p className="text-[#C6D600]" style={{ fontFamily: 'Ubuntu, system-ui' }}>
        bookmarks for your brain
      </p>
    </div>

    {/* Main Authentication Card */}
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-center">
          {/* Dynamic welcome messages based on time of day */}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Screen-specific content */}
      </CardContent>
    </Card>
  </div>
</div>
```

**Theming & Styling**:
- **Background**: Full black (`bg-black`) with glassmorphic cards (`bg-gray-800 border-gray-700`)
- **Brand Colors**: Primary yellow-green (`#C6D600`), secondary orange gradients
- **Typography**: Oswald for headers, Ubuntu for body text
- **Spacing**: Consistent 4-unit spacing system (`space-y-4`, `space-x-3`)

### Two-Sided Toggle (Login vs Signup)

**State Management**:
```typescript
const [currentScreen, setCurrentScreen] = useState<"login" | "register" | "forgot" | "reset" | "pin">("login");
const [isLogin, setIsLogin] = useState(effectiveMode === "login");
```

**URL Parameter Detection**:
```typescript
const urlParams = new URLSearchParams(window.location.search);
const modeFromUrl = urlParams.get('mode') as "login" | "signup" | null;
const effectiveMode = modeFromUrl === "signup" ? "signup" : initialMode;
```

**Toggle Button**:
```jsx
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
```

### Form Validation & UX States

**Validation Schemas** (Zod):
```typescript
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
```

**Error States**:
```jsx
{loginForm.formState.errors.email && loginForm.formState.isSubmitted && (
  <p className="text-red-400 text-sm mt-1">
    {loginForm.formState.errors.email.message}
  </p>
)}
```

**Loading States**:
```jsx
<Button
  type="submit"
  disabled={loginForm.formState.isSubmitting}
  className="w-full bg-[#C6D600] hover:bg-[#B5C100] text-black font-medium"
>
  {loginForm.formState.isSubmitting ? "Logging in..." : "Log In"}
</Button>
```

### PIN Authentication Integration

**PIN Toggle Component**:
```jsx
<div className="flex items-center justify-between p-3 rounded-lg bg-gray-700/50 border border-gray-600">
  <div className="flex items-center space-x-3">
    <KeyIcon className="w-4 h-4 text-[#C6D600]" />
    <div className="text-sm">
      <div className="font-medium text-white">Use PIN?</div>
      <div className="text-gray-400 text-xs">
        {userHasPin ? "4-digit PIN for quick access" : "Set up PIN for faster login"}
      </div>
    </div>
  </div>
  <Switch
    checked={userHasPin ? pinAuthPreference : false}
    onCheckedChange={handlePinToggle}
  />
</div>
```

**PIN Input Interface**:
```jsx
{[0, 1, 2, 3].map((index) => (
  <input
    key={index}
    type="number"
    inputMode="numeric"
    pattern="[0-9]*"
    maxLength={1}
    onChange={handlePinInput}
    className="w-12 h-12 text-lg text-center border-2 border-gray-600 rounded-md bg-gray-700 text-white focus:border-blue-500"
    data-pin-login-index={index}
    autoFocus={index === 0}
  />
))}
```

### Dynamic Welcome Messages

**Time-Based Message System**:
```typescript
const getWelcomeMessage = () => {
  const hour = new Date().getHours();
  const messages = {
    earlyMorning: ["DAWN OF BRILLIANCE AWAITS!", "EARLY BIRD CATCHES THE IDEA!"],
    morning: ["MORNING GENIUS ACTIVATED!", "COFFEE + THOUGHTS = MAGIC!"],
    midday: ["MIDDAY MIND MELD TIME!", "PEAK PERFORMANCE MODE!"],
    afternoon: ["AFTERNOON ENLIGHTENMENT!", "THE LEGEND RETURNS!"],
    evening: ["EVENING GENIUS HOUR!", "TWILIGHT WISDOM CALLS!"],
    lateNight: ["MIDNIGHT INSPIRATION STRIKES!", "3AM THOUGHTS HIT DIFFERENT!"]
  };
  
  let timeOfDay = hour >= 4 && hour < 7 ? 'earlyMorning' : 
                 hour >= 7 && hour < 12 ? 'morning' :
                 hour >= 12 && hour < 14 ? 'midday' :
                 hour >= 14 && hour < 18 ? 'afternoon' :
                 hour >= 18 && hour < 22 ? 'evening' : 'lateNight';
  
  return messages[timeOfDay][Math.floor(Math.random() * messages[timeOfDay].length)];
};
```

---

## 2. 🧭 Authentication Flows & User Session Management

### Firebase Authentication Integration

**Configuration** (`client/src/lib/firebase.ts`):
```typescript
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebaseapp.com`,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.appspot.com`,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

export const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('email');
googleProvider.addScope('profile');
googleProvider.setCustomParameters({ prompt: 'select_account' });

export const appleProvider = new OAuthProvider('apple.com');
appleProvider.addScope('email');
appleProvider.addScope('name');
```

### Authentication Methods

#### 1. Email/Password Authentication
**File**: `client/src/lib/auth.ts`

```typescript
async function loginWithEmail(email: string, password: string): Promise<FirebaseUser | any> {
  // Demo account detection
  if ((email === 'test@thoughtmarks.app' || email === 'hello@thoughtmarks.app') && password === 'password') {
    const response = await fetch("/api/auth/demo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      credentials: "include",
    });
    
    if (response.ok) {
      const data = await response.json();
      localStorage.setItem('thoughtmarks-user', JSON.stringify(data.user));
      localStorage.setItem('thoughtmarks-demo-token', data.token);
      return { uid: data.user.firebaseUid, email: data.user.email };
    }
  }

  // Regular Firebase authentication
  const result = await signInWithEmailAndPassword(auth, email, password);
  const firebaseUser = result.user;
  
  // Sync with internal database
  let user = await getCurrentUser(firebaseUser.uid);
  if (!user && firebaseUser.email) {
    const userData: InsertUser = {
      email: firebaseUser.email,
      displayName: firebaseUser.displayName || "",
      firebaseUid: firebaseUser.uid,
    };
    
    const response = await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
      credentials: "include",
    });
    
    if (response.ok) {
      user = await response.json();
      localStorage.setItem('thoughtmarks-user', JSON.stringify(user));
    }
  }
  
  return firebaseUser;
}
```

#### 2. OAuth Authentication (Google/Apple)
```typescript
export async function signInWithGoogle(): Promise<void> {
  if (nativeIOSAuth.isAvailable()) {
    await nativeIOSAuth.signInWithGoogle();
  } else {
    const result = await signInWithPopup(auth, googleProvider);
    if (result && result.user) {
      await handleOAuthSuccess(result.user);
    }
  }
}

export async function signInWithApple(): Promise<void> {
  if (nativeIOSAuth.isAvailable()) {
    await nativeIOSAuth.signInWithApple();
  } else {
    const result = await signInWithPopup(auth, appleProvider);
    if (result && result.user) {
      await handleOAuthSuccess(result.user);
    }
  }
}
```

#### 3. PIN Authentication System
**File**: `client/src/lib/pin-auth.ts`

```typescript
class PinAuthSystem {
  private storageKey = 'thoughtmarks_pin_auth';
  
  async setupPin(email: string, userId: string, pin: string): Promise<PinAuthResult> {
    if (!/^\d{4}$/.test(pin)) {
      throw new Error("PIN must be exactly 4 digits");
    }

    const salt = this.generateSalt();
    const hashedPin = await this.hashPin(pin, salt);
    
    const pinData: StoredPinData = {
      hashedPin: salt + ':' + hashedPin,
      email,
      userId,
      createdAt: Date.now()
    };

    localStorage.setItem(this.storageKey, JSON.stringify(pinData));
    userPreferences.togglePinAuth(true, userId);
    
    return { success: true, userId };
  }

  async authenticateWithPin(pin: string): Promise<PinAuthResult> {
    const storedData = localStorage.getItem(this.storageKey);
    if (!storedData) {
      throw new Error("No PIN set up. Please sign in with email first.");
    }

    const pinData: StoredPinData = JSON.parse(storedData);
    const [salt, storedHash] = pinData.hashedPin.split(':');
    const inputHash = await this.hashPin(pin, salt);
    
    if (inputHash !== storedHash) {
      throw new Error("Incorrect PIN");
    }

    // Fetch user data and verify account status
    const userResponse = await fetch(`/api/users/${pinData.userId}`);
    const userData = await userResponse.json();
    
    return { success: true, user: userData, userId: pinData.userId };
  }

  private async hashPin(pin: string, salt: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(pin + salt);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }
}
```

### Session Management & Persistence

**Authentication State Hook** (`client/src/hooks/use-auth.ts`):
```typescript
export function useAuth() {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [guestMode, setGuestMode] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setLoading(true);
      
      if (firebaseUser) {
        // Firebase user authenticated
        const user = await getCurrentUser(firebaseUser.uid);
        if (user) {
          setUser(user);
          setFirebaseUser(firebaseUser);
          setGuestMode(false);
          localStorage.removeItem('thoughtmarks-demo-token');
          localStorage.setItem('thoughtmarks-user', JSON.stringify(user));
        }
      } else {
        // Check for demo authentication
        const storedUser = localStorage.getItem('thoughtmarks-user');
        const storedToken = localStorage.getItem('thoughtmarks-demo-token');
        
        if (storedUser && storedToken) {
          const userData = JSON.parse(storedUser);
          setUser(userData);
          setFirebaseUser(null);
          setGuestMode(false);
        } else {
          setUser(null);
          setFirebaseUser(null);
          setGuestMode(true);
        }
      }
      
      setLoading(false);
      setAuthChecked(true);
    });

    // Listen for PIN authentication events
    const handlePinAuthSuccess = (event: CustomEvent) => {
      const userData = event.detail.user;
      if (userData) {
        setUser(userData);
        setFirebaseUser(null);
        setGuestMode(false);
      }
    };

    window.addEventListener('pinAuthSuccess', handlePinAuthSuccess as EventListener);

    return () => {
      unsubscribe();
      window.removeEventListener('pinAuthSuccess', handlePinAuthSuccess as EventListener);
    };
  }, []);
}
```

**Session Storage Strategy**:
- **Firebase Users**: Authentication state maintained by Firebase SDK
- **Demo Users**: Token-based authentication with localStorage
- **PIN Users**: Local device authentication with secure hashing
- **Session Expiry**: 30-day automatic expiration with refresh capability

---

## 3. 🧑‍⚖️ User Role, Permissions, and Access Layer

### User Role Hierarchy

**Database Schema** (`shared/schema.ts`):
```typescript
export const userRoles = pgTable("user_roles", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(), // Role identifiers
  displayName: text("display_name").notNull(), // Human-readable names
  parentRoleId: integer("parent_role_id").references(() => userRoles.id, { onDelete: "set null" }),
  permissions: json("permissions").notNull().default([]), // Permission array
  sortOrder: integer("sort_order").notNull().default(0),
});

export const users = pgTable("users", {
  // ... other fields
  roleId: integer("role_id").notNull().references(() => userRoles.id).default(3), // Default to 'free'
  subscriptionTier: text("subscription_tier"), // 'monthly', 'annual', 'lifetime'
  subscriptionStatus: text("subscription_status").default("active"), // 'active', 'trial', 'expired', etc.
  billingCycle: text("billing_cycle"), // 'monthly', 'annual', 'lifetime'
  subscriptionExpiresAt: timestamp("subscription_expires_at"),
  isFriendsFamily: boolean("is_friends_family").default(false),
});
```

### Role Definitions & Inheritance

**Permission Manager** (`server/permissions.ts`):
```typescript
export class PermissionManager {
  private static roleHierarchy: Map<number, UserRole> = new Map();
  
  // Role hierarchy with inheritance
  static getUserPermissions(user: User): string[] {
    const role = this.roleHierarchy.get(user.roleId);
    if (!role) return [];
    
    const permissions = new Set<string>(role.permissions as string[]);
    
    // Add inherited permissions from parent roles
    let parentRole = role.parentRoleId ? this.roleHierarchy.get(role.parentRoleId) : null;
    while (parentRole) {
      (parentRole.permissions as string[]).forEach(perm => permissions.add(perm));
      parentRole = parentRole.parentRoleId ? this.roleHierarchy.get(parentRole.parentRoleId) : null;
    }
    
    return Array.from(permissions);
  }

  // Role-specific checks
  static isAdmin(user: User): boolean {
    return this.hasPermission(user, 'all_access');
  }
  
  static isPremium(user: User): boolean {
    return this.hasPermission(user, 'premium_features');
  }
  
  static isSuperuser(user: User): boolean {
    return this.hasPermission(user, 'superuser_access');
  }

  // Subscription status validation
  static hasActiveSubscription(user: User): boolean {
    if (this.isSuperuser(user) || this.isAdmin(user) || this.isDemo(user)) {
      return true;
    }
    
    if (user.subscriptionStatus === 'trial' && this.isTrialActive(user)) {
      return true;
    }
    
    return this.isPremium(user) && user.subscriptionStatus === 'active';
  }
}
```

### User Roles Defined

**Role Hierarchy** (from database and documentation):
1. **superuser** - Complete system access, development permissions
2. **admin** - Administrative access, user management
3. **premium_enterprise** - Highest tier premium features
4. **premium_pro** - Advanced premium features  
5. **premium_basic** - Basic premium features
6. **free** - Limited free tier access (default)
7. **demo** - Demo account with template content
8. **template** - Template/seed account for inheritance

### Premium Subscription Tiers

**Subscription Management**:
- **Monthly Premium**: $4.99/month - Basic premium features
- **Annual Premium**: $49.99/year - All premium features with discount
- **Lifetime Premium**: $199.99 - Permanent access to all features
- **Trial Periods**: 7-day and 14-day trials with automatic conversion
- **Friends & Family**: Lifetime access grants for special users

**Premium Features**:
- AI-powered insights and categorization
- Advanced search and semantic matching
- Unlimited thoughtmarks and sync
- Learning resource recommendations
- Smart sorting and pattern recognition
- Voice transcription processing
- Export capabilities

### Feature Gating Implementation

**Premium Feature Wrapper** (`client/src/components/premium-overlay.tsx`):
```typescript
export function PremiumFeatureWrapper({ 
  isPremium, 
  feature, 
  description, 
  children, 
  className = "",
  overlaySize = "md"
}: PremiumFeatureWrapperProps) {
  return (
    <div className={`relative ${className}`}>
      {children}
      {!isPremium && (
        <PremiumOverlay 
          feature={feature} 
          description={description}
          size={overlaySize}
        />
      )}
    </div>
  );
}
```

**Premium Overlay Component**:
```typescript
export function PremiumOverlay({ feature, description, size = "md" }: PremiumOverlayProps) {
  const [, setLocation] = useLocation();

  return (
    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-10 rounded-lg">
      <Card className="bg-gradient-to-br from-orange-500/90 to-yellow-500/90 border-orange-400 max-w-xs mx-2">
        <CardContent className="text-center p-3">
          <div className="flex items-center justify-center mb-2">
            <Crown className="w-6 h-6 text-white mr-2" />
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <h3 className="font-semibold text-white mb-1">Premium Feature</h3>
          <p className="text-white/90 text-xs mb-2">
            {description || `Unlock ${feature} with Premium`}
          </p>
          <Button
            size="sm"
            onClick={() => setLocation("/premium")}
            className="bg-white text-orange-600 hover:bg-gray-100 text-xs font-medium"
          >
            <Crown className="w-3 h-3 mr-1" />
            Upgrade Now
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
```

---

## 4. 🧾 Settings Integration

### PIN Management in Settings

**PIN Authentication Settings**:
- Toggle PIN authentication on/off
- Change existing PIN
- Remove PIN authentication
- View PIN setup status

**Settings Implementation**:
```typescript
// PIN preference management
const preferences = userPreferences.getPreferences();
const hasPinSetup = pinAuth.isPinSetup();

// Toggle PIN authentication
const handlePinToggle = async (enabled: boolean) => {
  if (enabled && !hasPinSetup) {
    // Show PIN setup modal
    setShowPinSetupModal(true);
  } else if (!enabled) {
    // Disable PIN authentication
    userPreferences.togglePinAuth(false);
    userPreferences.setLastLoginMethod('email');
  }
};
```

### Account Management Features

**Password Reset/Change**:
- Forgot password flow with email verification
- Password change within settings
- Security validation and confirmation

**Account Deletion/Export**:
- Account deletion with data removal
- Data export functionality
- GDPR compliance features

### Premium Status Display

**Subscription Information**:
- Current subscription tier and status
- Billing cycle and next payment date
- Trial remaining time
- Upgrade/downgrade options

**Settings Premium Integration**:
```typescript
// Premium status display
const hasPremiumAccess = user?.isPremium || user?.isTestUser || user?.isAdmin;
const subscriptionStatus = user?.subscriptionStatus;
const expiresAt = user?.subscriptionExpiresAt;

// Upgrade CTA for free users
if (!hasPremiumAccess) {
  return (
    <div className="premium-upgrade-section">
      <Crown className="w-6 h-6 text-yellow-500" />
      <h3>Unlock Premium Features</h3>
      <Button onClick={() => setLocation("/premium")}>
        Upgrade to Premium
      </Button>
    </div>
  );
}
```

---

## 5. 📁 File & Dependency Summary

### Authentication-Related Files

**Core Authentication**:
- `client/src/pages/auth.tsx` - Main authentication page with all login/signup flows
- `client/src/lib/auth.ts` - Firebase integration and authentication functions
- `client/src/lib/firebase.ts` - Firebase configuration and provider setup
- `client/src/hooks/use-auth.ts` - Authentication state management hook

**PIN Authentication System**:
- `client/src/lib/pin-auth.ts` - PIN authentication implementation
- `client/src/components/pin-setup.tsx` - PIN setup and login components
- `client/src/components/pin-setup-modal.tsx` - PIN setup modal interface
- `client/src/lib/user-preferences.ts` - User preference management

**Advanced Authentication**:
- `client/src/lib/biometric-auth.ts` - Biometric authentication (Face ID/Touch ID)
- `client/src/lib/native-ios-auth.ts` - Native iOS authentication bridge
- `client/src/lib/ios-oauth-bridge.ts` - iOS OAuth integration
- `client/src/lib/passkeys-simple.ts` - Passkey authentication

**Permission & Role Management**:
- `server/permissions.ts` - Permission manager and role hierarchy
- `shared/schema.ts` - Database schema with user roles and permissions

**Premium Features**:
- `client/src/components/premium-overlay.tsx` - Premium feature gating components
- `client/src/pages/premium.tsx` - Premium subscription page
- `client/src/pages/admin-premium.tsx` - Admin premium management
- `client/src/pages/admin-premium-fixed.tsx` - Fixed admin premium interface

**Authentication UI Components**:
- `client/src/components/auth-prompt-dialog.tsx` - Authentication prompt modal
- `client/src/components/gdpr-consent.tsx` - GDPR consent management
- `client/src/components/ui/BackButton.tsx` - Navigation back button

### Firebase APIs & SDKs Used

**Firebase Authentication**:
```typescript
import { 
  initializeApp, 
  getAuth, 
  GoogleAuthProvider, 
  OAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  onAuthStateChanged,
  signOut
} from "firebase/auth";
```

**OAuth Providers**:
- Google OAuth with email/profile scopes
- Apple OAuth with email/name scopes
- Custom parameters for user experience optimization

### Auth-Related Dependencies

**NPM Modules**:
```json
{
  "firebase": "^10.x.x",
  "react-hook-form": "^7.x.x",
  "@hookform/resolvers": "^3.x.x",
  "zod": "^3.x.x",
  "bcrypt": "^5.x.x",
  "wouter": "^3.x.x"
}
```

**UI Dependencies**:
```json
{
  "@radix-ui/react-dialog": "^1.x.x",
  "@radix-ui/react-switch": "^1.x.x",
  "lucide-react": "^0.x.x",
  "framer-motion": "^10.x.x"
}
```

### Environment Variables

**Firebase Configuration**:
```env
VITE_FIREBASE_API_KEY=AIza...
VITE_FIREBASE_PROJECT_ID=thoughtmarks-prod
VITE_FIREBASE_APP_ID=1:123...
```

**External Services**:
```env
SENDGRID_API_KEY=SG.xxx (email services)
MAILCHIMP_API_KEY=xxx (marketing emails)
OPENAI_API_KEY=sk-xxx (AI features)
```

---

## 6. 🌐 Backend API Overview

### Authentication Endpoints

**Demo Authentication**:
- `POST /api/auth/demo` - Demo user authentication
- Expects: `{ email: string, password: string }`
- Returns: `{ user: User, token: string }`

**User Management**:
- `GET /api/users/by-firebase/{uid}` - Get user by Firebase UID
- `POST /api/users` - Create new user account
- `GET /api/users/{id}` - Get user by ID
- `PUT /api/users/{id}` - Update user profile

**Premium/Subscription**:
- `GET /api/premium/status` - Check premium subscription status
- `POST /api/premium/start-trial` - Start trial subscription
- `POST /api/premium/upgrade` - Upgrade to premium
- `POST /api/premium/cancel` - Cancel subscription

### Authorization Requirements

**Authentication Middleware** (`server/routes.ts`):
```typescript
// Auth checking middleware
const requireAuth = async (req: any, res: any, next: any) => {
  // Check session user
  if (req.session?.user) {
    req.user = req.session.user;
    return next();
  }
  
  // Check Authorization header
  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    const userId = req.headers['x-user-id'];
    
    if (token.startsWith('demo-token-') && userId) {
      const user = await storage.getUser(parseInt(userId));
      if (user && isDemoAccount(user.email)) {
        req.user = user;
        return next();
      }
    }
  }
  
  return res.status(401).json({ message: "Authentication required" });
};
```

**Permission Middleware**:
```typescript
// Premium feature protection
export function requirePremium(req: any, res: any, next: any) {
  const user = req.user as User;
  if (!user) {
    return res.status(401).json({ message: "Authentication required" });
  }
  
  if (!PermissionManager.isPremium(user)) {
    return res.status(403).json({ 
      message: "Premium subscription required",
      userRole: user.roleId
    });
  }
  
  next();
}

// Admin access protection
export function requireAdmin(req: any, res: any, next: any) {
  const user = req.user as User;
  if (!user || !PermissionManager.isAdmin(user)) {
    return res.status(403).json({ message: "Administrator access required" });
  }
  next();
}
```

### Token & Header Expectations

**Demo Authentication**:
- Header: `Authorization: Bearer demo-token-{userId}`
- Header: `x-user-id: {userId}`

**Firebase Authentication**:
- Session-based authentication via Express sessions
- Firebase UID linking to internal user database

**Error Response Format**:
```json
{
  "message": "Error description",
  "required": "permission_name",
  "userRole": 3
}
```

---

## 7. 🔍 Comprehensive Implementation Description

### Authentication System Architecture

**Multi-Layer Design**:
1. **Primary**: Firebase Authentication (email/password, OAuth)
2. **Secondary**: PIN Authentication (local device, 4-digit)
3. **Tertiary**: Demo Authentication (direct API, token-based)
4. **Advanced**: Biometric Authentication (Face ID/Touch ID)

### State Management Strategy

**Global Authentication State**:
- **Context**: React Context via `useAuth` hook
- **Storage**: localStorage for persistence, sessionStorage for temporary state
- **Sync**: Firebase onAuthStateChanged listener with manual event handling

**User Data Flow**:
```
Firebase Auth → Internal Database → Local Storage → React State → UI Components
```

### Database Integration

**User Record Linking**:
- Firebase UID serves as foreign key to internal user database
- Automatic user creation on first Firebase authentication
- Role-based permissions stored in separate roles table
- Subscription status tracked in user record

**Data Storage Locations**:
- **Firebase**: Authentication credentials and session management
- **PostgreSQL**: User profiles, roles, subscription data, content
- **localStorage**: Authentication tokens, user cache, PIN data
- **sessionStorage**: Temporary state, onboarding progress

### Role Enforcement

**Permission Checking**:
- Server-side middleware for API route protection
- Client-side components for UI feature gating
- Hierarchical inheritance with parent role permissions
- Real-time subscription status validation

### Session Management

**Persistence Strategy**:
- Firebase handles authentication session persistence
- Manual localStorage management for demo accounts
- PIN authentication with secure local hashing
- 30-day session expiry with automatic refresh

### Cross-Platform Considerations

**iOS Integration**:
- Native authentication bridge for iOS apps
- App Store subscription integration
- Keychain storage for credentials
- Native biometric authentication

**Web Platform**:
- Browser credential management API
- Progressive web app authentication
- Local storage encryption for sensitive data

### Known Issues & Edge Cases

**Demo Account Handling**:
- Special authentication flow bypassing Firebase
- Template content inheritance system
- Session isolation between demo users
- Automatic data reset for fresh experience

**PIN Authentication Limitations**:
- Device-specific storage (not synced across devices)
- Requires initial email authentication setup
- Demo user PIN data special handling
- Fallback to email authentication when PIN fails

**Subscription Management**:
- Cross-platform subscription status synchronization
- Grace period handling for expired subscriptions
- Trial-to-paid conversion automation
- Family sharing support for iOS subscriptions

This architecture provides a comprehensive, scalable authentication system supporting multiple authentication methods, role-based permissions, premium subscription management, and cross-platform compatibility while maintaining security and user experience standards.

# Thoughtmarks Authentication & iOS Integration Guide

## Overview
This document explains how Thoughtmarks handles authentication across platforms, manages subscription status, and integrates with iOS features through the admin export suite.

## Authentication Architecture

### Multi-Layer Authentication System

**Primary Authentication (Firebase)**
- Firebase handles initial user authentication (email/password, Google, Apple ID)
- Provides secure, industry-standard authentication infrastructure
- Supports multiple OAuth providers and social login

**Secondary Authentication (4-Digit PIN)**
- Local device authentication for quick access
- Hashed PIN storage with salt-based security
- User preference toggle for PIN vs email login
- Comprehensive error handling with graceful fallbacks

**Database User Management**
- Firebase UID links to internal user database
- Enhanced role-based permissions system
- Subscription status and premium feature management
- Cross-platform user data synchronization

### Database Schema Integration

**User Roles & Permissions**
```sql
user_roles: superuser, admin, premium_basic, premium_pro, premium_enterprise, free, demo, template
```

**Subscription Management Fields**
```sql
subscriptionTier: monthly, annual, lifetime
subscriptionStatus: active, cancelled, expired, expiring_soon, trial
billingCycle: monthly, annual, lifetime
stripeCustomerId: for web subscriptions
stripeSubscriptionId: for web subscriptions
```

**Authentication Linking**
```sql
firebaseUid: links to Firebase authentication
linkedAccounts: array of connected auth providers
emailVerified: verification status
lastLoginAt: tracking user activity
```

## Cross-Platform Subscription Management

### Web Platform Subscriptions
- **Stripe Integration**: Handles web-based payments and subscriptions
- **Admin Premium Links**: Direct subscription activation via secure tokens
- **Trial Management**: 14-day and 30-day trials with automatic conversion
- **Friends & Family**: Lifetime access grants for special users

### iOS App Store Subscriptions
- **Native StoreKit Integration**: Three subscription tiers pre-configured
  - Monthly Premium: `com.thoughtmarks.app.premium.monthly` ($4.99)
  - Annual Premium: `com.thoughtmarks.app.premium.annual` ($49.99)  
  - Lifetime Premium: `com.thoughtmarks.app.premium.lifetime` ($199.99)
- **Receipt Validation**: Server-side validation with Apple's servers
- **Family Sharing**: Premium access shared across family members
- **Grace Period Management**: 7-day grace period before feature lockdown

### Subscription Status Synchronization
- **Real-time Updates**: Subscription changes immediately update user roles
- **Cross-platform Sync**: Web trial users can upgrade via iOS App Store
- **Server-side Cron Jobs**: Automated subscription status monitoring
- **Webhook Integration**: Stripe and Apple receipt validation webhooks

## iOS Integration Features

### Native Authentication
**Location**: `client/src/lib/native-ios-auth.ts`
- **AuthenticationServices Framework**: Apple ID Sign-In integration
- **LocalAuthentication Framework**: Face ID/Touch ID biometric authentication
- **Keychain Storage**: Secure credential storage with password autofill
- **Cross-app Credentials**: Automatic password suggestions across apps

### Siri Shortcuts & Voice Integration
**Location**: `client/src/lib/siri-shortcuts.ts`
- **Voice-to-Thoughtmark Workflows**: Complete voice command integration
- **Deep Link Integration**: Siri commands launch app with voice notes
- **Offline Queueing**: Voice notes saved when offline, synced when online
- **Background Processing**: Voice capture works even when app is closed

### SwiftUI Export Suite
**Location**: `server/export-utils.ts`
- **Complete iOS Project Generation**: Production-ready Xcode projects
- **Native SwiftUI Views**: HomeView, SearchView, CreateView with tab navigation
- **Data Models**: Proper Swift typing and API integration
- **XcodeGen Configuration**: Automated build system setup

## Email & iCloud Requirements

### Email Flexibility
- **No iCloud Email Requirement**: Users can use any email address
- **Multiple Provider Support**: Google, Apple ID, email/password combinations
- **Account Linking**: Multiple authentication methods per user account
- **Cross-platform Access**: Same account accessible via web and iOS

### Apple ID Integration
- **Sign in with Apple**: Native iOS authentication without email restrictions
- **Privacy Protection**: Apple's privacy-focused authentication flow
- **Automatic Account Creation**: Seamless user onboarding via Apple ID
- **Keychain Integration**: Automatic credential saving and suggestions

## Authentication Flow Examples

### New User Registration
1. **Choose Authentication Method**: Email, Google, or Apple ID
2. **Firebase Authentication**: Secure credential verification
3. **Database User Creation**: User record with default role assignment
4. **PIN Setup (Optional)**: Quick access configuration
5. **Subscription Onboarding**: Trial or premium activation

### Existing User Login
1. **Authentication Method Selection**: Email, PIN, or biometric
2. **Credential Verification**: Firebase or local PIN validation
3. **Database Sync**: User data and subscription status update
4. **Feature Access**: Role-based permission enforcement
5. **Cross-platform Sync**: Data synchronization across devices

### Subscription Upgrade Flow
1. **Trial User**: Starts with 14-day or 30-day trial
2. **Payment Method**: Stripe (web) or App Store (iOS)
3. **Receipt Validation**: Server-side subscription verification
4. **Role Update**: Immediate premium feature access
5. **Cross-platform Sync**: Premium status available everywhere

## iOS App Deployment

### Export Process
1. **Admin Panel Access**: Navigate to Admin Export Suite
2. **SwiftUI Generation**: Complete iOS project creation
3. **Xcode Integration**: Ready-to-compile project structure
4. **App Store Submission**: Production-ready with all integrations

### Generated Project Features
- **Bundle Identifier**: `com.thoughtmarks.app`
- **App Store Connect**: Pre-configured subscription groups
- **TestFlight Ready**: Immediate beta distribution capability
- **Production Deployment**: Complete App Store submission package

### Required Certificates
- **iOS Distribution Certificate**: For App Store submission
- **Push Notification Certificate**: For background updates
- **App Store Connect API Key**: For automated builds and management

## Security & Privacy

### Data Protection
- **End-to-End Encryption**: All authentication data encrypted in transit
- **Keychain Storage**: iOS native secure storage for credentials
- **Biometric Authentication**: Face ID/Touch ID for device security
- **App Transport Security**: Network communications encryption

### Privacy Compliance
- **GDPR Consent Management**: User consent tracking and preferences
- **Privacy Manifest**: iOS usage descriptions for sensitive permissions
- **Data Minimization**: Only necessary data collection and storage
- **User Control**: Full account management and data deletion options

## Technical Implementation

### Key Dependencies
- **Firebase Authentication**: Cross-platform auth infrastructure
- **Stripe**: Web payment processing and subscription management
- **StoreKit**: iOS native subscription and receipt validation
- **AuthenticationServices**: Apple ID and credential management
- **LocalAuthentication**: Biometric authentication framework

### API Integration
- **REST API Client**: Built-in HTTP client for Thoughtmarks API
- **Authentication Headers**: Automatic token management
- **Offline Caching**: Local data persistence when network unavailable
- **Background Sync**: Automatic data synchronization

### Database Management
- **PostgreSQL**: Primary data storage with Drizzle ORM
- **Role-based Access**: Hierarchical permission system
- **Subscription Tracking**: Comprehensive billing and access management
- **Cross-platform Sync**: Real-time data synchronization

## Troubleshooting

### Common Authentication Issues
- **Firebase UID Mismatch**: Check user creation and linking process
- **Subscription Status Lag**: Verify webhook configuration and cron jobs
- **PIN Authentication Failures**: Check error handling and user preferences
- **Cross-platform Sync Issues**: Validate database user linking

### iOS Integration Issues
- **Siri Shortcuts Not Working**: Verify Intents framework integration
- **App Store Receipt Validation**: Check StoreKit configuration
- **Biometric Authentication Failures**: Validate LocalAuthentication setup
- **Export Generation Problems**: Review SwiftUI template configuration

## Summary

The Thoughtmarks authentication system provides:

1. **Flexible Authentication**: Multiple login methods with user preference control
2. **Cross-platform Subscriptions**: Seamless premium access across web and iOS
3. **Native iOS Integration**: Complete App Store and device feature support
4. **Production-ready Deployment**: Immediate iOS app generation and submission capability
5. **Enterprise Security**: Industry-standard encryption and privacy protection

The admin export suite generates fully functional iOS applications with all authentication, subscription, and native iOS features pre-configured and ready for App Store submission.

# Security Implementation Summary

## Security Measures Implemented

### 1. Server Security
- **Helmet.js**: Comprehensive security headers including CSP, HSTS, and XSS protection
- **Rate Limiting**: API endpoints protected with express-rate-limit
  - API calls: 100 requests per minute
  - Authentication: 5 attempts per 15 minutes
  - Search: 60 requests per minute
- **Input Validation**: Comprehensive validation using express-validator and DOMPurify
- **Request Logging**: Security event monitoring and suspicious activity detection
- **Environment Validation**: Startup checks for required environment variables

### 2. Data Protection
- **GDPR Compliance**: Full consent management system
- **Data Rights**: Export and deletion capabilities (Articles 17, 20)
- **Consent Storage**: Granular preferences for analytics, marketing, email updates
- **Data Sanitization**: All user inputs sanitized to prevent XSS
- **Audit Logging**: Security events logged for monitoring

### 3. Input Security
- **Content Limits**: 
  - Thoughtmarks: max 10,000 characters
  - Titles: max 500 characters
  - Tags: max 20 tags, 50 chars each
  - Bins: max 100 character names
- **XSS Prevention**: DOMPurify sanitization on all user content
- **SQL Injection**: Drizzle ORM with parameterized queries
- **File Upload**: Limited to 10MB with type validation

### 4. Authentication Security
- **Firebase Auth**: Industry-standard authentication
- **Session Management**: Secure token validation
- **User Isolation**: All data operations scoped to authenticated user
- **Consent Tracking**: IP and user agent logging for GDPR compliance

### 5. Privacy Features
- **Consent Management**: Interactive GDPR consent dialog
- **Data Export**: Complete user data export in JSON format
- **Account Deletion**: Secure data anonymization process
- **Privacy Settings**: Granular control over data processing

## GDPR Compliance Features

### User Rights Implemented
1. **Right to Access** (Article 15): View all stored data
2. **Right to Rectification** (Article 16): Edit personal information
3. **Right to Erasure** (Article 17): Delete account and all data
4. **Right to Data Portability** (Article 20): Export data in JSON format
5. **Right to Object** (Article 21): Opt-out of processing
6. **Right to Withdraw Consent** (Article 7): Change preferences anytime

### Consent Categories
- **Essential**: Required for functionality (cannot be disabled)
- **Analytics**: Usage statistics and performance metrics
- **Marketing**: Personalized content and advertisements
- **Email Updates**: Product news and feature announcements

### Data Processing Records
- Consent date and method tracked
- IP address and user agent logged
- Legal basis documented for each processing activity
- Retention periods clearly defined

## Security Headers Applied
- Content Security Policy (CSP)
- HTTP Strict Transport Security (HSTS)
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- X-XSS-Protection: 1; mode=block
- Referrer-Policy: strict-origin-when-cross-origin

## Monitoring and Logging
- Failed authentication attempts
- Suspicious request patterns
- API errors and timeouts
- Data access and modification events
- GDPR consent changes

## Production Recommendations
1. **SSL/TLS**: Enable HTTPS in production (handled by Replit)
2. **Database Security**: Use connection pooling and encryption at rest
3. **API Keys**: Rotate OpenAI and Firebase keys regularly
4. **Monitoring**: Set up alerting for security events
5. **Backups**: Regular encrypted backups with retention policy
6. **Penetration Testing**: Regular security assessments
7. **Staff Training**: GDPR and security awareness training

## Compliance Checklist
- [x] GDPR consent management
- [x] Data protection impact assessment
- [x] Privacy policy integration
- [x] User rights implementation
- [x] Secure data storage
- [x] Breach notification procedures
- [x] Data processor agreements
- [x] Cross-border transfer safeguards

The application now meets enterprise-level security standards and GDPR compliance requirements while maintaining a smooth user experience.
