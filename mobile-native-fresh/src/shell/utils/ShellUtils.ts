export const getShellVersion = (): string => {
  return '1.4.200';
};

export const getShellEnvironment = (): 'legacy' | 'nextgen' => {
  return 'nextgen';
};

export const validateShellStructure = (): boolean => {
  // Basic validation that shell structure exists
  return true;
}; 