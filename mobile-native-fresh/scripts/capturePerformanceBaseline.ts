import { collectPerfMetrics } from '../utils/perf';

(async () => {
  const metrics = await collectPerfMetrics();
  console.log('[PERF BASELINE] Startup:', metrics.startupTime);
  console.log('[PERF BASELINE] JS thread (ms):', metrics.jsThreadTime);
  console.log('[PERF BASELINE] FPS:', metrics.fps);
  console.log('[PERF BASELINE] Memory (MB):', metrics.memory);
})(); 