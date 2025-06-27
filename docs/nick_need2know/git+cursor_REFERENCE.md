# SAVED CURSOR INSTRUCTIONS 
[GIT, VERSIONING, WATCHMAN, NPM, NPX, DEFINITIONS]

    \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
    --------------------------------------------- ------------------------------------------- ------------------------------------------- 
<<< --------------------------------------------- ---------------------------------------- START ----------------------------------------- >>>
    --------------------------------------------- ------------------------------------------- -------------------------------------------  
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


# GIT VERSION CHECKPOINT — Create a new branch to safely stage a versioned change.
```
# git checkout -b [branch-name]: Creates and switches to a new branch.
# Use when starting a new feature or refactor pass.
git checkout -b ver**00_CHANGE_PASS#**

# Commit a snapshot of the current state before making changes.
# Helps preserve the last working state.
git commit -am "Checkpoint: **CHANGE DESCRIPTION** -- Pre-**CHANGE** backup"

# Reminder to commit after each section change.
# git commit -am [message]: Commits current changes with a message.
# (The -a flag stages all modified files, the -m flag specifies the message.)```

---------------------------------------------

## VERSION SWAPPING

### OPTION 1-- Run:

git checkout ver01.2_refined
git checkout ver02.1_enterprise-overhaul
** Cursor will automatically reload files and context based on the new branch. ** 

### OPTION 2-- Run: 
```
# Switch to the refined UI version
npm run switch:refined

# Switch back to current overhaul version
npm run switch:overhaul

# Switch to cleanup branch for maintenance
npm run switch:cleanup ```

---------------------------------------------     ------------------------------------------- 
--------------------------------------------- ||| ------------------------------------------- 
---------------------------------------------     ------------------------------------------- 


# SECTION TEMPLATE — Describes a group of actions and what change they represent.

