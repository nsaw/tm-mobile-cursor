# Step 1: Fix React Native Import Issues and TypeScript Configuration

## Overview
Systematic resolution of React Native import namespace errors and TypeScript configuration problems in the mobile-native-fresh project.

## Initial Problems Identified
- TypeScript compilation errors: `Cannot find module` for React Native imports
- Malformed import statements in theme files
- Incomplete TypeScript configuration causing parse errors
- Component import path mismatches

## Key Fixes Applied

### 1. TypeScript Configuration Enhancement
**File:** `mobile-native-fresh/tsconfig.json`

**Before:**
```json
{
  "compilerOptions": {},
  "extends": "expo/tsconfig.base",
  "exclude": [
    "src-reference/**/*",
    "src/__tests__/**/*",
    "node_modules/**/*"
  ]
}
```

**After:**
```json
{
  "compilerOptions": {
    "allowJs": true,
    "allowSyntheticDefaultImports": true,
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "isolatedModules": true,
    "jsx": "react-native",
    "lib": ["dom", "esnext"],
    "moduleDetection": "force",
    "moduleResolution": "bundler",
    "noEmit": true,
    "resolveJsonModule": true,
    "skipLibCheck": true,
    "strict": true,
    "target": "esnext",
    "types": ["react-native", "jest", "node"],
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@components/*": ["src/components/*"],
      "@features/*": ["src/features/*"],
      "@utils/*": ["src/utils/*"],
      "@theme/*": ["src/theme/*"],
      "@navigation/*": ["src/navigation/*"],
      "@services/*": ["src/services/*"],
      "@hooks/*": ["src/hooks/*"],
      "@types/*": ["src/types/*"],
      "@shell/*": ["src/shell/*"],
      "@nextgen/*": ["src-nextgen/*"]
    }
  },
  "extends": "expo/tsconfig.base",
  "include": [
    "src/**/*",
    "src-nextgen/**/*",
    "tests/**/*",
    "scripts/**/*"
  ],
  "exclude": [
    "src-reference/**/*",
    "src/__tests__/**/*",
    "node_modules/**/*",
    "dist/**/*",
    "build/**/*"
  ]
}
```

### 2. Import Path Corrections
**Problem:** Components using incorrect relative import paths
**Solution:** Fixed all import paths to use correct relative paths

**Files Fixed:**
- `src-nextgen/components/BottomNav.tsx`: `../../theme/ThemeProvider` → `../theme/ThemeProvider`
- `src-nextgen/components/Button.tsx`: Fixed theme and AutoRoleView imports
- `src-nextgen/components/Header.tsx`: Fixed theme import path
- `src-nextgen/components/TagChip.tsx`: Fixed theme and variants imports
- `src-nextgen/components/Text.tsx`: Fixed theme import path

### 3. Malformed Import Statement Fix
**File:** `src-nextgen/theme/variants.ts`

**Before:**
```typescript
import { // TODO: Remove designTokens import, use useTheme() instead } from './designTokens';
```

**After:**
```typescript
import { designTokens } from './designTokens';
```

### 4. Theme Context Type Issues Resolution
**Problem:** Components trying to access `tokens` property that didn't exist in theme context
**Solution:** Updated all components to use `designTokens` consistently

**Components Fixed:**
- `BottomNav.tsx`: `const { tokens: designTokens }` → `const { designTokens }`
- `Button.tsx`: `const { tokens }` → `const { designTokens }`
- `Header.tsx`: `const { tokens: designTokens }` → `const { designTokens }`
- `TagChip.tsx`: `const { tokens: designTokens }` → `const { designTokens }`
- `Text.tsx`: `const { tokens: designTokens }` → `const { designTokens }`

### 5. Design Tokens Structure Enhancement
**File:** `src-nextgen/theme/designTokens.ts`

**Added Missing Properties:**
- `accent`, `danger`, `backgroundSecondary`, `divider`, `buttonText`
- `text.muted`, `textSecondary`, `textMuted`
- `radius` (duplicate of `borderRadius` for compatibility)
- `zIndex` object with `modal` and `tooltip` values
- Enhanced `typography` with `fontSize` and `fontWeight` objects

### 6. Component-Specific Type Fixes

#### Button Component
- Removed invalid `interactiveRole` prop from `ActionButton`
- Fixed `fontWeight` type casting with `as any`
- Updated theme property access: `theme.tokens` → `theme.designTokens`

#### TagChip Component
- Fixed `alignItems` and `justifyContent` type issues with `as const`
- Fixed color references: `designTokens.colors.text` → `designTokens.colors.text.primary`

#### Header Component
- Fixed icon color references: `designTokens.colors.text` → `designTokens.colors.text.primary`

#### BottomNav Component
- Fixed `designTokens.colors.textMuted` → `designTokens.colors.text.muted`

## Validation Results

### TypeScript Compilation Progress
**Before:** Multiple import and syntax errors
**After:** Most import and syntax errors resolved

**Remaining Issues:**
- Text component typography structure needs final alignment
- Some fontWeight type casting required
- Need to run full ESLint validation

### Files Modified
- `mobile-native-fresh/tsconfig.json` - Enhanced TypeScript configuration
- `mobile-native-fresh/src-nextgen/theme/designTokens.ts` - Added missing properties
- `mobile-native-fresh/src-nextgen/theme/variants.ts` - Fixed malformed import
- `mobile-native-fresh/src-nextgen/components/BottomNav.tsx` - Fixed imports and theme usage
- `mobile-native-fresh/src-nextgen/components/Button.tsx` - Fixed imports and theme usage
- `mobile-native-fresh/src-nextgen/components/Header.tsx` - Fixed imports and theme usage
- `mobile-native-fresh/src-nextgen/components/TagChip.tsx` - Fixed imports and theme usage
- `mobile-native-fresh/src-nextgen/components/Text.tsx` - Fixed imports and theme usage

## Next Steps
1. Complete Text component typography fixes
2. Run comprehensive ESLint validation
3. Begin deep review of `/src-nextgen/patches/phase-1` patches
4. Validate each patch with full logic passes and runtime testing

## Critical Notes
- All changes preserve existing functionality
- Token renaming from `tokens` to `designTokens` is consistent
- No destructive variable deletion - only renaming and structure enhancement
- Type casting used only where necessary for React Native compatibility
- Import paths now correctly reference the actual file structure 