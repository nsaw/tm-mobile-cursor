export const useBins = () => ({ 
  bins: [
    {
      id: 'mock-bin-1',
      name: 'Mock Bin',
      thoughtmarkCount: 1
    }
  ], 
  loading: false, 
  error: null, 
  fetchBins: () => {} 
}); 