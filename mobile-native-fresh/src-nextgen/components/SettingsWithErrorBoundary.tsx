import React from 'react';
import { ErrorBoundary, ErrorFallback } from './ErrorBoundary';
import SettingsScreen from '../screens/SettingsScreen';

// Error Boundary Optimization — More targeted fallback UI + scoped error contexts
export const SettingsWithErrorBoundary: React.FC = () => {
  return (
    <ErrorBoundary fallback={<ErrorFallback error={null} onReset={() => {}} />}>
      <SettingsScreen />
    </ErrorBoundary>
  );
};

export default SettingsWithErrorBoundary; 