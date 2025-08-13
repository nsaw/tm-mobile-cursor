import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  useWindowDimensions,
  Animated,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation/types';
import { Thoughtmark as AppStoreThoughtmark, Bin as AppStoreBin } from '../../state/stores/appStore';

import { useTheme } from '../../theme/ThemeProvider';
import useAppStore from '../../state/stores/appStore';
import { ThoughtmarkCard } from '../../components/thoughtmarks/ThoughtmarkCard';
import { TaskCard } from '../../components/tasks/TaskCard';
import { AIToolsCard } from '../../components/ai/AIToolsCard';
import { BottomNav } from '../../components/ui/BottomNav';
import { useVoiceRecorder } from '../../components/ui/VoiceRecorderProvider';
import { OnboardingModal } from '../../components/ui/OnboardingModal';
import { DraggableSection } from '../../components/ui/DraggableSection';
import { useDashboardOrder } from '../../hooks/useDashboardOrder';
import { useAuth } from '../../hooks/useAuth';



interface DashboardScreenProps {
  navigation: NavigationProp<RootStackParamList>;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({ navigation }) => {
  const { width: _windowWidth } = useWindowDimensions();
  const { typography: _typography, buttonStyles: _buttonStyles, spacing: _spacing, tokens } = useTheme();
  const {
    thoughtmarks,
    bins,
    error: _error,
    loading: dataLoading,
    fetchThoughtmarks,
    fetchBins,
    createThoughtmark: _createThoughtmark,
    updateThoughtmark,
  } = useAppStore();

  const { user, loading: authLoading } = useAuth();

  const [refreshing, setRefreshing] = useState(false);
  const [_selectedTag, setSelectedTag] = useState<string>('all');
  const [localTagFilter, setLocalTagFilter] = useState<string>('all');
  const [_showTasksSection] = useState(true);
  const [_showBinsSection] = useState(true);
  const [_showThoughtmarksSection] = useState(true);
  const [_isRecording] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  
  // Draggable sections state
  const [_isDragging, setIsDragging] = useState(false);
  const [_draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [_showReorderHint, setShowReorderHint] = useState(false);
  const tooltipOpacity = new Animated.Value(0);
  const _infoButtonScale = new Animated.Value(1);
  const { sections, isLoading: _sectionsLoading, reorderSections } = useDashboardOrder();

  const { showVoiceRecorder } = useVoiceRecorder();

  const [_transcriptRef] = useState<string>('');

  // Define loadInitialData early using useCallback
  const loadInitialData = useCallback(async () => {
    try {
      await Promise.all([fetchThoughtmarks(), fetchBins()]);
    } catch (error) {
      console.error('Error loading initial data:', error);
    }
  }, [fetchThoughtmarks, fetchBins]);

  // Auth blocking logic - REMOVED since AppNavigator handles this
  // useEffect(() => {
  //   if (!authLoading && !isAuthenticated) {
  //     console.log('DashboardScreen: User not authenticated, redirecting to login');
  //     navigation.navigate('SignIn');
  //   }
  // }, [authLoading, isAuthenticated, navigation]);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  useEffect(() => {
    if (!user || !user.id) return;
    const checkOnboarding = async () => {
      const isDemo = user.isTestUser || (user.email && user.email.includes('demo'));
      const key = isDemo
        ? `onboarding-demo-last-login-${user.id}`
        : `onboarding-completed-${user.id}`;
      if (isDemo) {
        const lastLogin = await AsyncStorage.getItem(key);
        const now = Date.now().toString();
        if (lastLogin !== now) {
          setShowOnboarding(true);
          await AsyncStorage.setItem(key, now);
        }
      } else {
        const completed = await AsyncStorage.getItem(key);
        if (!completed) {
          setShowOnboarding(true);
        }
      }
    };
    checkOnboarding();
  }, [user]);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await Promise.all([fetchThoughtmarks(), fetchBins()]);
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setRefreshing(false);
    }
  };

  // Filtered data
  const filteredThoughtmarks = thoughtmarks.filter((t: AppStoreThoughtmark) => !t.isDeleted);
  const recentThoughtmarks = filteredThoughtmarks
    .filter((t: AppStoreThoughtmark) => localTagFilter === 'all' || t.tags?.includes(localTagFilter))
    .sort((a: AppStoreThoughtmark, b: AppStoreThoughtmark) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5);

  const activeTasks = filteredThoughtmarks.filter((t: AppStoreThoughtmark) => t.isTask && !t.isCompleted);
  const allTags = Array.from(new Set(filteredThoughtmarks.flatMap((t: AppStoreThoughtmark) => t.tags || []))).sort();

  const handleThoughtmarkPress = (thoughtmark: AppStoreThoughtmark) => {
    navigation.navigate('ThoughtmarkDetail', { id: thoughtmark.id.toString() });
  };

  const handleThoughtmarkEdit = (thoughtmark: AppStoreThoughtmark) => {
    navigation.navigate('EditThoughtmark', { thoughtmarkId: thoughtmark.id.toString() });
  };

  const handlePinToggle = async (thoughtmarkId: string, pinned: boolean) => {
    try {
      await updateThoughtmark(thoughtmarkId, { isPinned: pinned });
    } catch (error) {
      console.error('Error toggling pin:', error);
    }
  };

  const handleTaskToggle = (task: AppStoreThoughtmark) => {
    updateThoughtmark(task.id, { isCompleted: !task.isCompleted });
  };

  const handleBinPress = (bin: AppStoreBin) => {
    navigation.navigate('BinDetail', { id: bin.id.toString() });
  };

  const handleCreateNew = () => {
    navigation.navigate('CreateThoughtmark');
  };

  const _handleCreateBin = () => {
    navigation.navigate('CreateBin');
  };

  const handleViewAllThoughtmarks = () => {
    navigation.navigate('ThoughtmarksList');
  };

  const _handleViewAllTasks = () => {
    navigation.navigate('TasksList');
  };

  const _handleViewAllBins = () => {
    navigation.navigate('BinsList');
  };

  const handleAIToolsPress = () => {
    navigation.navigate('AITools');
  };

  const handleVoiceRecord = () => {
    showVoiceRecorder();
  };

  const _handleNavigate = (path: string) => {
    navigation.navigate(path);
  };

  const _handleTagPress = (tag: string) => {
    setSelectedTag(tag);
    navigation.navigate('ThoughtmarksList', { tag });
  };

  const handleLocalTagPress = (tag: string) => {
    setLocalTagFilter(tag);
  };

  const handleOnboardingClose = async () => {
    setShowOnboarding(false);
    if (user?.id) {
      const key = `onboarding-completed-${user.id}`;
      await AsyncStorage.setItem(key, 'true');
    }
  };

  const _handleDragStart = (index: number) => {
    setIsDragging(true);
    setDraggedIndex(index);
  };

  const _handleDragEnd = () => {
    setIsDragging(false);
    setDraggedIndex(null);
  };

  const handleReorder = async (fromIndex: number, toIndex: number) => {
    try {
      await reorderSections(fromIndex, toIndex);
    } catch (error) {
      console.error('Error reordering sections:', error);
    }
  };

  const _handleReorderHintPress = () => {
    setShowReorderHint(true);
    Animated.timing(tooltipOpacity, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
    
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
        return null;
      
      case 'recent-thoughtmarks':
        return (
          <View>
            <View style={styles.tagsContainer}>
              <View style={styles.tagsHeader}>
                <Text style={styles.tagsTitle}>Filter by tag</Text>
                <TouchableOpacity onPress={handleViewAllThoughtmarks} accessibilityRole='button' accessible={true} accessibilityLabel='Button'>
                  <Ionicons name='arrow-forward' size={16} color={tokens.colors.accent} style={{ opacity: 0.7 }} />
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
                    localTagFilter === 'all' && styles.tagChipActive,
                  ]}
                  onPress={() => handleLocalTagPress('all')}
                  accessibilityRole='button'
                  accessible={true}
                  accessibilityLabel='filter by tag: all'
                >
                  <Text style={[
                    styles.tagChipText,
                    localTagFilter === 'all' && styles.tagChipTextActive,
                  ]}>
                    all ({filteredThoughtmarks.length})
                  </Text>
                </TouchableOpacity>
                
                {allTags.map((tag: string, _index: number) => (
                  <TouchableOpacity
                    key={tag}
                    style={[
                      styles.tagButton,
                      {
                        backgroundColor: localTagFilter === tag ? tokens.colors.primary : tokens.colors.surface,
                        borderColor: tokens.colors.border,
                      },
                    ]}
                    onPress={() => handleLocalTagPress(tag)}
                    activeOpacity={0.7}
                    accessibilityRole="button"
                    accessibilityLabel={`${tag} tag filter`}
                  >
                    <Text
                      style={[
                        styles.tagText,
                        {
                          color: localTagFilter === tag ? tokens.colors.onPrimary : tokens.colors.text,
                          fontSize: tokens.typography.fontSize.sm,
                        },
                      ]}
                    >
                      {tag.toLowerCase()}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {recentThoughtmarks.length > 0 ? (
              <>
                <View style={styles.thoughtmarksList}>
                  {recentThoughtmarks.map((thoughtmark: AppStoreThoughtmark) => (
                    <ThoughtmarkCard
                      key={thoughtmark.id}
                      thoughtmark={{
                        id: thoughtmark.id,
                        title: thoughtmark.title,
                        content: thoughtmark.content,
                        tags: thoughtmark.tags || []
                      }}
                      pinned={thoughtmark.isPinned || false}
                      onClick={() => handleThoughtmarkPress(thoughtmark)}
                      onEdit={() => handleThoughtmarkEdit(thoughtmark)}
                      onPinToggle={handlePinToggle}
                    />
                  ))}
                </View>
                
                <TouchableOpacity
                  style={styles.viewMoreCard}
                  onPress={handleViewAllThoughtmarks}
                  accessibilityRole='button'
                  accessible={true}
                  accessibilityLabel='Button'
                >
                  <Text style={styles.viewMoreCount}>{filteredThoughtmarks.length} total</Text>
                  <Text style={styles.viewMoreText}>View all thoughtmarks</Text>
                  <Ionicons name='arrow-forward' size={20} color={tokens.colors.accent} />
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
            {activeTasks.slice(0, 5).map((task: AppStoreThoughtmark) => (
              <TaskCard
                key={task.id}
                task={{
                  id: task.id,
                  title: task.title,
                  content: task.content,
                  isCompleted: task.isCompleted || false,
                  dueDate: undefined // AppStoreThoughtmark doesn't have dueDate
                }}
                onPress={() => handleThoughtmarkPress(task)}
                onToggle={() => handleTaskToggle(task)}
              />
            ))}
          </View>
        ) : null;
      
      case 'bins':
        return (
          <View style={styles.binsContainer}>
            {dataLoading ? (
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.binsHorizontalContent}
              >
                {Array.from({ length: 6 }).map((_, i) => (
                  <View key={i} style={styles.binCardSkeletonHorizontal}>
                    <Text>Loading...</Text>
                  </View>
                ))}
              </ScrollView>
            ) : (
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.binsHorizontalContent}
                snapToInterval={160}
                decelerationRate='fast'
              >
                {['Relevant', 'Life Hacks', 'Quotes', 'Inspiration', 'Circle Back', 'Revelations', 'Funny', 'Stories', 'Half-Baked', 'Team-Up', 'Newsworthy'].map((binName) => {
                  const bin = bins.filter((b: AppStoreBin) => b.name === binName).sort((a: AppStoreBin, b: AppStoreBin) => parseInt(a.id) - parseInt(b.id))[0];
                  if (!bin) return null;
                  return (
                    <TouchableOpacity
                      key={bin.id}
                      style={styles.binCardHorizontal}
                      onPress={() => handleBinPress(bin)}
                      accessibilityRole='button'
                      accessible={true}
                      accessibilityLabel={`${bin.name} bin with ${bin?.thoughtmarkCount || 0} items`}
                    >
                      <View style={styles.binCardContentHorizontal}>
                        <Text style={styles.binCardNameHorizontal}>{bin.name || 'Unnamed Bin'}</Text>
                        <Text style={styles.binCardCountHorizontal}>
                          {bin?.thoughtmarkCount || 0}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            )}
          </View>
        );
      
      case 'ai-tools':
        return <AIToolsCard onPress={handleAIToolsPress} />;
      
      default:
        return null;
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: tokens.colors.background,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: tokens.spacing.lg,
      paddingTop: tokens.spacing.xl,
      paddingBottom: tokens.spacing.md,
    },
    headerTitle: {
      fontSize: tokens.typography.fontSize.xl,
      fontWeight: '700',
      color: tokens.colors.text,
    },
    headerActions: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    actionButton: {
      marginLeft: tokens.spacing.sm,
      padding: tokens.spacing.sm,
    },
    content: {
      flex: 1,
      paddingHorizontal: tokens.spacing.lg,
    },
    tagsContainer: {
      marginBottom: tokens.spacing.md,
    },
    tagsHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: tokens.spacing.sm,
    },
    tagsTitle: {
      fontSize: tokens.typography.fontSize.sm,
      fontWeight: '600',
      color: tokens.colors.textSecondary,
    },
    tagsScrollContent: {
      paddingRight: tokens.spacing.lg,
    },
    tagChip: {
      paddingHorizontal: tokens.spacing.md,
      paddingVertical: tokens.spacing.xs,
      borderRadius: tokens.radius.full,
      backgroundColor: tokens.colors.surface,
      borderWidth: 1,
      borderColor: tokens.colors.border,
      marginRight: tokens.spacing.sm,
    },
    tagChipActive: {
      backgroundColor: tokens.colors.accent,
      borderColor: tokens.colors.accent,
    },
    tagChipText: {
      fontSize: tokens.typography.fontSize.xs,
      color: tokens.colors.textSecondary,
    },
    tagChipTextActive: {
      color: tokens.colors.background,
      fontWeight: '600',
    },
    thoughtmarksList: {
      marginBottom: tokens.spacing.md,
    },
    viewMoreCard: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: tokens.spacing.md,
      backgroundColor: tokens.colors.surface,
      borderRadius: tokens.radius.md,
      borderWidth: 1,
      borderColor: tokens.colors.border,
    },
    viewMoreCount: {
      fontSize: tokens.typography.fontSize.sm,
      color: tokens.colors.textSecondary,
    },
    viewMoreText: {
      fontSize: tokens.typography.fontSize.body,
      color: tokens.colors.text,
      fontWeight: '500',
    },
    emptyState: {
      padding: tokens.spacing.xl,
      alignItems: 'center',
    },
    emptyStateText: {
      fontSize: tokens.typography.fontSize.body,
      color: tokens.colors.textSecondary,
      textAlign: 'center',
      lineHeight: 24,
    },
    tasksList: {
      marginBottom: tokens.spacing.md,
    },
    binsContainer: {
      marginBottom: tokens.spacing.md,
    },
    binsHorizontalContent: {
      paddingRight: tokens.spacing.lg,
    },
    binCardHorizontal: {
      width: 140,
      height: 80,
      backgroundColor: tokens.colors.surface,
      borderRadius: tokens.radius.md,
      borderWidth: 1,
      borderColor: tokens.colors.border,
      marginRight: tokens.spacing.sm,
      justifyContent: 'center',
      alignItems: 'center',
    },
    binCardContentHorizontal: {
      alignItems: 'center',
    },
    binCardNameHorizontal: {
      fontSize: tokens.typography.fontSize.sm,
      fontWeight: '600',
      color: tokens.colors.text,
      marginBottom: tokens.spacing.xs,
    },
    binCardCountHorizontal: {
      fontSize: tokens.typography.fontSize.xs,
      color: tokens.colors.textSecondary,
    },
    binCardSkeletonHorizontal: {
      width: 140,
      height: 80,
      backgroundColor: tokens.colors.backgroundSecondary,
      borderRadius: tokens.radius.md,
      marginRight: tokens.spacing.sm,
      justifyContent: 'center',
      alignItems: 'center',
    },
    tagButton: {
      paddingHorizontal: tokens.spacing.md,
      paddingVertical: tokens.spacing.xs,
      borderRadius: tokens.radius.full,
      borderWidth: 1,
      borderColor: tokens.colors.border,
      marginRight: tokens.spacing.sm,
    },
    tagText: {
      fontSize: tokens.typography.fontSize.sm,
    },
  });

  if (authLoading || dataLoading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Dashboard</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleVoiceRecord}
            accessibilityRole='button'
            accessible={true}
            accessibilityLabel='Voice record'
          >
            <Ionicons name='mic' size={24} color={tokens.colors.accent} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleCreateNew}
            accessibilityRole='button'
            accessible={true}
            accessibilityLabel='Create new'
          >
            <Ionicons name='add' size={24} color={tokens.colors.accent} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {sections.map((section: { id: string; title: string; visible: boolean }) => (
          <DraggableSection
            key={section.id}
            title={section.title}
            onReorder={(fromIndex: number, toIndex: number) => handleReorder(fromIndex, toIndex)}
            collapsible={true}
            defaultCollapsed={!section.visible}
          >
            {renderSectionContent(section.id)}
          </DraggableSection>
        ))}
      </ScrollView>

      <BottomNav navigation={navigation} />

      <OnboardingModal
        visible={showOnboarding}
        onClose={() => handleOnboardingClose()}
        onComplete={() => handleOnboardingClose()}
      />
    </View>
  );
};
