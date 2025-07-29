# 🚀 **src-nextgen/ ROADMAP FOR DUMMIES** 
## **B + D + E Strategy: Clean Rebuild + Dual-Mount + Hybrid Shell**

**Generated**: 2025-07-19T09:00:00.000Z  
**Strategy**: src-reference/ → Clean Rebuild + Dual-Mount + Hybrid Renderer Shell  
**Status**: Ready for Phase 0 implementation with comprehensive safety measures

---

## 🎯 **STRATEGY OVERVIEW: B + D + E**

### **B: src-reference/ → Clean Rebuild**
```
✅ APPROACH:
- Legacy src/ moved to src-reference/ as complete backup
- Broken logic is cheaper to restart than fix
- Transplant sacred fragments from reference
- Most defensible right now

✅ BENEFITS:
- No destructive overwrite of working code
- Can cherry-pick working components
- Maintains rollback safety
- Enables parallel development
```

### **D: Dual-Mount Architecture**
```
✅ APPROACH:
- Create src-nextgen/ alongside src/
- Rebuild one screen at a time inside src-nextgen/
- Update App.tsx to toggle between legacy and nextgen via env flag
- Enable parallel CI visual tests for both

✅ IMPLEMENTATION:
const App = process.env.EXPERIMENTAL_NEXTGEN === "true" 
  ? require("./src-nextgen/App").default
  : require("./src/App").default

✅ BENEFITS:
- No destructive overwrite
- Test next-gen screens with full routing
- Keep dev productivity high
- Enable parallel CI visual tests for both
- Facebook, Uber, Shopify — all do dual-mount "modernization" strategies
```

### **E: Hybrid Renderer Shell**
```
✅ APPROACH:
- Keep src/ for now
- Scaffold new shell: src/shell/ containing:
  - Role-based wrappers
  - Layout contracts
  - Navigation definitions
  - Sacred view mounts
- Slowly migrate views into shell/, while existing ones die off

✅ BENEFITS:
- Controlled transition
- Lower initial lift than full rebuild
- Can gradually delete legacy cruft
- Works great with patch-runner automation
- Gradual migration path
```

---

## 🧩 **SCREEN MOUNT TYPES BREAKDOWN**

### **Structural Triad for Phase 2**

#### **1. src-nextgen/ → Full Dual-Routing Screens**
```
✅ PURPOSE: Screens using full dual-routing capabilities
✅ USAGE: High-traffic screens that need complete nextgen implementation
✅ EXAMPLES:
- DashboardScreen.tsx → src-nextgen/screens/DashboardScreen.tsx
- HomeScreen.tsx → src-nextgen/screens/HomeScreen.tsx
- ThoughtmarkDetailScreen.tsx → src-nextgen/screens/ThoughtmarkDetailScreen.tsx
- SearchScreen.tsx → src-nextgen/screens/SearchScreen.tsx
- AllBinsScreen.tsx → src-nextgen/screens/AllBinsScreen.tsx

✅ VALIDATION: Must have snapshot + interaction tests in both legacy and nextgen environments
```

#### **2. src/shell/ → Shared Infrastructure & Sacred Views**
```
✅ PURPOSE: Shared wrappers, sacred views, and role-based infrastructure
✅ USAGE: Components that must remain consistent across both environments
✅ EXAMPLES:
- Role-based wrappers (AutoRoleView, etc.)
- Layout contracts and navigation definitions
- Sacred view mounts (BottomNav, Onboarding)
- Authentication components (SignIn, SignUp, PINEntry)
- Settings components (Profile, Content, Export)

✅ VALIDATION: Must be imported by both legacy and nextgen, never recreated
```

#### **3. src-reference/ → Legacy Cherry-Pick Source**
```
✅ PURPOSE: Legacy codebase to cherry-pick working components from
✅ USAGE: Source for transplanting sacred fragments and working logic
✅ EXAMPLES:
- Working component implementations
- Proven business logic
- Stable utility functions
- Tested navigation patterns

✅ VALIDATION: Read-only reference, never modified directly
```

---

## 🛡️ **SACRED VIEW INJECTION POLICY**

