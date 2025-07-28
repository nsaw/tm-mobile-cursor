declare const console: any;

export function slotQuery(slotType: string) {
  console.log(`[slotQuery] Hydrating slot for type: ${slotType}`);
  switch (slotType) {
    case 'DASHBOARD_ENTRY':
      return [{ id: 'tm1', title: 'Quantum Focus' }, { id: 'tm2', title: 'Cognitive Maps' }];
    case 'TASKS_ENTRY':
      return [{ id: 't1', title: 'Audit Ghost logs' }, { id: 't2', title: 'Write slot tests' }];
    case 'AI_TOOLS_ENTRY':
      return [{ id: 'ai1', name: 'Claude' }, { id: 'ai2', name: 'GPT SlotLens' }];
    default:
      return [];
  }
} 