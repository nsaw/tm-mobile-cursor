# Shell Requirements for tm-mobile-cursor Project

## Overview

This project **strictly requires** the use of **zsh** or **bash** shells only. **PowerShell is explicitly forbidden** and will cause validation failures.

## Supported Shells

### ✅ Allowed Shells
- **zsh** (`/bin/zsh`) - Recommended for macOS
- **bash** (`/bin/bash`) - Alternative option

### ❌ Forbidden Shells
- **PowerShell** (any version)
- **PowerShell Core** (`pwsh`)
- **fish**
- **tcsh**
- **csh**

## Project Directories

The following directories are configured for shell enforcement:

1. **Main Project**: `/Users/sawyer/gitSync/tm-mobile-cursor`
2. **Mobile App**: `/Users/sawyer/gitSync/tm-mobile-cursor/mobile-native-fresh`
3. **Cursor Cache**: `/Users/sawyer/gitSync/.cursor-cache`

## Shell Configuration Files

### `.shellrc` Files
Each project directory contains a `.shellrc` file that:
- Validates shell type on source
- Sets project-specific environment variables
- Prevents PowerShell usage
- Configures shell-specific settings

### Validation Script
`scripts/validate-shell.sh` provides comprehensive shell validation:
- Checks current shell type
- Detects PowerShell usage
- Validates available shells
- Sets up shell configuration

## Usage

### Manual Shell Validation
```bash
# Run full validation and setup
/Users/sawyer/gitSync/tm-mobile-cursor/scripts/validate-shell.sh

# Check only (no setup)
/Users/sawyer/gitSync/tm-mobile-cursor/scripts/validate-shell.sh --check-only

# Setup only (no validation)
/Users/sawyer/gitSync/tm-mobile-cursor/scripts/validate-shell.sh --setup-only
```

### Source Shell Configuration
```bash
# Source main project configuration
source /Users/sawyer/gitSync/tm-mobile-cursor/.shellrc

# Source mobile app configuration
source /Users/sawyer/gitSync/tm-mobile-cursor/mobile-native-fresh/.shellrc

# Source cursor cache configuration
source /Users/sawyer/gitSync/.cursor-cache/.shellrc
```

## Environment Variables

The shell configuration sets the following environment variables:

### Project Paths
- `TM_MOBILE_CURSOR_PROJECT_ROOT` - Main project directory
- `TM_MOBILE_FRESH_ROOT` - Mobile app directory
- `CURSOR_CACHE_ROOT` - Cursor cache directory
- `CURSOR_CACHE_MAIN` - Cursor cache MAIN directory

### Shell Information
- `PROJECT_SHELL` - Current shell type (zsh/bash)

### Mobile App Specific
- `EXPO_DEVTOOLS_LISTEN_ADDRESS` - Expo devtools configuration
- `REACT_NATIVE_PACKAGER_HOSTNAME` - React Native packager hostname
- `NODE_ENV` - Node.js environment
- `EXPO_DEBUG` - Expo debug configuration

### Cursor Specific
- `CURSOR_AGENT_MODE` - Cursor agent mode
- `CURSOR_CACHE_ENABLED` - Cursor cache status

## Error Handling

### Shell Validation Failures
If an unsupported shell is detected:
1. Error message displayed with current shell
2. List of available supported shells shown
3. Script exits with error code 1

### PowerShell Detection
If PowerShell is detected:
1. Error message displayed
2. Instructions to switch to zsh or bash
3. Script exits with error code 1

## Integration with Development Workflow

### Pre-commit Hooks
Consider adding shell validation to git hooks:
```bash
#!/bin/bash
# .git/hooks/pre-commit
/Users/sawyer/gitSync/tm-mobile-cursor/scripts/validate-shell.sh --check-only
```

### CI/CD Integration
Add shell validation to CI/CD pipelines:
```yaml
- name: Validate Shell
  run: |
    /Users/sawyer/gitSync/tm-mobile-cursor/scripts/validate-shell.sh --check-only
```

### IDE Configuration
Configure your IDE to use zsh or bash:
- **VS Code**: Set `terminal.integrated.shell.osx` to `/bin/zsh` or `/bin/bash`
- **Cursor**: Ensure terminal uses zsh or bash
- **Other IDEs**: Configure to use supported shells

## Troubleshooting

### PowerShell Still Being Used
1. Check your terminal application settings
2. Verify `$SHELL` environment variable
3. Restart your terminal application
4. Check IDE terminal configuration

### Shell Validation Fails
1. Run validation script with `--check-only` flag
2. Review error messages
3. Ensure zsh or bash is installed
4. Check file permissions on shell binaries

### Environment Variables Not Set
1. Source the appropriate `.shellrc` file
2. Check file permissions on `.shellrc` files
3. Verify file paths are correct
4. Run validation script to setup configuration

## Compliance

### Required Actions
- [ ] Use only zsh or bash shells
- [ ] Avoid PowerShell completely
- [ ] Source `.shellrc` files when working in project directories
- [ ] Run validation script before major operations
- [ ] Configure IDEs to use supported shells

### Validation Checklist
- [ ] Current shell is zsh or bash
- [ ] PowerShell is not detected
- [ ] Environment variables are set correctly
- [ ] Project paths are accessible
- [ ] Shell configuration files are sourced

## Support

If you encounter shell-related issues:
1. Run the validation script first
2. Check this documentation
3. Review error messages carefully
4. Ensure compliance with shell requirements

---

**Remember**: This project is designed for Unix-like shells (zsh/bash) and will not function correctly with PowerShell or other incompatible shells. 