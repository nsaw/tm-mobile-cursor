import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Organization } from '../types/organization';

interface OrganizationFormProps {
  organization?: Partial<Organization>;
  onSubmit: (data: Partial<Organization>) => void;
  onCancel: () => void;
  loading?: boolean;
}

export const OrganizationForm: React.FC<OrganizationFormProps> = ({
  organization,
  onSubmit,
  onCancel,
  loading = false,
}) => {
  const [formData, setFormData] = React.useState({
    name: organization?.name || '',
    description: organization?.description || '',
    website: organization?.website || '',
  });

  const handleSubmit = () => {
    if (!formData.name.trim()) {
      Alert.alert('Error', 'Organization name is required');
      return;
    }

    onSubmit(formData);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Basic Information</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Organization Name *</Text>
          <TextInput
            style={styles.input}
            value={formData.name}
            onChangeText={(text) => setFormData({ ...formData, name: text })}
            placeholder='Enter organization name'
            maxLength={100}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={formData.description}
            onChangeText={(text) => setFormData({ ...formData, description: text })}
            placeholder='Describe your organization'
            multiline
            numberOfLines={4}
            maxLength={500}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Website</Text>
          <TextInput
            style={styles.input}
            value={formData.website}
            onChangeText={(text) => setFormData({ ...formData, website: text })}
            placeholder='https://example.com'
            keyboardType='url'
            autoCapitalize='none'
          />
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.cancelButton]}
          onPress={onCancel}
          disabled={loading}
         accessibilityRole="button" accessible={true} accessibilityLabel="Button">
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.submitButton, loading && styles.disabledButton]}
          onPress={handleSubmit}
          disabled={loading}
         accessibilityRole="button" accessible={true} accessibilityLabel="Button">
          {loading ? (
            <Text style={styles.submitButtonText}>Saving...</Text>
          ) : (
            <Text style={styles.submitButtonText}>
              {organization ? 'Update' : 'Create'} Organization
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  section: {
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 12,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e1e5e9',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  buttonContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e1e5e9',
  },
  submitButton: {
    backgroundColor: '#007AFF',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666',
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#fff',
  },
});
