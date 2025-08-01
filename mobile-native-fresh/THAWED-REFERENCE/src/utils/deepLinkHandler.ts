import { Linking } from 'react-native';

// Fallback route handling for unknown deep links
export const setupDeepLinkHandler = () => {
  const handleDeepLink = ({ url }: { url: string }) => {
    const route = url.replace('exp://192.168.68.127:8081', '').trim();
    if (!route) {
      console.warn('Unknown deep link route:', url);
      return;
    }
    
    // Handle known routes here if needed
    console.log('Deep link received:', url, 'Route:', route);
  };

  // Add event listener for deep links
  Linking.addEventListener('url', handleDeepLink);

  // Return cleanup function
  return () => {
    // Note: removeEventListener is not available in React Native Linking
    // The event listener will be cleaned up automatically
  };
}; 