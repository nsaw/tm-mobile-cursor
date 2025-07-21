export const validateComponent = (component: any): boolean => {
  return component && typeof component === 'object';
};

export const validateProps = (props: any): boolean => {
  return props && typeof props === 'object';
};

export const validateRole = (role: string): boolean => {
  const validRoles = ['container', 'button', 'text', 'image', 'input'];
  return validRoles.includes(role);
}; 