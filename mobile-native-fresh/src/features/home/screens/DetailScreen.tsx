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

import { useTheme } from '../../../theme/ThemeProvider';
import { NavigationProp, RouteProp } from '../../../navigation/types';
import { useThoughtmarks } from '../hooks/useThoughtmarks';
import { useBins } from '../hooks/useBins';
import { useAuth } from '../../auth/hooks/useAuth';

export const DetailScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProp<'Detail'>>();
  const { thoughtmarkId } = route.params;
  const { thoughtmarks, updateThoughtmark, deleteThoughtmark } = useThoughtmarks();
  const { bins } = useBins();
  const { user } = useAuth();

  const thoughtmark = thoughtmarks.find(t => t.id === parseInt(thoughtmarkId));

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: designTokens.colors.background ?? '#0D0D0F',
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: designTokens.spacing.lg,
      paddingVertical: designTokens.spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: designTokens.colors.border ?? '#000',
    },
    backButton: {
      padding: designTokens.spacing.sm,
    },
    headerTitle: {
      fontSize: designTokens.typography.fontSize.heading,
      fontFamily: designTokens.typography.fontFamily.heading,
      fontWeight: designTokens.typography.fontWeight.bold,
      color: designTokens.colors.text ?? '#000',
      marginBottom: designTokens.spacing.md,
    },
    headerActions: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    actionButton: {
      padding: designTokens.spacing.sm,
      marginLeft: designTokens.spacing.xs,
    },
    content: {
      flex: 1,
      paddingHorizontal: designTokens.spacing.lg,
      paddingVertical: designTokens.spacing.md,
    },
    title: {
      fontSize: designTokens.typography.fontSize.body,
      fontFamily: designTokens.typography.fontFamily.body,
      color: designTokens.colors.text ?? '#000',
      marginBottom: designTokens.spacing.md,
    },
    contentText: {
      fontSize: designTokens.typography.fontSize.body,
      fontFamily: designTokens.typography.fontFamily.body,
      color: designTokens.colors.textSecondary ?? '#000',
      marginLeft: designTokens.spacing.xs,
      marginBottom: designTokens.spacing.md,
    },
    tagsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      backgroundColor: designTokens.colors.surface ?? '#000',
      paddingHorizontal: designTokens.spacing.sm,
      paddingVertical: designTokens.spacing.xs,
      borderRadius: designTokens.spacing.sm,
      marginRight: designTokens.spacing.xs,
      marginBottom: designTokens.spacing.xs,
    },
    tagText: {
      fontFamily: designTokens.typography.fontFamily.body,
      fontSize: designTokens.typography.fontSize.xs,
      color: designTokens.colors.textSecondary ?? '#000',
    },
    contentCard: {
      backgroundColor: designTokens.colors.surface ?? '#000',
      padding: designTokens.spacing.md,
      borderRadius: designTokens.spacing.md,
      marginBottom: designTokens.spacing.lg,
    },
    contentTitle: {
      fontSize: designTokens.typography.fontSize.body,
      fontFamily: designTokens.typography.fontFamily.body,
      color: designTokens.colors.text ?? '#000',
      marginLeft: designTokens.spacing.sm,
    },
    contentSubtitle: {
      fontFamily: designTokens.typography.fontFamily.body,
      fontSize: designTokens.typography.fontSize.sm,
      color: designTokens.colors.textSecondary ?? '#000',
    },
    footer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: designTokens.spacing.lg,
      paddingVertical: designTokens.spacing.md,
      borderTopWidth: 1,
      borderTopColor: designTokens.colors.border ?? '#000',
    },
    footerButton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: designTokens.spacing.sm,
    },
    footerButtonText: {
      fontSize: designTokens.typography.fontSize.body,
      fontFamily: designTokens.typography.fontFamily.body,
      color: designTokens.colors.danger ?? '#EF4444',
      marginLeft: designTokens.spacing.xs,
    },
    footerButtonText2: {
      fontSize: designTokens.typography.fontSize.body,
      fontFamily: designTokens.typography.fontFamily.body,
      color: designTokens.colors.danger ?? '#EF4444',
    },
    spacer: {
      marginTop: designTokens.spacing.xl,
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
    navigation.navigate('ThoughtmarkEdit', { thoughtmarkId: thoughtmark.id });
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

  const getBinName = (binId: number | undefined) => {
    if (!binId) return 'Unknown Bin';
    const bin = bins.find(b => b.id === binId);
    return bin?.name || 'Unknown Bin';
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => { navigation.goBack(); }}>
          <Ionicons name="arrow-back" size={24} color={designTokens.colors.text ?? '#000'} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>THOUGHTMARK</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.actionButton} onPress={handlePin} >
            <Ionicons name="pin" size={20} color={designTokens.colors.accent ?? '#000'} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={handleEdit} >
            <Ionicons name="create-outline" size={24} color={designTokens.colors.text ?? '#000'} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={handleShare} >
            <Ionicons name="share-outline" size={24} color={designTokens.colors.text ?? '#000'} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Content */}
      <ScrollView style={styles.content}>
        {/* Bin Info */}
        <View style={styles.contentCard}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name="folder-outline" size={16} color={designTokens.colors.textSecondary ?? '#000'} />
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
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: designTokens.spacing.lg }}>
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
                color={thoughtmark.isCompleted ? designTokens.colors.accent ?? '#000' : designTokens.colors.textSecondary ?? '#000'}
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
        <TouchableOpacity style={styles.footerButton} onPress={handleDelete} >
          <Ionicons name="trash-outline" size={20} color={designTokens.colors.danger ?? '#EF4444'} />
          <Text style={styles.footerButtonText}>Delete</Text>
        </TouchableOpacity>
        <View style={styles.spacer} />
      </View>
    </View>
  );
};