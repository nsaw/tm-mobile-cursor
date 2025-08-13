import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Organization } from '../types/organization';

interface OrganizationCardProps {
  organization: Organization;
  onPress?: () => void;
  showMemberCount?: boolean;
}

export const OrganizationCard: React.FC<OrganizationCardProps> = ({
  organization,
  onPress,
  showMemberCount = true,
}) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress} accessibilityRole="button" accessible={true} accessibilityLabel="Button">
      <View style={styles.header}>
        {organization.avatar ? (
          <Image source={{ uri: organization.avatar }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Ionicons name='business' size={24} color='#007AFF' />
          </View>
        )}
        <View style={styles.info}>
          <Text style={styles.name}>{organization.name}</Text>
          {organization.description && (
            <Text style={styles.description} numberOfLines={2}>
              {organization.description}
            </Text>
          )}
        </View>
        <Ionicons name='chevron-forward' size={20} color='#ccc' />
      </View>

      {showMemberCount && organization.memberCount !== undefined && (
        <View style={styles.footer}>
          <Ionicons name='people' size={16} color='#666' />
          <Text style={styles.memberCount}>
            {organization.memberCount} member{organization.memberCount !== 1 ? 's' : ''}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e1e5e9',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  avatarPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  info: {
    flex: 1,
    marginLeft: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  memberCount: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
});
