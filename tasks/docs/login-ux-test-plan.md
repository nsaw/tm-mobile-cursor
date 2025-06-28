
# LOGIN UX TEST PLAN — THOUGHTMARKS NATIVE

## 🔐 Basic Auth & UX Flow
- [ ] Cold launch → Login screen shows cleanly (no flash of main app)
- [ ] Enter email + password → navigates to home (no delay or error)
- [ ] Bad credentials → shows appropriate error toast or modal
- [ ] Keyboard dismisses on tap outside inputs

## 🔁 Session Persistence
- [ ] After successful login, kill app → relaunch → stays logged in
- [ ] AsyncStorage rehydrates user state (no crash, no fallback)
- [ ] `useAuth().authChecked` becomes true before any routing

## 🧪 PIN QuickLogin
- [ ] Set PIN → Logout → Relaunch → PIN entry screen appears
- [ ] Enter valid PIN → loads home
- [ ] Wrong PIN → shows error and retry
- [ ] “Forgot PIN?” → routes back to full login

## 🧼 Logout & Reset Flow
- [ ] Log out from Settings → clears user + PIN storage
- [ ] Relaunch after logout → shows full login screen (not PIN)
- [ ] Clear AsyncStorage manually → fallback screen shown if auth data is corrupted

## 🎨 Modal & Style Compliance
- [ ] Modal layout matches onboarding style (safe area, spacing, no scroll clipping)
- [ ] Inputs aligned and padded
- [ ] Buttons use correct theme tokens
- [ ] Text has correct casing, weight, and size

## ⚠️ Physical Device & UX Checks
- [ ] Dark mode renders login elements properly
- [ ] Landscape mode doesn’t break layout (or is locked)
- [ ] On low-end devices, screen doesn’t hang during login transition
- [ ] Emulator + device: no platform-specific bugs (iOS vs Android)

---

Generated: June 26, 2025
