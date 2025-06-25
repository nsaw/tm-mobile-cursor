import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../features/auth/hooks/useAuth';

export interface DashboardSection {
  id: string;
  title: string;
  visible: boolean;
  order: number;
}

const DEFAULT_SECTIONS: DashboardSection[] = [
  { id: 'recent-thoughtmarks', title: 'RECENT THOUGHTMARKS', visible: true, order: 0 },
  { id: 'tasks', title: 'TASK HIT-LIST', visible: true, order: 1 },
  { id: 'bins', title: 'YOUR BINS', visible: true, order: 2 },
];

export const useDashboardOrder = () => {
  const { user } = useAuth();
  const [sections, setSections] = useState<DashboardSection[]>(DEFAULT_SECTIONS);
  const [isLoading, setIsLoading] = useState(true);

  const getStorageKey = () => {
    if (!user?.id) return 'dashboard-order-guest';
    return `dashboard-order-${user.id}`;
  };

  const loadSections = async () => {
    try {
      const key = getStorageKey();
      const stored = await AsyncStorage.getItem(key);
      if (stored) {
        const parsedSections = JSON.parse(stored);
        setSections(parsedSections);
      } else {
        setSections(DEFAULT_SECTIONS);
      }
    } catch (error) {
      console.error('Error loading dashboard sections:', error);
      setSections(DEFAULT_SECTIONS);
    } finally {
      setIsLoading(false);
    }
  };

  const saveSections = async (newSections: DashboardSection[]) => {
    try {
      const key = getStorageKey();
      await AsyncStorage.setItem(key, JSON.stringify(newSections));
      setSections(newSections);
    } catch (error) {
      console.error('Error saving dashboard sections:', error);
    }
  };

  const reorderSections = async (fromIndex: number, toIndex: number) => {
    const newSections = [...sections];
    const [movedSection] = newSections.splice(fromIndex, 1);
    newSections.splice(toIndex, 0, movedSection);
    
    // Update order property
    newSections.forEach((section, index) => {
      section.order = index;
    });
    
    await saveSections(newSections);
  };

  const toggleSectionVisibility = async (sectionId: string) => {
    const newSections = sections.map(section => 
      section.id === sectionId 
        ? { ...section, visible: !section.visible }
        : section
    );
    await saveSections(newSections);
  };

  const resetToDefault = async () => {
    await saveSections(DEFAULT_SECTIONS);
  };

  useEffect(() => {
    loadSections();
  }, [user?.id]);

  return {
    sections,
    isLoading,
    reorderSections,
    toggleSectionVisibility,
    resetToDefault,
  };
}; 