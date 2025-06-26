import {
  View,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { useTheme } from '../../../theme/ThemeProvider';
import { useAuth } from '../../auth/hooks/useAuth';
import { useThoughtmarks } from '../hooks/useThoughtmarks';
import { useBins } from '../hooks/useBins';
import { Text } from '../../../components/ui/Text';
import { ThoughtmarkCard } from '../components/ThoughtmarkCard';
import type { Thoughtmark, Bin, ThoughtmarkWithBin } from '../../../types';
import { ModernHeader } from '../../../components/ui/ModernHeader';
import { BottomNav } from '../../../components/ui/BottomNav';

export const HomeScreen = ({ navigation }: { navigation: any }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBin, setSelectedBin] = useState<Bin | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const { tokens } = useTheme();
  const { user } = useAuth();

  const {
    thoughtmarks,
    loading: thoughtmarksLoading,
    error: thoughtmarksError,
    fetchThoughtmarks,
    searchThoughtmarks,
  } = useThoughtmarks();

  const {
    bins,
    loading: binsLoading,
    fetchBins,
  } = useBins();

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    await Promise.all([
      fetchThoughtmarks(),
      fetchBins(),
    ]);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadInitialData();
    setRefreshing(false);
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      await searchThoughtmarks(query);
    } else {
      await fetchThoughtmarks();
    }
  };

  const handleThoughtmarkPress = (thoughtmark: Thoughtmark) => {
    navigation.navigate('ThoughtmarkDetail', { thoughtmarkId: thoughtmark.id });
  };

  const handleThoughtmarkEdit = (thoughtmark: Thoughtmark) => {
    navigation.navigate('CreateThoughtmark', { thoughtmarkId: thoughtmark.id });
  };

  const handleCreateNew = () => {
    navigation.navigate('CreateThoughtmark');
  };

  const handleBinPress = (bin: Bin) => {
    setSelectedBin(bin);
    navigation.navigate('BinDetail', { binId: bin.id });
  };

  const handleTagPress = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const handleClearAllTags = () => {
    setSelectedTags([]);
  };

  const handlePinToggle = async (thoughtmarkId: string, pinned: boolean) => {
    try {
      // TODO: Implement API call to toggle pin status
      // await apiRequest("POST", `/api/thoughtmarks/${thoughtmarkId}/toggle-pin`, { pinned });
      console.log(`Thoughtmark ${thoughtmarkId} ${pinned ? 'pinned' : 'unpinned'}`);
      
      // For now, we'll just log the action
      // In a real implementation, you would update the local state and sync with backend
    } catch (error) {
      console.error('Failed to toggle pin status:', error);
    }
  };

  // Convert Thoughtmark to ThoughtmarkWithBin by adding binName
  const thoughtmarksWithBin: ThoughtmarkWithBin[] = thoughtmarks.map(tm => ({
    ...tm,
    binName: bins.find(bin => bin.id === tm.binId)?.name,
  }));

  // Get all unique tags from thoughtmarks
  const allTags = Array.from(
    new Set(
      thoughtmarks
        .flatMap(tm => tm.tags)
        .filter(tag => tag.trim().length > 0)
    )
  ).sort();

  // Filter thoughtmarks by selected bin and tags
  const filteredThoughtmarks = thoughtmarksWithBin.filter(tm => {
    const matchesBin = !selectedBin || tm.binId === selectedBin.id;
    const matchesTags = selectedTags.length === 0 || 
      selectedTags.some(tag => tm.tags.includes(tag));
    return matchesBin && matchesTags;
  });

  const recentThoughtmarks = filteredThoughtmarks
    .filter(tm => !tm.isArchived && !tm.isDeleted)
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5);

  const pinnedThoughtmarks = filteredThoughtmarks.filter(tm => tm.isPinned);

  const renderThoughtmarkCard = ({ item }: { item: ThoughtmarkWithBin }) => (
    <ThoughtmarkCard
      thoughtmark={item}
      onClick={() => handleThoughtmarkPress(item)}
      onEdit={() => handleThoughtmarkEdit(item)}
      onArchive={() => {
        // TODO: Implement archive functionality
        console.log('Archive thoughtmark:', item.id);
      }}
      onPinToggle={handlePinToggle}
    />
  );

  const handleProfilePress = () => {
    navigation.navigate('Profile');
  };

  const handleVoiceRecord = () => {
    navigation.navigate('VoiceRecord');
  };

  const handleViewBins = () => {
    navigation.navigate('Bins');
  };

  const handleNavigate = (route: string) => {
    navigation.navigate(route);
  };

  const quickActions = [
    {
      title: 'Create Thoughtmark',
      icon: 'create',
      onPress: handleCreateNew,
      color: tokens.colors.accent,
    },
    {
      title: 'Voice Record',
      icon: 'mic',
      onPress: handleVoiceRecord,
      color: tokens.colors.accent,
    },
    {
      title: 'View Bins',
      icon: 'folder',
      onPress: handleViewBins,
      color: tokens.colors.accent,
    },
  ];

  const tags = allTags;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: tokens.colors.background }}>
      <ModernHeader 
        title="HOME" 
      />

      <ScrollView 
        style={{ 
          flex: 1,
          paddingHorizontal: tokens.spacing.lg,
          paddingVertical: tokens.spacing.md,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Section */}
        <TouchableOpacity 
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: tokens.spacing.sm,
            borderRadius: tokens.radius.full,
            backgroundColor: tokens.colors.backgroundSecondary,
            marginBottom: tokens.spacing.lg,
          }}
          onPress={() = accessibilityRole="button" accessible={true} accessibilityLabel="Button"> navigation.navigate('Account' as any)}
        >
          <Ionicons name="person-circle-outline" size={24} color={tokens.colors.text} />
          <Text style={{ marginLeft: tokens.spacing.sm, fontWeight: '600' }}>
            {user?.firstName || 'User'}
          </Text>
        </TouchableOpacity>

        {/* Quick Actions */}
        <View style={{ marginBottom: tokens.spacing.lg }}>
          <Text 
            variant="subheading" 
            size="lg"
            style={{ 
              marginBottom: tokens.spacing.sm,
              paddingHorizontal: tokens.spacing.lg,
            }}
          >
            Quick Actions
          </Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: tokens.spacing.md }}
          >
            {quickActions.map((action) => (
              <TouchableOpacity
                key={action.title}
                style={{
                  alignItems: 'center',
                  marginRight: tokens.spacing.lg,
                  minWidth: 80,
                }}
                onPress={action.onPress}
               accessibilityRole="button" accessible={true} accessibilityLabel="Button">
                <View style={{
                  width: 60,
                  height: 60,
                  borderRadius: tokens.radius.md,
                  marginHorizontal: tokens.spacing.xs,
                  backgroundColor: action.color || tokens.colors.surface,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: tokens.spacing.xs,
                }}>
                  <Ionicons name={action.icon} size={24} color={tokens.colors.text} />
                </View>
                <Text 
                  variant="caption" 
                  size="sm"
                  style={{ 
                    textAlign: 'center',
                    marginBottom: tokens.spacing.xs,
                  }}
                >
                  {action.title}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Recent Thoughtmarks */}
        <View style={{ marginBottom: tokens.spacing.lg }}>
          <Text 
            variant="subheading" 
            size="lg"
            style={{ 
              marginBottom: tokens.spacing.sm,
              paddingHorizontal: tokens.spacing.lg,
            }}
          >
            Recent Thoughtmarks
          </Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: tokens.spacing.md }}
          >
            {recentThoughtmarks.map((thoughtmark) => (
              <TouchableOpacity
                key={thoughtmark.id}
                style={{
                  width: 200,
                  marginRight: tokens.spacing.md,
                  padding: tokens.spacing.md,
                  backgroundColor: tokens.colors.surface,
                  borderRadius: tokens.radius.md,
                }}
                onPress={() = accessibilityRole="button" accessible={true} accessibilityLabel="Button"> navigation.navigate('ThoughtmarkDetail', { thoughtmarkId: thoughtmark.id })}
              >
                <Text 
                  variant="subheading" 
                  size="sm"
                  style={{ 
                    marginBottom: tokens.spacing.xs,
                    fontWeight: '600',
                  }}
                  numberOfLines={1}
                >
                  {thoughtmark.title}
                </Text>
                <Text 
                  variant="body" 
                  size="sm"
                  style={{ 
                    color: tokens.colors.textSecondary,
                  }}
                  numberOfLines={2}
                >
                  {thoughtmark.content}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Stats */}
        <View style={{ marginBottom: tokens.spacing.lg }}>
          <Text 
            variant="subheading" 
            size="lg"
            style={{ 
              marginBottom: tokens.spacing.sm,
              paddingHorizontal: tokens.spacing.lg,
            }}
          >
            Your Stats
          </Text>
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-around',
            paddingHorizontal: tokens.spacing.lg,
          }}>
            <View style={{ alignItems: 'center' }}>
              <Text variant="heading" size="xl" style={{ color: tokens.colors.accent }}>
                {thoughtmarks.length}
              </Text>
              <Text variant="caption" size="sm" style={{ color: tokens.colors.textSecondary }}>
                Thoughtmarks
              </Text>
            </View>
            <View style={{ alignItems: 'center' }}>
              <Text variant="heading" size="xl" style={{ color: tokens.colors.accent }}>
                {bins.length}
              </Text>
              <Text variant="caption" size="sm" style={{ color: tokens.colors.textSecondary }}>
                Bins
              </Text>
            </View>
            <View style={{ alignItems: 'center' }}>
              <Text variant="heading" size="xl" style={{ color: tokens.colors.accent }}>
                {tags.length}
              </Text>
              <Text variant="caption" size="sm" style={{ color: tokens.colors.textSecondary }}>
                Tags
              </Text>
            </View>
          </View>
        </View>

        {/* Tips */}
        <View style={{ marginBottom: tokens.spacing.lg }}>
          <Text 
            variant="subheading" 
            size="lg"
            style={{ 
              marginBottom: tokens.spacing.sm,
              paddingHorizontal: tokens.spacing.lg,
            }}
          >
            Tips & Tricks
          </Text>
          <View style={{
            paddingHorizontal: tokens.spacing.lg,
          }}>
            <Text variant="body" style={{ textAlign: 'center', marginBottom: tokens.spacing.lg }}>
              Use voice recording to quickly capture ideas on the go. Long press any thoughtmark for quick actions.
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <BottomNav
        onNavigate={handleNavigate}
        onVoiceRecord={handleVoiceRecord}
        showCreateButton={true}
        currentRoute="/"
        onCreateNew={handleCreateNew}
      />
    </SafeAreaView>
  );
};