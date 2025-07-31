module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended'
  ],
  // parserOptions.project removed to avoid type-aware RAM spike
  rules: {
    // project-specific overrides go here
  }
}; 