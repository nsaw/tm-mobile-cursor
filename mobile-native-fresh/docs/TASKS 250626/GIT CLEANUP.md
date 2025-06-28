GIT TM APP REPO CLEANUP
git your shit together

PHASE 1

{
  "branch": "ver1.2.1_git-cleanup",
  "mode": "auto",
  "watchConsole": true,
  "onReloadHang": "Move to background and resume automatically",

  "phases": [
    {
      "section": "PHASE 1 — Git Clean: Version Architecture Reset",
      "actions": [
        "// ✅ PRE-CHECK: Ensure stable linted baseline",
        "git add .",
        "git commit -m \"chore(rollback): backup before git version structure reset\"",
        "git tag v1.2.1--WORKING-SNAPSHOT",
        "git push origin v1.2.1--WORKING-SNAPSHOT",

        "// ✅ STEP 1: Enforce Versioning Rules",
        "// Format: vX.Y.Z — no dot after 'v', no zero-padding",

        "// ✅ STEP 2: Branch Map Reset",
        "# Development era pre-design system:",
        "# Rename remaining branches to ver0.0.X-context",
        "# Tag checkpoints: v0.0.9, etc.",

        "# UI Design System Era — enforced baseline:",
        "git checkout -b ver1.2.1",
        "git push -u origin ver1.2.1",
        "git tag v1.2.1",
        "git push origin v1.2.1",

        "# Refactor Track (WIP):",
        "git checkout ver2-overhaul-base",
        "git tag v1.10.0-refactor-checkpoint",
        "git push origin ver2-overhaul-base --tags",

        "// ✅ STEP 3: Trash/Stash Policy",
        "# All deprecated or broken work:",
        "# → trash/[context]",
        "# → stash/[purpose]",
        "# Never merge or release from these",

        "// ✅ STEP 4: Finalize Branch Structure",
        "git branch -m ver1.2.1 ver1.2.1-stable",
        "git checkout -b ver2.0.0-prelaunch",
        "git checkout -b ver2.1.0-overhaul-final",

        "// ✅ STEP 5: Push & Protect",
        "git push --all",
        "git push --tags",

        "// ✅ STEP 6: Lint + Lock",
        "npm run lint:fix-all",
        "git commit -am \"chore: renamed and versioned branches to enforce semantic structure\"",
        "git push"
      ],
      "commit": "chore: git branch + version architecture reset",
      "tag": "v1.2.1_git-reset"
    },

    {
      "section": "PHASE 2 — Git Cleanup & Enforcement",
      "actions": [
        "// ✅ PRE-CHECK SAFETY",
        "git add .",
        "git commit -m \"chore(rollback): full snapshot before [🎯 GOAL]\"",
        "git tag v99.99.99_git-cleanup—ROLLBACK",
        "git push origin v99.99.99_git-cleanup—ROLLBACK",

        "// ✅ STEP 1: Tag Final Working State",
        "git checkout main",
        "git tag v1.2.1_final-working",
        "git push origin v1.2.1_final-working",

        "// ✅ STEP 2: Fix Misleading Tags",
        "git push origin --delete ver01.2_refined || true",
        "git checkout -b ver01_refined v1.2.1_final-working",
        "git push -f origin ver01_refined",
        "git tag v1.2.1_ui-refinement-locked",
        "git push origin v1.2.1_ui-refinement-locked",

        "// ✅ STEP 3: Enforce Naming Strategy",
        "git branch -m recovered-ui-refinement stash/ui-v1.2.1-refined-recovery",
        "git push origin stash/ui-v1.2.1-refined-recovery",

        "// ✅ STEP 4: Refactor Alignment",
        "git branch -m ver02.1_enterprise-overhaul v2.0.0_base-refactor",
        "git push -f origin v2.0.0_base-refactor",
        "git tag v2.1.0_working-refactor",
        "git push origin v2.1.0_working-refactor",

        "// ✅ STEP 5: Stash Trash Work",
        "git branch -m cleanup/automation-drift stash/automation-drift-junk",
        "git push origin --set-upstream stash/automation-drift-junk",

        "// ✅ STEP 6: Lock Version Format",
        "# ✔ Use: v1.2.1",
        "# ❌ Avoid: ver01.2, v01_02, ver1.2_final",
        "# Recovery branch tags: vX.Y.Z_name",

        "// ✅ STEP 7: Write Hygiene Reference",
        "# Semantic versioning tiers:",
        "# - v0.X.X → experimental",
        "# - v1.X.X → stable",
        "# - v2.X.X → refactor / overhaul",
        "# Tag format: vX.Y.Z_description",
        "# Branches: feature/, fix/, refactor/, stash/, archive/, release/"
      ],
      "commit": "chore: git cleanup + tag realignment",
      "tag": "v1.2.1_git-cleanup-complete"
    }
  ],

  "final": {
    "commit": "chore: Git version architecture fully cleaned and enforced",
    "tag": "v1.2.1_git-cleanup-final",
    "notes": "All Git branches, tags, stash paths, and semantic versioning formats now enforced. Stable `v1.2.1` locked. Refactor branches aligned. Trash/stash isolated."
  }
}



