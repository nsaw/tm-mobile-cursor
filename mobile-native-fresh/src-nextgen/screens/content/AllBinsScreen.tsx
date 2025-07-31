import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { 
  View, 
  TextInput, 
  FlatList, 
  Text, 
  Switch, 
  TouchableOpacity, 
  ActivityIndicator,
  Alert,
  RefreshControl,
  KeyboardAvoidingView,
  Platform
} from 'react-native';

import { AutoRoleView } from '../../components/AutoRoleView';
import { useBins } from '../../hooks/useBins';
import { useThemeWithStyles } from '../../hooks/useThemeWithStyles';
import { SecurityManager } from '../../utils/SecurityManager';
import { ValidationSystem } from '../../utils/ValidationSystem';
import { PerformanceMonitor , withPerformanceMonitoring } from '../../utils/PerformanceMonitor';
import { ErrorBoundary } from '../../components/ErrorBoundary';

interface BinItemProps {
  item: {
    id: number;
    name: string;
    owner: string;
    isPublic: boolean;
    createdAt: string;
    updatedAt: string;
    collaboratorCount: number;
    thoughtmarkCount: number;
  };
  onTogglePrivacy: (id: number) => Promise<void>;
  onInviteCollaborator: (id: number) => Promise<void>;
  theme: any;
}

const BinItem: React.FC<BinItemProps> = React.memo(({ 
  item, 
  onTogglePrivacy, 
  onInviteCollaborator, 
  theme 
}) => {
  const [isToggling, setIsToggling] = useState(false);
  const [isInviting, setIsInviting] = useState(false);

  const handleTogglePrivacy = useCallback(async () => {
    try {
      setIsToggling(true);
      await onTogglePrivacy(item.id);
    } catch (error) {
      console.error('Failed to toggle privacy:', error);
      Alert.alert('Error', 'Failed to update privacy settings. Please try again.');
    } finally {
      setIsToggling(false);
    }
  }, [item.id, onTogglePrivacy]);

  const handleInviteCollaborator = useCallback(async () => {
    try {
      setIsInviting(true);
      await onInviteCollaborator(item.id);
    } catch (error) {
      console.error('Failed to invite collaborator:', error);
      Alert.alert('Error', 'Failed to invite collaborator. Please try again.');
    } finally {
      setIsInviting(false);
    }
  }, [item.id, onInviteCollaborator]);

  const formatDate = useCallback((dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (error) {
      console.warn('Failed to format date:', error);
      return 'Unknown date';
    }
  }, []);

  return (
    <View style={[theme.styles.binItem, { opacity: isToggling || isInviting ? 0.6 : 1 }]}>
      <Text style={theme.styles.binTitle} numberOfLines={1} ellipsizeMode="tail">
        {item.name}
      </Text>
      
      <Text style={theme.styles.binOwner} numberOfLines={1} ellipsizeMode="tail">
        Owner: {item.owner}
      </Text>
      
      <Text style={theme.styles.binMetadata}>
        Created: {formatDate(item.createdAt)} • {item.thoughtmarkCount} items
      </Text>

      <View style={theme.styles.binPrivacyRow}>
        <Text style={theme.styles.binPrivacyLabel}>Private</Text>
        <Switch
          value={!item.isPublic}
          onValueChange={handleTogglePrivacy}
          disabled={isToggling}
          accessibilityLabel={`Toggle privacy for ${item.name}`}
          accessibilityHint="Double tap to toggle between public and private"
        />
      </View>

      <TouchableOpacity
        onPress={handleInviteCollaborator}
        disabled={isInviting}
        style={[
          theme.styles.inviteButton,
          { opacity: isInviting ? 0.6 : 1 }
        ]}
        accessibilityRole="button"
        accessibilityLabel={`Invite collaborators to ${item.name}`}
        accessibilityHint="Double tap to invite collaborators"
      >
        <Text style={theme.styles.inviteLabel}>
          {isInviting ? 'Inviting...' : `Invite (${item.collaboratorCount})`}
        </Text>
      </TouchableOpacity>
    </View>
  );
});

