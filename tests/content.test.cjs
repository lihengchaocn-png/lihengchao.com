const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
const vm = require('node:vm');
const yaml = require('../vendor/js-yaml.umd.min.js');

const root = path.resolve(__dirname, '..');
async function contentAPI(overrides = {}) {
  const context = vm.createContext({
    jsyaml: yaml,
    fetch: async url => {
      if (Object.hasOwn(overrides, url)) return overrides[url]();
      try {
        return new Response(await fs.readFile(path.join(root, url)), { headers: { 'content-type': url.endsWith('.json') ? 'application/json' : 'text/plain' } });
      } catch {
        return new Response('not found', { status: 404 });
      }
    }
  });
  vm.runInContext(await fs.readFile(path.join(root, 'styles/content.js'), 'utf8'), context);
  return context.SiteContent;
}

test('all migrated notes and the résumé load from Markdown, sorted newest first', async () => {
  const content = await contentAPI();
  const notes = await content.loadNotes();
  assert.equal(notes.length, 6);
  assert.equal(notes[0].title, '从零搭建一个真正属于自己的个人主页');
  assert.equal(notes[0].date, '2026-09-20');
  assert.match(notes[0].markdown, /## 先把最小的版本做出来/);
  assert.equal(notes.filter(note => note.category === '技术').length, 3);
  for (let i = 1; i < notes.length; i++) assert.ok(notes[i - 1].date >= notes[i].date);
  const resume = await content.loadResume();
  assert.equal(resume.meta.title, 'Hengchao · 个人简历');
  assert.match(resume.markdown, /## 联系方式/);
  assert.match(resume.markdown, /并非真实履历/);
});

test('front matter supports CRLF, quoted punctuation, boolean flags and multiline summaries', async () => {
  const { parseDocument } = await contentAPI();
  const result = parseDocument('\uFEFF---\r\ntitle: "A: B"\r\nsummary: >-\r\n  first\r\n  second\r\ndemo: false\r\n---\r\n\r\n## body');
  assert.equal(result.meta.title, 'A: B');
  assert.equal(result.meta.summary, 'first second');
  assert.equal(result.meta.demo, false);
  assert.equal(result.markdown, '## body');
  assert.throws(() => parseDocument('# missing metadata'), /元数据/);
  assert.throws(() => parseDocument('---\ncategory: 技术\n---\nbody'), /title/);
});

test('missing Markdown returned as an HTML fallback is rejected', async () => {
  const content = await contentAPI({ '/content/resume.md': () => new Response('<html>homepage</html>', { headers: { 'content-type': 'text/html' } }) });
  await assert.rejects(content.loadResume(), /内容文件不存在/);
});

test('unsafe and duplicate index entries are rejected', async () => {
  for (const files of [['../resume.md'], ['one.md', 'one.md']]) {
    const content = await contentAPI({ '/content/notes/index.json': () => new Response(JSON.stringify(files)) });
    await assert.rejects(content.loadNotes(), /索引/);
  }
});

test('invalid note dates fail clearly instead of sorting unpredictably', async () => {
  const content = await contentAPI({
    '/content/notes/index.json': () => new Response('["bad.md"]'),
    '/content/notes/bad.md': () => new Response('---\ntitle: Test\ncategory: 技术\nsummary: Test\ndate: "2026-02-30"\n---\nBody')
  });
  await assert.rejects(content.loadNotes(), /YYYY-MM-DD/);
});

test('a failed request can be retried after the content becomes available', async () => {
  let attempt = 0;
  const content = await contentAPI({
    '/content/resume.md': () => ++attempt === 1
      ? new Response('unavailable', { status: 503 })
      : new Response('---\ntitle: Updated resume\n---\nNew content')
  });
  await assert.rejects(content.loadResume(), /503/);
  assert.equal((await content.loadResume()).markdown, 'New content');
});
