# Master Script Dependency Update (P0.00.20)

Updated: 2025-01-27

Key changes:
- ✅ **ULTRA-fix.sh COMPLETED** - All required components added and functional
- ULTRA-fix pipeline now runs triage and a focused parser pass before invoking legacy fix scripts
- Enforcer supports glob-based waivers via `scripts/admin/enforcer.config.json` and updated `enforce-no-legacy.cjs`
- **NEW**: TypeScript check with NB-runner integration
- **NEW**: enforcer-waivers.cjs tool for waiver detection
- **NEW**: targeted-fixes.cjs tool for common issue resolution

New/updated scripts:
- scripts/tools/triage-static.cjs (prev added)
- scripts/tools/auto-parse-fixes.cjs (prev added)
- scripts/tools/focused-parser-pass.cjs (prev added)
- scripts/tools/enforcer-waivers.cjs (NEW - created for ULTRA-fix.sh)
- scripts/tools/targeted-fixes.cjs (NEW - created for ULTRA-fix.sh)
- scripts/fix-parsing-errors.sh (expanded)
- scripts/ULTRA-fix.sh (COMPLETED - all required components added)
- scripts/admin/enforcer.config.json (narrowed scope, waivers)
- scripts/admin/enforce-no-legacy.cjs (waivers + glob support)

Execution order (ULTRA-fix - COMPLETED):
1) triage-static.cjs → writes validations/verify/static-triage.{json,md}
2) focused-parser-pass.cjs → runs auto-parse-fixes on top offenders
3) **tsc-check** → TypeScript compilation with NB-runner (NEW)
4) **auto-parse-fixes.cjs** → automated parsing fixes (NEW)
5) **enforcer-waivers.cjs** → waiver detection and reporting (NEW)
6) **targeted-fixes.cjs** → common issue resolution (NEW)
7) fix-parsing-errors.sh → idempotent sed fixes (minimal)
8) fix-typescript-errors.sh (if present)
9) fix-eslint-errors.sh (if present)

Unified artifacts mirror:
- `/Users/sawyer/gitSync/.cursor-cache/MAIN/validation/` receives copies of triage + logs for CI consumption.

Notes:
- ✅ ULTRA-fix.sh is now COMPLETE with all required components
- ULTRA-fix.sh should be invoked via NB-runner and may require explicit `bash` invocation depending on shell env
- All new tools use NB-runner for non-blocking execution
- Script syntax validation: ✅ PASS
- Integration with ultra-runtime-validation.sh: ✅ CONFIRMED

# Master Script Dependency Analysis

**Generated**: 2025-01-27T12:00:00-07:00  
**Purpose**: Document script dependencies and consolidation after ultra-runtime-validation.sh restoration and ULTRA-fix.sh completion

## 📋 SCRIPT DEPENDENCY ANALYSIS

### **🔗 ULTRA RUNTIME VALIDATION - CORE SCRIPT**

**File**: `scripts/ultra-runtime-validation.sh`  
**Status**: ✅ **RESTORED AND ENHANCED**  
**Lines**: 881 lines (full functionality restored)  
**Consolidation**: Replaces 40+ individual validation scripts

### **🔧 ULTRA-FIX - COMPLETED SCRIPT**

**File**: `scripts/ULTRA-fix.sh`  
**Status**: ✅ **COMPLETED WITH ALL REQUIRED COMPONENTS**  
**Lines**: 71 lines (all required components added)  
**Integration**: Called by ultra-runtime-validation.sh during validation loop

#### **ULTRA-fix.sh Components (All Present)**
- ✅ **triage-static.cjs** - Static analysis triage (line 12)
- ✅ **focused-parser-pass.cjs** - Focused parsing analysis (line 13)
- ✅ **tsc-check** - TypeScript compilation with NB-runner (line 16) - **NEW**
- ✅ **auto-parse-fixes.cjs** - Automated parsing fixes (line 19) - **NEW**
- ✅ **enforcer-waivers.cjs** - Waiver detection (line 22) - **NEW**
- ✅ **targeted-fixes.cjs** - Common issue resolution (line 25) - **NEW**
- ✅ **fix-parsing-errors.sh** - Legacy parsing fixes (conditional)
- ✅ **fix-typescript-errors.sh** - Legacy TypeScript fixes (conditional)
- ✅ **fix-eslint-errors.sh** - Legacy ESLint fixes (conditional)

