import React, { createContext, useContext, ReactNode } from 'react';

interface ShellSlotContextType {
  topbarSlot?: ReactNode;
  setTopbarSlot?: (slot: ReactNode) => void;
}

const ShellSlotContext = createContext<ShellSlotContextType>({});

export const ShellSlotProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [topbarSlot, setTopbarSlot] = React.useState<ReactNode>(null);

  return (
    <ShellSlotContext.Provider value={{ topbarSlot, setTopbarSlot }}>
      {children}
    </ShellSlotContext.Provider>
  );
};

export { ShellSlotContext }; 