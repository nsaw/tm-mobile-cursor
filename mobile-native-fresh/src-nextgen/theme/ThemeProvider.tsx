import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface ThemeTokens {
  colors: {
    background: string;
    text: string;
    surface: string;
    border: string;
    accent: string;
    textSecondary: string;
    error: string;
    success: string;
    warning: string;
    primary: string;
    onPrimary: string;
    outline: string;
    disabled: string;
    onAccent: string;
    onError: string;
    buttonText: string;
    backgroundSecondary: string;
    textMuted: string;
  };
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    xxl: number;
    page: number;
  };
  typography: {
    fontSize: {
      xs: number;
      sm: number;
      body: number;
      lg: number;
      xl: number;
      heading: number;
      caption: number;
      '2xl': number;
      '3xl': number;
    };
    fontWeight: {
      normal: string;
      medium: string;
      semibold: string;
      bold: string;
      light: string;
    };
    lineHeight: {
      xs: number;
      sm: number;
      body: number;
      lg: number;
      xl: number;
      heading: number;
      caption: number;
      '2xl': number;
      '3xl': number;
    };
  };
  radius: {
    sm: number;
    md: number;
    lg: number;
  };
  styles: {
    screenContainer: any;
    searchBar: any;
    input: any;
    voiceButton: any;
    voiceLabel: any;
    searchItem: any;
    loadingText: any;
    detailHeader: any;
    detailTitle: any;
    actionButtons: any;
    editButton: any;
    editButtonText: any;
    shareButton: any;
    shareButtonText: any;
    deleteButton: any;
    deleteButtonText: any;
    saveButton: any;
    saveButtonText: any;
    cancelButton: any;
    cancelButtonText: any;
    detailContent: any;
    editTitleInput: any;
    editContentInput: any;
    detailTitleText: any;
    detailContentText: any;
    detailDate: any;
    createTitle: any;
    formSection: any;
    label: any;
    textArea: any;
    switchRow: any;
    helpText: any;
    createButton: any;
    createButtonDisabled: any;
    createButtonText: any;
    binItem: any;
    binTitle: any;
    binOwner: any;
    binPrivacyRow: any;
    binPrivacyLabel: any;
    inviteButton: any;
    inviteLabel: any;
  };
}

