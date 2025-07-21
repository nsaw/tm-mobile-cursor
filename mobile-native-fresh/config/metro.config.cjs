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

// Performance optimizations
defaultConfig.transformer.minifierConfig = {
  mangle: {
    keep_fnames: true,
  },
  output: {
    ascii_only: true,
    quote_style: 3,
    wrap_iife: true,
  },
  sourceMap: {
    includeSources: false,
  },
  toplevel: false,
  compress: {
    reduce_funcs: false,
  },
};

// Memory optimizations
defaultConfig.server = {
  ...defaultConfig.server,
  enhanceMiddleware: (middleware, server) => {
    return (req, res, next) => {
      // Add cache headers for better performance
      res.setHeader('Cache-Control', 'public, max-age=31536000');
      return middleware(req, res, next);
    };
  },
};

// Optimize resolver for faster module resolution
defaultConfig.resolver.platforms = ['ios', 'android', 'native', 'web'];
defaultConfig.resolver.unstable_enableSymlinks = false;

module.exports = defaultConfig; 