import { runEndToEndTests } from '../utils/e2e-tests';

(async () => {
  const e2eResults = await runEndToEndTests();
  console.log('[E2E TEST] Tests completed:', e2eResults.total);
  console.log('[E2E TEST] Passed:', e2eResults.passed);
  console.log('[E2E TEST] Failed:', e2eResults.failed);
  e2eResults.failed.forEach(test => console.log(`[E2E TEST] Failed: ${test.name} - ${test.error}`));
})();