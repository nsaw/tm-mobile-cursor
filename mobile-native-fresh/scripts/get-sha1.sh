#!/bin/bash

echo "🔍 Getting SHA-1 Fingerprint for Android"
echo "========================================"

# Method 1: Try to find Android SDK keytool
echo "📱 Method 1: Looking for Android SDK keytool..."

# Common Android SDK locations
SDK_PATHS=(
    "$HOME/Library/Android/sdk"
    "$HOME/Android/Sdk"
    "/usr/local/android-sdk"
    "/opt/android-sdk"
)

KEYTOOL_FOUND=false

for sdk_path in "${SDK_PATHS[@]}"; do
    if [ -d "$sdk_path" ]; then
        echo "Found Android SDK at: $sdk_path"
        
        # Look for keytool in build-tools
        for build_tools in "$sdk_path"/build-tools/*; do
            if [ -d "$build_tools" ] && [ -f "$build_tools/keytool" ]; then
                echo "✅ Found keytool at: $build_tools/keytool"
                KEYTOOL_PATH="$build_tools/keytool"
                KEYTOOL_FOUND=true
                break 2
            fi
        done
        
        # Look for keytool in platform-tools
        if [ -f "$sdk_path/platform-tools/keytool" ]; then
            echo "✅ Found keytool at: $sdk_path/platform-tools/keytool"
            KEYTOOL_PATH="$sdk_path/platform-tools/keytool"
            KEYTOOL_FOUND=true
            break
        fi
    fi
done

if [ "$KEYTOOL_FOUND" = true ]; then
    echo ""
    echo "🔑 Getting SHA-1 from debug keystore..."
    
    # Check if debug keystore exists
    if [ -f "$HOME/.android/debug.keystore" ]; then
        echo "✅ Found debug keystore at: $HOME/.android/debug.keystore"
        echo ""
        echo "SHA-1 Fingerprint:"
        echo "=================="
        "$KEYTOOL_PATH" -list -v -keystore "$HOME/.android/debug.keystore" -alias androiddebugkey -storepass android -keypass android | grep "SHA1:"
    else
        echo "❌ Debug keystore not found at: $HOME/.android/debug.keystore"
        echo ""
        echo "Creating debug keystore..."
        mkdir -p "$HOME/.android"
        "$KEYTOOL_PATH" -genkey -v -keystore "$HOME/.android/debug.keystore" -alias androiddebugkey -storepass android -keypass android -keyalg RSA -keysize 2048 -validity 10000 -dname "CN=Android Debug,O=Android,C=US"
        
        if [ $? -eq 0 ]; then
            echo "✅ Debug keystore created successfully!"
            echo ""
            echo "SHA-1 Fingerprint:"
            echo "=================="
            "$KEYTOOL_PATH" -list -v -keystore "$HOME/.android/debug.keystore" -alias androiddebugkey -storepass android -keypass android | grep "SHA1:"
        else
            echo "❌ Failed to create debug keystore"
        fi
    fi
else
    echo "❌ Android SDK keytool not found"
fi

echo ""
echo "📋 Alternative Methods:"
echo "======================"
echo ""
echo "1. Use Android Studio:"
echo "   - Open Android Studio"
echo "   - View → Tool Windows → Gradle"
echo "   - Your App > Tasks > android > signingReport"
echo "   - Double-click signingReport"
echo ""
echo "2. Use Firebase Console:"
echo "   - Go to Firebase Console"
echo "   - Project Settings → General"
echo "   - Your apps → Add app → Android"
echo "   - Enter package name: com.thoughtmarks.app"
echo "   - You can add SHA-1 later in the app settings"
echo ""
echo "3. Install Java JDK:"
echo "   - Install Java JDK from https://adoptium.net/"
echo "   - Then run: keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android -keypass android"
echo ""
echo "4. Use Expo EAS (if using EAS Build):"
echo "   - npm install -g @expo/eas-cli"
echo "   - eas login"
echo "   - eas credentials:manager" 