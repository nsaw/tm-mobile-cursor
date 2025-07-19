# 📘 Phase 2 Roadmap — Thoughtmarks v1.4.0 UI & E2E Snapshot Flow
_Last updated: 2025-07-05 19:33 UTC_

## ✅ Baseline State

- App boots and renders correctly post-login
- Dashboard and tab navigation functional
- Thoughtmarks, FAB, modal layering, and bins are visible
- AutoRoleView eliminated — layout is parse-clean
- No remaining runtime crashes, app loads demo state successfully

---

## 🎯 Phase 2 Objective

**Goal**: Reinforce visual + interaction integrity through snapshot and E2E checkpoints at critical UI gates, without breaking layout.

- Validate **Onboarding Modal**
- Verify **Dashboard Scroll + FAB**
- Confirm **All tab rendering and tab transitions**
- Lock **CreateThoughtmark modal** and transitions
- Establish **baseline snapshot diffs**

---

## 🔧 Phase 2.1 – Onboarding Snapshot + Modal Flow Capture

**Tasks**:
- [ ] Assign `testID` to each Onboarding slide and pagination dot
- [ ] Confirm all onboarding slides render correct icon/image alignment
- [ ] Fix vertical centering issues on slides 3, 4, and 6
- [ ] Capture snapshot of each slide and final dismiss state

**Output Tags**:
- `v1.4.0_phase2.1_onboarding-snapshot_YYYYMMDD_HHMMUTC`

---

## 🔍 Phase 2.2 – Dashboard UI Gate Snapshots

**Tasks**:
- [ ] Assign `testID` to Dashboard sections (Tasks, Bins, AI Tools)
- [ ] Snapshot dashboard with bins populated and scroll enabled
- [ ] Validate FAB position and BottomNav z-index
- [ ] Visual diff against stored `v1.3.2` dashboard layout

---

## 📦 Phase 2.3 – E2E Test Harness Setup

**Tasks**:
- [ ] Install Detox + Jest snapshot config
- [ ] Build E2E crawler to tap each BottomNav button and validate route transition
- [ ] Add visual regression capture to: Dashboard, Tasks tab, Bins tab, AllThoughtmarks tab
- [ ] Verify each screen renders content (or fallback) without black screen

---

## 🧪 Phase 2.4 – Modal Flow Testing

**Tasks**:
- [ ] Add `testID="fab-wrapper"` to FloatingActionButton
- [ ] Tap FAB → ensure `CreateThoughtmark` modal renders
- [ ] Snapshot CreateThoughtmark form (initial empty, partially filled)
- [ ] Validate cancel/submit flow

---

## 🔐 Phase 2.5 – Tag & Freeze

**Tasks**:
- [ ] Confirm all snapshot and visual test gates pass
- [ ] Push final backup and tag as:

```
git tag v1.4.0_phase2_complete_YYYYMMDD_HHMMUTC
```

---

## 🔁 Branching & Safety

- Every Phase 2 milestone must be tagged
- No `AutoRoleView`, `View`-less layouts, or JSX layout violations allowed
- Restore from backup if any snapshot diff exceeds delta threshold

