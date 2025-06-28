import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  useWindowDimensions,
  Animated,
  RefreshControl
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useTheme } from '../../../theme/ThemeProvider';
import { ThoughtmarkCard } from '../components/ThoughtmarkCard';
import { AIToolsCard } from '../components/AIToolsCard';
import { useThoughtmarks } from '../hooks/useThoughtmarks';
import { useBins } from '../hooks/useBins';
import { ThoughtmarkWithBin } from '../../../types';
import { NeonGradientText } from '../../../components/ui/NeonGradientText';
import { useVoiceRecorder } from '../../../components/ui/VoiceRecorderProvider';
import { OnboardingModal } from '../../../components/ui/OnboardingModal';
import { useAuth } from '../../auth/hooks/useAuth';
import { DraggableSection } from '../../../components/ui/DraggableSection';
import { useDashboardOrder } from '../../../hooks/useDashboardOrder';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ModernHeader } from '../../../components/ui/ModernHeader';
import { Card, CardContent } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { FloatingActionButton } from '../../../components/ui/FloatingActionButton';
import { TagFilter } from '../../../components/ui/TagFilter';
import { TagChip } from '../../../components/ui/TagChip';
import { QuickActions } from '../components/QuickActions';
import { SearchBar } from '../components/SearchBar';
import { BinCard } from '../components/BinCard';

const { width } = Dimensions.get('window');

interface DashboardScreenProps {
  navigation: any;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({ navigation }) => {
  const { tokens, typography, buttonStyles, spacing } = useTheme();
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
  
  // Draggable sections state;
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
    fetchThoughtmarks
  } = useThoughtmarks();