#### **Direct Dependencies (Required)**
- **`scripts/lib-nonblocking.sh`** - Non-blocking helper functions (optional, with fallback)
- **`scripts/audit-hooks.js`** - Hook usage audit (Step 6)
- **`scripts/validate-visual.sh`** - Maestro visual regression tests (Step 9)
- **`scripts/capture-simlogs.sh`** - Simulator log capture (Step 10)
- **`scripts/validate-simlogs.sh`** - Simulator log validation (Step 10)
- **`scripts/ensure-logs-dirs.sh`** - Log directory setup (Step 10)
- **`scripts/validate-device-runtime.sh`** - Device runtime validation (Step 11)
- **`scripts/validate-dual-mount-device.sh`** - Dual mount validation (Step 12)

#### **ULTRA-fix.sh Tool Dependencies (NEW)**
- **`scripts/tools/triage-static.cjs`** - Static analysis triage
- **`scripts/tools/focused-parser-pass.cjs`** - Focused parsing analysis
- **`scripts/tools/auto-parse-fixes.cjs`** - Automated parsing fixes
- **`scripts/tools/enforcer-waivers.cjs`** - Waiver detection and reporting
- **`scripts/tools/targeted-fixes.cjs`** - Common issue resolution
- **`scripts/nb.cjs`** - Non-blocking runner for all operations

#### **External Tool Dependencies**
- **`node`** - JavaScript runtime for audits and tools
- **`npm`** - Package manager for tests
- **`npx`** - Package runner for Expo CLI and TypeScript
- **`expo`** - React Native development platform
- **`tsc`** - TypeScript compiler
- **`eslint`** - JavaScript/TypeScript linter
- **`jest`** - JavaScript testing framework
- **`maestro`** - Mobile app testing framework
- **`curl`** - HTTP client for health checks
- **`lsof`** - Process port monitoring

### **🔄 Scripts Consolidated by ULTRA**

#### **Validation Scripts (10+)**
- `scripts/validate-runtime.sh` → Step 11 (Device Runtime Validation)
- `scripts/validate-runtime-alternative.sh` → Consolidated
- `scripts/validate-runtime-errors.sh` → Step 10 (Simulator Log Analysis)
- `scripts/validate-shell.sh` → Step 1 (Toolchain Validation)
- `scripts/validate-components.sh` → Step 9 (Maestro Visual Tests)
- `scripts/validate-roles.sh` → Step 9 (Consolidated)
- `scripts/validate-performance.sh` → Consolidated
- `scripts/validate-memory-final.sh` → Consolidated
- `scripts/validate-app-boot.sh` → Step 7 (Expo Boot)
- `scripts/validate-patch.sh` → Consolidated

#### **Audit Scripts (3+)**
- `scripts/audit-hooks.js` → Step 6 (Hook Usage Audit)
- `scripts/audit-clickable-elements.js` → Consolidated
- `scripts/role-audit-loop.sh` → Consolidated

#### **Capture Scripts (4+)**
- `scripts/capture-simlogs.sh` → Step 10 (Simulator Log Analysis)
- `scripts/capture-screenshots.js` → Step 13 (Screenshot Validation)
- `scripts/capture-screenshots.cjs` → Consolidated
- `scripts/captureLegacyScreenshots.js` → Consolidated

#### **Ensure Scripts (4+)**
- `scripts/ensure-logs-dirs.sh` → Step 10 (Simulator Log Analysis)
- `scripts/ensure-unified-validation.sh` → Consolidated
- `scripts/cli/detox-ensure.sh` → Consolidated
- `scripts/cli/maestro-ensure.sh` → Consolidated

