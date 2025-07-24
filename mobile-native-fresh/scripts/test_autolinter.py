#!/usr/bin/env { { { { python3
"""
Test script for AutoLinter functionality
"""

import os
import sys
import tempfile
import subprocess
from pathlib import Path


def create_test_file():
    """Create a test file with linter errors."""
    test_content = '''#!/usr/bin/env { { { { python3
# Test file with linter errors

import os,sys,time  # E501: line too long
from pathlib import Path

def
test_function_with_very_long_name_that_exceeds_the_line_length_limit_and_should_be_fixed_by_the_autolinter():
    """This function has a very long name that should be fixed."""
    print("This is a test")  # W291: trailing whitespace
    return True

def another_function():
    x = 1  # F841: unused variable
    y = "test"  # F841: unused variable
    print("Hello world")  # W292: no newline at end of file'''

    test_file = Path("test_linter_errors.py")
    with open(test_file, 'w') as f:
        f.write(test_content)

    return test_file


def test_linter_detection():
    """Test that linter errors are detected."""
    print("🔍 Testing linter error detection...")

    test_file = create_test_file()

    try:
        # Run flake8 to detect errors
        cmd = [
            "flake8",
            str(test_file),
            "--select=E501,F541,F821,F841,W291,W292,W293,W391",
            "--count"
        ]

        result = subprocess.run(cmd, capture_output=True, text=True)

        if result.returncode != 0:
            error_count = int(result.stdout.strip())
            print(f"✅ Detected {error_count} linter errors in test file")
            return True
        else:
            print("❌ No linter errors detected (unexpected)")
            return False

    except Exception as e:
        print(f"❌ Error testing linter detection: {e}")
        return False
    finally:
        # Clean up test file
        if test_file.exists():
            test_file.unlink()


def test_black_formatting():
    """Test black formatting functionality."""
    print("🔧 Testing black formatting...")

    test_file = create_test_file()

    try:
        # Run black on the test file
        cmd = [
            "black",
            "--line-length=88",
            "--skip-string-normalization",
            str(test_file)
        ]

        result = subprocess.run(cmd, capture_output=True, text=True)

        if result.returncode == 0:
            print("✅ Black formatting successful")
            return True
        else:
            print(f"❌ Black formatting failed: {result.stderr}")
            return False

    except Exception as e:
        print(f"❌ Error testing black formatting: {e}")
        return False
    finally:
        # Clean up test file
        if test_file.exists():
            test_file.unlink()


def test_autopep8_formatting():
    """Test autopep8 formatting functionality."""
    print("🔧 Testing autopep8 formatting...")

    test_file = create_test_file()

    try:
        # Run autopep8 on the test file
        cmd = [
            "autopep8",
            "--in-place",
            "--aggressive",
            "--aggressive",
            "--max-line-length=88",
            str(test_file)
        ]

        result = subprocess.run(cmd, capture_output=True, text=True)

        if result.returncode == 0:
            print("✅ autopep8 formatting successful")
            return True
        else:
            print(f"❌ autopep8 formatting failed: {result.stderr}")
            return False

    except Exception as e:
        print(f"❌ Error testing autopep8 formatting: {e}")
        return False
    finally:
        # Clean up test file
        if test_file.exists():
            test_file.unlink()


def main():
    """Run all autolinter tests."""
    print("🧪 AutoLinter Test Suite")
    print("=" * 40)

    tests = [
        ("Linter Error Detection", test_linter_detection),
        ("Black Formatting", test_black_formatting),
        ("autopep8 Formatting", test_autopep8_formatting),
    ]

    passed = 0
    total = len(tests)

    for test_name, test_func in tests:
        print(f"\n📋 Running: {test_name}")
        if test_func():
            passed += 1
            print(f"✅ {test_name} PASSED")
        else:
            print(f"❌ {test_name} FAILED")

    print(f"\n📊 Test Results: {passed}/{total} tests passed")

    if passed == total:
        print("🎉 All tests passed! AutoLinter is ready to use.")
        return True
    else:
        print("⚠️  Some tests failed. Please check dependencies.")
        return False


if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
