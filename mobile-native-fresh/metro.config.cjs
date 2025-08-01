/* eslint-env node */
// @ts-check
const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

/** @type {import('metro-config').Config} */
const defaultConfig = getDefaultConfig(__dirname);

// Preserve any aliases already defined by Expo.
const baseAliases = defaultConfig.resolver.alias || {};

module.exports = {
  ...defaultConfig,
  resolver: {
    ...defaultConfig.resolver,
    alias: {
      ...baseAliases,
      // Primary alias → src-reference root
      '@legacy': path.join(__dirname, 'src-reference'),
      '@legacy/*': path.join(__dirname, 'src-reference/*')
    },
    extraNodeModules: new Proxy({}, {
      get: (_, name) => path.join(__dirname, 'src-reference', name)
    })
  }
}; 