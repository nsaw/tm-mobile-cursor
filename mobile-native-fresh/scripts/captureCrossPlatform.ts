import { capturePlatformScreenshots } from '../utils/snapshot-platform';

(async () => {
  await capturePlatformScreenshots('ios');
  await capturePlatformScreenshots('android');
  console.log('[VISUAL TEST] Cross-platform capture complete');
})(); 