
# MASTER TASK PLAN — vFinal

Unified Implementation Roadmap for Native Thoughtmarks App  
Platform: Expo + React Native + Firebase + Siri Shortcuts + Deep Linking  
Date: June 26, 2025

---

## ✅ COMPATIBILITY VERIFICATION

**Confirmed:**
- Same Firebase Auth, user schema, and backend APIs as webapp
- Premium roles, subscription models, and trial flow shared
- Cross-platform sync for voice data and user preferences
- Siri + Deep Link integrations are additive to web, not conflicting

**Requires Coordination:**
- Deep linking URL structure must match webapp routes
- Shortcut triggers should resolve to unified voice processing flow
- StoreKit must write validated subscriptions back to Firebase

---

## 🗓️ PHASED IMPLEMENTATION PLAN

### 🔹 PHASE 1: FOUNDATION (Week 1–2)

- [CRITICAL] Deep linking infrastructure with `thoughtmarks://` scheme + handler
- [CRITICAL] Siri Shortcuts service (patch React conflict via messageHandlers)
- [HIGH] Firebase configuration: `.env`, modular setup, CI masking

### 🔹 PHASE 2: AUTHENTICATION & INTEGRATION (Week 2–3)

- [HIGH] Firebase Auth Emulator fallback (for dev/debug)
- [HIGH] Session hydration + AsyncStorage guard (corruption fallback)
- [HIGH] App state listener (auto-expire session on idle/background)

### 🔹 PHASE 3: VOICE & SIRI (Week 3–4)

- [HIGH] Siri → thoughtmark voice capture shortcut
- [HIGH] Background voice queue for offline notes
- [MEDIUM] Streamed voice-to-text fallback when signal is poor

### 🔹 PHASE 4: APP STORE & SUBSCRIPTIONS (Week 4–5)

- [HIGH] StoreKit integration with iOS receipt validation
- [HIGH] Sync subscription status across web and app
- [MEDIUM] Add family sharing support logic (via Apple receipt claims)

### 🔹 PHASE 5: ADVANCED FEATURES (Week 5–6)

- [MEDIUM] Add iOS-specific enhancements (Face ID unlock, haptics, share sheet)
- [MEDIUM] Background sync and notification scheduling logic

### 🔹 PHASE 6: QA + RELEASE (Week 6–7)

- [HIGH] Deep link flow testing (cold start, resume, Siri handoff)
- [HIGH] Cross-platform and offline testing (web, iOS, Android)
- [HIGH] App Store prep: Screenshots, privacy policy, beta flight, metadata

---

## 🔐 SECURITY & STRUCTURE TASKS

- [x] AsyncStorage token restore implemented
- [ ] Hydration guard and fallback error screen
- [ ] Invalidate stale tokens and auto-logout
- [ ] Wrap all premium components with `PremiumFeatureWrapper`
- [ ] Modular PermissionManager with fallback for unknown roles

---

## 🔗 DEEP LINK + SIRI CHECKLIST

- [x] Universal scheme registered in `app.json`
- [ ] Add deep link abstraction: `/new`, `/insight/:id`, `/premium`, `/invite`
- [ ] Block routing until context is ready (`useAuth().authChecked`)
- [ ] Add Siri shortcut config docs or in-app onboarding

---

## 💵 STOREKIT & PREMIUM ROLES

- [ ] StoreKit trigger for iOS-only
- [ ] `/api/premium/validate-receipt` POST working in Expo
- [ ] Firebase `roleId` set after Apple receipt verified
- [ ] All trial logic surfaced in Settings and SmartInsights

---

## 🧪 LAUNCH READINESS CHECKLIST

- [ ] Deep linking stable across cold/warm states
- [ ] Firebase auth fully working with emulator and prod
- [ ] Siri voice shortcut triggers consistent routing
- [ ] StoreKit subscription tested, validated, and synced
- [ ] Role-based UI and backend sync verified
- [ ] Session restore safe, fallback error state shown
- [ ] Modal spacing + accessibility confirmed
- [ ] All tests passed for offline, background, cold-start

---

## CRITICAL ADDITIONS (FROM GPT DIFF AUDIT)

- ✅ Firebase Auth Emulator fallback
- ✅ Session hydration guardrails
- ✅ Universal error fallback layer (not just toasts)
- ✅ Deep link route rehydration block
- ✅ Role-based component fallback logic
- ✅ Build-time guard for Firebase config injection
- ✅ Dependency safety validation (prevent `react-native-firebase` misuse)

---

Deliverable: `MASTERDOC_native.md` complete  
Git Tag: `v1.3.0_implementation-plan-complete`

