import React, { createContext, useContext, useState, ReactNode } from 'react';

interface DualMountContextType {
  isNextGen: boolean;
  toggleMount: () => void;
  setMount: (isNextGen: boolean) => void;
}

const DualMountContext = createContext<DualMountContextType | undefined>(undefined);

export const useDualMount = (): DualMountContextType => {
  const context = useContext(DualMountContext);
  if (!context) {
    throw new Error('useDualMount must be used within a DualMountProvider');
  }
  return context;
};

export interface DualMountProviderProps {
  children: ReactNode;
  initialMount?: 'nextgen' | 'legacy';
}

export const DualMountProvider: React.FC<DualMountProviderProps> = ({ 
  children, 
  initialMount = 'nextgen' 
}): React.JSX.Element => {
  const [isNextGen, setIsNextGen] = useState(initialMount === 'nextgen');

  const toggleMount = () => {
    setIsNextGen(!isNextGen);
    console.log(`🔄 Dual Mount Toggle: Switching to ${!isNextGen ? 'NextGen' : 'Legacy'}`);
  };

  const setMount = (nextGen: boolean) => {
    setIsNextGen(nextGen);
    console.log(`🔄 Dual Mount Set: Switching to ${nextGen ? 'NextGen' : 'Legacy'}`);
  };

  return (
    <DualMountContext.Provider value={{ isNextGen, toggleMount, setMount }}>
      {children}
    </DualMountContext.Provider>
  );
}; 