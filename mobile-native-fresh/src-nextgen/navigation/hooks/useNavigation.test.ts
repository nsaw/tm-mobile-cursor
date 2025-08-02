import { renderHook } from '@testing-library/react-native';
import { useNavigation, useRoute, useNavigationState } from './useNavigation';

// Mock @react-navigation/native
jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(),
  useRoute: jest.fn(),
}));

const mockUseNavigation = jest.mocked(require('@react-navigation/native').useNavigation);
const mockUseRoute = jest.mocked(require('@react-navigation/native').useRoute);

describe('Navigation Hooks', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('useNavigation', () => {
    it('should return navigation object', () => {
      const mockNavigation = {
        navigate: jest.fn(),
        goBack: jest.fn(),
        canGoBack: jest.fn(),
        reset: jest.fn(),
        setParams: jest.fn(),
        setOptions: jest.fn(),
      };
      
      mockUseNavigation.mockReturnValue(mockNavigation);
      
      const { result } = renderHook(() => useNavigation<'Home'>());
      
      expect(result.current).toBe(mockNavigation);
    });
  });

  describe('useRoute', () => {
    it('should return route object', () => {
      const mockRoute = {
        key: 'test-key',
        name: 'Home' as const,
        params: undefined,
      };
      
      mockUseRoute.mockReturnValue(mockRoute);
      
      const { result } = renderHook(() => useRoute<'Home'>());
      
      expect(result.current).toBe(mockRoute);
    });
  });

  describe('useNavigationState', () => {
    it('should return navigation state', () => {
      const mockNavigation = {
        canGoBack: jest.fn().mockReturnValue(true),
        getState: jest.fn().mockReturnValue({
          routeNames: ['Home', 'Dashboard'],
          routes: [
            { name: 'Home', key: 'home-key' },
            { name: 'Dashboard', key: 'dashboard-key' },
          ],
          index: 1,
        }),
      };
      
      mockUseNavigation.mockReturnValue(mockNavigation);
      
      const { result } = renderHook(() => useNavigationState());
      
      expect(result.current.canGoBack).toBe(true);
      expect(result.current.routeNames).toEqual(['Home', 'Dashboard']);
      expect(result.current.currentRoute).toEqual({
        name: 'Dashboard',
        key: 'dashboard-key',
      });
    });
  });
}); 