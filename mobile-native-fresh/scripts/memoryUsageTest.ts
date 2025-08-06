import { monitorMemory } from '../utils/memory-monitor';

(async () => {
  const memoryData = await monitorMemory();
  console.log('[MEMORY TEST] Current usage:', memoryData.current);
  console.log('[MEMORY TEST] Peak usage:', memoryData.peak);
  console.log('[MEMORY TEST] Leaks detected:', memoryData.leaks);
  memoryData.leaks.forEach(leak => console.log(`[MEMORY TEST] Leak: ${leak.component} - ${leak.size}MB`));
})(); 