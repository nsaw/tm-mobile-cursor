
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





//////////////////////////////////////////////////////////////// N O T E S \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

---

### 🧠 Correct Execution Order

#### ✅ **1. Run First:** `deeplink-handler.hybrid-block-v1.json`

* Sets up foundational `useDeepLinkHandler()`
* Hooks into `Linking.getInitialURL()` and listeners
* Blocks navigation until `authChecked === true`
* Handles shared route parsing (`/new`, `/premium`, etc.)

📌 This ensures that all future deep links (Siri included) are safely gated.

---

#### ✅ **2. Then Run:** `siri-shortcut-handler.hybrid-block-v1.json`

* Relies on `thoughtmarks://` already being parsed by the above
* Adds Siri-safe logic to redirect unauthenticated users to login
* Routes to `/new` after Siri opens app

📌 Think of this as an “extension” of the deep link handler with Siri logic layered on top.

---

#### ✅ **3. Then Run:** `EAS_voice-capture-integrated-lintloop.hybrid-block-v1.json`

* Builds out the **voice-specific deep link**: `thoughtmarks://capture?text=`
* Installs helper files, sets up autofill, AI title, tags, bin
* Enables Siri Shortcut onboarding + bottom nav mic integration

📌 This assumes both the handler and route gating are already present and safe.

---

### 💡TL;DR Execution Order

1. ✅ `deeplink-handler.hybrid-block-v1.json`
2. ✅ `siri-shortcut-handler.hybrid-block-v1.json`
3. ✅ `EAS_voice-capture-integrated-lintloop.hybrid-block-v1.json` (with OCD linter looping)

Once you hit step 3, everything else (handlers, autofill, navigation, Siri/Google entry points) is composable and safe to build on. Want me to generate a `.sh` task runner that automates this entire sequence for Cursor or CLI deployment?



# EAS

Start after script has ran: npx ts-node scripts/lint-voice-capture.ts

In background during install @task run tm-mobile-cursor/tasks/hybrid_blocks/EAS_LINT-LOOP.hybrid-block-v1.json

**Absolutely. Here’s the comprehensive new-style Cursor hybrid block—in .md format—for the Siri + Android Assistant voice-to-Thoughtmark capture system. It's production-ready, themed, auto-saving, triggerable from Siri/Google, with onboarding and settings UI fully included. Android fallback and deferred App Actions integration are stubbed in but safe. You’re clear to link in the Siri shortcut manually post-wiring.

📦 voice-capture-integrated.hybrid-block-v1.md
{
  ////////////////////////////////////////////
  ////////////////////////////////////////////
  // 🧠 MISSION: Voice-to-Thoughtmark Full Capture System
  // 🎯 GOAL: Complete Siri/Google voice dictation capture with auto-title, tag, bin, and UI setup
  // ✅ PRE-CHECK: Tag rollback for full git recovery
  // ✅ DO NOT STOP — execute full block in order
  // ✅ Run `npm run lint:fix-all` continuously
  // ✅ Autofill, AI title, and background-aware flows included
  📌 BEFORE ANY FILE CHANGES:
  git add .
  git commit -m "chore(rollback): pre-voice-capture-integration snapshot"
  git tag v1.3.3_voice-capture—ROLLBACK
  git push origin v1.3.3_voice-capture—ROLLBACK
  ////////////////////////////////////////////
  ////////////////////////////////////////////

  "branch": "feature/voice-capture-complete",
  "mode": "auto",
  "watchConsole": true,
  "onReloadHang": "Move to background and resume automatically",

  "phases": [

    {
      "section": "Shortcut + Deep Link Infrastructure",
      "actions": [
        "In `src/navigation/deepLinks.ts`, register deep link `thoughtmarks://capture?text=`",
        "Pass decoded text to `NewThoughtmarkScreen` via route.params.body",
        "Set flag route.params.voiceCapture=true to trigger autofill",
        "In Android, register `intent-filter` for ACTION_VIEW with scheme thoughtmarks"
      ],
      "commit": "feat: universal capture deep link handler",
      "tag": "v1.3.3_deeplink-handler"
    },

    {
      "section": "Thoughtmark Autofill Logic",
      "actions": [
        "In `NewThoughtmarkScreen.tsx`, if `voiceCapture === true`, auto-fill:",
        "→ context/body from route.params.body",
        "→ tags: ['#voice-to-tm', '#sort later']",
        "→ bin: 'Sort Later' via defaultBinSelector() helper",
        "→ title: use `suggestTitleFromBody(text: string)` from `ai/utils/titleSuggester.ts`",
        "Auto-save on mount, but keep editor open"
      ],
      "commit": "feat: autofill voice content + AI title + auto-save",
      "tag": "v1.3.3_autofill-autosave"
    },

    {
      "section": "Bottom Nav Manual Trigger Hook",
      "actions": [
        "Connect middle red mic icon in BottomNavBar to route user to `NewThoughtmarkScreen` with:",
        "→ voiceCapture: true",
        "→ body: '' (empty string triggers real-time dictation modal fallback)",
        "Display dictation modal or shortcut redirect fallback if empty"
      ],
      "commit": "feat: bottom mic icon routes to voice capture flow",
      "tag": "v1.3.3_manual-mic-trigger"
    },

    {
      "section": "Siri Shortcut One-Click Setup",
      "actions": [
        "In `src/features/onboarding/components/ShortcutPanel.tsx`, add card: 'Capture Thoughts with Siri'",
        "Add button: 'Set Up Siri Shortcut'",
        "Button opens `https://www.icloud.com/shortcuts/e860df7cc2dd437aa76d0bb4f7b9b5f3` in Safari",
        "In Settings, add toggle panel to rename shortcut trigger",
        "Suggest: 'Capture this thought', 'Remember this', 'Note this moment'"
      ],
      "commit": "feat: Siri shortcut setup UI in onboarding + settings",
      "tag": "v1.3.3_siri-shortcut-ui"
    },

    {
      "section": "Google Assistant / Android Fallback",
      "actions": [
        "Stub handler in `src/voice/androidCapture.ts` for parsing intent via `Linking.getInitialURL()`",
        "If detected from ACTION_VIEW with scheme thoughtmarks://capture, route into same screen as iOS",
        "Display friendly alert: 'Voice capture enabled — Say “Hey Google, open Thoughtmarks” to begin.'",
        "Stub: `setupGoogleShortcut()` — leave TODO for App Actions integration in next block"
      ],
      "commit": "feat: Android fallback + future shortcut stubs",
      "tag": "v1.3.3_android-voice-hook"
    },

    {
      "section": "Styling, Theming, Tags, and Tokens",
      "actions": [
        "All new screens use `useTheme()` exclusively",
        "Capture badge: `NeonGradientText` with `typography.tagline` and `tokens.colors.accent`",
        "Spacing via `spacing.modalPaddingHorizontal` and `spacing.md`",
        "Auto-set tags programmatically using `tags.push(...)` and prevent duplicates",
        "Save timestamp as `createdAt` when auto-saving"
      ],
      "commit": "style: tokenized capture layout + accessibility",
      "tag": "v1.3.3_style-theme-token"
    }

  ],

  ////////////////////////////////////////////
  // 🔚 FINAL SNAPSHOT + CLOSEOUT
  ////////////////////////////////////////////
  "final": {
    "commit": "chore: voice capture fully integrated + themed",
    "tag": "v1.3.3_voice-capture-integrated",
    "notes": "Voice-to-Thoughtmark flow is now one-tap setup via Siri, mic icon, or Google Assistant stub. Full autofill, tagging, AI title, and bin assignment working across mobile platforms with onboarding integration."
  }
}