const AllBinsScreen: React.FC = () => {
  const theme = useThemeWithStyles();
  const { 
    bins, 
    fetchBins, 
    togglePrivacy, 
    inviteCollaborator, 
    filter, 
    setFilter,
    isLoading,
    error,
    cleanup
  } = useBins();
  
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [securityManager] = useState(() => SecurityManager.getInstance());
  const [validationSystem] = useState(() => ValidationSystem.getInstance());
  const [performanceMonitor] = useState(() => PerformanceMonitor.getInstance());

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Update filter when debounced query changes
  useEffect(() => {
    if (validationSystem.validateSearchQuery(debouncedSearchQuery)) {
      setFilter(debouncedSearchQuery);
    } else {
      console.warn('Invalid search query detected:', debouncedSearchQuery);
    }
  }, [debouncedSearchQuery, setFilter, validationSystem]);

  // Initial data fetch
  useEffect(() => {
    const loadBins = async () => {
      try {
        performanceMonitor.recordComponentRender('AllBinsScreen', 'nextgen');
        
        // Validate user permissions
        const hasPermission = await securityManager.validateUserPermissions('bins:read');
        if (!hasPermission) {
          throw new Error('Insufficient permissions to view bins');
        }

        await fetchBins();
      } catch (error) {
        console.error('Failed to load bins:', error);
        performanceMonitor.recordError('AllBinsScreen', error as Error);
      }
    };

    loadBins();

    // Cleanup on unmount
    return () => {
      cleanup();
    };
  }, [fetchBins, cleanup, securityManager, validationSystem, performanceMonitor]);

  const handleTogglePrivacy = useCallback(async (binId: number) => {
    try {
      // Validate bin ID
      if (!validationSystem.validateBinId(binId)) {
        throw new Error('Invalid bin ID provided');
      }

      // Check permissions
      const hasPermission = await securityManager.validateUserPermissions('bins:update');
      if (!hasPermission) {
        throw new Error('Insufficient permissions to update bin privacy');
      }

      await togglePrivacy(binId);
      performanceMonitor.recordUserAction('bin_privacy_toggle', { binId });
    } catch (error) {
      console.error('Privacy toggle failed:', error);
      performanceMonitor.recordError('AllBinsScreen', error as Error);
      throw error;
    }
  }, [togglePrivacy, validationSystem, securityManager, performanceMonitor]);

  const handleInviteCollaborator = useCallback(async (binId: number) => {
    try {
      // Validate bin ID
      if (!validationSystem.validateBinId(binId)) {
        throw new Error('Invalid bin ID provided');
      }

      // Check permissions
      const hasPermission = await securityManager.validateUserPermissions('bins:invite');
      if (!hasPermission) {
        throw new Error('Insufficient permissions to invite collaborators');
      }

      await inviteCollaborator(binId);
      performanceMonitor.recordUserAction('bin_invite_collaborator', { binId });
    } catch (error) {
      console.error('Collaborator invitation failed:', error);
      performanceMonitor.recordError('AllBinsScreen', error as Error);
      throw error;
    }
  }, [inviteCollaborator, validationSystem, securityManager, performanceMonitor]);

  const handleRefresh = useCallback(async () => {
    try {
      setRefreshing(true);
      await fetchBins();
      performanceMonitor.recordUserAction('bins_refresh');
    } catch (error) {
      console.error('Refresh failed:', error);
      performanceMonitor.recordError('AllBinsScreen', error as Error);
    } finally {
      setRefreshing(false);
    }
  }, [fetchBins, performanceMonitor]);

  const handleSearchChange = useCallback((text: string) => {
    setSearchQuery(text);
  }, []);

  const filteredBins = useMemo(() => {
    if (!debouncedSearchQuery.trim()) {
      return bins;
    }

    const query = debouncedSearchQuery.toLowerCase();
    return bins.filter(bin => 
      bin.name.toLowerCase().includes(query) ||
      bin.owner.toLowerCase().includes(query)
    );
  }, [bins, debouncedSearchQuery]);

  const renderItem = useCallback(({ item }: { item: any }) => (
    <BinItem
      item={item}
      onTogglePrivacy={handleTogglePrivacy}
      onInviteCollaborator={handleInviteCollaborator}
      theme={theme}
    />
  ), [handleTogglePrivacy, handleInviteCollaborator, theme]);

  const renderEmptyState = useCallback(() => {
    if (isLoading) {
      return (
        <View style={theme.styles.emptyContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={theme.styles.loadingText}>Loading bins...</Text>
        </View>
      );
    }

    if (error) {
      return (
        <View style={theme.styles.errorContainer}>
          <Text style={theme.styles.errorText}>{error}</Text>
          <TouchableOpacity onPress={fetchBins} style={theme.styles.retryButton}>
            <Text style={theme.styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (debouncedSearchQuery && filteredBins.length === 0) {
      return (
        <View style={theme.styles.emptyContainer}>
          <Text style={theme.styles.emptyText}>No bins match your search</Text>
        </View>
      );
    }

    return (
      <View style={theme.styles.emptyContainer}>
        <Text style={theme.styles.emptyText}>No bins available</Text>
      </View>
    );
  }, [isLoading, error, debouncedSearchQuery, filteredBins.length, theme, fetchBins]);

  const keyExtractor = useCallback((item: any) => item.id.toString(), []);

  return (
    <ErrorBoundary>
      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <AutoRoleView style={theme.styles.screenContainer}>
          <TextInput
            placeholder="Search Bins..."
            value={searchQuery}
            onChangeText={handleSearchChange}
            style={theme.styles.input}
            accessibilityLabel="Search bins by name or owner"
            accessibilityHint="Type to search for bins by name or owner"
            returnKeyType="search"
            autoCapitalize="none"
            autoCorrect={false}
            clearButtonMode="while-editing"
          />

          <FlatList
            data={filteredBins}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            ListEmptyComponent={renderEmptyState}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
                colors={[theme.colors.primary]}
                tintColor={theme.colors.primary}
              />
            }
            accessibilityLabel="List of all bins"
            accessibilityHint="Scroll to view all available bins"
            showsVerticalScrollIndicator={false}
            removeClippedSubviews={true}
            maxToRenderPerBatch={10}
            windowSize={10}
            initialNumToRender={5}
            getItemLayout={(data, index) => ({
              length: 120, // Approximate item height
              offset: 120 * index,
              index,
            })}
          />
        </AutoRoleView>
      </KeyboardAvoidingView>
    </ErrorBoundary>
  );
};

export default withPerformanceMonitoring(AllBinsScreen, 'AllBinsScreen', 'nextgen'); 