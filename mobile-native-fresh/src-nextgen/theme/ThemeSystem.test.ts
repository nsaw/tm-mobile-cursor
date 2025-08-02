import { ThemeSystem, Theme } from './ThemeSystem';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Mock dependencies
jest.mock('@react-native-async-storage/async-storage');

const mockAsyncStorage = AsyncStorage as jest.Mocked<typeof AsyncStorage>;

const mockTheme: Theme = {
  id: 'test-theme',
  name: 'Test Theme',
  mode: 'light',
  variant: 'default',
  colors: {
    primary: '#007AFF',
    secondary: '#5856D6',
    background: '#FFFFFF',
    surface: '#F2F2F7',
    text: '#000000',
    textSecondary: '#8E8E93',
    border: '#C6C6C8',
    error: '#FF3B30',
    warning: '#FF9500',
    success: '#34C759',
    info: '#007AFF',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  typography: {
    fontFamily: 'System',
    fontSize: {
      xs: 12,
      sm: 14,
      md: 16,
      lg: 18,
      xl: 20,
      xxl: 24,
    },
    fontWeight: {
      light: '300',
      normal: '400',
      medium: '500',
      bold: '700',
    },
    lineHeight: {
      tight: 1.2,
      normal: 1.5,
      relaxed: 1.8,
    },
  },
  borderRadius: 8,
  shadow: {
    small: '0 1px 3px rgba(0,0,0,0.12)',
    medium: '0 4px 6px rgba(0,0,0,0.1)',
    large: '0 10px 15px rgba(0,0,0,0.1)',
  },
  animation: {
    duration: {
      fast: 150,
      normal: 300,
      slow: 500,
    },
    easing: {
      ease: 'ease',
      easeIn: 'ease-in',
      easeOut: 'ease-out',
      easeInOut: 'ease-in-out',
    },
  },
};

describe('ThemeSystem', () => {
  let themeSystem: ThemeSystem;

  beforeEach(() => {
    jest.clearAllMocks();
    mockAsyncStorage.getItem.mockResolvedValue(null);
    mockAsyncStorage.setItem.mockResolvedValue();
    
    themeSystem = ThemeSystem.getInstance();
  });

  it('should be a singleton', () => {
    const instance1 = ThemeSystem.getInstance();
    const instance2 = ThemeSystem.getInstance();
    expect(instance1).toBe(instance2);
  });

  it('should initialize successfully', async () => {
    await themeSystem.initialize();
    
    const state = themeSystem.getState();
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
    expect(state.current).toBeDefined();
  });

  it('should switch theme successfully', async () => {
    await themeSystem.initialize();
    
    const previousTheme = themeSystem.getCurrentTheme();
    const result = await themeSystem.switchTheme('test-theme');
    
    expect(result.success).toBe(true);
    expect(result.previousTheme).toBe(previousTheme);
    expect(result.newTheme.id).toBe('test-theme');
    expect(result.validationPassed).toBe(true);
  });

  it('should handle theme validation failure', async () => {
    // Mock theme with poor contrast
    const badTheme: Theme = {
      ...mockTheme,
      colors: {
        ...mockTheme.colors,
        text: '#FFFFFF',
        background: '#FFFFFF', // Same color - no contrast
      },
    };
    
    // Add bad theme to available themes
    const state = themeSystem.getState();
    state.available.push(badTheme);
    
    const result = await themeSystem.switchTheme(badTheme.id);
    
    expect(result.success).toBe(false);
    expect(result.error).toContain('contrast');
    expect(result.validationPassed).toBe(false);
  });

  it('should handle theme not found', async () => {
    await themeSystem.initialize();
    
    const result = await themeSystem.switchTheme('non-existent-theme');
    
    expect(result.success).toBe(false);
    expect(result.error).toContain('not found');
  });

  it('should handle theme validation', async () => {
    await themeSystem.initialize();
    
    // Test with a theme that should pass validation
    const result = await themeSystem.switchTheme('light');
    expect(result.validationPassed).toBe(true);
  });

  it('should handle theme switch timeout', async () => {
    // Mock a slow theme switch
    const originalSetItem = mockAsyncStorage.setItem;
    mockAsyncStorage.setItem.mockImplementation(() => 
      new Promise(resolve => setTimeout(resolve, 4000))
    );
    
    await themeSystem.initialize();
    
    const result = await themeSystem.switchTheme('test-theme');
    
    expect(result.success).toBe(false);
    expect(result.error).toContain('timeout');
    
    // Restore original
    mockAsyncStorage.setItem.mockImplementation(originalSetItem);
  });

  it('should notify listeners on theme change', async () => {
    await themeSystem.initialize();
    
    const listener = jest.fn();
    const removeListener = themeSystem.addListener(listener);
    
    await themeSystem.switchTheme('test-theme');
    
    expect(listener).toHaveBeenCalledWith(expect.objectContaining({
      id: 'test-theme',
    }));
    
    removeListener();
  });

  it('should handle theme system destruction', () => {
    expect(() => {
      themeSystem.destroy();
    }).not.toThrow();
    
    // Should be able to get instance after destruction
    const newInstance = ThemeSystem.getInstance();
    expect(newInstance).toBeDefined();
  });
}); 