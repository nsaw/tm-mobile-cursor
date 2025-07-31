import React, { useState, useCallback } from 'react';
import { View, TextInput, Text, TouchableOpacity, ScrollView } from 'react-native';
import { AutoRoleView } from '../../components/AutoRoleView';
import { useThemeWithStyles } from '../../hooks/useThemeWithStyles';
import { withPerformanceMonitoring } from '../../utils/PerformanceMonitor';

interface ThoughtmarkDetailScreenProps {
  thoughtmarkId: string;
}

const ThoughtmarkDetailScreen: React.FC<ThoughtmarkDetailScreenProps> = ({ thoughtmarkId }) => {
  const theme = useThemeWithStyles();
  const [isEditing, setIsEditing] = useState(false);
  const [fields, setFields] = useState({
    title: 'Sample Thoughtmark',
    content: 'This is a sample thoughtmark content...',
    tags: 'sample, demo, test',
    notes: 'Additional notes about this thoughtmark...',
  });

  const handleEdit = useCallback(() => {
    setIsEditing(true);
  }, []);

  const handleSave = useCallback(() => {
    setIsEditing(false);
    // Future: save to backend
  }, []);

  const handleFieldChange = useCallback((field: string, value: string) => {
    setFields(prev => ({ ...prev, [field]: value }));
  }, []);

  const renderField = (label: string, field: string, multiline = false) => (
    <View style={theme.styles.fieldContainer}>
      <View style={theme.styles.fieldHeader}>
        <Text style={theme.styles.fieldLabel}>{label}</Text>
        {!isEditing && (
          <TouchableOpacity onPress={handleEdit} style={theme.styles.editButton}>
            <Text style={theme.styles.editButtonText}>Edit</Text>
          </TouchableOpacity>
        )}
      </View>
      
      {isEditing ? (
        <View style={theme.styles.editingContainer}>
          <TextInput
            value={fields[field as keyof typeof fields]}
            onChangeText={(text) => handleFieldChange(field, text)}
            style={[theme.styles.input, multiline && theme.styles.multilineInput]}
            multiline={multiline}
            placeholder={`Enter ${label.toLowerCase()}...`}
            accessibilityLabel={`${label} input field`}
          />
        </View>
      ) : (
        <Text style={theme.styles.searchItemText}>
          {fields[field as keyof typeof fields]}
        </Text>
      )}
    </View>
  );

  return (
    <AutoRoleView style={theme.styles.screenContainer}>
      <ScrollView style={theme.styles.contentContainer}>
        {renderField('Title', 'title')}
        {renderField('Content', 'content', true)}
        {renderField('Tags', 'tags')}
        {renderField('Notes', 'notes', true)}
        
        {isEditing && (
          <TouchableOpacity onPress={handleSave} style={theme.styles.editButton}>
            <Text style={theme.styles.editButtonText}>Save Changes</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </AutoRoleView>
  );
};

export default withPerformanceMonitoring(ThoughtmarkDetailScreen, 'ThoughtmarkDetailScreen', 'nextgen'); 