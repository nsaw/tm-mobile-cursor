// useSlotZone: hook to inject into layout slot zones with navigation awareness
import React, { useEffect, useState, createContext, useContext } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';

// Context for slot zone state with navigation awareness
interface SlotZoneContextType {
  topSlotContent: React.ReactNode | null;
  centerSlotContent: React.ReactNode | null;
  bottomSlotContent: React.ReactNode | null;
  setTopSlotContent: (content: React.ReactNode | null) => void;
  setCenterSlotContent: (content: React.ReactNode | null) => void;
  setBottomSlotContent: (content: React.ReactNode | null) => void;
  currentRoute: string | null;
  navigationState: any;
}

const SlotZoneContext = createContext<SlotZoneContextType | null>(null);

// Provider component with navigation integration
export const SlotZoneProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [topSlotContent, setTopSlotContent] = useState<React.ReactNode | null>(null);
  const [centerSlotContent, setCenterSlotContent] = useState<React.ReactNode | null>(null);
  const [bottomSlotContent, setBottomSlotContent] = useState<React.ReactNode | null>(null);
  const [currentRoute, setCurrentRoute] = useState<string | null>(null);
  const [navigationState, setNavigationState] = useState<any>(null);

  return (
    <SlotZoneContext.Provider 
      value={{
        topSlotContent,
        centerSlotContent,
        bottomSlotContent,
        setTopSlotContent,
        setCenterSlotContent,
        setBottomSlotContent,
        currentRoute,
        navigationState
      }}
    >
      {children}
    </SlotZoneContext.Provider>
  );
};

// Hook to use slot zone with navigation awareness
const useSlotZone = (zone: 'top' | 'center' | 'bottom', content: React.ReactNode) => {
  const navigation = useNavigation();
  const route = useRoute();
  const context = useContext(SlotZoneContext);

  useEffect(() => {
    if (context) {
      if (zone === 'top') {
        context.setTopSlotContent(content);
      } else if (zone === 'center') {
        context.setCenterSlotContent(content);
      } else if (zone === 'bottom') {
        context.setBottomSlotContent(content);
      }
      
      // Update navigation context
      context.currentRoute = route.name;
      context.navigationState = navigation.getState();
      
      // eslint-disable-next-line no-console
      console.log(`[SlotBridge] Injecting into ${zone} zone on route: ${route.name}`);
    }
  }, [zone, content, context, route.name, navigation]);

  return {
    navigation,
    route,
    currentRoute: route.name,
    navigationState: navigation.getState()
  };
};

// Hook to get slot content
export const useTopSlotContent = () => {
  const context = useContext(SlotZoneContext);
  return context?.topSlotContent || null;
};

export const useCenterSlotContent = () => {
  const context = useContext(SlotZoneContext);
  return context?.centerSlotContent || null;
};

export const useBottomSlotContent = () => {
  const context = useContext(SlotZoneContext);
  return context?.bottomSlotContent || null;
};

// Hook to get navigation context
export const useSlotNavigation = () => {
  const context = useContext(SlotZoneContext);
  return {
    currentRoute: context?.currentRoute || null,
    navigationState: context?.navigationState || null
  };
};

export default useSlotZone; 