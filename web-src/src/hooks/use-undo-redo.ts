import { useState, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

export interface UndoAction {
  id: string;
  type: 'delete' | 'archive' | 'bulk_delete' | 'bulk_archive' | 'move';
  description: string;
  data: any;
  timestamp: number;
}

export function useUndoRedo() {
  const [undoStack, setUndoStack] = useState<UndoAction[]>([]);
  const [redoStack, setRedoStack] = useState<UndoAction[]>([]);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const addAction = useCallback((action: Omit<UndoAction, 'id' | 'timestamp'>) => {
    const newAction: UndoAction = {
      ...action,
      id: Date.now().toString(),
      timestamp: Date.now(),
    };
    
    setUndoStack(prev => [...prev.slice(-9), newAction]); // Keep last 10 actions
    setRedoStack([]); // Clear redo stack when new action is added
  }, []);

  const undo = useCallback(async () => {
    if (undoStack.length === 0) return;

    const action = undoStack[undoStack.length - 1];
    setUndoStack(prev => prev.slice(0, -1));
    setRedoStack(prev => [...prev, action]);

    try {
      switch (action.type) {
        case 'delete':
          // Restore single thoughtmark
          await apiRequest('POST', '/api/thoughtmarks/restore', action.data);
          break;
        
        case 'archive':
          // Unarchive single thoughtmark
          await apiRequest('POST', `/api/thoughtmarks/${action.data.id}/unarchive`);
          break;
        
        case 'bulk_delete':
          // Restore multiple thoughtmarks
          await apiRequest('POST', '/api/thoughtmarks/bulk-restore', { 
            thoughtmarks: action.data.thoughtmarks 
          });
          break;
        
        case 'bulk_archive':
          // Unarchive multiple thoughtmarks
          const unarchivePromises = action.data.ids.map((id: number) => 
            apiRequest('POST', `/api/thoughtmarks/${id}/unarchive`)
          );
          await Promise.all(unarchivePromises);
          break;
        
        case 'move':
          // Move thoughtmark back to original bin
          await apiRequest('PATCH', `/api/thoughtmarks/${action.data.id}`, {
            binId: action.data.originalBinId
          });
          break;
      }

      queryClient.invalidateQueries({ queryKey: ["/api/thoughtmarks"] });
      queryClient.invalidateQueries({ queryKey: ["/api/bins"] });
      
      toast({
        title: "Action undone",
        description: `Undid: ${action.description}`,
      });
    } catch (error) {
      // If undo fails, put action back
      setUndoStack(prev => [...prev, action]);
      setRedoStack(prev => prev.slice(0, -1));
      
      toast({
        title: "Undo failed",
        description: "Could not undo the last action",
        variant: "destructive",
      });
    }
  }, [undoStack, queryClient, toast]);

  const redo = useCallback(async () => {
    if (redoStack.length === 0) return;

    const action = redoStack[redoStack.length - 1];
    setRedoStack(prev => prev.slice(0, -1));
    setUndoStack(prev => [...prev, action]);

    try {
      switch (action.type) {
        case 'delete':
          await apiRequest('DELETE', `/api/thoughtmarks/${action.data.id}`);
          break;
        
        case 'archive':
          await apiRequest('POST', `/api/thoughtmarks/${action.data.id}/archive`);
          break;
        
        case 'bulk_delete':
          const deletePromises = action.data.ids.map((id: number) => 
            apiRequest('DELETE', `/api/thoughtmarks/${id}`)
          );
          await Promise.all(deletePromises);
          break;
        
        case 'bulk_archive':
          const archivePromises = action.data.ids.map((id: number) => 
            apiRequest('POST', `/api/thoughtmarks/${id}/archive`)
          );
          await Promise.all(archivePromises);
          break;
        
        case 'move':
          await apiRequest('PATCH', `/api/thoughtmarks/${action.data.id}`, {
            binId: action.data.newBinId
          });
          break;
      }

      queryClient.invalidateQueries({ queryKey: ["/api/thoughtmarks"] });
      queryClient.invalidateQueries({ queryKey: ["/api/bins"] });
      
      toast({
        title: "Action redone",
        description: `Redid: ${action.description}`,
      });
    } catch (error) {
      // If redo fails, put action back
      setRedoStack(prev => [...prev, action]);
      setUndoStack(prev => prev.slice(0, -1));
      
      toast({
        title: "Redo failed",
        description: "Could not redo the action",
        variant: "destructive",
      });
    }
  }, [redoStack, queryClient, toast]);

  const canUndo = undoStack.length > 0;
  const canRedo = redoStack.length > 0;
  const lastAction = undoStack[undoStack.length - 1];

  return {
    addAction,
    undo,
    redo,
    canUndo,
    canRedo,
    lastAction,
    undoStack,
    redoStack,
  };
}