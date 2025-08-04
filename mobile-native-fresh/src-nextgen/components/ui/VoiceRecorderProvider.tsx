import React, { createContext, useContext, useState, useCallback } from 'react';

export interface VoiceRecorderState {
  isRecording: boolean;
  isPaused: boolean;
  duration: number;
  audioUri?: string;
}

export interface VoiceRecorderContextType {
  state: VoiceRecorderState;
  startRecording: () => Promise<void>;
  stopRecording: () => Promise<void>;
  pauseRecording: () => void;
  resumeRecording: () => void;
  clearRecording: () => void;
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

export interface VoiceRecorderProviderProps {
  children: React.ReactNode;
}

export const VoiceRecorderProvider: React.FC<VoiceRecorderProviderProps> = ({ children }) => {
  const [state, setState] = useState<VoiceRecorderState>({
    isRecording: false,
    isPaused: false,
    duration: 0,
  });

  const startRecording = useCallback(async () => {
    try {
      // Mock recording start for now
      setState(prev => ({
        ...prev,
        isRecording: true,
        isPaused: false,
        duration: 0,
      }));
      console.log('Voice recording started');
    } catch (error) {
      console.error('Failed to start recording:', error);
    }
  }, []);

  const stopRecording = useCallback(async () => {
    try {
      // Mock recording stop for now
      setState(prev => ({
        ...prev,
        isRecording: false,
        isPaused: false,
        audioUri: 'mock-audio-uri',
      }));
      console.log('Voice recording stopped');
    } catch (error) {
      console.error('Failed to stop recording:', error);
    }
  }, []);

  const pauseRecording = useCallback(() => {
    setState(prev => ({
      ...prev,
      isPaused: true,
    }));
    console.log('Voice recording paused');
  }, []);

  const resumeRecording = useCallback(() => {
    setState(prev => ({
      ...prev,
      isPaused: false,
    }));
    console.log('Voice recording resumed');
  }, []);

  const clearRecording = useCallback(() => {
    setState({
      isRecording: false,
      isPaused: false,
      duration: 0,
    });
    console.log('Voice recording cleared');
  }, []);

  const showVoiceRecorder = useCallback(() => {
    console.log('Show voice recorder');
  }, []);

  const hideVoiceRecorder = useCallback(() => {
    console.log('Hide voice recorder');
  }, []);

  const value: VoiceRecorderContextType = {
    state,
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
    clearRecording,
    showVoiceRecorder,
    hideVoiceRecorder,
  };

  return (
    <VoiceRecorderContext.Provider value={value}>
      {children}
    </VoiceRecorderContext.Provider>
  );
}; 