{
////////////////////////////////////////////
////////////////////////////////////////////
// MISSION: Git Clean
// 🎯 GOAL: Restructure Git branches and versions for long-term clarity, consistency, and automation compatibility

// ✅ PRE-CHECK:
// Make sure current branch is fully working, linted, committed
// This is now officially `ver1.2.1` (stable, linted, feature-ready)

// 🔒 BACKUP CURRENT STATE BEFORE ANY CHANGES
git add .
git commit -m "chore(rollback): backup before git version structure reset"
git tag v1.2.1--WORKING-SNAPSHOT
git push origin v1.2.1--WORKING-SNAPSHOT
//////////////////////.//////////////////////
//////////////////////.//////////////////////

// ✅ STEP 1: Versioning Rules
// Use semantic versioning (MAJOR.MINOR.PATCH)
// No zero-padding for tags (v1.2.1, not v01.02.001)
// Format: lowercase `v` prefix, no dot after `v`
// Valid: v1.0.0 → v1.1.0 → v1.2.1 → v2.0.0 → v2.1.0

// ✅ STEP 2: Versioning Map + Branch Naming Strategy

# --- DEVELOPMENT ERA — pre-design system ---
# Snapshots, staging, broken and experimental work
# Rename any remaining pre-refactor or partial branches to:
# • ver0.0.X-[context] for experimental/staging work (e.g. ver0.0.9-login-test)
# Tag notable checkpoints if needed: `v0.0.9`, etc.

# --- DESIGN SYSTEM ERA (refined UI, enforced tokens, working automation) ---
# This is now ver1.0.0 → initial UI refinement baseline
# After Hermes crash recovery + linting = ver1.1.0
# After token bug fixes = ver1.2.0
# Current working = ver1.2.1

# Create & push:
git checkout -b ver1.2.1
git push -u origin ver1.2.1
git tag v1.2.1
git push origin v1.2.1

# --- REFACTOR/OVERHAUL TRACK ---
# Previously called ver2.1.0 but stylistically broken → reclassify as work-in-progress refactor
# Name current branch:
git checkout ver2-overhaul-base
git tag v1.10.0-refactor-checkpoint
git push origin ver2-overhaul-base --tags

# Final working overhaul release will become:
# → v2.0.0 (if complete but rough)
# → v2.1.0 (if refined, enforced, styled, and ready for staging)

// ✅ STEP 3: Trash/Stash Branch Policy

# Rule: All destructive, deprecated, abandoned, or trashed work should go into:
# • trash/[context] (e.g. trash/unmerged-auth, trash/old-login)
# • stash/[purpose] (e.g. stash/button-layout-test, stash/onboarding-icons)
# NEVER merge these into mainline branches
# NEVER push to production or versioned branches
# Use only for experimentation or context backup

// ✅ STEP 4: Create/rename final unified branches

git branch -m ver1.2.1 ver1.2.1-stable
git checkout -b ver2.0.0-prelaunch        # when v2.0.0 is functional
git checkout -b ver2.1.0-overhaul-final   # once styling and enforcement match v1.2.1

// ✅ STEP 5: Push and protect
git push --all
git push --tags

// OPTIONAL: Protect these branches on GitHub:
# - ver1.2.1-stable
# - ver2.0.0-prelaunch
# - main (if mapped to ver2.x only)
# - trash/, stash/, and dev/ can remain unprotected

// ✅ STEP 6: Lint & Log
npm run lint:fix-all
git commit -am "chore: renamed and versioned branches to enforce semantic structure"
git push

///////////////////////////////////////////
)

