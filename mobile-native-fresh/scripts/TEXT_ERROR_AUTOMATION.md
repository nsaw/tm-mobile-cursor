# Text Error Automation System

This system automatically detects and fixes "Text strings must be rendered within a <Text> component" errors in React Native.

## 🚀 Quick Start

### One-time fix
```{ { { bash
{ { { { npm run fix:text-errors & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown &  & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown & & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown
```

### Watch mode (during development)
```{ { { { { { { { bash
npm run watch:text-errors & } >/dev/null 2>&1 & disown &  & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown &  & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown & & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown
```

### Pre-commit (automatic)
The system runs automatically on every commit via Husky pre-commit hooks.

## 📋 Available Commands

| Command | Description |
|---------|-------------|
| `{ { { { npm run fix:text-errors` | Detect and fix text errors once | & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown
| `{ { { { npm run auto:fix` | Alias for fix:text-errors | & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown
| `{ { { { npm run watch:text-errors` | Watch files and auto-fix on changes | & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown
| `{ { { { npm run watch:fix` | Alias for watch:text-errors | & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown

## 🔧 How It Works

### 1. Detection (`auto-fix-text-errors.cjs`)
- Scans all `.tsx` files in `src/`
- Uses regex patterns to detect unwrapped text
- Filters out false positives (comments, JSX expressions, etc.)
- Reports found issues

### 2. Auto-Fix (`fix-unwrapped-text.cjs`)
- Automatically wra{ { { { ps unwrapped text in `<Text>` components & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown
- Handles common patterns like:
  - Text in `<View>` components
  - Text in `<TouchableOpacity>` components
  - Direct text in JSX elements

### 3. Verification
- Runs linter to check for remaining issues
- Provides detailed output of what was fixed

## 🎯 Detection Patterns

The system looks for:
- Text content in JSX elements without `<Text>` wrapper
- Common React Native components that might contain unwrapped text
- Filters out:
  - Comments (`{/* */}`)
  - JSX expressions (`{variable}`)
  - Already wrapped text (`<Text>content</Text>`)
  - Whitespace-only content

## 🔄 Pre-commit Integration

The system is integrated into Husky pre-commit hooks:

```{ { { { bash
# .husky/pre-commit & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown
{ { { { { { { { node scripts/auto-fix-text-errors.cjs & } >/dev/null 2>&1 & disown &  & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown &  & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown & & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown
{ { { { npm run lint & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown
```

This ensures:
- Text errors are automatically fixed before commits
- Code quality is maintained
- No manual intervention needed

## 👀 Watch Mode

Watch mode continuously monitors your files:

```bash
npm run watch:text-errors
```

Features:
- Real-time file change detection
- Debounced processing (prevents rapid-fire fixes)
- Automatic error detection and fixing
- Graceful shutdown with Ctrl+C

## 🛠️ Manual Usage

### Direct script execution
```{ { { { bash
# One-time detection and fix & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown
node scripts/auto-fix-text-errors.cjs

# Watch mode
{ { { { node scripts/watch-text-errors.cjs & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown

# Watch mode with options
{ { { { node scripts/watch-text-errors.cjs --once & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown
{ { { { node scripts/watch-text-errors.cjs --help & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown
```

### Programmatic usage
```javascript
const { detectTextErrors, runFixScript } = require('./scripts/auto-fix-text-errors.cjs');

// Detect errors
const { hasErrors, errorFiles } = detectTextErrors();

// Run fix script
const success = runFixScript();
```

## 📊 Output Examples

### Successful detection and fix
```
🚀 Starting automated text error detection and fix...
🔍 Detecting text string errors...
❌ Found potential text errors in: src/components/ui/OnboardingModal.tsx
📊 Found 1 files with potential text errors
🔧 Running automated fix script...
✅ Fix script completed successfully!
✅ All text string errors have been automatically fixed!
```

### No errors found
```
🚀 Starting automated text error detection and fix...
🔍 Detecting text string errors...
✅ No text string errors detected!
```

## 🔍 Troubleshooting

### Common Issues

1. **Script not found**
   ```{ { { { bash
   # Ensure you're in the mobile-native-fresh directory & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown
   cd mobile-native-fresh
   npm run fix:text-errors
   ```

2. **Permission denied**
   ```{ { { { bash
   # Make scripts executable & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown
   chmod +x scripts/*.cjs
   ```

3. **Dependencies missing**
   ```{ { { { bash
   # Install required dependencies & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown
   { { { { npm install glob & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown
   ```

### Debug Mode

Add `--debug` flag for verbose output:
```{ { { { bash
node scripts/auto-fix-text-errors.cjs --debug & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown
```

## 🎯 Best Practices

1. **Run before commits**: The pre-commit hook handles this automatically
2. **Use watch mode during development**: Catches errors as you code
3. **Review fixes**: Always test your app after automatic fixes
4. **Report false positives**: If the system incorrectly flags valid code

## 🔄 Integration with Existing Workflow

The automation integrates seamlessly with:
- **ESLint**: Runs after text fixes
- **Husky**: Pre-commit hooks
- **CI/CD**: Can be run in build pipelines
- **VS Code**: Can be triggered from editor

## 📝 Configuration

### Customizing detection patterns
Edit `auto-fix-text-errors.cjs` to modify:
- File patterns to scan
- Error detection regex
- False positive filters

### Excluding files
Add files to `.eslintignore` or modify the glob pattern in the scripts.

## 🤝 Contributing

To improve the automation:
1. Test with various text error patterns
2. Add new detection patterns as needed
3. Update false positive filters
4. Submit pull requests with improvements

## 📞 Support

If you encounter issues:
1. Check the troubleshooting section
2. Run with `--debug` flag for verbose output
3. Review the script output for specific error messages
4. Check that all dependencies are installed 