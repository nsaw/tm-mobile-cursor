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

const { width } = Dimensions.get('window');

interface DashboardScreenProps {
  navigation: any;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({ navigation }) => {
  const { width: windowWidth } = useWindowDimensions();
  const [refreshing, setRefreshing] = useState(false);
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [showTasksSection, setShowTasksSection] = useState(true);
  const [showBinsSection, setShowBinsSection] = useState(true);
  const [showThoughtmarksSection, setShowThoughtmarksSection] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const { user, isAuthenticated, loading } = useAuth();
  const [showOnboarding, setShowOnboarding] = useState(false);

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
    if (!user) return;
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

  // Get active tasks (thoughtmarks with isTask = true and not completed)
  const activeTasks = thoughtmarks.filter(t => t.isTask && !t.isCompleted && !t.isDeleted);

  // Get recent thoughtmarks (limit to 5)
  const recentThoughtmarks = filteredThoughtmarks.slice(0, 5);

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
    navigation.navigate('ThoughtmarkDetail', { thoughtmarkId: thoughtmark.id });
  };

  const handleThoughtmarkEdit = (thoughtmark: ThoughtmarkWithBin) => {
    navigation.navigate('CreateThoughtmark', { thoughtmarkId: thoughtmark.id });
  };

  const handleTaskToggle = (task: ThoughtmarkWithBin) => {
    // TODO: Implement task toggle
    console.log('Toggle task:', task.id);
  };

  const handleBinPress = (bin: any) => {
    // Navigate to All Thoughtmarks filtered by this bin
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
    navigation.navigate(path);
  };

  const handleTagPress = (tag: string) => {
    // Navigate to All Thoughtmarks filtered by this tag
    navigation.navigate('AllThoughtmarks', { 
      filter: 'tag',
      tag: tag 
    });
  };

  const handleOnboardingClose = async () => {
    if (!user) return;
    const isDemo = user.isTestUser || (user.email && user.email.includes('demo'));
    if (!isDemo) {
      await AsyncStorage.setItem(`onboarding-completed-${user.id}`, 'true');
    }
    setShowOnboarding(false);
  };

  const renderTaskCard = ({ item }: { item: ThoughtmarkWithBin }) => (
    <ThoughtmarkCard
      thoughtmark={item}
      onClick={() => handleThoughtmarkPress(item)}
      onEdit={() => handleThoughtmarkEdit(item)}
    />
  );

  const renderBinCard = ({ item }: { item: any }) => (
    <BinCard
      bin={item}
      onPress={() => handleBinPress(item)}
    />
  );

  const renderThoughtmarkCard = ({ item }: { item: ThoughtmarkWithBin }) => (
    <ThoughtmarkCard
      thoughtmark={item}
      onClick={() => handleThoughtmarkPress(item)}
      onEdit={() => handleThoughtmarkEdit(item)}
    />
  );

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
          <TouchableOpacity
            style={styles.settingsButton}
            onPress={() => navigation.navigate('Settings')}
          >
            <Ionicons name="settings-outline" size={24} color={colors.subtext} />
          </TouchableOpacity>
        </View>

        {/* Design System Demo Button */}
        <Button
          variant="primary"
          onPress={() => navigation.navigate('DesignSystemDemo')}
          leftIcon={<Ionicons name="color-palette-outline" size={16} color={colors.background} />}
          style={{ marginBottom: spacing.lg }}
        >
          Design System Demo
        </Button>

