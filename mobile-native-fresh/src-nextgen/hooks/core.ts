import React, { useState, useEffect, useCallback, useRef, useMemo, useContext } from 'react';
import type {
  ThemeConfig,
  ComponentRole,
  ComponentVariant,
  ComponentSize,
  ComponentState,
  RoleContext,
  EnvironmentConfig,
  ValidationResult,
  PerformanceMetric,
  HookResult,
  HookOptions,
} from '../types/core';

// ============================================================================
// Theme Hooks
// ============================================================================

// Theme context interface
interface ThemeContextValue {
  theme: ThemeConfig;
  setTheme: (themeName: string) => Promise<void>;
  toggleTheme: () => Promise<void>;
  availableThemes: string[];
  isDark: boolean;
}

// Theme context
const ThemeContext = React.createContext<ThemeContextValue | null>(null);

// Theme provider component
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeConfig>({
    name: 'light',
    isDark: false,
    colors: {
      primary: '#007AFF',
      secondary: '#5856D6',
      accent: '#FF9500',
      background: '#FFFFFF',
      surface: '#F2F2F7',
      text: '#000000',
      textSecondary: '#8E8E93',
      border: '#C6C6C8',
      error: '#FF3B30',
      warning: '#FF9500',
      success: '#34C759',
      info: '#007AFF',
      disabled: '#C7C7CC',
      overlay: 'rgba(0, 0, 0, 0.5)',
      shadow: 'rgba(0, 0, 0, 0.1)',
    },
    typography: {
      fontFamily: { regular: 'System', medium: 'System', bold: 'System', light: 'System' },
      fontSize: { xs: 12, sm: 14, base: 16, lg: 18, xl: 20, '2xl': 24, '3xl': 30, '4xl': 36 },
      lineHeight: { tight: 1.25, normal: 1.5, relaxed: 1.75 },
      fontWeight: { light: '300', normal: '400', medium: '500', bold: '700' },
    },
    spacing: { xs: 4, sm: 8, md: 16, lg: 24, xl: 32, '2xl': 48, '3xl': 64, '4xl': 96 },
    borderRadius: { none: 0, sm: 4, md: 8, lg: 12, xl: 16, full: 9999 },
    shadows: {
      sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
      xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
      '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    },
  });

  const [availableThemes] = useState(['light', 'dark']);

  const setTheme = useCallback(async (themeName: string) => {
    // In a real implementation, this would call the theme system
    console.log(`🎨 Setting theme to: ${themeName}`);
    // For now, just update the state
    setThemeState(prev => ({ ...prev, name: themeName, isDark: themeName === 'dark' }));
  }, []);

  const toggleTheme = useCallback(async () => {
    const newTheme = theme.name === 'light' ? 'dark' : 'light';
    await setTheme(newTheme);
  }, [theme.name, setTheme]);

  const value = useMemo(() => ({
    theme,
    setTheme,
    toggleTheme,
    availableThemes,
    isDark: theme.isDark,
  }), [theme, setTheme, toggleTheme, availableThemes]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

// Use theme hook
export const useTheme = (): ThemeContextValue => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Use theme color hook
export const useThemeColor = (colorKey: keyof ThemeConfig['colors']): string => {
  const { theme } = useTheme();
  return theme.colors[colorKey];
};

// Use theme spacing hook
export const useThemeSpacing = (size: keyof ThemeConfig['spacing']): number => {
  const { theme } = useTheme();
  return theme.spacing[size];
};

// Use theme typography hook
export const useThemeTypography = () => {
  const { theme } = useTheme();
  return theme.typography;
};

// ============================================================================
// Role Hooks
// ============================================================================

// Role context interface
interface RoleContextValue {
  role: string;
  variant: ComponentVariant;
  size: ComponentSize;
  state: ComponentState;
  props: Record<string, any>;
  updateRole: (updates: Partial<RoleContext>) => void;
}

// Role context
const RoleContext = React.createContext<RoleContextValue | null>(null);

// Role provider component
export const RoleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [roleContext, setRoleContext] = useState<RoleContextValue>({
    role: 'container',
    variant: 'default',
    size: 'md',
    state: 'default',
    props: {},
    updateRole: () => {},
  });

  const updateRole = useCallback((updates: Partial<RoleContext>) => {
    setRoleContext(prev => ({ ...prev, ...updates }));
  }, []);

  const value = useMemo(() => ({
    ...roleContext,
    updateRole,
  }), [roleContext, updateRole]);

  return (
    <RoleContext.Provider value={value}>
      {children}
    </RoleContext.Provider>
  );
};

// Use role hook
export const useRole = (): RoleContextValue => {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
};

// Use role variant hook
export const useRoleVariant = (): ComponentVariant => {
  const { variant } = useRole();
  return variant;
};

// Use role size hook
export const useRoleSize = (): ComponentSize => {
  const { size } = useRole();
  return size;
};

// Use role state hook
export const useRoleState = (): ComponentState => {
  const { state } = useRole();
  return state;
};

// ============================================================================
// Environment Hooks
// ============================================================================

// Environment context interface
interface EnvironmentContextValue {
  config: EnvironmentConfig;
  isValid: boolean;
  errors: string[];
  warnings: string[];
  reloadConfig: () => Promise<void>;
}

// Environment context
const EnvironmentContext = React.createContext<EnvironmentContextValue | null>(null);

// Environment provider component
export const EnvironmentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<EnvironmentConfig>({
    apiUrl: 'https://api.thoughtmarks.app',
    apiKey: '',
    environment: 'development',
    debugMode: true,
    timeout: 30000,
    retryAttempts: 3,
    cacheEnabled: true,
    analyticsEnabled: false,
    crashReportingEnabled: false,
  });

  const [isValid, setIsValid] = useState(true);
  const [errors, setErrors] = useState<string[]>([]);
  const [warnings, setWarnings] = useState<string[]>([]);

  const reloadConfig = useCallback(async () => {
    console.log('🔄 Reloading environment configuration...');
    // In a real implementation, this would reload from the environment system
    // For now, just log the action
  }, []);

  const value = useMemo(() => ({
    config,
    isValid,
    errors,
    warnings,
    reloadConfig,
  }), [config, isValid, errors, warnings, reloadConfig]);

  return (
    <EnvironmentContext.Provider value={value}>
      {children}
    </EnvironmentContext.Provider>
  );
};

