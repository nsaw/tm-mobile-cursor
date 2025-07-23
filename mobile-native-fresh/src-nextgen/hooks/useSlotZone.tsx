// useSlotZone: hook to inject into layout slot zones
import React, { useEffect, useState, createContext, useContext } from 'react';

// Context for slot zone state
interface SlotZoneContextType {
  topSlotContent: React.ReactNode | null;
  bottomSlotContent: React.ReactNode | null;
  setTopSlotContent: (content: React.ReactNode | null) => void;
  setBottomSlotContent: (content: React.ReactNode | null) => void;
}

const SlotZoneContext = createContext<SlotZoneContextType | null>(null);

// Provider component
export const SlotZoneProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [topSlotContent, setTopSlotContent] = useState<React.ReactNode | null>(null);
  const [bottomSlotContent, setBottomSlotContent] = useState<React.ReactNode | null>(null);

  return (
    <SlotZoneContext.Provider 
      value={{
        topSlotContent,
        bottomSlotContent,
        setTopSlotContent,
        setBottomSlotContent
      }}
    >
      {children}
    </SlotZoneContext.Provider>
  );
};

// Hook to use slot zone
const useSlotZone = (zone: 'top' | 'bottom', content: React.ReactNode) => {
  const context = useContext(SlotZoneContext);

  useEffect(() => {
    if (context) {
      if (zone === 'top') {
        context.setTopSlotContent(content);
      } else if (zone === 'bottom') {
        context.setBottomSlotContent(content);
      }
      // eslint-disable-next-line no-console
      console.log(`[SlotBridge] Injecting into ${zone} zone`);
    }
  }, [zone, content, context]);
};

// Hook to get slot content
export const useTopSlotContent = () => {
  const context = useContext(SlotZoneContext);
  return context?.topSlotContent || null;
};

export const useBottomSlotContent = () => {
  const context = useContext(SlotZoneContext);
  return context?.bottomSlotContent || null;
};

export default useSlotZone; 