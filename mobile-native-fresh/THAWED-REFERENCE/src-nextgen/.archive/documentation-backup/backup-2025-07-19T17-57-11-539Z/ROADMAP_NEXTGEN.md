# 🚀 **ROADMAP_NEXTGEN.md**
## **B + D + E Strategy: Clean Rebuild + Dual-Mount + Hybrid Shell**

**Generated**: 2025-07-19T10:00:00.000Z  
**Version Format**: v1.4.1{phase}{step}{attempt}(P{phase}.{step}.{attempt})  
**Strategy**: src-reference/ → Clean Rebuild + Dual-Mount + Hybrid Renderer Shell  
**Status**: Ready for Phase 0 implementation with comprehensive safety measures

---

## 📋 **VERSIONING CONVENTION**

### **Format**: `v1.4.1{phase}{step}{attempt}(P{phase}.{step}.{attempt})`
```
✅ EXAMPLES:
- v1.4.110(P1.1.0) = Phase 1, Step 1, Attempt 0
- v1.4.112(P1.1.2) = Phase 1, Step 1, Attempt 2 (hotfix)
- v1.4.120(P1.2.0) = Phase 1, Step 2, Attempt 0
- v1.4.210(P2.1.0) = Phase 2, Step 1, Attempt 0
- v1.4.215(P2.1.5) = Phase 2, Step 1, Attempt 5 (troubleshooting)

✅ PATCH NAMING: patch-v1.4.1{phase}{step}{attempt}(P{phase}.{step}.{attempt})_{description}.json
✅ BACKUP TAGS: backup-v1.4.1{phase}{step}{attempt}(P{phase}.{step}.{attempt})_{description}
✅ SUMMARY NAMES: summary-v1.4.1{phase}{step}{attempt}(P{phase}.{step}.{attempt})_{description}.md
```

---

## 🎯 **PHASE 0: FOUNDATION & DUAL-MOUNT SETUP**

### **Step 0.1: Legacy Backup & Reference Setup**
- [ ] **TASK**: Move src/ to src-reference/ (complete backup)
  - **PATCH**: `patch-v1.4.100(P0.1.0)_legacy-backup.json`
  - **BACKUP TAG**: `backup-v1.4.100(P0.1.0)_legacy-backup`
  - **SUMMARY**: `summary-v1.4.100(P0.1.0)_legacy-backup.md`
  - **VERSION**: v1.4.100(P0.1.0)
  - **VALIDATION**: Verify src-reference/ contains complete legacy codebase

- [ ] **TASK**: Create src-nextgen/ directory structure
  - **PATCH**: `patch-v1.4.101(P0.1.1)_nextgen-init.json`
  - **BACKUP TAG**: `backup-v1.4.101(P0.1.1)_nextgen-init`
  - **SUMMARY**: `summary-v1.4.101(P0.1.1)_nextgen-init.md`
  - **VERSION**: v1.4.101(P0.1.1)
  - **VALIDATION**: Verify src-nextgen/ structure matches roadmap

### **Step 0.2: Dual-Mount Configuration**
- [ ] **TASK**: Set up dual-mount App.tsx toggle
  - **PATCH**: `patch-v1.4.110(P0.2.0)_dual-mount-toggle.json`
  - **BACKUP TAG**: `backup-v1.4.110(P0.2.0)_dual-mount-toggle`
  - **SUMMARY**: `summary-v1.4.110(P0.2.0)_dual-mount-toggle.md`
  - **VERSION**: v1.4.110(P0.2.0)
  - **VALIDATION**: Test environment toggle functionality

- [ ] **TASK**: Configure CI for parallel testing
  - **PATCH**: `patch-v1.4.111(P0.2.1)_ci-parallel-setup.json`
  - **BACKUP TAG**: `backup-v1.4.111(P0.2.1)_ci-parallel-setup`
  - **SUMMARY**: `summary-v1.4.111(P0.2.1)_ci-parallel-setup.md`
  - **VERSION**: v1.4.111(P0.2.1)
  - **VALIDATION**: Verify CI pipeline for both legacy and nextgen

