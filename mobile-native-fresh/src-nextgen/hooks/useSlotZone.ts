// useSlotZone: hook to inject into layout slot zones
import { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';

const useSlotZone = (zone: 'top' | 'bottom', content: React.ReactNode) => {
  const nav = useNavigation();

  useEffect(() => {
    // Future: push content into layout context
    console.log(`[SlotBridge] Injecting into ${zone} zone`);
  }, [zone, content]);
};

export default useSlotZone; 