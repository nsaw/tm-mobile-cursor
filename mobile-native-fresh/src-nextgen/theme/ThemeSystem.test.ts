import { ThemeSystem, Theme } from './ThemeSystem';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Mock AsyncStorage
const mockAsyncStorage = AsyncStorage as jest.Mocked<typeof AsyncStorage>;
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
  getAllKeys: jest.fn(),
  multiGet: jest.fn(),
  multiSet: jest.fn(),
  multiRemove: jest.fn(),
}));

// Mock PerformanceMonitor
const mockPerformanceMonitor = {
  getInstance: jest.fn(() => ({
    recordComponentMetrics: jest.fn(),
    recordPerformanceMark: jest.fn(),
    recordPerformanceMeasure: jest.fn(),
    getMetrics: jest.fn(() => ({})),
    clearMetrics: jest.fn(),
    isEnabled: jest.fn(() => true),
    enable: jest.fn(),
    disable: jest.fn(),
  })),
};

jest.mock('../utils/PerformanceMonitor', () => ({
  PerformanceMonitor: mockPerformanceMonitor,
}));

describe('ThemeSystem', () => {
  let themeSystem: ThemeSystem;

  beforeEach(() => {
    themeSystem = ThemeSystem.getInstance();
    themeSystem.clearCache();
    jest.clearAllMocks();
    mockAsyncStorage.setItem.mockResolvedValue();
    
    mockPerformanceMonitor.getInstance.mockReturnValue({
      recordComponentMetrics: jest.fn(),
    } as any);
  });

  it('should be a singleton', () => {
    const instance1 = ThemeSystem.getInstance();
    const instance2 = ThemeSystem.getInstance();
    expect(instance1).toBe(instance2);
  });

  it('should initialize successfully', async () => {
    mockAsyncStorage.getItem.mockResolvedValue('light');
    
    const result = await themeSystem.initialize();
    
    expect(result.isValid).toBe(true);
    expect(result.theme).toBe('light');
  });

  it('should switch theme successfully', async () => {
    mockAsyncStorage.setItem.mockResolvedValue();
    
    const result = await themeSystem.switchTheme('dark');
    
    expect(result.isValid).toBe(true);
    expect(result.theme).toBe('dark');
    expect(mockAsyncStorage.setItem).toHaveBeenCalledWith('theme', 'dark');
  });

  it('should handle theme validation failure', async () => {
    const result = await themeSystem.switchTheme('invalid-theme' as any);
    
    expect(result.isValid).toBe(false);
    expect(result.errors).toHaveLength(1);
  });

  it('should handle theme not found', async () => {
    mockAsyncStorage.getItem.mockResolvedValue(null);
    
    const result = await themeSystem.initialize();
    
    expect(result.isValid).toBe(true);
    expect(result.theme).toBe('light'); // Default theme
  });

  it('should calculate contrast ratio correctly', () => {
    const ratio = themeSystem.calculateContrastRatio('#000000', '#FFFFFF');
    expect(ratio).toBe(21); // Maximum contrast ratio
  });

  it('should validate color accessibility', () => {
    const result = themeSystem.validateColorAccessibility('#000000', '#FFFFFF');
    expect(result.isValid).toBe(true);
    expect(result.contrastRatio).toBe(21);
  });

  it('should handle theme switch timeout', async () => {
    mockAsyncStorage.setItem.mockImplementation(() => 
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('timeout')), 5000)
      )
    );

    const result = await themeSystem.switchTheme('dark');
    
    expect(result.isValid).toBe(false);
    expect(result.errors).toHaveLength(1);
  }, 10000);

  it('should notify listeners on theme change', async () => {
    const listener = jest.fn();
    themeSystem.addListener(listener);
    
    await themeSystem.switchTheme('dark');
    
    expect(listener).toHaveBeenCalledWith('dark');
  });

  it('should handle theme system destruction', () => {
    expect(() => themeSystem.destroy()).not.toThrow();
  });
}); 