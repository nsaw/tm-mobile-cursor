import React from 'react';
import { VoiceRecorderProvider, useVoiceRecorder } from '../components/ui/VoiceRecorderProvider';
import { ThemeProvider } from '../theme/ThemeProvider';
import { AuthProvider } from '../contexts/AuthContext';
import { AppStateProvider } from '../contexts/AppStateContext';
import { AuthFlowProvider } from '../contexts/AuthFlowContext';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// List of all required providers and their hooks
const REQUIRED_PROVIDERS = [
  {
    name: 'VoiceRecorderProvider',
    Provider: VoiceRecorderProvider,
    hook: useVoiceRecorder,
    requiredBy: ['DashboardScreen']
  },
  {
    name: 'ThemeProvider',
    Provider: ThemeProvider,
    requiredBy: ['*'] // Required by all screens
  },
  {
    name: 'AuthProvider',
    Provider: AuthProvider,
    requiredBy: ['*']
  },
  {
    name: 'AppStateProvider',
    Provider: AppStateProvider,
    requiredBy: ['*']
  },
  {
    name: 'AuthFlowProvider',
    Provider: AuthFlowProvider,
    requiredBy: ['*']
  },
  {
    name: 'NavigationContainer',
    Provider: NavigationContainer,
    requiredBy: ['*']
  },
  {
    name: 'SafeAreaProvider',
    Provider: SafeAreaProvider,
    requiredBy: ['*']
  }
];

// Provider order matters! This is the correct nesting order
const PROVIDER_ORDER = [
  'SafeAreaProvider',
  'NavigationContainer',
  'ThemeProvider',
  'AuthProvider',
  'AppStateProvider',
  'AuthFlowProvider',
  'VoiceRecorderProvider'
];

interface ProviderAuditResult {
  missingProviders: string[];
  wrongOrder: string[];
  unusedProviders: string[];
}

export const auditProviderUsage = (component: React.ComponentType): ProviderAuditResult => {
  const result: ProviderAuditResult = {
    missingProviders: [],
    wrongOrder: [],
    unusedProviders: []
  };

  // Check for missing required providers
  REQUIRED_PROVIDERS.forEach(({ name, requiredBy }) => {
    if (requiredBy.includes('*') || requiredBy.includes(component.name)) {
      try {
        // Try to find provider in component tree
        const found = false; // TODO: Implement tree traversal
        if (!found) {
          result.missingProviders.push(name);
        }
      } catch (error) {
        result.missingProviders.push(name);
      }
    }
  });

  // Check provider order
  const foundProviders = []; // TODO: Implement order checking
  PROVIDER_ORDER.forEach((provider, index) => {
    const foundIndex = foundProviders.indexOf(provider);
    if (foundIndex !== -1 && foundIndex !== index) {
      result.wrongOrder.push(
        `${provider} found at position ${foundIndex}, should be at ${index}`
      );
    }
  });

  // Check for unused providers
  REQUIRED_PROVIDERS.forEach(({ name, requiredBy }) => {
    if (!requiredBy.includes('*') && !requiredBy.includes(component.name)) {
      try {
        // Check if provider is unnecessarily present
        const found = false; // TODO: Implement presence check
        if (found) {
          result.unusedProviders.push(name);
        }
      } catch (error) {
        // Ignore errors when checking unused
      }
    }
  });

  return result;
};

// Example usage:
/*
const DashboardScreen = () => {
  const audit = auditProviderUsage(DashboardScreen);
  if (audit.missingProviders.length > 0) {
    console.error('Missing required providers:', audit.missingProviders);
  }
  if (audit.wrongOrder.length > 0) {
    console.error('Incorrect provider order:', audit.wrongOrder);
  }
  // ... rest of component
};
*/