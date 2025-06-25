import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  FlatList,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '../../../components/ui/Text';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { useTheme } from '../../../theme/ThemeProvider';
import { BinCard } from '../../home/components/BinCard';
import { useBins } from '../../home/hooks/useBins';
import { useThoughtmarks } from '../../home/hooks/useThoughtmarks';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ModernHeader } from '../../../components/ui/ModernHeader';
import { BottomNav } from '../../../components/ui/BottomNav';
import { useVoiceRecorder } from '../../../components/ui/VoiceRecorderProvider';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../../navigation/types';
import { designTokens } from '../../../theme/tokens';

type NavigationProp = StackNavigationProp<RootStackParamList>;

export const AllBinsScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute();
  const { tokens } = useTheme();
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
      style={{
        paddingHorizontal: designTokens.spacing.md,
        paddingVertical: designTokens.spacing.sm,
        borderRadius: designTokens.radius.sm,
        backgroundColor: sortBy === sortType ? designTokens.colors.accent : designTokens.colors.backgroundSecondary,
        borderWidth: 1,
        borderColor: sortBy === sortType ? designTokens.colors.accent : designTokens.colors.border,
      }}
      onPress={() => setSortBy(sortType)}
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

  return (
    <View style={{ flex: 1, backgroundColor: designTokens.colors.background }}>
      <ModernHeader title="ALL BINS" subtitle="Organize your thoughtmarks into collections" />

      {/* Stats */}
      {renderBinStats()}

      {/* Controls */}
      <View style={{
        paddingHorizontal: designTokens.spacing.lg,
        paddingBottom: designTokens.spacing.md,
      }}>
        <Text 
          variant="body" 
          style={{
            fontWeight: '600',
            marginBottom: designTokens.spacing.sm,
          }}
        >
          Sort by:
        </Text>
        <View style={{
          flexDirection: 'row',
          gap: designTokens.spacing.sm,
        }}>
          {renderSortButton('name', 'Name')}
          {renderSortButton('count', 'Count')}
          {renderSortButton('date', 'Date')}
        </View>
      </View>

      {/* Bins List */}
      <View style={{
        flex: 1,
        paddingHorizontal: designTokens.spacing.lg,
      }}>
        {loading ? (
          <View style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
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
              <TouchableOpacity onPress={() => handleBinPress(item)}>
                <BinCard bin={item} onPress={() => handleBinPress(item)} />
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={{ paddingBottom: designTokens.spacing.xl }}
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
              <View style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                paddingVertical: designTokens.spacing.xl,
              }}>
                <Ionicons name="folder" size={64} color={designTokens.colors.textMuted} />
                <Text 
                  variant="subheading" 
                  style={{
                    marginTop: designTokens.spacing.md,
                    marginBottom: designTokens.spacing.sm,
                  }}
                >
                  No bins found
                </Text>
                <Text 
                  variant="body" 
                  style={{
                    textAlign: 'center',
                    marginBottom: designTokens.spacing.lg,
                  }}
                >
                  Create your first bin to organize your thoughtmarks
                </Text>
                <Button variant="primary" onPress={handleCreateBin}>
                  <Ionicons name="add" size={20} color={designTokens.colors.background} />
                  <Text style={{ marginLeft: designTokens.spacing.sm }}>Create Bin</Text>
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