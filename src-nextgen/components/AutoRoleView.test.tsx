import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { AutoRoleView } from './AutoRoleView';
import { Text } from 'react-native';

// Mock performance monitor
jest.mock('../utils/PerformanceMonitor', () => ({
  usePerformanceMonitor: () => ({
    recordComponentRender: jest.fn(() => jest.fn()),
  }),
}));

describe('AutoRoleView', () => {
  it('renders children correctly', () => {
    const { getByText } = render(
      <AutoRoleView>
        <Text>Test Content</Text>
      </AutoRoleView>
    );
    expect(getByText('Test Content')).toBeTruthy();
  });

  it('handles onPress correctly', () => {
    const onPressMock = jest.fn();
    const { getByTestId } = render(
      <AutoRoleView onPress={onPressMock} testID="test-view">
        <Text>Test Content</Text>
      </AutoRoleView>
    );
    fireEvent.press(getByTestId('test-view'));
    expect(onPressMock).toHaveBeenCalledTimes(1);
  });

  it('applies accessibility props correctly', () => {
    const { getByTestId } = render(
      <AutoRoleView
        testID="test-view"
        accessibilityRole="button"
        accessibilityLabel="Test Button"
        ariaLabel="Test Button"
        ariaPressed={true}
      >
        <Text>Test Content</Text>
      </AutoRoleView>
    );
    const view = getByTestId('test-view');
    expect(view.props.accessibilityRole).toBe('button');
    expect(view.props.accessibilityLabel).toBe('Test Button');
    expect(view.props.ariaLabel).toBe('Test Button');
    expect(view.props.ariaPressed).toBe(true);
  });

  it('validates props in strict mode', () => {
    const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
    
    render(
      <AutoRoleView strictMode={true} accessible={true}>
        <Text>Test Content</Text>
      </AutoRoleView>
    );
    
    expect(consoleSpy).toHaveBeenCalledWith(
      'AutoRoleView: accessibilityLabel is required when accessible is true'
    );
    
    consoleSpy.mockRestore();
  });

  it('handles error boundary with fallback', () => {
    const FallbackComponent = () => <Text>Error Fallback</Text>;
    
    const { getByText } = render(
      <AutoRoleView errorBoundary={true} fallback={FallbackComponent}>
        <Text>Test Content</Text>
      </AutoRoleView>
    );
    
    expect(getByText('Error Fallback')).toBeTruthy();
  });

  it('enables performance monitoring when requested', async () => {
    const { recordComponentRender } = require('../utils/PerformanceMonitor');
    const mockRecordRender = jest.fn();
    recordComponentRender.mockReturnValue(mockRecordRender);
    
    render(
      <AutoRoleView enablePerformanceMonitoring={true} componentName="TestComponent">
        <Text>Test Content</Text>
      </AutoRoleView>
    );
    
    await waitFor(() => {
      expect(recordComponentRender).toHaveBeenCalledWith('TestComponent', 'nextgen');
    });
  });

  it('handles all accessibility props', () => {
    const { getByTestId } = render(
      <AutoRoleView
        testID="test-view"
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel="Test Button"
        role="button"
        ariaLabel="Test Button"
        ariaDescribedBy="description"
        ariaHidden={false}
        ariaExpanded={true}
        ariaPressed={false}
        ariaChecked={true}
        ariaSelected={false}
        ariaDisabled={false}
        ariaRequired={true}
        ariaInvalid={false}
        ariaLive="polite"
        ariaAtomic={true}
        ariaRelevant="additions"
        ariaBusy={false}
        ariaControls="controls"
        ariaOwns="owns"
        ariaLabelledBy="labelledby"
      >
        <Text>Test Content</Text>
      </AutoRoleView>
    );
    
    const view = getByTestId('test-view');
    expect(view.props.accessible).toBe(true);
    expect(view.props.accessibilityRole).toBe('button');
    expect(view.props.role).toBe('button');
    expect(view.props.ariaExpanded).toBe(true);
    expect(view.props.ariaChecked).toBe(true);
    expect(view.props.ariaRequired).toBe(true);
    expect(view.props.ariaLive).toBe('polite');
  });
}); 