import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  useWindowDimensions,
  Animated,
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
import { BottomNav } from '../../../components/ui/BottomNav';
import { NeonGradientText } from '../../../components/ui/NeonGradientText';
import { useVoiceRecorder } from '../../../components/ui/VoiceRecorderProvider';
import { OnboardingModal } from '../../../components/ui/OnboardingModal';
import { useAuth } from '../../auth/hooks/useAuth';
import { DraggableSection } from '../../../components/ui/DraggableSection';
import { useDashboardOrder } from '../../../hooks/useDashboardOrder';
// import SiriShortcutsService from '../../../services/SiriShortcutsService';

const { width } = Dimensions.get('window');

interface DashboardScreenProps {
  navigation: any;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({ navigation }) => {
  const { width: windowWidth } = useWindowDimensions();
  const { tokens } = useTheme();
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

  // Render section content based on section ID
  const renderSectionContent = (sectionId: string) => {
    switch (sectionId) {
      case 'tags':
        // Tags section is now integrated into recent-thoughtmarks
        return null;
      
      case 'recent-thoughtmarks':
        return (
          <View>
            {/* Tags Filter - Moved here from separate section */}
            <View style={styles.tagsContainer}>
              <View style={styles.tagsHeader}>
                <Text style={styles.tagsTitle}>Filter by tag</Text>
                <TouchableOpacity onPress={handleViewAllThoughtmarks} accessibilityRole="button" accessible={true} accessibilityLabel="Button">
                  <Ionicons name="arrow-forward" size={14} color={tokens.colors.accent} style={{ opacity: 0.7 }} />
                </TouchableOpacity>
              </View>
              <ScrollView 
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
              </ScrollView>
            </View>

            {/* Recent Thoughtmarks List */}
            {recentThoughtmarks.length > 0 ? (
              <>
                <View style={styles.thoughtmarksList}>
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
                </View>
                
                {/* View More Card - Reduced height */}
                <TouchableOpacity
                  style={styles.viewMoreCard}
                  onPress={handleViewAllThoughtmarks}
                  accessibilityRole="button"
                  accessible={true}
                  accessibilityLabel="Button"
                >
                  <Ionicons name="arrow-forward" size={20} color={tokens.colors.accent} />
                  <Text style={styles.viewMoreText}>VIEW ALL THOUGHTMARKS</Text>
                  <Text style={styles.viewMoreCount}>{filteredThoughtmarks.length} total</Text>
                </TouchableOpacity>
              </>
            ) : (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>
                  {localTagFilter === 'all' 
                    ? 'No thoughtmarks yet. Tap the button below to create your first one!' 
                    : `No thoughtmarks with "${localTagFilter}" tag found.`
                  }
                </Text>
              </View>
            )}
          </View>
        );
      
      case 'tasks':
        return activeTasks.length > 0 ? (
          <View style={styles.tasksList}>
            {activeTasks.slice(0, 5).map((task, idx, arr) => (
              <TaskCard
                key={task.id}
                task={task}
                onPress={() => handleThoughtmarkPress(task)}
                onToggle={() => handleTaskToggle(task)}
                style={idx !== arr.length - 1 ? { marginBottom: tokens.spacing.xs } : undefined}
              />
            ))}
          </View>
        ) : null;
      
      case 'bins':
        return (
          <View style={styles.binsContainer}>
            {binsLoading ? (
              <View style={styles.binsGrid}>
                {Array.from({ length: 12 }).map((_, i) => (
                  <View key={i}><Text>Loading...</Text></View>
                ))}
              </View>
            ) : (
              <>
                {/* Template bins in preferred order */}
                <View style={styles.binsGrid}>
                  {['Relevant', 'Life Hacks', 'Quotes', 'Inspiration', 'Circle Back', 'Revelations', 'Funny', 'Stories', 'Half-Baked', 'Team-Up', 'Newsworthy'].map((binName) => {
                    // Find the template bin (preferring lower ID for original)
                    const bin = bins.filter(b => b.name === binName).sort((a: any, b: any) => a.id - b.id)[0];
                    if (!bin) return null;
                    return (
                      <TouchableOpacity
                        key={bin.id}
                        style={styles.binCard}
                        onPress={() => handleBinPress(bin)}
                        accessibilityRole="button"
                        accessible={true}
                        accessibilityLabel={`${bin.name} bin with ${bin?.thoughtmarkCount || 0} items`}
                      >
                        <View style={styles.binCardContent}>
                          <Text style={styles.binCardName}>{bin.name || 'Unnamed Bin'}</Text>
                          <Text style={styles.binCardCount}>
                            {bin?.thoughtmarkCount || 0}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                  
                  {/* New Bin Button */}
                  <TouchableOpacity
                    style={styles.newBinCard}
                    onPress={handleCreateBin}
                    accessibilityRole="button"
                    accessible={true}
                    accessibilityLabel="Create new bin"
                  >
                    <View style={styles.newBinCardContent}>
                      <Ionicons name="add" size={21} color={tokens.colors.accent} />
                      <Text style={styles.newBinText}>New Bin</Text>
                    </View>
                  </TouchableOpacity>
                </View>
                
                {/* Special sections below grid */}
                <View style={styles.specialBinsContainer}>
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
                    <View style={styles.specialBinCardContent}>
                      <Text style={styles.specialBinCardText}>Saved to Sort Later</Text>
                      <Text style={styles.specialBinCardCount}>
                        {bins.find((b: any) => b.name === 'Sort Later')?.thoughtmarkCount || 0}
                      </Text>
                    </View>
                  </TouchableOpacity>
                  
                  {/* Archive */}
                  <TouchableOpacity
                    style={styles.archiveCard}
                    onPress={() => navigation.navigate('Archive')}
                    accessibilityRole="button"
                    accessible={true}
                    accessibilityLabel="View archive"
                  >
                    <View style={styles.archiveCardContent}>
                      <Text style={styles.archiveCardText}>View Archive</Text>
                      <Ionicons name="archive-outline" size={21} color={tokens.colors.accent} />
                    </View>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        );
      
      default:
        return null;
    }
  };

  // Create styles with tokens
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: tokens.colors.background,
      position: 'relative', // Ensure proper positioning context
    },
    scrollView: {
      flex: 1,
      width: '100%',
    },
    scrollContent: {
      paddingTop: tokens.spacing.lg * 0.5, // Reduced from spacing.lg
      paddingBottom: 120, // Increased padding to account for nav bar + safe area
      minHeight: '100%', // Ensure content fills the scroll view
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: tokens.spacing.lg * 0.5, // Reduced from spacing.lg
      paddingHorizontal: tokens.spacing.sm, // Reduced from spacing.lg for full width
    },
    headerLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    logo: {
      width: 64, // 48 * 1.34
      height: 64, // 48 * 1.34
      borderRadius: 13, // 10 * 1.34
      marginRight: tokens.spacing.sm,
    },
    titleContainer: {
      flex: 1,
    },
    title: {
      fontSize: RFValue(18),
      fontWeight: '900',
      color: tokens.colors.text,
      opacity: 0.9, // Added 90% opacity for h2 text
      letterSpacing: 0.5, // Reduced from 1 to prevent wrapping
      textTransform: 'uppercase',
      fontFamily: 'Ubuntu_700Bold',
    },
    subtitle: {
      fontSize: RFValue(10),
      fontWeight: '400',
      marginTop: -5, // Reduced spacing between title and tagline
      marginLeft: 21, // Indent the tagline - 16 * 1.34
      fontFamily: 'Ubuntu_400Regular',
      opacity: 0.8, // Added 80% opacity for text below h3
    },
    headerRight: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    infoButton: {
      padding: tokens.spacing.sm * 1.34,
      shadowColor: tokens.colors.text,
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 1,
    },
    settingsButton: {
      padding: tokens.spacing.sm * 1.34,
    },
    aiToolsContainer: {
      marginBottom: tokens.spacing.lg * 0.18, // Reduced by 65% from spacing.lg * 0.5
      paddingHorizontal: tokens.spacing.sm, // Reduced from spacing.lg for full width
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
      fontSize: RFValue(22),
      fontWeight: '700',
      color: tokens.colors.text,
      opacity: 0.9, // Added 90% opacity for h2 text
      letterSpacing: 0.7, // 0.5 * 1.34
      fontFamily: 'Ubuntu_700Bold',
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
      opacity: 0.8, // Added 80% opacity for text below h3
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
    binsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      marginBottom: tokens.spacing.md,
    },
    binCardSkeleton: {
      width: '48%', // Use percentage instead of fixed width
      height: 70, // 52 * 1.34
      backgroundColor: tokens.colors.backgroundSecondary,
      borderRadius: tokens.radius.md,
      marginBottom: tokens.spacing.sm,
      borderWidth: 1, // Added subtle border
      borderColor: tokens.colors.border, // Subtle gray outline
    },
    binCard: {
      width: '48%', // Use percentage instead of fixed width
      height: 70, // 52 * 1.34
      backgroundColor: tokens.colors.backgroundSecondary,
      borderRadius: tokens.radius.md,
      padding: tokens.spacing.sm,
      marginBottom: tokens.spacing.sm,
      justifyContent: 'center',
      borderWidth: 1, // Added subtle border
      borderColor: tokens.colors.border, // Subtle gray outline
    },
    binCardContent: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '100%',
    },
    binCardName: {
      fontSize: RFValue(16),
      fontWeight: '600',
      color: tokens.colors.text,
      marginBottom: 2,
      fontFamily: 'Ubuntu_600SemiBold',
    },
    binCardCount: {
      fontSize: RFValue(13),
      color: tokens.colors.textSecondary,
      fontFamily: 'Ubuntu_400Regular',
    },
    newBinCard: {
      width: '48%', // Use percentage instead of fixed width
      height: 52, // h-13 equivalent
      backgroundColor: tokens.colors.backgroundSecondary,
      borderRadius: tokens.radius.md,
      borderWidth: 2,
      borderColor: tokens.colors.textMuted,
      borderStyle: 'dashed',
      padding: tokens.spacing.sm,
      marginBottom: tokens.spacing.sm,
      justifyContent: 'center',
    },
    newBinCardContent: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: tokens.spacing.xs,
    },
    newBinText: {
      fontSize: RFValue(14),
      color: tokens.colors.accent,
      fontWeight: '500',
      opacity: 0.8, // Added 80% opacity for text below h3
    },
    specialBinsContainer: {
      marginTop: tokens.spacing.md * 1.34,
    },
    specialBinCard: {
      width: '100%',
      height: 70, // 52 * 1.34
      backgroundColor: tokens.colors.accent,
      borderRadius: tokens.radius.md,
      borderWidth: 1,
      borderColor: tokens.colors.accentHover,
      padding: tokens.spacing.sm * 1.34,
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
      fontSize: RFValue(14),
      color: tokens.colors.text,
      fontWeight: '500',
      opacity: 0.8, // Added 80% opacity for text below h3
    },
    specialBinCardCount: {
      fontSize: RFValue(11),
      color: tokens.colors.accent,
      opacity: 0.8, // Added 80% opacity for text below h3
    },
    archiveCard: {
      width: '100%',
      height: 70, // 52 * 1.34
      backgroundColor: 'transparent',
      borderRadius: tokens.radius.md,
      padding: tokens.spacing.sm * 1.34,
      marginBottom: tokens.spacing.sm * 1.34,
      justifyContent: 'center',
      borderWidth: 1, // Added subtle border
      borderColor: tokens.colors.border, // Subtle gray outline
    },
    archiveCardContent: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '100%',
    },
    archiveCardText: {
      fontSize: RFValue(14),
      color: tokens.colors.text,
      fontWeight: '500',
      opacity: 0.8, // Added 80% opacity for text below h3
    },
    viewMoreCard: {
      backgroundColor: 'transparent',
      borderRadius: tokens.radius.md,
      padding: tokens.spacing.md * 1.34,
      alignItems: 'center',
      marginTop: tokens.spacing.md * 1.34,
      borderWidth: 2,
      borderColor: tokens.colors.accent,
      borderStyle: 'dashed',
      height: 80, // 60 * 1.34
      flexDirection: 'row',
      justifyContent: 'space-between',
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
      lineHeight: 32, // 24 * 1.34
      opacity: 0.8,
    },
    reorderTooltip: {
      position: 'absolute',
      top: 107, // 80 * 1.34
      right: tokens.spacing.lg * 1.34,
      backgroundColor: tokens.colors.backgroundSecondary,
      borderRadius: tokens.radius.md,
      padding: tokens.spacing.sm * 1.34,
      shadowColor: tokens.colors.text,
      shadowOffset: {
        width: 0,
        height: 3, // 2 * 1.34
      },
      shadowOpacity: 0.1,
      shadowRadius: 5, // 4 * 1.34
      elevation: 4, // 3 * 1.34
      zIndex: 1000,
      maxWidth: 268, // 200 * 1.34
    },
    tooltipArrow: {
      position: 'absolute',
      top: -11, // -8 * 1.34
      right: 27, // 20 * 1.34
      width: 0,
      height: 0,
      borderLeftWidth: 11, // 8 * 1.34
      borderRightWidth: 11, // 8 * 1.34
      borderBottomWidth: 11, // 8 * 1.34
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
      fontSize: RFValue(12),
      fontWeight: '400',
      color: tokens.colors.textSecondary,
      letterSpacing: 0.7, // 0.5 * 1.34
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
  });

  return (
    <View style={styles.container}>
      <OnboardingModal
        visible={showOnboarding}
        onClose={handleOnboardingClose}
        isDemo={!!(user && (user.isTestUser || (user.email && user.email.includes('demo'))))}
      />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Image
              source={{ uri: 'https://raw.githubusercontent.com/nsaw/imageSrc/main/IMG_4663.jpeg' }}
              style={styles.logo}
            />
            <View style={styles.titleContainer}>
              <Text style={styles.title}>THOUGHTMARKS</Text>
              <NeonGradientText><Text>bookmarks for your brain</Text></NeonGradientText>
            </View>
          </View>
          <View style={styles.headerRight}>
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
          </View>
        </View>

        {/* Reorder Hint Tooltip */}
        {showReorderHint && (
          <Animated.View style={[styles.reorderTooltip, { opacity: tooltipOpacity }]}>
            <View style={styles.tooltipArrow} />
            <Text style={styles.reorderTooltipText}>Long press and drag sections to rearrange</Text>
          </Animated.View>
        )}

        {/* AI Tools Card - Moved to top */}
        <View style={styles.aiToolsContainer}>
          <AIToolsCard 
            title="AI Tools"
            subtitle="Unlock AI-powered insights and recommendations"
            onPress={handleAIToolsPress} 
          />
        </View>

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
      </ScrollView>

      {/* Bottom Navigation */}
      <BottomNav
        onNavigate={handleNavigate}
        onVoiceRecord={handleVoiceRecord}
        showCreateButton={true}
        currentRoute="Dashboard"
        onCreateNew={handleCreateNew}
      />
    </View>
  );
}; 