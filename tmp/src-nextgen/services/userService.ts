export interface UserProfile { id: string; name: string; email: string; }

export async function fetchProfile(userId: string): Promise<UserProfile> {
  return Promise.resolve({ id: userId, name: 'Stub User', email: 'user@example.com' });
} 