- [ ] **TASK**: Set up development environment flags
  - **PATCH**: `patch-v1.4.112(P0.2.2)_env-flags-setup.json`
  - **BACKUP TAG**: `backup-v1.4.112(P0.2.2)_env-flags-setup`
  - **SUMMARY**: `summary-v1.4.112(P0.2.2)_env-flags-setup.md`
  - **VERSION**: v1.4.112(P0.2.2)
  - **VALIDATION**: Test environment flag functionality

### **Step 0.3: Performance & Validation Setup**
- [ ] **TASK**: Set up performance benchmarking tools
  - **PATCH**: `patch-v1.4.120(P0.3.0)_perf-benchmark-setup.json`
  - **BACKUP TAG**: `backup-v1.4.120(P0.3.0)_perf-benchmark-setup`
  - **SUMMARY**: `summary-v1.4.120(P0.3.0)_perf-benchmark-setup.md`
  - **VERSION**: v1.4.120(P0.3.0)
  - **VALIDATION**: Verify performance measurement tools working

- [ ] **TASK**: Create visual regression baseline
  - **PATCH**: `patch-v1.4.121(P0.3.1)_visual-regression-baseline.json`
  - **BACKUP TAG**: `backup-v1.4.121(P0.3.1)_visual-regression-baseline`
  - **SUMMARY**: `summary-v1.4.121(P0.3.1)_visual-regression-baseline.md`
  - **VERSION**: v1.4.121(P0.3.1)
  - **VALIDATION**: Capture baseline images for both legacy and nextgen

- [ ] **TASK**: Conduct accessibility compliance audit
  - **PATCH**: `patch-v1.4.122(P0.3.2)_accessibility-audit.json`
  - **BACKUP TAG**: `backup-v1.4.122(P0.3.2)_accessibility-audit`
  - **SUMMARY**: `summary-v1.4.122(P0.3.2)_accessibility-audit.md`
  - **VERSION**: v1.4.122(P0.3.2)
  - **VALIDATION**: Complete accessibility compliance report

### **Step 0.4: Framework & Documentation Setup**
- [ ] **TASK**: Document role analysis framework
  - **PATCH**: `patch-v1.4.130(P0.4.0)_role-analysis-framework.json`
  - **BACKUP TAG**: `backup-v1.4.130(P0.4.0)_role-analysis-framework`
  - **SUMMARY**: `summary-v1.4.130(P0.4.0)_role-analysis-framework.md`
  - **VERSION**: v1.4.130(P0.4.0)
  - **VALIDATION**: Complete role analysis documentation

- [ ] **TASK**: Set up testing framework
  - **PATCH**: `patch-v1.4.131(P0.4.1)_testing-framework-setup.json`
  - **BACKUP TAG**: `backup-v1.4.131(P0.4.1)_testing-framework-setup`
  - **SUMMARY**: `summary-v1.4.131(P0.4.1)_testing-framework-setup.md`
  - **VERSION**: v1.4.131(P0.4.1)
  - **VALIDATION**: Verify testing framework for both environments

- [ ] **TASK**: Validate rollback strategy
  - **PATCH**: `patch-v1.4.132(P0.4.2)_rollback-strategy-validation.json`
  - **BACKUP TAG**: `backup-v1.4.132(P0.4.2)_rollback-strategy-validation`
  - **SUMMARY**: `summary-v1.4.132(P0.4.2)_rollback-strategy-validation.md`
  - **VERSION**: v1.4.132(P0.4.2)
  - **VALIDATION**: Test rollback procedures and backup strategies

### **Step 0.5: Debug & Sacred Component Setup**
- [ ] **TASK**: Configure debug system
  - **PATCH**: `patch-v1.4.140(P0.5.0)_debug-system-config.json`
  - **BACKUP TAG**: `backup-v1.4.140(P0.5.0)_debug-system-config`
  - **SUMMARY**: `summary-v1.4.140(P0.5.0)_debug-system-config.md`
  - **VERSION**: v1.4.140(P0.5.0)
  - **VALIDATION**: Verify debug controls and toggles working

