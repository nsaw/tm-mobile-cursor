# 🧱 Thoughtmarks Task Index (Cleaned)

This folder contains all current task instructions, hybrid blocks, and developer notes for the Thoughtmarks mobile app.

---

## ✅ Core Task Instructions

- `1_deeplink-siri.cursor-instruction.json` — Deep linking and Siri handler
- `2_storekit-premium.cursor-instruction.json` — StoreKit premium overlay
- `3_premium-qa.cursor-instruction.json` — QA + logic test for premium gating
- `4_advanced-features.cursor-instruction.json` — Siri + Advanced Shortcut features
- `5_release-candidate.cursor-instruction.json` — Git release + version tags
- `7_ui-polish-phase.cursor-instruction.json` — UI Polish + theming verification
- `8_ui-polish-with-dashboard-exception.cursor-instruction.json` — Dashboard edge-case spacing/layout

---

## 🔄 Background Automation Blocks

- `role-audit-background.cursor-instruction.json` — JSX role enforcement
- `auto-roleview-enforcement.cursor-instruction.json` — Replace <View> with <AutoRoleView>
- `lint-fix-background.cursor-instruction.json` — Enforce token scope, spacing, visual lint

---

## 🎨 Theme & Visual Utility Blocks

- `liquid-theme-v1-restoration.hybrid-block-v1.json` — Restore fluid theme from v1.2.2

---

## 🧱 Hybrid Blocks Directory

- `hybrid_blocks/auto-roleview-enforcement.hybrid-block-v1.json` — Replace <View> with <AutoRoleView>
- `hybrid_blocks/cursor-background-lint-agent.hybrid-block-v1.json` — Background linting agent
- `hybrid_blocks/lint-fix-background.hybrid-block-v1.json` — Enforce token scope and spacing
- `hybrid_blocks/liquid-theme-v1-restoration.hybrid-block-v1.json` — Restore fluid theme
- `hybrid_blocks/role-audit-background-loop.hybrid-block-v1.json` — JSX role enforcement loop
- `hybrid_blocks/role-audit-background.hybrid-block-v1.json` — JSX role enforcement
- `hybrid_blocks/visual-polish-final-pass-v1.2.2.hybrid-block-v1.json` — Final pixel-check and polish

---

## 🗂 Version Directories

- `v1.2.2/` — Theme polish and layout finalization
- `v1.3.1/` — Firebase auth, PIN overlay, modal logic

---

## 🧾 Build / EAS Info

### EAS Project
- **iOS Bundle ID**: com.thoughtmarks.mobile
- **Android Package**: com.thoughtmarks.app

### Scripts
```{ { { { bash
npm run build:ios & &  & } >/dev/null 2>&1 & # replaced by safe-launch-expo
{ { { { npm run build:android & &  & } >/dev/null 2>&1 & # replaced by safe-launch-expo
{ { { { npm run build:all & &  & } >/dev/null 2>&1 & # replaced by safe-launch-expo
```

---

## 📄 Related Documentation

- `docs/MasterTask-250627.md` — Full task narrative + breakdown
- `docs/Notes_250627.md` — Development notes, inline caveats
- `recovery_troubleshooting/postmortem.md` — Postmortem instructions for broken builds
- `recovery_troubleshooting/recovery-audit-logs.md` — Manual recovery tagging + fallback logic

---

## Usage

To run any task instruction:
```{ { { { bash
cursor run tasks/1_deeplink-siri.cursor-instruction.json & &  & } >/dev/null 2>&1 & # replaced by safe-launch-expo
```

To run any hybrid block:
```{ { { { bash
cursor run tasks/hybrid_blocks/auto-roleview-enforcement.hybrid-block-v1.json & &  & } >/dev/null 2>&1 & # replaced by safe-launch-expo
```

---

Keep this list clean. Completed blocks get version-tagged and archived into version folders.

