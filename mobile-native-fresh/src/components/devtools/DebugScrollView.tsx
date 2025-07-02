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
    const layoutProps = ['alignItems', 'justifyContent', 'alignContent', 'alignSelf'];
    
    // Deep check for layout props in style
    const checkForLayoutProps = (styleObj: any): string[] => {
      if (!styleObj) return [];
      if (Array.isArray(styleObj)) {
        return styleObj.flatMap(checkForLayoutProps);
      }
      if (typeof styleObj === 'object') {
        const found = Object.keys(styleObj).filter(key => layoutProps.includes(key));
        return found;
      }
      return [];
    };

    const foundLayoutProps = checkForLayoutProps(style);
    
    if (foundLayoutProps.length > 0) {
      console.warn(`🚨 SCROLLVIEW LAYOUT VIOLATION DETECTED [${debugId}]:`, {
        debugId,
        foundLayoutProps,
        originalStyle: style,
        originalContentContainerStyle: contentContainerStyle,
        stack: new Error().stack,
        message: `Layout props ${foundLayoutProps.join(', ')} found in style prop. Move to contentContainerStyle.`
      });
    } else {
      console.log(`✅ ScrollView [${debugId}] Layout props correctly in contentContainerStyle:`, {
        hasStyle: !!style,
        hasContentContainerStyle: !!contentContainerStyle,
        styleKeys: style ? Object.keys(style) : [],
        contentContainerStyleKeys: contentContainerStyle ? Object.keys(contentContainerStyle) : [],
      });
    }
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