        {/* Tasks Section */}
        {activeTasks.length > 0 && (
          <View style={styles.section}>
            <TouchableOpacity
              style={styles.sectionHeader}
              onPress={() => setShowTasksSection(!showTasksSection)}
            >
              <Text style={styles.sectionTitle}>TASK HIT-LIST</Text>
              <View style={styles.sectionHeaderRight}>
                <TouchableOpacity
                  style={styles.viewAllButton}
                  onPress={handleViewAllTasks}
                >
                  <Text style={styles.viewAllText}>View All</Text>
                </TouchableOpacity>
                <Ionicons
                  name={showTasksSection ? 'chevron-up' : 'chevron-down'}
                  size={16}
                  color={colors.subtext}
                />
              </View>
            </TouchableOpacity>

            {showTasksSection && (
              <View style={styles.tasksList}>
                {activeTasks.slice(0, 5).map((task, idx, arr) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onPress={() => handleThoughtmarkPress(task)}
                    onToggle={() => handleTaskToggle(task)}
                    style={idx !== arr.length - 1 ? { marginBottom: spacing.sm } : undefined}
                  />
                ))}
              </View>
            )}
          </View>
        )}

        {/* Bins Section */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.sectionHeader}
            onPress={() => setShowBinsSection(!showBinsSection)}
          >
            <Text style={styles.sectionTitle}>YOUR BINS</Text>
            <View style={styles.sectionHeaderRight}>
              <TouchableOpacity
                style={styles.viewAllButton}
                onPress={handleViewAllBins}
              >
                <Text style={styles.viewAllText}>View All</Text>
              </TouchableOpacity>
              <Ionicons
                name={showBinsSection ? 'chevron-up' : 'chevron-down'}
                size={16}
                color={colors.subtext}
              />
            </View>
          </TouchableOpacity>

          {showBinsSection && (
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
                            <Text style={styles.binCardName}>{bin.name}</Text>
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
          )}
        </View>

        {/* AI Tools Section */}
        <View style={styles.section}>
          <AIToolsCard onPress={handleAIToolsPress} />
        </View>

        {/* Tag Filter */}
        <View style={styles.section}>
          <TagFilter
            tags={allTags}
            selectedTag={selectedTag}
            onTagSelect={setSelectedTag}
            onTagPress={handleTagPress}
            totalCount={thoughtmarksWithBin.filter(t => !t.isDeleted).length}
          />
        </View>

        {/* Recent Thoughtmarks Section */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.sectionHeader}
            onPress={() => setShowThoughtmarksSection(!showThoughtmarksSection)}
          >
            <Text style={styles.sectionTitle}>
              {selectedTag === 'all' ? 'RECENT THOUGHTMARKS' : `RECENT "${selectedTag}" THOUGHTMARKS`}
            </Text>
            <View style={styles.sectionHeaderRight}>
              <TouchableOpacity
                style={styles.viewAllButton}
                onPress={handleViewAllThoughtmarks}
              >
                <Text style={styles.viewAllText}>View All</Text>
              </TouchableOpacity>
              <Ionicons
                name={showThoughtmarksSection ? 'chevron-up' : 'chevron-down'}
                size={16}
                color={colors.subtext}
              />
            </View>
          </TouchableOpacity>

          {showThoughtmarksSection && (
            <View>
              {recentThoughtmarks.length > 0 ? (
                <>
                  <View style={styles.thoughtmarksList}>
                    {recentThoughtmarks.map((thoughtmark, idx, arr) => (
                      <ThoughtmarkCard
                        key={thoughtmark.id}
                        thoughtmark={thoughtmark}
                        onClick={() => handleThoughtmarkPress(thoughtmark)}
                        onEdit={() => handleThoughtmarkEdit(thoughtmark)}
                        style={idx !== arr.length - 1 ? { marginBottom: spacing.sm } : undefined}
                      />
                    ))}
                  </View>
                  
                  {/* View More Card */}
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
                    {selectedTag === 'all' 
                      ? 'No thoughtmarks yet. Tap the button below to create your first one!' 
                      : `No thoughtmarks with "${selectedTag}" tag found.`
                    }
                  </Text>
                </View>
              )}
            </View>
          )}
        </View>
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
    padding: spacing.lg,
    paddingBottom: 120, // Increased padding to account for nav bar + safe area
    minHeight: '100%', // Ensure content fills the scroll view
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  logo: {
    width: 40,
    height: 40,
    borderRadius: 8,
    marginRight: spacing.md,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: typography.heading.fontSize * 0.9,
    fontWeight: '900',
    color: colors.text,
    letterSpacing: 1,
    textTransform: 'uppercase',
    fontFamily: 'Ubuntu',
  },
  subtitle: {
    fontSize: typography.body.fontSize * 0.8,
    fontWeight: '400',
    marginTop: -4, // Reduced spacing between title and tagline
    marginLeft: 16, // Indent the tagline
  },
  settingsButton: {
    padding: spacing.sm,
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
    letterSpacing: 0.5,
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
    width: (width - spacing.lg * 3) / 2,
    height: 52, // h-13 equivalent
    backgroundColor: '#202124',
    borderRadius: 8,
    marginBottom: spacing.sm,
  },
  binCard: {
    width: (width - spacing.lg * 3) / 2,
    height: 52, // h-13 equivalent
    backgroundColor: '#202124',
    borderRadius: 8,
    padding: spacing.sm,
    marginBottom: spacing.sm,
    justifyContent: 'center',
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
  },
  binCardCount: {
    fontSize: 12,
    color: colors.primary,
  },
  newBinCard: {
    width: (width - spacing.lg * 3) / 2,
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
  },
  specialBinCardCount: {
    fontSize: 12,
    color: colors.primary,
  },
  archiveCard: {
    width: '100%',
    height: 52, // h-13 equivalent
    backgroundColor: 'transparent',
    borderRadius: 8,
    padding: spacing.sm,
    marginBottom: spacing.sm,
    justifyContent: 'center',
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
  },
  viewMoreCard: {
    backgroundColor: colors.card,
    borderRadius: spacing.md,
    padding: spacing.lg,
    alignItems: 'center',
    marginTop: spacing.md,
    borderWidth: 2,
    borderColor: colors.primary,
    borderStyle: 'dashed',
  },
  viewMoreText: {
    fontSize: typography.body.fontSize,
    color: colors.primary,
    fontWeight: '600',
    marginTop: spacing.xs,
  },
  viewMoreCount: {
    fontSize: 12,
    color: colors.subtext,
    marginTop: spacing.xs,
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
  },
}); 