- [ ] **TASK**: Identify sacred components (preserved via import)
  - **PATCH**: `patch-v1.4.141(P0.5.1)_sacred-components-identification.json`
  - **BACKUP TAG**: `backup-v1.4.141(P0.5.1)_sacred-components-identification`
  - **SUMMARY**: `summary-v1.4.141(P0.5.1)_sacred-components-identification.md`
  - **VERSION**: v1.4.141(P0.5.1)
  - **VALIDATION**: Complete sacred component list and import protection plan
  - **EXAMPLES**: BottomNav, OnboardingModal, Authentication flows

- [ ] **TASK**: Identify sacred layouts (preserved via z-index contract or safe-frame shell)
  - **PATCH**: `patch-v1.4.142(P0.5.2)_sacred-layouts-identification.json`
  - **BACKUP TAG**: `backup-v1.4.142(P0.5.2)_sacred-layouts-identification`
  - **SUMMARY**: `summary-v1.4.142(P0.5.2)_sacred-layouts-identification.md`
  - **VERSION**: v1.4.142(P0.5.2)
  - **VALIDATION**: Complete sacred layout list and z-index/safe-frame protection plan
  - **EXAMPLES**: FAB, SlideDeck, Modal overlays, Toast notifications

---

## 🎯 **PHASE 1: HYBRID SHELL SCAFFOLD**

### **Step 1.1: Shell Directory Structure**
- [ ] **TASK**: Create src/shell/ directory
  - **PATCH**: `patch-v1.4.200(P1.1.0)_shell-directory-create.json`
  - **BACKUP TAG**: `backup-v1.4.200(P1.1.0)_shell-directory-create`
  - **SUMMARY**: `summary-v1.4.200(P1.1.0)_shell-directory-create.md`
  - **VERSION**: v1.4.200(P1.1.0)
  - **VALIDATION**: Verify shell directory structure created

- [ ] **TASK**: Implement role-based wrappers
  - **PATCH**: `patch-v1.4.201(P1.1.1)_role-wrappers-implementation.json`
  - **BACKUP TAG**: `backup-v1.4.201(P1.1.1)_role-wrappers-implementation`
  - **SUMMARY**: `summary-v1.4.201(P1.1.1)_role-wrappers-implementation.md`
  - **VERSION**: v1.4.201(P1.1.1)
  - **VALIDATION**: Test role-based wrapper functionality

- [ ] **TASK**: Define layout contracts
  - **PATCH**: `patch-v1.4.202(P1.1.2)_layout-contracts-definition.json`
  - **BACKUP TAG**: `backup-v1.4.202(P1.1.2)_layout-contracts-definition`
  - **SUMMARY**: `summary-v1.4.202(P1.1.2)_layout-contracts-definition.md`
  - **VERSION**: v1.4.202(P1.1.2)
  - **VALIDATION**: Verify layout contract definitions

### **Step 1.2: Navigation & Sacred Views**
- [ ] **TASK**: Set up navigation definitions
  - **PATCH**: `patch-v1.4.210(P1.2.0)_navigation-definitions-setup.json`
  - **BACKUP TAG**: `backup-v1.4.210(P1.2.0)_navigation-definitions-setup`
  - **SUMMARY**: `summary-v1.4.210(P1.2.0)_navigation-definitions-setup.md`
  - **VERSION**: v1.4.210(P1.2.0)
  - **VALIDATION**: Test navigation definitions

- [ ] **TASK**: Create sacred view mounts
  - **PATCH**: `patch-v1.4.211(P1.2.1)_sacred-view-mounts.json`
  - **BACKUP TAG**: `backup-v1.4.211(P1.2.1)_sacred-view-mounts`
  - **SUMMARY**: `summary-v1.4.211(P1.2.1)_sacred-view-mounts.md`
  - **VERSION**: v1.4.211(P1.2.1)
  - **VALIDATION**: Verify sacred view mounts working

