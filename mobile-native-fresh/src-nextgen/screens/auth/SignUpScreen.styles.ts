import { StyleSheet } from 'react-native';

import { ThemeColors } from '../../types/theme';

export const createStyles = (colors: ThemeColors) => StyleSheet.create({
  checkboxContainer: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    marginBottom: 16,
  },
  container: {
    flex: 1,
  },
  content: {
    alignSelf: 'center',
    maxWidth: 400,
    width: '100%',
  },
  errorText: {
    fontSize: 12,
    marginLeft: 4,
    marginTop: 4,
  },
  eyeButton: {
    alignItems: 'center',
    height: 24,
    justifyContent: 'center',
    position: 'absolute',
    right: 12,
    top: 12,
    width: 24,
  },
  eyeButtonText: {
    fontSize: 16,
  },
  footer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  footerText: {
    fontSize: 14,
  },
  form: {
    marginBottom: 32,
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  input: {
    borderRadius: 8,
    borderWidth: 1,
    fontSize: 16,
    height: 48,
    paddingHorizontal: 16,
  },
  inputContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  marketingText: {
    flex: 1,
    fontSize: 14,
    marginLeft: 8,
  },
  nameContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  nameField: {
    flex: 1,
  },
  passwordContainer: {
    position: 'relative',
  },
  passwordInput: {
    paddingRight: 48,
  },
  passwordStrength: {
    marginTop: 8,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  signInLink: {
    fontSize: 14,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  signUpButton: {
    borderRadius: 8,
    height: 48,
    marginTop: 16,
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.8,
    textAlign: 'center',
  },
  termsLink: {
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  termsText: {
    fontSize: 14,
  },
  termsTextContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginLeft: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  verificationButton: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  verificationButtonText: {
    fontSize: 14,
    textDecorationLine: 'underline',
  },
});

export const styles = createStyles({
  background: '#FFFFFF',
  surface: '#F8F9FA',
  text: '#1A1A1A',
  textSecondary: '#6C757D',
  primary: '#007AFF',
  error: '#DC3545',
  border: '#DEE2E6',
} as ThemeColors); 