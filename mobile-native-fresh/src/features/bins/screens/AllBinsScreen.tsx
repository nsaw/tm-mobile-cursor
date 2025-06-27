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
import { StackNavigationProp } from '@react-navigation/stack';

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
import { RootStackParamList } from '../../../navigation/types';

type SortType = 'name' | 'count' | 'date' | 'created' | 'updated';

export const AllBinsScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute();
  const { tokens } = useTheme();
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
        paddingHorizontal: tokens.spacing.md,
        paddingVertical: tokens.spacing.sm,
        borderRadius: tokens.radius.sm,
        backgroundColor: sortBy === sortType ? tokens.colors.accent : tokens.colors.backgroundSecondary,
        borderWidth: 1,
        borderColor: sortBy === sortType ? tokens.colors.accent : tokens.colors.border,
      }}
      onPress={() => setSortBy(sortType as SortType)}
      accessibilityRole="button"
      accessible={true}
      accessibilityLabel={sortType}
          >
      <Text 
        variant="body" 
        style={{
          color: sortBy === sortType ? tokens.colors.background : tokens.colors.text,
          fontWeight: '500',
        }}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  const renderBinStats = () => (
    <View style={{
      paddingHorizontal: tokens.spacing.lg,
      marginBottom: tokens.spacing.md,
    }}>
      <Card style={{ padding: tokens.spacing.lg }}>
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
                color: tokens.colors.accent,
                marginBottom: tokens.spacing.xs,
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
            backgroundColor: tokens.colors.border,
            marginHorizontal: tokens.spacing.md,
          }} />
          <View style={{
            alignItems: 'center',
            flex: 1,
          }}>
            <Text 
              variant="heading" 
              size="xl"
              style={{
                color: tokens.colors.accent,
                marginBottom: tokens.spacing.xs,
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
            backgroundColor: tokens.colors.border,
            marginHorizontal: tokens.spacing.md,
          }} />
          <View style={{
            alignItems: 'center',
            flex: 1,
          }}>
            <Text 
              variant="heading" 
              size="xl"
              style={{
                color: tokens.colors.accent,
                marginBottom: tokens.spacing.xs,
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
    sortButton: {
      paddingHorizontal: tokens.spacing.md,
      paddingVertical: tokens.spacing.sm,
      borderRadius: tokens.radius.sm,
      backgroundColor: tokens.colors.backgroundSecondary,
      borderWidth: 1,
      borderColor: tokens.colors.border,
      marginRight: tokens.spacing.sm,
    },
    sortButtonActive: {
      backgroundColor: tokens.colors.accent,
      borderColor: tokens.colors.accent,
    },
    sortButtonText: {
      fontSize: tokens.typography.fontSize.sm,
      color: tokens.colors.text,
    },
    sortButtonTextActive: {
      color: tokens.colors.background,
    },
    sortContainer: {
      paddingHorizontal: tokens.spacing.lg,
      marginBottom: tokens.spacing.md,
    },
    binCard: {
      padding: tokens.spacing.lg,
    },
    binIcon: {
      color: tokens.colors.accent,
      marginBottom: tokens.spacing.xs,
    },
    binDivider: {
      height: 1,
      backgroundColor: tokens.colors.border,
      marginHorizontal: tokens.spacing.md,
    },
    container: {
      flex: 1,
      backgroundColor: tokens.colors.background,
    },
    header: {
      paddingHorizontal: tokens.spacing.lg,
      paddingBottom: tokens.spacing.md,
    },
    headerTitle: {
      fontSize: tokens.typography.fontSize.xl,
      fontWeight: tokens.typography.fontWeight.bold,
      color: tokens.colors.text,
      marginBottom: tokens.spacing.sm,
    },
    headerSubtitle: {
      fontSize: tokens.typography.fontSize.body,
      color: tokens.colors.textSecondary,
    },
    content: {
      flex: 1,
      paddingHorizontal: tokens.spacing.lg,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: tokens.spacing.lg,
    },
    emptyIcon: {
      marginBottom: tokens.spacing.md,
    },
    emptyTitle: {
      fontSize: tokens.typography.fontSize.xl,
      fontWeight: tokens.typography.fontWeight.bold,
      color: tokens.colors.text,
      marginTop: tokens.spacing.md,
      marginBottom: tokens.spacing.sm,
      textAlign: 'center',
    },
    emptySubtitle: {
      fontSize: tokens.typography.fontSize.body,
      color: tokens.colors.textSecondary,
      textAlign: 'center',
      marginBottom: tokens.spacing.lg,
    },
    createButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: tokens.colors.accent,
      paddingVertical: tokens.spacing.lg,
      borderRadius: tokens.radius.md,
      marginBottom: tokens.spacing.xl,
    },
    createButtonText: {
      marginLeft: tokens.spacing.sm,
    },
    listContainer: {
      paddingBottom: tokens.spacing.xl,
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
            marginBottom: tokens.spacing.sm,
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
            <ActivityIndicator size="large" color={tokens.colors.accent} />
            <Text 
              variant="body" 
              style={{
                marginTop: tokens.spacing.md,
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
                colors={[tokens.colors.accent]}
                tintColor={tokens.colors.accent}
              />
            }
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Ionicons name="folder" size={64} color={tokens.colors.textMuted} />
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
                  <Ionicons name="add" size={20} color={tokens.colors.background} />
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