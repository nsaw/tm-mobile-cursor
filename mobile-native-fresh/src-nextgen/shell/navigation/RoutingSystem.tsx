import React, { useEffect, useRef } from 'react';
import { View, ViewStyle, Text } from 'react-native';
import { 
  RoutingSystemProps, 
  NavigationRoute, 
  NavigationParams 
} from './types';
import { validateRoutingSystem, updateNavigationState } from './utils';

/**
 * RoutingSystem Component
 * 
 * A component that manages routing state and provides
 * navigation functionality for the hybrid renderer shell.
 */
export const RoutingSystem: React.FC<RoutingSystemProps> = ({
  state,
  onNavigate,
  children,
  className: _className,
  style,
  _testID
}) => {
  const _componentRef = useRef<View>(null);
  const routingId = useRef(`routing-system-${state.environment}-${Date.now()}`);

  // Validation effect
  useEffect(() => {
    const validation = validateRoutingSystem(state);
    if (!validation.valid) {
      console.error('Routing system validation failed:', validation.errors);
    }
    if (validation.warnings.length > 0) {
      console.warn('Routing system warnings:', validation.warnings);
    }
  }, [state]);

  // State update effect
  useEffect(() => {
    updateNavigationState(state);
  }, [state]);

  // Debug logging effect
  useEffect(() => {
    if (__DEV__) {
      console.log(`🔧 RoutingSystem: ${routingId.current}`, {
        currentRoute: state.currentRoute,
        previousRoute: state.previousRoute,
        environment: state.environment,
        params: state.params,
        timestamp: state.timestamp
      });
    }
  }, [state]);

  // Enhanced navigation handler
  const _handleNavigate = (_route: NavigationRoute, _params?: NavigationParams) => {
    if (__DEV__) {
      console.log(`🔧 Navigation: ${state.currentRoute} -> ${_route}`, {
        params: _params,
        environment: state.environment,
        timestamp: new Date().toISOString()
      });
    }

    // Call the provided navigation handler
    onNavigate(_route, _params);
  };

  // Get routing style
  const _getRoutingStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      position: 'relative',
      flex: 1,
    };

    // Debug styling
    if (__DEV__) {
      baseStyle.borderWidth = 1;
      baseStyle.borderColor = '#06B6D4';
      baseStyle.backgroundColor = '#ECFEFF';
    }

    return { ...baseStyle, ...style } as ViewStyle;
  };

  return (
    <View><Text>{children}</Text></View>
  );
};

export default RoutingSystem; 