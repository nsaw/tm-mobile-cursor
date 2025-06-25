# Theming and Styling Guide

To maintain a consistent and performant styling architecture, we use a specific pattern for handling theme tokens. This guide explains how to use `designTokens` and the `useTheme` hook with its `tokens` object.

Our ESLint setup includes a rule `thoughtmarks/no-global-theme` that strictly enforces these patterns.

## Key Concepts

-   `designTokens`: A static object containing raw theme values (colors, spacing, typography, etc.). It should be used for styles that **do not change** with the theme.
-   `tokens`: An object provided by the `useTheme()` hook inside a React component. It contains theme-specific values and should be used for styles that need to be **dynamic** and react to theme changes.

## Rules of Thumb

1.  **NEVER** access `tokens.*` at the module scope (i.e., outside of a component or a function called within a component). This will cause a linting error.
2.  **ALWAYS** use `designTokens` for styles defined in a `StyleSheet.create()` call at the module scope.
3.  **ALWAYS** use the `getStyles(tokens)` factory pattern for styles that depend on the current theme's `tokens`.

---

## Static Styling with `designTokens`

When your component's styles do not depend on the theme (i.e., they are static), define them at the module level using `designTokens`.

**✅ Correct Usage:**

```tsx
import { StyleSheet, View, Text } from 'react-native';
import { designTokens } from '@/theme/tokens';

const MyComponent = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hello World</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: designTokens.colors.background,
    padding: designTokens.spacing.md,
  },
  title: {
    fontSize: designTokens.typography.fontSize.heading,
    color: designTokens.colors.text,
  },
});

export default MyComponent;
```

---

## Dynamic Styling with `getStyles(tokens)`

When your component's styles need to change based on the theme, you must use the `getStyles(tokens)` factory pattern.

1.  Create a `getStyles` function that accepts `tokens` as an argument and returns a `StyleSheet`.
2.  Call `useTheme()` inside your component to get the `tokens`.
3.  Call `getStyles(tokens)` inside the component to get the styles.

**✅ Correct Usage:**

```tsx
import { StyleSheet, View, Text } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { ThemeTokens } from '@/theme/tokens'; // Import the type

const MyDynamicComponent = () => {
  const { tokens } = useTheme();
  const styles = getStyles(tokens);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hello Dynamic World</Text>
    </View>
  );
};

const getStyles = (tokens: ThemeTokens) =>
  StyleSheet.create({
    container: {
      flex: 1,
      // Example of a dynamic color
      backgroundColor: tokens.colors.background, 
      padding: tokens.spacing.md,
    },
    title: {
      fontSize: tokens.typography.fontSize.heading,
      // Example of a dynamic color
      color: tokens.colors.text, 
    },
  });

export default MyDynamicComponent;
```

### ❌ Incorrect Usage (will be blocked by ESLint)

The following example shows what **NOT** to do. Accessing `tokens` at the module level is forbidden.

```tsx
import { StyleSheet } from 'react-native';
import { tokens } from '@/theme/ThemeProvider'; // Incorrect import and usage

// 🚨 WRONG: Do not access tokens at the module level.
const styles = StyleSheet.create({
  container: {
    backgroundColor: tokens.colors.background, // This will cause a lint error
  },
});
```

By following these patterns, we ensure our app is performant, maintainable, and consistent. 