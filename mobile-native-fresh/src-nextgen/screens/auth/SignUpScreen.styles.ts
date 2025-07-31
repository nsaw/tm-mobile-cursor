import { StyleSheet } from 'react-native';
import { ThemeColors } from '../../types/theme';

export const createStyles = (colors: ThemeColors) => StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  content: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.8,
  },
  form: {
    marginBottom: 32,
  },
  nameContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  nameField: {
    flex: 1,
  },
  inputContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  passwordContainer: {
    position: 'relative',
  },
  passwordInput: {
    paddingRight: 48,
  },
  eyeButton: {
    position: 'absolute',
    right: 12,
    top: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  eyeButtonText: {
    fontSize: 16,
  },
  passwordStrength: {
    marginTop: 8,
  },
  errorText: {
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  verificationButton: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  verificationButtonText: {
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  termsTextContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginLeft: 8,
  },
  termsText: {
    fontSize: 14,
  },
  termsLink: {
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  marketingText: {
    fontSize: 14,
    marginLeft: 8,
    flex: 1,
  },
  signUpButton: {
    height: 48,
    borderRadius: 8,
    marginTop: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
  },
  signInLink: {
    fontSize: 14,
    fontWeight: '600',
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