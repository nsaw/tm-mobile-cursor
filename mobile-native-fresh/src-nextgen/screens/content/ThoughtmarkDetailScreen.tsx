import React, { useState, useCallback, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  Pressable, 
  Alert, 
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';

import { AutoRoleView } from '../../components/AutoRoleView';
import { useTheme } from '../../hooks/useTheme';
import { SecurityManager } from '../../utils/SecurityManager';
import { ValidationSystem } from '../../utils/ValidationSystem';
import performanceMonitor from '../../utils/PerformanceMonitor';
import { ErrorBoundary } from '../../components/ErrorBoundary';

interface ThoughtmarkData {
  id: string;
  title: string;
  content: string;
  tags: string[];
  notes: string;
  createdAt: string;
  updatedAt: string;
  author: string;
  isPublic: boolean;
  viewCount: number;
  likeCount: number;
}

interface ThoughtmarkDetailScreenProps {
  route?: {
    params?: {
      thoughtmarkId?: string;
    };
  };
}

interface EditableFieldProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  multiline?: boolean;
  numberOfLines?: number;
  maxLength?: number;
  placeholder?: string;
  accessibilityLabel: string;
  validationError?: string;
  theme: any;
  isEditing: boolean;
  onSave?: () => void;
  onCancel?: () => void;
}

const EditableField: React.FC<EditableFieldProps> = React.memo(({
  label,
  value,
  onChangeText,
  multiline = false,
  numberOfLines = 1,
  maxLength,
  placeholder,
  accessibilityLabel,
  validationError,
  theme,
  isEditing,
  onSave,
  onCancel,
}) => {
  const [isEditingLocal, setIsEditingLocal] = useState(false);
  const [localValue, setLocalValue] = useState(value);
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleEdit = useCallback(() => {
    setIsEditingLocal(true);
    setTimeout(() => inputRef.current?.focus(), 100);
  }, []);

  const handleSave = useCallback(() => {
    if (localValue.trim() !== value.trim()) {
      onChangeText(localValue.trim());
      onSave?.();
    }
    setIsEditingLocal(false);
  }, [localValue, value, onChangeText, onSave]);

  const handleCancel = useCallback(() => {
    setLocalValue(value);
    setIsEditingLocal(false);
    onCancel?.();
  }, [value, onCancel]);

  const isCurrentlyEditing = isEditing || isEditingLocal;

  return (
    <View style={theme.styles.fieldContainer}>
      <View style={theme.styles.fieldHeader}>
        <Text style={theme.styles.fieldLabel}>{label}</Text>
        {!isCurrentlyEditing && (
          <Pressable
            onPress={handleEdit}
            style={theme.styles.editButton}
            accessibilityRole="button"
            accessibilityLabel={`Edit ${label.toLowerCase()}`}
          >
            <Text style={theme.styles.editButtonText}>✏️</Text>
          </Pressable>
        )}
      </View>
      
      {isCurrentlyEditing ? (
        <View style={theme.styles.editingContainer}>
          <TextInput
            ref={inputRef}
            value={localValue}
            onChangeText={setLocalValue}
            style={[
              theme.styles.input,
              multiline && theme.styles.multilineInput,
              validationError && theme.styles.inputError
            ]}
            placeholder={placeholder}
            multiline={multiline}
            numberOfLines={numberOfLines}
            maxLength={maxLength}
            accessibilityLabel={accessibilityLabel}
            accessibilityHint="Double tap to edit"
            returnKeyType={multiline ? "default" : "done"}
            onSubmitEditing={handleSave}
            blurOnSubmit={!multiline}
          />
          {validationError && (
            <Text style={theme.styles.errorText}>{validationError}</Text>
          )}
          <View style={theme.styles.editActions}>
            <Pressable
              onPress={handleSave}
              style={theme.styles.saveButton}
              accessibilityRole="button"
              accessibilityLabel="Save changes"
            >
              <Text style={theme.styles.saveButtonText}>Save</Text>
            </Pressable>
            <Pressable
              onPress={handleCancel}
              style={theme.styles.cancelButton}
              accessibilityRole="button"
              accessibilityLabel="Cancel changes"
            >
              <Text style={theme.styles.cancelButtonText}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      ) : (
        <View style={theme.styles.displayContainer}>
          <Text style={theme.styles.displayText} numberOfLines={multiline ? undefined : 1}>
            {value || placeholder || 'No content'}
          </Text>
        </View>
      )}
    </View>
  );
});

