import { comparePerformance } from '../utils/perf-regression';

(async () => {
  const results = await comparePerformance();
  console.log('[PERF REGRESSION] Tests completed:', results.total);
  console.log('[PERF REGRESSION] Regressions found:', results.regressions);
  results.regressions.forEach(r => console.log(`[PERF REGRESSION] ${r.metric}: ${r.degradation}%`));
})(); 