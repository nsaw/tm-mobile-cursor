import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AutoRoleView } from '../components/AutoRoleView';
import { useTheme } from '../hooks/useTheme';
import { useAuth } from '../hooks/useAuth';

interface ProfileScreenProps {
  navigation?: any;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation }) => {
  const [profile, setProfile] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    avatar: 'https://via.placeholder.com/100',
    bio: 'Software developer passionate about creating amazing user experiences.',
    stats: {
      thoughts: 42,
      followers: 156,
      following: 89
    }
  });

  const [isEditing, setIsEditing] = useState(false);
  const theme = useTheme();
  const { user, signOut } = useAuth();
  const nav = useNavigation();

  useEffect(() => {
    // Load user profile data
    if (user) {
      setProfile(prev => ({
        ...prev,
        name: user.displayName || prev.name,
        email: user.email || prev.email,
        avatar: user.photoURL || prev.avatar
      }));
    }
  }, [user]);

  const handleEditProfile = () => {
    setIsEditing(true);
    nav.navigate('ProfileEdit');
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      nav.navigate('SignIn');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <AutoRoleView layoutRole="screen-container" style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <AutoRoleView layoutRole="header-section" style={styles.header}>
          <AutoRoleView layoutRole="avatar-container" style={styles.avatarContainer}>
            <Image 
              source={{ uri: profile.avatar }} 
              style={styles.avatar}
              resizeMode="cover"
            />
            <TouchableOpacity 
              style={styles.editAvatarButton}
              onPress={() => console.log('Edit avatar')}
            >
              <Text style={[styles.editAvatarText, { color: theme.colors.primary }]}>Edit</Text>
            </TouchableOpacity>
          </AutoRoleView>
          
          <AutoRoleView contentRole="profile-name" style={styles.nameContainer}>
            <Text style={[styles.name, { color: theme.colors.text }]}>{profile.name}</Text>
            <Text style={[styles.email, { color: theme.colors.textSecondary }]}>{profile.email}</Text>
          </AutoRoleView>
        </AutoRoleView>

        {/* Stats Section */}
        <AutoRoleView layoutRole="stats-section" style={styles.statsContainer}>
          <AutoRoleView layoutRole="stat-item" style={styles.statItem}>
            <Text style={[styles.statNumber, { color: theme.colors.text }]}>{profile.stats.thoughts}</Text>
            <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>Thoughts</Text>
          </AutoRoleView>
          
          <AutoRoleView layoutRole="stat-item" style={styles.statItem}>
            <Text style={[styles.statNumber, { color: theme.colors.text }]}>{profile.stats.followers}</Text>
            <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>Followers</Text>
          </AutoRoleView>
          
          <AutoRoleView layoutRole="stat-item" style={styles.statItem}>
            <Text style={[styles.statNumber, { color: theme.colors.text }]}>{profile.stats.following}</Text>
            <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>Following</Text>
          </AutoRoleView>
        </AutoRoleView>

        {/* Bio Section */}
        <AutoRoleView contentRole="profile-bio" style={styles.bioContainer}>
          <Text style={[styles.bioTitle, { color: theme.colors.text }]}>About</Text>
          <Text style={[styles.bioText, { color: theme.colors.textSecondary }]}>{profile.bio}</Text>
        </AutoRoleView>

        {/* Action Buttons */}
        <AutoRoleView layoutRole="action-buttons" style={styles.actionContainer}>
          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: theme.colors.primary }]}
            onPress={handleEditProfile}
          >
            <Text style={[styles.actionButtonText, { color: theme.colors.onPrimary }]}>
              Edit Profile
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: theme.colors.surface }]}
            onPress={() => nav.navigate('Settings')}
          >
            <Text style={[styles.actionButtonText, { color: theme.colors.text }]}>
              Settings
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: theme.colors.error }]}
            onPress={handleSignOut}
          >
            <Text style={[styles.actionButtonText, { color: theme.colors.onError }]}>
              Sign Out
            </Text>
          </TouchableOpacity>
        </AutoRoleView>
      </ScrollView>
    </AutoRoleView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 20,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 8,
  },
  editAvatarButton: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  editAvatarText: {
    fontSize: 12,
    fontWeight: '500',
  },
  nameContainer: {
    alignItems: 'center',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    opacity: 0.7,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    opacity: 0.7,
  },
  bioContainer: {
    padding: 20,
  },
  bioTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  bioText: {
    fontSize: 16,
    lineHeight: 24,
  },
  actionContainer: {
    padding: 20,
    gap: 12,
  },
  actionButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
});

export default ProfileScreen; 