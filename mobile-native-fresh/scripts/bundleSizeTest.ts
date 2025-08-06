import { analyzeBundleSize } from '../utils/bundle-analyzer';

(async () => {
  const bundleData = await analyzeBundleSize();
  console.log('[BUNDLE TEST] Total size:', bundleData.totalSize);
  console.log('[BUNDLE TEST] JS size:', bundleData.jsSize);
  console.log('[BUNDLE TEST] Assets size:', bundleData.assetsSize);
  console.log('[BUNDLE TEST] Largest modules:', bundleData.largestModules);
  bundleData.largestModules.forEach(module => console.log(`[BUNDLE TEST] ${module.name}: ${module.size}`));
})(); 