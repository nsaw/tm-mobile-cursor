import { promises as fs } from 'fs';
import path from 'path';

const walk = async (dir: string): Promise<string[]> => {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(entry => {
      const res = path.resolve(dir, entry.name);
      return entry.isDirectory() ? walk(res) : res.endsWith('.ts') || res.endsWith('.tsx') ? [res] : [];
    })
  );
  return files.flat();
};

const generateDocs = async () => {
  const files = await walk('./src');
  for (const file of files) {
    const content = await fs.readFile(file, 'utf-8');
    const docPrompt = `/** Add JSDoc comments to all functions below. In TypeScript format. */\n\n${content}`;
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [{ role: "user", content: docPrompt }],
        temperature: 0.2
      })
    });
    const data = await res.json();
    const output = data.choices?.[0]?.message?.content;
    if (output) {
      const outPath = file.replace('/src/', '/docs/');
      await fs.mkdir(path.dirname(outPath), { recursive: true });
      await fs.writeFile(outPath, output);
      console.log(`Documented: ${file}`);
    }
  }
};

generateDocs();