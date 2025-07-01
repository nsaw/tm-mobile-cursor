import { apiRequest } from './queryClient';

export interface ExportResult {
  success: boolean;
  message: string;
  zipFileName?: string;
  files?: string[];
}

export interface ExportStatus {
  isRunning: boolean;
  lastExport?: Date;
  availableDownloads: string[];
}

export interface ProgressInfo {
  progress: number;
  stage?: string;
}

export const triggerExport = async (
  type: 'swiftui' | 'full' | 'assets' | 'react-native',
  onProgress?: (progress: ProgressInfo) => void
): Promise<ExportResult> => {
  try {
    if (onProgress) {
      onProgress({ progress: 10, stage: 'Initializing export...' });
    }

    const response = await fetch('/api/admin/export', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken') || 'demo-token-1'}`,
        'X-User-ID': '1'
      },
      body: JSON.stringify({ type })
    });

    if (!response.ok) {
      throw new Error('Export failed');
    }

    const result: ExportResult = await response.json();

    if (onProgress) {
      onProgress({ progress: 100, stage: 'Export completed' });
    }

    return result;
  } catch (error) {
    console.error('Export failed:', error);
    throw new Error(error instanceof Error ? error.message : 'Export failed');
  }
};

export const getExportStatus = async (): Promise<ExportStatus> => {
  try {
    const response = await fetch('/api/admin/export/status', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken') || 'demo-token-1'}`,
        'X-User-ID': '1'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to get export status');
    }

    const status: ExportStatus = await response.json();
    return status;
  } catch (error) {
    console.error('Failed to get export status:', error);
    return {
      isRunning: false,
      availableDownloads: []
    };
  }
};

export const downloadExport = async (filename: string): Promise<void> => {
  try {
    const response = await fetch(`/api/admin/export/download/${filename}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken') || 'demo-token-1'}`,
        'X-User-ID': '1'
      }
    });

    if (!response.ok) {
      throw new Error('Download failed');
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  } catch (error) {
    console.error('Download failed:', error);
    throw error;
  }
};