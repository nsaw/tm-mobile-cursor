import { BulkOperation, BulkOperationResult, BulkOperationTemplate, BulkSelection } from '../types/bulk-operations';
import useAppStore from '../../../state/stores/appStore';

class BulkOperationsService {
  private operations: BulkOperation[] = [];
  private templates: BulkOperationTemplate[] = [
    {
      id: 'move-to-bin',
      name: 'Move to Bin',
      description: 'Move selected items to a specific bin',
      type: 'move',
      targetType: 'thoughtmarks',
      parameters: { binId: '' },
      isSystem: true,
    },
    {
      id: 'add-tags',
      name: 'Add Tags',
      description: 'Add tags to selected items',
      type: 'tag',
      targetType: 'thoughtmarks',
      parameters: { tagIds: [] },
      isSystem: true,
    },
    {
      id: 'remove-tags',
      name: 'Remove Tags',
      description: 'Remove tags from selected items',
      type: 'untag',
      targetType: 'thoughtmarks',
      parameters: { tagIds: [] },
      isSystem: true,
    },
    {
      id: 'delete-items',
      name: 'Delete Items',
      description: 'Permanently delete selected items',
      type: 'delete',
      targetType: 'thoughtmarks',
      parameters: { confirm: false },
      isSystem: true,
    },
    {
      id: 'export-items',
      name: 'Export Items',
      description: 'Export selected items to file',
      type: 'export',
      targetType: 'thoughtmarks',
      parameters: { format: 'json', includeMetadata: true },
      isSystem: true,
    },
  ];

  async createOperation(operation: Omit<BulkOperation, 'id' | 'status' | 'progress' | 'results' | 'createdAt' | 'updatedAt'>): Promise<BulkOperation> {
    const newOperation: BulkOperation = {
      ...operation,
      id: Date.now().toString(),
      status: 'pending',
      progress: 0,
      results: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.operations.push(newOperation);
    return newOperation;
  }

  async executeOperation(operationId: string): Promise<BulkOperation> {
    const operation = this.operations.find(op => op.id === operationId);
    if (!operation) throw new Error('Operation not found');

    operation.status = 'running';
    operation.progress = 0;
    operation.results = [];

    try {
      const results = await this.performBulkOperation(operation);
      operation.results = results;
      operation.status = 'completed';
      operation.progress = 100;
    } catch (error) {
      operation.status = 'failed';
      operation.results.push({
        itemId: 'operation',
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }

    operation.updatedAt = new Date().toISOString();
    return operation;
  }

  private async performBulkOperation(operation: BulkOperation): Promise<BulkOperationResult[]> {
    const results: BulkOperationResult[] = [];
    const totalItems = operation.itemIds.length;

    for (let i = 0; i < operation.itemIds.length; i++) {
      const itemId = operation.itemIds[i];
      
      try {
        await this.performSingleOperation(operation, itemId);
        results.push({
          itemId,
          success: true,
        });
      } catch (error) {
        results.push({
          itemId,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }

      // Update progress
      operation.progress = Math.round(((i + 1) / totalItems) * 100);
      operation.updatedAt = new Date().toISOString();
    }

    return results;
  }

  private async performSingleOperation(operation: BulkOperation, itemId: string): Promise<void> {
    const store = useAppStore.getState();

    switch (operation.type) {
      case 'move':
        if (operation.targetType === 'thoughtmarks') {
          const thoughtmark = store.thoughtmarks.find((t: any) => t.id === itemId);
          if (thoughtmark) {
            store.updateThoughtmark(itemId, { binId: operation.parameters.binId });
          }
        }
        break;

      case 'tag':
        if (operation.targetType === 'thoughtmarks') {
          const thoughtmark = store.thoughtmarks.find((t: any) => t.id === itemId);
          if (thoughtmark) {
            const currentTags = thoughtmark.tags || [];
            const newTags = [...new Set([...currentTags, ...operation.parameters.tagIds])];
            store.updateThoughtmark(itemId, { tags: newTags });
          }
        }
        break;

      case 'untag':
        if (operation.targetType === 'thoughtmarks') {
          const thoughtmark = store.thoughtmarks.find((t: any) => t.id === itemId);
          if (thoughtmark) {
            const currentTags = thoughtmark.tags || [];
            const newTags = currentTags.filter((tag: any) => !operation.parameters.tagIds.includes(tag));
            store.updateThoughtmark(itemId, { tags: newTags });
          }
        }
        break;

      case 'delete':
        if (operation.targetType === 'thoughtmarks') {
          store.deleteThoughtmark(itemId);
        } else if (operation.targetType === 'tasks') {
          store.deleteTask(itemId);
        } else if (operation.targetType === 'bins') {
          store.deleteBin(itemId);
        }
        break;

      case 'export':
        // Export logic would be implemented here
        console.log('Exporting item:', itemId);
        break;

      default:
        throw new Error(`Unsupported operation type: ${operation.type}`);
    }
  }

  async getOperations(): Promise<BulkOperation[]> {
    return this.operations;
  }

  async getOperation(id: string): Promise<BulkOperation | null> {
    return this.operations.find(op => op.id === id) || null;
  }

  async getTemplates(): Promise<BulkOperationTemplate[]> {
    return this.templates;
  }

  async createTemplate(template: Omit<BulkOperationTemplate, 'id'>): Promise<BulkOperationTemplate> {
    const newTemplate: BulkOperationTemplate = {
      ...template,
      id: Date.now().toString(),
    };

    this.templates.push(newTemplate);
    return newTemplate;
  }

  async deleteTemplate(id: string): Promise<boolean> {
    const template = this.templates.find(t => t.id === id);
    if (!template || template.isSystem) return false;

    const index = this.templates.findIndex(t => t.id === id);
    this.templates.splice(index, 1);
    return true;
  }

  async cancelOperation(id: string): Promise<boolean> {
    const operation = this.operations.find(op => op.id === id);
    if (!operation || operation.status !== 'running') return false;

    operation.status = 'cancelled';
    operation.updatedAt = new Date().toISOString();
    return true;
  }
}

export const bulkOperationsService = new BulkOperationsService();