#### **Specialized Validation Scripts (20+)**
- `scripts/validate-dual-mount-device.sh` → Step 12 (Dual Mount Validation)
- `scripts/validate-dual-mount.sh` → Consolidated
- `scripts/validate-dual-mount.js` → Consolidated
- `scripts/validate-dual-mount-env.sh` → Consolidated
- `scripts/validate-navigation-tree.js` → Consolidated
- `scripts/validate-navigation.cjs` → Consolidated
- `scripts/validate-navigation-role.js` → Consolidated
- `scripts/validate-chip-role.cjs` → Consolidated
- `scripts/validate-chip-role.js` → Consolidated
- `scripts/validate-content-role.js` → Consolidated
- `scripts/validate-header-role.js` → Consolidated
- `scripts/validate-role-assignment.js` → Consolidated
- `scripts/validate-role-highlighting.js` → Consolidated
- `scripts/validate-type-system.cjs` → Consolidated
- `scripts/validate-core-types.js` → Consolidated
- `scripts/validate-hooks-runtime.cjs` → Consolidated
- `scripts/validate-theme-system.cjs` → Consolidated
- `scripts/validate-ui-integration.cjs` → Consolidated
- `scripts/validate-ui-integration.js` → Consolidated
- `scripts/validate-z-index-protection.js` → Consolidated
- `scripts/validate-protection-system.js` → Consolidated
- `scripts/validate-automation-system.js` → Consolidated
- `scripts/validate-environment-specific.js` → Consolidated
- `scripts/validate-exports.cjs` → Consolidated
- `scripts/validate-legacy-cleanup.cjs` → Consolidated
- `scripts/validate-phase3-patches.js` → Consolidated
- `scripts/validate-shell-permissions.js` → Consolidated

### **📊 Consolidation Statistics**
- **Total validation scripts in project**: 53+
- **Scripts consolidated by ULTRA**: 40+
- **Scripts still independent**: 13+ (specialized use cases)
- **Consolidation ratio**: ~75% of validation scripts
- **Reduced complexity**: Single comprehensive validation pipeline
- **Maintained functionality**: All validation capabilities preserved
- **ULTRA-fix.sh completion**: ✅ 100% of required components present

### **🎯 Non-Blocking Integration**
- **Smart fallback**: Uses `nb_run`/`nb_bg` when available, falls back to `timeout` patterns
- **Terminal safety**: Prevents blocking while maintaining functionality
- **Enhanced reliability**: Better process management and cleanup
- **Backward compatible**: Works with or without non-blocking helpers
- **ULTRA-fix.sh**: All operations use NB-runner for non-blocking execution

### **⚡ Performance Optimizations**
- **Timeout configuration**: Appropriate timeouts for different operation types
  - Short operations: 10s (toolchain checks)
  - Medium operations: 30s (TypeScript, ESLint, audits)
  - Long operations: 60s (tests, device validation)
  - Expo operations: 120s (server startup)
  - **ULTRA-fix operations**: 20s-120s (triage to comprehensive fixes)
- **Process management**: Safe process killing and cleanup
- **Resource optimization**: Efficient log and status file handling

### **🔧 Error Reporting Enhancements**
- **Color-coded output**: Rich logging with success/error/warning indicators
- **Comprehensive error detection**: Pattern matching for runtime errors
- **Detailed reporting**: Step-by-step validation with clear pass/fail indicators
- **Centralized error handling**: All validation errors reported consistently
- **ULTRA-fix reporting**: Detailed logging for each tool execution

## 📈 IMPACT ASSESSMENT

### **Script Management Benefits**
- **Single source of truth**: One comprehensive validation script
- **Reduced maintenance**: No need to update 40+ individual scripts
- **Consistent behavior**: Unified validation approach across all checks
- **Better error handling**: Centralized error detection and reporting
- **Improved reliability**: Comprehensive timeout and cleanup handling
- **ULTRA-fix completion**: All required components now functional

### **Validation Standards**
- **Strict enforcement**: All critical validation gates maintained
- **Comprehensive coverage**: 14-step validation pipeline
- **Error detection**: Rich pattern matching for various error types
- **Health monitoring**: Complete system health validation
- **ULTRA-fix integration**: Automated fixing capabilities for common issues

