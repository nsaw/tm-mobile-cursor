# Phase 4 Hardening Requirements

**Generated**: 2025-01-29T23:58:00.000Z  
**Status**: ⚠️ **HARDENING REQUIRED**  
**Priority**: Critical  
**Risk Level**: High (90%)

---

## 🚨 **CRITICAL BLOCKERS**

### **TypeScript Compilation Errors**
- **Total Errors**: 217 errors in 52 files
- **Error Categories**:
  - Import/Export Mismatches: 15+ errors
  - Type Definition Issues: 20+ errors
  - Component Props Issues: 10+ errors
  - Navigation Type Errors: 5+ errors
  - Utility Function Errors: 8+ errors

### **Implementation Gaps**
- **AutoRoleView Component**: Missing `layoutRole` prop support
- **Theme System**: Incomplete theme provider implementation
- **Navigation Types**: Type mismatches in auth screens
- **Performance Monitor**: Global reference and Promise type errors
- **Validation System**: Method signature mismatches

### **Import/Export Issues**
- **Theme Imports**: `theme/theme` → `theme/ThemeProvider`
- **Component Imports**: `components/ui/` → `components/`
- **Auth Hook Imports**: `features/auth/hooks/useAuth` → `hooks/useAuth`
- **Duplicate Exports**: Multiple export declarations in shell/mounts

---

## 🛡️ **REQUIRED HARDENING STEPS**

### **Step 1: AutoRoleView Prop Fixes**
**Priority**: Critical  
**Files Affected**: 10+ files  
**Fix Pattern**: Replace `layoutRole` with `interactiveRole`

```bash
# Find all files using layoutRole
find src-nextgen -name "*.tsx" -exec grep -l "layoutRole" {} \;

# Fix pattern
sed -i '' 's/layoutRole="\([^"]*\)"/interactiveRole="\1"/g' file.tsx
```

### **Step 2: Import/Export Resolution**
**Priority**: Critical  
**Files Affected**: 15+ files  
**Fix Patterns**:

```bash
# Theme imports
sed -i '' 's|theme/theme|theme/ThemeProvider|g' file.tsx

# Component imports
sed -i '' 's|components/ui/Button|components/Button|g' file.tsx
sed -i '' 's|components/ui/Card|components/Card|g' file.tsx

# Auth hook imports
sed -i '' 's|features/auth/hooks/useAuth|hooks/useAuth|g' file.tsx
```

### **Step 3: Navigation Type Fixes**
**Priority**: High  
**Files Affected**: 5+ files  
**Fix Pattern**: Add proper navigation imports

```bash
# Add navigation import if missing
if ! grep -q "useNavigation" file.tsx; then
    sed -i '' '1i\
import { useNavigation } from "@react-navigation/native";
' file.tsx
fi
```

### **Step 4: Performance Monitor Fixes**
**Priority**: High  
**Files Affected**: 3+ files  
**Fix Patterns**:

```bash
# Global references
sed -i '' 's/global\./globalThis./g' file.ts

# setTimeout Promise issues
sed -i '' 's/setTimeout(resolve/setTimeout(() => resolve(undefined)/g' file.ts
```

### **Step 5: Validation System Fixes**
**Priority**: Medium  
**Files Affected**: 5+ files  
**Fix Patterns**:

```bash
# Accessibility timeout
sed -i '' 's/getRecommendedTimeoutMillis()/getRecommendedTimeoutMillis(1000)/g' file.ts

# TypeValidator methods
sed -i '' 's/validateType(/validateApiTypes(/g' file.test.ts
sed -i '' 's/validateMultipleTypes(/validateAllTypes(/g' file.test.ts
```

### **Step 6: Duplicate Export Resolution**
**Priority**: Medium  
**Files Affected**: 1 file  
**Fix Pattern**: Remove duplicate export lines

```bash
# Remove duplicate exports in shell/mounts/index.ts
sed -i '' '/export { default as SacredViewMount }/d' file.ts
sed -i '' '/export { default as sacredMountRegistry }/d' file.ts
sed -i '' '/export { default as useSacredMount }/d' file.ts
```

### **Step 7: Contract Type Fixes**
**Priority**: Medium  
**Files Affected**: 5+ files  
**Fix Patterns**:

```bash
# Protected keyword
sed -i '' 's/protected:/isProtected:/g' file.ts
sed -i '' 's/\.protected/\.isProtected/g' file.ts

# className prop removal
sed -i '' 's/ className={[^}]*}//g' file.tsx
```

### **Step 8: Accessibility Utility Fixes**
**Priority**: Low  
**Files Affected**: 2+ files  
**Fix Pattern**: Fix accessibility role assignments

```bash
# Fix accessibility role
sed -i '' 's/accessibilityRole={role}/accessibilityRole="none"/g' file.tsx
```

