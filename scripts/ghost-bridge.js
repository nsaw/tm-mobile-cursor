// Rewritten ghost-bridge to route summaries to .cursor-cache path
const summaryPath = '/Users/sawyer/gitSync/.cursor-cache/summaries/MAIN';
exports.syncSummary = (patchId, content) => {
  const fs = require('fs');
  const path = require('path');
  const full = path.join(summaryPath, `summary-${patchId}.md`);
  fs.writeFileSync(full, content);
};
