# Screen Capture Verification System

## Overview

The Screen Capture Verification System is a comprehensive solution for the ghost runner automation that provides headless screen capture and verification for all UI-related tasks. It ensures that app load, content load, and dashboard screens are captured and verified by both human reviewers and GPT analysis before marking ste{ { { { ps complete. & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown

## Features

### 🔍 **Screen Capture**
- **App Load Capture**: Captures the initial app loading screen
- **Content Load Capture**: Captures screens with loaded content (thoughtmarks, bins, etc.)
- **Dashboard Capture**: Captures the main dashboard with all components
- **Headless Operation**: Uses Puppeteer for automated browser control
- **Mobile Viewport**: Simulates iPhone X dimensions (375x812)
- **Retry Logic**: Automatic retry on capture failures

### 👥 **Human Review**
- **Visual Integrity Check**: Human reviewers verify screenshots
- **UI Element Validation**: Confirm all components are visible and positioned correctly
- **Navigation Testing**: Test interactive elements when possible
- **Regression Detection**: Identify visual regressions or broken layouts

### 🤖 **GPT Analysis**
- **Automated Analysis**: GPT analyzes screenshots for UI integrity
- **Component Validation**: Check proper component rendering and layout structure
- **Accessibility Assessment**: Verify accessibility compliance
- **Confidence Scoring**: Provide confidence scores for automated decisions

### 🔄 **Ghost Runner Integration**
- **Automatic Detection**: Detects UI-related content automatically
- **Verification Workflow**: Integrates verification into patch/summary processing
- **Approval Gates**: Prevents completion until verification passes
- **Logging & Monitoring**: Comprehensive logging and status tracking

## Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Ghost Runner  │───▶│ Screen Capture   │───▶│ Verification    │
│   Automation    │    │   Verifier       │    │   Manager       │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                                │                        │
                                ▼                        ▼
                       ┌─────────────────┐    ┌─────────────────┐
                       │   Captures      │    │   Human Review  │
                       │   Directory     │    │   & GPT Analysis│
                       └─────────────────┘    └─────────────────┘
```

## Setup

### 1. Install Dependencies

Run the setup script to install all required dependencies:

```{ { { { bash
./scripts/setup-verification-dependencies.sh & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown
```

This will:
- Install Puppeteer, modern-screenshot, and other dependencies
- Create necessary directories
- Set up configuration files
- Test the verification system

### 2. Verify Setup

Test that the verification system is working:

```{ { { { bash
# Test screen capture & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown
{ { { { { { { { { { { { node scripts/screen-capture-verifier.js capture-all & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown &  & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown &  & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown & & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown

# Test verification manager
{ { { { node scripts/verification-manager.js verify '{"test": true & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown}'

# Test enhanced ghost runner
./scripts/enhanced-ghost-runner-with-verification.sh test-verification
```

## Usage

### Basic Screen Capture

```{ { { { bash
# Capture all screens (app load, content load, dashboard) & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown
node scripts/screen-capture-verifier.js capture-all

# Capture specific screen
{ { { { node scripts/screen-capture-verifier.js capture-app-load & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown
{ { { { node scripts/screen-capture-verifier.js capture-content-load & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown
{ { { { node scripts/screen-capture-verifier.js capture-dashboard & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown

# Clean up old captures
{ { { { node scripts/screen-capture-verifier.js cleanup & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown
```

### Verification Workflow

```{ { { { bash
# Run complete verification workflow & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown
{ { { { node scripts/verification-manager.js verify '{"content": "UI test", "contentType": "patch" & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown}'

# Create verification task
{ { { { node scripts/verification-manager.js create-task '{"test": true & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown}'

# Execute verification workflow
{ { { { node scripts/verification-manager.js execute-workflow <task-id> & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown

# Wait for approval
{ { { { node scripts/verification-manager.js wait-approval <task-id> & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown
```

### Ghost Runner Integration

```{ { { { bash
# Start ghost runner with verification & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown
./scripts/enhanced-ghost-runner-with-verification.sh start

# Check status
./scripts/enhanced-ghost-runner-with-verification.sh status

# Stop ghost runner
./scripts/enhanced-ghost-runner-with-verification.sh stop

# Test functionality
./scripts/enhanced-ghost-runner-with-verification.sh test
```

## Configuration

### Verification Configuration

The system uses `verification-config.json` for configuration:

```json
{
  "screenCapture": {
    "viewport": {
      "width": 375,
      "height": 812
    },
    "userAgent": "Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)...",
    "screenshotQuality": 80,
    "retryAttempts": 3,
    "timeout": 30000
  },
  "verification": {
    "timeout": 60000,
    "autoApproveThreshold": 0.8,
    "maxRetries": 3,
    "verificationTypes": ["ui", "functionality", "performance", "accessibility"]
  },
  "paths": {
    "captures": "mobile-native-fresh/captures",
    "verification": "mobile-native-fresh/verification",
    "logs": "logs",
    "summaries": "mobile-native-fresh/tasks/summaries"
  },
  "uiKeywords": [
    "UI", "interface", "screen", "component", "layout", "visual", "design",
    "React Native", "Expo", "mobile", "app", "dashboard", "navigation",
    "button", "modal", "form", "input", "style", "theme", "render",
    "Screen", "View", "Text", "TouchableOpacity", "ScrollView"
  ]
}
```

### UI Detection Keywords

The system automatically detects UI-related content using these keywords:

- **UI Terms**: UI, interface, screen, component, layout, visual, design
- **Framework Terms**: React Native, Expo, mobile, app, dashboard, navigation
- **Component Terms**: button, modal, form, input, style, theme, render
- **React Native Terms**: Screen, View, Text, TouchableOpacity, ScrollView

## Workflow

### 1. Content Detection

When a patch or summary is processed:

1. **Content Analysis**: System analyzes content for UI-related keywords
2. **Verification Decision**: Determines if UI verification is required
3. **Workflow Initiation**: If UI-related, starts verification workflow

### 2. Screen Capture

For UI-related content:

1. **App Load Capture**: Captures initial app loading screen
2. **Content Load Capture**: Captures screens with loaded content
3. **Dashboard Capture**: Captures main dashboard with all components
4. **Retry Logic**: Automatically retries failed captures

### 3. Verification Process

1. **Human Review Request**: Generates review request with captured screenshots
2. **GPT Analysis Request**: Generates analysis request for automated review
3. **Approval Waiting**: Waits for both human and GPT approval
4. **Result Processing**: Processes verification results and updates task status

### 4. Completion

1. **Success**: If both human and GPT approve, task completes
2. **Failure**: If either human or GPT reject, task fails
3. **Summary Generation**: Creates verification summary report
4. **Logging**: Logs all verification activities

## Directory Structure

```
mobile-native-fresh/
├── captures/                    # Screenshot captures
│   ├── app-load-*.png
│   ├── content-load-*.png
│   └── dashboard-*.png
├── verification/                # Verification requests and results
│   ├── verification-*.json
│   ├── human-review-*.json
│   └── gpt-analysis-*.json
└── tasks/
    └── summaries/              # Verification summaries
        └── verification-summary-*.md

logs/
└── screen-capture-verifier.log # Verification system logs
```

## Monitoring

### Log Files

- **screen-capture-verifier.log**: Screen capture activities
- **verification-manager.log**: Verification workflow activities
- **ghost-runner.log**: Ghost runner integration activities

### Status Checking

```{ { { { bash
# Check verification system status & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown
{ { { { node scripts/verification-manager.js status & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown

# Check ghost runner status
./scripts/enhanced-ghost-runner-with-verification.sh status

# View recent captures
ls -la mobile-native-fresh/captures/

# View verification requests
ls -la mobile-native-fresh/verification/
```

## Troubleshooting

### Common Issues

1. **Puppeteer Installation**
   ```{ { { { bash
   # If Puppeteer fails to install & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown
   { { { { npm install puppeteer --unsafe-perm=true & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown
   ```

2. **Port Conflicts**
   ```{ { { { bash
   # Check if port 4000 is in use & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown
   lsof -i :4000
   # Kill conflicting process
   kill -9 <PID>
   ```

3. **Permission Issues**
   ```{ { { { bash
   # Make scripts executable & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown
   chmod +x scripts/*.sh
   ```

4. **Directory Issues**
   ```{ { { { bash
   # Create missing directories & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown
   mkdir -p mobile-native-fresh/captures
   mkdir -p mobile-native-fresh/verification
   mkdir -p logs
   ```

### Debug Mode

Enable debug logging:

```{ { { { bash
# Set debug environment variable & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown
export VERIFICATION_DEBUG=true

# Run with debug output
node scripts/screen-capture-verifier.js capture-all
```

## Integration with Existing Systems

### Ghost Runner Integration

The verification system integrates seamlessly with the existing ghost runner:

1. **Automatic Detection**: Detects UI-related content automatically
2. **Non-Blocking**: Non-UI content bypasses verification
3. **Logging**: All activities are logged for monitoring
4. **Error Handling**: Graceful handling of verification failures

### Summary System Integration

Verification summaries are automatically written to the summaries directory:

- **Location**: `mobile-native-fresh/tasks/summaries/`
- **Format**: Markdown with detailed verification results
- **Naming**: `verification-summary-YYYY-MM-DD-HH-MM-SS.md`

### Monitoring Integration

The system integrates with existing monitoring:

- **Log Rotation**: Uses existing log rotation system
- **Health Checks**: Integrates with health check systems
- **Alerting**: Uses existing alert mechanisms

## Future Enhancements

### Planned Features

1. **Visual Regression Testing**: Compare screenshots against baselines
2. **Performance Metrics**: Capture and analyze performance data
3. **Accessibility Testing**: Automated accessibility compliance checking
4. **Multi-Device Testing**: Test on different device sizes
5. **Video Recording**: Record screen interactions for review

### Extensibility

The system is designed to be easily extensible:

- **Plugin Architecture**: Add new verification types
- **Custom Keywords**: Configure custom UI detection keywords
- **Custom Workflows**: Define custom verification workflows
- **Integration APIs**: Easy integration with external systems

## Security Considerations

1. **Screenshot Storage**: Screenshots are stored locally and cleaned up automatically
2. **No Sensitive Data**: System avoids capturing sensitive information
3. **Access Control**: Verification requests require proper authentication
4. **Audit Trail**: All verification activities are logged for audit purposes

## Performance Considerations

1. **Headless Operation**: Uses headless browser for efficiency
2. **Parallel Processing**: Multiple captures can run in parallel
3. **Cleanup**: Automatic cleanup of old captures and logs
4. **Resource Management**: Proper resource cleanup after captures

## Support

For issues or questions:

1. **Check Logs**: Review log files for error details
2. **Test Setup**: Run setup verification tests
3. **Debug Mode**: Enable debug logging for detailed output
4. **Documentation**: Refer to this documentation for usage details 