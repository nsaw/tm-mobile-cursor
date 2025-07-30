declare const console: any;
import { useEffect } from 'react';

export const useStartupLogger = () => {
  useEffect(() => {
    console.log('[BOOT] App component mounted ✅');
    
    const navTimeout = setTimeout(() => {
      console.warn('[BOOT] ⚠️ No navigation progression after 10s');
    }, 10000);
    
    return () => clearTimeout(navTimeout);
  }, []);
}; 