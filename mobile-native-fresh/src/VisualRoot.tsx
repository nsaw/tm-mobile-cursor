import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
declare const console: any;

export const VisualRoot = () => {
  console.log('[VISUAL] VisualRoot component called');
  
  useEffect(() => {
    console.log('[VISUAL] Root rendered successfully');
  }, []);

  return (
    <View style={{ 
      position: 'absolute', 
      top: 0, 
      left: 0, 
      right: 0, 
      height: 100, 
      backgroundColor: '#181818',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 9999
    }}>
      <Text style={{ color: '#E0E0E0', fontSize: 16 }}>[VISUAL] App UI mounted with theme</Text>
    </View>
  );
}; 