// Use environment hook
export const useEnvironment = (): EnvironmentContextValue => {
  const context = useContext(EnvironmentContext);
  if (!context) {
    throw new Error('useEnvironment must be used within an EnvironmentProvider');
  }
  return context;
};

// Use environment config hook
export const useEnvironmentConfig = (): EnvironmentConfig => {
  const { config } = useEnvironment();
  return config;
};

// Use environment value hook
export const useEnvironmentValue = <T>(key: keyof EnvironmentConfig, fallback?: T): T => {
  const { config } = useEnvironment();
  return (config[key] as T) ?? fallback;
};

// ============================================================================
// Validation Hooks
// ============================================================================

// Use validation hook
export const useValidation = <T>(
  value: T,
  rules: Array<(value: T) => ValidationResult>,
  options?: HookOptions
): HookResult<ValidationResult> => {
  const [result, setResult] = useState<ValidationResult>({
    isValid: true,
    errors: [],
    warnings: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const validate = useCallback(async () => {
    if (!options?.enabled) return;

    setLoading(true);
    setError(null);

    try {
      const validationResults = rules.map(rule => rule(value));
      const allErrors = validationResults.flatMap(r => r.errors);
      const allWarnings = validationResults.flatMap(r => r.warnings);

      setResult({
        isValid: allErrors.length === 0,
        errors: allErrors,
        warnings: allWarnings,
        data: value,
      });
    } catch (err) {
      setError(err as Error);
      setResult({
        isValid: false,
        errors: [(err as Error).message],
        warnings: [],
        data: value,
      });
    } finally {
      setLoading(false);
    }
  }, [value, rules, options?.enabled]);

  useEffect(() => {
    validate();
  }, [validate]);

  return {
    data: result,
    loading,
    error,
    refetch: validate,
  };
};

// Use form validation hook
export const useFormValidation = <T extends Record<string, any>>(
  initialValues: T,
  validationSchema: Record<keyof T, Array<(value: any) => ValidationResult>>
) => {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string[]>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});

  const validateField = useCallback((field: keyof T, value: any) => {
    const fieldRules = validationSchema[field];
    if (!fieldRules) return [];

    const validationResults = fieldRules.map(rule => rule(value));
    return validationResults.flatMap(r => r.errors);
  }, [validationSchema]);

  const setValue = useCallback((field: keyof T, value: any) => {
    setValues(prev => ({ ...prev, [field]: value }));
    const fieldErrors = validateField(field, value);
    setErrors(prev => ({ ...prev, [field]: fieldErrors }));
  }, [validateField]);

  const setTouchedField = useCallback((field: keyof T, isTouched: boolean = true) => {
    setTouched(prev => ({ ...prev, [field]: isTouched }));
  }, []);

  const isValid = useMemo(() => {
    return Object.keys(validationSchema).every(field => {
      const fieldErrors = errors[field as keyof T];
      return !fieldErrors || fieldErrors.length === 0;
    });
  }, [errors, validationSchema]);

  return {
    values,
    errors,
    touched,
    isValid,
    setValue,
    setTouchedField,
    setValues,
  };
};

