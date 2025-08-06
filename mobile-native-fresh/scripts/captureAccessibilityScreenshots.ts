import { captureA11yScreens } from '../utils/snapshot-a11y';

(async () => {
  await captureA11yScreens();
  console.log('[A11Y VISUAL TEST] Accessibility snapshot complete');
})(); 