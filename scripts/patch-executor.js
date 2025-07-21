// Rewritten patch executor summary route logic
const path = require('path');
const fs = require('fs');
const summaryDir = path.resolve('/Users/sawyer/gitSync/.cursor-cache/summaries/MAIN');
if (!fs.existsSync(summaryDir)) fs.mkdirSync(summaryDir, { recursive: true });

function writeSummary(patchId, content) {
  const filePath = path.join(summaryDir, `summary-${patchId}.md`);
  fs.writeFileSync(filePath, content);
}

module.exports = { writeSummary }; 