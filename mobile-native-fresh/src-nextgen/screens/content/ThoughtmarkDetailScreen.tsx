import React, { useState, useEffect } from 'react';
import { AutoRoleView } from '../../shell/wrappers/AutoRoleView';
import { useTheme } from '../../theme/ThemeProvider';
import { useThoughtmark } from '../../hooks/useThoughtmark';
import { View, Text, TouchableOpacity, ScrollView, TextInput } from 'react-native';

interface ThoughtmarkDetailScreenProps {
  thoughtmarkId: string;
}

const ThoughtmarkDetailScreen: React.FC<ThoughtmarkDetailScreenProps> = ({ thoughtmarkId }) => {
  const { theme } = useTheme();
  const { thoughtmark, fetchThoughtmark, updateThoughtmark, deleteThoughtmark, shareThoughtmark } = useThoughtmark();
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');

  useEffect(() => {
    fetchThoughtmark(thoughtmarkId);
  }, [thoughtmarkId]);

  useEffect(() => {
    if (thoughtmark) {
      setEditTitle(thoughtmark.title);
      setEditContent(thoughtmark.content);
    }
  }, [thoughtmark]);

  const handleSave = async () => {
    if (thoughtmark) {
      await updateThoughtmark(thoughtmark.id, {
        title: editTitle,
        content: editContent,
      });
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    if (thoughtmark) {
      setEditTitle(thoughtmark.title);
      setEditContent(thoughtmark.content);
    }
    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (thoughtmark) {
      await deleteThoughtmark(thoughtmark.id);
    }
  };

  const handleShare = async () => {
    if (thoughtmark) {
      await shareThoughtmark(thoughtmark.id);
    }
  };

  if (!thoughtmark) {
    return (
      <AutoRoleView layoutRole="container-main" style={theme.styles.screenContainer}>
        <Text style={theme.styles.loadingText}>Loading...</Text>
      </AutoRoleView>
    );
  }

  return (
    <AutoRoleView layoutRole="container-main" style={theme.styles.screenContainer}>
      <ScrollView>
        <View style={theme.styles.detailHeader}>
          <Text style={theme.styles.detailTitle}>
            {isEditing ? 'Edit Thoughtmark' : 'Thoughtmark Details'}
          </Text>
          
          <View style={theme.styles.actionButtons}>
            {!isEditing ? (
              <>
                <TouchableOpacity
                  onPress={() => setIsEditing(true)}
                  style={theme.styles.editButton}
                >
                  <Text style={theme.styles.editButtonText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleShare}
                  style={theme.styles.shareButton}
                >
                  <Text style={theme.styles.shareButtonText}>Share</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleDelete}
                  style={theme.styles.deleteButton}
                >
                  <Text style={theme.styles.deleteButtonText}>Delete</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <TouchableOpacity
                  onPress={handleSave}
                  style={theme.styles.saveButton}
                >
                  <Text style={theme.styles.saveButtonText}>Save</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleCancel}
                  style={theme.styles.cancelButton}
                >
                  <Text style={theme.styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>

        <View style={theme.styles.detailContent}>
          {isEditing ? (
            <>
              <TextInput
                value={editTitle}
                onChangeText={setEditTitle}
                style={theme.styles.editTitleInput}
                placeholder="Title"
              />
              <TextInput
                value={editContent}
                onChangeText={setEditContent}
                style={theme.styles.editContentInput}
                placeholder="Content"
                multiline
                numberOfLines={10}
              />
            </>
          ) : (
            <>
              <Text style={theme.styles.detailTitleText}>{thoughtmark.title}</Text>
              <Text style={theme.styles.detailContentText}>{thoughtmark.content}</Text>
              <Text style={theme.styles.detailDate}>
                Created: {new Date(thoughtmark.createdAt).toLocaleDateString()}
              </Text>
            </>
          )}
        </View>
      </ScrollView>
    </AutoRoleView>
  );
};

export default ThoughtmarkDetailScreen; 
