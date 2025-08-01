# Device-Log Runtime Validation

`validate-dual-mount.sh` now captures **simulator / device logs** (`xcrun` for iOS, `adb logcat` for Android) while each boot-mode runs.  
The script fails if any line matches:

```
Component .* has not been registered
Text strings must be rendered
Failed to load legacy app
TypeError: Cannot read property
Cannot read property .* of undefined
```

> **Tip:** open `/tmp/dual-mount-logs/` after a failing CI run to inspect full logs.

## How It Works

1. **Device Log Capture**: Uses `xcrun simctl spawn booted log stream` for iOS simulator logs
2. **Runtime Error Detection**: Monitors device logs for specific error patterns
3. **CI Integration**: Fails with exit code 13 when runtime errors are detected
4. **Log Preservation**: Stores logs in `/tmp/dual-mount-logs/` for debugging

## Usage

```bash
# Standard validation (Metro logs only)
npm run validate:dual-mount

# Device log validation (includes device runtime errors)
npm run validate:dual-mount:device

# CI integration
npm run ci:legacy-alias-check
```

## Error Patterns Detected

- **Component Registration**: `Component .* has not been registered`
- **Text Rendering**: `Text strings must be rendered`
- **Legacy App Loading**: `Failed to load legacy app`
- **Type Errors**: `TypeError: Cannot read property`
- **Undefined Properties**: `Cannot read property .* of undefined`

## Debugging

When validation fails, check the logs:

```bash
# View device logs for a specific mode
cat /tmp/dual-mount-logs/legacy-ios.device.log

# View Metro logs
cat /tmp/dual-mount-logs/legacy.log
``` 