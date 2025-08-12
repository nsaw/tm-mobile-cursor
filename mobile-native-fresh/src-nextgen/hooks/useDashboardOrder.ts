import { useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface DashboardSection {
  id: string;
  title: string;
  order: number;
  visible: boolean;
}

const DEFAULT_SECTIONS: DashboardSection[] = [
  { id: 'recent-thoughtmarks', title: 'Recent Thoughtmarks', order: 0, visible: true },
  { id: 'active-tasks', title: 'Active Tasks', order: 1, visible: true },
  { id: 'quick-actions', title: 'Quick Actions', order: 2, visible: true },
  { id: 'bins-overview', title: 'Bins Overview', order: 3, visible: true },
];

const STORAGE_KEY = 'dashboard-sections-order';

interface DashboardOrderHook {
  sections: DashboardSection[];
  isLoading: boolean;
  loadOrder: () => Promise<void>;
  reorderSections: (fromIndex: number, toIndex: number) => void;
  toggleSectionVisibility: (sectionId: string) => void;
  getVisibleSections: () => DashboardSection[];
  resetToDefault: () => void;
  getSectionById: (sectionId: string) => DashboardSection | undefined;
  updateSectionTitle: (sectionId: string, newTitle: string) => void;
}

export const useDashboardOrder = (): DashboardOrderHook => {
  const [sections, setSections] = useState<DashboardSection[]>(DEFAULT_SECTIONS);
  const [isLoading, setIsLoading] = useState(true);

  // Load saved order from storage
  const loadOrder = useCallback(async () => {
    try {
      setIsLoading(true);
      const savedOrder = await AsyncStorage.getItem(STORAGE_KEY);
      if (savedOrder) {
        const parsedSections = JSON.parse(savedOrder);
        setSections(parsedSections);
      }
    } catch (error) {
      console.error('Failed to load dashboard order:', error);
      // Fallback to default order
      setSections(DEFAULT_SECTIONS);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save order to storage
  const saveOrder = useCallback(async (newSections: DashboardSection[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newSections));
      setSections(newSections);
    } catch (error) {
      console.error('Failed to save dashboard order:', error);
    }
  }, []);

  // Reorder sections
  const reorderSections = useCallback((fromIndex: number, toIndex: number) => {
    const newSections = [...sections];
    const [movedSection] = newSections.splice(fromIndex, 1);
    newSections.splice(toIndex, 0, movedSection);
    
    // Update order numbers
    const updatedSections = newSections.map((section, index) => ({
      ...section,
      order: index,
    }));
    
    saveOrder(updatedSections);
  }, [sections, saveOrder]);

  // Toggle section visibility
  const toggleSectionVisibility = useCallback((sectionId: string) => {
    const newSections = sections.map(section =>
      section.id === sectionId
        ? { ...section, visible: !section.visible }
        : section
    );
    saveOrder(newSections);
  }, [sections, saveOrder]);

  // Get visible sections in order
  const getVisibleSections = useCallback(() => {
    return sections
      .filter(section => section.visible)
      .sort((a, b) => a.order - b.order);
  }, [sections]);

  // Reset to default order
  const resetToDefault = useCallback(() => {
    saveOrder(DEFAULT_SECTIONS);
  }, [saveOrder]);

  // Get section by ID
  const getSectionById = useCallback((sectionId: string) => {
    return sections.find(section => section.id === sectionId);
  }, [sections]);

  // Update section title
  const updateSectionTitle = useCallback((sectionId: string, newTitle: string) => {
    const newSections = sections.map(section =>
      section.id === sectionId
        ? { ...section, title: newTitle }
        : section
    );
    saveOrder(newSections);
  }, [sections, saveOrder]);

  return {
    sections,
    isLoading,
    loadOrder,
    reorderSections,
    toggleSectionVisibility,
    getVisibleSections,
    resetToDefault,
    getSectionById,
    updateSectionTitle,
  };
};
