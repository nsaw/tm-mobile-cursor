import React, { createContext, useContext, ReactNode, useEffect } from 'react';

import { LayoutContract } from '../types';


interface LayoutContextType {
  layout?: LayoutContract;
  validateLayout: (layout: LayoutContract) => boolean;
}

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

export interface LayoutProviderProps {
  children: ReactNode;
  layout?: LayoutContract;
  validateLayout?: boolean;
}

export const LayoutProvider: React.FC<LayoutProviderProps> = ({ 
  children, 
  layout,
  validateLayout = true
}) => {
  const validateLayoutContract = (layoutContract: LayoutContract): boolean => {
    if (!validateLayout) return true;

    try {
      // Validate z-index contract if present
      if (layoutContract.zIndex) {
        // Validate z-index is within allowed range
        const layer = layoutContract.layer;
        const zIndex = layoutContract.zIndex;
        
        // Basic validation - could be enhanced with more sophisticated rules
        if (zIndex < 0 || zIndex > 1000) {
          console.warn(`Z-index ${zIndex} is outside recommended range [0, 1000]`);
        }
      }

      return true;
    } catch (error) {
      console.error('Layout validation failed:', error);
      return false;
    }
  };

  useEffect(() => {
    if (layout && validateLayout) {
      validateLayoutContract(layout);
    }
  }, [layout, validateLayout]);

  const contextValue: LayoutContextType = {
    layout,
    validateLayout: validateLayoutContract
  };

  return (
    <LayoutContext.Provider value={contextValue}>
      {children}
    </LayoutContext.Provider>
  );
};

export const useLayout = () => {
  const context = useContext(LayoutContext);
  if (!context) {
    throw new Error('useLayout must be used within a LayoutProvider');
  }
  return context;
}; 