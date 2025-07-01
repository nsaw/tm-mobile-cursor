# 🧭 Thoughtmarks Task Index (v1.3.2)

This index maps all active hybrid blocks, scripts, and structure references for phase execution in version 1.3.2.

---

## ✅ Active Hybrid Cursor Tasks — v1.3.2

| Phase | Cursor Block | Description |
|-------|-------------------------------|-------------|
| 1     | tasks/v1.3.2/1_v1.3.2_deeplink-siri.cursor-instruction.json | Deep Link + Siri Handler |
| 2     | tasks/v1.3.2/2_v1.3.2_auth-onboarding.cursor-instruction.json | SignIn, SignUp, Onboarding |
| 3     | tasks/v1.3.2/3_v1.3.2_pin-premium-role.cursor-instruction.json | PIN entry, role gating |
| 4     | tasks/v1.3.2/4_v1.3.2_storekit-premium.cursor-instruction.json | StoreKit purchase/restore |
| 5     | tasks/v1.3.2/5_v1.3.2_hydration-init.cursor-instruction.json | Theme + Auth hydration |
| 6     | tasks/v1.3.2/6_v1.3.2_clickable-crawl.cursor-instruction.json | Dry clickable/nav audit |
| 7     | tasks/v1.3.2/7_v1.3.2_final-validation.cursor-instruction.json | Final QA system check |
| 8     | tasks/v1.3.2/8_v1.3.2_unified-clickable-theme-role-enforcer.cursor-instruction.json | Role, click, theme enforcement |

---

## 📂 Key Project Folders (Relevant)

- `/tasks/v1.3.2/`: All hybrid blocks for 1.3.2 phase
- `/scripts/`: Live audit tools + pre-push utilities
- `/mobile-native-fresh/src/`: All screens and components
- `/references/`: Agent prompts, git and theme style guides
- `/docs/`: Roadmap, audit results, changelogs, block coverage

---

## ⚠️ Caution Zones

- `UnifiedThoughtmarkScreen.tsx`: theme violations + redundant Views
- `BottomNav.tsx`, `ActionSheet.tsx`: clickable cleanup required
- `SettingsScreen.tsx`: visual drift from Dashboard
- `TagEditor.tsx`: missing a11y, labels, routing

---

## 🧪 Cursor Usage Examples

**Run a task block:**
```bash
cursor run tasks/v1.3.2/5_v1.3.2_hydration-init.cursor-instruction.json
```

**Run unified role & clickable enforcement:**
```bash
cursor run tasks/v1.3.2/8_v1.3.2_unified-clickable-theme-role-enforcer.cursor-instruction.json
```

**Create a full project backup before continuing:**
```bash
tar --exclude='.git' --exclude='node_modules' --exclude='logs' \
    -czf /Users/sawyer/gitSync/tm-safety_backups/tm-mobile-cursor_v1.3.2_manual_250630.tar.gz \
    -C /Users/sawyer/gitSync tm-mobile-cursor
```

---

Maintain this as your master execution map.