const lightTheme: ThemeTokens = {
  colors: {
    background: '#FFFFFF',
    text: '#000000',
    surface: '#F8F9FA',
    border: '#E9ECEF',
    accent: '#007AFF',
    textSecondary: '#6C757D',
    error: '#DC3545',
    success: '#28A745',
    warning: '#FFC107',
    primary: '#007AFF',
    onPrimary: '#FFFFFF',
    outline: '#E9ECEF',
    disabled: '#6C757D',
    onAccent: '#FFFFFF',
    onError: '#FFFFFF',
    buttonText: '#FFFFFF',
    backgroundSecondary: '#F8F9FA',
    textMuted: '#6C757D',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
    page: 16,
  },
  typography: {
    fontSize: {
      xs: 12,
      sm: 14,
      body: 16,
      lg: 18,
      xl: 20,
      heading: 24,
      caption: 14,
      '2xl': 28,
      '3xl': 32,
    },
    fontWeight: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
      light: '300',
    },
    lineHeight: {
      xs: 16,
      sm: 18,
      body: 24,
      lg: 26,
      xl: 28,
      heading: 32,
      caption: 18,
      '2xl': 36,
      '3xl': 40,
    },
  },
  radius: {
    sm: 4,
    md: 8,
    lg: 12,
  },
  styles: {
    screenContainer: { flex: 1, backgroundColor: '#FFFFFF', padding: 16 },
    searchBar: { flexDirection: 'row', alignItems: 'center', padding: 16 },
    input: { flex: 1, padding: 12, borderWidth: 1, borderColor: '#E9ECEF', borderRadius: 8 },
    voiceButton: { padding: 12, marginLeft: 8 },
    voiceLabel: { fontSize: 20 },
    searchItem: { padding: 16, borderBottomWidth: 1, borderBottomColor: '#E9ECEF' },
    loadingText: { textAlign: 'center', padding: 20 },
    detailHeader: { padding: 16, borderBottomWidth: 1, borderBottomColor: '#E9ECEF' },
    detailTitle: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
    actionButtons: { flexDirection: 'row', justifyContent: 'space-around', padding: 16 },
    editButton: { backgroundColor: '#007AFF', padding: 12, borderRadius: 8, flex: 1, marginHorizontal: 4 },
    editButtonText: { color: '#FFFFFF', textAlign: 'center', fontWeight: '600' },
    shareButton: { backgroundColor: '#28A745', padding: 12, borderRadius: 8, flex: 1, marginHorizontal: 4 },
    shareButtonText: { color: '#FFFFFF', textAlign: 'center', fontWeight: '600' },
    deleteButton: { backgroundColor: '#DC3545', padding: 12, borderRadius: 8, flex: 1, marginHorizontal: 4 },
    deleteButtonText: { color: '#FFFFFF', textAlign: 'center', fontWeight: '600' },
    saveButton: { backgroundColor: '#28A745', padding: 12, borderRadius: 8, flex: 1, marginHorizontal: 4 },
    saveButtonText: { color: '#FFFFFF', textAlign: 'center', fontWeight: '600' },
    cancelButton: { backgroundColor: '#6C757D', padding: 12, borderRadius: 8, flex: 1, marginHorizontal: 4 },
    cancelButtonText: { color: '#FFFFFF', textAlign: 'center', fontWeight: '600' },
    detailContent: { padding: 16 },
    editTitleInput: { borderWidth: 1, borderColor: '#E9ECEF', borderRadius: 8, padding: 12, marginBottom: 16 },
    editContentInput: { borderWidth: 1, borderColor: '#E9ECEF', borderRadius: 8, padding: 12, minHeight: 100 },
    detailTitleText: { fontSize: 24, fontWeight: 'bold', marginBottom: 8 },
    detailContentText: { fontSize: 16, lineHeight: 24, marginBottom: 8 },
    detailDate: { fontSize: 14, color: '#6C757D' },
    createTitle: { fontSize: 28, fontWeight: '700', color: '#000000', marginBottom: 24, textAlign: 'center' },
    formSection: { marginBottom: 20 },
    label: { fontSize: 16, fontWeight: '600', color: '#000000', marginBottom: 8 },
    textArea: { minHeight: 100, borderWidth: 1, borderColor: '#E9ECEF', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 12, fontSize: 16, color: '#000000', backgroundColor: '#F8F9FA', textAlignVertical: 'top' },
    switchRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
    helpText: { fontSize: 14, color: '#6C757D', fontStyle: 'italic' },
    createButton: { backgroundColor: '#007AFF', paddingVertical: 16, paddingHorizontal: 24, borderRadius: 8, alignItems: 'center', marginTop: 20 },
    createButtonDisabled: { backgroundColor: '#6C757D', opacity: 0.6 },
    createButtonText: { color: '#FFFFFF', fontSize: 18, fontWeight: '600' },
    binItem: { padding: 16, borderBottomWidth: 1, borderBottomColor: '#E9ECEF', backgroundColor: '#F8F9FA', marginBottom: 8, borderRadius: 8 },
    binTitle: { fontSize: 18, fontWeight: '600', color: '#000000', marginBottom: 4 },
    binOwner: { fontSize: 14, color: '#6C757D', marginBottom: 8 },
    binPrivacyRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
    binPrivacyLabel: { fontSize: 14, color: '#000000' },
    inviteButton: { backgroundColor: '#007AFF', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 6, alignSelf: 'flex-start' },
    inviteLabel: { color: '#FFFFFF', fontSize: 14, fontWeight: '500' },
  },
};