// ============================================================================
// Performance Hooks
// ============================================================================

// Use performance monitoring hook
export const usePerformanceMonitoring = (
  componentId: string,
  options?: {
    enabled?: boolean;
    threshold?: number;
    onThresholdExceeded?: (metric: PerformanceMetric) => void;
  }
) => {
  const [metrics, setMetrics] = useState<PerformanceMetric[]>([]);
  const startTimeRef = useRef<number>(0);

  const startMeasurement = useCallback(() => {
    if (!options?.enabled) return;
    startTimeRef.current = performance.now();
  }, [options?.enabled]);

  const endMeasurement = useCallback((metricName: string) => {
    if (!options?.enabled || startTimeRef.current === 0) return;

    const endTime = performance.now();
    const duration = endTime - startTimeRef.current;

    const metric: PerformanceMetric = {
      name: metricName,
      value: duration,
      unit: 'ms',
      timestamp: Date.now(),
      componentId,
    };

    setMetrics(prev => [...prev, metric]);

    if (options.threshold && duration > options.threshold) {
      options.onThresholdExceeded?.(metric);
    }

    startTimeRef.current = 0;
  }, [options?.enabled, options?.threshold, options?.onThresholdExceeded, componentId]);

  const clearMetrics = useCallback(() => {
    setMetrics([]);
  }, []);

  return {
    metrics,
    startMeasurement,
    endMeasurement,
    clearMetrics,
  };
};

// Use render performance hook
export const useRenderPerformance = (componentId: string) => {
  const { startMeasurement, endMeasurement } = usePerformanceMonitoring(componentId, {
    enabled: true,
    threshold: 16, // 60fps threshold
    onThresholdExceeded: (metric) => {
      console.warn(`⚠️ Render performance exceeded threshold: ${metric.value}ms`, metric);
    },
  });

  useEffect(() => {
    startMeasurement();
    return () => {
      endMeasurement('render');
    };
  }, [startMeasurement, endMeasurement]);
};

// ============================================================================
// Utility Hooks
// ============================================================================

// Use previous value hook
export const usePrevious = <T>(value: T): T | undefined => {
  const ref = useRef<T>();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};

// Use mounted hook
export const useMounted = (): boolean => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  return mounted;
};

// Use interval hook
export const useInterval = (callback: () => void, delay: number | null) => {
  const savedCallback = useRef(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (delay === null) return;

    const id = setInterval(() => savedCallback.current(), delay);
    return () => clearInterval(id);
  }, [delay]);
};

// Use timeout hook
export const useTimeout = (callback: () => void, delay: number | null) => {
  const savedCallback = useRef(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (delay === null) return;

    const id = setTimeout(() => savedCallback.current(), delay);
    return () => clearTimeout(id);
  }, [delay]);
};

// Use debounce hook
export const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// Use throttle hook
export const useThrottle = <T>(value: T, delay: number): T => {
  const [throttledValue, setThrottledValue] = useState<T>(value);
  const lastRun = useRef(Date.now());

  useEffect(() => {
    const handler = setTimeout(() => {
      if (Date.now() - lastRun.current >= delay) {
        setThrottledValue(value);
        lastRun.current = Date.now();
      }
    }, delay - (Date.now() - lastRun.current));

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return throttledValue;
};

// Use local storage hook
export const useLocalStorage = <T>(key: string, initialValue: T) => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = useCallback((value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  return [storedValue, setValue] as const;
};

// Use session storage hook
export const useSessionStorage = <T>(key: string, initialValue: T) => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.sessionStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading sessionStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = useCallback((value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.sessionStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting sessionStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  return [storedValue, setValue] as const;
};

// Use media query hook
export const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }

    const listener = () => setMatches(media.matches);
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, [matches, query]);

  return matches;
};

// Use window size hook
export const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
};

// Use scroll position hook
export const useScrollPosition = () => {
  const [scrollPosition, setScrollPosition] = useState({
    x: window.pageXOffset,
    y: window.pageYOffset,
  });

  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition({
        x: window.pageXOffset,
        y: window.pageYOffset,
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return scrollPosition;
}; 