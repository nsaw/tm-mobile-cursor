import React, { useState, useRef } from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../theme/ThemeProvider';
import { AutoRoleView } from '../components/AutoRoleView';

interface ProfileScreenProps {
  _route: Record<string, unknown>;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ _route }) => {
  const theme = useTheme();
  const editButtonRef = useRef<TouchableOpacity>(null);
  const [profile] = useState({
    name: 'John Doe',
    email: 'john@example.com',
    avatar: 'https://via.placeholder.com/100'
  });

  useFocusEffect(() => {
    // Focus the edit button when screen comes into focus
    editButtonRef.current?.focus();
  });

  const handleEditProfile = () => {
    // Profile editing logic
    console.log('Edit profile clicked');
  };

  return (
    <AutoRoleView componentRole="screen" style={styles.container}>
      <Text style={[styles.title, { color: theme.colors.text }]}>
        Profile
      </Text>
      <Text style={[styles.name, { color: theme.colors.text }]}>
        {profile.name}
      </Text>
      <Text style={[styles.email, { color: theme.colors.textSecondary }]}>
        {profile.email}
      </Text>
      <TouchableOpacity
        ref={editButtonRef}
        style={[styles.editButton, { backgroundColor: theme.colors.primary }]}
        onPress={handleEditProfile}
        accessibilityRole="button" 
        accessible={true} 
        accessibilityLabel="Edit profile button">
        <Text style={[styles.editButtonText, { color: theme.colors.onPrimary }]}>
          Edit Profile
        </Text>
      </TouchableOpacity>
    </AutoRoleView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  name: {
    fontSize: 18,
    marginBottom: 10,
  },
  email: {
    fontSize: 16,
    marginBottom: 30,
  },
  editButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  editButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ProfileScreen; 