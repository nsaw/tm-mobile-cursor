import React, { createContext, useContext, ReactNode, useState } from 'react';

interface AIResponse {
  id: string;
  query: string;
  response: string;
  createdAt: Date;
  type: 'text' | 'voice' | 'image';
}

interface AIContextType {
  responses: AIResponse[];
  isLoading: boolean;
  generateResponse: (query: string, type: 'text' | 'voice' | 'image') => Promise<void>;
  clearResponses: () => void;
  getResponse: (id: string) => AIResponse | undefined;
}

const AIContext = createContext<AIContextType | undefined>(undefined);

export const useAI = (): AIContextType => {
  const context = useContext(AIContext);
  if (!context) {
    throw new Error('useAI must be used within an AIProvider');
  }
  return context;
};

interface AIProviderProps {
  children: ReactNode;
}

export const AIProvider: React.FC<AIProviderProps> = ({ children }) => {
  const [responses, setResponses] = useState<AIResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const generateResponse = async (query: string, type: 'text' | 'voice' | 'image') => {
    try {
      setIsLoading(true);
      
      // TODO: Implement actual AI integration
      console.log(`Generating ${type} response for: ${query}`);
      
      // Mock response for now
      await new Promise<void>(resolve => setTimeout(() => resolve(), 1000));
      
      const newResponse: AIResponse = {
        id: Date.now().toString(),
        query,
        response: `AI response to: "${query}" (${type})`,
        createdAt: new Date(),
        type,
      };
      
      setResponses(prev => [...prev, newResponse]);
    } catch (error) {
      console.error('Failed to generate AI response:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const clearResponses = () => {
    setResponses([]);
  };

  const getResponse = (id: string) => {
    return responses.find(response => response.id === id);
  };

  const value: AIContextType = {
    responses,
    isLoading,
    generateResponse,
    clearResponses,
    getResponse,
  };

  return (
    <AIContext.Provider value={value}>
      {children}
    </AIContext.Provider>
  );
};
