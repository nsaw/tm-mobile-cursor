# EAS Build — Post-Build Smoke Test Checklist

**App Version/Tag:** [v1.3.1_eas-setup]  
**iOS Build URL:** [Paste here from EAS summary]  
**Android Build URL:** [Paste here if/when available]

---

## 1. Installation

- [ ] App installs and opens successfully on a real device
- [ ] No “Untrusted Developer” or “Enterprise” warnings (if TestFlight/App Store)

---

## 2. Launch & Onboarding

- [ ] Splash/launch screen displays without visual bugs
- [ ] Onboarding modal or intro flow displays as expected
- [ ] Can skip or complete onboarding without crashes

---

## 3. Authentication

- [ ] Login/signup screens display and work
- [ ] Can create new account, log in, log out
- [ ] Session hydration/restore works on app relaunch

---

## 4. Main Navigation & Core Flows

- [ ] Dashboard loads and displays content/cards correctly
- [ ] Bottom nav and header work as intended
- [ ] Can create, view, edit, and delete a thoughtmark (or main content)
- [ ] All links/buttons navigate to the correct screens

---

## 5. Premium/Role Gating

- [ ] Premium overlay/gate displays for restricted features if not premium
- [ ] If user is premium, all premium features are accessible

---

## 6. UI/UX Consistency

- [ ] All pages render correctly in both light and dark mode
- [ ] Spacing, font, and color tokens apply everywhere (no glaring hardcoded style issues)
- [ ] No overlapping, clipped, or misaligned elements

---

## 7. Deep Linking (if enabled)

- [ ] Opening app via deep link (URL/Siri) routes to correct screen

---

## 8. Miscellaneous

- [ ] No visible placeholder/test/dev data in production build
- [ ] No debug alerts, logs, or error overlays visible to user
- [ ] App does not crash or hang on rapid navigation or backgrounding

---

## 9. Release Candidate

- [ ] Tag as `v1.3.1_eas-build-success` if all above pass

---

**Notes & Issues:**
- [Paste any observed bugs or “to fix” here]

