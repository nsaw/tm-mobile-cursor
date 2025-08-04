import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { AutoRoleView } from '../../shell/wrappers/AutoRoleView';

export interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  testID?: string;
}

/**
 * Card - Container component with role assignment
 * 
 * This component provides proper accessibility and role-based styling.
 * 
 * Usage:
 * <Card>
 *   <Text>Card content</Text>
 * </Card>
 */
export const Card: React.FC<CardProps> = ({
  children,
  style,
  testID,
}) => {
  return (
    <AutoRoleView layoutRole="container-card">
      <View style={[styles.card, style]} testID={testID}>
        {children}
      </View>
    </AutoRoleView>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    margin: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
}); 