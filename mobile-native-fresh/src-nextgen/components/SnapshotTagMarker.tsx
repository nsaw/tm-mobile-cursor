import React from 'react';
import { View } from 'react-native';

interface SnapshotTagMarkerProps {
  tagId: string;
  componentName?: string;
  roleType?: 'layout' | 'interactive' | 'content' | 'container';
  debugMode?: boolean;
}

/**
 * SnapshotTagMarker - JSX role snapshot tagging component for audit traceability
 * 
 * This component provides consistent snapshot identifiers inside dashboard layout 
 * rendering tree for role-based component tracking and validation.
 * 
 * @param tagId - Unique identifier for the snapshot tag
 * @param componentName - Name of the component being tagged
 * @param roleType - Type of role (layout, interactive, content, container)
 * @param debugMode - Whether to show debug information
 */
export const SnapshotTagMarker: React.FC<SnapshotTagMarkerProps> = ({
  tagId,
  componentName = 'unknown',
  roleType = 'container',
  debugMode = false,
}) => {
  // In production, this component is invisible but provides snapshot hooks
  // In debug mode, it can render visual indicators for development
  if (debugMode) {
    return (
      <View
        testID={`snapshot-marker-${tagId}`}
        accessibilityLabel={`snapshot marker: ${componentName} (${roleType})`}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: 1,
          height: 1,
          opacity: 0.1,
          backgroundColor: '#ff0000',
          zIndex: 9999,
        }}
      />
    );
  }

  // Production mode - invisible marker for snapshot hooks
  return (
    <View
      testID={`snapshot-marker-${tagId}`}
      accessibilityLabel={`snapshot marker: ${componentName} (${roleType})`}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: 0,
        height: 0,
        opacity: 0,
        zIndex: -1,
      }}
    />
  );
}; 