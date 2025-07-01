import React from 'react';
import { ScrollView, ScrollViewProps } from 'react-native';

const layoutProps = new Set([
  'alignItems',
  'justifyContent',
  'flexDirection',
  'gap',
  'rowGap',
  'columnGap',
  'padding',
  'paddingHorizontal',
  'paddingVertical',
  'paddingTop',
  'paddingBottom',
  'paddingLeft',
  'paddingRight',
  'margin',
  'marginTop',
  'marginBottom',
  'marginLeft',
  'marginRight'
]);

interface DebugScrollViewProps extends ScrollViewProps {
  children?: React.ReactNode;
}

const extractLayoutProps = (style: any): string[] => {
  if (!style) return [];
  
  const violations: string[] = [];
  
  // Handle array of styles
  if (Array.isArray(style)) {
    style.forEach(s => violations.push(...extractLayoutProps(s)));
    return violations;
  }
  
  // Handle object style
  if (typeof style === 'object') {
    Object.keys(style).forEach(key => {
      if (layoutProps.has(key)) {
        violations.push(key);
      }
    });
  }
  
  return violations;
};

export const DebugScrollView: React.FC<DebugScrollViewProps> = (props) => {
  const { style, contentContainerStyle, ...restProps } = props;
  
  // Check for layout violations in development mode
  if (__DEV__ && (global as any).DEBUG_LAYOUT_PROPS) {
    const styleViolations = extractLayoutProps(style);
    
    if (styleViolations.length > 0) {
      console.warn(
        '🚨 ScrollView Layout Violation Detected!',
        `\nFile: ${new Error().stack?.split('\n')[2] || 'unknown'}`,
        `\nLayout props found in 'style': [${styleViolations.join(', ')}]`,
        `\nThese should be moved to 'contentContainerStyle'`,
        `\nStyle object:`, style
      );
    }
  }
  
  return <ScrollView style={style} contentContainerStyle={contentContainerStyle} {...restProps} />;
}; 