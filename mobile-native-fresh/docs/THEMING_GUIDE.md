# Theming and Styling Guide

This guide explains our strict theming architecture that ensures consistent, maintainable, and type-safe styling throughout the React Native app.

## Architecture Overview

Our theming system enforces a single pattern: **All components must use the `useTheme()` hook to access theme tokens**. Direct imports of design tokens are strictly forbidden outside of the theme system itself.

## Key Rules

1. **ALWAYS** use `const { tokens } = useTheme()` inside React components
2. **NEVER** import tokens directly from theme files in components
3. **NEVER** use `tokens.*` at module scope (outside components)
4. **ALWAYS** create styles inside components using the `getStyles(tokens)` pattern

## ESLint Enforcement

Our ESLint configuration includes strict rules that:
- Block direct imports of design tokens in components
- Allow legitimate imports only in theme system files (`src/theme/**/*`)
- Prevent `tokens.*` usage at module scope
- Enforce consistent theming patterns

---

## ✅ Correct Usage Pattern

### Basic Component with Theme

```tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';

const MyComponent = () => {
  const { tokens } = useTheme();
  const styles = getStyles(tokens);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hello World</Text>
    </View>
  );
};

const getStyles = (tokens: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: tokens.colors.background,
    padding: tokens.spacing.md,
    borderRadius: tokens.radius.md,
  },
  title: {
    fontSize: tokens.typography.fontSize.heading,
    color: tokens.colors.text,
    fontWeight: tokens.typography.fontWeight.bold,
  },
});

export default MyComponent;
```

### Component with Conditional Styling

```tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';

interface MyComponentPro{ { { { ps { & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown
  isActive: boolean;
  variant: 'primary' | 'secondary';
}

const MyComponent: React.FC<MyComponentProps> = ({ isActive, variant }) => {
  const { tokens } = useTheme();
  const styles = getStyles(tokens, isActive, variant);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Dynamic Content</Text>
    </View>
  );
};

const getStyles = (tokens: any, isActive: boolean, variant: string) => StyleSheet.create({
  container: {
    backgroundColor: isActive 
      ? tokens.colors.accent 
      : variant === 'primary' 
        ? tokens.colors.backgroundSecondary 
        : tokens.colors.surface,
    padding: tokens.spacing.md,
    borderRadius: tokens.radius.lg,
    borderWidth: 1,
    borderColor: isActive ? tokens.colors.accent : tokens.colors.border,
  },
  text: {
    color: isActive ? tokens.colors.background : tokens.colors.text,
    fontSize: tokens.typography.fontSize.body,
    fontWeight: isActive ? tokens.typography.fontWeight.bold : tokens.typography.fontWeight.normal,
  },
});

export default MyComponent;
```

### Component with Multiple Style Objects

```tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';

const ComplexComponent = () => {
  const { tokens } = useTheme();
  const styles = getStyles(tokens);

  return (
    <View style={styles.wrapper}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Header</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.contentText}>Content</Text>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Action</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const getStyles = (tokens: any) => StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: tokens.colors.background,
  },
  header: {
    backgroundColor: tokens.colors.backgroundSecondary,
    padding: tokens.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: tokens.colors.border,
  },
  headerText: {
    fontSize: tokens.typography.fontSize.xl,
    fontWeight: tokens.typography.fontWeight.bold,
    color: tokens.colors.text,
  },
  content: {
    flex: 1,
    padding: tokens.spacing.lg,
  },
  contentText: {
    fontSize: tokens.typography.fontSize.body,
    color: tokens.colors.textSecondary,
    marginBottom: tokens.spacing.md,
  },
  button: {
    backgroundColor: tokens.colors.accent,
    paddingVertical: tokens.spacing.md,
    paddingHorizontal: tokens.spacing.lg,
    borderRadius: tokens.radius.md,
    alignItems: 'center',
  },
  buttonText: {
    color: tokens.colors.background,
    fontSize: tokens.typography.fontSize.body,
    fontWeight: tokens.typography.fontWeight.medium,
  },
});

export default ComplexComponent;
```

