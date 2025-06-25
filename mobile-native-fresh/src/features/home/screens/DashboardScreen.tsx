import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  RefreshControl,
  FlatList,
  Dimensions,
  useWindowDimensions,
  Animated,
  Vibration,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../../../theme/theme';
import { ThoughtmarkCard } from '../components/ThoughtmarkCard';
import { TaskCard } from '../components/TaskCard';
import { BinCard } from '../components/BinCard';
import { TagFilter } from '../components/TagFilter';
import { AIToolsCard } from '../components/AIToolsCard';
import { useThoughtmarks } from '../hooks/useThoughtmarks';
import { useBins } from '../hooks/useBins';
import { ThoughtmarkWithBin } from '../../../types';
import { useNavigation } from '@react-navigation/native';
import { BottomNav } from '../../../components/ui/BottomNav';
import { NeonGradientText } from '../../../components/ui/NeonGradientText';
import { useVoiceRecorder } from '../../../components/ui/VoiceRecorderProvider';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { OnboardingModal } from '../../../components/ui/OnboardingModal';
import { useAuth } from '../../auth/hooks/useAuth';
import { Button } from '../../../components/ui/Button';
import { DraggableSection } from '../../../components/ui/DraggableSection';
import { useDashboardOrder } from '../../../hooks/useDashboardOrder';
// import SiriShortcutsService from '../../../services/SiriShortcutsService';

const { width } = Dimensions.get('window');

