import { createPortal } from "react-dom";
import { useEffect, useState } from "react";

interface FloatingPortalProps {
  children: React.ReactNode;
  className?: string;
  zIndex?: number;
}

export function FloatingPortal({ 
  children, 
  className = "fixed inset-0 pointer-events-none",
  zIndex = 1000 
}: FloatingPortalProps) {
  const [portalElement, setPortalElement] = useState<HTMLElement | null>(null);

  useEffect(() => {
    // Create or get the portal container
    let container = document.getElementById('floating-portal');
    if (!container) {
      container = document.createElement('div');
      container.id = 'floating-portal';
      container.style.position = 'fixed';
      container.style.top = '0';
      container.style.left = '0';
      container.style.width = '100%';
      container.style.height = '100%';
      container.style.pointerEvents = 'none';
      container.style.zIndex = zIndex.toString();
      document.body.appendChild(container);
    }
    setPortalElement(container);
    
    return () => {
      // Clean up if needed
      if (container && container.children.length === 0) {
        document.body.removeChild(container);
      }
    };
  }, [zIndex]);

  if (!portalElement) return null;

  return createPortal(
    <div className={className} style={{ zIndex }}>
      {children}
    </div>,
    portalElement
  );
}