/* eslint-disable @typescript-eslint/no-unused-vars, no-unused-vars */
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Text, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AutoRoleView } from '../AutoRoleView';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface FormRestoreSentinelProps {
  formKey: string;
  environment: 'legacy' | 'nextgen';
  onStateRestored?: (state: unknown) => void;
  onStateSaved?: (state: unknown) => void;
  children: React.ReactNode;
  autoRestore?: boolean;
  autoSave?: boolean;
  maxAge?: number; // milliseconds, default 24 hours
}

interface SavedFormState {
  state: unknown;
  timestamp: number;
  environment: string;
  formKey: string;
}

export const FormRestoreSentinel: React.FC<FormRestoreSentinelProps> = ({
  formKey,
  environment,
  onStateRestored,
  onStateSaved,
  children,
  autoRestore = true,
  autoSave = true,
  maxAge = 24 * 60 * 60 * 1000, // 24 hours
}) => {
  const [isRestoring, setIsRestoring] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSavedState, setLastSavedState] = useState<unknown>(null);
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Generate storage key for this form
  const getStorageKey = useCallback((): string => `form-sentinel-${environment}-${formKey}`, [environment, formKey]);

  // Save form state to AsyncStorage
  const saveFormState = useCallback(async (state: unknown): Promise<void> => {
    if (!autoSave || !state) return;

    try {
      const savedState: SavedFormState = {
        state,
        timestamp: Date.now(),
        environment,
        formKey,
      };

      const storageKey = getStorageKey();
      await AsyncStorage.setItem(storageKey, JSON.stringify(savedState));
      
      setLastSavedState(state);
      setIsSaving(true);
      
      // Notify parent component
      onStateSaved?.(state);
      
      // Reset saving indicator after a short delay
      setTimeout(() => setIsSaving(false), 100);
      
    } catch (error) {
      console.warn('FormRestoreSentinel: Failed to save form state:', error);
    }
  }, [autoSave, environment, formKey, getStorageKey, onStateSaved]);

  // Load form state from AsyncStorage
  const loadFormState = useCallback(async (): Promise<unknown | null> => {
    try {
      const storageKey = getStorageKey();
      const saved = await AsyncStorage.getItem(storageKey);
      
      if (!saved) return null;

      const parsed: SavedFormState = JSON.parse(saved);
      
      // Validate saved state
      if (parsed.environment !== environment || parsed.formKey !== formKey) {
        console.warn('FormRestoreSentinel: Saved state environment/formKey mismatch');
        return null;
      }

      // Check if state is too old
      if (Date.now() - parsed.timestamp > maxAge) {
        console.warn('FormRestoreSentinel: Saved state too old, clearing');
        await AsyncStorage.removeItem(storageKey);
        return null;
      }

      return parsed.state;
    } catch (error) {
      console.warn('FormRestoreSentinel: Failed to load form state:', error);
      return null;
    }
  }, [environment, formKey, getStorageKey, maxAge]);

  // Clear saved form state
  const clearFormState = useCallback(async (): Promise<void> => {
    try {
      const storageKey = getStorageKey();
      await AsyncStorage.removeItem(storageKey);
      setLastSavedState(null);
    } catch (error) {
      console.warn('FormRestoreSentinel: Failed to clear form state:', error);
    }
  }, [getStorageKey]);

  // Restore form state
  const restoreFormState = useCallback(async (): Promise<void> => {
    if (!autoRestore) return;

    setIsRestoring(true);
    try {
      const savedState = await loadFormState();
      if (savedState) {
        onStateRestored?.(savedState);
      }
    } catch (error) {
      console.warn('FormRestoreSentinel: Failed to restore form state:', error);
    } finally {
      setIsRestoring(false);
    }
  }, [autoRestore, loadFormState, onStateRestored]);

  // Auto-restore on mount
  useEffect(() => {
    if (autoRestore) {
      restoreFormState();
    }
  }, [autoRestore, restoreFormState]);

  // Cleanup on unmount
  useEffect(() => {
    const currentTimeout = saveTimeoutRef.current;
    return () => {
      if (currentTimeout) {
        clearTimeout(currentTimeout);
      }
    };
  }, []);

  // Expose methods to parent components
  const sentinelRef = React.useRef<{
    saveFormState: (state: unknown) => void;
    loadFormState: () => unknown;
    clearFormState: () => void;
    restoreFormState: () => void;
  }>(null);

  React.useImperativeHandle(sentinelRef, () => ({
    saveFormState,
    loadFormState,
    clearFormState,
    restoreFormState,
  }), [saveFormState, loadFormState, clearFormState, restoreFormState]);

  return (
    <AutoRoleView role="layout" style={styles.container}>
      {/* Status indicator */}
      {(isRestoring || isSaving) && (
        <AutoRoleView role="feedback" style={styles.statusContainer}>
          <Text style={styles.statusText}>
            {isRestoring ? '🔄 Restoring form data...' : '💾 Saving form data...'}
          </Text>
        </AutoRoleView>
      )}

      {/* Form content */}
      <AutoRoleView><Text>{children}</Text></AutoRoleView>

      {/* Debug information (only in development) */}
      {__DEV__ && (
        <AutoRoleView role="feedback" style={styles.debugContainer}>
          <Text style={styles.debugText}>
            Form: {formKey} | Environment: {environment}
          </Text>
          <Text style={styles.debugText}>
            Auto-restore: {autoRestore ? '✅' : '❌'} | Auto-save: {autoSave ? '✅' : '❌'}
          </Text>
          {lastSavedState !== null && (
            <Text style={styles.debugText}>
              Last saved: {new Date().toLocaleTimeString()}
            </Text>
          )}
        </AutoRoleView>
      )}
    </AutoRoleView>
  );
};

// Hook for easy integration with form components
export const useFormRestoreSentinel = (
  formKey: string,
  environment: 'legacy' | 'nextgen',
  formState: unknown
): {
  FormRestoreSentinel: React.ReactElement;
  restoredState: unknown;
  isRestored: boolean;
  clearSavedState: () => void;
  restoreState: () => void;
} => {
  const [restoredState, setRestoredState] = useState<unknown>(null);
  const [isRestored, setIsRestored] = useState(false);

  const handleStateRestored = (state: unknown): void => {
    setRestoredState(state);
    setIsRestored(true);
  };

  const handleStateSaved = (): void => {
    // Optional: Handle save events
  };

  const sentinelRef = useRef<{
    saveFormState: (state: unknown) => void;
    loadFormState: () => unknown;
    clearFormState: () => void;
    restoreFormState: () => void;
  }>(null);

  // Auto-save form state when it changes
  useEffect(() => {
    if (formState && sentinelRef.current) {
      sentinelRef.current.saveFormState(formState);
    }
  }, [formState]);

  return {
    FormRestoreSentinel: (
      <FormRestoreSentinel formKey={formKey} environment={environment}><Text>{/* This will be replaced by actual form content */}</Text></FormRestoreSentinel>
    ),
    restoredState,
    isRestored,
    clearSavedState: () => sentinelRef.current?.clearFormState(),
    restoreState: () => sentinelRef.current?.restoreFormState(),
  };
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  statusContainer: {
    backgroundColor: '#e3f2fd',
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#2196f3',
  },
  statusText: {
    fontSize: 12,
    color: '#1976d2',
    textAlign: 'center',
    fontWeight: '500',
  },
  contentContainer: {
    flex: 1,
  },
  debugContainer: {
    backgroundColor: '#f5f5f5',
    padding: 8,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  debugText: {
    fontSize: 10,
    color: '#666',
    fontFamily: 'monospace',
  },
}); 