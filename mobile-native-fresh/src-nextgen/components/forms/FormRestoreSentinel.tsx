import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { AutoRoleView } from '../AutoRoleView';

interface FormRestoreSentinelProps {
  formKey: string;
  environment: 'legacy' | 'nextgen';
  onStateRestored?: (state: any) => void;
  onStateSaved?: (state: any) => void;
  children: React.ReactNode;
  autoRestore?: boolean;
  autoSave?: boolean;
  saveInterval?: number; // milliseconds
  maxAge?: number; // milliseconds, default 24 hours
}

interface SavedFormState {
  state: any;
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
  saveInterval = 500, // 500ms
  maxAge = 24 * 60 * 60 * 1000, // 24 hours
}) => {
  const [isRestoring, setIsRestoring] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSavedState, setLastSavedState] = useState<any>(null);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastStateRef = useRef<any>(null);

  // Generate storage key for this form
  const getStorageKey = () => `form-sentinel-${environment}-${formKey}`;

  // Save form state to localStorage
  const saveFormState = (state: any) => {
    if (!autoSave || !state) return;

    try {
      const savedState: SavedFormState = {
        state,
        timestamp: Date.now(),
        environment,
        formKey,
      };

      const storageKey = getStorageKey();
      localStorage.setItem(storageKey, JSON.stringify(savedState));
      
      setLastSavedState(state);
      setIsSaving(true);
      
      // Notify parent component
      onStateSaved?.(state);
      
      // Reset saving indicator after a short delay
      setTimeout(() => setIsSaving(false), 100);
      
    } catch (error) {
      console.warn('FormRestoreSentinel: Failed to save form state:', error);
    }
  };

  // Load form state from localStorage
  const loadFormState = (): any | null => {
    try {
      const storageKey = getStorageKey();
      const saved = localStorage.getItem(storageKey);
      
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
        localStorage.removeItem(storageKey);
        return null;
      }

      return parsed.state;
    } catch (error) {
      console.warn('FormRestoreSentinel: Failed to load form state:', error);
      return null;
    }
  };

  // Clear saved form state
  const clearFormState = () => {
    try {
      const storageKey = getStorageKey();
      localStorage.removeItem(storageKey);
      setLastSavedState(null);
      console.log('FormRestoreSentinel: Cleared saved form state');
    } catch (error) {
      console.warn('FormRestoreSentinel: Failed to clear form state:', error);
    }
  };

  // Restore form state
  const restoreFormState = () => {
    if (!autoRestore) return;

    setIsRestoring(true);
    
    try {
      const savedState = loadFormState();
      
      if (savedState) {
        setLastSavedState(savedState);
        onStateRestored?.(savedState);
        
        // Show restoration notification
        Alert.alert(
          'Form Restored',
          'Your previous form data has been restored.',
          [{ text: 'OK' }]
        );
        
        console.log('FormRestoreSentinel: Form state restored successfully');
      }
    } catch (error) {
      console.warn('FormRestoreSentinel: Failed to restore form state:', error);
    } finally {
      setIsRestoring(false);
    }
  };

  // Debounced save function
  const debouncedSave = (state: any) => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      if (JSON.stringify(state) !== JSON.stringify(lastStateRef.current)) {
        saveFormState(state);
        lastStateRef.current = state;
      }
    }, saveInterval);
  };

  // Auto-restore on mount
  useEffect(() => {
    if (autoRestore) {
      restoreFormState();
    }
  }, [autoRestore]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  // Expose methods to parent components
  React.useImperativeHandle(React.useRef(), () => ({
    saveFormState,
    loadFormState,
    clearFormState,
    restoreFormState,
  }));

  return (
    <AutoRoleView role="form-restore-sentinel" style={styles.container}>
      {/* Status indicator */}
      {(isRestoring || isSaving) && (
        <AutoRoleView role="form-sentinel-status" style={styles.statusContainer}>
          <Text style={styles.statusText}>
            {isRestoring ? '🔄 Restoring form data...' : '💾 Saving form data...'}
          </Text>
        </AutoRoleView>
      )}

      {/* Form content */}
      <AutoRoleView role="form-sentinel-content" style={styles.contentContainer}>
        {children}
      </AutoRoleView>

      {/* Debug information (only in development) */}
      {__DEV__ && (
        <AutoRoleView role="form-sentinel-debug" style={styles.debugContainer}>
          <Text style={styles.debugText}>
            Form: {formKey} | Environment: {environment}
          </Text>
          <Text style={styles.debugText}>
            Auto-restore: {autoRestore ? '✅' : '❌'} | Auto-save: {autoSave ? '✅' : '❌'}
          </Text>
          {lastSavedState && (
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
  formState: any
) => {
  const [restoredState, setRestoredState] = useState<any>(null);
  const [isRestored, setIsRestored] = useState(false);

  const handleStateRestored = (state: any) => {
    setRestoredState(state);
    setIsRestored(true);
  };

  const handleStateSaved = (state: any) => {
    // Optional: Handle save events
  };

  const sentinelRef = useRef<any>(null);

  // Auto-save form state when it changes
  useEffect(() => {
    if (formState && sentinelRef.current) {
      sentinelRef.current.saveFormState(formState);
    }
  }, [formState]);

  return {
    FormRestoreSentinel: (
      <FormRestoreSentinel
        ref={sentinelRef}
        formKey={formKey}
        environment={environment}
        onStateRestored={handleStateRestored}
        onStateSaved={handleStateSaved}
        autoRestore={true}
        autoSave={true}
      >
        {/* This will be replaced by actual form content */}
      </FormRestoreSentinel>
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