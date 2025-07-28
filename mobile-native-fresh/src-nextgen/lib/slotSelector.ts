declare const console: any;

export function slotSelector(slotType: string): string {
  console.log(`[slotSelector] Selecting target for type: ${slotType}`);
  switch (slotType) {
    case 'DASHBOARD_ENTRY':
      return 'ThoughtmarkCard';
    case 'TASKS_ENTRY':
      return 'TaskCard';
    case 'AI_TOOLS_ENTRY':
      return 'AIToolsCard';
    default:
      return 'UnknownSlot';
  }
} 