import { useEffect } from 'react';
import { useLocation } from 'wouter';

interface RedirectProps {
  to: string;
  permanent?: boolean;
}

export function Redirect({ to, permanent = false }: RedirectProps) {
  const [, setLocation] = useLocation();

  useEffect(() => {
    // Add a small delay to prevent flash of content
    const timer = setTimeout(() => {
      setLocation(to);
    }, 0);

    return () => clearTimeout(timer);
  }, [to, setLocation]);

  // Return null to render nothing during redirect
  return null;
}

// Specific redirect components for legacy routes
export function PrivacyRedirect() {
  return <Redirect to="/settings/legal/privacy" permanent={true} />;
}

export function TermsRedirect() {
  return <Redirect to="/settings/legal/terms" permanent={true} />;
}