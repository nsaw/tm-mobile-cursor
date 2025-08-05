import React from 'react';
import { ErrorBoundary, ErrorFallback } from './ErrorBoundary';
import SettingsScreen from '../screens/SettingsScreen';

// Error Boundary Optimization — More targeted fallback UI + scoped error contexts
export const SettingsWithErrorBoundary: React.FC = () => {
  const handleRetry = (): void => {
    // Retry logic would go here
  };

  const handleReport = (): void => {
    // Report logic would go here
  };

  return (
    <ErrorBoundary fallback={<ErrorFallback error={null} onRetry={handleRetry} onReport={handleReport} />}>
      <SettingsScreen />
    </ErrorBoundary>
  );
};

export default SettingsWithErrorBoundary; 