🛠️ Helper Files
// 📁 src/utils/suggestTitleFromBody.ts
export const suggestTitleFromBody = (body: string): string => {
  if (!body) return "Untitled Thought";
  const sentences = body.match(/[^.!?]+[.!?]/g) || [];
  return sentences[0]?.trim().slice(0, 80) || body.slice(0, 60);
};
// 📁 src/navigation/deepLinks.ts
export const handleIncomingLink = (url: string) => {
  const parsed = new URL(url);
  if (parsed.hostname === 'capture') {
    const text = decodeURIComponent(parsed.searchParams.get('text') || '');
    return {
      screen: 'NewThoughtmark',
      params: { body: text, voiceCapture: true }
    };
  }
  return null;
};

✅ Test Plan
🔁 Trigger Methods
Siri Shortcut: Confirm opening app with dictated content
Mic Icon: Opens New Thoughtmark with editor visible
Android intent: Launch via URL (thoughtmarks://capture?text=)
🎨 UI Checks
Tags auto-set: #voice-to-tm + #sort later
Bin prefilled: Sort Later
Title auto-filled via suggestTitleFromBody()
Dictation screen uses correct spacing + tokens
Autofocus and “Voice Note Captured” badge shown
⚠️ Permissions & Edge Cases
Denied mic: Prompt with “Enable Microphone in Settings”
Empty input: Default to “Untitled Thought” and save body
Double tap shortcut: Prevent duplicate saves

📌 SuperTask List
# 🧠 SUPER TASK — VOICE CAPTURE INTEGRATION
- [ ] Create & publish signed Siri Shortcut: ✅ [Pending]
- [ ] Upload shortcut link to: `https://www.icloud.com/shortcuts/e860df7cc2dd437aa76d0bb4f7b9b5f3`
- [ ] Hook this to onboarding & settings buttons
- [ ] Implement `suggestTitleFromBody.ts`
- [ ] Implement Android `intent-filter` and fallback handler
- [ ] Add placeholder for future `setupGoogleShortcut()` automation

Let me know when you're ready to tackle App Actions XML, Assistant Intents, and real Android voice triggers. You’re good to wire this in now—this block is locked.
might as well have you repeat for App Actions XML, Assistant Intents, and real Android voice triggers,too.

Run **this first** — the hybrid block sets up everything your handlers depend on:

---

### ✅ Start Here: `voice-capture-integrated-lintloop.hybrid-block-v1.json`

Why first:

* Installs `url` polyfill and `ts-node`
* Generates:

* `deepLinks.ts`
* `suggestTitleFromBody.ts`
* `androidCapture.ts`
* `lint-voice-capture.ts`
* Prepares the entire system for linking, autofill, deep linking, and platform-specific routing

---

### 🔁 Then Add: Handlers

Once the hybrid block is running and the files are in place, your **handlers** (e.g.:

```ts
navigationRef.navigate(deepLink.screen, deepLink.params)
```

in `App.tsx` or the `RootNavigator`) will have:

* Something to route to (`NewThoughtmarkScreen`)
* Data to populate it (`body`, `voiceCapture`)
* Hooks to intercept incoming URLs and intents
* Validation from the linter

---

### 💡 In summary:

> 🔧 Run the hybrid block → 🧭 Hook up app-level navigation handlers → 🚀 Validate and test

Let me know when you're ready to 





wire the handlers—I’ll prep a Cursor phase to cleanly inject that next.




