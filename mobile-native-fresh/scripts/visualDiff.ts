import { compareScreenshots } from '../utils/visual-diff';

(async () => {
  const failed = await compareScreenshots('legacy', 'nextgen', 'diffs');
  console.log(`[VISUAL TEST] Total mismatches: ${failed.length}`);
  failed.forEach(f => console.log(`[VISUAL TEST] Mismatch on: ${f}`));
})(); 