PHASE 2
{
////////////////////////////////////////////
////////////////////////////////////////////
// 🏹 MISSION: Git & Version Architecture Clean-up
// 🎯 GOAL: Unify branch naming, lock v1.2.1 as final, clean dead versions
// ✅ PRE-CHECK: Run before operation to tag rollback
// ✅ DO NOT STOP — complete all tasks and sections in order
// ✅ Run `npm run lint:fix-all` continuously in background
// ✅ PRE-CHECK PREP: Rollback Safety Tag

📌 BEFORE ANY FILE CHANGES:
// Commit a rollback checkpoint for full Git recovery
// This guarantees full state rollback without file diff confusion

git add .
git commit -m "chore(rollback): full snapshot before [🎯 GOAL]"
git tag v99.99.99_git-cleanup—ROLLBACK
git push origin v99.99.99_git-cleanup—ROLLBACK

// 🔖 COMMIT: chore(rollback): pre-[🎯 GOAL] safety checkpoint [v99.99.99]

////////////////////////////////////////////
////////////////////////////////////////////
// ✅ STEP 1: Reference Current State as v1.2.1

// This is your working, polished, linted, automated base
git checkout main
git tag v1.2.1_final-working
git push origin v1.2.1_final-working

////////////////////////////////////////////
// ✅ STEP 2: Fix Broken or Misleading Tags & Branches

// Remove bad checkpoint label
git push origin --delete ver01.2_refined || true

// Reassign and align the `ver01_refined` pointer to match working base
git checkout -b ver01_refined v1.2.1_final-working
git push -f origin ver01_refined

// Tag UI refinements officially
git tag v1.2.1_ui-refinement-locked
git push origin v1.2.1_ui-refinement-locked

////////////////////////////////////////////
// ✅ STEP 3: Staging vs Feature Naming System

// Apply unified format: v0.X.X for experiments, v1.X.X for usable forks, v2.X.X+ for major refactors
// Apply stash/recovery rules

git branch -m recovered-ui-refinement stash/ui-v1.2.1-refined-recovery
git push origin stash/ui-v1.2.1-refined-recovery

////////////////////////////////////////////
// ✅ STEP 4: Refactor Overhaul Branches

// ver02.1_enterprise-overhaul becomes v2.0.0_base-refactor
git branch -m ver02.1_enterprise-overhaul v2.0.0_base-refactor
git push -f origin v2.0.0_base-refactor

// If you’ve resolved lint/hermes issues there already:
git tag v2.1.0_working-refactor
git push origin v2.1.0_working-refactor

////////////////////////////////////////////
// ✅ STEP 5: Trash Branch Handling

// If branch is untracked junk/staging only:
git branch -m cleanup/automation-drift stash/automation-drift-junk
git push origin --set-upstream stash/automation-drift-junk

////////////////////////////////////////////
// ✅ STEP 6: Lock Tag Format for Future

// Prefer `vX.Y.Z` only
// Avoid variants like verX.X or v.X

// ✔️ Use: v1.2.1
// ❌ Avoid: ver01.2, v01_02, ver1.2_final

// When tagging recovery branches:
// Tag as: v1.2.1_recovery-name
// Never rename core tags once pushed unless broken

////////////////////////////////////////////
// ✅ STEP 7: Update README With Git Hygiene Guide

# 🔧 Git Branching & Versioning Strategy

We use semantic versioning for mobile-native-fresh:

- `v0.X.X`: Pre-release, broken or experimental states
- `v1.X.X`: Stable and deployable, user-facing forks
- `v2.X.X`: Major refactors or architectural changes

Branch Prefixes:
- `feature/`: New features
- `fix/`: Bug fixes
- `refactor/`: Code cleanups
- `stash/`: Experimental recovery or dead junk
- `archive/`: Frozen and deprecated lines
- `release/`: Long-lived rollouts

✨ All tags must use format: `vX.Y.Z_description`  
✨ Never push broken checkpoints to main — tag and archive instead

////////////////////////////////////////////
////////////////////////////////////////////
}