interface DashboardScreenProps {
  navigation: any;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({ navigation }) => {
  const { width: windowWidth } = useWindowDimensions();
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
                <TouchableOpacity onPress={handleViewAllThoughtmarks}>
                  <Ionicons name="arrow-forward" size={14} color={colors.primary} style={{ opacity: 0.7 }} />
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
                >
                  <Text style={[
                    styles.tagChipText,
                    localTagFilter === 'all' && styles.tagChipTextActive
                  ]}>
                    All ({thoughtmarks.filter(t => !t.isDeleted).length})
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
                  >
                    <Text style={[
                      styles.tagChipText,
                      localTagFilter === tag && styles.tagChipTextActive
                    ]}>
                      {tag}
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
                      onClick={() => handleThoughtmarkPress(thoughtmark)}
                      onEdit={() => handleThoughtmarkEdit(thoughtmark)}
                      onPinToggle={handlePinToggle}
                      style={idx !== arr.length - 1 ? { marginBottom: spacing.xs } : undefined}
                    />
                  ))}
                </View>
                
                {/* View More Card - Reduced height */}
                <TouchableOpacity
                  style={styles.viewMoreCard}
                  onPress={handleViewAllThoughtmarks}
                >
                  <Ionicons name="arrow-forward" size={20} color={colors.primary} />
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
                style={idx !== arr.length - 1 ? { marginBottom: spacing.xs } : undefined}
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
                  <View key={i} style={styles.binCardSkeleton} />
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
                  >
                    <View style={styles.newBinCardContent}>
                      <Ionicons name="add" size={16} color={colors.primary} />
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
                  >
                    <View style={styles.archiveCardContent}>
                      <Text style={styles.archiveCardText}>View Archive</Text>
                      <Ionicons name="archive-outline" size={16} color={colors.primary} />
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
              <NeonGradientText style={styles.subtitle}>bookmarks for your brain</NeonGradientText>
            </View>
          </View>
          <View style={styles.headerRight}>
            <Animated.View style={{ transform: [{ scale: infoButtonScale }] }}>
              <TouchableOpacity
                style={styles.infoButton}
                onPress={handleReorderHintPress}
              >
                <Ionicons name="information-circle-outline" size={20} color={colors.subtext} />
              </TouchableOpacity>
            </Animated.View>
            <TouchableOpacity
              style={styles.settingsButton}
              onPress={() => navigation.navigate('Settings')}
            >
              <Ionicons name="settings-outline" size={24} color={colors.subtext} />
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
          <AIToolsCard onPress={handleAIToolsPress} />
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    position: 'relative', // Ensure proper positioning context
  },
  scrollView: {
    flex: 1,
    width: '100%',
  },
  scrollContent: {
    paddingTop: spacing.lg,
    paddingBottom: 120, // Increased padding to account for nav bar + safe area
    minHeight: '100%', // Ensure content fills the scroll view
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.lg,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  logo: {
    width: 48, // Increased from 40
    height: 48, // Increased from 40
    borderRadius: 10, // Slightly increased for larger size
    marginRight: spacing.md,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: typography.heading.fontSize * 0.9,
    fontWeight: '900',
    color: colors.text,
    opacity: 0.9, // Added 90% opacity for h2 text
    letterSpacing: 1,
    textTransform: 'uppercase',
    fontFamily: 'Ubuntu_700Bold',
  },
  subtitle: {
    fontSize: typography.body.fontSize * 0.8,
    fontWeight: '400',
    marginTop: -4, // Reduced spacing between title and tagline
    marginLeft: 16, // Indent the tagline
    fontFamily: 'Ubuntu_400Regular',
    opacity: 0.8, // Added 80% opacity for text below h3
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoButton: {
    padding: spacing.sm,
    shadowColor: colors.text,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  settingsButton: {
    padding: spacing.sm,
  },
  aiToolsContainer: {
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.lg,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: typography.subheading.fontSize,
    fontWeight: '700',
    color: colors.text,
    opacity: 0.9, // Added 90% opacity for h2 text
    letterSpacing: 0.5,
    fontFamily: 'Ubuntu_700Bold',
  },
  sectionHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewAllButton: {
    marginRight: spacing.sm,
  },
  viewAllText: {
    fontSize: typography.body.fontSize,
    color: colors.primary,
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
    backgroundColor: colors.border,
    marginVertical: spacing.sm,
  },
  binsContainer: {
    // Styles for the bins container
  },
  binsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  binCardSkeleton: {
    width: '48%', // Use percentage instead of fixed width
    height: 52, // h-13 equivalent
    backgroundColor: '#202124',
    borderRadius: 8,
    marginBottom: spacing.sm,
    borderWidth: 1, // Added subtle border
    borderColor: colors.border, // Subtle gray outline
  },
  binCard: {
    width: '48%', // Use percentage instead of fixed width
    height: 52, // h-13 equivalent
    backgroundColor: '#202124',
    borderRadius: 8,
    padding: spacing.sm,
    marginBottom: spacing.sm,
    justifyContent: 'center',
    borderWidth: 1, // Added subtle border
    borderColor: colors.border, // Subtle gray outline
  },
  binCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  binCardName: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '500',
    opacity: 0.8, // Added 80% opacity for text below h3
  },
  binCardCount: {
    fontSize: 12,
    color: colors.primary,
    opacity: 0.8, // Added 80% opacity for text below h3
  },
  newBinCard: {
    width: '48%', // Use percentage instead of fixed width
    height: 52, // h-13 equivalent
    backgroundColor: '#202124',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#666666',
    borderStyle: 'dashed',
    padding: spacing.sm,
    marginBottom: spacing.sm,
    justifyContent: 'center',
  },
  newBinCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
  },
  newBinText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
    opacity: 0.8, // Added 80% opacity for text below h3
  },
  specialBinsContainer: {
    marginTop: spacing.md,
  },
  specialBinCard: {
    width: '100%',
    height: 52, // h-13 equivalent
    backgroundColor: '#1e3a8a', // blue-950 equivalent
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#1e40af', // blue-800 equivalent
    padding: spacing.sm,
    marginBottom: spacing.sm,
    justifyContent: 'center',
  },
  specialBinCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  specialBinCardText: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '500',
    opacity: 0.8, // Added 80% opacity for text below h3
  },
  specialBinCardCount: {
    fontSize: 12,
    color: colors.primary,
    opacity: 0.8, // Added 80% opacity for text below h3
  },
  archiveCard: {
    width: '100%',
    height: 52, // h-13 equivalent
    backgroundColor: 'transparent',
    borderRadius: 8,
    padding: spacing.sm,
    marginBottom: spacing.sm,
    justifyContent: 'center',
    borderWidth: 1, // Added subtle border
    borderColor: colors.border, // Subtle gray outline
  },
  archiveCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  archiveCardText: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '500',
    opacity: 0.8, // Added 80% opacity for text below h3
  },
  viewMoreCard: {
    backgroundColor: 'transparent',
    borderRadius: 6,
    padding: spacing.md,
    alignItems: 'center',
    marginTop: spacing.md,
    borderWidth: 2,
    borderColor: colors.primary,
    borderStyle: 'dashed',
    height: 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  viewMoreText: {
    fontSize: typography.body.fontSize,
    color: colors.primary,
    fontWeight: '600',
    marginTop: 0,
    opacity: 0.8,
  },
  viewMoreCount: {
    fontSize: 12,
    color: colors.subtext,
    marginTop: 0,
    opacity: 0.8,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  emptyStateText: {
    fontSize: typography.body.fontSize,
    color: colors.subtext,
    textAlign: 'center',
    lineHeight: 24,
    opacity: 0.8,
  },
  reorderTooltip: {
    position: 'absolute',
    top: 80,
    right: spacing.lg,
    backgroundColor: colors.card,
    borderRadius: 8,
    padding: spacing.sm,
    shadowColor: colors.text,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 1000,
    maxWidth: 200,
  },
  tooltipArrow: {
    position: 'absolute',
    top: -8,
    right: 20,
    width: 0,
    height: 0,
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderBottomWidth: 8,
    borderColor: `transparent transparent ${colors.card} transparent`,
  },
  reorderTooltipText: {
    fontSize: 12,
    color: colors.text,
    fontWeight: '500',
    fontFamily: 'Ubuntu_500Medium',
    textAlign: 'center',
    opacity: 0.8,
  },
  tagsContainer: {
    marginBottom: spacing.sm,
  },
  tagsScrollContent: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  tagChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 6,
    marginRight: spacing.xs,
  },
  tagChipActive: {
    backgroundColor: 'transparent',
    borderColor: colors.primary,
  },
  tagChipText: {
    fontSize: 11,
    color: colors.text,
    fontWeight: '500',
    fontFamily: 'Ubuntu_500Medium',
    opacity: 0.8,
  },
  tagChipTextActive: {
    color: colors.primary,
    opacity: 0.8,
  },
  tagsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  tagsTitle: {
    fontSize: 10,
    fontWeight: '400',
    color: colors.subtext,
    letterSpacing: 0.5,
    fontFamily: 'Ubuntu_400Regular',
    textTransform: 'lowercase',
    opacity: 0.8,
  },
  viewAllTagsText: {
    fontSize: typography.body.fontSize,
    color: colors.primary,
    fontWeight: '500',
    fontFamily: 'Ubuntu_500Medium',
    opacity: 0.8,
  },
}); 