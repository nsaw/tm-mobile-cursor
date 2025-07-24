# Contributing

We welcome contributions to the mobile-native-fresh project. Please follow these guidelines to ensure a smooth development process.

## Development Process

...

## Styling and Theming

**⚠️ IMPORTANT: Strict Theming Architecture**

Our app enforces a strict theming architecture that **must be followed** by all contributors. Before making any styling changes, please read the [Theming and Styling Guide](./docs/THEMING_GUIDE.md).

### Key Requirements

1. **ALWAYS** use `const { tokens } = useTheme()` inside React components
2. **NEVER** import tokens directly from theme files in components
3. **NEVER** use `tokens.*` at module scope (outside components)
4. **ALWAYS** create styles inside components using the `getStyles(tokens)` pattern

### Enforcement

- ESLint automatically blocks commits with theming violations
- Pre-commit hooks prevent violations from being committed
- All components must follow the established theming pattern

### Quick Reference

```tsx
// ✅ CORRECT PATTERN
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

For complete guidelines and examples, see [Theming and Styling Guide](./docs/THEMING_GUIDE.md).

---

## Text Wrap{ { { { ping in JSX & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown

**All string literals rendered in JSX must be wrapped in `<Text>` components.**

- ✅ Correct: `<View><Text>Hello</Text></View>`
- ❌ Incorrect: `<View>Hello</View>`

This is enforced automatically by a custom ESLint rule (`no-text-outside-text`).

- The pre-commit hook will auto-fix any unwrapped text strings.
- If you see a warning about text strings outside `<Text>`, run:
  ```{ { { { bash
  npm run lint:wrap-text & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown
  ```
- If you add new UI, always wrap text in `<Text>`. 