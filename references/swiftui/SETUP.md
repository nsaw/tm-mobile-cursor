# Thoughtmarks iOS Setup Guide

## Prerequisites
- macOS with Xcode 15+ installed
- iOS 16+ target device or simulator
- Apple Developer Account (for device testing/App Store)

## Project Structure

```
Thoughtmarks/
├── Models/         # Data models and structures
├── Views/          # SwiftUI view components
├── Services/       # API and data services
├── Utils/          # Utilities and configuration
├── Assets.xcassets/# App icons and images
└── MockData.swift  # Sample data for previews
```

## Installation Steps

1. Open in Xcode:
```bash
open Package.swift
```

2. Wait for Swift Package Manager to resolve dependencies

3. Configure Firebase:
   - Add GoogleService-Info.plist to the project
   - Ensure it's added to the target

4. Update Bundle Identifier:
   - Select project in navigator
   - Choose your team and unique bundle identifier

## Building and Running

### Development
- Select your target device/simulator
- Press Cmd+R to build and run

### TestFlight Distribution
1. Archive the app (Product → Archive)
2. Upload to App Store Connect
3. Process will complete in 10-15 minutes
4. Add external testers in TestFlight

### App Store Release
1. Create new version in App Store Connect
2. Upload build via Xcode or Application Loader
3. Fill out app metadata and screenshots
4. Submit for review

## Configuration

### Environment Setup
Update Config.swift with your API endpoints and configuration:
```swift
struct Config {
    static let apiBaseURL = "https://your-api.com"
    static let debugMode = false // Set to false for production
}
```

### Firebase Configuration
Ensure GoogleService-Info.plist is properly configured with:
- Project ID
- API Key
- Storage bucket
- Client ID

## Assets Management
- Add app icons to Assets.xcassets/AppIcon.appiconset/
- Include launch screen images
- Use vector images when possible for better scaling

## Troubleshooting

### Common Issues
- Build errors: Clean build folder (Cmd+Shift+K)
- Package resolution: File → Packages → Reset Package Caches
- Simulator issues: Reset simulator content and settings

### Performance Optimization
- Enable bitcode for smaller app size
- Use App Thinning for device-specific builds
- Optimize images and assets for iOS guidelines
- Test on real devices for accurate performance metrics