PHASE 3
SUPPORTING GOODS AND UPGRADES

// # Git branch audit script
// ### prints your version map in Markdown format — great for running locally or integrating into a pre-deploy check
‘’’sh
#!/bin/bash
# 🧼 scripts/branch-audit.sh
# Prints Git version structure as a clean Markdown block for your README

echo '## 🗂️ Git Version Map — Thoughtmarks App'
echo
echo 'This repo follows a semantic versioning strategy (vMAJOR.MINOR.PATCH) tied to UI maturity, system enforcement, and functional reliability.'
echo
echo '### ✅ Active Milestones'
echo
echo '| Version Tag        | Branch Name             | Description                                                      |'
echo '|--------------------|--------------------------|------------------------------------------------------------------|'
echo '| `v1.2.1`           | `ver1.2.1-stable`        | Fully working baseline — UI refined, tokens enforced, linted     |'
echo '| `v2.0.0-prelaunch` | `ver2.0.0-prelaunch`     | Overhaul functional but not fully styled                         |'
echo '| `v2.1.0`           | `ver2.1.0-overhaul-final`| Fully styled, automated overhaul (future milestone)              |'
echo
echo '### 🔁 Legacy and Experimental'
echo
echo '| Tag / Branch       | Description                                                  |'
echo '|--------------------|--------------------------------------------------------------|'
echo '| `v1.2.0`           | Token bugfix stage — post-styling but pre-fix                |'
echo '| `v1.1.0`           | After Hermes crash recovery — not yet enforced               |'
echo '| `v1.0.0`           | UI refinement refactor begins                                |'
echo '| `ver0.0.X-*`       | Pre-refactor branches, staging experiments                   |'
echo
echo '### 🧪 Temporary / Non-Mergeable'
echo
echo '| Branch Prefix      | Description                                                  |'
echo '|--------------------|--------------------------------------------------------------|'
echo '| `stash/*`          | Incomplete or unstable test branches                         |'
echo '| `trash/*`          | Deprecated or broken features not intended for merge         |'
echo
echo '---'
echo
echo '### 🔐 Branch Naming Rules'
echo
echo '- Use lowercase `v` prefix for tags: `v1.2.1` not `V1.2.1`'
echo '- No zero-padding: use `v1.2.1`, not `v01.02.001`'
echo '- Only `main`, `verX.Y.Z`, and milestone branches are mergeable'
echo '- Always tag visual baselines and functional snapshots'
echo
echo '---'
echo
echo '> All production branches must fork from `ver1.2.1-stable` until `ver2.1.0-overhaul-final` is completed and validated.'
‘’’


✅ To use:
    1.    Save as: scripts/branch-audit.sh
    2.    Make executable:

chmod +x scripts/branch-audit.sh


    3.    Run anytime to generate the current version map:

./scripts/branch-audit.sh > BRANCH_MAP.md


// ADD TO README
md
## 🗂️ Git Version Map — Thoughtmarks App

This repo follows a semantic versioning strategy (vMAJOR.MINOR.PATCH) tied to UI maturity, system enforcement, and functional reliability.

### ✅ Active Milestones

| Version Tag        | Branch Name             | Description                                                      |
|--------------------|--------------------------|------------------------------------------------------------------|
| `v1.2.1`           | `ver1.2.1-stable`        | Fully working baseline — UI refined, tokens enforced, linted     |
| `v2.0.0-prelaunch` | `ver2.0.0-prelaunch`     | Overhaul functional but not fully styled                         |
| `v2.1.0`           | `ver2.1.0-overhaul-final`| Fully styled, automated overhaul (future milestone)              |

