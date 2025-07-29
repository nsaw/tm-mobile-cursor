declare const console: any;

export function useThoughtmarks() {
  console.log('useThoughtmarks called');
  return [{ id: 'tm1', title: 'Neural Link' }, { id: 'tm2', title: 'Slot Theory' }];
} 