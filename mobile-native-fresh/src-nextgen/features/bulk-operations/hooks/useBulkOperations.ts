import { useState, useEffect } from 'react';
import { BulkOperation, BulkOperationTemplate, BulkSelection } from '../types/bulk-operations';
import { bulkOperationsService } from '../services/bulkOperationsService';

export const useBulkOperations = () => {
  const [operations, setOperations] = useState<BulkOperation[]>([]);
  const [templates, setTemplates] = useState<BulkOperationTemplate[]>([]);
  const [currentSelection, setCurrentSelection] = useState<BulkSelection | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadOperations();
    loadTemplates();
  }, []);

  const loadOperations = async () => {
    try {
      const allOperations = await bulkOperationsService.getOperations();
      setOperations(allOperations);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load operations');
    }
  };

  const loadTemplates = async () => {
    try {
      const allTemplates = await bulkOperationsService.getTemplates();
      setTemplates(allTemplates);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load templates');
    }
  };

  const createOperation = async (operation: Omit<BulkOperation, 'id' | 'status' | 'progress' | 'results' | 'createdAt' | 'updatedAt'>) => {
    try {
      setLoading(true);
      const newOperation = await bulkOperationsService.createOperation(operation);
      setOperations(prev => [...prev, newOperation]);
      return newOperation;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create operation');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const executeOperation = async (operationId: string) => {
    try {
      setLoading(true);
      const updatedOperation = await bulkOperationsService.executeOperation(operationId);
      setOperations(prev => prev.map(op => op.id === operationId ? updatedOperation : op));
      return updatedOperation;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to execute operation');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const cancelOperation = async (operationId: string) => {
    try {
      const success = await bulkOperationsService.cancelOperation(operationId);
      if (success) {
        await loadOperations(); // Refresh operations
      }
      return success;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to cancel operation');
      throw err;
    }
  };

  const createTemplate = async (template: Omit<BulkOperationTemplate, 'id'>) => {
    try {
      const newTemplate = await bulkOperationsService.createTemplate(template);
      setTemplates(prev => [...prev, newTemplate]);
      return newTemplate;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create template');
      throw err;
    }
  };

  const deleteTemplate = async (templateId: string) => {
    try {
      const success = await bulkOperationsService.deleteTemplate(templateId);
      if (success) {
        setTemplates(prev => prev.filter(t => t.id !== templateId));
      }
      return success;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete template');
      throw err;
    }
  };

  const setSelection = (selection: BulkSelection | null) => {
    setCurrentSelection(selection);
  };

  const clearSelection = () => {
    setCurrentSelection(null);
  };

  return {
    operations,
    templates,
    currentSelection,
    loading,
    error,
    createOperation,
    executeOperation,
    cancelOperation,
    createTemplate,
    deleteTemplate,
    setSelection,
    clearSelection,
    refresh: () => {
      loadOperations();
      loadTemplates();
    },
  };
};
