import { Text ,
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
// src/features/auth/components/RegistrationForm.tsx
import React, { useState } from 'react'
import Ionicons from 'react-native-vector-icons/Ionicons'

import { useTheme } from '../../../theme/ThemeProvider'
import { colors, spacing, typography } from '../../../theme/theme'

interface RegistrationFormProps {
  onSubmit: (
    email: string,
    password: string,
    firstName?: string,
    lastName?: string
  ) => void
  loading?: boolean
}

export const RegistrationForm: React.FC<RegistrationFormProps> = ({
  onSubmit,
  loading = false,
}) => {
  const { tokens } = useTheme();
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  const styles = StyleSheet.create({
    container: {
      width: '100%',
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    inputContainer: {
      marginBottom: spacing.md,
    },
    halfWidth: {
      width: '48%',
    },
    label: {
      ...typography.body,
      color: colors.text,
      marginBottom: spacing.xs,
    },
    input: {
      backgroundColor: colors.card,
      color: colors.text,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: tokens.radius.md,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      fontSize: typography.body.fontSize,
    },
    inputError: {
      borderColor: '#ff4444',
    },
    passwordContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: tokens.radius.md,
    },
    passwordInput: {
      flex: 1,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      fontSize: typography.body.fontSize,
      color: colors.text,
    },
    eyeButton: {
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
    },
    errorText: {
      color: '#ff4444',
      fontSize: 14,
      marginTop: spacing.xs,
    },
    submitButton: {
      backgroundColor: colors.primary,
      borderRadius: tokens.radius.md,
      paddingVertical: spacing.sm * 1.5,
      alignItems: 'center',
      marginTop: spacing.sm,
    },
    submitButtonDisabled: {
      backgroundColor: '#555555',
    },
    submitButtonText: {
      ...typography.body,
      color: '#ffffff',
      fontWeight: '600',
    },
  });

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {}
    if (!firstName.trim()) {
      newErrors.firstName = 'First name is required'
    }
    if (!email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email'
    }
    if (!password.trim()) {
      newErrors.password = 'Password is required'
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters'
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      newErrors.password =
        'Password must contain uppercase, lowercase, and number'
    }
    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit(
        email.trim(),
        password,
        firstName.trim(),
        lastName.trim() || undefined
      )
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <View style={[styles.inputContainer, styles.halfWidth]}>
          <Text style={styles.label}>First Name *</Text>
          <TextInput
            style={[styles.input, errors.firstName && styles.inputError]}
            value={firstName}
            onChangeText={setFirstName}
            placeholder="First name"
            placeholderTextColor={colors.subtext}
            selectionColor={colors.primary}
            autoCapitalize="words"
            editable={!loading}
          />
          {errors.firstName && (
            <Text style={styles.errorText}>{errors.firstName}</Text>
          )}
        </View>

        <View style={[styles.inputContainer, styles.halfWidth]}>
          <Text style={styles.label}>Last Name</Text>
          <TextInput
            style={styles.input}
            value={lastName}
            onChangeText={setLastName}
            placeholder="Last name"
            placeholderTextColor={colors.subtext}
            selectionColor={colors.primary}
            autoCapitalize="words"
            editable={!loading}
          />
        </View>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Email *</Text>
        <TextInput
          style={[styles.input, errors.email && styles.inputError]}
          value={email}
          onChangeText={setEmail}
          placeholder="Enter your email"
          placeholderTextColor={colors.subtext}
          selectionColor={colors.primary}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          editable={!loading}
        />
        {errors.email && (
          <Text style={styles.errorText}>{errors.email}</Text>
        )}
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Password *</Text>
        <View style={[styles.passwordContainer, errors.password && styles.inputError]}>
          <TextInput
            style={styles.passwordInput}
            value={password}
            onChangeText={setPassword}
            placeholder="Create a password"
            placeholderTextColor={colors.subtext}
            selectionColor={colors.primary}
            secureTextEntry={!showPassword}
            autoCapitalize="none"
            autoCorrect={false}
            editable={!loading}
          />
          <TouchableOpacity
            style={styles.eyeButton}
            onPress={() = accessibilityRole="button" accessible={true} accessibilityLabel="Button"> setShowPassword(!showPassword)}
          >
            <Ionicons 
              name={showPassword ? "eye-off" : "eye"} 
              size={20} 
              color={colors.subtext} 
            />
          </TouchableOpacity>
        </View>
        {errors.password && (
          <Text style={styles.errorText}>{errors.password}</Text>
        )}
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Confirm Password *</Text>
        <TextInput
          style={[styles.input, errors.confirmPassword && styles.inputError]}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholder="Confirm your password"
          placeholderTextColor={colors.subtext}
          selectionColor={colors.primary}
          secureTextEntry={!showPassword}
          autoCapitalize="none"
          autoCorrect={false}
          editable={!loading}
        />
        {errors.confirmPassword && (
          <Text style={styles.errorText}>{errors.confirmPassword}</Text>
        )}
      </View>

      <TouchableOpacity
        style={[
          styles.submitButton,
          loading && styles.submitButtonDisabled,
        ]}
        onPress={handleSubmit}
        disabled={loading}
       accessibilityRole="button" accessible={true} accessibilityLabel="Button">
        {loading ? (
          <ActivityIndicator color="#ffffff" />
        ) : (
          <Text style={styles.submitButtonText}>Create Account</Text>
        )}
      </TouchableOpacity>
    </View>
  )
}