- [ ] **TASK**: Configure patch-runner automation
  - **PATCH**: `patch-v1.4.212(P1.2.2)_patch-runner-automation.json`
  - **BACKUP TAG**: `backup-v1.4.212(P1.2.2)_patch-runner-automation`
  - **SUMMARY**: `summary-v1.4.212(P1.2.2)_patch-runner-automation.md`
  - **VERSION**: v1.4.212(P1.2.2)
  - **VALIDATION**: Test patch-runner automation

### **Step 1.3: Pilot Component Migration**
- [ ] **TASK**: Migrate Button.tsx → interactiveRole="button-action"
  - **PATCH**: `patch-v1.4.220(P1.3.0)_button-migration.json`
  - **BACKUP TAG**: `backup-v1.4.220(P1.3.0)_button-migration`
  - **SUMMARY**: `summary-v1.4.220(P1.3.0)_button-migration.md`
  - **VERSION**: v1.4.220(P1.3.0)
  - **VALIDATION**: Test button functionality and role assignment

- [ ] **TASK**: Migrate Text.tsx → contentRole="body"
  - **PATCH**: `patch-v1.4.221(P1.3.1)_text-migration.json`
  - **BACKUP TAG**: `backup-v1.4.221(P1.3.1)_text-migration`
  - **SUMMARY**: `summary-v1.4.221(P1.3.1)_text-migration.md`
  - **VERSION**: v1.4.221(P1.3.1)
  - **VALIDATION**: Test text component and content role

- [ ] **TASK**: Migrate TagChip.tsx → interactiveRole="chip"
  - **PATCH**: `patch-v1.4.222(P1.3.2)_tagchip-migration.json`
  - **BACKUP TAG**: `backup-v1.4.222(P1.3.2)_tagchip-migration`
  - **SUMMARY**: `summary-v1.4.222(P1.3.2)_tagchip-migration.md`
  - **VERSION**: v1.4.222(P1.3.2)
  - **VALIDATION**: Test TagChip functionality and interactive role

- [ ] **TASK**: Migrate ModernHeader.tsx → layoutRole="header"
  - **PATCH**: `patch-v1.4.223(P1.3.3)_header-migration.json`
  - **BACKUP TAG**: `backup-v1.4.223(P1.3.3)_header-migration`
  - **SUMMARY**: `summary-v1.4.223(P1.3.3)_header-migration.md`
  - **VERSION**: v1.4.223(P1.3.3)
  - **VALIDATION**: Test header layout and role assignment

- [ ] **TASK**: Migrate BottomNav.tsx → layoutRole="navigation"
  - **PATCH**: `patch-v1.4.224(P1.3.4)_bottomnav-migration.json`
  - **BACKUP TAG**: `backup-v1.4.224(P1.3.4)_bottomnav-migration`
  - **SUMMARY**: `summary-v1.4.224(P1.3.4)_bottomnav-migration.md`
  - **VERSION**: v1.4.224(P1.3.4)
  - **VALIDATION**: Test BottomNav functionality and navigation role

---

## 🎯 **PHASE 2: SYSTEMATIC MIGRATION**

### **Step 2.1: High Traffic Screens (Dual-Mount)**
- [ ] **TASK**: Migrate DashboardScreen.tsx → src-nextgen/screens/DashboardScreen.tsx
  - **PATCH**: `patch-v1.4.300(P2.1.0)_dashboard-dual-mount.json`
  - **BACKUP TAG**: `backup-v1.4.300(P2.1.0)_dashboard-dual-mount`
  - **SUMMARY**: `summary-v1.4.300(P2.1.0)_dashboard-dual-mount.md`
  - **VERSION**: v1.4.300(P2.1.0)
  - **VALIDATION**: Test dashboard in both legacy and nextgen environments

- [ ] **TASK**: Migrate HomeScreen.tsx → src-nextgen/screens/HomeScreen.tsx
  - **PATCH**: `patch-v1.4.301(P2.1.1)_home-dual-mount.json`
  - **BACKUP TAG**: `backup-v1.4.301(P2.1.1)_home-dual-mount`
  - **SUMMARY**: `summary-v1.4.301(P2.1.1)_home-dual-mount.md`
  - **VERSION**: v1.4.301(P2.1.1)
  - **VALIDATION**: Test home screen in both environments

