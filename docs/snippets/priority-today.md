# ✅ THOUGHTMARKS TASK TRACKER — JUNE 26

## GOAL: Finalize v1.2.2 as a production-ready milestone by EOD.

---

## 🥇 PRIORITY: CRITICAL ENFORCEMENT

### 1. Run Full Enforcement Sweep (JSX, Theme, Accessibility, Text)
- [ ] `npm run lint:fix-all`
- [ ] `npm run audit:clickables`
- [ ] `npm run lint:check-theme`

---

## 🥈 PRIORITY: VISUAL POLISH + TOKEN CONSISTENCY

### 2. UI Refinement Tasks
- [ ] Verify text casing, weight, typography
- [ ] Enforce spacing, margin, and padding tokens
- [ ] Fix `OnboardingModal`, `DraggableSection`, `NeonGradientText`, `AIToolsCard`

---

## 🥉 PRIORITY: DASHBOARD LOGIC COMPLETION

### 3. Conditional Layout Refactor Final Touch
- [ ] Validate `DashboardRecallLayout` and `DashboardOrganizeLayout` logic
- [ ] Confirm preference sync with Firebase
- [ ] Isolate render logic for layout forks

---

## 🧹 PRIORITY: GIT HYGIENE & VERSIONING

### 4. Git Repo Cleanup + Tagging
- [ ] `git add . && git commit -m "chore: cleanup"`
- [ ] Apply tag `v1.2.2_candidate`
- [ ] Confirm versioned folder structure complete

---

## 🔁 PRIORITY: BACKGROUND AGENTS

### 5. Background Agent Automation
- [ ] Auto-schedule `npm run lint:fix-all` nightly
- [ ] Include `audit:clickables` and `lint:check-theme` in run
- [ ] Setup `.cursor-agent-config.json` for persistent tasks

---

## 🔚 Final Wrap
- [ ] Tag and push `v1.2.2_final`
- [ ] Freeze 1.x line for post-release lock
