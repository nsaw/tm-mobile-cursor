import React, { useState, useEffect } from 'react';
import {
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  useWindowDimensions,
  Animated,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { RFValue } from 'react-native-responsive-fontsize';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useTheme } from '../../../theme/ThemeProvider';
import { ThoughtmarkCard } from '../components/ThoughtmarkCard';
import { TaskCard } from '../components/TaskCard';
import { AIToolsCard } from '../components/AIToolsCard';
import { useThoughtmarks } from '../hooks/useThoughtmarks';
import { useBins } from '../hooks/useBins';
import { ThoughtmarkWithBin } from '../../../types';
import { DebugScrollView } from '../../../components/devtools/DebugScrollView';
import { BottomNav } from '../../../components/ui/BottomNav';
import { NeonGradientText } from '../../../components/ui/NeonGradientText';
import { useVoiceRecorder } from '../../../components/ui/VoiceRecorderProvider';
import { OnboardingModal } from '../../../components/ui/OnboardingModal';
import { useAuth } from '../../auth/hooks/useAuth';
import { DraggableSection } from '../../../components/ui/DraggableSection';
import { useDashboardOrder } from '../../../hooks/useDashboardOrder';
import { Text as CustomText } from '../../../components/ui/Text';

const { width } = Dimensions.get('window');

