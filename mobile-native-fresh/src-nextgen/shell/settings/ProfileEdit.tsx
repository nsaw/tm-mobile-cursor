import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { User, Edit, Save, X } from 'lucide-react-native';

import { useTheme } from '../../../theme/theme';
import { Button } from '../../../components/ui/Button';
import { AutoRoleView } from '../../../components/AutoRoleView';

interface ProfileData {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  bio: string;
}

export const ProfileEdit: React.FC = () => {
  const { colors, spacing, typography } = useTheme();
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
      fontSize: typography.sizes.xl,
      fontWeight: typography.weights.bold,
      color: colors.text,
    },
    editButton: {
      padding: spacing.sm,
      borderRadius: spacing.sm,
      backgroundColor: colors.accent,
    },
    profileSection: {
      alignItems: 'center',
      marginBottom: spacing.xl,
    },
    avatarContainer: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: colors.accentMuted,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: spacing.lg,
    },
    avatarText: {
      fontSize: typography.sizes.xl,
      fontWeight: typography.weights.bold,
      color: colors.background,
    },
    formSection: {
      marginBottom: spacing.xl,
    },
    sectionTitle: {
      fontSize: typography.sizes.lg,
      fontWeight: typography.weights.semibold,
      color: colors.text,
      marginBottom: spacing.md,
    },
    inputGroup: {
      marginBottom: spacing.md,
    },
    label: {
      fontSize: typography.sizes.sm,
      fontWeight: typography.weights.medium,
      color: colors.textMuted,
      marginBottom: spacing.xs,
    },
    input: {
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: spacing.sm,
      padding: spacing.md,
      fontSize: typography.sizes.md,
      color: colors.text,
      backgroundColor: colors.surface,
    },
    textArea: {
      height: 100,
      textAlignVertical: 'top',
    },
    buttonRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: spacing.xl,
    },
    saveButton: {
      flex: 1,
      marginRight: spacing.sm,
      backgroundColor: colors.accent,
    },
    cancelButton: {
      flex: 1,
      marginLeft: spacing.sm,
      backgroundColor: colors.error,
    },
    buttonText: {
      color: colors.background,
      fontSize: typography.sizes.md,
      fontWeight: typography.weights.semibold,
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
      <AutoRoleView layoutRole="screen" style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Edit Profile</Text>
            {!isEditing && (
              <Button onPress={handleEdit} style={styles.editButton}>
                <Edit size={20} color={colors.background} />
              </Button>
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
              <Button onPress={handleSave} style={styles.saveButton}>
                <Text style={styles.buttonText}>Save Changes</Text>
              </Button>
              <Button onPress={handleCancel} style={styles.cancelButton}>
                <Text style={styles.buttonText}>Cancel</Text>
              </Button>
            </View>
          )}
        </ScrollView>
      </AutoRoleView>
    </SafeAreaView>
  );
}; 