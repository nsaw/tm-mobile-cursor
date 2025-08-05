import React, { useEffect, useRef } from 'react';
import { View, ViewStyle, Text } from 'react-native';
import { NavigationDefinitionsProps } from './types';
import { validateNavigationDefinitions, registerNavigationRoute } from './utils';

/**
 * NavigationDefinitions Component
 * 
 * A component that defines navigation routes and provides
 * route management for the hybrid renderer shell.
 */
export const NavigationDefinitions: React.FC<NavigationDefinitionsProps> = ({
  routes,
  environment,
  children,
  className: _className,
  style,
  _testID
}) => {
  const _componentRef = useRef<View>(null);
  const definitionsId = useRef(`navigation-definitions-${environment}-${Date.now()}`);

  // Validation effect
  useEffect(() => {
    const validation = validateNavigationDefinitions(routes, environment);
    if (!validation.valid) {
      console.error('Navigation definitions validation failed:', validation.errors);
    }
    if (validation.warnings.length > 0) {
      console.warn('Navigation definitions warnings:', validation.warnings);
    }
  }, [routes, environment]);

  // Registration effect
  useEffect(() => {
    routes.forEach(route => {
      registerNavigationRoute(route, environment);
    });
  }, [routes, environment]);

  // Debug logging effect
  useEffect(() => {
    if (__DEV__) {
      console.log(`🔧 NavigationDefinitions: ${definitionsId.current}`, {
        environment,
        routeCount: routes.length,
        routes: routes.map(r => r.name),
        timestamp: new Date().toISOString()
      });
    }
  }, [routes, environment]);

  // Get navigation style
  const _getNavigationStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      position: 'relative',
      flex: 1,
    };

    // Debug styling
    if (__DEV__) {
      baseStyle.borderWidth = 1;
      baseStyle.borderColor = '#8B5CF6';
      baseStyle.backgroundColor = '#F3E8FF';
    }

    return { ...baseStyle, ...style } as ViewStyle;
  };

  return (
    <View><Text>{children}</Text></View>
  );
};

export default NavigationDefinitions; 