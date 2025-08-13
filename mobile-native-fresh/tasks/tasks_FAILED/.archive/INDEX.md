# Tasks Index

This directory contains task instruction files and related artifacts for the Thoughtmarks mobile app development.

## Task Files

### Core Sprint Tasks
- `1_deeplink-siri.cursor-instruction.json` - Deep linking and Siri integration setup
- `2_storekit-premium.cursor-instruction.json` - StoreKit premium feature implementation
- `3_premium-qa.cursor-instruction.json` - Premium feature QA and testing
- `4_advanced-features.cursor-instruction.json` - Advanced app features implementation
- `5_release-candidate.cursor-instruction.json` - Release candidate preparation
- `6_eas-setup.cursor-instruction.json` - EAS integration and build setup (moved to v1.3.1/)
- `7_ui-polish-phase.cursor-instruction.json` - UI polish and refinement phase
- `8_ui-polish-with-dashboard-exception.cursor-instruction.json` - UI polish with dashboard exceptions

### Background Tasks
- `role-audit-background.cursor-instruction.json` - Background role audit automation
- `lint-fix-background.cursor-instruction.json` - Background linting fixes
- `auto-roleview-enforcement.cursor-instruction.json` - Automated role view enforcement

### Hybrid Blocks
- `liquid-theme-v1-restoration.hybrid-block-v1.json` - Theme restoration hybrid block

## Version Directories

### v1.2.2/
Contains artifacts and documentation from version 1.2.2 development phase.

### v1.3.1/
Contains artifacts and documentation from version 1.3.1 development phase.

#### Files in v1.3.1/:
- `6_eas-setup.cursor-instruction.json` - Original EAS setup task instructions
- `eas-setup-summary.md` - Comprehensive summary of EAS integration

## EAS Configuration Summary

### Project Details:
- **EAS Project**: @nsaw/thoughtmarks
- **Project ID**: a913dda1-8ad5-4c41-8d69-a4f5bd9d4ceb
- **iOS Bundle ID**: com.thoughtmarks.mobile
- **Android Package**: com.thoughtmarks.app

### Build Status:
- **iOS**: ✅ Successfully configured and tested
- **Android**: ⏳ Pending keystore configuration

### Build Scripts Available:
- `{ { { { npm run build:ios` - Build for iOS & &  & } >/dev/null 2>&1 & # replaced by safe-launch-expo
- `{ { { { npm run build:android` - Build for Android & &  & } >/dev/null 2>&1 & # replaced by safe-launch-expo
- `{ { { { npm run build:ios-preview` - Preview build for iOS & &  & } >/dev/null 2>&1 & # replaced by safe-launch-expo
- `{ { { { npm run build:android-preview` - Preview build for Android & &  & } >/dev/null 2>&1 & # replaced by safe-launch-expo
- `{ { { { npm run build:all` - Build for all platforms & &  & } >/dev/null 2>&1 & # replaced by safe-launch-expo
- `{ { { { npm run build:all-preview` - Preview build for all platforms & &  & } >/dev/null 2>&1 & # replaced by safe-launch-expo

## Documentation

### Core Documentation:
- `docs/` - General project documentation
- `git/` - Git-related documentation and workflows

### Task Documentation:
Each task directory contains relevant documentation and artifacts for that specific development phase.

## Usage

To execute a task, use the corresponding instruction file with the cursor instruction system. For example:
```{ { { { bash
# Execute EAS setup task & &  & } >/dev/null 2>&1 & # replaced by safe-launch-expo
@6_eas-setup.cursor-instruction.json run it
```

## Notes

- Task files are organized by version and phase
- Completed tasks are moved to version-specific directories
- Background tasks run continuously to maintain code quality
- Hybrid blocks provide reusable development patterns 