### **Sacred Views Must Be Mounted Once in src/shell/**
```
✅ SACRED VIEWS (Never Change):
- BottomNav.tsx → src/shell/navigation/BottomNav.tsx
- Onboarding components → src/shell/onboarding/
- Core navigation logic → src/shell/navigation/
- Authentication flows → src/shell/auth/

✅ INJECTION POLICY:
- These are mounted once in src/shell/
- Any src-nextgen route must import these from shell, not recreate them
- This guarantees sacred consistency across both environments
- No duplicate implementations allowed

✅ VALIDATION:
- Single source of truth for sacred views
- Import validation in CI pipeline
- No sacred view recreation in src-nextgen/
- Consistency checks between legacy and nextgen
```

---

## 🔌 **PATCH-RUNNER AUTOMATION POLICY**

### **Automated Hybrid Block Enforcement**
```
✅ PATCH NAMING CONVENTIONS:
- Format: patch-1.4.1e-{phase}-{step}_{description}.json
- Examples:
  - patch-1.4.1e-1-3e_src-nextgen-init.json
  - patch-1.4.1e-2-1c_dashboard-init.json
  - patch-1.4.1e-2-2c_shell-auth-migration.json

✅ VALIDATION GATES (Non-Negotiable):
- All validation gates must trigger before every commit
- tsc --noEmit (TypeScript validation)
- { { { { { { npm run lint:guard (ESLint validation) & } >/dev/null 2>&1 & disown &  & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown & & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown
- Visual regression testing (both legacy and nextgen)
- Performance impact measurement
- Accessibility compliance check
- Runtime error detection
- Dual-mount toggle validation

✅ SUMMARY CROSS-REFERENCING:
- All .md summaries must cross-reference the relevant patch + roadmap phase
- Patch summaries written to /mobile-native-fresh/tasks/summaries/
- Executive summaries must reference specific patches
- Strategy analysis must include patch impact assessment
```

---

## 🔎 **CI PARALLEL TESTING ENFORCEMENT**

### **Non-Negotiable Dual Environment Testing**
```
✅ MANDATORY REQUIREMENTS:
- Every screen migrated to src-nextgen must have snapshot + interaction tests in both environments
- These are NOT optional - they're what make dual-mount viable as a safety net
- Legacy environment testing must remain functional
- Nextgen environment testing must validate new implementations

✅ TESTING FRAMEWORK:
- Snapshot testing for both legacy and nextgen
- Interaction testing for both environments
- Visual regression testing for both modes
- Performance testing for both implementations
- Accessibility testing for both versions

✅ CI PIPELINE:
- Parallel test execution for legacy and nextgen
- Automated comparison between environments
- Performance regression detection
- Visual regression detection
- Accessibility compliance validation

✅ FAILURE HANDLING:
- Stop all automation on validation failure
- Revert to last known good state
- Document the failure point
- Create targeted fix before continuing
```

---

## 🚨 **CRITICAL FAILURE ANALYSIS (Past Attempts)**

### **Failed Approaches to Avoid**
1. **A: Surgical Patch Recovery** - Assumes stable base (false)
2. **C: Nuke to v1.3.2 Snapshot** - Regression risk, still had theme/role debt
3. **Mass AutoRoleView Migration** - 4x rollback failures due to implementation flaws

### **Root Cause: Implementation Strategy Flaws**
- ❌ **Mass migration approach** instead of incremental
- ❌ **No role analysis** before implementation
- ❌ **Missing performance monitoring** and benchmarking
- ❌ **Debug system overwhelmed** the UI
- ❌ **Poor rollback strategy** and validation

---

## 🎯 **REVISED STRATEGY: B + D + E IMPLEMENTATION**

### **Phase 0: Foundation & Dual-Mount Setup (1 day)**
```
✅ MANDATORY TASKS:
- Move src/ to src-reference/ (complete backup)
- Create src-nextgen/ directory structure
- Set up dual-mount App.tsx toggle
- Performance benchmarking tools setup
- Visual regression baseline capture
- Accessibility compliance audit
- Role analysis documentation
- Testing framework setup
- Rollback strategy validation
- Debug system configuration
- Sacred component identification

✅ DUAL-MOUNT SETUP:
- Update App.tsx with environment toggle
- Configure CI for parallel testing
- Set up development environment flags
- Create migration tracking system
```

