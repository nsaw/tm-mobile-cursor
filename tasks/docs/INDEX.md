# 🧭 Thoughtmarks Task Index (Full Map - v1.3.2)

This index maps all hybrid task blocks, functional phases, scripts, references, and version folders.

---

## ✅ Primary Phases — v1.3.2 Hybrid Blocks

| Phase | Block Filename | Description |
|-------|----------------|-------------|
| 1     | 1_deeplink-siri.cursor-instruction.json | Deep Link + Siri handler |
| 2     | 2_v1.3.2_auth-onboarding.cursor-instruction.json | SignIn, SignUp, Onboarding |
| 3     | 3_v1.3.2_pin-premium-role.cursor-instruction.json | PIN entry, role gating |
| 4     | 4_v1.3.2_storekit-premium.cursor-instruction.json | IAP purchase & restore |
| 5     | 5_v1.3.2_hydration-init.cursor-instruction.json | Theme + Auth hydration |
| 6     | 6_v1.3.2_clickable-crawl.cursor-instruction.json | Dry clickable nav audit |
| 7     | 7_v1.3.2_final-validation.cursor-instruction.json | Final QA check |
| 8     | 8_v1.3.2_unified-clickable-theme-role-enforcer.cursor-instruction.json | Role, token, nav + accessibility fix |

---

## 📂 Folder Reference (Usage, Risk, Comments)

### `/tasks/v1.3.2/`
- Contains all functional hybrid blocks listed above
- Execution order: 1–8
- All blocks follow Cursor hybrid-block-v1 format

### `/tasks/recovery_troubleshooting/`
- Snapshot blocks from rollback efforts, corrupted thread recovery
- Use with caution — mostly pre-cleanup format

### `/tasks/legacy_blocks/`
- Pre-refactor hybrid tasks (v1.2.2 and earlier)
- May include deprecated cursor syntax or partial blocks

### `/scripts/`
- `unified-clickable-audit-fix.js` (live routing & accessibility audit script)
- `backup-tag-push.sh` (used by every Cursor block pre-commit safety)
- Future: bind `unified-clickable-audit-fix.js` to git pre-push

### `/mobile-native-fresh/src/`
- All enforced screen logic lives here
- Key screens:
  - `features/home/screens/DashboardScreen.tsx`
  - `features/settings/screens/SettingsScreen.tsx`
  - `components/ui/BottomNav.tsx`, `components/Thoughtmark/NewThoughtmark.tsx`
- Key targets for role/view/token/accessibility blocks

### `/docs/`
- `ROADMAP.md`, `AUDIT-RESULTS.md`, `BLOCK_COVERAGE.md`, etc.
- Narrative references, visual mapping, GTM planning

### `/references/`
- Cursor agent prompts
- Style guides
- Git structure & naming conventions
- Design tokens base reference

---

## ⚠️ Danger Zones (Manual Review Suggested)

- `UnifiedThoughtmarkScreen.tsx`: overlapping Views + missing accessibilityRole
- `DashboardScreen.tsx`: 3+ useTheme calls + theme violations
- `BottomNav.tsx`, `ActionSheet.tsx`: require clickable audit and spacing correction
- `TagEditor.tsx`: missing labels and navigation logic

---

## 🧪 Manual Run Cheatsheet

**To run a hybrid block:**
```bash
cursor run tasks/v1.3.2/4_v1.3.2_storekit-premium.cursor-instruction.json
```

**To run live audit script:**
```bash
node scripts/unified-clickable-audit-fix.js
```

**To tag before risky task:**
```bash
sh scripts/backup-tag-push.sh v1.3.2_pre-storekit_YYMMDD_HHMMUTC
```

---

Maintain this file as the master task/control map. Cursor agents will reference this to determine active task phases, block safety, and what to execute next.
