import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';
import { useThoughtmarks } from '../hooks/useThoughtmarks';
import { useBins } from '../hooks/useBins';
import { analyticsService } from '../services/analyticsService';
import { errorService } from '../services/errorService';

export interface AppState {
  isInitialized: boolean;
  currentRoute: string;
  lastActiveTime: number;
  featureFlags: {
    premium: boolean;
    beta: boolean;
    analytics: boolean;
  };
  performance: {
    navigationTime: number;
    renderTime: number;
    memoryUsage: number;
  };
}

export type AppAction = 
  | { type: 'INITIALIZE_APP' }
  | { type: 'SET_CURRENT_ROUTE'; payload: string }
  | { type: 'UPDATE_LAST_ACTIVE' }
  | { type: 'SET_FEATURE_FLAG'; payload: { key: keyof AppState['featureFlags']; value: boolean } }
  | { type: 'UPDATE_PERFORMANCE'; payload: Partial<AppState['performance']> }
  | { type: 'RESET_APP_STATE' };

export interface AppStateContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  isAuthenticated: boolean;
  theme: unknown;
  thoughtmarks: unknown;
  bins: unknown;
  trackEvent: (event: string, properties?: Record<string, unknown>) => void;
  reportError: (error: unknown, context?: Record<string, unknown>) => void;
}

const AppStateContext = createContext<AppStateContextType | undefined>(undefined);

export const useAppState = (): AppStateContextType => {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error('useAppState must be used within an AppStateProvider');
  }
  return context;
};

const initialState: AppState = {
  isInitialized: false,
  currentRoute: 'Auth',
  lastActiveTime: Date.now(),
  featureFlags: {
    premium: false,
    beta: false,
    analytics: true,
  },
  performance: {
    navigationTime: 0,
    renderTime: 0,
    memoryUsage: 0,
  },
};

const appStateReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'INITIALIZE_APP':
      return {
        ...state,
        isInitialized: true,
        lastActiveTime: Date.now(),
      };
    case 'SET_CURRENT_ROUTE':
      return {
        ...state,
        currentRoute: action.payload,
        lastActiveTime: Date.now(),
      };
    case 'UPDATE_LAST_ACTIVE':
      return {
        ...state,
        lastActiveTime: Date.now(),
      };
    case 'SET_FEATURE_FLAG':
      return {
        ...state,
        featureFlags: {
          ...state.featureFlags,
          [action.payload.key]: action.payload.value,
        },
      };
    case 'UPDATE_PERFORMANCE':
      return {
        ...state,
        performance: {
          ...state.performance,
          ...action.payload,
        },
      };
    case 'RESET_APP_STATE':
      return initialState;
    default:
      return state;
  }
};

export interface AppStateProviderProps {
  children: ReactNode;
}

export const AppStateProvider: React.FC<AppStateProviderProps> = ({ children }): React.JSX.Element => {
  const [state, dispatch] = useReducer(appStateReducer, initialState);
  const { isAuthenticated } = useAuth();
  const theme = useTheme();
  const thoughtmarks = useThoughtmarks();
  const bins = useBins();

  const trackEvent = (event: string, properties?: Record<string, unknown>): void => {
    if (state.featureFlags.analytics) {
      analyticsService.track(event, {
        ...properties,
        currentRoute: state.currentRoute,
        isAuthenticated,
        timestamp: Date.now(),
      });
    }
  };

  const reportError = (error: unknown, context?: Record<string, unknown>): void => {
    const errorObj = error instanceof Error ? error : new Error(typeof error === 'string' ? error : 'Unknown error');
    errorService.reportError(errorObj, {
      error,
      context,
      currentRoute: state.currentRoute,
      isAuthenticated,
      timestamp: Date.now(),
    });
  };

  const contextValue: AppStateContextType = {
    state,
    dispatch,
    isAuthenticated,
    theme,
    thoughtmarks,
    bins,
    trackEvent,
    reportError,
  };

  return (
    <AppStateContext.Provider value={contextValue}>
      {children}
    </AppStateContext.Provider>
  );
}; 