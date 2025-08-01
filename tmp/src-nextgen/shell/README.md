# Shell Architecture

This directory contains the hybrid renderer shell implementation for the nextgen architecture.

## Directory Structure

- `wrappers/` - Role-based component wrappers
- `contracts/` - Layout contracts and z-index protection
- `navigation/` - Navigation definitions and routing
- `mounts/` - Sacred view mounts and protection
- `validation/` - Shell validation utilities

## Purpose

The shell provides a consistent interface for components during migration, ensuring proper role assignment and behavior across both legacy and nextgen environments.

## Architecture

- **Hybrid Renderer**: Supports both legacy and nextgen component rendering
- **Role-Based Wrappers**: Provides consistent component interfaces
- **Layout Contracts**: Ensures proper z-index and layout protection
- **Sacred Mounts**: Protects critical UI components from modification
- **Validation**: Comprehensive testing and validation framework

## Usage

```typescript
import { initializeShell } from './shell';

// Initialize the shell
const shell = initializeShell();

// Use shell components and utilities
import { RoleWrapper } from './shell/wrappers';
import { LayoutContract } from './shell/contracts';
```

## Validation

All shell components must pass:
- TypeScript compilation
- ESLint validation
- Unit tests
- Runtime validation
- Performance tests 