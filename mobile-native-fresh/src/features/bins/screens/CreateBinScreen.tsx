import { Text,
  View,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import { useTheme } from '../../../theme/ThemeProvider';
import { useAuth } from '../../auth/hooks/useAuth';
import { useBins } from '../../home/hooks/useBins';
import { Button } from '../../../components/ui/Button';
import { ModernHeader } from '../../../components/ui/ModernHeader';
import { Card, CardContent } from '../../../components/ui/Card';
import { DarkAlertDialog } from '../../../components/ui/DarkAlertDialog';
import { BinFormData } from '../../../types';

// Predefined colors and icons for bin creation
const BIN_COLORS = [
  '#3B82F6', // Blue
  '#10B981', // Green
  '#F59E0B', // Yellow
  '#EF4444', // Red
  '#8B5CF6', // Purple
  '#06B6D4', // Cyan
  '#F97316', // Orange
  '#EC4899', // Pink
];

const BIN_ICONS = [
  'briefcase-outline',
  'person-outline',
  'bulb-outline',
  'cart-outline',
  'book-outline',
  'heart-outline',
  'star-outline',
  'flag-outline',
  'folder-outline',
  'home-outline',
  'school-outline',
  'fitness-outline',
  'restaurant-outline',
  'car-outline',
  'airplane-outline',
  'gift-outline',
];

export const CreateBinScreen: React.FC = () => {
  const { tokens } = useTheme();
  const navigation = useNavigation();
  const { user } = useAuth();
  const { createBin } = useBins();

  // Form state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedColor, setSelectedColor] = useState(BIN_COLORS[0]);
  const [selectedIcon, setSelectedIcon] = useState(BIN_ICONS[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Custom alert dialog state
  const [showAlertDialog, setShowAlertDialog] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    title: '',
    message: '',
    buttons: [] as any[],
  });

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Name Required', 'Please enter a name for your bin.');
      return;
    }

    setIsSubmitting(true);

    try {
      const binData: BinFormData = {
        name: name.trim(),
        description: description.trim() || undefined,
        color: selectedColor,
        icon: selectedIcon,
      };

      const newBin = await createBin(binData);
      Alert.alert('Success', 'Bin created successfully!');
      
      // Navigate back to dashboard
      navigation.goBack();

    } catch (error) {
      console.error('Error creating bin:', error);
      Alert.alert('Error', 'Failed to create bin. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (name.trim() || description.trim()) {
      setAlertConfig({
        title: 'Discard Changes?',
        message: 'You have unsaved changes. Are you sure you want to discard them?',
        buttons: [
          {
            text: 'Keep Editing',
            onPress: () => setShowAlertDialog(false),
            style: 'cancel',
          },
          {
            text: 'Discard',
            onPress: () => {
              setShowAlertDialog(false);
              navigation.goBack();
            },
            style: 'destructive',
          },
        ],
      });
      setShowAlertDialog(true);
    } else {
      navigation.goBack();
    }
  };

  const getHeaderTitle = () => {
    return 'Create New Bin';
  };

  const getHeaderSubtitle = () => {
    return 'Organize your thoughtmarks into categories';
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    keyboardAvoidingView: {
      flex: 1,
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      padding: 16,
      paddingBottom: 100,
    },
    card: {
      marginBottom: 16,
    },
    cardContent: {
      padding: 16,
    },
    label: {
      fontSize: 16,
      fontWeight: '600',
      marginBottom: 8,
      color: tokens.colors.text,
    },
    textInput: {
      fontSize: 16,
      padding: 12,
      borderWidth: 1,
      borderColor: tokens.colors.border,
      borderRadius: 8,
      backgroundColor: tokens.colors.surface,
      color: tokens.colors.text,
    },
    textArea: {
      height: 80,
      textAlignVertical: 'top',
    },
    colorGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 12,
    },
    colorOption: {
      width: 40,
      height: 40,
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 2,
      borderColor: 'transparent',
    },
    colorOptionSelected: {
      borderColor: '#FFFFFF',
      borderWidth: 3,
    },
    iconGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 12,
    },
    iconOption: {
      width: 48,
      height: 48,
      borderRadius: 24,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: tokens.colors.surface,
      borderWidth: 2,
      borderColor: 'transparent',
    },
    iconOptionSelected: {
      borderColor: tokens.colors.accent,
      backgroundColor: tokens.colors.surfaceHover,
    },
    previewBin: {
      padding: 16,
      borderRadius: 12,
      marginTop: 8,
    },
    previewContent: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    previewText: {
      marginLeft: 12,
      flex: 1,
    },
    previewName: {
      fontSize: 16,
      fontWeight: '600',
      color: 'white',
      marginBottom: 2,
    },
    previewDescription: {
      fontSize: 14,
      color: 'rgba(255, 255, 255, 0.8)',
    },
    loadingOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    loadingText: {
      color: 'white',
      marginTop: 12,
      fontSize: 16,
    },
  });

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: tokens.colors.background }]}>
      <KeyboardAvoidingView 
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <ModernHeader
          title={getHeaderTitle()}
          subtitle={getHeaderSubtitle()}
          leftAction={{
            icon: 'close',
            onPress: handleCancel,
            accessibilityLabel: 'Cancel',
          }}
          rightAction={{
            icon: 'checkmark',
            onPress: handleSave,
            disabled: isSubmitting || !name.trim(),
            accessibilityLabel: 'Save bin',
          }}
        />

        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Name Input */}
          <Card style={styles.card}>
            <CardContent style={styles.cardContent}>
              <Text style={styles.label}>Bin Name *</Text>
              <TextInput
                style={[{
                  fontSize: 16,
                  padding: 12,
                  borderWidth: 1,
                  borderColor: tokens.colors.border,
                  borderRadius: 8,
                  backgroundColor: tokens.colors.surface,
                  color: tokens.colors.text,
                }, styles.textArea]}
                value={name}
                onChangeText={setName}
                placeholder="Enter bin name..."
                placeholderTextColor={tokens.colors.textMuted}
                maxLength={50}
                autoFocus
              />
            </CardContent>
          </Card>

          {/* Description Input */}
          <Card style={styles.card}>
            <CardContent style={styles.cardContent}>
              <Text style={styles.label}>Description (Optional)</Text>
              <TextInput
                style={[{
                  fontSize: 16,
                  padding: 12,
                  borderWidth: 1,
                  borderColor: tokens.colors.border,
                  borderRadius: 8,
                  backgroundColor: tokens.colors.surface,
                  color: tokens.colors.text,
                  height: 80,
                  textAlignVertical: 'top',
                }]}
                value={description}
                onChangeText={setDescription}
                placeholder="Describe what this bin is for..."
                placeholderTextColor={tokens.colors.textMuted}
                multiline
                numberOfLines={3}
                maxLength={200}
              />
            </CardContent>
          </Card>

          {/* Color Selection */}
          <Card style={styles.card}>
            <CardContent style={styles.cardContent}>
              <Text style={styles.label}>Color</Text>
              <View style={styles.colorGrid}>
                {BIN_COLORS.map((color) => (
                  <TouchableOpacity
                    key={color}
                    style={[
                      styles.colorOption,
                      { backgroundColor: color },
                      selectedColor === color && styles.colorOptionSelected,
                    ]}
                    onPress={() => setSelectedColor(color)}
                    accessibilityRole="button"
                    accessible={true}
                    accessibilityLabel={`Select color ${color}`}
                  >
                    {selectedColor === color && (
                      <Ionicons name="checkmark" size={20} color="white" />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </CardContent>
          </Card>

          {/* Icon Selection */}
          <Card style={styles.card}>
            <CardContent style={styles.cardContent}>
              <Text style={styles.label}>Icon</Text>
              <View style={styles.iconGrid}>
                {BIN_ICONS.map((icon) => (
                  <TouchableOpacity
                    key={icon}
                    style={[
                      styles.iconOption,
                      selectedIcon === icon && styles.iconOptionSelected,
                    ]}
                    onPress={() => setSelectedIcon(icon)}
                    accessibilityRole="button"
                    accessible={true}
                    accessibilityLabel={`Select icon ${icon}`}
                  >
                    <Ionicons 
                      name={icon as any} 
                      size={24} 
                      color={selectedIcon === icon ? tokens.colors.accent : tokens.colors.textSecondary} 
                    />
                  </TouchableOpacity>
                ))}
              </View>
            </CardContent>
          </Card>

          {/* Preview */}
          <Card style={styles.card}>
            <CardContent style={styles.cardContent}>
              <Text style={styles.label}>Preview</Text>
              <View style={[styles.previewBin, { backgroundColor: selectedColor }]}>
                <View style={styles.previewContent}>
                  <Ionicons name={selectedIcon as any} size={24} color="white" />
                  <View style={styles.previewText}>
                    <Text style={styles.previewName}>{name || 'Bin Name'}</Text>
                    {description && (
                      <Text style={styles.previewDescription}>{description}</Text>
                    )}
                  </View>
                </View>
              </View>
            </CardContent>
          </Card>
        </ScrollView>

        {/* Loading Overlay */}
        {isSubmitting && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color={tokens.colors.accent} />
            <Text style={styles.loadingText}>Creating bin...</Text>
          </View>
        )}
      </KeyboardAvoidingView>

      {/* Alert Dialog */}
      <DarkAlertDialog
        visible={showAlertDialog}
        title={alertConfig.title}
        message={alertConfig.message}
        buttons={alertConfig.buttons}
        onDismiss={() => setShowAlertDialog(false)}
      />
    </SafeAreaView>
  );
}; 