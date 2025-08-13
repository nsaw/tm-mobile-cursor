import React, { createContext, useContext, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import { RootStackParamList } from '../../navigation/types';
import { VoiceRecorder } from './VoiceRecorder';

interface VoiceRecorderContextType {
  showVoiceRecorder: () => void;
  hideVoiceRecorder: () => void;
}

const VoiceRecorderContext = createContext<VoiceRecorderContextType | undefined>(undefined);

export const useVoiceRecorder = (): VoiceRecorderContextType => {
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

export const VoiceRecorderProvider: React.FC<VoiceRecorderProviderProps> = ({ children }) => {
  const [isVisible, setIsVisible] = useState(false);
  const navigation = useNavigation<NavigationProp>();

  const showVoiceRecorder = () => setIsVisible(true);
  const hideVoiceRecorder = () => setIsVisible(false);

  const handleVoiceComplete = (thoughtmarkId?: string, transcript?: string, aiTitle?: string) => {
    setIsVisible(false);
    if (transcript && aiTitle) {
      navigation.navigate('CreateThoughtmark', {
        content: transcript,
        title: aiTitle,
        isVoiceNote: true,
      });
    }
  };

  return (
    <VoiceRecorderContext.Provider value={{ showVoiceRecorder, hideVoiceRecorder }}>
      {children}
      {isVisible && (
        <VoiceRecorder
          onRecordingComplete={(recording) => {
            console.log('Recording completed:', recording);
            hideVoiceRecorder();
          }}
          onTranscriptionComplete={(transcription) => {
            console.log('Transcription completed:', transcription);
            handleVoiceComplete(undefined, transcription.text, transcription.title);
          }}
        />
      )}
    </VoiceRecorderContext.Provider>
  );
}; 