# MAIN Patch Formatting & Versioning Guide (STRICT, 2025-08-03)

## Patch Block Structure

Every patch patch **MUST** include these sections in order:

- `"blockId"`: Versioned identifier (see versioning rules)
- `"phase"`: Patch phase (e.g. "3.99.99")
- `"description"`: Human-readable summary
- **Enforcement Flags** (top-level):
  - `"enforceValidationGate": true`
  - `"strictRuntimeAudit": true`
  - `"runDryCheck": true`
  - `"forceRuntimeTrace": true`
  - `"requireMutationProof": true`
  - `"requireServiceUptime": true`
  - `"blockCommitOnError": true`
  - `"watchConsole": true`
- `"execution"`: Non-blocking, with:
  - `"autoReleaseTimeoutMs": 30000` (or >30s for extra-long ops)
  - `"onReloadHang": "Move to background and resume automatically"`
- `"preMutationBuild"`: (optional) Pre-check commands (e.g. backup, lint, tsc)
- `"postMutationBuild"`: (required) Array of **shell** steps run after mutation, which **MUST** include:

  1. **pre-commit all-files validation (runs all staged hooks including ESLint, tsc, Prettier, etc.)**
     ```bash
     pre-commit run --all-files
     ```

  2. **TypeScript & ESLint hard validation (redundant, but ensures full coverage)**
     ```bash
     npx tsc --noEmit --skipLibCheck
     npx eslint . --ext .ts,.tsx --max-warnings=0
     ```

  3. **Unit & Integration Tests**
     ```bash
     npm run test:unit -- --watchAll=false
     ```

  4. **Expo server refresh in background, non-blocking**
     ```bash
     (
       kill $(lsof -ti:8081) 2>/dev/null || true
       cd /Users/sawyer/gitSync/tm-mobile-cursor/mobile-native-fresh
       timeout 30s npx expo start --ios --clear &
       PID=$!
       sleep 15
       disown $PID
     ) >/dev/null 2>&1 &
     ```

  5. **Visual Validation** (**MANDATORY**; Maestro or equivalent)
     ```bash
     npm run test:maestro:baseline  # (First time or when UI changes)
     npm run test:maestro:visual
     # Or: npm run test:maestro:regression (for full baseline diff)
     ```
     - Must **parse output** for screenshot diffs and failures.
     - Patch is **INVALID** if Maestro visual validation fails.

- `"validate"`: (optional) Standalone validation steps, **must include Maestro or visual regression checks**
  # EXAMPLE for HYBRID PATCH
  "postMutationBuild": {
  "shell": [
    "pre-commit run --all-files",
    "npx tsc --noEmit --skipLibCheck",
    "npx eslint . --ext .ts,.tsx --max-warnings=0",
    "npm run test:unit -- --watchAll=false",
    "(timeout 30s npx expo start --ios --clear & PID=$!; sleep 15; disown $PID) >/dev/null 2>&1 &",
    "npm run test:maestro:baseline",
    "npm run test:maestro:visual"
  ]
}

- `"successCriteria"`: Explicit pass/fail criteria:
  - "TypeScript: 0 blocking errors, <20 non-blocking errors/warnings 
    (all in legacy/test only)"
  - "ESLint: 0 blocking errors, <20 warnings allowed (legacy/test only)"
  - "Expo app launches, renders main navigation and screens with no critical runtime errors"
  - "All tests: PASS"
  - "Maestro visual validation: 0 diffs/failures"
  - "Expo app launches and is interactive"
- `"failureMode"`: (optional) List of abort/rollback policies
- `"summaryFile"`: Path to `.md` summary

---

## Versioning Format

- `patch-vX.Y.ZZ(PN.MM.SS)_slug.json`
  - X.Y.ZZ = version (major.minor.patch)
  - (PN.MM.SS) = PhaseN.Section.Subsection
  - `slug` = kebab-case identifier

**Examples:**
- `patch-v1.4.9999(P3.99.99)_auto-remediation-postmutation-validation.json`
- `patch-v1.4.510(P4.02.04)_thoughtmarkdetail-screen-migration-hardened.json`

---

Absolutely! Here’s an **updated version of your Enforcement Rules** to reflect the latest requirements, including `pre-commit`, Maestro, Expo, error halting, and validation details. This is ready for **copy-paste**:

---

## Enforcement Rules (2025-08 Update)

* **All patches must run the standardized `postMutationBuild.shell` block, which MUST include:**

  * `pre-commit run --all-files` (all pre-commit hooks and formatters)
  * TypeScript compilation: `npx tsc --noEmit --skipLibCheck`
  * ESLint: `npx eslint . --ext .ts,.tsx --max-warnings=20`
  * Unit & integration tests: `npm run test:unit -- --watchAll=false`
  * **Expo/Metro server refresh in background** (timeout + disown for non-blocking)
  * **Visual validation**: `npm run test:maestro:baseline` and `npm run test:maestro:visual` (baseline & regression checks are mandatory)
* **No patch may mark as complete unless all validation gates pass:**

  * **TypeScript**: 0 blocking errors (maximum 20 non-blocking errors/warnings, *only* in legacy or test files)
  * **ESLint**: 0 blocking errors (maximum 20 non-blocking warnings, *only* in legacy or test files)
  * **Expo/Metro**: App must launch and render main navigation with no critical runtime errors
  * **Visual Validation**: All Maestro screenshot and UI diff checks must be green (no visual regressions allowed)
* **Halt/abort on error:**

  * Patches must halt immediately and emit a summary if any **blocking** TypeScript, ESLint, runtime, or visual validation error is encountered (unless the patch is explicitly tagged as “soft” or “diagnostic”).
* **Expo/Metro and Device Refresh:**

  * Forced Expo/Metro server refresh and device/app relaunch are **required** on every patch, with non-blocking timeout and background handling.
* **No “soft success” allowed:**

  * No patch, commit, or migration may be marked as successful if any validation gate fails.
* **Screenshot/UI Diff Gate:**

  * Patch is **INVALID** if Maestro visual validation fails (screenshot/UI diff not green).
* **Auto-remediation:**

  * May be included only if safe, fully logged, and does not mask validation failures.
* **Zero Exceptions:**

  * No patch may skip these requirements unless specifically overridden by the Captain (user) in writing.

---

## Forbidden Patterns

- No `"src/"` in root directory
- No `"src-nextgen/"` in root directory
- No `"src/"` in ./mobile-native-fresh
- No direct mutation of node_modules or system files
- No skipping validation on patch finalization

---

## Naming and Location

- All patches named `patch-v*` and placed 
in `/Users/sawyer/gitSync/.cursor-cache/MAIN/patches/< subdirectory >`

---

**Last revised: 2025-08-03 by GPT/BRAUN enforcement.**

---

### 🚨 **Key Requirements in this Revision**
- **Expo refresh** is required, timeout-guarded, disowned, and non-blocking in all postMutationBuilds.
- **Visual validation (Maestro) is **MANDATORY** for patch acceptance, and must parse and report screenshot diffs.
- **Patch is invalid if any visual regression (diff/fail) is detected** or Expo fails to launch/refresh.
- **Success requires both code and visual validation, not just TypeScript/test pass.**


---

**Last revised: 2025-08-05 by GPT/BRAUN enforcement.**
