import {
  View,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import React, { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';

import type { NavigationProp } from '../../../navigation/types';
import { useTheme } from '../../../theme/ThemeProvider';
import { useBins } from '../../home/hooks/useBins';
import { Text } from '../../../components/ui/Text';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { BinCard } from '../../home/components/BinCard';
import { useThoughtmarks } from '../../home/hooks/useThoughtmarks';
import { ModernHeader } from '../../../components/ui/ModernHeader';
import { BottomNav } from '../../../components/ui/BottomNav';
import { useVoiceRecorder } from '../../../components/ui/VoiceRecorderProvider';

type SortType = 'name' | 'count' | 'date' | 'created' | 'updated';

export const AllBinsScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute();
  const { tokens: designTokens } = useTheme();
  const { bins, loading, fetchBins } = useBins();
  const { thoughtmarks } = useThoughtmarks();
  
  const [refreshing, setRefreshing] = useState(false);
  const [sortBy, setSortBy] = useState<SortType>('name');

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
      style={{
        paddingHorizontal: designTokens.spacing.md,
        paddingVertical: designTokens.spacing.sm,
        borderRadius: designTokens.radius.sm,
        backgroundColor: sortBy === sortType ? designTokens.colors.accent : designTokens.colors.backgroundSecondary,
        borderWidth: 1,
        borderColor: sortBy === sortType ? designTokens.colors.accent : designTokens.colors.border,
      }}
      onPress={() => setSortBy(sortType as SortType)}
      accessibilityRole="button"
      accessible={true}
      accessibilityLabel={sortType}
          >
      <Text 
        variant="body" 
        style={{
          color: sortBy === sortType ? designTokens.colors.background : designTokens.colors.text,
          fontWeight: '500',
        }}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  const renderBinStats = () => (
    <View style={{
      paddingHorizontal: designTokens.spacing.lg,
      marginBottom: designTokens.spacing.md,
    }}>
      <Card style={{ padding: designTokens.spacing.lg }}>
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
        }}>
          <View style={{
            alignItems: 'center',
            flex: 1,
          }}>
            <Text 
              variant="heading" 
              size="xl"
              style={{
                color: designTokens.colors.accent,
                marginBottom: designTokens.spacing.xs,
              }}
            >
              {bins.length}
            </Text>
            <Text 
              variant="caption" 
              style={{ textAlign: 'center' }}
            >
              Total Bins
            </Text>
          </View>
          <View style={{
            width: 1,
            backgroundColor: designTokens.colors.border,
            marginHorizontal: designTokens.spacing.md,
          }} />
          <View style={{
            alignItems: 'center',
            flex: 1,
          }}>
            <Text 
              variant="heading" 
              size="xl"
              style={{
                color: designTokens.colors.accent,
                marginBottom: designTokens.spacing.xs,
              }}
            >
              {thoughtmarks.length}
            </Text>
            <Text 
              variant="caption" 
              style={{ textAlign: 'center' }}
            >
              Total Thoughtmarks
            </Text>
          </View>
          <View style={{
            width: 1,
            backgroundColor: designTokens.colors.border,
            marginHorizontal: designTokens.spacing.md,
          }} />
          <View style={{
            alignItems: 'center',
            flex: 1,
          }}>
            <Text 
              variant="heading" 
              size="xl"
              style={{
                color: designTokens.colors.accent,
                marginBottom: designTokens.spacing.xs,
              }}
            >
              {bins.length > 0 ? Math.round(thoughtmarks.length / bins.length) : 0}
            </Text>
            <Text 
              variant="caption" 
              style={{ textAlign: 'center' }}
            >
              Avg per Bin
            </Text>
          </View>
        </View>
      </Card>
    </View>
  );

  const styles = StyleSheet.create({
    binCard: {
      padding: designTokens.spacing.lg,
    },
    binDivider: {
      backgroundColor: designTokens.colors.border,
      height: 1,
      marginHorizontal: designTokens.spacing.md,
    },
    binIcon: {
      color: designTokens.colors.accent,
      marginBottom: designTokens.spacing.xs,
    },
    container: {
      backgroundColor: designTokens.colors.background,
      flex: 1,
    },
    content: {
      flex: 1,
      paddingHorizontal: designTokens.spacing.lg,
    },
    createButton: {
      alignItems: 'center',
      backgroundColor: designTokens.colors.accent,
      borderRadius: designTokens.radius.md,
      flexDirection: 'row',
      justifyContent: 'center',
      marginBottom: designTokens.spacing.xl,
      paddingVertical: designTokens.spacing.lg,
    },
    createButtonText: {
      marginLeft: designTokens.spacing.sm,
    },
    emptyContainer: {
      alignItems: 'center',
      flex: 1,
      justifyContent: 'center',
      paddingHorizontal: designTokens.spacing.lg,
    },
    emptyIcon: {
      marginBottom: designTokens.spacing.md,
    },
    emptySubtitle: {
      color: designTokens.colors.textSecondary,
      fontSize: designTokens.typography.fontSize.body,
      marginBottom: designTokens.spacing.lg,
      textAlign: 'center',
    },
    emptyTitle: {
      color: designTokens.colors.text,
      fontSize: designTokens.typography.fontSize.xl,
      fontWeight: designTokens.typography.fontWeight.bold,
      marginBottom: designTokens.spacing.sm,
      marginTop: designTokens.spacing.md,
      textAlign: 'center',
    },
    header: {
      paddingBottom: designTokens.spacing.md,
      paddingHorizontal: designTokens.spacing.lg,
    },
    headerSubtitle: {
      color: designTokens.colors.textSecondary,
      fontSize: designTokens.typography.fontSize.body,
    },
    headerTitle: {
      color: designTokens.colors.text,
      fontSize: designTokens.typography.fontSize.xl,
      fontWeight: designTokens.typography.fontWeight.bold,
      marginBottom: designTokens.spacing.sm,
    },
    listContainer: {
      paddingBottom: designTokens.spacing.xl,
    },
    loadingContainer: {
      alignItems: 'center',
      flex: 1,
      justifyContent: 'center',
    },
    sortButton: {
      backgroundColor: designTokens.colors.backgroundSecondary,
      borderColor: designTokens.colors.border,
      borderRadius: designTokens.radius.sm,
      borderWidth: 1,
      marginRight: designTokens.spacing.sm,
      paddingHorizontal: designTokens.spacing.md,
      paddingVertical: designTokens.spacing.sm,
    },
    sortButtonActive: {
      backgroundColor: designTokens.colors.accent,
      borderColor: designTokens.colors.accent,
    },
    sortButtonText: {
      color: designTokens.colors.text,
      fontSize: designTokens.typography.fontSize.sm,
    },
    sortButtonTextActive: {
      color: designTokens.colors.background,
    },
    sortContainer: {
      marginBottom: designTokens.spacing.md,
      paddingHorizontal: designTokens.spacing.lg,
    },
  });

  return (
    <View style={styles.container}>
      <ModernHeader title="ALL BINS" subtitle="Organize your thoughtmarks into collections" />

      {/* Stats */}
      {renderBinStats()}

      {/* Controls */}
      <View style={styles.sortContainer}>
        <Text 
          variant="body" 
          style={{
            fontWeight: '600',
            marginBottom: designTokens.spacing.sm,
          }}
        >
          Sort by:
        </Text>
        <View><Text>{renderSortButton('name', 'Name')}
          {renderSortButton('count', 'Count')}
          {renderSortButton('date', 'Date')}</Text></View>
      </View>

      {/* Bins List */}
      <View style={styles.content}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={designTokens.colors.accent} />
            <Text 
              variant="body" 
              style={{
                marginTop: designTokens.spacing.md,
              }}
            >
              Loading bins...
            </Text>
          </View>
        ) : (
          <FlatList
            data={sortedBins}
            renderItem={({ item }) => (
              <TouchableOpacity 
                onPress={() => handleBinPress(item)}
                accessibilityRole="button"
                accessible={true}
                accessibilityLabel="Button"
              >
                <BinCard bin={item} onPress={() => handleBinPress(item)} />
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
                colors={[designTokens.colors.accent]}
                tintColor={designTokens.colors.accent}
              />
            }
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Ionicons name="folder" size={64} color={designTokens.colors.textMuted} />
                <Text 
                  variant="heading" 
                  style={styles.emptyTitle}
                >
                  No bins found
                </Text>
                <Text 
                  variant="body" 
                  style={styles.emptySubtitle}
                >
                  Create your first bin to organize your thoughtmarks
                </Text>
                <Button variant="primary" onPress={handleCreateBin}>
                  <Ionicons name="add" size={20} color={designTokens.colors.background} />
                  <Text style={styles.createButtonText}>Create Bin</Text>
                </Button>
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