### **Phase 1: Hybrid Shell Scaffold (1 day)**
```
✅ SHELL STRUCTURE:
- Create src/shell/ directory
- Implement role-based wrappers
- Define layout contracts
- Set up navigation definitions
- Create sacred view mounts
- Configure patch-runner automation

✅ PILOT COMPONENTS (3-5 simple):
- Button.tsx → interactiveRole="button-action"
- Text.tsx → contentRole="body"
- TagChip.tsx → interactiveRole="chip"
- ModernHeader.tsx → layoutRole="header"
- BottomNav.tsx → layoutRole="navigation"

✅ VALIDATION AFTER EACH:
- Snapshot captured
- Lint + typecheck clean
- Debug overlay confirmed
- Accessibility pro{ { { ps validated & &  & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown
- No sacred components violated
- Dual-mount toggle working
```

### **Phase 2: Systematic Migration (3-5 days)**
```
✅ HIGH TRAFFIC SCREENS (Dual-Mount):
- DashboardScreen.tsx → src-nextgen/screens/DashboardScreen.tsx
- HomeScreen.tsx → src-nextgen/screens/HomeScreen.tsx
- ThoughtmarkDetailScreen.tsx → src-nextgen/screens/ThoughtmarkDetailScreen.tsx
- SearchScreen.tsx → src-nextgen/screens/SearchScreen.tsx
- AllBinsScreen.tsx → src-nextgen/screens/AllBinsScreen.tsx

✅ AUTHENTICATION + INPUT (Shell Migration):
- SignIn.tsx → src/shell/auth/SignIn.tsx
- SignUp.tsx → src/shell/auth/SignUp.tsx
- PINEntryScreen.tsx → src/shell/auth/PINEntryScreen.tsx
- CreateBinScreen.tsx → src/shell/bins/CreateBinScreen.tsx
- AIToolsScreen.tsx → src/shell/ai/AIToolsScreen.tsx

✅ SETTINGS + MISC (Shell Migration):
- ProfileScreen.tsx → src/shell/settings/ProfileScreen.tsx
- ContentScreen.tsx → src/shell/content/ContentScreen.tsx
- ExportScreen.tsx → src/shell/export/ExportScreen.tsx
- AllSettings → src/shell/settings/AllSettings.tsx

✅ VALIDATION AFTER EACH SCREEN:
- Visual regression testing (both legacy and nextgen)
- Performance impact measurement
- Accessibility compliance check
- Runtime error detection
- Rollback point creation
- Documentation update
- Dual-mount toggle validation
```

### **Phase 3: Optimization & Consolidation (1-2 days)**
```
✅ FINAL TASKS:
- Optimize performance bottlenecks
- Refine role assignments based on usage
- Validate accessibility compliance
- Test visual regression thoroughly
- Document final implementation
- Performance regression testing
- Memory usage optimization
- Gradual legacy cleanup
- Final dual-mount validation

✅ CONSOLIDATION:
- Remove unused legacy components
- Optimize bundle size
- Finalize migration documentation
- Validate complete dual-mount system
```

---

## 🔐 **MANDATORY SAFETY MEASURES**

### **1. Validation Gates (Non-Negotiable)**
```
✅ REQUIRED CHECKS AFTER EACH CHANGE:
- Parse and type checking (tsc --noEmit)
- Visual regression testing (both legacy and nextgen)
- Performance impact measurement
- Accessibility compliance validation
- ESLint and linting validation
- Memory usage monitoring
- Runtime error detection
- Dual-mount toggle validation
```

### **2. Rollback Safety**
```
✅ ROLLBACK REQUIREMENTS:
- Git tags at each phase (v1.4.1-phase0-baseline, etc.)
- Backup creation before major changes
- Incremental rollback capabilities
- Recovery procedure testing
- Automated rollback triggers
- Manual rollback procedures
- src-reference/ preservation
```

