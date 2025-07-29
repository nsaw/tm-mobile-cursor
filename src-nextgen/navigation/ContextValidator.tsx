import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';

declare const console: any;

interface ContextValidationState {
  routeName: string | null;
  routeParams: any;
  navigationState: string;
  contextDepth: number;
  mountTime: number;
  transitions: string[];
  errors: string[];
}

export function useNavigationContextValidation() {
  const route = useRoute<RouteProp<Record<string, object | undefined>, string>>();
  const navigation = useNavigation();
  const [validationState, setValidationState] = useState<ContextValidationState>({
    routeName: null,
    routeParams: null,
    navigationState: 'unknown',
    contextDepth: 0,
    mountTime: Date.now(),
    transitions: [],
    errors: []
  });

  useEffect(() => {
    try {
      const newState = {
        routeName: route?.name || null,
        routeParams: route?.params || null,
        navigationState: navigation?.isFocused() ? 'focused' : 'unfocused',
        contextDepth: navigation?.getState()?.routes?.length || 0,
        mountTime: validationState.mountTime,
        transitions: [...validationState.transitions, `${route?.name || 'unknown'}-${Date.now()}`],
        errors: validationState.errors
      };

      setValidationState(newState);
      
      console.log('[ContextValidator] Navigation context validated:', {
        route: newState.routeName,
        params: newState.routeParams,
        state: newState.navigationState,
        depth: newState.contextDepth,
        transitions: newState.transitions.length
      });
    } catch (error) {
      const errorMsg = `Context validation error: ${error}`;
      setValidationState(prev => ({
        ...prev,
        errors: [...prev.errors, errorMsg]
      }));
      console.error('[ContextValidator] Error:', errorMsg);
    }
  }, [route?.name, route?.params, navigation?.isFocused()]);

  return validationState;
}

export default function ContextValidator() {
  const validation = useNavigationContextValidation();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Navigation Context Validation</Text>
      <Text style={styles.info}>Route: {validation.routeName || 'undefined'}</Text>
      <Text style={styles.info}>State: {validation.navigationState}</Text>
      <Text style={styles.info}>Depth: {validation.contextDepth}</Text>
      <Text style={styles.info}>Transitions: {validation.transitions.length}</Text>
      {validation.errors.length > 0 && (
        <Text style={styles.error}>Errors: {validation.errors.length}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: '#f0f0f0',
    margin: 5,
    borderRadius: 5
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5
  },
  info: {
    fontSize: 12,
    marginBottom: 2
  },
  error: {
    fontSize: 12,
    color: 'red',
    marginTop: 5
  }
}); 