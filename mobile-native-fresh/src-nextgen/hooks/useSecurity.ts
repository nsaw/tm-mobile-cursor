import { useState, useCallback, useEffect } from 'react';

export function useSecurity() {
  const [isLockedOut, setIsLockedOut] = useState(false);
  const [lockoutEndTime, setLockoutEndTime] = useState<number | null>(null);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [maxAttempts] = useState(3);
  const [lockoutDuration] = useState(15 * 60 * 1000); // 15 minutes

  useEffect(() => {
    if (lockoutEndTime) {
      const timer = setInterval(() => {
        if (Date.now() >= lockoutEndTime) {
          setIsLockedOut(false);
          setLockoutEndTime(null);
          setFailedAttempts(0);
        }
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [lockoutEndTime]);

  const recordFailedAttempt = useCallback(() => {
    const newAttempts = failedAttempts + 1;
    setFailedAttempts(newAttempts);

    if (newAttempts >= maxAttempts) {
      setIsLockedOut(true);
      setLockoutEndTime(Date.now() + lockoutDuration);
    }
  }, [failedAttempts, maxAttempts, lockoutDuration]);

  const resetFailedAttempts = useCallback(() => {
    setFailedAttempts(0);
    setIsLockedOut(false);
    setLockoutEndTime(null);
  }, []);

  return {
    isLockedOut,
    lockoutEndTime,
    failedAttempts,
    maxAttempts,
    lockoutDuration,
    recordFailedAttempt,
    resetFailedAttempts,
  };
} 
