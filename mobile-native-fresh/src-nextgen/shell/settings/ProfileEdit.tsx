import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTheme } from '../../theme/ThemeProvider';
import { Button } from '../../components/ui/Button';
import { AutoRoleView } from '../../components/AutoRoleView';

interface ProfileData {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  bio: string;
}

export const ProfileEdit: React.FC = () => {
  const theme = useTheme();
  const { colors, spacing } = theme;
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData>({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    username: 'johndoe',
    bio: 'Software developer passionate about creating amazing user experiences.',
  });
  const [originalData, setOriginalData] = useState<ProfileData>({ ...profileData });

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scrollContent: {
      padding: spacing.xl,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: spacing.xl,
    },
    headerTitle: {
      fontSize: theme.fontSize.h1,
      fontWeight: theme.fontWeight.bold,
      color: theme.colors.text,
    },
    editButton: {
      padding: theme.spacing.sm,
      borderRadius: theme.spacing.sm,
      backgroundColor: theme.colors.accent,
    },
    profileSection: {
      alignItems: 'center',
      marginBottom: theme.spacing.xl,
    },
    avatarContainer: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: theme.colors.accent,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: theme.spacing.lg,
    },
    avatarText: {
      fontSize: theme.fontSize.h1,
      fontWeight: theme.fontWeight.bold,
      color: theme.colors.background,
    },
    formSection: {
      marginBottom: theme.spacing.xl,
    },
    sectionTitle: {
      fontSize: theme.fontSize.h2,
      fontWeight: theme.fontWeight.semibold,
      color: theme.colors.text,
      marginBottom: theme.spacing.md,
    },
    inputGroup: {
      marginBottom: theme.spacing.md,
    },
    label: {
      fontSize: theme.fontSize.caption,
      fontWeight: theme.fontWeight.medium,
      color: theme.colors.textMuted,
      marginBottom: theme.spacing.xs,
    },
    input: {
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.spacing.sm,
      padding: theme.spacing.md,
      fontSize: theme.fontSize.body,
      color: theme.colors.text,
      backgroundColor: theme.colors.surface,
    },
    textArea: {
      height: 100,
      textAlignVertical: 'top',
    },
    buttonRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: theme.spacing.xl,
    },
    saveButton: {
      flex: 1,
      marginRight: theme.spacing.sm,
      backgroundColor: theme.colors.accent,
    },
    cancelButton: {
      flex: 1,
      marginLeft: theme.spacing.sm,
      backgroundColor: theme.colors.error,
    },
    buttonText: {
      color: theme.colors.background,
      fontSize: theme.fontSize.body,
      fontWeight: theme.fontWeight.semibold,
    },
  });

  const handleEdit = () => {
    setOriginalData({ ...profileData });
    setIsEditing(true);
  };

  const handleSave = () => {
    // Validate required fields
    if (!profileData.firstName.trim() || !profileData.lastName.trim() || !profileData.email.trim()) {
      Alert.alert('Validation Error', 'Please fill in all required fields.');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(profileData.email)) {
      Alert.alert('Validation Error', 'Please enter a valid email address.');
      return;
    }

    // Here you would typically save to backend
    Alert.alert('Success', 'Profile updated successfully!');
    setIsEditing(false);
  };

  const handleCancel = () => {
    setProfileData({ ...originalData });
    setIsEditing(false);
  };

  const updateField = (field: keyof ProfileData, value: string) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <SafeAreaView style={styles.container}>
      <AutoRoleView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Edit Profile</Text>
            {!isEditing && (
              <Button 
                title="Edit" 
                onPress={handleEdit} 
                style={styles.editButton}
                textStyle={styles.buttonText}
              />
            )}
          </View>

          <View style={styles.profileSection}>
            <View style={styles.avatarContainer}>
              <Text style={styles.avatarText}>
                {profileData.firstName.charAt(0)}{profileData.lastName.charAt(0)}
              </Text>
            </View>
          </View>

          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>Personal Information</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>First Name *</Text>
              <TextInput
                style={styles.input}
                value={profileData.firstName}
                onChangeText={(value) => updateField('firstName', value)}
                editable={isEditing}
                placeholder="Enter first name"
                placeholderTextColor={colors.textMuted}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Last Name *</Text>
              <TextInput
                style={styles.input}
                value={profileData.lastName}
                onChangeText={(value) => updateField('lastName', value)}
                editable={isEditing}
                placeholder="Enter last name"
                placeholderTextColor={colors.textMuted}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email *</Text>
              <TextInput
                style={styles.input}
                value={profileData.email}
                onChangeText={(value) => updateField('email', value)}
                editable={isEditing}
                placeholder="Enter email address"
                placeholderTextColor={colors.textMuted}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Username</Text>
              <TextInput
                style={styles.input}
                value={profileData.username}
                onChangeText={(value) => updateField('username', value)}
                editable={isEditing}
                placeholder="Enter username"
                placeholderTextColor={colors.textMuted}
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Bio</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={profileData.bio}
                onChangeText={(value) => updateField('bio', value)}
                editable={isEditing}
                placeholder="Tell us about yourself..."
                placeholderTextColor={colors.textMuted}
                multiline
                numberOfLines={4}
              />
            </View>
          </View>

          {isEditing && (
            <View style={styles.buttonRow}>
              <Button 
                title="Save Changes" 
                onPress={handleSave} 
                style={styles.saveButton}
                textStyle={styles.buttonText}
              />
              <Button 
                title="Cancel" 
                onPress={handleCancel} 
                style={styles.cancelButton}
                textStyle={styles.buttonText}
              />
            </View>
          )}
        </ScrollView>
      </AutoRoleView>
    </SafeAreaView>
  );
}; 