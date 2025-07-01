import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import { useTheme } from '../../../theme/ThemeProvider';

export const PINEntryScreen: React.FC = () => {
  const navigation = useNavigation();
  const title = 'Enter PIN';
  const message = 'Please enter your PIN to continue';
  const { tokens } = useTheme();
  const [pin, setPin] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockoutTime, setLockoutTime] = useState(0);

  const styles = getStyles(tokens);

  const handlePINSubmit = async () => {
    if (pin.length < 4) {
      Alert.alert('Invalid PIN', 'PIN must be at least 4 digits');
      return;
    }

    if (isLocked) {
      const remainingTime = Math.ceil((lockoutTime - Date.now()) / 1000);
      if (remainingTime > 0) {
        Alert.alert('Account Locked', `Please wait ${remainingTime} seconds before trying again.`);
        return;
      } else {
        setIsLocked(false);
        setAttempts(0);
      }
    }

    setIsLoading(true);
    try {
      // TODO: Implement actual PIN validation logic
      // For now, we'll use a simple demo PIN
      const demoPIN = '1234';
      
      if (pin === demoPIN) {
        // Success - reset attempts and navigate back
        setAttempts(0);
        setPin('');
        navigation.goBack();
      } else {
        // Failed attempt
        const newAttempts = attempts + 1;
        setAttempts(newAttempts);
        setPin('');
        
        if (newAttempts >= 3) {
          // Lock account for 5 minutes after 3 failed attempts
          setIsLocked(true);
          setLockoutTime(Date.now() + (5 * 60 * 1000)); // 5 minutes
          Alert.alert(
            'Account Locked', 
            'Too many failed attempts. Please wait 5 minutes before trying again.',
            [{ text: 'OK' }]
          );
        } else {
          const remainingAttempts = 3 - newAttempts;
          Alert.alert(
            'Incorrect PIN', 
            `Please try again. ${remainingAttempts} attempt${remainingAttempts !== 1 ? 's' : ''} remaining.`
          );
        }
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to validate PIN. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (key: string) => {
    if (pin.length < 6) {
      setPin(prev => prev + key);
    }
  };

  const handleBackspace = () => {
    setPin(prev => prev.slice(0, -1));
  };

  const handleClear = () => {
    setPin('');
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboard}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.cancelButton}
            accessibilityRole="button"
            accessible={true}
            accessibilityLabel="Cancel PIN entry"
          >
            <Ionicons name="close" size={24} color={tokens.colors.text} />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>
          
          {/* Attempts and Lockout Status */}
          {attempts > 0 && !isLocked && (
            <Text style={styles.attemptsText}>
              {3 - attempts} attempt{3 - attempts !== 1 ? 's' : ''} remaining
            </Text>
          )}
          
          {isLocked && (
            <Text style={styles.lockoutText}>
              Account locked. Please wait {Math.ceil((lockoutTime - Date.now()) / 1000)} seconds.
            </Text>
          )}

          {/* PIN Display */}
          <View style={styles.pinDisplay}>
            {Array.from({ length: 6 }).map((_, index) => (
              <View
                key={index}
                style={[
                  styles.pinDot,
                  index < pin.length && styles.pinDotFilled,
                ]}
              />
            ))}
          </View>

          {/* Number Pad */}
          <View style={[styles.numberPad, isLocked && styles.numberPadDisabled]}>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((number) => (
              <TouchableOpacity
                key={number}
                style={[styles.numberButton, isLocked && styles.numberButtonDisabled]}
                onPress={() => !isLocked && handleKeyPress(number.toString())}
                disabled={isLocked}
                accessibilityRole="button"
                accessible={true}
                accessibilityLabel={`Enter digit ${number}`}
              >
                <Text style={[styles.numberText, isLocked && styles.numberTextDisabled]}>{number}</Text>
              </TouchableOpacity>
            ))}
            
            <TouchableOpacity
              style={styles.numberButton}
              onPress={handleClear}
              accessibilityRole="button"
              accessible={true}
              accessibilityLabel="Clear PIN"
            >
              <Ionicons name="refresh" size={24} color={tokens.colors.text} />
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.numberButton}
              onPress={() => handleKeyPress('0')}
              accessibilityRole="button"
              accessible={true}
              accessibilityLabel="Enter digit 0"
            >
              <Text style={styles.numberText}>0</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.numberButton}
              onPress={handleBackspace}
              accessibilityRole="button"
              accessible={true}
              accessibilityLabel="Delete last digit"
            >
              <Ionicons name="backspace" size={24} color={tokens.colors.text} />
            </TouchableOpacity>
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            style={[
              styles.submitButton,
              pin.length >= 4 && styles.submitButtonActive,
            ]}
            onPress={handlePINSubmit}
            disabled={pin.length < 4 || isLoading}
            accessibilityRole="button"
            accessible={true}
            accessibilityLabel="Submit PIN"
          >
            <Text style={[
              styles.submitButtonText,
              pin.length >= 4 && styles.submitButtonTextActive,
            ]}>
              {isLoading ? 'Validating...' : 'Submit'}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const getStyles = (tokens: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: tokens.colors.background,
  },
  keyboard: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: tokens.spacing.md,
    paddingVertical: tokens.spacing.sm,
  },
  cancelButton: {
    padding: tokens.spacing.sm,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: tokens.spacing.xl,
  },
  title: {
    fontSize: tokens.typography.fontSize.heading,
    fontWeight: tokens.typography.fontWeight.bold,
    color: tokens.colors.text,
    textAlign: 'center',
    marginBottom: tokens.spacing.sm,
  },
  message: {
    fontSize: tokens.typography.fontSize.body,
    color: tokens.colors.textSecondary,
    textAlign: 'center',
    marginBottom: tokens.spacing.xl,
  },
  pinDisplay: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: tokens.spacing.xl,
  },
  pinDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: tokens.colors.border,
    marginHorizontal: tokens.spacing.sm,
  },
  pinDotFilled: {
    backgroundColor: tokens.colors.accent,
    borderColor: tokens.colors.accent,
  },
  numberPad: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    maxWidth: 300,
    marginBottom: tokens.spacing.xl,
  },
  numberButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: tokens.colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    margin: tokens.spacing.sm,
  },
  numberText: {
    fontSize: tokens.typography.fontSize.heading,
    fontWeight: tokens.typography.fontWeight.semibold,
    color: tokens.colors.text,
  },
  submitButton: {
    backgroundColor: tokens.colors.border,
    borderRadius: tokens.radius.md,
    paddingVertical: tokens.spacing.md,
    paddingHorizontal: tokens.spacing.xl,
    minWidth: 200,
    alignItems: 'center',
  },
  submitButtonActive: {
    backgroundColor: tokens.colors.accent,
  },
  submitButtonText: {
    fontSize: tokens.typography.fontSize.body,
    fontWeight: tokens.typography.fontWeight.semibold,
    color: tokens.colors.textSecondary,
  },
  submitButtonTextActive: {
    color: tokens.colors.background,
  },
  attemptsText: {
    fontSize: tokens.typography.fontSize.sm,
    color: tokens.colors.textSecondary,
    textAlign: 'center',
    marginBottom: tokens.spacing.md,
  },
  lockoutText: {
    fontSize: tokens.typography.fontSize.sm,
    color: '#ff4444',
    textAlign: 'center',
    marginBottom: tokens.spacing.md,
    fontWeight: tokens.typography.fontWeight.semibold,
  },
}); 