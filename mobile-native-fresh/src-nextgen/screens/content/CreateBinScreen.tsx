import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, Switch, ScrollView } from 'react-native';
import { AutoRoleView } from '../../shell/wrappers/AutoRoleView';
import { useTheme } from '../../theme/ThemeProvider';
import { useCreateBin } from '../../hooks/useCreateBin';

const CreateBinScreen: React.FC = () => {
  const { theme } = useTheme();
  const { createBin, isCreating } = useCreateBin();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [allowCollaboration, setAllowCollaboration] = useState(false);

  const handleCreate = async () => {
    if (!name.trim()) {
      return; // Don't create if name is empty
    }

    await createBin({
      name: name.trim(),
      description: description.trim(),
      isPublic,
      allowCollaboration,
    });
  };

  return (
    <AutoRoleView layoutRole="container-main" style={theme.styles.screenContainer}>
      <ScrollView>
        <Text style={theme.styles.createTitle}>Create New Bin</Text>
        
        <View style={theme.styles.formSection}>
          <Text style={theme.styles.label}>Bin Name *</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Enter bin name"
            style={theme.styles.input}
            maxLength={50}
          />
        </View>

        <View style={theme.styles.formSection}>
          <Text style={theme.styles.label}>Description</Text>
          <TextInput
            value={description}
            onChangeText={setDescription}
            placeholder="Enter description (optional)"
            style={theme.styles.textArea}
            multiline
            numberOfLines={4}
            maxLength={200}
          />
        </View>

        <View style={theme.styles.formSection}>
          <View style={theme.styles.switchRow}>
            <Text style={theme.styles.label}>Public Bin</Text>
            <Switch
              value={isPublic}
              onValueChange={setIsPublic}
              trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
            />
          </View>
          <Text style={theme.styles.helpText}>
            Public bins are visible to everyone
          </Text>
        </View>

        <View style={theme.styles.formSection}>
          <View style={theme.styles.switchRow}>
            <Text style={theme.styles.label}>Allow Collaboration</Text>
            <Switch
              value={allowCollaboration}
              onValueChange={setAllowCollaboration}
              trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
            />
          </View>
          <Text style={theme.styles.helpText}>
            Others can add thoughtmarks to this bin
          </Text>
        </View>

        <TouchableOpacity
          onPress={handleCreate}
          disabled={!name.trim() || isCreating}
          style={[
            theme.styles.createButton,
            (!name.trim() || isCreating) && theme.styles.createButtonDisabled
          ]}
        >
          <Text style={theme.styles.createButtonText}>
            {isCreating ? 'Creating...' : 'Create Bin'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </AutoRoleView>
  );
};

export default CreateBinScreen; 