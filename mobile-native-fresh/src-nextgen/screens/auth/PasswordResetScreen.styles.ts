import { StyleSheet } from 'react-native';
import { ThemeColors } from '../../types/theme';

export const createStyles = (colors: ThemeColors): ReturnType<typeof StyleSheet.create> => StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: colors.background,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    backgroundColor: colors.surface,
    color: colors.text,
  },
  inputError: {
    borderColor: colors.error,
  },
  errorText: {
    color: colors.error,
    fontSize: 14,
    marginBottom: 10,
  },
  successText: {
    color: colors.primary,
    fontSize: 14,
    marginBottom: 10,
  },
  primaryButton: {
    backgroundColor: colors.primary,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  secondaryButton: {
    backgroundColor: colors.border,
    padding: 15,
    margin: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  errorContainer: {
    backgroundColor: colors.error,
    padding: 15,
    margin: 20,
    borderRadius: 8,
  },
  successContainer: {
    backgroundColor: colors.primary,
    padding: 15,
    margin: 20,
    borderRadius: 8,
  },
}); 
