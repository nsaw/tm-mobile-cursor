// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function signIn(_email: string, _password: string): Promise<{ token: string }> {
  // TODO: integrate real API
  return Promise.resolve({ token: 'stub-token' });
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function signUp(_name: string, _email: string, _password: string): Promise<{ userId: string }> {
  return Promise.resolve({ userId: 'stub-user' });
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function resetPassword(_email: string): Promise<void> {
  return Promise.resolve();
}

// Named export for the service
export const authService = {
  signIn,
  signUp,
  resetPassword,
}; 