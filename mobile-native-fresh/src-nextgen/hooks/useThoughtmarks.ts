export const useThoughtmarks = () => ({ 
  thoughtmarks: [
    {
      id: 'mock-1',
      content: 'Mock thoughtmark',
      binId: 'mock-bin',
      createdAt: new Date().toISOString(),
      isDeleted: false,
      isTask: false,
      isCompleted: false,
      tags: ['mock'],
      title: 'Mock Title',
      isPinned: false
    }
  ], 
  loading: false, 
  error: null, 
  fetchThoughtmarks: () => {} 
}); 