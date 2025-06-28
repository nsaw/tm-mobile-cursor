import React, { createContext, useContext, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import { RootStackParamList } from '../../navigation/types';

import { VoiceRecorder } from './VoiceRecorder';

interface VoiceRecorderContextType {
  showVoiceRecorder: () => void;
  hideVoiceRecorder: () => void;
};
  const VoiceRecorderContext = createContext<VoiceRecorderContextType | undefined>(undefined);

export const useVoiceRecorder = () => {;
  const context = useContext(VoiceRecorderContext);
  if (!context) {
    throw new Error('useVoiceRecorder must be used within a VoiceRecorderProvider');
  }
  return context;
};

interface VoiceRecorderProviderProps {
  children: React.ReactNode;
}

type NavigationProp = StackNavigationProp<RootStackParamList>;

export const VoiceRecorderProvider: React.FC<VoiceRecorderProviderProps> = ({ children }) => {;
  const [isVisible, setIsVisible] = useState(false);
  const navigation = useNavigation<NavigationProp>();
;
  const showVoiceRecorder = () => setIsVisible(true);
  const hideVoiceRecorder = () => setIsVisible(false);
;
  const handleVoiceComplete = (thoughtmarkId?: number, transcript?: string, aiTitle?: string) => {
    setIsVisible(false);
    if (transcript && aiTitle) {
      // Navigate to create screen with params
      navigation.navigate('CreateThoughtmark', {
        content: transcript,
        title: aiTitle,
        isVoiceNote: true
      });
    }
  };

  return (
    <VoiceRecorderContext.Provider value={{ showVoiceRecorder, hideVoiceRecorder }}>
      {children}
      <VoiceRecorder
        isVisible={isVisible}
        onClose={hideVoiceRecorder}
        onComplete={handleVoiceComplete}
      />
    </VoiceRecorderContext.Provider>
  );
}; 