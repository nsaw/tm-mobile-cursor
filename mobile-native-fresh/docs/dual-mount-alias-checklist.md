# Dual-Mount & @legacy Alias Checklist

## 1. **Local Sanity Check**
   ```bash
   npm run alias:sanity
   npm run validate:dual-mount
   ```
   **Expected**: Both commands should pass with ✅

## 2. **Metro Watch Validation**
Launch in each mode and confirm **no** "Unable to resolve" lines:

### Legacy Mode
   ```bash
   EXPO_PUBLIC_DUAL_MOUNT=false EXPO_PUBLIC_USE_LEGACY=true npx expo start --clear
   ```
   **Check**: Metro console should show no "Unable to resolve @legacy/..." errors

### NextGen Mode
   ```bash
   EXPO_PUBLIC_DUAL_MOUNT=false EXPO_PUBLIC_USE_LEGACY=false npx expo start --clear
   ```
   **Check**: Metro console should show no "Unable to resolve @legacy/..." errors

### Dual Mode
   ```bash
   EXPO_PUBLIC_DUAL_MOUNT=true npx expo start --clear
   ```
   **Check**: Metro console should show no "Unable to resolve @legacy/..." errors

## 3. **Device Smoke Test**
- **Sign-In (Legacy)**: Navigate to legacy Sign-In screen - should render without errors
- **Dashboard (NextGen)**: Navigate to next-gen Dashboard - should render without errors
- **Dual Mode**: Both screens should be accessible and functional

## 4. **CI Validation**
GitHub Action `ci:legacy-alias-check` must be green:
   ```bash
   npm run ci:legacy-alias-check
   ```
   **Expected**: Both alias sanity and dual-mount validation should pass

## 5. **Configuration Files Check**
Verify these files contain proper @legacy alias configuration:
- ✅ `metro.config.cjs` - Contains `@legacy` alias mapping
- ✅ `babel.config.cjs` - Contains `module-resolver` plugin with `@legacy` alias
- ✅ `tsconfig.json` - Contains `@legacy` path mapping

## 6. **File Structure Validation**
- ✅ `src-reference/features/auth/screens/SignIn.tsx` exists
- ✅ `src-reference/features/auth/screens/index.ts` (barrel export) exists
- ✅ All @legacy imports resolve correctly

## 7. **Device Runtime Log Validation**
**Required**: Must run device runtime error validation after dual-mount testing:
   ```bash
   npm run validate:dual-mount:device
   ```
   **Check**: No critical runtime errors in device logs:
   - ❌ "Component auth has not been registered yet"
   - ❌ "Failed to load legacy app"
   - ❌ "Cannot read property 'default' of undefined"
   - ❌ "Falling back to mock app"
   - ❌ "Text strings must be rendered within a <Text> component"
   - ❌ "Invariant Violation"

## 8. **Error Detection**
**Red Flags** - If any of these appear, the alias hardening has failed:
- ❌ "Unable to resolve @legacy/..." in Metro console
- ❌ "Module not found" errors for @legacy imports
- ❌ TypeScript errors about @legacy module resolution
- ❌ Runtime crashes when accessing legacy screens
- ❌ Device runtime errors (see Section 7)

## 9. **Success Indicators**
**Green Flags** - These indicate successful alias hardening:
- ✅ All validation scripts pass
- ✅ Metro bundling completes without errors
- ✅ Legacy screens render correctly
- ✅ No console errors related to @legacy resolution
- ✅ CI pipeline passes with `ci:legacy-alias-check`
- ✅ Device runtime validation passes with no critical errors

---

**Last Updated**: 2025-07-31  
**Patch**: v1.4.610(P4.03.19)_post-alias-hardening-finalisation  
**Status**: ✅ PASS 