### **3. Performance Monitoring**
```
✅ PERFORMANCE REQUIREMENTS:
- Performance baseline establishment
- Continuous performance tracking
- Performance regression detection
- Memory usage monitoring
- Render time tracking
- Bundle size monitoring
- No more than 5% render time increase
- No more than 10% memory usage increase
- Dual-mount overhead measurement
```

### **4. Debug System Controls**
```
✅ DEBUG REQUIREMENTS:
- Debug mode toggles (basic/verbose/off)
- Debug level controls per component
- Production debug strip{ { { ping
- Debug performance optimization & &  & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown
- Environment-specific debug settings
- Component-specific debug controls
- Dual-mount debug controls
```

---

## 🚨 **CRITICAL WARNINGS**

### **1. Avoid Mass Migration**
```
🚨 WARNING: Never attempt global View → AutoRoleView replacement
- Always migrate component by component
- Test after each component
- Validate performance impact
- Create rollback points frequently
- Use dual-mount for safe testing
```

### **2. Performance Impact is Real**
```
🚨 WARNING: AutoRoleView overhead is significant
- Performance impact multiplies across components
- Benchmark before migration
- Monitor performance continuously
- Optimize performance bottlenecks
- Measure dual-mount overhead
```

### **3. Debug Systems Can Overwhelm**
```
🚨 WARNING: Debug overlays can overwhelm the UI
- Debug calculations impact performance
- Implement debug controls
- Strip debug in production
- Optimize debug overhead
- Control debug in dual-mount mode
```

### **4. Role Conflicts Are Inevitable**
```
🚨 WARNING: Role conflicts will occur
- Plan conflict resolution strategy
- Create role hierarchy rules
- Provide fallback mechanisms
- Test conflict resolution
- Document role assignment guidelines
```

### **5. Validation Is Mandatory**
```
🚨 WARNING: Never skip validation ste{ { { ps
- Test after each change & &  & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown
- Validate visual regression (both modes)
- Monitor performance impact
- Check accessibility compliance
- Validate dual-mount functionality
```

---

## 📊 **SUCCESS METRICS**

### **Performance Metrics**
```
✅ TARGETS:
- No more than 5% render time increase
- No more than 10% memory usage increase
- No performance regressions in critical paths
- Bundle size increase < 15%
- Startup time increase < 10%
- Dual-mount overhead < 3%
```

### **Quality Metrics**
```
✅ TARGETS:
- 100% accessibility compliance
- Zero visual regressions (both legacy and nextgen)
- All ESLint rules passing
- No runtime errors
- 100% test coverage for new components
- Zero accessibility violations
- Dual-mount toggle working perfectly
```

### **Process Metrics**
```
✅ TARGETS:
- Each phase completed within estimated time
- Rollback capability tested and working
- Documentation updated for each phase
- Team knowledge transfer completed
- Zero rollback failures
- 100% validation gate compliance
- Dual-mount CI pipeline working
```

---

## 🔄 **AUTOMATED PATCH SYSTEM**

### **Patch ID Format**
```
patch-1.4.1e-{phase}-{step}_{description}.json
Example: patch-1.4.1e-1-3e_src-nextgen-init.json
```

### **Patch Lifecycle**
```
1. Pre-commit backup to /Users/sawyer/gitSync/_backups/tm-safety_backups/
2. Mutation with validation gates
3. Post-mutation build checks
4. Git commit with descriptive message
5. Tag creation for rollback points
6. Summary written to /mobile-native-fresh/tasks/summaries/
7. Dual-mount validation
```

### **Validation Gates**
```
✅ MANDATORY CHECKS:
- tsc --noEmit (TypeScript validation)
- npm run lint:guard (ESLint validation)
- Visual regression testing (both modes)
- Performance impact measurement
- Accessibility compliance check
- Runtime error detection
- Dual-mount toggle validation
```

---

## 📘 **COMPANION DOCUMENTATION**

### **Core Documentation**
- `README.md`: Main strategy and phase tracking
- `INDEX.md`: Patch phase status and summaries
- `ROLE_TYPE_MAP.md`: Role assignment guidelines
- `SACRED_COWS_PROTECTION.md`: Protected components
- `THEME_ASSIGNMENT_RULES.md`: Theme integration rules
- `DUAL_MOUNT_GUIDE.md`: Dual-mount implementation guide
- `SHELL_MIGRATION_GUIDE.md`: Shell migration procedures

