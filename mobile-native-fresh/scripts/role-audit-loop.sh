#!/bin/bash

# Role Audit Background Loop Script
# Runs the JSX style role audit every hour continuously

echo "🔄 Starting continuous JSX style role audit loop..."
echo "📅 Will run every hour (3600 seconds)"
echo "⏰ Started at: $(date)"
echo ""

while true; do
    echo "🔍 Running role audit at: $(date)"
    
    # Run the audit script
    npx ts-node scripts/audit-style-roles.ts
    
    # Check if audit found issues
    if [ $? -eq 1 ]; then
        echo "⚠️  Issues found in role audit - continuing to monitor..."
    else
        echo "✅ No issues found - all components have proper roles!"
    fi
    
    echo "⏳ Waiting 1 hour before next audit..."
    echo "----------------------------------------"
    
    # Sleep for 1 hour (3600 seconds)
    sleep 3600
done 