import React, { createContext, useContext, ReactNode, useState } from 'react';

interface VoiceRecording {
  id: string;
  uri: string;
  duration: number;
  createdAt: Date;
  title?: string;
}

interface VoiceContextType {
  recordings: VoiceRecording[];
  isRecording: boolean;
  currentRecording: VoiceRecording | null;
  startRecording: () => Promise<void>;
  stopRecording: () => Promise<void>;
  deleteRecording: (id: string) => void;
  getRecording: (id: string) => VoiceRecording | undefined;
}

const VoiceContext = createContext<VoiceContextType | undefined>(undefined);

export const useVoice = (): VoiceContextType => {
  const context = useContext(VoiceContext);
  if (!context) {
    throw new Error('useVoice must be used within a VoiceProvider');
  }
  return context;
};

interface VoiceProviderProps {
  children: ReactNode;
}

export const VoiceProvider: React.FC<VoiceProviderProps> = ({ children }) => {
  const [recordings, setRecordings] = useState<VoiceRecording[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [currentRecording, setCurrentRecording] = useState<VoiceRecording | null>(null);

  const startRecording = async () => {
    try {
      setIsRecording(true);
      // TODO: Implement actual recording logic with expo-av
      console.log('Starting recording...');
    } catch (error) {
      console.error('Failed to start recording:', error);
      setIsRecording(false);
    }
  };

  const stopRecording = async () => {
    try {
      setIsRecording(false);
      // TODO: Implement actual recording stop logic
      console.log('Stopping recording...');
      
      // Mock recording for now
      const newRecording: VoiceRecording = {
        id: Date.now().toString(),
        uri: 'mock://recording.mp3',
        duration: 30,
        createdAt: new Date(),
        title: `Recording ${recordings.length + 1}`,
      };
      
      setRecordings(prev => [...prev, newRecording]);
      setCurrentRecording(newRecording);
    } catch (error) {
      console.error('Failed to stop recording:', error);
    }
  };

  const deleteRecording = (id: string) => {
    setRecordings(prev => prev.filter(recording => recording.id !== id));
  };

  const getRecording = (id: string) => {
    return recordings.find(recording => recording.id === id);
  };

  const value: VoiceContextType = {
    recordings,
    isRecording,
    currentRecording,
    startRecording,
    stopRecording,
    deleteRecording,
    getRecording,
  };

  return (
    <VoiceContext.Provider value={value}>
      {children}
    </VoiceContext.Provider>
  );
};
