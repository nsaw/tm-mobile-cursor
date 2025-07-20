# Patch Validation Guide

## Overview
This document describes the patch validation system for src-nextgen.

## Validation Scripts
- `validate-patch-dependencies.js` - Checks execution order and dependencies
- `test-coordination.js` - Validates GPT/Cursor compatibility
- `update-documentation.js` - Updates documentation and cleanup

## Validation Criteria
1. **Execution Order**: Patches must execute in correct phase/step order
2. **Dependencies**: Required patches must exist before dependent patches
3. **Build Commands**: Standardized test commands across all patches
4. **Compatibility**: GPT and Cursor patches must be compatible

## Current Status
- ✅ Execution Order: Valid
- ✅ Dependencies: Valid
- ⚠️  Build Commands: Partially standardized
- ✅ Test Coordination: Generated

Last updated: 2025-07-19T17:50:44.748Z