- [ ] **TASK**: Migrate ThoughtmarkDetailScreen.tsx → src-nextgen/screens/ThoughtmarkDetailScreen.tsx
  - **PATCH**: `patch-v1.4.302(P2.1.2)_thoughtmark-detail-dual-mount.json`
  - **BACKUP TAG**: `backup-v1.4.302(P2.1.2)_thoughtmark-detail-dual-mount`
  - **SUMMARY**: `summary-v1.4.302(P2.1.2)_thoughtmark-detail-dual-mount.md`
  - **VERSION**: v1.4.302(P2.1.2)
  - **VALIDATION**: Test thoughtmark detail screen in both environments

- [ ] **TASK**: Migrate SearchScreen.tsx → src-nextgen/screens/SearchScreen.tsx
  - **PATCH**: `patch-v1.4.303(P2.1.3)_search-dual-mount.json`
  - **BACKUP TAG**: `backup-v1.4.303(P2.1.3)_search-dual-mount`
  - **SUMMARY**: `summary-v1.4.303(P2.1.3)_search-dual-mount.md`
  - **VERSION**: v1.4.303(P2.1.3)
  - **VALIDATION**: Test search screen in both environments

- [ ] **TASK**: Migrate AllBinsScreen.tsx → src-nextgen/screens/AllBinsScreen.tsx
  - **PATCH**: `patch-v1.4.304(P2.1.4)_allbins-dual-mount.json`
  - **BACKUP TAG**: `backup-v1.4.304(P2.1.4)_allbins-dual-mount`
  - **SUMMARY**: `summary-v1.4.304(P2.1.4)_allbins-dual-mount.md`
  - **VERSION**: v1.4.304(P2.1.4)
  - **VALIDATION**: Test all bins screen in both environments

### **Step 2.2: Authentication & Input (Shell Migration)**
- [ ] **TASK**: Migrate SignIn.tsx → src/shell/auth/SignIn.tsx
  - **PATCH**: `patch-v1.4.310(P2.2.0)_signin-shell-migration.json`
  - **BACKUP TAG**: `backup-v1.4.310(P2.2.0)_signin-shell-migration`
  - **SUMMARY**: `summary-v1.4.310(P2.2.0)_signin-shell-migration.md`
  - **VERSION**: v1.4.310(P2.2.0)
  - **VALIDATION**: Test signin component in shell structure

- [ ] **TASK**: Migrate SignUp.tsx → src/shell/auth/SignUp.tsx
  - **PATCH**: `patch-v1.4.311(P2.2.1)_signup-shell-migration.json`
  - **BACKUP TAG**: `backup-v1.4.311(P2.2.1)_signup-shell-migration`
  - **SUMMARY**: `summary-v1.4.311(P2.2.1)_signup-shell-migration.md`
  - **VERSION**: v1.4.311(P2.2.1)
  - **VALIDATION**: Test signup component in shell structure

- [ ] **TASK**: Migrate PINEntryScreen.tsx → src/shell/auth/PINEntryScreen.tsx
  - **PATCH**: `patch-v1.4.312(P2.2.2)_pinentry-shell-migration.json`
  - **BACKUP TAG**: `backup-v1.4.312(P2.2.2)_pinentry-shell-migration`
  - **SUMMARY**: `summary-v1.4.312(P2.2.2)_pinentry-shell-migration.md`
  - **VERSION**: v1.4.312(P2.2.2)
  - **VALIDATION**: Test PIN entry component in shell structure

- [ ] **TASK**: Migrate CreateBinScreen.tsx → src/shell/bins/CreateBinScreen.tsx
  - **PATCH**: `patch-v1.4.313(P2.2.3)_createbin-shell-migration.json`
  - **BACKUP TAG**: `backup-v1.4.313(P2.2.3)_createbin-shell-migration`
  - **SUMMARY**: `summary-v1.4.313(P2.2.3)_createbin-shell-migration.md`
  - **VERSION**: v1.4.313(P2.2.3)
  - **VALIDATION**: Test create bin component in shell structure

