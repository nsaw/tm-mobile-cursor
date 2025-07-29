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
  const { tokens: designTokens } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProp<'Detail'>>();
  const { thoughtmarkId } = route.params;
  const { thoughtmarks, updateThoughtmark, deleteThoughtmark } = useThoughtmarks();
  const { bins } = useBins();
  const { user } = useAuth();

  const thoughtmark = thoughtmarks.find(t => t.id === parseInt(thoughtmarkId));

  const styles = StyleSheet.create({
    actionButton: {
      marginLeft: designTokens.spacing.xs,
      padding: designTokens.spacing.sm,
    },
    backButton: {
      padding: designTokens.spacing.sm,
    },
    container: {
      backgroundColor: designTokens.colors.background ?? '#0D0D0F',
      flex: 1,
    },
    content: {
      flex: 1,
      paddingHorizontal: designTokens.spacing.lg,
      paddingVertical: designTokens.spacing.md,
    },
    contentCard: {
      backgroundColor: designTokens.colors.surface ?? '#000',
      borderRadius: designTokens.spacing.md,
      marginBottom: designTokens.spacing.lg,
      padding: designTokens.spacing.md,
    },
    contentSubtitle: {
      color: designTokens.colors.textSecondary ?? '#000',
      fontFamily: designTokens.typography.fontFamily.body,
      fontSize: designTokens.typography.fontSize.sm,
    },
    contentText: {
      color: designTokens.colors.textSecondary ?? '#000',
      fontFamily: designTokens.typography.fontFamily.body,
      fontSize: designTokens.typography.fontSize.body,
      marginBottom: designTokens.spacing.md,
      marginLeft: designTokens.spacing.xs,
    },
    contentTitle: {
      color: designTokens.colors.text ?? '#000',
      fontFamily: designTokens.typography.fontFamily.body,
      fontSize: designTokens.typography.fontSize.body,
      marginLeft: designTokens.spacing.sm,
    },
    footer: {
      alignItems: 'center',
      borderTopColor: designTokens.colors.border ?? '#000',
      borderTopWidth: 1,
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: designTokens.spacing.lg,
      paddingVertical: designTokens.spacing.md,
    },
    footerButton: {
      alignItems: 'center',
      flexDirection: 'row',
      paddingVertical: designTokens.spacing.sm,
    },
    footerButtonText: {
      color: designTokens.colors.danger ?? '#EF4444',
      fontFamily: designTokens.typography.fontFamily.body,
      fontSize: designTokens.typography.fontSize.body,
      marginLeft: designTokens.spacing.xs,
    },
    footerButtonText2: {
      color: designTokens.colors.danger ?? '#EF4444',
      fontFamily: designTokens.typography.fontFamily.body,
      fontSize: designTokens.typography.fontSize.body,
    },
    header: {
      alignItems: 'center',
      borderBottomColor: designTokens.colors.border ?? '#000',
      borderBottomWidth: 1,
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: designTokens.spacing.lg,
      paddingVertical: designTokens.spacing.md,
    },
    headerActions: {
      alignItems: 'center',
      flexDirection: 'row',
    },
    headerTitle: {
      color: designTokens.colors.text ?? '#000',
      fontFamily: designTokens.typography.fontFamily.heading,
      fontSize: designTokens.typography.fontSize.heading,
      fontWeight: designTokens.typography.fontWeight.bold,
      marginBottom: designTokens.spacing.md,
    },
    spacer: {
      marginTop: designTokens.spacing.xl,
    },
    tagText: {
      color: designTokens.colors.textSecondary ?? '#000',
      fontFamily: designTokens.typography.fontFamily.body,
      fontSize: designTokens.typography.fontSize.xs,
    },
    tagsContainer: {
      backgroundColor: designTokens.colors.surface ?? '#000',
      borderRadius: designTokens.spacing.sm,
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginBottom: designTokens.spacing.xs,
      marginRight: designTokens.spacing.xs,
      paddingHorizontal: designTokens.spacing.sm,
      paddingVertical: designTokens.spacing.xs,
    },
    title: {
      color: designTokens.colors.text ?? '#000',
      fontFamily: designTokens.typography.fontFamily.body,
      fontSize: designTokens.typography.fontSize.body,
      marginBottom: designTokens.spacing.md,
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
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}
                accessibilityRole="button"
                accessible={true}
                accessibilityLabel="Button">
          <Ionicons name="arrow-back" size={24} color={designTokens.colors.text ?? '#000'} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>THOUGHTMARK</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.actionButton} onPress={handlePin} accessibilityRole="button" accessible={true} accessibilityLabel="Button">
            <Ionicons name="pin" size={20} color={designTokens.colors.accent ?? '#000'} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={handleEdit} accessibilityRole="button" accessible={true} accessibilityLabel="Button">
            <Ionicons name="create-outline" size={24} color={designTokens.colors.text ?? '#000'} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={handleShare} accessibilityRole="button" accessible={true} accessibilityLabel="Button">
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
        <TouchableOpacity style={styles.footerButton} onPress={handleDelete} accessibilityRole="button" accessible={true} accessibilityLabel="Button">
          <Ionicons name="trash-outline" size={20} color={designTokens.colors.danger ?? '#EF4444'} />
          <Text style={styles.footerButtonText}>Delete</Text>
        </TouchableOpacity>
        <View style={styles.spacer} />
      </View>
    </View>
  );
};