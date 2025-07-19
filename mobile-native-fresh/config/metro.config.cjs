// Learn more: https://docs.expo.dev/guides/customizing-metro/
const { getDefaultConfig } = require('@expo/metro-config');

const defaultConfig = getDefaultConfig(__dirname);

defaultConfig.resolver.sourceExts.push('cjs');
defaultConfig.resolver.unstable_enablePackageExports = false;

// Exclude clone directories from Metro bundling
defaultConfig.resolver.blockList = [
  /tm-mobile-clone\/.*/,
  /reference\/.*/,
  /ios bak\/.*/,
];

module.exports = defaultConfig; 