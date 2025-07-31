import React from 'react';
import { ThemeProvider } from './theme/ThemeProvider';
import { AuthProvider } from './features/auth/hooks/useAuth';
import HomeScreen from './screens/HomeScreen';
import { VisualRoot } from './VisualRoot';
declare const console: any;

const App: React.FC = () => {
  console.log('[BOOT] NextGen App component mounted ✅');

  return (
    <ThemeProvider>
      <AuthProvider>
        <VisualRoot />
        <HomeScreen />
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App; 