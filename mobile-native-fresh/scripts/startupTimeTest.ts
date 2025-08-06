import { measureStartupTime } from '../utils/startup-monitor';

(async () => {
  const startupData = await measureStartupTime();
  console.log('[STARTUP TEST] Cold start:', startupData.coldStart);
  console.log('[STARTUP TEST] Warm start:', startupData.warmStart);
  console.log('[STARTUP TEST] Average:', startupData.average);
  console.log('[STARTUP TEST] Target met:', startupData.targetMet);
})(); 