const ThoughtmarkDetailScreen: React.FC<ThoughtmarkDetailScreenProps> = ({ route }) => {
  const themeState = useTheme();
  const [thoughtmark, setThoughtmark] = useState<ThoughtmarkData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  
  const securityManager = SecurityManager.getInstance();
  const validationSystem = ValidationSystem.getInstance();
  const performanceMonitorInstance = performanceMonitor;
  
  const thoughtmarkId = route?.params?.thoughtmarkId || 'default-id';

  // Load thoughtmark data
  useEffect(() => {
    const loadThoughtmark = async () => {
      try {
        performanceMonitor.recordComponentRender('ThoughtmarkDetailScreen', 'nextgen');
        
        // Validate user permissions (stub)
        const hasPermission = true; // TODO: Implement actual permission validation
        if (!hasPermission) {
          throw new Error('Insufficient permissions to view thoughtmark');
        }

        // Validate thoughtmark ID (stub)
        const isValidId = thoughtmarkId && thoughtmarkId.length > 0;
        if (!isValidId) {
          throw new Error('Invalid thoughtmark ID provided');
        }

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const mockThoughtmark: ThoughtmarkData = {
          id: thoughtmarkId,
          title: 'Why slow thinking works',
          content: 'Deep thinking requires time and focus...',
          tags: ['cognition', 'psychology', 'productivity'],
          notes: 'Important insights about cognitive processes and decision making.',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
          author: 'John Doe',
          isPublic: true,
          viewCount: 1250,
          likeCount: 89,
        };
        
        setThoughtmark(mockThoughtmark);
        console.log('[Performance] Thoughtmark loaded:', { thoughtmarkId });
      } catch (error) {
        console.error('Failed to load thoughtmark:', error);
        setError(error instanceof Error ? error.message : 'Failed to load thoughtmark');
        console.error('[Performance] Error loading thoughtmark:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadThoughtmark();
  }, [thoughtmarkId, securityManager, validationSystem, performanceMonitor]);

  // Warn about unsaved changes
  useEffect(() => {
    if (hasUnsavedChanges) {
      const handleBeforeUnload = (e: BeforeUnloadEvent) => {
        e.preventDefault();
        e.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
        return e.returnValue;
      };

      window.addEventListener('beforeunload', handleBeforeUnload);
      return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }
  }, [hasUnsavedChanges]);

  const validateField = useCallback((field: string, value: string): string | null => {
    try {
      // Basic validation (stub)
      if (!value || value.trim().length === 0) {
        return `${field} cannot be empty`;
      }
      return null;
    } catch (error) {
      console.error('Validation error:', error);
      return 'Validation failed';
    }
  }, []);

  const handleFieldChange = useCallback((field: keyof ThoughtmarkData, value: string) => {
    if (!thoughtmark) return;

    // Validate field
    const error = validateField(field, value);
    setValidationErrors(prev => ({
      ...prev,
      [field]: error || '',
    }));

    // Update thoughtmark
    setThoughtmark(prev => prev ? { ...prev, [field]: value } : null);
    setHasUnsavedChanges(true);
  }, [thoughtmark, validateField]);

  const handleSave = useCallback(async () => {
    if (!thoughtmark) return;

    try {
      setIsSaving(true);
      setError(null);

      // Check for validation errors
      const hasErrors = Object.values(validationErrors).some(error => error.length > 0);
      if (hasErrors) {
        throw new Error('Please fix validation errors before saving');
      }

      // Validate user permissions (stub)
      const hasPermission = true; // TODO: Implement actual permission validation
      if (!hasPermission) {
        throw new Error('Insufficient permissions to update thoughtmark');
      }

      // Record performance start
      const startTime = performance.now();

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Record API call performance
      console.log('[Performance] API call: updateThoughtmark', performance.now() - startTime);

      // Update local state
      setThoughtmark(prev => prev ? { ...prev, updatedAt: new Date().toISOString() } : null);
      setHasUnsavedChanges(false);
      setValidationErrors({});

      // Record successful save
      console.log('[Performance] User action: thoughtmark_saved', { thoughtmarkId });

      Alert.alert('Success', 'Thoughtmark updated successfully');
    } catch (error) {
      console.error('Failed to save thoughtmark:', error);
      setError(error instanceof Error ? error.message : 'Failed to save thoughtmark');
      console.error('[Performance] Error in ThoughtmarkDetailScreen:', error);
      Alert.alert('Error', error instanceof Error ? error.message : 'Failed to save thoughtmark');
    } finally {
      setIsSaving(false);
    }
  }, [thoughtmark, validationErrors, securityManager, performanceMonitor, thoughtmarkId]);

  const formatDate = useCallback((dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch (error) {
      console.warn('Failed to format date:', error);
      return 'Unknown date';
    }
  }, []);

  const formatTags = useCallback((tags: string[]) => {
    return tags.join(', ');
  }, []);

  if (isLoading) {
    return (
      <ErrorBoundary>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: themeState.colors.background }}>
          <ActivityIndicator size="large" color={themeState.colors.primary} />
          <Text style={{ color: themeState.colors.text, marginTop: 16 }}>Loading thoughtmark...</Text>
        </View>
      </ErrorBoundary>
    );
  }

  if (error) {
    return (
      <ErrorBoundary>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: themeState.colors.background }}>
          <Text style={{ color: themeState.colors.error, textAlign: 'center', marginBottom: 16 }}>{error}</Text>
          <Pressable onPress={() => window.location.reload()} style={{ backgroundColor: themeState.colors.primary, padding: 12, borderRadius: 8 }}>
            <Text style={{ color: '#FFFFFF', textAlign: 'center' }}>Retry</Text>
          </Pressable>
        </View>
      </ErrorBoundary>
    );
  }

  if (!thoughtmark) {
    return (
      <ErrorBoundary>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: themeState.colors.background }}>
          <Text style={{ color: themeState.colors.textSecondary, textAlign: 'center' }}>Thoughtmark not found</Text>
        </View>
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          style={{ flex: 1, backgroundColor: themeState.colors.background }}
          contentContainerStyle={{ padding: 16 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <AutoRoleView style={{ flex: 1 }}>
            {/* Header */}
            <View style={{ marginBottom: 24 }}>
              <Text style={{ fontSize: 24, fontWeight: 'bold', color: themeState.colors.text, marginBottom: 8 }}>{thoughtmark.title}</Text>
              <View style={{ marginBottom: 16 }}>
                <Text style={{ color: themeState.colors.textSecondary, fontSize: 14 }}>
                  By {thoughtmark.author} • {formatDate(thoughtmark.createdAt)}
                </Text>
                <Text style={{ color: themeState.colors.textSecondary, fontSize: 14 }}>
                  {thoughtmark.viewCount} views • {thoughtmark.likeCount} likes
                </Text>
              </View>
            </View>

            {/* Content */}
            <View style={{ marginBottom: 24 }}>
              <Text style={{ color: themeState.colors.text, fontSize: 16, lineHeight: 24 }}>{thoughtmark.content}</Text>
            </View>

            {/* Editable Fields */}
            <View style={{ marginBottom: 24 }}>
              <EditableField
                label="Title"
                value={thoughtmark.title}
                onChangeText={(value) => handleFieldChange('title', value)}
                placeholder="Enter thoughtmark title"
                accessibilityLabel="Edit thoughtmark title"
                validationError={validationErrors.title}
                theme={themeState}
                isEditing={false}
                maxLength={200}
              />

              <EditableField
                label="Tags"
                value={formatTags(thoughtmark.tags)}
                onChangeText={(value) => handleFieldChange('tags', value)}
                placeholder="Enter tags separated by commas"
                accessibilityLabel="Edit thoughtmark tags"
                validationError={validationErrors.tags}
                theme={themeState}
                isEditing={false}
                maxLength={500}
              />

              <EditableField
                label="Notes"
                value={thoughtmark.notes}
                onChangeText={(value) => handleFieldChange('notes', value)}
                placeholder="Add your notes here"
                accessibilityLabel="Edit thoughtmark notes"
                validationError={validationErrors.notes}
                theme={themeState}
                isEditing={false}
                multiline
                numberOfLines={5}
                maxLength={2000}
              />
            </View>

            {/* Actions */}
            <View style={{ marginTop: 24 }}>
              <Pressable
                onPress={handleSave}
                disabled={isSaving || !hasUnsavedChanges}
                style={[
                  { 
                    backgroundColor: themeState.colors.primary, 
                    padding: 16, 
                    borderRadius: 8, 
                    alignItems: 'center',
                    opacity: isSaving || !hasUnsavedChanges ? 0.6 : 1 
                  }
                ]}
                accessibilityRole="button"
                accessibilityLabel="Save thoughtmark changes"
                accessibilityState={{ disabled: isSaving || !hasUnsavedChanges }}
              >
                {isSaving ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' }}>Save Changes</Text>
                )}
              </Pressable>
            </View>
          </AutoRoleView>
        </ScrollView>
      </KeyboardAvoidingView>
    </ErrorBoundary>
  );
};

export default withPerformanceMonitoring(ThoughtmarkDetailScreen, 'ThoughtmarkDetailScreen', 'nextgen'); 