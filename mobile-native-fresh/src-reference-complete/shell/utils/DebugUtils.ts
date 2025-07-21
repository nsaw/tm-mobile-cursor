export const debugShell = (message: string, data?: any): void => {
  if (__DEV__) {
    console.log(`[Shell Debug] ${message}`, data);
  }
};

export const debugComponent = (componentName: string, props?: any): void => {
  if (__DEV__) {
    console.log(`[Component Debug] ${componentName}`, props);
  }
}; 