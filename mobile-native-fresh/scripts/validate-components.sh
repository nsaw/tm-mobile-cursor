#!/bin/bash

echo "🔍 Component validation starting..."

# Check if auth hook exists
if [ -f "src/features/auth/hooks/useAuth.tsx" ]; then
    echo "✅ Auth hook file exists"
else
    echo "❌ Auth hook file missing"
    exit 1
fi

# Check if App.tsx exists
if [ -f "src/App.tsx" ]; then
    echo "✅ App.tsx file exists"
else
    echo "❌ App.tsx file missing"
    exit 1
fi

# Check for auth provider usage in App.tsx
if grep -q "AuthProvider" src/App.tsx; then
    echo "✅ AuthProvider usage detected in App.tsx"
else
    echo "❌ AuthProvider usage not found in App.tsx"
    exit 1
fi

# Check for AppNavigator usage in App.tsx
if grep -q "AppNavigator" src/App.tsx; then
    echo "✅ AppNavigator usage detected in App.tsx"
else
    echo "❌ AppNavigator usage not found in App.tsx"
    exit 1
fi

# Check if SearchScreen exists and has search functionality
if [ -f "src/screens/SearchScreen.tsx" ]; then
    echo "✅ SearchScreen file exists"
else
    echo "❌ SearchScreen file missing"
    exit 1
fi

# Check for search functionality in SearchScreen
if grep -q "handleSearch" src/screens/SearchScreen.tsx; then
    echo "✅ Search functionality detected in SearchScreen"
else
    echo "❌ Search functionality not found in SearchScreen"
    exit 1
fi

# Check if ContentScreen exists and has scrollable content
if [ -f "src/screens/ContentScreen.tsx" ]; then
    echo "✅ ContentScreen file exists"
else
    echo "❌ ContentScreen file missing"
    exit 1
fi

# Check for ScrollView usage in ContentScreen
if grep -q "ScrollView" src/screens/ContentScreen.tsx; then
    echo "✅ ScrollView functionality detected in ContentScreen"
else
    echo "❌ ScrollView functionality not found in ContentScreen"
    exit 1
fi

# Check for content items in ContentScreen
if grep -q "Item" src/screens/ContentScreen.tsx; then
    echo "✅ Content items detected in ContentScreen"
else
    echo "❌ Content items not found in ContentScreen"
    exit 1
fi

echo "✅ Component validation complete"
exit 0 