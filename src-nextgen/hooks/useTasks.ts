declare const console: any;

export function useTasks() {
  console.log('useTasks called');
  return [{ id: 'task1', label: 'Refactor ghost bridge' }, { id: 'task2', label: 'Design slot stubs' }];
} 