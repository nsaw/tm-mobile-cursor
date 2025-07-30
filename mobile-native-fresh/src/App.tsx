import React from 'react';
import { ThemeProvider } from './theme/ThemeProvider';
import { VisualRoot } from './VisualRoot';
declare const console: any;

const App: React.FC = () => {
  console.log('[BOOT] App component mounted ✅');

  return (
    <ThemeProvider>
      <VisualRoot />
    </ThemeProvider>
  );
};

export default App; 