interface DashboardScreenProps {
  navigation: any;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({ navigation }) => {
  const { width: windowWidth } = useWindowDimensions();
  const { typography, buttonStyles, spacing, tokens } = useTheme();
  const [refreshing, setRefreshing] = useState(false);
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [localTagFilter, setLocalTagFilter] = useState<string>('all');
  const [showTasksSection, setShowTasksSection] = useState(true);
  const [showBinsSection, setShowBinsSection] = useState(true);
  const [showThoughtmarksSection, setShowThoughtmarksSection] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const { user, isAuthenticated, loading } = useAuth();
  const [showOnboarding, setShowOnboarding] = useState(false);
  
  // Draggable sections state
  const [isDragging, setIsDragging] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [showReorderHint, setShowReorderHint] = useState(false);
  const tooltipOpacity = new Animated.Value(0);
  const infoButtonScale = new Animated.Value(1);
  const { sections, isLoading: sectionsLoading, reorderSections } = useDashboardOrder();

  const {
    thoughtmarks,
    loading: thoughtmarksLoading,
    error: thoughtmarksError,
    fetchThoughtmarks,
  } = useThoughtmarks();

  const {
    bins,
    loading: binsLoading,
    error: binsError,
    fetchBins,
  } = useBins();

  const { showVoiceRecorder } = useVoiceRecorder();

  // Auth blocking logic
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      console.log('DashboardScreen: User not authenticated, redirecting to login');
      navigation.replace('SignIn');
    }
  }, [loading, isAuthenticated, navigation]);

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    if (!user || !user.id) return;
    const checkOnboarding = async () => {
      const isDemo = user.isTestUser || (user.email && user.email.includes('demo'));
      const key = isDemo
        ? `onboarding-demo-last-login-${user.id}`
        : `onboarding-completed-${user.id}`;
      if (isDemo) {
        // Always show for demo users, but only once per login
        const lastLogin = await AsyncStorage.getItem(key);
        const now = Date.now().toString();
        if (lastLogin !== now) {
          setShowOnboarding(true);
          await AsyncStorage.setItem(key, now);
        }
      } else {
        // Show for new users only
        const completed = await AsyncStorage.getItem(key);
        if (!completed) {
          setShowOnboarding(true);
        }
      }
    };
    checkOnboarding();
  }, [user]);

  // Add subtle pulsing animation to info button on mount
  useEffect(() => {
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(infoButtonScale, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(infoButtonScale, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    
    // Start pulsing after a short delay
    const timer = setTimeout(() => {
      pulseAnimation.start();
    }, 2000);
    
    // Stop pulsing after 5 seconds
    const stopTimer = setTimeout(() => {
      pulseAnimation.stop();
    }, 7000);
    
    return () => {
      clearTimeout(timer);
      clearTimeout(stopTimer);
      pulseAnimation.stop();
    };
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

  // Filter thoughtmarks by selected tag
  const filteredThoughtmarks = selectedTag === 'all' 
    ? thoughtmarks.filter(t => !t.isDeleted)
    : thoughtmarks.filter(t => !t.isDeleted && t.tags.includes(selectedTag));

  // Filter recent thoughtmarks by local tag filter
  const recentThoughtmarksFiltered = localTagFilter === 'all'
    ? thoughtmarks.filter(t => !t.isDeleted)
    : thoughtmarks.filter(t => !t.isDeleted && t.tags.includes(localTagFilter));

  // Get active tasks (thoughtmarks with isTask = true and not completed)
  const activeTasks = thoughtmarks.filter(t => t.isTask && !t.isCompleted && !t.isDeleted);

  // Get recent thoughtmarks (limit to 5)
  const recentThoughtmarks = recentThoughtmarksFiltered.slice(0, 5);

  // Get all unique tags
  const allTags = Array.from(new Set(thoughtmarks.flatMap(t => t.tags))).sort();

  // Add bin information to thoughtmarks
  const thoughtmarksWithBin: ThoughtmarkWithBin[] = thoughtmarks.map(thoughtmark => {
    const bin = bins.find(b => b.id === thoughtmark.binId);
    return {
      ...thoughtmark,
      bin: bin || null
    };
  });

  const handleThoughtmarkPress = (thoughtmark: ThoughtmarkWithBin) => {
    console.log('DashboardScreen - Navigating to thoughtmark:', thoughtmark.id, thoughtmark.title);
    console.log('Navigation params:', { thoughtmarkId: thoughtmark.id });
    navigation.navigate('ThoughtmarkDetail', { thoughtmarkId: thoughtmark.id });
  };

  const handleThoughtmarkEdit = (thoughtmark: ThoughtmarkWithBin) => {
    navigation.navigate('CreateThoughtmark', { thoughtmarkId: thoughtmark.id });
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

  const handleTaskToggle = (task: ThoughtmarkWithBin) => {
    // TODO: Implement task toggle
    console.log('Toggle task:', task.id);
  };

  const handleBinPress = (bin: any) => {
    navigation.navigate('AllThoughtmarks', { 
      filter: 'bin', 
      binId: bin.id, 
      binName: bin.name 
    });
  };

  const handleCreateNew = () => {
    navigation.navigate('CreateThoughtmark');
  };

  const handleCreateBin = () => {
    navigation.navigate('CreateBin');
  };

  const handleViewAllThoughtmarks = () => {
    navigation.navigate('AllThoughtmarks');
  };

  const handleViewAllTasks = () => {
    navigation.navigate('AllThoughtmarks', { filter: 'tasks' });
  };

  const handleViewAllBins = () => {
    navigation.navigate('AllBins');
  };

  const handleAIToolsPress = () => {
    navigation.navigate('AITools');
  };

  const handleVoiceRecord = () => {
    showVoiceRecorder();
  };

  const handleNavigate = (path: string) => {
    navigation.navigate(path as any);
  };

  const handleTagPress = (tag: string) => {
    setSelectedTag(tag);
    navigation.navigate('AllThoughtmarks', { 
      filter: 'tag', 
      tag: tag 
    });
  };

  const handleLocalTagPress = (tag: string) => {
    setLocalTagFilter(tag);
  };

  const handleOnboardingClose = async () => {
    setShowOnboarding(false);
    if (user && user.id) {
      const isDemo = user.isTestUser || (user.email && user.email.includes('demo'));
      const key = isDemo
        ? `onboarding-demo-last-login-${user.id}`
        : `onboarding-completed-${user.id}`;
      await AsyncStorage.setItem(key, 'true');
    }
  };

  const handleDragStart = (index: number) => {
    setIsDragging(true);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    setDraggedIndex(null);
  };

  const handleReorder = async (fromIndex: number, toIndex: number) => {
    await reorderSections(fromIndex, toIndex);
  };

  const handleReorderHintPress = () => {
    setShowReorderHint(true);
    Animated.timing(tooltipOpacity, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
    
    // Auto-dismiss after 3 seconds
    setTimeout(() => {
      Animated.timing(tooltipOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start(() => {
        setShowReorderHint(false);
      });
    }, 3000);
  };

  // Runtime data load verification
  useEffect(() => {
    if (!thoughtmarksLoading && !binsLoading) {
      if (!thoughtmarks || thoughtmarks.length === 0) {
        console.warn('DashboardScreen: No thoughtmarks loaded');
      }
      if (!bins || bins.length === 0) {
        console.warn('DashboardScreen: No bins loaded');
      }
      
      // Block commits in development if data is empty
      if (__DEV__) {
        if (!thoughtmarks || thoughtmarks.length === 0) {
          console.error('DashboardScreen: Layout rendering with empty thoughtmarks array');
        }
        if (!bins || bins.length === 0) {
          console.error('DashboardScreen: Layout rendering with empty bins array');
        }
      }
    }
  }, [thoughtmarks, bins, thoughtmarksLoading, binsLoading]);

  // Render section content based on section ID
  const renderSectionContent = (sectionId: string) => {
    switch (sectionId) {
      case 'tags':
        // Tags section is now integrated into recent-thoughtmarks
        return null;
      
      case 'recent-thoughtmarks':
        return (
          <DebugScrollView debugId="recent-thoughtmarks-container">
            {/* Tags Filter - Moved here from separate section */}
            <DebugScrollView debugId="tags-container" style={styles.tagsContainer}>
              <DebugScrollView 
          debugId="tags-header" 
          style={{
            marginBottom: tokens.spacing.md * 1.34,
          }}
          contentContainerStyle={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
                <Text style={styles.tagsTitle}>Filter by tag</Text>
                <TouchableOpacity onPress={handleViewAllThoughtmarks} accessibilityRole="button" accessible={true} accessibilityLabel="Button">
                  <Ionicons name="arrow-forward" size={16} color={tokens.colors.accent} style={{ opacity: 0.7 }} />
                </TouchableOpacity>
              </DebugScrollView>
              <DebugScrollView 
                debugId="tags-horizontal-scroll"
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.tagsScrollContent}
              >
                <TouchableOpacity
                  style={[
                    styles.tagChip,
                    localTagFilter === 'all' && styles.tagChipActive
                  ]}
                  onPress={() => handleLocalTagPress('all')}
                  accessibilityRole="button"
                  accessible={true}
                  accessibilityLabel={`filter by tag: all`}
                >
                  <Text style={[
                    styles.tagChipText,
                    localTagFilter === 'all' && styles.tagChipTextActive
                  ]}>
                    all ({thoughtmarks.filter(t => !t.isDeleted).length})
                  </Text>
                </TouchableOpacity>
                
                {allTags.map((tag) => (
                  <TouchableOpacity
                    key={tag}
                    style={[
                      styles.tagChip,
                      localTagFilter === tag && styles.tagChipActive
                    ]}
                    onPress={() => handleLocalTagPress(tag)}
                    accessibilityRole="button"
                    accessible={true}
                    accessibilityLabel={`filter by tag: ${tag.toLowerCase()}`}
                  >
                    <Text style={[
                      styles.tagChipText,
                      localTagFilter === tag && styles.tagChipTextActive
                    ]}>
                      {tag.toLowerCase()}
                    </Text>
                  </TouchableOpacity>
                ))}
              </DebugScrollView>
            </DebugScrollView>

            {/* Recent Thoughtmarks List */}
            {recentThoughtmarks.length > 0 ? (
              <>
                <DebugScrollView debugId="thoughtmarks-list" style={styles.thoughtmarksList}>
                  {recentThoughtmarks.map((thoughtmark, idx, arr) => (
                    <ThoughtmarkCard
                      key={thoughtmark.id}
                      thoughtmark={thoughtmark}
                      pinned={thoughtmark.isPinned}
                      onClick={() => handleThoughtmarkPress(thoughtmark)}
                      onEdit={() => handleThoughtmarkEdit(thoughtmark)}
                      onPinToggle={handlePinToggle}
                      style={idx !== arr.length - 1 ? { marginBottom: tokens.spacing.xs } : undefined}
                    />
                  ))}
                </DebugScrollView>
                
                {/* View More Card - Reduced height */}
                <TouchableOpacity
                  style={styles.viewMoreCard}
                  onPress={handleViewAllThoughtmarks}
                  accessibilityRole="button"
                  accessible={true}
                  accessibilityLabel="Button"
                >
                  <Text style={styles.viewMoreCount}>{filteredThoughtmarks.length} total</Text>
                  <Text style={styles.viewMoreText}>View all thoughtmarks</Text>
                  <Ionicons name="arrow-forward" size={20} color={tokens.colors.accent} />
                </TouchableOpacity>
              </>
            ) : (
              <DebugScrollView 
          debugId="empty-state" 
          style={{
            paddingVertical: tokens.spacing.xl * 1.34,
          }}
          contentContainerStyle={{
            alignItems: 'center',
          }}
        >
                <Text style={styles.emptyStateText}>
                  {localTagFilter === 'all' 
                    ? 'No thoughtmarks yet. Tap the button below to create your first one!' 
                    : `No thoughtmarks with "${localTagFilter}" tag found.`
                  }
                </Text>
              </DebugScrollView>
            )}
          </DebugScrollView>
        );
      
      case 'tasks':
        return activeTasks.length > 0 ? (
          <DebugScrollView debugId="tasks-list" style={styles.tasksList}>
            {activeTasks.slice(0, 5).map((task, idx, arr) => (
              <TaskCard
                key={task.id}
                task={task}
                onPress={() => handleThoughtmarkPress(task)}
                onToggle={() => handleTaskToggle(task)}
                style={idx !== arr.length - 1 ? { marginBottom: tokens.spacing.xs } : undefined}
              />
            ))}
          </DebugScrollView>
        ) : null;
      
      case 'bins':
        return (
          <DebugScrollView debugId="bins-container" style={styles.binsContainer}>
            {binsLoading ? (
              <DebugScrollView 
                debugId="bins-loading-horizontal"
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.binsHorizontalContent}
              >
                {Array.from({ length: 6 }).map((_, i) => (
                  <DebugScrollView key={i} debugId={`bin-skeleton-${i}`} style={styles.binCardSkeletonHorizontal}>
                    <Text>Loading...</Text>
                  </DebugScrollView>
                ))}
              </DebugScrollView>
            ) : (
              <>
                {/* Template bins in horizontal scroll */}
                <DebugScrollView 
                  debugId="bins-horizontal-scroll"
                  horizontal 
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.binsHorizontalContent}
                  snapToInterval={160} // Card width + margin
                  decelerationRate="fast"
                >
                  {bins.slice(0, 11).map((bin) => {
                    // Use actual bins from data instead of hardcoded names
                    if (!bin) return null;
                    return (
                      <TouchableOpacity
                        key={bin.id}
                        style={styles.binCardHorizontal}
                        onPress={() => handleBinPress(bin)}
                        accessibilityRole="button"
                        accessible={true}
                        accessibilityLabel={`${bin.name} bin with ${bin?.thoughtmarkCount || 0} items`}
                      >
                        <DebugScrollView 
          debugId={`bin-content-${bin.id}`} 
          style={{
            width: '100%',
          }}
          contentContainerStyle={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
                          <Text style={styles.binCardNameHorizontal}>{bin.name || 'Unnamed Bin'}</Text>
                          <Text style={styles.binCardCountHorizontal}>
                            {bin?.thoughtmarkCount || 0}
                          </Text>
                        </DebugScrollView>
                      </TouchableOpacity>
                    );
                  })}
                </DebugScrollView>
                
                {/* Special sections below horizontal scroll */}
                <DebugScrollView debugId="special-bins-container" style={styles.specialBinsContainer}>
                  {/* New Bin Button - Moved to specialty section */}
                  <TouchableOpacity
                    style={styles.specialBinCard}
                    onPress={handleCreateBin}
                    accessibilityRole="button"
                    accessible={true}
                    accessibilityLabel="Create new bin"
                  >
                    <DebugScrollView 
          debugId="new-bin-content" 
          style={{
            width: '100%',
          }}
          contentContainerStyle={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
                      <Text style={styles.specialBinCardText}>New bin</Text>
                      <Ionicons name="add" size={21} color={tokens.colors.accent} />
                    </DebugScrollView>
                  </TouchableOpacity>
                  
                  {/* Saved to Sort Later */}
                  <TouchableOpacity
                    style={styles.specialBinCard}
                    onPress={() => {
                      const sortLaterBin = bins.find((b: any) => b.name === 'Sort Later');
                      if (sortLaterBin) {
                        handleBinPress(sortLaterBin);
                      }
                    }}
                    accessibilityRole="button"
                    accessible={true}
                    accessibilityLabel="Saved to sort later"
                  >
                    <DebugScrollView 
          debugId="sort-later-content" 
          style={{
            width: '100%',
          }}
          contentContainerStyle={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
                      <Text style={styles.specialBinCardText}>Saved to sort later</Text>
                      <Text style={styles.specialBinCardCount}>
                        {bins.find((b: any) => b.name === 'Sort Later')?.thoughtmarkCount || 0}
                      </Text>
                    </DebugScrollView>
                  </TouchableOpacity>
                  
                  {/* Archive */}
                  <TouchableOpacity
                    style={styles.archiveCard}
                    onPress={() => navigation.navigate('Archive')}
                    accessibilityRole="button"
                    accessible={true}
                    accessibilityLabel="View archive"
                  >
                    <DebugScrollView 
          debugId="archive-content" 
          style={{
            width: '100%',
          }}
          contentContainerStyle={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
                      <Text style={styles.archiveCardText}>View archive</Text>
                      <Ionicons name="archive-outline" size={21} color={tokens.colors.accent} />
                    </DebugScrollView>
                  </TouchableOpacity>
                </DebugScrollView>
              </>
            )}
          </DebugScrollView>
        );
      
      default:
        return null;
    }
  };

  // Check if we should render fallback
  const shouldRenderFallback = (!thoughtmarks || thoughtmarks.length === 0) && 
                               (!bins || bins.length === 0) && 
                               !thoughtmarksLoading && 
                               !binsLoading;

  // Create styles with tokens
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: tokens.colors.background,
      position: 'relative', // Ensure proper positioning context
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      paddingTop: tokens.spacing.lg * 0.5, // Reduced from spacing.lg
      paddingBottom: 120, // Increased padding to account for nav bar + safe area
      minHeight: '100%', // Ensure content fills the scroll view
      paddingHorizontal: tokens.spacing.page, // Page-level horizontal padding
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: tokens.spacing.lg * 0.25, // Reduced from spacing.lg
      paddingHorizontal: tokens.spacing.page * 0.25, // Reduced by half
    },
    headerLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    avatar: {
      width: 64, // 48 * 1.34
      height: 64, // 48 * 1.34
      borderRadius: 13, // 10 * 1.34
      marginRight: tokens.spacing.sm,
    },
    titleContainer: {
      flex: 1,
      marginLeft: tokens.spacing.sm,
    },
    title: {
      fontSize: RFValue(16),
      fontWeight: '900',
      color: tokens.colors.text,
      opacity: 0.9, // Added 90% opacity for h2 text
      letterSpacing: 0.5, // Reduced from 1 to prevent wrapping
      textTransform: 'uppercase',
      fontFamily: 'Ubuntu_700Bold',
      flexShrink: 1,
    },
    subtitle: {
      fontSize: RFValue(10),
      fontWeight: '400',
      marginTop: -5, // Reduced spacing between title and tagline
      marginLeft: 21, // Indent the tagline - 16 * 1.34
      fontFamily: 'Ubuntu_400Regular',
      opacity: 0.8, // Added 80% opacity for text below h3
      flexShrink: 1, // Allow shrinking to prevent overflow
    },
    headerRight: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    infoButton: {
      padding: tokens.spacing.sm,
      shadowColor: tokens.colors.text,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    settingsButton: {
      padding: tokens.spacing.sm,
    },
    aiToolsContainer: {
      marginBottom: tokens.spacing.lg * 0.18, // Reduced by 65% from spacing.lg * 0.5
    },
    section: {
      marginBottom: tokens.spacing.lg * 0.18, // Reduced by 65% from spacing.lg * 0.5
    },
    sectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: tokens.spacing.md * 0.5, // Reduced from spacing.md
    },
    sectionTitle: {
      fontSize: RFValue(18),
      fontWeight: '600',
      color: tokens.colors.textSecondary,
      letterSpacing: 0.5,
      fontFamily: 'Ubuntu_600SemiBold',
      opacity: 0.7,
    },
    sectionHeaderRight: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    viewAllButton: {
      marginRight: tokens.spacing.sm,
    },
    viewAllText: {
      fontSize: RFValue(tokens.typography.fontSize.body),
      color: tokens.colors.accent,
      fontWeight: '500',
      fontFamily: 'Ubuntu_500Medium',
      opacity: 0.8,
    },
    tasksList: {
      // Styles for tasks list
    },
    thoughtmarksList: {
      // Styles for thoughtmarks list
    },
    separator: {
      height: 1,
      backgroundColor: tokens.colors.border,
      marginVertical: tokens.spacing.sm,
    },
    binsContainer: {
      // Styles for the bins container
    },
    binsHorizontalContent: {
      paddingHorizontal: tokens.spacing.page, // Page-level padding
      paddingVertical: tokens.spacing.sm,
    },
    binCardSkeletonHorizontal: {
      width: 160,
      height: 70,
      backgroundColor: tokens.colors.backgroundSecondary,
      borderRadius: tokens.radius.md,
      marginRight: tokens.spacing.md, // Increased spacing
    },
    binCardHorizontal: {
      width: 160,
      height: 70,
      backgroundColor: tokens.colors.backgroundSecondary,
      borderRadius: tokens.radius.md,
      padding: tokens.spacing.sm,
      marginRight: tokens.spacing.md, // Increased spacing
      justifyContent: 'center',
    },
    binCardContentHorizontal: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '100%',
    },
    binCardNameHorizontal: {
      fontSize: RFValue(14), // Reduced from 16
      fontWeight: '600',
      color: tokens.colors.text,
      marginBottom: 2,
      fontFamily: 'Ubuntu_600SemiBold',
    },
    binCardCountHorizontal: {
      fontSize: RFValue(12), // Reduced from 13
      color: tokens.colors.textSecondary,
      fontFamily: 'Ubuntu_400Regular',
    },
    newBinCardHorizontal: {
      width: 160,
      height: 52,
      backgroundColor: tokens.colors.backgroundSecondary,
      borderRadius: tokens.radius.md,
      borderWidth: 2,
      borderColor: tokens.colors.textMuted,
      borderStyle: 'dashed',
      padding: tokens.spacing.sm,
      marginRight: tokens.spacing.md, // Increased spacing
      justifyContent: 'center',
    },
    newBinCardContentHorizontal: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: tokens.spacing.xs,
    },
    newBinTextHorizontal: {
      fontSize: RFValue(14),
      color: tokens.colors.accent,
      fontWeight: '500',
      opacity: 0.8,
    },
    specialBinsContainer: {
      marginTop: tokens.spacing.md * 1.34,
    },
    specialBinCard: {
      width: '100%',
      height: 70,
      backgroundColor: 'transparent',
      borderRadius: tokens.radius.md,
      borderWidth: 1,
      borderColor: tokens.colors.accent,
      paddingTop: tokens.spacing.sm * 1.34,
      paddingBottom: tokens.spacing.sm * 1.34,
      paddingLeft: tokens.spacing.sm * 2.5,
      paddingRight: tokens.spacing.sm * 2.5,
      marginBottom: tokens.spacing.sm * 1.34,
      justifyContent: 'center',
    },
    specialBinCardContent: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '100%',
    },
    specialBinCardText: {
      fontSize: RFValue(12.5),
      color: tokens.colors.accent,
      fontWeight: '500',
      opacity: 0.8,
    },
    specialBinCardCount: {
      fontSize: RFValue(12.5),
      color: tokens.colors.accent,
      opacity: 0.8,
    },
    archiveCard: {
      width: '100%',
      height: 70,
      backgroundColor: 'transparent',
      borderRadius: tokens.radius.md,
      paddingTop: tokens.spacing.sm * 1.34,
      paddingBottom: tokens.spacing.sm * 1.34,
      paddingLeft: tokens.spacing.sm * 2.5,
      paddingRight: tokens.spacing.sm * 2.5,
      marginBottom: tokens.spacing.sm * 1.34,
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: tokens.colors.border,
    },
    archiveCardContent: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '100%',
    },
    archiveCardText: {
      fontSize: RFValue(12),
      color: tokens.colors.text,
      fontWeight: '500',
      opacity: 0.8,
    },
    viewMoreCard: {
      backgroundColor: 'transparent',
      borderRadius: tokens.radius.md,
      paddingTop: tokens.spacing.sm * 1.34,
      paddingBottom: tokens.spacing.sm * 1.34,
      paddingLeft: tokens.spacing.sm * 2.5,
      paddingRight: tokens.spacing.sm * 2.5,
      marginTop: tokens.spacing.md * 1.34,
      borderWidth: 1,
      borderColor: tokens.colors.accent,
      height: 70,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    viewMoreText: {
      fontSize: RFValue(14),
      color: tokens.colors.accent,
      fontWeight: '600',
      marginTop: 0,
      opacity: 0.8,
    },
    viewMoreCount: {
      fontSize: RFValue(11),
      color: tokens.colors.textSecondary,
      marginTop: 0,
      opacity: 0.8,
    },
    emptyState: {
      alignItems: 'center',
      paddingVertical: tokens.spacing.xl * 1.34,
    },
    emptyStateText: {
      fontSize: RFValue(14),
      color: tokens.colors.textSecondary,
      textAlign: 'center',
      lineHeight: 32,
      opacity: 0.8,
    },
    reorderTooltip: {
      position: 'absolute',
      top: 107,
      right: tokens.spacing.lg * 1.34,
      backgroundColor: tokens.colors.backgroundSecondary,
      borderRadius: tokens.radius.md,
      padding: tokens.spacing.sm * 1.34,
      shadowColor: tokens.colors.text,
      shadowOffset: {
        width: 0,
        height: 3,
      },
      shadowOpacity: 0.1,
      shadowRadius: 5,
      elevation: 4,
      zIndex: 1000,
      maxWidth: 268,
    },
    tooltipArrow: {
      position: 'absolute',
      top: -11,
      right: 27,
      width: 0,
      height: 0,
      borderLeftWidth: 11,
      borderRightWidth: 11,
      borderBottomWidth: 11,
      borderColor: `transparent transparent ${tokens.colors.backgroundSecondary} transparent`,
    },
    reorderTooltipText: {
      fontSize: RFValue(11),
      color: tokens.colors.text,
      fontWeight: '500',
      fontFamily: 'Ubuntu_500Medium',
      textAlign: 'center',
      opacity: 0.8,
    },
    tagsContainer: {
      marginBottom: tokens.spacing.sm * 1.34,
    },
    tagsScrollContent: {
      paddingHorizontal: tokens.spacing.sm,
      paddingVertical: tokens.spacing.xs * 1.34,
    },
    tagChip: {
      paddingHorizontal: tokens.spacing.md * 1.34,
      paddingVertical: tokens.spacing.xs * 1.34,
      borderWidth: 1,
      borderColor: tokens.colors.border,
      borderRadius: tokens.radius.md,
      marginRight: tokens.spacing.xs * 1.34,
    },
    tagChipActive: {
      backgroundColor: 'transparent',
      borderColor: tokens.colors.accent,
    },
    tagChipText: {
      fontSize: RFValue(10),
      color: tokens.colors.text,
      fontWeight: '500',
      fontFamily: 'Ubuntu_500Medium',
      opacity: 0.8,
    },
    tagChipTextActive: {
      color: tokens.colors.accent,
      opacity: 0.8,
    },
    tagsHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: tokens.spacing.md * 1.34,
    },
    tagsTitle: {
      fontSize: RFValue(10),
      fontWeight: '400',
      color: tokens.colors.textSecondary,
      letterSpacing: 0.7,
      fontFamily: 'Ubuntu_400Regular',
      textTransform: 'lowercase',
      opacity: 0.8,
    },
    viewAllTagsText: {
      fontSize: RFValue(19),
      color: tokens.colors.accent,
      fontWeight: '500',
      fontFamily: 'Ubuntu_500Medium',
      opacity: 0.8,
    },
    loadingText: {
      fontSize: RFValue(18),
      fontWeight: '600',
      color: tokens.colors.text,
      opacity: 0.8,
    },
  });

  // Add debug logging for render state
  console.log('DashboardScreen Render Debug:', {
    thoughtmarksCount: thoughtmarks.length,
    recentThoughtmarksCount: recentThoughtmarks.length,
    binsCount: bins.length,
    sectionsCount: sections.length,
    shouldRenderFallback,
    thoughtmarksLoading,
    binsLoading,
    isAuthenticated,
    loading
  });

  // Show loading screen while checking auth
  if (loading) {
    return (
      <DebugScrollView 
        debugId="loading-screen"
        style={styles.container}
        contentContainerStyle={{ justifyContent: 'center', alignItems: 'center' }}
      >
        <Text style={styles.loadingText}>Loading...</Text>
      </DebugScrollView>
    );
  }

  // Block access if not authenticated
  if (!isAuthenticated) {
    return null; // Will be redirected by useEffect
  }

  // Fallback component for when data is not loaded
  const renderFallbackContent = () => (
    <DebugScrollView 
      debugId="fallback-content" 
      style={{
        paddingVertical: tokens.spacing.xl * 1.34,
      }}
      contentContainerStyle={{
        alignItems: 'center',
      }}
    >
      <Text style={styles.emptyStateText}>
        {thoughtmarksLoading || binsLoading ? 'Loading content...' : 'No content available'}
      </Text>
    </DebugScrollView>
  );

  // Check if we should render fallback
  if (shouldRenderFallback) {
    return renderFallbackContent();
  }

  return (
    <DebugScrollView debugId="main-container" style={styles.container}>
      <OnboardingModal
        visible={showOnboarding}
        onClose={handleOnboardingClose}
      />
      <DebugScrollView
        debugId="main-scroll-view"
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <DebugScrollView 
          debugId="header" 
          style={{
            marginBottom: tokens.spacing.lg * 0.25,
            paddingHorizontal: tokens.spacing.page * 0.25,
          }}
          contentContainerStyle={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <DebugScrollView 
            debugId="header-left" 
            style={{
              flex: 1,
            }}
            contentContainerStyle={{
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <Image
              source={require('../../../../assets/logo.png')}
              style={{
                width: 32,
                height: 32,
                marginRight: tokens.spacing.sm,
                borderRadius: 8,
              }}
              resizeMode="contain"
              accessibilityLabel="Thoughtmarks Logo"
            />
            <DebugScrollView debugId="title-container" style={styles.titleContainer}>
              <CustomText variant="title" numberOfLines={1}><Text>THOUGHTMARKS</Text></CustomText>
              <NeonGradientText variant="tagline" numberOfLines={1}><Text>bookmarks for your brain</Text></NeonGradientText>
            </DebugScrollView>
          </DebugScrollView>
          <DebugScrollView 
            debugId="header-right" 
            style={{}}
            contentContainerStyle={{
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <Animated.View style={{ transform: [{ scale: infoButtonScale }] }}>
              <TouchableOpacity
                style={styles.infoButton}
                onPress={handleReorderHintPress}
                accessibilityRole="button"
                accessible={true}
                accessibilityLabel="Button"
              >
                <Ionicons name="information-circle-outline" size={27} color={tokens.colors.textSecondary} />
              </TouchableOpacity>
            </Animated.View>
            <TouchableOpacity
              style={styles.settingsButton}
              onPress={() => navigation.navigate('Settings')}
              accessibilityRole="button"
              accessible={true}
              accessibilityLabel="Button"
            >
              <Ionicons name="settings-outline" size={32} color={tokens.colors.textSecondary} />
            </TouchableOpacity>
          </DebugScrollView>
        </DebugScrollView>

        {/* Reorder Hint Tooltip */}
        {showReorderHint && (
          <Animated.View style={[styles.reorderTooltip, { opacity: tooltipOpacity }]}>
            <DebugScrollView debugId="tooltip-arrow" style={styles.tooltipArrow} />
            <Text style={styles.reorderTooltipText}>Long press and drag sections to rearrange</Text>
          </Animated.View>
        )}

        {/* AI Tools Card - Moved to top */}
        <DebugScrollView debugId="ai-tools-container" style={styles.aiToolsContainer}>
          <AIToolsCard 
            title="AI Tools"
            subtitle="Unlock AI-powered insights and recommendations"
            onPress={handleAIToolsPress} 
          />
        </DebugScrollView>

        {/* Draggable Sections */}
        {sections.map((section, index) => (
          <DraggableSection
            key={section.id}
            id={section.id}
            title={section.title}
            isExpanded={true}
            onToggle={() => {}} // Sections are always expanded for now
            index={index}
            isDragging={isDragging && draggedIndex === index}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onReorder={handleReorder}
            totalSections={sections.length}
            showViewAll={section.id === 'recent-thoughtmarks' || section.id === 'tasks' || section.id === 'bins'}
            onViewAll={() => {
              switch (section.id) {
                case 'recent-thoughtmarks':
                  handleViewAllThoughtmarks();
                  break;
                case 'tasks':
                  handleViewAllTasks();
                  break;
                case 'bins':
                  handleViewAllBins();
                  break;
              }
            }}
          >
            {renderSectionContent(section.id)}
          </DraggableSection>
        ))}
      </DebugScrollView>

      {/* Bottom Navigation */}
      <BottomNav
        onNavigate={handleNavigate}
        onVoiceRecord={handleVoiceRecord}
        showCreateButton={true}
        currentRoute="Dashboard"
        onCreateNew={handleCreateNew}
      />
    </DebugScrollView>
  );
}; 