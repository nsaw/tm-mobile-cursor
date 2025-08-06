import { captureScreen } from '../utils/snapshot';
import { nextgenRoutes } from '../routes/nextgen';

(async () => {
  for (const route of nextgenRoutes) {
    await captureScreen(route, 'nextgen');
    console.log(`[VISUAL BASELINE] Captured nextgen screen: ${route}`);
  }
})(); 