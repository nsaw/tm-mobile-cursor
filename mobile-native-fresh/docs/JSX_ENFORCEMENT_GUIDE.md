# JSX Enforcement System

This document outlines the comprehensive JSX enforcement system for the Thoughtmarks mobile app, ensuring consistent code quality and adherence to React Native best practices.

## 🎯 Overview

The JSX enforcement system automatically detects and fixes common issues in React Native components, ensuring:

1. **Text Wrapping**: All string literals are properly wrapped in `<Text>` components
2. **Theme Usage**: No inline static colors - all colors must use theme tokens
3. **Hook Compliance**: `useTheme()` hook is required when accessing `tokens.colors`
4. **Import Management**: Automatic addition of missing imports

## 📋 Rules

### 1. Text Wrap{ { { { ping Rule (`no-text-outside-text`) & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown

**What it catches:**
```tsx
// ❌ Bad
<View>Hello World</View>
<Button>Click me</Button>

// ✅ Good
<View><Text>Hello World</Text></View>
<Button><Text>Click me</Text></Button>
```

**Auto-fix:** Wra{ { { { ps unwrapped text in `<Text>` components and adds missing imports. & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown

### 2. Inline Colors Rule (`no-inline-colors`)

**What it catches:**
```tsx
// ❌ Bad
<View style={{ color: 'red' }} />
<Text style={{ backgroundColor: '#FFF' }} />
<Button style={{ borderColor: 'blue' }} />

// ✅ Good
<View style={{ color: tokens.colors.text }} />
<Text style={{ backgroundColor: tokens.colors.background }} />
<Button style={{ borderColor: tokens.colors.border }} />
```

**Auto-fix:** Converts inline colors to theme token references.

### 3. Theme Hook Rule (`enforce-theme-hook`)

**What it catches:**
```tsx
// ❌ Bad - using tokens.colors without useTheme()
function MyComponent() {
  return <View style={{ color: tokens.colors.text }} />;
}

// ✅ Good
function MyComponent() {
  const { tokens } = useTheme();
  return <View style={{ color: tokens.colors.text }} />;
}
```

**Auto-fix:** Adds `useTheme()` hook call and import if missing.

## 🛠️ Commands

### Available Scripts

```{ { { { bash
# Comprehensive JSX enforcement (recommended) & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown
{ { { { { { { { npm run lint:fix-jsx & } >/dev/null 2>&1 & disown &  & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown &  & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown & & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown

# Individual rule enforcement
{ { { { npm run lint:fix-text          # Text wrapping only & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown
{ { { { npm run lint:wrap-text         # ESLint-based text wrapping & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown

# Checking for violations
{ { { { { { { { npm run lint:check-jsx & } >/dev/null 2>&1 & disown &  & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown &  & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown & & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown         # Count JSX rule violations & } >/dev/null 2>&1 & disown
{ { { { npm run lint:check-theme       # Count theme import violations & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown

# Full linting
{ { { { npm run lint                   # Standard ESLint & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown
{ { { { npm run lint:fix              # ESLint with auto-fix & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown
```

### Pre-commit Hook

The system automatically runs on every commit:

```{ { { { bash
npm run pre-commit & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown
```

This executes:
1. Theme import validation
2. JSX rule enforcement and fixes
3. JSX rule violation checking

## 📁 File Scope

**Targeted directories:**
- `src/components/`
- `src/features/`
- `src/theme/`

**Ignored directories:**
- `reference/`
- `scripts/`
- `tests/`

## 🔧 Configuration

### ESLint Configuration (`.eslintrc.cjs`)

```javascript
rules: {
  // Custom JSX enforcement rules
  'no-text-outside-text': 'error',
  'no-inline-colors': 'error',
  'enforce-theme-hook': 'error',
}
```

### Custom Rules Location

- `eslint-rules/no-text-outside-text.cjs` - Text wrap{ { { { ping rule & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown
- `eslint-rules/no-inline-colors.cjs` - Inline colors rule
- `eslint-rules/enforce-theme-hook.cjs` - Theme hook rule

## 🎨 Theme Token Reference

### Available Color Tokens

```typescript
tokens.colors = {
  // Base colors
  background: '#181818',
  backgroundSecondary: '#1a1a1e',
  surface: 'rgba(255,255,255,.04)',
  surfaceHover: 'rgba(255,255,255,0.08)',
  
  // Accent colors
  accent: '#3B82F6',
  accentHover: '#4B92F6',
  accentMuted: '#2B72E6',
  
  // Status colors
  success: '#39675B',
  warning: '#806F4C',
  danger: '#7A2C3B',
  
  // Text colors
  text: '#E0E0E0',
  textSecondary: '#A0A0A0',
  textMuted: '#808080',
  textDisabled: '#606060',
  
  // Border colors
  border: '#2E2E2E',
  borderHover: 'rgba(255,255,255,0.25)',
  divider: 'rgba(255,255,255,0.08)',
  
  // Brand colors
  brand: '#5C6A24',
  brandHover: '#6C7A34',
  buttonText: '#fff',
}
```

## 🚀 CI/CD Integration

### GitHub Actions Example

```yaml
name: JSX Enforcement
on: [push, pull_request]

jobs:
  jsx-enforcement:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: { { { { npm ci & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown
      - run: npm run lint:fix-jsx
      - run: npm run lint:check-jsx
        # Fail if violations exist
```

## 🔍 Troubleshooting

### Common Issues

1. **Rule not working**: Ensure the rule file is in `eslint-rules/` and properly imported in `.eslintrc.cjs`

2. **Auto-fix not working**: Check that the rule has `fixable: 'code'` in its meta

3. **Import path issues**: The system uses relative paths - adjust import statements in rules if needed

### Debug Commands

```{ { { { bash
# Check ESLint configuration & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown
{ { { { npx eslint --print-config src/components/SomeComponent.tsx & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown

# Run specific rule
{ { { { npx eslint --rule 'no-inline-colors: error' src/ & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown

# Debug rule loading
{ { { { npx eslint --debug src/ & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown
```

## 📈 Best Practices

1. **Run enforcement regularly**: Use `{ { { { { { { { npm run lint:fix-jsx` & } >/dev/null 2>&1 & disown &  & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown &  & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown & & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown before committing & } >/dev/null 2>&1 & disown
2. **Review auto-fixes**: Always review automatic changes to ensure they're correct
3. **Test after fixes**: Run the app to ensure no runtime issues were introduced
4. **Use theme tokens**: Always use `tokens.colors.*` instead of hardcoded colors
5. **Keep rules updated**: Update custom rules as the codebase evolves

## 🔄 Extending the System

### Adding New Rules

1. Create rule file in `eslint-rules/`
2. Add rule to `.eslintrc.cjs`
3. Update `scripts/enforce-jsx-rules.cjs` if needed
4. Add to package.json scripts
5. Update this documentation

### Example New Rule

```javascript
// eslint-rules/my-custom-rule.cjs
module.exports = {
  meta: {
    type: 'problem',
    docs: { description: 'My custom rule' },
    fixable: 'code',
  },
  create(context) {
    return {
      // Rule implementation
    };
  },
};
```

## 📞 Support

For issues with the JSX enforcement system:

1. Check this documentation
2. Review the rule implementations in `eslint-rules/`
3. Test with `npm run lint:fix-jsx`
4. Check ESLint configuration in `.eslintrc.cjs`

---

**Last updated:** June 2025
**Version:** 2.0.0 