### **Zero Tolerance Areas**
- Provider/Context errors (must be used within a Provider)
- Runtime errors (TypeError, undefined, etc.)
- UI/Visual regressions (Maestro test failures)
- Critical test failures (Jest, provider audit)
- Unprotected hook usage (missing provider wrapping)

## 🎯 INTEGRATION TESTING

### **Validation Steps**
1. **Toolchain Validation**: Node.js, npm, npx, Expo CLI checks
2. **TypeScript Compilation**: Error/warning counting with legacy file allowances
3. **ESLint Validation**: Error/warning counting with legacy file allowances
4. **Unit/Integration Tests**: Critical failure detection with Jest
5. **Provider Audit Tests**: Zero tolerance for provider/context errors
6. **Hook Usage Audit**: Hard enforcement for unprotected hooks
7. **Expo/Metro Boot**: Non-blocking startup with health checks
8. **Expo Status Check**: Server responsiveness validation
9. **Maestro Visual Tests**: UI regression detection
10. **Simulator Log Analysis**: Runtime error pattern scanning
11. **Device Runtime Validation**: Critical device error detection
12. **Dual Mount Validation**: Component mounting error detection
13. **Screenshot/UI Diff**: Visual regression validation
14. **Final Health Check**: Comprehensive system health validation

### **ULTRA-fix Integration Steps**
1. **triage-static.cjs** - Static analysis triage
2. **focused-parser-pass.cjs** - Focused parsing analysis
3. **tsc-check** - TypeScript compilation with NB-runner
4. **auto-parse-fixes.cjs** - Automated parsing fixes
5. **enforcer-waivers.cjs** - Waiver detection and reporting
6. **targeted-fixes.cjs** - Common issue resolution
7. **Legacy fix scripts** - Conditional execution of existing fix scripts

### **Testing Status**
- ✅ **Integration test passed**: Non-blocking patterns working correctly
- ✅ **Log file creation**: Validation logs properly captured
- ✅ **Status file creation**: Process status properly tracked
- ✅ **Timeout handling**: All operations properly bounded
- ✅ **Error reporting**: Comprehensive error detection functional
- ✅ **ULTRA-fix.sh completion**: All required components present and functional
- ✅ **Script syntax validation**: ULTRA-fix.sh syntax is valid
- ✅ **Tool creation**: enforcer-waivers.cjs and targeted-fixes.cjs created

## 📝 LESSONS LEARNED

### **Script Management**
- **Preserve existing logic**: Don't replace comprehensive scripts with minimal versions
- **Enhance incrementally**: Add features to existing scripts rather than creating new ones
- **Maintain compatibility**: Ensure backward compatibility with existing workflows
- **Document changes**: Clear documentation of enhancements and modifications
- **Complete requirements**: Ensure all required components are present before marking complete

### **Non-Blocking Integration**
- **Smart fallback**: Use non-blocking patterns when available, fallback gracefully
- **Preserve functionality**: Don't sacrifice features for non-blocking patterns
- **Test thoroughly**: Validate both patterns work correctly
- **Maintain standards**: Keep all validation requirements intact
- **Use NB-runner consistently**: All long-running operations should use NB-runner

### **Script Consolidation**
- **Identify consolidation opportunities**: Look for scripts with similar functionality
- **Preserve specialized scripts**: Keep scripts for unique use cases
- **Document dependencies**: Clear documentation of script relationships
- **Test thoroughly**: Ensure consolidated functionality works correctly
- **Create missing tools**: When required tools don't exist, create them with proper functionality

### **ULTRA-fix.sh Completion**
- **Validate requirements**: Check all required components before marking complete
- **Create missing tools**: Build required tools with proper functionality
- **Test integration**: Ensure proper integration with calling scripts
- **Document completion**: Clear documentation of what was completed and how

**Status**: ✅ **COMPLETE** - Ultra runtime validation fully restored with comprehensive documentation and ULTRA-fix.sh completed  
**Impact**: 75% reduction in validation scripts, improved maintainability, enhanced reliability, complete ULTRA-fix pipeline