# UI/UX Guidelines - Global Styling Standards

## Overview
This document defines the global UI/UX standards for the Thoughtmarks mobile app, ensuring consistency across all screens, components, and future development.

## 1. Typography System

### Typography Tokens
All text styling must use the centralized typography tokens from `src/theme/typography.ts`:

```typescript
// ✅ CORRECT - Using typography tokens
const { typography } = useTheme();
<Text style={typography.title}>THOUGHTMARKS</Text>
<Text style={typography.sectionTitle}>Recent Thoughtmarks</Text>
<Text style={typography.tagline}>Your personal knowledge management</Text>

// ❌ INCORRECT - Hardcoded styles
<Text style={{ fontSize: 16, fontWeight: '900' }}>THOUGHTMARKS</Text>
```

### Typography Variants
- **title**: Main app title (THOUGHTMARKS) - RFValue(16), Ubuntu_700Bold, uppercase
- **sectionTitle**: Section headers - RFValue(16), Ubuntu_600SemiBold, opacity 0.7
- **tagline**: NeonGradientText variant - RFValue(10), Ubuntu_400Regular
- **tagsTitle**: Filter/tags text - RFValue(10), Ubuntu_400Regular, lowercase
- **buttonText**: Button text - RFValue(12.5), Ubuntu_500Medium
- **viewMoreText**: View more buttons - RFValue(14), Ubuntu_600SemiBold
- **body**: Body text - RFValue(14), Ubuntu_400Regular
- **small**: Small text - RFValue(12), Ubuntu_400Regular

## 2. Button & Card Styling

### Standardized Button Styles
Use the predefined button styles from `src/theme/buttonStyles.ts`:

```typescript
// ✅ CORRECT - Using button styles
const { buttonStyles } = useTheme();
<TouchableOpacity style={buttonStyles.specialBinCard}>
  <Text style={buttonStyles.specialBinCardText}>New Bin</Text>
</TouchableOpacity>

// ❌ INCORRECT - Inline styles
<TouchableOpacity style={{
  width: '100%',
  height: 70,
  backgroundColor: 'transparent',
  borderWidth: 1,
  // ... more inline styles
}}>
```

### Button Variants
- **specialBinCard**: Transparent background, blue border, 70px height
- **viewMoreCard**: Transparent background, blue border, left-aligned count, right-aligned arrow
- **archiveCard**: Transparent background, gray border, archive styling

## 3. Spacing & Layout

### Spacing Tokens
Use spacing tokens from `src/theme/spacing.ts`:

```typescript
// ✅ CORRECT - Using spacing tokens
const { spacing } = useTheme();
<View style={{ paddingHorizontal: spacing.pagePaddingHorizontal }}>
  <Text style={{ marginBottom: spacing.sectionMarginBottom }}>Content</Text>
</View>

// ❌ INCORRECT - Hardcoded spacing
<View style={{ paddingHorizontal: 16 }}>
  <Text style={{ marginBottom: 14 }}>Content</Text>
</View>
```

### Layout Standards
- **Page Padding**: `spacing.pagePaddingHorizontal` (16px)
- **Section Margins**: `spacing.sectionMarginBottom` (14px)
- **Card Padding**: `spacing.cardPaddingVertical` (16px), `spacing.cardPaddingHorizontal` (30px)
- **Button Padding**: `spacing.buttonPadding` (12px)

## 4. Component-Specific Standards

### AIToolsCard
- Remove sparkle icon, place crown right-aligned
- Use consistent horizontal padding (`spacing.cardPaddingHorizontal`)
- Title: uppercase, no marginLeft
- BorderWidth: 0.25

### OnboardingModal
- Icon size: 90px
- Margin vertical: `spacing.modalPaddingVertical * 0.5`
- Pagination: "1 of 6" format
- Render icons directly, no `cloneElement`

### DraggableSection
- Base opacity: 0.5 → animates to 1
- Title fontSize: 20

### NeonGradientText
- Support `numberOfLines` prop
- Use `typography.tagline` as base style

## 5. Color System

### Color Tokens
Use color tokens from the theme system:

```typescript
// ✅ CORRECT - Using color tokens
const { tokens } = useTheme();
<Text style={{ color: tokens.colors.accent }}>Accent Text</Text>
<View style={{ backgroundColor: tokens.colors.background }} />

// ❌ INCORRECT - Hardcoded colors
<Text style={{ color: '#3B82F6' }}>Accent Text</Text>
<View style={{ backgroundColor: '#181818' }} />
```

### Standard Colors
- **Primary**: `tokens.colors.accent` (#3B82F6)
- **Background**: `tokens.colors.background` (#181818)
- **Text**: `tokens.colors.text` (#374151)
- **Text Secondary**: `tokens.colors.textSecondary` (#6B7280)
- **Border**: `tokens.colors.border` (#D1D5DB)

## 6. Accessibility Standards

### Required Pro{ { { { ps
All clickable elements must include: & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown

```typescript
// ✅ CORRECT - Full accessibility
<TouchableOpacity
  accessibilityRole="button"
  accessible={true}
  accessibilityLabel="Create new thoughtmark"
  onPress={handlePress}
>
  <Text>Create New</Text>
</TouchableOpacity>

// ❌ INCORRECT - Missing accessibility
<TouchableOpacity onPress={handlePress}>
  <Text>Create New</Text>
</TouchableOpacity>
```

### Accessibility Guidelines
- Every interactive element must have `accessibilityRole`
- Every interactive element must have `accessible={true}`
- Every interactive element must have `accessibilityLabel`
- Use descriptive labels that explain the action
- Test with screen readers

## 7. Navigation Standards

### Route Validation
All navigation calls must use valid routes from `src/navigation/routes.ts`:

```typescript
// ✅ CORRECT - Using route constants
import { ROUTES } from '../navigation/routes';
navigation.navigate(ROUTES.THOUGHTMARKS.CREATE);

// ❌ INCORRECT - Hardcoded routes
navigation.navigate('CreateThoughtmark');
```

### Navigation Patterns
- Use `navigation.navigate()` for standard navigation
- Use `navigation.push()` for stack navigation
- Pass parameters as objects, not strings
- Handle navigation errors gracefully

## 8. Testing & Validation

### Automated Checks
Run the clickable element audit script:

```{ { { { bash
npm run audit:clickables & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown
```

### Manual Validation Checklist
- [ ] All text uses typography tokens
- [ ] All spacing uses spacing tokens
- [ ] All colors use color tokens
- [ ] All buttons use button styles
- [ ] All clickable elements have accessibility pro{ { { { ps
- [ ] All navigation routes are valid & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown
- [ ] No hardcoded values in styles
- [ ] Consistent padding and margins
- [ ] Proper text wrap{ { { { ping and overflow handling & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown

## 9. Future Development

### New Components
When creating new components:
1. Use existing typography, spacing, and button tokens
2. Follow the established patterns
3. Add proper accessibility pro{ { { { ps
4. Test with the audit script & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown
5. Document any new tokens or patterns

### Refactoring Guidelines
When refactoring existing components:
1. Replace hardcoded values with tokens
2. Update to use new button styles
3. Add missing accessibility pro{ { { { ps
4. Validate navigation routes & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown
5. Update tests and documentation

## 10. Enforcement

### ESLint Rules
The project includes custom ESLint rules to enforce these standards:
- `thoughtmarks/no-direct-design-tokens`: Prevents hardcoded design values
- `thoughtmarks/require-use-theme`: Ensures theme hook usage
- `thoughtmarks/enforce-text-wrapping`: Prevents text overflow
- `thoughtmarks/no-circular-text`: Prevents nested Text components

### Pre-commit Hooks
Automated checks run before commits to ensure:
- All files pass the audit script
- No hardcoded values are introduced
- All accessibility requirements are met
- Navigation routes are valid

## 11. Resources

### Files
- `src/theme/typography.ts` - Typography tokens
- `src/theme/buttonStyles.ts` - Button styling
- `src/theme/spacing.ts` - Spacing tokens
- `src/navigation/routes.ts` - Route definitions
- `scripts/audit-clickable-elements.js` - Audit script

### Tools
- Design System Demo: `DesignSystemDemo` screen
- Audit Report: `audit-report.md`
- ESLint Configuration: `.eslintrc.js`

---

**Remember**: Consistency is key. Every component should look and feel like part of the same app. When in doubt, refer to existing components as examples and follow the established patterns. 