- [ ] **TASK**: Migrate AIToolsScreen.tsx → src/shell/ai/AIToolsScreen.tsx
  - **PATCH**: `patch-v1.4.314(P2.2.4)_aitools-shell-migration.json`
  - **BACKUP TAG**: `backup-v1.4.314(P2.2.4)_aitools-shell-migration`
  - **SUMMARY**: `summary-v1.4.314(P2.2.4)_aitools-shell-migration.md`
  - **VERSION**: v1.4.314(P2.2.4)
  - **VALIDATION**: Test AI tools component in shell structure

### **Step 2.3: Settings & Misc (Shell Migration)**
- [ ] **TASK**: Migrate ProfileScreen.tsx → src/shell/settings/ProfileScreen.tsx
  - **PATCH**: `patch-v1.4.320(P2.3.0)_profile-shell-migration.json`
  - **BACKUP TAG**: `backup-v1.4.320(P2.3.0)_profile-shell-migration`
  - **SUMMARY**: `summary-v1.4.320(P2.3.0)_profile-shell-migration.md`
  - **VERSION**: v1.4.320(P2.3.0)
  - **VALIDATION**: Test profile component in shell structure

- [ ] **TASK**: Migrate ContentScreen.tsx → src/shell/content/ContentScreen.tsx
  - **PATCH**: `patch-v1.4.321(P2.3.1)_content-shell-migration.json`
  - **BACKUP TAG**: `backup-v1.4.321(P2.3.1)_content-shell-migration`
  - **SUMMARY**: `summary-v1.4.321(P2.3.1)_content-shell-migration.md`
  - **VERSION**: v1.4.321(P2.3.1)
  - **VALIDATION**: Test content component in shell structure

- [ ] **TASK**: Migrate ExportScreen.tsx → src/shell/export/ExportScreen.tsx
  - **PATCH**: `patch-v1.4.322(P2.3.2)_export-shell-migration.json`
  - **BACKUP TAG**: `backup-v1.4.322(P2.3.2)_export-shell-migration`
  - **SUMMARY**: `summary-v1.4.322(P2.3.2)_export-shell-migration.md`
  - **VERSION**: v1.4.322(P2.3.2)
  - **VALIDATION**: Test export component in shell structure

- [ ] **TASK**: Migrate AllSettings → src/shell/settings/AllSettings.tsx
  - **PATCH**: `patch-v1.4.323(P2.3.3)_allsettings-shell-migration.json`
  - **BACKUP TAG**: `backup-v1.4.323(P2.3.3)_allsettings-shell-migration`
  - **SUMMARY**: `summary-v1.4.323(P2.3.3)_allsettings-shell-migration.md`
  - **VERSION**: v1.4.323(P2.3.3)
  - **VALIDATION**: Test all settings component in shell structure

---

## 🎯 **PHASE 3: OPTIMIZATION & CONSOLIDATION**

### **Step 3.1: Performance Optimization**
- [ ] **TASK**: Optimize performance bottlenecks
  - **PATCH**: `patch-v1.4.400(P3.1.0)_performance-optimization.json`
  - **BACKUP TAG**: `backup-v1.4.400(P3.1.0)_performance-optimization`
  - **SUMMARY**: `summary-v1.4.400(P3.1.0)_performance-optimization.md`
  - **VERSION**: v1.4.400(P3.1.0)
  - **VALIDATION**: Verify performance improvements

- [ ] **TASK**: Refine role assignments based on usage
  - **PATCH**: `patch-v1.4.401(P3.1.1)_role-assignment-refinement.json`
  - **BACKUP TAG**: `backup-v1.4.401(P3.1.1)_role-assignment-refinement`
  - **SUMMARY**: `summary-v1.4.401(P3.1.1)_role-assignment-refinement.md`
  - **VERSION**: v1.4.401(P3.1.1)
  - **VALIDATION**: Test refined role assignments

- [ ] **TASK**: Memory usage optimization
  - **PATCH**: `patch-v1.4.402(P3.1.2)_memory-optimization.json`
  - **BACKUP TAG**: `backup-v1.4.402(P3.1.2)_memory-optimization`
  - **SUMMARY**: `summary-v1.4.402(P3.1.2)_memory-optimization.md`
  - **VERSION**: v1.4.402(P3.1.2)
  - **VALIDATION**: Verify memory usage improvements