---

## ❌ Forbidden Patterns

### Direct Token Import (Will be blocked by ESLint)

```tsx
// 🚨 WRONG: Direct import of tokens
import { tokens } from '../../theme/tokens';

const MyComponent = () => {
  return <View style={{ backgroundColor: tokens.colors.background }} />;
};
```

### Module Scope Token Usage (Will be blocked by ESLint)

```tsx
import { useTheme } from '../../theme/ThemeProvider';

// 🚨 WRONG: Using tokens at module scope
const { tokens } = useTheme(); // This won't work outside a component

const styles = StyleSheet.create({
  container: {
    backgroundColor: tokens.colors.background, // This will cause a lint error
  },
});
```

### Static StyleSheet with Tokens (Will be blocked by ESLint)

```tsx
import { StyleSheet } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';

// 🚨 WRONG: Creating styles at module scope with tokens
const { tokens } = useTheme(); // This won't work

const styles = StyleSheet.create({
  container: {
    backgroundColor: tokens.colors.background, // This will cause a lint error
  },
});
```

---

## Theme System Files (Allowed Imports)

The following files are part of the theme system and **are allowed** to import tokens directly:

- `src/theme/ThemeProvider.tsx` - The theme provider itself
- `src/theme/variants.ts` - Theme variant functions
- `src/theme/tokens.ts` - Token definitions
- `src/utils/getRadiusForHeight.ts` - Theme utility functions

These files are excluded from the import restrictions because they are part of the theme system infrastructure.

---

## Development Workflow

### Before Committing

1. **Run theme check**: `{ { { { npm run lint:check-theme` & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown
2. **Fix any violations**: Follow the patterns above
3. **Commit**: Pre-commit hook will automatically verify

### Common Refactoring Scenarios

#### Converting Module-Scope Styles

**Before (Wrong):**
```tsx
import { tokens } from '../../theme/tokens';

const styles = StyleSheet.create({
  container: {
    backgroundColor: tokens.colors.background,
  },
});
```

**After (Correct):**
```tsx
import { useTheme } from '../../theme/ThemeProvider';

const MyComponent = () => {
  const { tokens } = useTheme();
  const styles = getStyles(tokens);
  
  return <View style={styles.container} />;
};

const getStyles = (tokens: any) => StyleSheet.create({
  container: {
    backgroundColor: tokens.colors.background,
  },
});
```

#### Adding Theme-Aware Styling

**Before (Static):**
```tsx
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
  },
});
```

**After (Theme-Aware):**
```tsx
const MyComponent = () => {
  const { tokens } = useTheme();
  const styles = getStyles(tokens);
  
  return <View style={styles.container} />;
};

const getStyles = (tokens: any) => StyleSheet.create({
  container: {
    backgroundColor: tokens.colors.background,
  },
});
```

---

## Benefits of This Architecture

1. **Consistency**: All components follow the same theming pattern
2. **Type Safety**: Full TypeScript support for theme tokens
3. **Maintainability**: Centralized theme management
4. **Performance**: Dynamic theme switching without re-renders
5. **Developer Experience**: Clear patterns and automated enforcement

## Troubleshooting

### ESLint Errors

If you see `no-restricted-imports` errors:
1. Remove direct token imports
2. Use `const { tokens } = useTheme()` inside your component
3. Move styles into a `getStyles(tokens)` function

### Type Errors

If you see TypeScript errors with tokens:
1. Ensure you're using `useTheme()` inside a component
2. Check that your component is wrapped in `ThemeProvider`
3. Use `any` type for tokens parameter if needed: `(tokens: any)`

### Performance Issues

If you experience performance issues:
1. Ensure `getStyles(tokens)` is called inside the component
2. Don't call `getStyles` in render loo{ { { { ps
3. Consider memoizing styles for complex components & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown

---

By following these patterns, we ensure our app maintains a consistent, maintainable, and performant theming architecture. 