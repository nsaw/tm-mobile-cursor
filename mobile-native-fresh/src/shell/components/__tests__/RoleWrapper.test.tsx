import React from 'react';
import { render } from '@testing-library/react-native';
import { View, Text } from 'react-native';

import { RoleWrapper } from '../RoleWrapper';

describe('RoleWrapper', () => {
  it('should render with valid role', () => {
    const { getByTestId } = render(
      <RoleWrapper role="button-action" testID="test-wrapper">
        <View><Text>Test content</Text></View>
      </RoleWrapper>
    );

    const wrapper = getByTestId('test-wrapper');
    expect(wrapper).toBeTruthy();
  });

  it('should validate role assignment', () => {
    const onRoleValidation = jest.fn();
    
    render(
      <RoleWrapper 
        role="invalid-role" 
        onRoleValidation={onRoleValidation}
        testID="test-wrapper"
      >
        <View><Text>Test content</Text></View>
      </RoleWrapper>
    );

    expect(onRoleValidation).toHaveBeenCalledWith(false);
  });

  it('should accept valid roles', () => {
    const validRoles = ['button-action', 'card', 'heading', 'body'];
    
    validRoles.forEach(role => {
      const onRoleValidation = jest.fn();
      
      render(
        <RoleWrapper 
          role={role} 
          onRoleValidation={onRoleValidation}
          testID={`test-wrapper-${role}`}
        >
          <View><Text>Test content</Text></View>
        </RoleWrapper>
      );

      expect(onRoleValidation).toHaveBeenCalledWith(true);
    });
  });
}); 