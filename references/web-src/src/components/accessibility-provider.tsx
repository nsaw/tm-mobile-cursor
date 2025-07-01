import { createContext, useContext, useEffect, useState } from "react";

interface AccessibilityContextType {
  announceMessage: (message: string) => void;
  isHighContrast: boolean;
  isReducedMotion: boolean;
  fontSize: 'small' | 'medium' | 'large';
  setFontSize: (size: 'small' | 'medium' | 'large') => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export function AccessibilityProvider({ children }: { children: React.ReactNode }) {
  const [announcements, setAnnouncements] = useState<string[]>([]);
  const [isHighContrast, setIsHighContrast] = useState(false);
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const [fontSize, setFontSize] = useState<'small' | 'medium' | 'large'>('medium');

  // Detect user preferences
  useEffect(() => {
    const highContrastQuery = window.matchMedia('(prefers-contrast: high)');
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    setIsHighContrast(highContrastQuery.matches);
    setIsReducedMotion(reducedMotionQuery.matches);

    const handleHighContrastChange = (e: MediaQueryListEvent) => setIsHighContrast(e.matches);
    const handleReducedMotionChange = (e: MediaQueryListEvent) => setIsReducedMotion(e.matches);

    highContrastQuery.addEventListener('change', handleHighContrastChange);
    reducedMotionQuery.addEventListener('change', handleReducedMotionChange);

    return () => {
      highContrastQuery.removeEventListener('change', handleHighContrastChange);
      reducedMotionQuery.removeEventListener('change', handleReducedMotionChange);
    };
  }, []);

  // Screen reader announcements
  const announceMessage = (message: string) => {
    setAnnouncements(prev => [...prev, message]);
    setTimeout(() => {
      setAnnouncements(prev => prev.slice(1));
    }, 1000);
  };

  // Apply accessibility classes to document
  useEffect(() => {
    document.documentElement.classList.toggle('high-contrast', isHighContrast);
    document.documentElement.classList.toggle('reduced-motion', isReducedMotion);
    document.documentElement.classList.toggle('font-small', fontSize === 'small');
    document.documentElement.classList.toggle('font-large', fontSize === 'large');
  }, [isHighContrast, isReducedMotion, fontSize]);

  return (
    <AccessibilityContext.Provider value={{
      announceMessage,
      isHighContrast,
      isReducedMotion,
      fontSize,
      setFontSize
    }}>
      {children}
      
      {/* Screen reader announcements */}
      <div
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
        id="accessibility-announcements"
      >
        {announcements.map((message, index) => (
          <div key={index}>{message}</div>
        ))}
      </div>
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within AccessibilityProvider');
  }
  return context;
}