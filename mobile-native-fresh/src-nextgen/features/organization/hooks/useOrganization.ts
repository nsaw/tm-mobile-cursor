import { useState, useEffect, useCallback } from 'react';
import { useAppStore } from '../../../state/store';
import {
  Bin,
  Tag,
  OrganizationItem,
  OrganizationFilter,
  BulkOperation,
  OrganizationStats,
} from '../types/organization';
import { organizationService } from '../services/organizationService';

export const useOrganization = () => {
  const { user } = useAppStore();
  const [bins, setBins] = useState<Bin[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [items, setItems] = useState<OrganizationItem[]>([]);
 const [stats, setStats] = useState<OrganizationStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<OrganizationFilter>({});

  useEffect(() => {
    if (user?.id) {
      loadOrganizationData();
    }
  }, [user?.id]);

  const loadOrganizationData = async () => {
    try {
      setLoading(true);
      const [binsData, tagsData, statsData] = await Promise.all([
        organizationService.getBins(),
        organizationService.getTags(),
        organizationService.getStats(),
      ]);
      setBins(binsData);
      setTags(tagsData);
      setStats(statsData);
      setError(null);
    } catch (err) {
      setError('Failed to load organization data');
      console.error('Error loading organization data:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadItems = useCallback(async (filter?: OrganizationFilter) => {
    try {
      const itemsData = await organizationService.getItems(filter || filters);
      setItems(itemsData);
    } catch (err) {
      setError('Failed to load items');
      console.error('Error loading items:', err);
    }
  }, [filters]);

  const createBin = async (binData: Partial<Bin>) => {
    try {
      const newBin = await organizationService.createBin(binData);
      setBins(prev => [...prev, newBin]);
      return { success: true, data: newBin };
    } catch (err) {
      setError('Failed to create bin');
      console.error('Error creating bin:', err);
      return { success: false, error: err };
    }
  };

  const updateBin = async (id: string, updates: Partial<Bin>) => {
    try {
      const updatedBin = await organizationService.updateBin(id, updates);
      setBins(prev => prev.map(bin => bin.id === id ? updatedBin : bin));
      return { success: true, data: updatedBin };
    } catch (err) {
      setError('Failed to update bin');
      console.error('Error updating bin:', err);
      return { success: false, error: err };
    }
  };

  const deleteBin = async (id: string) => {
    try {
      await organizationService.deleteBin(id);
      setBins(prev => prev.filter(bin => bin.id !== id));
      return { success: true };
    } catch (err) {
      setError('Failed to delete bin');
      console.error('Error deleting bin:', err);
      return { success: false, error: err };
    }
  };

  const createTag = async (tagData: Partial<Tag>) => {
    try {
      const newTag = await organizationService.createTag(tagData);
      setTags(prev => [...prev, newTag]);
      return { success: true, data: newTag };
    } catch (err) {
      setError('Failed to create tag');
      console.error('Error creating tag:', err);
      return { success: false, error: err };
    }
  };

  const updateTag = async (id: string, updates: Partial<Tag>) => {
    try {
      const updatedTag = await organizationService.updateTag(id, updates);
      setTags(prev => prev.map(tag => tag.id === id ? updatedTag : tag));
      return { success: true, data: updatedTag };
    } catch (err) {
      setError('Failed to update tag');
      console.error('Error updating tag:', err);
      return { success: false, error: err };
    }
  };

  const deleteTag = async (id: string) => {
    try {
      await organizationService.deleteTag(id);
      setTags(prev => prev.filter(tag => tag.id !== id));
      return { success: true };
    } catch (err) {
      setError('Failed to delete tag');
      console.error('Error deleting tag:', err);
      return { success: false, error: err };
    }
  };

  const performBulkOperation = async (operation: BulkOperation) => {
    try {
      await organizationService.performBulkOperation(operation);
      await loadItems(); // Refresh items after bulk operation
      return { success: true };
    } catch (err) {
      setError('Failed to perform bulk operation');
      console.error('Error performing bulk operation:', err);
      return { success: false, error: err };
    }
  };

  const useBins = useCallback(() => bins, [bins]);
  const useTags = useCallback(() => tags, [tags]);

  return {
    bins: useBins(),
    tags: useTags(),
    items,
    stats,
    loading,
    error,
    filters,
    setFilters,
    createBin,
    updateBin,
    deleteBin,
    createTag,
    updateTag,
    deleteTag,
    loadItems,
    performBulkOperation,
    refreshData: loadOrganizationData,
  };
};
