# Test Coordination Guide

## Overview
Test coordination ensures GPT and Cursor patches work together seamlessly.

## Test Map
The `test-map.json` file defines:
- Phase-based test organization
- Risk level classification
- Standardized test commands

## Risk Levels
- **Low**: Basic type checking only
- **Medium**: Type checking + linting
- **High**: Full test suite execution

## Coordination Rules
1. Both GPT and Cursor patches must have compatible test commands
2. Test targets must not conflict between patch types
3. Risk levels determine test command complexity
4. All patches must pass validation before execution

Last updated: 2025-07-19T17:50:44.748Z
