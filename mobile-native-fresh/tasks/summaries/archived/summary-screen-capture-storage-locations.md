# Screen Capture Storage Locations Summary

**Generated**: 2025-07-20T06:05:00.000Z

## **📸 Screen Capture Storage Overview**

Successfully identified and documented all screen capture and headless UI interaction screenshot storage locations in the tm-mobile-cursor project.

## **✅ PRIMARY STORAGE DIRECTORIES**

### **1. Screen Captures Directory**
- **Path**: `mobile-native-fresh/captures/`
- **Purpose**: Main directory for all screen captures and screenshots
- **Content Types**:
  - App load captures (`app-load-{timestamp}.png`)
  - Content load captures (`content-load-{timestamp}.png`)
  - Dashboard captures (`dashboard-{timestamp}.png`)
  - Visual regression screenshots
- **Status**: ✅ Directory exists, currently empty (ready for captures)

### **2. Verification Directory**
- **Path**: `mobile-native-fresh/verification/`
- **Purpose**: Verification reports, analysis data, and workflow results
- **Content Types**:
  - GPT analysis reports (`gpt-analysis-{timestamp}.json`)
  - Human review reports (`human-review-{timestamp}.json`)
  - Verification workflow results (`verification-{timestamp}.json`)
- **Status**: ✅ Directory exists with 5 verification files

## **✅ CONFIGURATION**

### **Verification Config File**
- **Path**: `verification-config.json`
- **Defines Storage Paths**:
  ```json
  {
    "paths": {
      "captures": "/Users/sawyer/gitSync/tm-mobile-cursor/mobile-native-fresh/captures",
      "verification": "/Users/sawyer/gitSync/tm-mobile-cursor/mobile-native-fresh/verification",
      "logs": "/Users/sawyer/gitSync/tm-mobile-cursor/logs",
      "summaries": "/Users/sawyer/gitSync/tm-mobile-cursor/mobile-native-fresh/tasks/summaries"
    }
  }
  ```

### **Capture Configuration**
- **Viewport**: iPhone X dimensions (375x812)
- **Quality**: 80% screenshot quality
- **Retry Attempts**: 3 attempts on failure
- **Timeout**: 30 seconds per capture
- **User Agent**: Mobile Safari simulation

## **✅ VERIFICATION FILES FOUND**

### **GPT Analysis Reports**
- `gpt-analysis-2025-07-19T19-37-14-569Z.json`

### **Human Review Reports**
- `human-review-2025-07-19T19-37-14-568Z.json`

### **Verification Workflow Results**
- `verification-2025-07-19T06-18-33-829Z.json`
- `verification-2025-07-19T19-36-52-660Z.json`
- `verification-2025-07-19T19-37-14-568Z.json`

## **✅ SCREENSHOT TYPES**

### **1. App Load Captures**
- **Filename Pattern**: `app-load-{timestamp}.png`
- **Purpose**: Capture initial app loading screen
- **Trigger**: When app load verification is needed

### **2. Content Load Captures**
- **Filename Pattern**: `content-load-{timestamp}.png`
- **Purpose**: Capture screens with loaded content (thoughtmarks, bins, etc.)
- **Trigger**: When content loading verification is needed

### **3. Dashboard Captures**
- **Filename Pattern**: `dashboard-{timestamp}.png`
- **Purpose**: Capture main dashboard with all components
- **Trigger**: When dashboard verification is needed

### **4. Visual Regression Screenshots**
- **Filename Pattern**: `{componentName}-{environment}-{timestamp}.png`
- **Purpose**: Component-specific screenshots for comparison
- **Trigger**: During visual regression testing

## **✅ SYSTEM STATUS**

### **Directories**
- ✅ **Captures Directory**: `mobile-native-fresh/captures/` - Ready for captures
- ✅ **Verification Directory**: `mobile-native-fresh/verification/` - Contains 5 verification files
- ✅ **Configuration**: `verification-config.json` - Properly configured

### **System Readiness**
- ✅ **Screen Capture System**: Configured and ready to use
- ✅ **Verification Workflow**: Operational with existing reports
- ✅ **Headless Browser**: Puppeteer configured for mobile simulation
- ✅ **Retry Logic**: 3 attempts with 30-second timeout

## **✅ USAGE COMMANDS**

### **Capture Screenshots**
```bash
# Capture all screens
node scripts/screen-capture-verifier.js capture-all

# Capture specific screen types
node scripts/screen-capture-verifier.js capture-app-load
node scripts/screen-capture-verifier.js capture-content-load
node scripts/screen-capture-verifier.js capture-dashboard
```

### **Run Verification Workflow**
```bash
# Complete verification workflow
node scripts/verification-manager.js verify '{"content": "UI test"}'

# Test verification system
./scripts/enhanced-ghost-runner-with-verification.sh test-verification
```

## **✅ BENEFITS**

1. **Organized Storage**: Clear separation between captures and verification data
2. **Timestamped Files**: All captures include timestamps for tracking
3. **Multiple Formats**: PNG for screenshots, JSON for analysis data
4. **Configurable Paths**: Easy to modify storage locations via config
5. **Automated Cleanup**: Old captures are automatically cleaned up
6. **Mobile Simulation**: iPhone X viewport for realistic mobile testing

## **Status**
✅ **COMPLETE** - All screen capture storage locations identified and documented
✅ **READY** - System configured and ready for new captures
✅ **OPERATIONAL** - Verification workflow functional with existing data 