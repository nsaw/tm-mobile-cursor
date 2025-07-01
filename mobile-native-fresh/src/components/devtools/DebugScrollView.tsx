import React from 'react';
import { ScrollView, ScrollViewProps } from 'react-native';

// Global debug flag for ScrollView layout prop detection
declare global {
  // eslint-disable-next-line no-var
  var DEBUG_LAYOUT_PROPS: boolean;
}

interface DebugScrollViewProps extends ScrollViewProps {
  debugId?: string;
}

export const DebugScrollView: React.FC<DebugScrollViewProps> = ({ 
  debugId = 'unknown',
  style,
  contentContainerStyle,
  children,
  ...props 
}) => {
  // Enhanced runtime debugging for ScrollView layout violations
  if (__DEV__ && global.DEBUG_LAYOUT_PROPS) {
    console.log(`🔍 DebugScrollView [${debugId}] rendered with:`, {
      hasStyle: !!style,
      hasContentContainerStyle: !!contentContainerStyle,
      styleKeys: style ? Object.keys(style) : [],
      contentContainerStyleKeys: contentContainerStyle ? Object.keys(contentContainerStyle) : [],
    });
  }

  return (
    <ScrollView
      style={style}
      contentContainerStyle={contentContainerStyle}
      {...props}
    >
      {children}
    </ScrollView>
  );
}; 