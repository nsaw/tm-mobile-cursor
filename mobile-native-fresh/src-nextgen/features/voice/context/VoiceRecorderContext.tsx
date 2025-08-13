import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { RecordingState, VoiceRecording, VoiceRecorderConfig } from '../types/voice-recorder';

interface VoiceRecorderContextType {
  state: RecordingState;
  recordings: VoiceRecording[];
  config: VoiceRecorderConfig;
  startRecording: () => Promise<void>;
  stopRecording: () => Promise<VoiceRecording | null>;
  pauseRecording: () => void;
  resumeRecording: () => void;
  deleteRecording: (id: string) => void;
  updateRecording: (id: string, updates: Partial<VoiceRecording>) => void;
  setConfig: (config: Partial<VoiceRecorderConfig>) => void;
}

const VoiceRecorderContext = createContext<VoiceRecorderContextType | undefined>(undefined);

type VoiceRecorderAction =
  | { type: 'START_RECORDING' }
  | { type: 'STOP_RECORDING' }
  | { type: 'PAUSE_RECORDING' }
  | { type: 'RESUME_RECORDING' }
  | { type: 'UPDATE_DURATION'; payload: number }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'ADD_RECORDING'; payload: VoiceRecording }
  | { type: 'DELETE_RECORDING'; payload: string }
  | { type: 'UPDATE_RECORDING'; payload: { id: string; updates: Partial<VoiceRecording> } }
  | { type: 'SET_CONFIG'; payload: Partial<VoiceRecorderConfig> };

const initialState: RecordingState = {
  isRecording: false,
  isPaused: false,
  duration: 0,
  currentTime: 0,
  error: null,
};

const defaultConfig: VoiceRecorderConfig = {
  sampleRate: 44100,
  channels: 1,
  bitDepth: 16,
  format: 'm4a',
  maxDuration: 300, // 5 minutes
};

function voiceRecorderReducer(
  state: { recordingState: RecordingState; recordings: VoiceRecording[]; config: VoiceRecorderConfig },
  action: VoiceRecorderAction
): { recordingState: RecordingState; recordings: VoiceRecording[]; config: VoiceRecorderConfig } {
  switch (action.type) {
    case 'START_RECORDING':
      return {
        ...state,
        recordingState: {
          ...state.recordingState,
          isRecording: true,
          isPaused: false,
          duration: 0,
          currentTime: 0,
          error: null,
        },
      };

    case 'STOP_RECORDING':
      return {
        ...state,
        recordingState: {
          ...state.recordingState,
          isRecording: false,
          isPaused: false,
        },
      };

    case 'PAUSE_RECORDING':
      return {
        ...state,
        recordingState: {
          ...state.recordingState,
          isPaused: true,
        },
      };

    case 'RESUME_RECORDING':
      return {
        ...state,
        recordingState: {
          ...state.recordingState,
          isPaused: false,
        },
      };

    case 'UPDATE_DURATION':
      return {
        ...state,
        recordingState: {
          ...state.recordingState,
          duration: action.payload,
          currentTime: action.payload,
        },
      };

    case 'SET_ERROR':
      return {
        ...state,
        recordingState: {
          ...state.recordingState,
          error: action.payload,
        },
      };

    case 'ADD_RECORDING':
      return {
        ...state,
        recordings: [...state.recordings, action.payload],
      };

    case 'DELETE_RECORDING':
      return {
        ...state,
        recordings: state.recordings.filter(recording => recording.id !== action.payload),
      };

    case 'UPDATE_RECORDING':
      return {
        ...state,
        recordings: state.recordings.map(recording =>
          recording.id === action.payload.id
            ? { ...recording, ...action.payload.updates }
            : recording
        ),
      };

    case 'SET_CONFIG':
      return {
        ...state,
        config: { ...state.config, ...action.payload },
      };

    default:
      return state;
  }
}

interface VoiceRecorderProviderProps {
  children: ReactNode;
}

export const VoiceRecorderProvider: React.FC<VoiceRecorderProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(voiceRecorderReducer, {
    recordingState: initialState,
    recordings: [],
    config: defaultConfig,
  });

  const startRecording = async (): Promise<void> => {
    try {
      console.log('Starting voice recording...');
      dispatch({ type: 'START_RECORDING' });
      // In a real implementation, this would start the actual recording
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to start recording' });
    }
  };

  const stopRecording = async (): Promise<VoiceRecording | null> => {
    try {
      console.log('Stopping voice recording...');
      dispatch({ type: 'STOP_RECORDING' });

      const recording: VoiceRecording = {
        id: `recording_${Date.now()}`,
        title: `Recording ${new Date().toLocaleTimeString()}`,
        duration: state.recordingState.duration,
        filePath: `/recordings/recording_${Date.now()}.${state.config.format}`,
        createdAt: new Date().toISOString(),
        isTranscribed: false,
        tags: [],
      };

      dispatch({ type: 'ADD_RECORDING', payload: recording });
      return recording;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to stop recording' });
      return null;
    }
  };

  const pauseRecording = (): void => {
    dispatch({ type: 'PAUSE_RECORDING' });
  };

  const resumeRecording = (): void => {
    dispatch({ type: 'RESUME_RECORDING' });
  };

  const deleteRecording = (id: string): void => {
    dispatch({ type: 'DELETE_RECORDING', payload: id });
  };

  const updateRecording = (id: string, updates: Partial<VoiceRecording>): void => {
    dispatch({ type: 'UPDATE_RECORDING', payload: { id, updates } });
  };

  const setConfig = (config: Partial<VoiceRecorderConfig>): void => {
    dispatch({ type: 'SET_CONFIG', payload: config });
  };

  const value: VoiceRecorderContextType = {
    state: state.recordingState,
    recordings: state.recordings,
    config: state.config,
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
    deleteRecording,
    updateRecording,
    setConfig,
  };

  return (
    <VoiceRecorderContext.Provider value={value}>
      {children}
    </VoiceRecorderContext.Provider>
  );
};

export const useVoiceRecorder = (): VoiceRecorderContextType => {
  const context = useContext(VoiceRecorderContext);
  if (context === undefined) {
    throw new Error('useVoiceRecorder must be used within a VoiceRecorderProvider');
  }
  return context;
};
