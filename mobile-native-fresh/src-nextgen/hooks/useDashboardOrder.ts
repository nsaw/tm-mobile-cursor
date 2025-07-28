export const useDashboardOrder = () => ({ 
  sections: [
    {
      id: 'recent-thoughtmarks',
      title: 'Recent Thoughtmarks'
    },
    {
      id: 'tasks',
      title: 'Tasks'
    },
    {
      id: 'bins',
      title: 'Bins'
    }
  ], 
  isLoading: false, 
  reorderSections: () => Promise.resolve() 
}); 