## FIRST ASSIGN TASK & INSTRUCT CHECKPOINTS BY SECTION
{
  "task": " Execute PATCH: UI Refinement + Layout Correction + Runtime Data Checks. Refactor all components to eliminate overrides, apply consistent spacing, typography, layout, and polish. Fix runtime errors. Never stop or wait for feedback.",
  "phases": [
    {
      "branch": current
      "prep": [
        "Commit current state: 'Checkpoint: PATCH: UI Refinement + Layout Correction + Runtime Data Checks'",
        "Apply all changes in sequence. Commit after each section as checkpoint. Do not skip sections or halt on warnings."
      ]
      };
}
```
{
# Important Note!
Apply all sections in order. Commit each with checkpoint message. Do not skip sections. 
Do not halt. Do not stop to give updates. Watch console. Resolve runtime errors automatically. 
Apply globally to all pages and user types. 
Complete all sections in order and stop only when finished executing all sections.
}
```
---------------------------------------------
** BRANCH BEHAVIOR EXPLANATION — `"branch": "current"` vs new branch creation **

- `"branch": "current"` means:
  → Run the task on the *currently checked-out* branch.
  → Does **not** create or switch to a branch named `current`.
  → Use when continuing work on an active branch mid-sprint.

- To explicitly create a new branch:
  ```
  "branch": "fix/ui-polish-pass-001"
Or in prep:

"prep": ["git checkout -b fix/ui-polish-pass-001"]
✅ Use "current" when staying on active branch
✅ Use "branch": "name" when staging a new feature or patch```
---------------------------------------------

## SECTIONS FORMAT

{
  "section": "**SECTION NAME**",
  "actions": [
    "ACTION 1",
    "ACTION 2"
  ],
  "commit": "Checkpoint: Visual Hierarchy"
}


## FINAL SNAPSHOT + AUDIT — End-of-cycle verification and commit for full traceability.

{
  "section": "Final Snapshot + Audit",
  "actions": [
    "Run all rules, verifications, and pre-commit hooks",
    "Verify CHANGE is applied to all top-level screens",
    "Rebuild entire app and confirm no runtime errors or blank screens",
    "Print summary of all files modified, rules applied, and runtime fixes made"
  ],
  "commit": "Checkpoint: CHANGE OR VERSION_Final Snapshot and Audit"
}

---------------------------------------------     ------------------------------------------- 
--------------------------------------------- ||| ------------------------------------------- 
---------------------------------------------     ------------------------------------------- 

# COMMON GIT COMMANDS EXPLAINED

### git status: Shows which files have changed and what's staged.
_Mnemonic: "Status check before commit check"_

git status


### git diff: Shows the actual code differences (unstaged changes).
_Mnemonic: "Diff = what's different"_

git diff


### git diff --staged: Shows changes that have been staged (ready to commit).

git diff --staged


### git add [file]: Stages a specific file for commit.
_Mnemonic: "Add to the basket before checkout"_

git add src/components/ui/Button.tsx


### git commit -m "message": Commits staged changes with a description.
_Mnemonic: "Message required for memory"_

git commit -m "Fix: corrected padding in Button"


### git commit -am "message": Stages *and* commits all modified (already tracked) files.
_Note: Does NOT include new/untracked files._

git commit -am "Fix: refactored dashboard layout"


### git checkout -b [branch]: Creates and switches to a new branch.
_Mnemonic: "Check out the new branch"_

git checkout -b feature/new-ui-redesign


### git switch [branch]: Switches to an existing branch.

git switch dev


### git restore [file]: Restores a modified file to its last committed state.

git restore src/components/ui/Header.tsx

### git log --oneline: Shows a short summary of recent commits.

git log --oneline

### git pull: Fetches and merges changes from remote.

git pull origin main

### git push: Sends your local commits to the remote repo.

git push origin dev

### git reset --hard HEAD: DANGER ZONE — Reverts all changes to last commit.
_Mnemonic: "Hard reset = hammer smash all changes!"_
_WARNING: Cannot be undone. Only use when you're sure._

git reset --hard HEAD

---------------------------------------------     ------------------------------------------- 
--------------------------------------------- ||| ------------------------------------------- 
---------------------------------------------     ------------------------------------------- 

# Common Watchman, npm, and npx Commands

------------------------------------------------------------ 
## Watchman

```
# Remove all watches (useful when debugging cache/stale issues)
watchman watch-del-all

# Clear all watchman watches — useful when debugging stale caches or directory changes```
watchman watch-del-all

------------------------------------------------------------ 
## npm

```
# Reinstall all node modules cleanly — removes node_modules and reinstalls dependencies from package.json
rm -rf node_modules && npm install

# Start React Native (CLI) with cache reset — clears Metro bundler cache
npm start -- --reset-cache

# Start Expo with cache clear — same as above, for Expo projects
expo start -c

# Run basic ESLint check — checks for code style and rule violations
npm run lint

# Auto-fix common ESLint issues (formatting, style, etc.)
npm run lint:fix

# Check for theming rule violations (tokens.* usage, etc.)
npm run lint:check-theme

# Auto-fix theming rule violations
npm run lint:fix-theme

# Run CI-safe linting — fails build on *any* lint warning or error
npm run lint:ci

# Install a development-only dependency (like ESLint or Prettier)
npm install --save-dev <package-name>
```
------
### ** Backend Control (via npm scripts) **

```
# Start backend server (defined in package.json "scripts")
npm run dev

# Run production build or start production server
npm run build
npm run start

# Restart with logs suppressed
npm run dev > /dev/null 2>&1 &

# Auto-detect and fix text // STRING ERRORS // — one-time or live
npm run fix:text-errors && npm run watch:text-errors
```
------------------------------------------------------------ 
## npx

```
# Run ESLint via npx
npx eslint . --ext .ts,.tsx

# Run a specific script
npx tsx scripts/my-script.ts
```
-------
### ** Expo + npx (Frontend App Control) **

```
# Start the Expo development server
npx expo start

# Start Expo and clear Metro bundler cache
npx expo start --clear

# Build for iOS using Expo Application Services
npx expo run:ios

# Build for Android
npx expo run:android

# String multiple commands — e.g., clean cache, then start app
watchman watch-del-all && rm -rf node_modules && npm install && npx expo start --clear

```
--------------------------------------------- -------------------------------------------   

# Multistep Project Reset

```
# Reset everything and relaunch app

cd PROJECT/ROOT
watchman watch-del-all && rm -rf node_modules && npm install && npx expo start --clear
```

---------------------------------------------     ------------------------------------------- 
--------------------------------------------- ||| ------------------------------------------- 
---------------------------------------------     ------------------------------------------- 

# Definitions

## METRO BUNDLER
Metro Bundler is the JavaScript bundler used by React Native to compile and package your code for iOS and Android. Think of it as the brain behind how your React Native app is served during development.

Here's what it does:

Watches your source files for changes

Compiles and bundles your JavaScript/TypeScript code into a single file

Serves the app to the mobile simulator or device

Provides live reloading and error overlays in development

---------------------------------------------     ------------------------------------------- 
--------------------------------------------- ||| ------------------------------------------- 
---------------------------------------------     ------------------------------------------- 

    \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
    --------------------------------------------- ------------------------------------------- ------------------------------------------- 
<<< --------------------------------------------- ------------------------------------------ END ------------------------------------------ >>>
    --------------------------------------------- ------------------------------------------- -------------------------------------------  
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