const darkTheme: ThemeTokens = {
  colors: {
    background: '#000000',
    text: '#FFFFFF',
    surface: '#1C1C1E',
    border: '#38383A',
    accent: '#0A84FF',
    textSecondary: '#8E8E93',
    error: '#FF453A',
    success: '#32D74B',
    warning: '#FFD60A',
    primary: '#0A84FF',
    onPrimary: '#FFFFFF',
    outline: '#38383A',
    disabled: '#8E8E93',
    onAccent: '#FFFFFF',
    onError: '#FFFFFF',
    buttonText: '#FFFFFF',
    backgroundSecondary: '#1C1C1E',
    textMuted: '#8E8E93',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
    page: 16,
  },
  typography: {
    fontSize: {
      xs: 12,
      sm: 14,
      body: 16,
      lg: 18,
      xl: 20,
      heading: 24,
      caption: 14,
      '2xl': 28,
      '3xl': 32,
    },
    fontWeight: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
      light: '300',
    },
    lineHeight: {
      xs: 16,
      sm: 18,
      body: 24,
      lg: 26,
      xl: 28,
      heading: 32,
      caption: 18,
      '2xl': 36,
      '3xl': 40,
    },
  },
  radius: {
    sm: 4,
    md: 8,
    lg: 12,
  },
  styles: {
    screenContainer: { flex: 1, backgroundColor: '#000000', padding: 16 },
    searchBar: { flexDirection: 'row', alignItems: 'center', padding: 16 },
    input: { flex: 1, padding: 12, borderWidth: 1, borderColor: '#38383A', borderRadius: 8, backgroundColor: '#1C1C1E', color: '#FFFFFF' },
    voiceButton: { padding: 12, marginLeft: 8 },
    voiceLabel: { fontSize: 20 },
    searchItem: { padding: 16, borderBottomWidth: 1, borderBottomColor: '#38383A' },
    loadingText: { textAlign: 'center', padding: 20, color: '#FFFFFF' },
    detailHeader: { padding: 16, borderBottomWidth: 1, borderBottomColor: '#38383A' },
    detailTitle: { fontSize: 24, fontWeight: 'bold', marginBottom: 16, color: '#FFFFFF' },
    actionButtons: { flexDirection: 'row', justifyContent: 'space-around', padding: 16 },
    editButton: { backgroundColor: '#0A84FF', padding: 12, borderRadius: 8, flex: 1, marginHorizontal: 4 },
    editButtonText: { color: '#FFFFFF', textAlign: 'center', fontWeight: '600' },
    shareButton: { backgroundColor: '#32D74B', padding: 12, borderRadius: 8, flex: 1, marginHorizontal: 4 },
    shareButtonText: { color: '#FFFFFF', textAlign: 'center', fontWeight: '600' },
    deleteButton: { backgroundColor: '#FF453A', padding: 12, borderRadius: 8, flex: 1, marginHorizontal: 4 },
    deleteButtonText: { color: '#FFFFFF', textAlign: 'center', fontWeight: '600' },
    saveButton: { backgroundColor: '#32D74B', padding: 12, borderRadius: 8, flex: 1, marginHorizontal: 4 },
    saveButtonText: { color: '#FFFFFF', textAlign: 'center', fontWeight: '600' },
    cancelButton: { backgroundColor: '#8E8E93', padding: 12, borderRadius: 8, flex: 1, marginHorizontal: 4 },
    cancelButtonText: { color: '#FFFFFF', textAlign: 'center', fontWeight: '600' },
    detailContent: { padding: 16 },
    editTitleInput: { borderWidth: 1, borderColor: '#38383A', borderRadius: 8, padding: 12, marginBottom: 16, backgroundColor: '#1C1C1E', color: '#FFFFFF' },
    editContentInput: { borderWidth: 1, borderColor: '#38383A', borderRadius: 8, padding: 12, minHeight: 100, backgroundColor: '#1C1C1E', color: '#FFFFFF' },
    detailTitleText: { fontSize: 24, fontWeight: 'bold', marginBottom: 8, color: '#FFFFFF' },
    detailContentText: { fontSize: 16, lineHeight: 24, marginBottom: 8, color: '#FFFFFF' },
    detailDate: { fontSize: 14, color: '#8E8E93' },
    createTitle: { fontSize: 28, fontWeight: '700', color: '#FFFFFF', marginBottom: 24, textAlign: 'center' },
    formSection: { marginBottom: 20 },
    label: { fontSize: 16, fontWeight: '600', color: '#FFFFFF', marginBottom: 8 },
    textArea: { minHeight: 100, borderWidth: 1, borderColor: '#38383A', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 12, fontSize: 16, color: '#FFFFFF', backgroundColor: '#1C1C1E', textAlignVertical: 'top' },
    switchRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
    helpText: { fontSize: 14, color: '#8E8E93', fontStyle: 'italic' },
    createButton: { backgroundColor: '#0A84FF', paddingVertical: 16, paddingHorizontal: 24, borderRadius: 8, alignItems: 'center', marginTop: 20 },
    createButtonDisabled: { backgroundColor: '#8E8E93', opacity: 0.6 },
    createButtonText: { color: '#FFFFFF', fontSize: 18, fontWeight: '600' },
    binItem: { padding: 16, borderBottomWidth: 1, borderBottomColor: '#38383A', backgroundColor: '#1C1C1E', marginBottom: 8, borderRadius: 8 },
    binTitle: { fontSize: 18, fontWeight: '600', color: '#FFFFFF', marginBottom: 4 },
    binOwner: { fontSize: 14, color: '#8E8E93', marginBottom: 8 },
    binPrivacyRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
    binPrivacyLabel: { fontSize: 14, color: '#FFFFFF' },
    inviteButton: { backgroundColor: '#0A84FF', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 6, alignSelf: 'flex-start' },
    inviteLabel: { color: '#FFFFFF', fontSize: 14, fontWeight: '500' },
  },
};

interface ThemeContextType {
  tokens: ThemeTokens;
  theme: ThemeTokens;
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  const tokens = isDarkMode ? darkTheme : lightTheme;
  
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <ThemeContext.Provider value={{ tokens, theme: tokens, isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }

  // Runtime validation hook
  useEffect(() => {
    console.log('🎨 useTheme hook initialized - Runtime validation active');
    console.log('📊 Theme state:', {
      isDark: context.isDarkMode,
      colors: Object.keys(context.tokens.colors).length,
      spacing: Object.keys(context.tokens.spacing).length,
      typography: Object.keys(context.tokens.typography).length
    });
  }, [context.isDarkMode]);

  return context;
} 