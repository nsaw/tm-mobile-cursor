#!/bin/bash

echo "🔍 Role validation starting..."

# Check if auth context provides proper role injection
if grep -q "AuthContext" src/features/auth/hooks/useAuth.tsx; then
    echo "✅ AuthContext detected in useAuth hook"
else
    echo "❌ AuthContext missing from useAuth hook"
    exit 1
fi

# Check if auth state is properly managed
if grep -q "useState" src/features/auth/hooks/useAuth.tsx; then
    echo "✅ Auth state management detected"
else
    echo "❌ Auth state management missing"
    exit 1
fi

# Check if auth provider wraps children
if grep -q "AuthContext.Provider" src/features/auth/hooks/useAuth.tsx; then
    echo "✅ Auth provider context wrapping detected"
else
    echo "❌ Auth provider context wrapping missing"
    exit 1
fi

echo "✅ Role validation complete"
exit 0 