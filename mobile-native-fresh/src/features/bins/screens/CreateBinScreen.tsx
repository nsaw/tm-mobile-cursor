import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, Alert } from 'react-native';

import { useBins } from '../../home/hooks/useBins';

const CreateBinScreen: React.FC = () => {
  const { createBin } = useBins();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleConfirm = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter a bin name');
      return;
    }

    try {
      await createBin({ name: name.trim(), description: description.trim() });
      Alert.alert('Success', 'Bin created successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to create bin');
    }
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>
        Create New Bin
      </Text>

      <View style={{ marginBottom: 16 }}>
        <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 8 }}>
          Name
        </Text>
        <TextInput
          style={{
            borderWidth: 1,
            borderColor: '#ccc',
            borderRadius: 8,
            padding: 12,
            fontSize: 16,
          }}
          value={name}
          onChangeText={setName}
          placeholder="Enter bin name"
        />
      </View>

      <View style={{ marginBottom: 20 }}>
        <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 8 }}>
          Description (Optional)
        </Text>
        <TextInput
          style={{
            borderWidth: 1,
            borderColor: '#ccc',
            borderRadius: 8,
            padding: 12,
            fontSize: 16,
            height: 80,
            textAlignVertical: 'top',
          }}
          value={description}
          onChangeText={setDescription}
          placeholder="Enter description"
          multiline
          numberOfLines={4}
        />
      </View>

      <Pressable
        onPress={handleConfirm}
        style={{
          backgroundColor: '#007AFF',
          padding: 16,
          borderRadius: 8,
          alignItems: 'center',
        }}
       accessibilityRole="button" accessible={true} accessibilityLabel="Button">
        <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>
          Create Bin
        </Text>
      </Pressable>
    </View>
  );
};

export default CreateBinScreen; 