### **Step 9: Src-Reference Export Fixes**
**Priority**: Low  
**Files Affected**: 3+ files  
**Fix Pattern**: Convert named exports to default exports

```bash
# Convert named exports to default exports
sed -i '' 's/export { ContactScreen }/export default ContactScreen/g' file.ts
sed -i '' 's/export { HowToScreen }/export default HowToScreen/g' file.ts
sed -i '' 's/export { ThemeScreen }/export default ThemeScreen/g' file.ts
```

---

## 🎯 **VALIDATION GATES**

### **Pre-Hardening Requirements**
- [ ] **Backup Created**: Pre-hardening backup exists
- [ ] **Script Executable**: Hardening script is executable
- [ ] **Error Count Known**: 217 TypeScript errors documented

### **Post-Hardening Validation**
- [ ] **TypeScript Compilation**: 0 errors, 0 warnings
- [ ] **Import/Export Resolution**: All modules resolve correctly
- [ ] **Component Props**: All components have correct prop types
- [ ] **Navigation Types**: All navigation types properly defined
- [ ] **Runtime Boot**: App boots successfully without errors

### **Success Criteria**
- [ ] **All P4.00.01-03 patches executed successfully**
- [ ] **TypeScript compilation passes**
- [ ] **ESLint validation passes**
- [ ] **Runtime validation passes**
- [ ] **App refresh validation passes**

---

## 🚀 **EXECUTION STRATEGY**

### **Automated Hardening Script**
**File**: `scripts/phase4-preflight-hardening.sh`  
**Purpose**: Systematic bulk error fixing  
**Features**:
- Creates pre-hardening backup
- Applies all fix patterns systematically
- Validates TypeScript compilation
- Runs additional validation checks
- Provides detailed progress logging

### **Manual Hardening Process**
If automated script fails:
1. **Identify Error Patterns**: Group similar errors
2. **Apply Bulk Fixes**: Use sed/awk for pattern-based fixes
3. **Validate Incrementally**: Check compilation after each fix category
4. **Document Changes**: Track all modifications

### **Rollback Strategy**
- **Backup Location**: `/Users/sawyer/gitSync/_backups/tm-safety_backups/`
- **Backup Pattern**: `PHASE4_PREHARDENING_YYYYMMDD_HHMMSS.tar.gz`
- **Restore Command**: `tar -xzf backup_file.tar.gz`
- **Git Safety**: `P3_COMPLETE_ROLLBACKSAFE` tag available

---

## 📊 **PROGRESS TRACKING**

### **Current Status**
- **Phase 3 State**: ✅ Frozen and rollback-safe
- **Hardening Script**: ✅ Created and executable
- **Error Analysis**: ✅ Complete (217 errors documented)
- **Fix Patterns**: ✅ Identified and scripted
- **Execution**: ⚠️ **NOT STARTED**

### **Next Steps**
1. **Execute Hardening Script**: `bash scripts/phase4-preflight-hardening.sh`
2. **Validate Results**: Check TypeScript compilation
3. **Run Additional Tests**: ESLint, runtime validation
4. **Document Success**: Update progress tracking
5. **Proceed to Phase 4.01**: Begin authentication foundation

---

## 🛡️ **RISK MITIGATION**

### **High-Risk Areas**
- **AutoRoleView Props**: Component interface changes
- **Navigation Types**: Routing system modifications
- **Performance Monitor**: Global reference changes
- **Import/Export Fixes**: Module resolution changes

### **Mitigation Strategies**
- **Incremental Validation**: Test after each fix category
- **Backup Creation**: Pre-hardening backup before changes
- **Pattern-Based Fixes**: Systematic approach to bulk errors
- **Rollback Readiness**: Quick restore capability

---

## 🎯 **GATEKEEPER RULES**

### **No Phase 4 Execution Until**
- [ ] **All TypeScript errors resolved** (0 errors, 0 warnings)
- [ ] **All import/export issues fixed**
- [ ] **All component prop types correct**
- [ ] **All navigation types properly defined**
- [ ] **Runtime boot validation passes**
- [ ] **Dual-mount system validation passes**

### **Validation Commands**
```bash
# TypeScript compilation
yarn tsc --noEmit --skipLibCheck

# ESLint validation
yarn lint:ci

# Runtime validation
yarn validate:dual-mount:device

# Hardening script
bash scripts/phase4-preflight-hardening.sh
```

---

**Status**: ⚠️ **HARDENING REQUIRED**  
**Priority**: Critical  
**Risk Level**: High (90%)  
**Estimated Duration**: 4-6 hours  
**Next Action**: Execute hardening script  
**Gatekeeper**: No Phase 4 patches until all validation gates pass 