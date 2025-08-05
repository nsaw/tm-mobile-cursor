module.exports = {
  extends: ['../../.eslintrc.cjs'],
  rules: {
    // Disable unused vars for stub implementations that must match interfaces
    '@typescript-eslint/no-unused-vars': 'off',
    // Disable explicit module boundary types for service stubs
    '@typescript-eslint/explicit-module-boundary-types': 'off'
  }
}; 