import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { useTheme } from '../theme/ThemeProvider';
import { useAppStore } from '../state/store';
import { VoiceRecorderProvider } from '../components/ui/VoiceRecorderProvider';


interface ComponentIntegrationProps {
  children: React.ReactNode;
}

export const ComponentIntegration: React.FC<ComponentIntegrationProps> = ({ children }) => {
  const { tokens: _tokens } = useTheme();
  const { user: _user, isAuthenticated } = useAppStore();

  if (!isAuthenticated) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <VoiceRecorderProvider>
      <View style={styles.container}>
        {children}
      </View>
    </VoiceRecorderProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  loadingText: {
    color: '#FFFFFF',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 50,
  },
});
