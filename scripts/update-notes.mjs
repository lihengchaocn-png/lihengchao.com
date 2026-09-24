import { readdir, writeFile } from 'node:fs/promises';

const directory = new URL('../content/notes/', import.meta.url);
const files = (await readdir(directory))
  .filter(file => /^[a-z0-9][a-z0-9-]*\.md$/.test(file))
  .sort().reverse();
await writeFile(new URL('index.json', directory), JSON.stringify(files, null, 2) + '\n');
console.log(`已更新笔记索引：${files.length} 篇。`);
