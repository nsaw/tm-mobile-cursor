import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../../../theme/theme';
import { Card } from '../../../components/ui/Card';
import { BinCard } from '../../home/components/BinCard';
import { useBins } from '../../home/hooks/useBins';
import { useThoughtmarks } from '../../home/hooks/useThoughtmarks';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ModernHeader } from '../../../components/ui/ModernHeader';
import { BottomNav } from '../../../components/ui/BottomNav';
import { useVoiceRecorder } from '../../../components/ui/VoiceRecorderProvider';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../../navigation/types';

type NavigationProp = StackNavigationProp<RootStackParamList>;

export const AllBinsScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute();
  const { bins, loading, fetchBins } = useBins();
  const { thoughtmarks } = useThoughtmarks();
  
  const [refreshing, setRefreshing] = useState(false);
  const [sortBy, setSortBy] = useState<'name' | 'count' | 'date'>('name');

  const { showVoiceRecorder } = useVoiceRecorder();

  // Get filter parameters from navigation
  const filterParams = route.params as {
    filter?: 'bin';
    binId?: number;
  } | undefined;

  // Get thoughtmark count for each bin
  const binsWithCount = bins.map((bin: any) => ({
    ...bin,
    thoughtmarkCount: thoughtmarks.filter((t: any) => t.binId === bin.id).length,
  }));

  // Sort bins
  const sortedBins = [...binsWithCount].sort((a: any, b: any) => {
    if (sortBy === 'count') {
      return b.thoughtmarkCount - a.thoughtmarkCount;
    }
    if (sortBy === 'date') {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    // Default: sort by name
    return a.name.localeCompare(b.name);
  });

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchBins();
    setRefreshing(false);
  };

  const handleBinPress = (bin: any) => {
    // Navigate to All Thoughtmarks filtered by this bin
    navigation.navigate('AllThoughtmarks', { 
      filter: 'bin',
      binId: bin.id,
      binName: bin.name 
    });
  };

  const handleNavigate = (path: string) => {
    switch (path) {
      case '/':
      case 'Dashboard':
        navigation.navigate('Dashboard' as any);
        break;
      case '/search':
      case 'Search':
        navigation.navigate('Search' as any);
        break;
      case '/all-thoughtmarks':
      case 'AllThoughtmarks':
        navigation.navigate('AllThoughtmarks' as any);
        break;
      case '/ai-tools':
      case 'AITools':
        navigation.navigate('AITools' as any);
        break;
      default:
        console.log('Unknown navigation path:', path);
        break;
    }
  };

  const handleVoiceRecord = () => {
    showVoiceRecorder();
  };

  const handleCreateBin = () => {
    navigation.navigate('CreateBin' as any);
  };

  const renderSortButton = (sortType: 'name' | 'count' | 'date', label: string) => (
    <TouchableOpacity
      style={[styles.sortButton, sortBy === sortType && styles.sortButtonActive]}
      onPress={() => setSortBy(sortType)}
    >
      <Text style={[styles.sortButtonText, sortBy === sortType && styles.sortButtonTextActive]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  const renderBinStats = () => (
    <View style={styles.statsContainer}>
      <Card style={styles.statsCard}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{bins.length}</Text>
          <Text style={styles.statLabel}>Total Bins</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{thoughtmarks.length}</Text>
          <Text style={styles.statLabel}>Total Thoughtmarks</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>
            {bins.length > 0 ? Math.round(thoughtmarks.length / bins.length) : 0}
          </Text>
          <Text style={styles.statLabel}>Avg per Bin</Text>
        </View>
      </Card>
    </View>
  );

  return (
    <View style={styles.container}>
      <ModernHeader title="ALL BINS" subtitle="Organize your thoughtmarks into collections" />

      {/* Stats */}
      {renderBinStats()}

      {/* Controls */}
      <View style={styles.controls}>
        <Text style={styles.filterLabel}>Sort by:</Text>
        <View style={styles.sortButtons}>
          {renderSortButton('name', 'Name')}
          {renderSortButton('count', 'Count')}
          {renderSortButton('date', 'Date')}
        </View>
      </View>

      {/* Bins List */}
      <View style={styles.listContainer}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>Loading bins...</Text>
          </View>
        ) : (
          <FlatList
            data={sortedBins}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => handleBinPress(item)}>
                <BinCard bin={item} onPress={() => handleBinPress(item)} />
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
                colors={[colors.primary]}
                tintColor={colors.primary}
              />
            }
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <Ionicons name="folder" size={64} color={colors.subtext} />
                <Text style={styles.emptyStateTitle}>No bins found</Text>
                <Text style={styles.emptyStateSubtitle}>
                  Create your first bin to organize your thoughtmarks
                </Text>
                <TouchableOpacity
                  style={styles.createButton}
                  onPress={handleCreateBin}
                >
                  <Ionicons name="add" size={20} color={colors.background} />
                  <Text style={styles.createButtonText}>Create Bin</Text>
                </TouchableOpacity>
              </View>
            }
          />
        )}
      </View>

      <BottomNav
        onNavigate={handleNavigate}
        onVoiceRecord={handleVoiceRecord}
        showCreateButton={true}
        currentRoute="/bins"
        onCreateNew={handleCreateBin}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  statsContainer: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  statsCard: {
    padding: spacing.lg,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  statLabel: {
    fontSize: 12,
    color: colors.subtext,
    textAlign: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: colors.border,
    marginHorizontal: spacing.md,
  },
  controls: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
  },
  filterLabel: {
    fontSize: typography.body.fontSize,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  sortButtons: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  sortButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: spacing.sm,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sortButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  sortButtonText: {
    fontSize: typography.body.fontSize,
    color: colors.text,
    fontWeight: '500',
  },
  sortButtonTextActive: {
    color: colors.background,
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  listContent: {
    paddingBottom: spacing.xl,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: spacing.md,
    fontSize: typography.body.fontSize,
    color: colors.subtext,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  emptyStateTitle: {
    fontSize: typography.subheading.fontSize,
    fontWeight: '600',
    color: colors.text,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  emptyStateSubtitle: {
    fontSize: typography.body.fontSize,
    color: colors.subtext,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: spacing.md,
  },
  createButtonText: {
    fontSize: typography.body.fontSize,
    fontWeight: '600',
    color: colors.background,
    marginLeft: spacing.sm,
  },
}); 