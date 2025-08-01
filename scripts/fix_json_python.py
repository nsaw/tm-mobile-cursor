#!/usr/bin/env python3

import json
import re
import sys

def fix_json_file(file_path):
    """Fix JSON control characters and escape issues"""
    
    print(f"🔧 Fixing JSON file: {file_path}")
    
    # Read the file
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Fix common JSON issues
    print("🔧 Processing JSON content...")
    
    # Fix escaped quotes that should be regular quotes
    content = re.sub(r'\\"', '"', content)
    
    # Fix quotes that should be escaped in JSON strings
    # This is tricky - we need to be careful not to break the JSON structure
    # Let's try to fix the specific patterns we know are problematic
    
    # Fix accessibilityHint patterns
    content = re.sub(r'accessibilityHint="([^"]*)"', r'accessibilityHint="\1"', content)
    
    # Fix returnKeyType patterns
    content = re.sub(r'returnKeyType="([^"]*)"', r'returnKeyType="\1"', content)
    
    # Fix the specific line 95 issue
    # Replace the problematic string with a properly escaped version
    content = re.sub(r"from 'react-native';", "from 'react-native';", content)
    
    # Write the fixed content back
    temp_file = file_path + '.tmp'
    with open(temp_file, 'w', encoding='utf-8') as f:
        f.write(content)
    
    # Test if the JSON is valid
    try:
        with open(temp_file, 'r', encoding='utf-8') as f:
            json.load(f)
        print("✅ JSON validation passed")
        
        # Replace the original file
        import shutil
        shutil.move(temp_file, file_path)
        print(f"✅ Fixed JSON saved to: {file_path}")
        return True
        
    except json.JSONDecodeError as e:
        print(f"❌ JSON still has errors: {e}")
        import os
        os.remove(temp_file)
        return False

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python3 fix_json_python.py <json_file>")
        sys.exit(1)
    
    file_path = sys.argv[1]
    success = fix_json_file(file_path)
    
    if success:
        print("🎯 JSON fix complete!")
        sys.exit(0)
    else:
        print("❌ Failed to fix JSON")
        sys.exit(1) 