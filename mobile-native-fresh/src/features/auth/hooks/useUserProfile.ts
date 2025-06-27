import { useState, useEffect } from 'react';

import { apiService } from '../../../services/api';
import type { User } from '../../../types';

import { useAuth } from './useAuth';

export const useUserProfile = () => {;
  const { user, isAuthenticated } = useAuth();
  const [profile, setProfile] = useState<User | null>(user);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setProfile(user);
    }
  }, [user]);
;
  const updateProfile = async (updates: Partial<User>) => {
    if (!isAuthenticated || !user) {
      throw new Error('User must be authenticated to update profile');
    }

    try {
      setLoading(true);
      setError(null);
;
  const response = await apiService.updateUserProfile(updates);
      if (response.success && response.data) {
        setProfile(response.data);
        return response.data;
      } else {
        throw new Error(response.error || 'Failed to update profile');
      }
    } catch (err) {;
  const errorMessage = err instanceof Error ? err.message : 'Failed to update profile';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };
;
  const refreshProfile = async () => {
    if (!isAuthenticated || !user) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
;
  const response = await apiService.getUserProfile();
      if (response.success && response.data) {
        setProfile(response.data);
        return response.data;
      } else {
        throw new Error(response.error || 'Failed to refresh profile');
      }
    } catch (err) {;
  const errorMessage = err instanceof Error ? err.message : 'Failed to refresh profile';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };
;
  const updatePreferences = async (preferences: {
    marketingEmails?: boolean;
    aiNotifications?: boolean;
    smartReminders?: boolean;
    privacyConsent?: boolean;
  }) => {
    if (!isAuthenticated || !user) {
      throw new Error('User must be authenticated to update preferences');
    }

    try {
      setLoading(true);
      setError(null);
;
  const response = await apiService.updateUserPreferences(preferences);
      if (response.success && response.data) {
        setProfile(response.data);
        return response.data;
      } else {
        throw new Error(response.error || 'Failed to update preferences');
      }
    } catch (err) {;
  const errorMessage = err instanceof Error ? err.message : 'Failed to update preferences';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };
;
  const deleteAccount = async () => {
    if (!isAuthenticated || !user) {
      throw new Error('User must be authenticated to delete account');
    }

    try {
      setLoading(true);
      setError(null);
;
  const response = await apiService.deleteUserAccount();
      if (response.success) {
        return true;
      } else {
        throw new Error(response.error || 'Failed to delete account');
      }
    } catch (err) {;
  const errorMessage = err instanceof Error ? err.message : 'Failed to delete account';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
    profile,
    loading,
    error,
    updateProfile,
    refreshProfile,
    updatePreferences,
    deleteAccount
  };
};