### **Step 3.2: Validation & Testing**
- [ ] **TASK**: Validate accessibility compliance
  - **PATCH**: `patch-v1.4.410(P3.2.0)_accessibility-validation.json`
  - **BACKUP TAG**: `backup-v1.4.410(P3.2.0)_accessibility-validation`
  - **SUMMARY**: `summary-v1.4.410(P3.2.0)_accessibility-validation.md`
  - **VERSION**: v1.4.410(P3.2.0)
  - **VALIDATION**: Complete accessibility compliance validation

- [ ] **TASK**: Test visual regression thoroughly
  - **PATCH**: `patch-v1.4.411(P3.2.1)_visual-regression-testing.json`
  - **BACKUP TAG**: `backup-v1.4.411(P3.2.1)_visual-regression-testing`
  - **SUMMARY**: `summary-v1.4.411(P3.2.1)_visual-regression-testing.md`
  - **VERSION**: v1.4.411(P3.2.1)
  - **VALIDATION**: Verify no visual regressions in both environments

- [ ] **TASK**: Performance regression testing
  - **PATCH**: `patch-v1.4.412(P3.2.2)_performance-regression-testing.json`
  - **BACKUP TAG**: `backup-v1.4.412(P3.2.2)_performance-regression-testing`
  - **SUMMARY**: `summary-v1.4.412(P3.2.2)_performance-regression-testing.md`
  - **VERSION**: v1.4.412(P3.2.2)
  - **VALIDATION**: Verify no performance regressions

### **Step 3.3: Documentation & Finalization**
- [ ] **TASK**: Document final implementation
  - **PATCH**: `patch-v1.4.420(P3.3.0)_final-implementation-docs.json`
  - **BACKUP TAG**: `backup-v1.4.420(P3.3.0)_final-implementation-docs`
  - **SUMMARY**: `summary-v1.4.420(P3.3.0)_final-implementation-docs.md`
  - **VERSION**: v1.4.420(P3.3.0)
  - **VALIDATION**: Complete implementation documentation

- [ ] **TASK**: Gradual legacy cleanup
  - **PATCH**: `patch-v1.4.421(P3.3.1)_legacy-cleanup.json`
  - **BACKUP TAG**: `backup-v1.4.421(P3.3.1)_legacy-cleanup`
  - **SUMMARY**: `summary-v1.4.421(P3.3.1)_legacy-cleanup.md`
  - **VERSION**: v1.4.421(P3.3.1)
  - **VALIDATION**: Verify legacy cleanup without breaking functionality

- [ ] **TASK**: Final dual-mount validation
  - **PATCH**: `patch-v1.4.422(P3.3.2)_final-dual-mount-validation.json`
  - **BACKUP TAG**: `backup-v1.4.422(P3.3.2)_final-dual-mount-validation`
  - **SUMMARY**: `summary-v1.4.422(P3.3.2)_final-dual-mount-validation.md`
  - **VERSION**: v1.4.422(P3.3.2)
  - **VALIDATION**: Complete dual-mount system validation

### **Step 3.4: Consolidation**
- [ ] **TASK**: Remove unused legacy components
  - **PATCH**: `patch-v1.4.430(P3.4.0)_unused-legacy-removal.json`
  - **BACKUP TAG**: `backup-v1.4.430(P3.4.0)_unused-legacy-removal`
  - **SUMMARY**: `summary-v1.4.430(P3.4.0)_unused-legacy-removal.md`
  - **VERSION**: v1.4.430(P3.4.0)
  - **VALIDATION**: Verify no functionality broken by removal

- [ ] **TASK**: Optimize bundle size
  - **PATCH**: `patch-v1.4.431(P3.4.1)_bundle-size-optimization.json`
  - **BACKUP TAG**: `backup-v1.4.431(P3.4.1)_bundle-size-optimization`
  - **SUMMARY**: `summary-v1.4.431(P3.4.1)_bundle-size-optimization.md`
  - **VERSION**: v1.4.431(P3.4.1)
  - **VALIDATION**: Verify bundle size optimization

