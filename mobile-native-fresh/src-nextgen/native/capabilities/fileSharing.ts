import { Platform, Share } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as DocumentPicker from 'expo-document-picker';

export interface ShareOptions {
  title?: string;
  message?: string;
  url?: string;
  type?: string;
}

export interface FileInfo {
  name: string;
  size: number;
  type: string;
  uri: string;
}

export class FileSharingService {
  private static instance: FileSharingService;

  static getInstance(): FileSharingService {
    if (!FileSharingService.instance) {
      FileSharingService.instance = new FileSharingService();
    }
    return FileSharingService.instance;
  }

  async shareContent(options: ShareOptions): Promise<boolean> {
    try {
      const shareOptions = {
        title: options.title || 'Share from Thoughtmarks',
        message: options.message || '',
        url: options.url || '',
      };

      const result = await Share.share(shareOptions);
      console.log('Share result:', result);
      return result.action !== Share.dismissedAction;
    } catch (error) {
      console.error('Failed to share content:', error);
      return false;
    }
  }

  async shareFile(filePath: string, options?: ShareOptions): Promise<boolean> {
    try {
      if (!(await Sharing.isAvailableAsync())) {
        console.warn('Sharing is not available on this device');
        return false;
      }

      await Sharing.shareAsync(filePath, {
        mimeType: options?.type || 'application/octet-stream',
        dialogTitle: options?.title || 'Share File',
      });

      return true;
    } catch (error) {
      console.error('Failed to share file:', error);
      return false;
    }
  }

  async pickDocument(options?: {
    type?: string;
    multiple?: boolean;
  }): Promise<FileInfo[]> {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: options?.type || '*/*',
        multiple: options?.multiple || false,
        copyToCacheDirectory: true,
      });

      if (result.canceled) {
        return [];
      }

      const files = Array.isArray(result.assets) ? result.assets : [result.assets];
      return files.map((file) => ({
        name: file.name || 'Unknown',
        size: file.size || 0,
        type: file.mimeType || 'application/octet-stream',
        uri: file.uri,
      }));
    } catch (error) {
      console.error('Failed to pick document:', error);
      throw error;
    }
  }

  async saveFile(content: string, filename: string, directory?: string): Promise<string> {
    try {
      const baseDir = directory || FileSystem.documentDirectory;
      if (!baseDir) {
        throw new Error('Document directory not available');
      }

      const filePath = `${baseDir}${filename}`;
      await FileSystem.writeAsStringAsync(filePath, content);

      console.log('File saved:', filePath);
      return filePath;
    } catch (error) {
      console.error('Failed to save file:', error);
      throw error;
    }
  }

  async readFile(filePath: string): Promise<string> {
    try {
      const content = await FileSystem.readAsStringAsync(filePath);
      return content;
    } catch (error) {
      console.error('Failed to read file:', error);
      throw error;
    }
  }

  async deleteFile(filePath: string): Promise<void> {
    try {
      await FileSystem.deleteAsync(filePath);
      console.log('File deleted:', filePath);
    } catch (error) {
      console.error('Failed to delete file:', error);
      throw error;
    }
  }

  async getFileInfo(filePath: string): Promise<FileInfo | null> {
    try {
      const info = await FileSystem.getInfoAsync(filePath);
      if (!info.exists) {
        return null;
      }

      return {
        name: filePath.split('/').pop() || 'Unknown',
        size: info.size || 0,
        type: 'application/octet-stream',
        uri: filePath,
      };
    } catch (error) {
      console.error('Failed to get file info:', error);
      return null;
    }
  }
}

export const fileSharingService = FileSharingService.getInstance();
