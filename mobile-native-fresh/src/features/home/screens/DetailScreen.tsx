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
import { AutoRoleView } from '../../../components/ui/AutoRoleView';

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
      <AutoRoleView role="group" accessibilityRole="none" style={styles.container}>
        <Text style={styles.title}>Thoughtmark not found</Text>
      </AutoRoleView>
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
    <AutoRoleView role="group" accessibilityRole="none" style={styles.container}>
      {/* Header */}
      <AutoRoleView role="header" accessibilityRole="header" style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}
                accessibilityRole="button"
                accessible={true}
                accessibilityLabel="Button">
          <Ionicons name="arrow-back" size={24} color={designTokens.colors.text ?? '#000'} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>THOUGHTMARK</Text>
        <AutoRoleView role="header" accessibilityRole="header" style={styles.headerActions}>
          <TouchableOpacity style={styles.actionButton} onPress={handlePin} accessibilityRole="button" accessible={true} accessibilityLabel="Button">
            <Ionicons name="pin" size={20} color={designTokens.colors.accent ?? '#000'} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={handleEdit} accessibilityRole="button" accessible={true} accessibilityLabel="Button">
            <Ionicons name="create-outline" size={24} color={designTokens.colors.text ?? '#000'} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={handleShare} accessibilityRole="button" accessible={true} accessibilityLabel="Button">
            <Ionicons name="share-outline" size={24} color={designTokens.colors.text ?? '#000'} />
          </TouchableOpacity>
        </AutoRoleView>
      </AutoRoleView>

      {/* Content */}
      <AutoRoleView role="main" accessibilityRole="none" style={styles.content}>
        {/* Bin Info */}
        <AutoRoleView role="card" accessibilityRole="summary" style={styles.contentCard}>
          <AutoRoleView style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name="folder-outline" size={16} color={designTokens.colors.textSecondary ?? '#000'} />
            <Text style={styles.contentTitle}>Bin: {getBinName(thoughtmark.binId)}</Text>
          </AutoRoleView>
        </AutoRoleView>

        {/* Title */}
        <Text style={styles.title}>{thoughtmark.title}</Text>

        {/* Content */}
        <AutoRoleView role="card" accessibilityRole="summary" style={styles.contentCard}>
          <Text style={styles.contentSubtitle}>{thoughtmark.content}</Text>
        </AutoRoleView>

        {/* Tags */}
        {thoughtmark.tags && thoughtmark.tags.length > 0 && (
          <AutoRoleView style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: designTokens.spacing.lg }}>
            {thoughtmark.tags.map((tag, index) => (
              <AutoRoleView role="group" accessibilityRole="none" key={index} style={styles.tagsContainer}>
                <Text style={styles.tagText}>#{tag}</Text>
              </AutoRoleView>
            ))}
          </AutoRoleView>
        )}

        {/* Task Status */}
        {thoughtmark.isTask && (
          <AutoRoleView role="card" accessibilityRole="summary" style={styles.contentCard}>
            <AutoRoleView style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Ionicons
                name={thoughtmark.isCompleted ? "checkmark-circle" : "ellipse-outline"}
                size={20}
                color={thoughtmark.isCompleted ? designTokens.colors.accent ?? '#000' : designTokens.colors.textSecondary ?? '#000'}
              />
              <Text style={styles.contentTitle}>
                {thoughtmark.isCompleted ? 'Completed' : 'Pending'}
              </Text>
            </AutoRoleView>
          </AutoRoleView>
        )}
      </AutoRoleView>

      {/* Footer */}
      <AutoRoleView role="contentinfo" accessibilityRole="none" style={styles.footer}>
        <TouchableOpacity style={styles.footerButton} onPress={handleDelete} accessibilityRole="button" accessible={true} accessibilityLabel="Button">
          <Ionicons name="trash-outline" size={20} color={designTokens.colors.danger ?? '#EF4444'} />
          <Text style={styles.footerButtonText}>Delete</Text>
        </TouchableOpacity>
        <AutoRoleView style={styles.spacer} />
      </AutoRoleView>
    </AutoRoleView>
  );
};