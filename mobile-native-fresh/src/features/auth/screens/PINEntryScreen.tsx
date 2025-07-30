import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useTheme } from '../../../theme/ThemeProvider';
import { Text } from '../../../components/ui/Text';

const PIN_LENGTH = 4;
const STORAGE_KEY = '@thoughtmarks_pin';

interface PINEntryScreenProps {
  mode: 'setup' | 'verify' | 'change';
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const PINEntryScreen: React.FC<PINEntryScreenProps> = ({
  mode,
  onSuccess,
  onCancel,
}) => {
  const { tokens: designTokens } = useTheme();
  
  const [pin, setPin] = useState<string[]>([]);
  const [confirmPin, setConfirmPin] = useState<string[]>([]);
  const [isConfirming, setIsConfirming] = useState(false);
  const [storedPin, setStoredPin] = useState<string | null>(null);

  useEffect(() => {
    if (mode === 'verify' || mode === 'change') {
      loadStoredPIN();
    }
  }, [mode]);

  const loadStoredPIN = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      setStoredPin(stored);
    } catch (error) {
      console.error('Error loading stored PIN:', error);
    }
  };

  const handleNumberPress = (number: string) => {
    if (isConfirming) {
      if (confirmPin.length < PIN_LENGTH) {
        const newConfirmPin = [...confirmPin, number];
        setConfirmPin(newConfirmPin);
        
        if (newConfirmPin.length === PIN_LENGTH) {
          handleConfirmPIN();
        }
      }
    } else {
      if (pin.length < PIN_LENGTH) {
        const newPin = [...pin, number];
        setPin(newPin);
        
        if (newPin.length === PIN_LENGTH) {
          if (mode === 'setup') {
            setIsConfirming(true);
          } else if (mode === 'verify') {
            handleVerifyPIN();
          }
        }
      }
    }
  };

  const handleDelete = () => {
    if (isConfirming) {
      setConfirmPin(prev => prev.slice(0, -1));
    } else {
      setPin(prev => prev.slice(0, -1));
    }
  };

  const handleConfirmPIN = () => {
    const pinString = pin.join('');
    const confirmPinString = confirmPin.join('');
    
    if (pinString === confirmPinString) {
      savePIN(pinString);
      Alert.alert('Success', 'PIN has been set successfully!', [
        { text: 'OK', onPress: () => onSuccess?.() }
      ]);
    } else {
      Alert.alert('Error', 'PINs do not match. Please try again.');
      setPin([]);
      setConfirmPin([]);
      setIsConfirming(false);
    }
  };

  const handleVerifyPIN = () => {
    const pinString = pin.join('');
    
    if (pinString === storedPin) {
      Alert.alert('Success', 'PIN verified successfully!', [
        { text: 'OK', onPress: () => onSuccess?.() }
      ]);
    } else {
      Alert.alert('Error', 'Incorrect PIN. Please try again.');
      setPin([]);
    }
  };

  const savePIN = async (pinString: string) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, pinString);
      console.log('PIN saved successfully');
    } catch (error) {
      console.error('Error saving PIN:', error);
      Alert.alert('Error', 'Failed to save PIN. Please try again.');
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
  };

  const getTitle = () => {
    switch (mode) {
      case 'setup':
        return 'Set Up PIN';
      case 'verify':
        return 'Enter PIN';
      case 'change':
        return 'Change PIN';
      default:
        return 'PIN Entry';
    }
  };

  const getSubtitle = () => {
    switch (mode) {
      case 'setup':
        return isConfirming ? 'Confirm your PIN' : 'Create a 4-digit PIN';
      case 'verify':
        return 'Enter your PIN to continue';
      case 'change':
        return 'Enter your current PIN';
      default:
        return '';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleCancel} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={designTokens.colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: designTokens.colors.text }]}>
          {getTitle()}
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.content}>
        <Text style={[styles.title, { color: designTokens.colors.text }]}>
          {getTitle()}
        </Text>
        <Text style={[styles.subtitle, { color: designTokens.colors.textSecondary }]}>
          {getSubtitle()}
        </Text>

        {/* PIN Dots */}
        <View style={styles.pinContainer}>
          {Array.from({ length: PIN_LENGTH }).map((_, index) => (
            <View key={index} style={styles.pinDot}>
              <View style={[
                styles.dot,
                {
                  backgroundColor: (isConfirming ? confirmPin : pin).length > index 
                    ? designTokens.colors.accent 
                    : designTokens.colors.border
                }
              ]} />
            </View>
          ))}
        </View>

        {/* Number Pad */}
        <View style={styles.numberPad}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((number) => (
            <TouchableOpacity
              key={number}
              style={[styles.numberButton, { backgroundColor: designTokens.colors.backgroundSecondary }]}
              onPress={() => handleNumberPress(number.toString())}
              accessibilityRole="button"
              accessible={true}
              accessibilityLabel={`Number ${number}`}
            >
              <Text style={[styles.numberText, { color: designTokens.colors.text }]}>
                {number}
              </Text>
            </TouchableOpacity>
          ))}
          
          {/* Delete Button */}
          <TouchableOpacity
            style={[styles.numberButton, { backgroundColor: designTokens.colors.backgroundSecondary }]}
            onPress={handleDelete}
            accessibilityRole="button"
            accessible={true}
            accessibilityLabel="Delete"
          >
            <Ionicons name="backspace-outline" size={24} color={designTokens.colors.text} />
          </TouchableOpacity>

          {/* Zero */}
          <TouchableOpacity
            style={[styles.numberButton, { backgroundColor: designTokens.colors.backgroundSecondary }]}
            onPress={() => handleNumberPress('0')}
            accessibilityRole="button"
            accessible={true}
            accessibilityLabel="Number 0"
          >
            <Text style={[styles.numberText, { color: designTokens.colors.text }]}>0</Text>
          </TouchableOpacity>

          {/* Cancel/Back Button */}
          <TouchableOpacity
            style={[styles.numberButton, { backgroundColor: designTokens.colors.backgroundSecondary }]}
            onPress={handleCancel}
            accessibilityRole="button"
            accessible={true}
            accessibilityLabel="Cancel"
          >
            <Text style={[styles.numberText, { color: designTokens.colors.textSecondary }]}>
              {mode === 'setup' ? 'Skip' : 'Cancel'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  backButton: {
    padding: 8,
  },
  container: {
    flex: 1,
  },
  content: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  header: {
    alignItems: 'center',
    borderBottomColor: '#2E2E2E',
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerSpacer: {
    width: 40,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  numberButton: {
    alignItems: 'center',
    borderRadius: 35,
    height: 70,
    justifyContent: 'center',
    margin: 8,
    width: 70,
  },
  dot: {
    borderColor: 'transparent',
    borderRadius: 8,
    borderWidth: 2,
    height: 16,
    width: 16,
  },
  pinContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 32,
  },
  pinDot: {
    marginHorizontal: 8,
  },
  numberPad: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    maxWidth: 300,
  },
  numberText: {
    fontSize: 24,
    fontWeight: '600',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 32,
    textAlign: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
}); 