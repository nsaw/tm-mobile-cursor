import * as React from 'react';
import { Component, ErrorInfo, ReactNode } from 'react';
import { View, Text, StyleSheet } from 'react-native';

declare const console: any;

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

export default class NavigationErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[NavigationErrorBoundary] Caught error:', error);
    console.error('[NavigationErrorBoundary] Error info:', errorInfo);
    
    this.setState({
      hasError: true,
      error,
      errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <View style={styles.container}>
          <Text style={styles.title}>Navigation Error</Text>
          <Text style={styles.error}>{this.state.error?.message || 'Unknown error'}</Text>
          <Text style={styles.stack}>{this.state.error?.stack}</Text>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#ffe6e6',
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'red',
    marginBottom: 10
  },
  error: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
    marginBottom: 10
  },
  stack: {
    fontSize: 10,
    color: '#666',
    fontFamily: 'monospace'
  }
}); 