### **Audit & Analysis**
- `UI-AUDIT-RESULTS.md`: Visual regression reports
- `VISUAL_ENFORCEMENT_PLAN.md`: Enforcement strategy
- `VISUAL_VALIDATION_PLAN.md`: Validation procedures
- `UNIFIED_THOUGHTMARK.md`: Component unification
- `DUAL_MOUNT_PERFORMANCE.md`: Performance analysis

### **Legacy Reference**
- `src-reference/`: Complete legacy backup
- `tasks_FAILED/`: Historical failure analysis
- `postmortem-v1.4.0-4x-rollback-analysis.md`: Failure lessons

---

## 🎯 **KEY LESSONS LEARNED**

### **1. Incremental Approach Is Critical**
```
✅ LESSON: Mass migration always fails
- Component-by-component migration required
- Testing after each component essential
- Rollback points between phases mandatory
- Dual-mount enables safe testing

❌ AVOID: Global replacement strategies
- Skip{ { { ping validation steps & &  & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown
- Ignoring performance impact
- Assuming changes are safe
```

### **2. Role Analysis Must Precede Implementation**
```
✅ LESSON: Role assignment requires analysis
- Component purpose analysis required
- Role map{ { { ping documentation essential & &  & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown
- Conflict resolution strategy needed
- Shell structure enables gradual migration

❌ AVOID: Automated role assignment without analysis
- Ignoring role conflicts
- Skip{ { { ping role hierarchy planning & &  & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown
- Assuming simple View → AutoRoleView map{ { { ping
``` & &  & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown

### **3. Performance Must Be Monitored**
```
✅ LESSON: Performance impact is cumulative
- Benchmarking before migration essential
- Continuous performance tracking required
- Performance optimization ongoing
- Dual-mount overhead must be measured

❌ AVOID: Ignoring performance implications
- Skip{ { { ping performance testing & &  & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown
- Assuming AutoRoleView overhead is negligible
- No performance monitoring
```

### **4. Debug Systems Need Controls**
```
✅ LESSON: Debug systems can overwhelm
- Debug controls essential
- Production debug strip{ { { ping required & &  & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown
- Debug performance optimization needed
- Dual-mount debug controls required

❌ AVOID: Debug overlays always on
- No debug controls
- Debug in production
- Ignoring debug performance impact
```

### **5. Rollback Strategy Is Essential**
```
✅ LESSON: Rollbacks must be planned
- Rollback points required
- Rollback testing essential
- Recovery procedures needed
- src-reference/ provides ultimate safety

❌ AVOID: No rollback strategy
- Assuming changes are reversible
- Skip{ { { ping rollback testing & &  & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown
- No recovery procedures
```

---

## 🚀 **CONCLUSION**

The **B + D + E strategy** combines the best approaches:
- **B**: Clean rebuild from src-reference/ (most defensible)
- **D**: Dual-mount architecture (enables safe testing)
- **E**: Hybrid renderer shell (controlled transition)

This approach **avoids the 4x rollback failures** by:
1. **Incremental migration** - never mass replacement
2. **Performance monitoring** - AutoRoleView overhead is real
3. **Debug controls** - debug systems can overwhelm
4. **Validation gates** - test after every change
5. **Rollback strategy** - plan for failure scenarios
6. **Dual-mount safety** - test nextgen alongside legacy

**The AutoRoleView system itself is sound** - the failure was in the **implementation approach**. With proper incremental migration, role analysis, performance monitoring, and safety measures, src-nextgen/ can be successfully implemented.

**Success depends on following the lessons learned from the 4x rollback failures while leveraging the B + D + E strategy.**

---

**Status**: ✅ Analysis Complete  
**Strategy**: B + D + E (Clean Rebuild + Dual-Mount + Hybrid Shell)  
**Root Cause**: Implementation strategy flaws  
**Solution**: Incremental approach with comprehensive validation  
**Next Steps**: Implement Phase 0 foundation with dual-mount setup

**Maintained by GPT autopilot. Do not modify manually unless instructed.** 