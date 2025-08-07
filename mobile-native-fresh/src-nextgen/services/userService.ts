export interface UserProfile { 
  id: string; 
  name: string; 
  email: string; 
  avatar?: string;
  isPremium: boolean;
  preferences?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export async function fetchProfile(userId: string): Promise<UserProfile> {
  return Promise.resolve({ 
    id: userId, 
    name: 'Stub User', 
    email: 'user@example.com',
    isPremium: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });
}

// Add userService object for compatibility
export const userService = {
  initialize: async (): Promise<void> => {
    // TODO: Implement actual user service initialization
    console.log('UserService initialized');
  },
  fetchProfile,
  getCurrentUser: async () => fetchProfile('current'),
  updateProfile: async (updates: Partial<UserProfile>) => Promise.resolve({ 
    id: 'current', 
    name: 'Updated User', 
    email: 'user@example.com',
    isPremium: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...updates 
  }),
  deleteAccount: async () => Promise.resolve({ success: true }),
}; 