- [ ] **TASK**: Finalize migration documentation
  - **PATCH**: `patch-v1.4.432(P3.4.2)_migration-docs-finalization.json`
  - **BACKUP TAG**: `backup-v1.4.432(P3.4.2)_migration-docs-finalization`
  - **SUMMARY**: `summary-v1.4.432(P3.4.2)_migration-docs-finalization.md`
  - **VERSION**: v1.4.432(P3.4.2)
  - **VALIDATION**: Complete migration documentation

- [ ] **TASK**: Validate complete dual-mount system
  - **PATCH**: `patch-v1.4.433(P3.4.3)_complete-dual-mount-validation.json`
  - **BACKUP TAG**: `backup-v1.4.433(P3.4.3)_complete-dual-mount-validation`
  - **SUMMARY**: `summary-v1.4.433(P3.4.3)_complete-dual-mount-validation.md`
  - **VERSION**: v1.4.433(P3.4.3)
  - **VALIDATION**: Final validation of complete dual-mount system

---

## 🔐 **MANDATORY VALIDATION GATES**

### **After Each Task Completion:**
- [ ] **Parse and type checking** (tsc --noEmit)
- [ ] **Visual regression testing** (both legacy and nextgen)
- [ ] **Performance impact measurement**
- [ ] **Accessibility compliance validation**
- [ ] **ESLint and linting validation**
- [ ] **Memory usage monitoring**
- [ ] **Runtime error detection**
- [ ] **Dual-mount toggle validation**

### **Failure Handling:**
- [ ] **Stop all automation** on validation failure
- [ ] **Revert to last known good state**
- [ ] **Document the failure point**
- [ ] **Create targeted fix** before continuing

---

## 📊 **SUCCESS METRICS**

### **Performance Targets:**
- [ ] **No more than 5% render time increase**
- [ ] **No more than 10% memory usage increase**
- [ ] **No performance regressions in critical paths**
- [ ] **Bundle size increase < 15%**
- [ ] **Startup time increase < 10%**
- [ ] **Dual-mount overhead < 3%**

### **Quality Targets:**
- [ ] **100% accessibility compliance**
- [ ] **Zero visual regressions** (both legacy and nextgen)
- [ ] **All ESLint rules passing**
- [ ] **No runtime errors**
- [ ] **100% test coverage for new components**
- [ ] **Zero accessibility violations**
- [ ] **Dual-mount toggle working perfectly**

### **Process Targets:**
- [ ] **Each phase completed within estimated time**
- [ ] **Rollback capability tested and working**
- [ ] **Documentation updated for each phase**
- [ ] **Team knowledge transfer completed**
- [ ] **Zero rollback failures**
- [ ] **100% validation gate compliance**
- [ ] **Dual-mount CI pipeline working**

---

## 🚀 **CONCLUSION**

The **B + D + E strategy** combines the best approaches:
- **B**: Clean rebuild from src-reference/ (most defensible)
- **D**: Dual-mount architecture (enables safe testing)
- **E**: Hybrid renderer shell (controlled transition)

This roadmap provides **comprehensive task tracking** with:
- ✅ **New versioning format** v1.4.1{phase}{step}{attempt}(P{phase}.{step}.{attempt})
- ✅ **Structured patch naming** with traceable IDs
- ✅ **Backup tags** for rollback points
- ✅ **Summary documentation** for each step
- ✅ **Checkbox tracking** for completion monitoring
- ✅ **Validation gates** for quality assurance

**Success depends on following the lessons learned from the 4x rollback failures while leveraging the B + D + E strategy.**

---

**Status**: ✅ Roadmap Complete  
**Strategy**: B + D + E (Clean Rebuild + Dual-Mount + Hybrid Shell)  
**Version Format**: v1.4.1{phase}{step}{attempt}(P{phase}.{step}.{attempt})  
**Next Steps**: Begin Phase 0 implementation with comprehensive tracking

**Maintained by GPT autopilot. Do not modify manually unless instructed.** 