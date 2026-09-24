/* One Markdown content source for every homepage style. */
(function (root) {
  'use strict';
  const CONTENT = '/content/';

  function parseDocument(source) {
    const normalized = source.replace(/^\uFEFF/, '').replace(/\r\n?/g, '\n');
    const match = normalized.match(/^---\n([\s\S]*?)\n---(?:\n|$)/);
    if (!match) throw new Error('Markdown 文件缺少顶部的 --- 元数据区块');
    const meta = root.jsyaml.load(match[1], { schema: root.jsyaml.JSON_SCHEMA });
    if (!meta || typeof meta !== 'object' || Array.isArray(meta)) throw new Error('元数据必须是键值对');
    if (typeof meta.title !== 'string' || !meta.title.trim()) throw new Error('缺少 title 标题');
    return { meta, markdown: normalized.slice(match[0].length).trim() };
  }

  async function readText(url) {
    const response = await fetch(url, { cache: 'no-cache' });
    if (!response.ok) throw new Error(`${url}: HTTP ${response.status}`);
    // Cloudflare's SPA fallback may return index.html with a 200 for a missing file.
    if ((response.headers.get('content-type') || '').includes('text/html')) {
      throw new Error(`${url}: 内容文件不存在`);
    }
    return response.text();
  }

  function validDate(value) {
    if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
    const date = new Date(value + 'T00:00:00Z');
    return !Number.isNaN(date.valueOf()) && date.toISOString().slice(0, 10) === value;
  }

  async function loadNotes() {
    const files = JSON.parse(await readText(CONTENT + 'notes/index.json'));
    if (!Array.isArray(files) || files.some(file => typeof file !== 'string' || !/^[a-z0-9][a-z0-9-]*\.md$/.test(file))) {
      throw new Error('笔记索引必须是 Markdown 文件名数组');
    }
    if (new Set(files).size !== files.length) throw new Error('笔记索引包含重复文件');
    const notes = await Promise.all(files.map(file => loadNote(file.slice(0, -3))));
    return notes.sort((a, b) => b.date.localeCompare(a.date));
  }

  async function loadNote(slug) {
    if (typeof slug !== 'string' || !/^[a-z0-9][a-z0-9-]*$/.test(slug)) throw new Error('无效的笔记标识');
    const file = slug + '.md';
    const url = CONTENT + 'notes/' + file;
    const { meta, markdown } = parseDocument(await readText(url));
    for (const field of ['category', 'summary']) {
      if (typeof meta[field] !== 'string' || !meta[field].trim()) throw new Error(`${file}: 缺少 ${field}`);
    }
    if (!validDate(meta.date)) throw new Error(`${file}: date 应为 YYYY-MM-DD`);
    if (meta.readTime !== undefined && typeof meta.readTime !== 'string') throw new Error(`${file}: readTime 应为字符串`);
    if (meta.demo !== undefined && typeof meta.demo !== 'boolean') throw new Error(`${file}: demo 应为 true 或 false`);
    return {
      title: meta.title, category: meta.category, summary: meta.summary,
      date: meta.date, time: meta.readTime || `${Math.max(1, Math.ceil(markdown.length / 400))} min`,
      demo: meta.demo === true, markdown, url, slug, path: `/notes/${slug}/`
    };
  }

  async function loadResume() {
    const url = CONTENT + 'resume.md';
    return { ...parseDocument(await readText(url)), url };
  }

  function renderMarkdown(markdown) {
    return root.DOMPurify.sanitize(root.marked.parse(markdown, { gfm: true }), {
      USE_PROFILES: { html: true },
      // Keep layout and the dialog's own IDs under the page's control.
      FORBID_TAGS: ['style', 'form', 'input', 'button'],
      FORBID_ATTR: ['id', 'name', 'style']
    });
  }

  root.SiteContent = { parseDocument, loadNotes, loadNote, loadResume, renderMarkdown };
})(globalThis);
