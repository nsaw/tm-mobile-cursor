import { useToast } from "@/hooks/use-toast";
import type { Thoughtmark, Bin, ThoughtmarkWithBin } from "@shared/schema";

interface BackupData {
  version: string;
  timestamp: string;
  user: {
    id: number;
    email: string;
    displayName?: string;
  };
  bins: Bin[];
  thoughtmarks: Thoughtmark[];
  metadata: {
    totalThoughtmarks: number;
    totalBins: number;
    exportedAt: string;
  };
}

class OfflineBackupManager {
  private readonly STORAGE_KEY = 'thoughtmarks_offline_backup';
  private readonly VERSION = '1.0.0';

  async createBackup(
    thoughtmarks: ThoughtmarkWithBin[], 
    bins: Bin[], 
    user: { id: number; email: string; displayName?: string }
  ): Promise<BackupData> {
    const backup: BackupData = {
      version: this.VERSION,
      timestamp: new Date().toISOString(),
      user: {
        id: user.id,
        email: user.email,
        displayName: user.displayName || undefined
      },
      bins,
      thoughtmarks: thoughtmarks.map(tm => ({
        id: tm.id,
        title: tm.title,
        content: tm.content,
        tags: tm.tags,
        attachments: tm.attachments || [],
        binId: tm.binId,
        userId: tm.userId,
        isDeleted: tm.isDeleted,
        deletedAt: tm.deletedAt,
        createdAt: tm.createdAt,
        updatedAt: tm.updatedAt
      })),
      metadata: {
        totalThoughtmarks: thoughtmarks.length,
        totalBins: bins.length,
        exportedAt: new Date().toLocaleString()
      }
    };

    return backup;
  }

  async saveToLocalStorage(backup: BackupData): Promise<void> {
    try {
      const compressed = JSON.stringify(backup);
      localStorage.setItem(this.STORAGE_KEY, compressed);
      localStorage.setItem(`${this.STORAGE_KEY}_timestamp`, backup.timestamp);
    } catch (error) {
      throw new Error('Failed to save backup to local storage');
    }
  }

  async loadFromLocalStorage(): Promise<BackupData | null> {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (!stored) return null;
      
      return JSON.parse(stored) as BackupData;
    } catch (error) {
      console.error('Failed to load backup from local storage:', error);
      return null;
    }
  }

  async downloadBackup(backup: BackupData, filename?: string): Promise<void> {
    const json = JSON.stringify(backup, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = filename || `thoughtmarks_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  async createAndDownloadBackup(
    thoughtmarks: ThoughtmarkWithBin[], 
    bins: Bin[], 
    user: { id: number; email: string; displayName?: string }
  ): Promise<void> {
    const backup = await this.createBackup(thoughtmarks, bins, user);
    await this.saveToLocalStorage(backup);
    await this.downloadBackup(backup);
  }

  async autoBackup(
    thoughtmarks: ThoughtmarkWithBin[], 
    bins: Bin[], 
    user: { id: number; email: string; displayName?: string }
  ): Promise<void> {
    try {
      const backup = await this.createBackup(thoughtmarks, bins, user);
      await this.saveToLocalStorage(backup);
    } catch (error) {
      console.error('Auto backup failed:', error);
    }
  }

  getLastBackupTime(): string | null {
    return localStorage.getItem(`${this.STORAGE_KEY}_timestamp`);
  }

  async validateBackup(backup: BackupData): Promise<boolean> {
    try {
      return !!(
        backup.version &&
        backup.timestamp &&
        backup.user &&
        Array.isArray(backup.bins) &&
        Array.isArray(backup.thoughtmarks) &&
        backup.metadata
      );
    } catch {
      return false;
    }
  }

  async restoreFromFile(file: File): Promise<BackupData> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const content = e.target?.result as string;
          const backup = JSON.parse(content) as BackupData;
          
          if (await this.validateBackup(backup)) {
            resolve(backup);
          } else {
            reject(new Error('Invalid backup file format'));
          }
        } catch (error) {
          reject(new Error('Failed to parse backup file'));
        }
      };
      reader.onerror = () => reject(new Error('Failed to read backup file'));
      reader.readAsText(file);
    });
  }

  clearLocalBackup(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    localStorage.removeItem(`${this.STORAGE_KEY}_timestamp`);
  }

  getBackupStats(): {
    hasBackup: boolean;
    lastBackup: string | null;
    size: number;
  } {
    const hasBackup = !!localStorage.getItem(this.STORAGE_KEY);
    const lastBackup = this.getLastBackupTime();
    const size = localStorage.getItem(this.STORAGE_KEY)?.length || 0;

    return {
      hasBackup,
      lastBackup,
      size
    };
  }
}

export const offlineBackupManager = new OfflineBackupManager();

// Auto-backup hook
export function useAutoBackup(
  thoughtmarks: ThoughtmarkWithBin[], 
  bins: Bin[], 
  user: { id: number; email: string; displayName?: string } | null
) {
  const { toast } = useToast();

  const triggerAutoBackup = async () => {
    if (!user || !thoughtmarks.length) return;

    try {
      await offlineBackupManager.autoBackup(thoughtmarks, bins, user);
    } catch (error) {
      console.error('Auto backup failed:', error);
    }
  };

  // Auto backup every 5 minutes when data changes
  const scheduleAutoBackup = () => {
    const interval = setInterval(triggerAutoBackup, 5 * 60 * 1000);
    return () => clearInterval(interval);
  };

  return {
    triggerAutoBackup,
    scheduleAutoBackup,
    createManualBackup: async () => {
      if (!user) {
        toast({
          title: "Backup Failed",
          description: "User not authenticated",
          variant: "destructive"
        });
        return;
      }

      try {
        await offlineBackupManager.createAndDownloadBackup(thoughtmarks, bins, user);
        toast({
          title: "Backup Created",
          description: "Your thoughtmarks have been backed up locally and downloaded"
        });
      } catch (error) {
        toast({
          title: "Backup Failed",
          description: "Failed to create backup",
          variant: "destructive"
        });
      }
    }
  };
}