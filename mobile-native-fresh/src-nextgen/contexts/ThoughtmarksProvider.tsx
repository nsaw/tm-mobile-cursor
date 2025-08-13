import React, { createContext, useContext, ReactNode, useState } from 'react';

interface Thoughtmark {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

interface ThoughtmarksContextType {
  thoughtmarks: Thoughtmark[];
  addThoughtmark: (thoughtmark: Omit<Thoughtmark, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateThoughtmark: (id: string, updates: Partial<Thoughtmark>) => void;
  deleteThoughtmark: (id: string) => void;
  getThoughtmark: (id: string) => Thoughtmark | undefined;
}

const ThoughtmarksContext = createContext<ThoughtmarksContextType | undefined>(undefined);

export const useThoughtmarks = (): ThoughtmarksContextType => {
  const context = useContext(ThoughtmarksContext);
  if (!context) {
    throw new Error('useThoughtmarks must be used within a ThoughtmarksProvider');
  }
  return context;
};

interface ThoughtmarksProviderProps {
  children: ReactNode;
}

export const ThoughtmarksProvider: React.FC<ThoughtmarksProviderProps> = ({ children }) => {
  const [thoughtmarks, setThoughtmarks] = useState<Thoughtmark[]>([]);

  const addThoughtmark = (thoughtmarkData: Omit<Thoughtmark, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newThoughtmark: Thoughtmark = {
      ...thoughtmarkData,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setThoughtmarks(prev => [...prev, newThoughtmark]);
  };

  const updateThoughtmark = (id: string, updates: Partial<Thoughtmark>) => {
    setThoughtmarks(prev => 
      prev.map(thoughtmark => 
        thoughtmark.id === id 
          ? { ...thoughtmark, ...updates, updatedAt: new Date() }
          : thoughtmark
      )
    );
  };

  const deleteThoughtmark = (id: string) => {
    setThoughtmarks(prev => prev.filter(thoughtmark => thoughtmark.id !== id));
  };

  const getThoughtmark = (id: string) => {
    return thoughtmarks.find(thoughtmark => thoughtmark.id === id);
  };

  const value: ThoughtmarksContextType = {
    thoughtmarks,
    addThoughtmark,
    updateThoughtmark,
    deleteThoughtmark,
    getThoughtmark,
  };

  return (
    <ThoughtmarksContext.Provider value={value}>
      {children}
    </ThoughtmarksContext.Provider>
  );
};
