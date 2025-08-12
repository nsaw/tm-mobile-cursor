import React from 'react';
import { render } from '@testing-library/react-native';
import { VoiceRecorderProvider } from '../src-nextgen/providers/VoiceRecorderProvider';
import { ThemeProvider } from '../src-nextgen/providers/ThemeProvider';
import { AuthProvider } from '../src-nextgen/providers/AuthProvider';
import { NavigationProvider } from '../src-nextgen/providers/NavigationProvider';
import { DashboardScreen } from '../src-nextgen/screens/dashboard/DashboardScreen';
import { LoginScreen } from '../src-nextgen/screens/auth/LoginScreen';
import { SettingsScreen } from '../src-nextgen/screens/settings/SettingsScreen';
import { ProfileScreen } from '../src-nextgen/screens/profile/ProfileScreen';
import { AIScreen } from '../src-nextgen/screens/ai/AIScreen';
import { VoiceScreen } from '../src-nextgen/screens/voice/VoiceScreen';

describe('Provider/Hook Usage Audit', () => {
  const mockNavigation = {} as { navigate: (screen: string, params?: Record<string, unknown>) => void };

  describe('VoiceRecorderProvider', () => {
    it('DashboardScreen must NOT throw when wrapped with VoiceRecorderProvider', () => {
      expect(() =>
        render(
          <VoiceRecorderProvider>
            <DashboardScreen navigation={mockNavigation} />
          </VoiceRecorderProvider>
        )
      ).not.toThrow();
    });

    it('VoiceScreen must NOT throw when wrapped with VoiceRecorderProvider', () => {
      expect(() =>
        render(
          <VoiceRecorderProvider>
            <VoiceScreen navigation={mockNavigation} />
          </VoiceRecorderProvider>
        )
      ).not.toThrow();
    });

    it('AIScreen must NOT throw when wrapped with VoiceRecorderProvider', () => {
      expect(() =>
        render(
          <VoiceRecorderProvider>
            <AIScreen navigation={mockNavigation} />
          </VoiceRecorderProvider>
        )
      ).not.toThrow();
    });
  });

  describe('ThemeProvider', () => {
    it('DashboardScreen must NOT throw when wrapped with ThemeProvider', () => {
      expect(() =>
        render(
          <ThemeProvider>
            <DashboardScreen navigation={mockNavigation} />
          </ThemeProvider>
        )
      ).not.toThrow();
    });

    it('SettingsScreen must NOT throw when wrapped with ThemeProvider', () => {
      expect(() =>
        render(
          <ThemeProvider>
            <SettingsScreen navigation={mockNavigation} />
          </ThemeProvider>
        )
      ).not.toThrow();
    });

    it('ProfileScreen must NOT throw when wrapped with ThemeProvider', () => {
      expect(() =>
        render(
          <ThemeProvider>
            <ProfileScreen navigation={mockNavigation} />
          </ThemeProvider>
        )
      ).not.toThrow();
    });
  });

  describe('AuthProvider', () => {
    it('LoginScreen must NOT throw when wrapped with AuthProvider', () => {
      expect(() =>
        render(
          <AuthProvider>
            <LoginScreen navigation={mockNavigation} />
          </AuthProvider>
        )
      ).not.toThrow();
    });

    it('ProfileScreen must NOT throw when wrapped with AuthProvider', () => {
      expect(() =>
        render(
          <AuthProvider>
            <ProfileScreen navigation={mockNavigation} />
          </AuthProvider>
        )
      ).not.toThrow();
    });

    it('SettingsScreen must NOT throw when wrapped with AuthProvider', () => {
      expect(() =>
        render(
          <AuthProvider>
            <SettingsScreen navigation={mockNavigation} />
          </AuthProvider>
        )
      ).not.toThrow();
    });
  });

  describe('NavigationProvider', () => {
    it('DashboardScreen must NOT throw when wrapped with NavigationProvider', () => {
      expect(() =>
        render(
          <NavigationProvider>
            <DashboardScreen navigation={mockNavigation} />
          </NavigationProvider>
        )
      ).not.toThrow();
    });

    it('LoginScreen must NOT throw when wrapped with NavigationProvider', () => {
      expect(() =>
        render(
          <NavigationProvider>
            <LoginScreen navigation={mockNavigation} />
          </NavigationProvider>
        )
      ).not.toThrow();
    });

    it('SettingsScreen must NOT throw when wrapped with NavigationProvider', () => {
      expect(() =>
        render(
          <NavigationProvider>
            <SettingsScreen navigation={mockNavigation} />
          </NavigationProvider>
        )
      ).not.toThrow();
    });
  });
});