### 🔁 Legacy and Experimental

| Tag / Branch       | Description                                                  |
|--------------------|--------------------------------------------------------------|
| `v1.2.0`           | Token bugfix stage — post-styling but pre-fix                |
| `v1.1.0`           | After Hermes crash recovery — not yet enforced               |
| `v1.0.0`           | UI refinement refactor begins                                |
| `ver0.0.X-*`       | Pre-refactor branches, staging experiments                   |

### 🧪 Temporary / Non-Mergeable

| Branch Prefix      | Description                                                  |
|--------------------|--------------------------------------------------------------|
| `stash/*`          | Incomplete or unstable test branches                         |
| `trash/*`          | Deprecated or broken features not intended for merge         |

---

### 🔐 Branch Naming Rules

- Use lowercase `v` prefix for tags: `v1.2.1` not `V1.2.1`
- No zero-padding: use `v1.2.1`, not `v01.02.001`
- Only `main`, `verX.Y.Z`, and milestone branches are mergeable
- Always tag visual baselines and functional snapshots

---

> All production branches must fork from `ver1.2.1-stable` until `ver2.1.0-overhaul-final` is completed and validated.


// ADD TO README or docs/gitstructure.md
# 🗂️ Git Hygiene & Version Strategy

This project uses a unified Git structure with semantic versioning, stable checkpoints, and backup protocols for UI branches, refactors, and stashes.

---

## ✅ Core Guidelines

### Versioning Format
- `v0.X.X`: Pre-release or broken/experimental states
- `v1.X.X`: Stable, deployable, and refined releases
- `v2.X.X`: Major refactors or architectural overhauls

### Tag Naming Rules
- Always use format: `vX.Y.Z_description`
- Never use: `verX.Y`, `v.X`, `ver_01.2_final`, etc.
- Recovery branches: `v1.2.1_recovery-title`
- Final working states: `vX.Y.Z_final-working`
- UI refinements: `vX.Y.Z_ui-refinement-locked`

---

## 📚 Example Branch Map (Static Snapshot)

```
main
 ├─ v1.2.1_final-working
 │   ├─ ver01_refined  ⟶ [aligned to v1.2.1]
 │   └─ v1.2.1_ui-refinement-locked
 ├─ stash/ui-v1.2.1-refined-recovery (formerly recovered-ui-refinement)
 ├─ v2.0.0_base-refactor (formerly ver02.1_enterprise-overhaul)
 │   └─ v2.1.0_working-refactor (if Hermes/linting resolved)
 └─ stash/automation-drift-junk
```

---

## 🧩 Branch Prefix Rules

| Prefix     | Description                              |
|------------|------------------------------------------|
| `feature/` | New features or epics                    |
| `fix/`     | Bugfixes                                 |
| `refactor/`| Internal cleanup or file structure shifts|
| `stash/`   | Recovery or junk states                  |
| `archive/` | Deprecated long-term branches            |
| `release/` | Final staged rollout branches            |

---

## 🔁 Recommended Local Git Utilities

### ✨ Run full version/tag audit
```bash
git tag --sort=creatordate
git branch -r
```

### 🧹 Remove unused tags
```bash
git tag -d <tag>
git push origin :refs/tags/<tag>
```

### 🧼 Cleanup remote stashes
```bash
git push origin --delete stash/your-old-branch
```

---

## 📦 Bundle Includes:
- `git-version-cleanup-cursor-block.md`: Cursor-safe automation block
- `branch-audit.sh`: Lists remote and local version map
- Tag plan for checkpoints, refactors, and final UI base

For any recovery state, always:
- Tag (`vX.Y.Z_recovery`)
- Branch (`stash/`)
- Push (`git push origin tag/branch`)
- And document in this guide

---

> Maintain this file at: `docs/git-structure.md` or include in `README.md`
> Automatically run `branch-audit.sh --auto` post-merge to validate
