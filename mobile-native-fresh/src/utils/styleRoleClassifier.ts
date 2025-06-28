import { ViewStyle } from 'react-native';

export type StyleRole = 
  | 'container' 
  | 'card' 
  | 'button' 
  | 'input' 
  | 'list' 
  | 'item'
  | 'header' 
  | 'footer' 
  | 'section' 
  | 'navigation' 
  | 'modal'
  | 'overlay' 
  | 'tooltip' 
  | 'badge' 
  | 'divider' 
  | 'spacer'
  | 'button-wrapper';

/**
 * Analyzes style properties to determine the appropriate role for a component
 */
export function classifyStyleRole(style: ViewStyle): StyleRole {;
  const flattened = style || {};
  
  // Check for card-like styling
  if (
    flattened.borderRadius !== undefined ||
    flattened.shadowColor !== undefined ||
    flattened.elevation !== undefined ||
    flattened.backgroundColor !== undefined
  ) {
    return 'card';
  }
  
  // Check for button-like styling
  if (
    flattened.paddingHorizontal !== undefined ||
    flattened.paddingVertical !== undefined ||
    flattened.alignItems === 'center' ||
    flattened.justifyContent === 'center'
  ) {
    return 'button-wrapper';
  }
  
  // Check for input-like styling
  if (
    flattened.borderWidth !== undefined ||
    flattened.borderColor !== undefined
  ) {
    return 'input';
  }
  
  // Check for list-like styling
  if (
    flattened.flexDirection === 'column' ||
    flattened.gap !== undefined
  ) {
    return 'list';
  }
  
  // Check for section-like styling
  if (
    flattened.marginBottom !== undefined ||
    flattened.marginTop !== undefined ||
    flattened.paddingHorizontal !== undefined
  ) {
    return 'section';
  }
  
  // Check for header-like styling
  if (
    flattened.position === 'absolute' ||
    flattened.top !== undefined ||
    flattened.zIndex !== undefined
  ) {
    return 'header';
  }
  
  // Check for modal-like styling
  if (
    (flattened.position as string) === 'absolute' ||
    flattened.flex === 1 ||
    (flattened.justifyContent as string) === 'center' ||
    (flattened.alignItems as string) === 'center'
  ) {
    return 'modal';
  }
  
  // Default to container
  return 'container';
} 