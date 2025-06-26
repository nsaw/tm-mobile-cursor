import { Text ,
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '../../../navigation/types';

import { useTheme } from '../../../theme/ThemeProvider';
import { NavigationProp, RouteProp } from '../../../navigation/types';
import { useThoughtmarks } from '../hooks/useThoughtmarks';
import { useBins } from '../hooks/useBins';
import { useAuth } from '../../auth/hooks/useAuth';

export const DetailScreen: React.FC = () => {
  const { tokens } = useTheme();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList, 'ThoughtmarkDetail'>>();
  const route = useRoute<RouteProp<'ThoughtmarkDetail'>>();
  const { thoughtmarkId } = route.params;
  const { thoughtmarks, updateThoughtmark, deleteThoughtmark } = useThoughtmarks();
  const { bins } = useBins();
  const { user } = useAuth();

  const thoughtmark = thoughtmarks.find(t => String(t.id) === thoughtmarkId);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: tokens.colors.background ?? '#0D0D0F',
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: tokens.spacing.lg,
      paddingVertical: tokens.spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: tokens.colors.border ?? '#000',
    },
    backButton: {
      padding: tokens.spacing.sm,
    },
    headerTitle: {
      fontSize: tokens.typography.fontSize.heading,
      fontFamily: tokens.typography.fontFamily.heading,
      fontWeight: tokens.typography.fontWeight.bold,
      color: tokens.colors.text ?? '#000',
      marginBottom: tokens.spacing.md,
    },
    headerActions: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    actionButton: {
      padding: tokens.spacing.sm,
      marginLeft: tokens.spacing.xs,
    },
    content: {
      flex: 1,
      paddingHorizontal: tokens.spacing.lg,
      paddingVertical: tokens.spacing.md,
    },
    title: {
      fontSize: tokens.typography.fontSize.body,
      fontFamily: tokens.typography.fontFamily.body,
      color: tokens.colors.text ?? '#000',
      marginBottom: tokens.spacing.md,
    },
    contentText: {
      fontSize: tokens.typography.fontSize.body,
      fontFamily: tokens.typography.fontFamily.body,
      color: tokens.colors.textSecondary ?? '#000',
      marginLeft: tokens.spacing.xs,
      marginBottom: tokens.spacing.md,
    },
    tagsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      backgroundColor: tokens.colors.surface ?? '#000',
      paddingHorizontal: tokens.spacing.sm,
      paddingVertical: tokens.spacing.xs,
      borderRadius: tokens.spacing.sm,
      marginRight: tokens.spacing.xs,
      marginBottom: tokens.spacing.xs,
    },
    tagText: {
      fontFamily: tokens.typography.fontFamily.body,
      fontSize: tokens.typography.fontSize.xs,
      color: tokens.colors.textSecondary ?? '#000',
    },
    contentCard: {
      backgroundColor: tokens.colors.surface ?? '#000',
      padding: tokens.spacing.md,
      borderRadius: tokens.spacing.md,
      marginBottom: tokens.spacing.lg,
    },
    contentTitle: {
      fontSize: tokens.typography.fontSize.body,
      fontFamily: tokens.typography.fontFamily.body,
      color: tokens.colors.text ?? '#000',
      marginLeft: tokens.spacing.sm,
    },
    contentSubtitle: {
      fontFamily: tokens.typography.fontFamily.body,
      fontSize: tokens.typography.fontSize.sm,
      color: tokens.colors.textSecondary ?? '#000',
    },
    footer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: tokens.spacing.lg,
      paddingVertical: tokens.spacing.md,
      borderTopWidth: 1,
      borderTopColor: tokens.colors.border ?? '#000',
    },
    footerButton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: tokens.spacing.sm,
    },
    footerButtonText: {
      fontSize: tokens.typography.fontSize.body,
      fontFamily: tokens.typography.fontFamily.body,
      color: tokens.colors.danger ?? '#EF4444',
      marginLeft: tokens.spacing.xs,
    },
    footerButtonText2: {
      fontSize: tokens.typography.fontSize.body,
      fontFamily: tokens.typography.fontFamily.body,
      color: tokens.colors.danger ?? '#EF4444',
    },
    spacer: {
      marginTop: tokens.spacing.xl,
    },
  });

  if (!thoughtmark) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Thoughtmark not found</Text>
      </View>
    );
  }

  const handlePin = async () => {
    try {
      await updateThoughtmark(thoughtmark.id, { isPinned: !thoughtmark.isPinned });
    } catch (error) {
      Alert.alert('Error', 'Failed to update thoughtmark');
    }
  };

  const handleEdit = () => {
    navigation.navigate('UnifiedThoughtmark', { thoughtmarkId: thoughtmark.id.toString() });
  };

  const handleShare = () => {
    // Implement share functionality
    Alert.alert('Share', 'Share functionality coming soon');
  };

  const handleDelete = async () => {
    Alert.alert(
      'Delete Thoughtmark',
      'Are you sure you want to delete this thoughtmark?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteThoughtmark(thoughtmark.id);
              navigation.goBack();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete thoughtmark');
            }
          },
        },
      ]
    );
  };

  const getBinName = (binId: number) => {
    const bin = bins.find(b => b.id === binId);
    return bin?.name || 'Unknown Bin';
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={navigation.goBack}>
          <Ionicons name="arrow-back" size={24} color={tokens.colors.text ?? '#000'} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>THOUGHTMARK</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.actionButton} onPress={handlePin}>
            <Ionicons name="pin" size={20} color={tokens.colors.accent ?? '#000'} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={handleEdit}>
            <Ionicons name="create-outline" size={24} color={tokens.colors.text ?? '#000'} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
            <Ionicons name="share-outline" size={24} color={tokens.colors.text ?? '#000'} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Content */}
      <ScrollView style={styles.content}>
        {/* Bin Info */}
        <View style={styles.contentCard}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name="folder-outline" size={16} color={tokens.colors.textSecondary ?? '#000'} />
            <Text style={styles.contentTitle}>Bin: {getBinName(thoughtmark.binId)}</Text>
          </View>
        </View>

        {/* Title */}
        <Text style={styles.title}>{thoughtmark.title}</Text>

        {/* Content */}
        <View style={styles.contentCard}>
          <Text style={styles.contentSubtitle}>{thoughtmark.content}</Text>
        </View>

        {/* Tags */}
        {thoughtmark.tags && thoughtmark.tags.length > 0 && (
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: tokens.spacing.lg }}>
            {thoughtmark.tags.map((tag, index) => (
              <View key={index} style={styles.tagsContainer}>
                <Text style={styles.tagText}>#{tag}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Task Status */}
        {thoughtmark.isTask && (
          <View style={styles.contentCard}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Ionicons
                name={thoughtmark.isCompleted ? "checkmark-circle" : "ellipse-outline"}
                size={20}
                color={thoughtmark.isCompleted ? tokens.colors.accent ?? '#000' : tokens.colors.textSecondary ?? '#000'}
              />
              <Text style={styles.contentTitle}>
                {thoughtmark.isCompleted ? 'Completed' : 'Pending'}
              </Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.footerButton} onPress={handleDelete}>
          <Ionicons name="trash-outline" size={20} color={tokens.colors.danger ?? '#EF4444'} />
          <Text style={styles.footerButtonText}>Delete</Text>
        </TouchableOpacity>
        <View style={styles.spacer} />
      </View>
    </View>
  );
};