  const {
    bins,
    loading: binsLoading,
    error: binsError,
    fetchBins
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
        // Always show for demo users, but only once per login;
        const lastLogin = await AsyncStorage.getItem(key);
        const now = Date.now().toString();
        if (lastLogin !== now) {
          setShowOnboarding(true);
          await AsyncStorage.setItem(key, now);
        }
      } else {
        // Show for new users only;
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
          useNativeDriver: true
        }),
        Animated.timing(infoButtonScale, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true
        }),
      ])
    );
    
    // Start pulsing after a short delay;
    const timer = setTimeout(() => {
      pulseAnimation.start();
    }, 2000);
    
    // Stop pulsing after 5 seconds;
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

  // Filter thoughtmarks by selected tag;
  const filteredThoughtmarks = selectedTag === 'all' 
    ? thoughtmarks.filter(t => !t.isDeleted)
    : thoughtmarks.filter(t => !t.isDeleted && t.tags.includes(selectedTag));

  // Filter recent thoughtmarks by local tag filter;
  const recentThoughtmarksFiltered = localTagFilter === 'all'
    ? thoughtmarks.filter(t => !t.isDeleted)
    : thoughtmarks.filter(t => !t.isDeleted && t.tags.includes(localTagFilter));

  // Get active tasks (thoughtmarks with isTask = true and not completed);
  const activeTasks = thoughtmarks.filter(t => t.isTask && !t.isCompleted && !t.isDeleted);

  // Get recent thoughtmarks (limit to 5);
  const recentThoughtmarks = recentThoughtmarksFiltered.slice(0, 5);

  // Get all unique tags;
  const allTags = Array.from(new Set(thoughtmarks.flatMap(t => t.tags))).sort();

  // Add bin information to thoughtmarks;
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
    navigation.navigate(path);
  };

  const handleTagPress = (tag: string) => {
    setSelectedTag(tag);
    // Scroll to thoughtmarks section
    // TODO: Implement scroll to section
  };

  const handleLocalTagPress = (tag: string) => {
    setLocalTagFilter(tag);
  };

  const handleOnboardingClose = async () => {
    if (user?.id) {
      const key = user.isTestUser || (user.email && user.email.includes('demo'))
        ? `onboarding-demo-last-login-${user.id}`
        : `onboarding-completed-${user.id}`;
      await AsyncStorage.setItem(key, 'true');
    }
    setShowOnboarding(false);
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
    setShowReorderHint(false);
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: tokens.colors.background
    },
    scrollView: {
      flex: 1
    },
    content: {
      padding: tokens.spacing.lg,
      paddingBottom: 100
    },
    section: {
      marginBottom: tokens.spacing.xl
    },
    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: tokens.spacing.md
    },
    sectionTitle: {
      fontSize: tokens.typography.fontSize.lg,
      fontWeight: '600',
      color: tokens.colors.text
    },
    viewAllButton: {
      fontSize: tokens.typography.fontSize.sm,
      color: tokens.colors.accent
    },
    emptyState: {
      alignItems: 'center',
      padding: tokens.spacing.xl,
      backgroundColor: tokens.colors.surface,
      borderRadius: tokens.radius.lg,
      marginTop: tokens.spacing.md
    },
    emptyStateText: {
      color: tokens.colors.textSecondary,
      textAlign: 'center',
      marginTop: tokens.spacing.sm
    },
    tagContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: tokens.spacing.sm,
      marginBottom: tokens.spacing.md
    },
    reorderHint: {
      position: 'absolute',
      top: 100,
      left: tokens.spacing.lg,
      right: tokens.spacing.lg,
      backgroundColor: tokens.colors.accent,
      padding: tokens.spacing.md,
      borderRadius: tokens.radius.md,
      zIndex: 1000
    },
    reorderHintText: {
      color: tokens.colors.background,
      textAlign: 'center',
      fontSize: tokens.typography.fontSize.sm
    }
  });

  const renderSectionContent = (sectionId: string) => {
    switch (sectionId) {
      case 'quick-actions':
        return (
          <QuickActions
            onCreateThoughtmark={handleCreateNew}
            onVoiceRecord={handleVoiceRecord}
            onOpenBins={handleCreateBin}
          />
        );
      
      case 'recent-thoughtmarks':
        return (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recent Thoughtmarks</Text>
              <TouchableOpacity onPress={handleViewAllThoughtmarks}>
                <Text style={styles.viewAllButton}>View All</Text>
              </TouchableOpacity>
            </View>
            
            {recentThoughtmarks.length > 0 ? (
              <>
                <View style={styles.tagContainer}>
                  <TagChip
                    tag="all"
                    isSelected={localTagFilter === 'all'}
                    onPress={() => handleLocalTagPress('all')}
                  />
                  {allTags.slice(0, 5).map((tag) => (
                    <TagChip
                      key={tag}
                      tag={tag}
                      isSelected={localTagFilter === tag}
                      onPress={() => handleLocalTagPress(tag)}
                    />
                  ))}
                </View>
                
                {recentThoughtmarks.map((thoughtmark) => (
                  <ThoughtmarkCard
                    key={thoughtmark.id}
                    thoughtmark={thoughtmark}
                    onClick={() => handleThoughtmarkPress(thoughtmark)}
                    onEdit={() => handleThoughtmarkEdit(thoughtmark)}
                    onPinToggle={handlePinToggle}
                  />
                ))}
              </>
            ) : (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>
                  No thoughtmarks yet. Create your first one!
                </Text>
              </View>
            )}
          </View>
        );
      
      case 'tasks':
        return (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Active Tasks</Text>
              <TouchableOpacity onPress={handleViewAllTasks}>
                <Text style={styles.viewAllButton}>View All</Text>
              </TouchableOpacity>
            </View>
            
            {activeTasks.length > 0 ? (
              activeTasks.slice(0, 3).map((task) => (
                <ThoughtmarkCard
                  key={task.id}
                  thoughtmark={task}
                  onClick={() => handleThoughtmarkPress(task)}
                  onEdit={() => handleThoughtmarkEdit(task)}
                  onPinToggle={handlePinToggle}
                />
              ))
            ) : (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>
                  No active tasks. Create one to get started!
                </Text>
              </View>
            )}
          </View>
        );
      
      case 'bins':
        return (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Bins</Text>
              <TouchableOpacity onPress={handleViewAllBins}>
                <Text style={styles.viewAllButton}>View All</Text>
              </TouchableOpacity>
            </View>
            
            {bins.length > 0 ? (
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: tokens.spacing.md }}>
                {bins.slice(0, 4).map((bin) => (
                  <BinCard
                    key={bin.id}
                    bin={{
                      id: String(bin.id),
                      name: bin.name,
                      icon: bin.icon || 'folder-outline',
                      color: bin.color,
                      thoughtmarkCount: bin.thoughtmarkCount || 0
                    }}
                    onPress={() => handleBinPress(bin)}
                  />
                ))}
              </View>
            ) : (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>
                  No bins yet. Create one to organize your thoughtmarks!
                </Text>
              </View>
            )}
          </View>
        );
      
      case 'ai-tools':
        return (
          <View style={styles.section}>
            <AIToolsCard onPress={handleAIToolsPress} />
          </View>
        );
      
      default:
        return null;
    }
  };

  const renderFallbackContent = () => (
    <View style={styles.content}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Welcome to Thoughtmarks</Text>
        <Text style={styles.emptyStateText}>
          Start by creating your first thoughtmark or explore the app features.
        </Text>
      </View>
      
      <QuickActions
        onCreateThoughtmark={handleCreateNew}
        onVoiceRecord={handleVoiceRecord}
        onOpenBins={handleCreateBin}
      />
    </View>
  );

  if (loading || sectionsLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <ModernHeader
          title="Dashboard"
          subtitle="Your organized thoughts"
        />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ModernHeader
        title="Dashboard"
        subtitle="Your organized thoughts"
        showBackButton={false}
      />
      
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[tokens.colors.accent]}
            tintColor={tokens.colors.accent}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {sections.length > 0 ? (
          sections.map((section, index) => (
            <DraggableSection
              key={section.id}
              id={section.id}
              title={section.title}
              isExpanded={section.visible}
              onToggle={() => {
                // TODO: Implement section visibility toggle
              }}
              onDragStart={() => handleDragStart(index)}
              onDragEnd={handleDragEnd}
              onReorder={handleReorder}
              isDragging={isDragging}
              index={index}
              totalSections={sections.length}
            >
              {renderSectionContent(section.id)}
            </DraggableSection>
          ))
        ) : (
          renderFallbackContent()
        )}
      </ScrollView>

      <FloatingActionButton
        onPress={handleCreateNew}
        onVoiceRecord={handleVoiceRecord}
        isRecording={isRecording}
      />

      {showReorderHint && (
        <Animated.View style={[styles.reorderHint, { opacity: tooltipOpacity }]}>
          <TouchableOpacity onPress={handleReorderHintPress}>
            <Text style={styles.reorderHintText}>
              💡 Tip: Long press and drag to reorder sections
            </Text>
          </TouchableOpacity>
        </Animated.View>
      )}

      <OnboardingModal
        visible={showOnboarding}
        onClose={handleOnboardingClose}
      />
    </SafeAreaView>
  );
}; 