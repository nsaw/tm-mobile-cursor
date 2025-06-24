import type { ThoughtmarkWithBin, BinWithCount } from "@shared/schema";

export interface ExportData {
  thoughtmarks: ThoughtmarkWithBin[];
  bins: BinWithCount[];
  exportDate: string;
  version: string;
}

export function exportToJSON(thoughtmarks: ThoughtmarkWithBin[], bins: BinWithCount[]): void {
  const exportData: ExportData = {
    thoughtmarks,
    bins,
    exportDate: new Date().toISOString(),
    version: "1.0"
  };

  const dataStr = JSON.stringify(exportData, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  
  const link = document.createElement('a');
  link.href = URL.createObjectURL(dataBlob);
  link.download = `thoughtmarks-export-${new Date().toISOString().split('T')[0]}.json`;
  link.click();
  
  URL.revokeObjectURL(link.href);
}

export function exportToCSV(thoughtmarks: ThoughtmarkWithBin[]): void {
  const headers = ['Title', 'Content', 'Tags', 'Bin', 'Created Date', 'Updated Date'];
  
  const csvContent = [
    headers.join(','),
    ...thoughtmarks.map(tm => [
      `"${tm.title.replace(/"/g, '""')}"`,
      `"${tm.content.replace(/"/g, '""')}"`,
      `"${(tm.tags || []).join('; ')}"`,
      `"${tm.binName || 'Uncategorized'}"`,
      `"${new Date(tm.createdAt).toLocaleDateString()}"`,
      `"${new Date(tm.updatedAt).toLocaleDateString()}"`
    ].join(','))
  ].join('\n');

  const dataBlob = new Blob([csvContent], { type: 'text/csv' });
  
  const link = document.createElement('a');
  link.href = URL.createObjectURL(dataBlob);
  link.download = `thoughtmarks-export-${new Date().toISOString().split('T')[0]}.csv`;
  link.click();
  
  URL.revokeObjectURL(link.href);
}

export function exportToMarkdown(thoughtmarks: ThoughtmarkWithBin[], bins: BinWithCount[]): void {
  let markdown = `# Thoughtmarks Export\n\n`;
  markdown += `Export Date: ${new Date().toLocaleDateString()}\n\n`;
  
  // Group thoughtmarks by bin
  const thoughtmarksByBin = thoughtmarks.reduce((acc, tm) => {
    const binName = tm.binName || 'Uncategorized';
    if (!acc[binName]) acc[binName] = [];
    acc[binName].push(tm);
    return acc;
  }, {} as Record<string, ThoughtmarkWithBin[]>);

  // Export by bin
  for (const [binName, binsThoughtmarks] of Object.entries(thoughtmarksByBin)) {
    markdown += `## ${binName}\n\n`;
    
    binsThoughtmarks
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .forEach(tm => {
        markdown += `### ${tm.title}\n\n`;
        markdown += `${tm.content}\n\n`;
        
        if (tm.tags && tm.tags.length > 0) {
          markdown += `**Tags:** ${tm.tags.join(', ')}\n\n`;
        }
        
        markdown += `*Created: ${new Date(tm.createdAt).toLocaleDateString()}*\n\n`;
        markdown += `---\n\n`;
      });
  }

  const dataBlob = new Blob([markdown], { type: 'text/markdown' });
  
  const link = document.createElement('a');
  link.href = URL.createObjectURL(dataBlob);
  link.download = `thoughtmarks-export-${new Date().toISOString().split('T')[0]}.md`;
  link.click();
  
  URL.revokeObjectURL(link.href);
}

export function importFromJSON(file: File): Promise<ExportData> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        
        // Validate import data structure
        if (!data.thoughtmarks || !data.bins) {
          throw new Error('Invalid export file format');
        }
        
        resolve(data as ExportData);
      } catch (error) {
        reject(new Error('Failed to parse export file'));
      }
    };
    
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
}