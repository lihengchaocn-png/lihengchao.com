const list = document.querySelector('#note-list');
const cardArts = [
  '<svg viewBox="0 0 320 150" fill="none" aria-hidden="true"><path d="M85 106V43h130v63z" stroke="currentColor" stroke-width="2"/><path d="M85 58h130M100 51h3m5 0h3m5 0h3M137 75l-13 11 13 11m29-22 13 11-13 11m-10-28-10 53" stroke="currentColor" stroke-width="2"/><circle cx="236" cy="48" r="18" fill="currentColor" opacity=".25"/><path d="M64 120h188" stroke="currentColor"/></svg>',
  '<svg viewBox="0 0 320 150" fill="none" aria-hidden="true"><g stroke="currentColor" stroke-width="1.5"><path d="m90 42 70 33 70-33M90 108l70-33 70 33M90 42v66m140-66v66M160 28v94M90 42l70-14 70 14M90 108l70 14 70-14"/><circle cx="160" cy="75" r="26"/></g><g fill="currentColor"><circle cx="90" cy="42" r="5"/><circle cx="90" cy="108" r="5"/><circle cx="230" cy="42" r="5"/><circle cx="230" cy="108" r="5"/><circle cx="160" cy="75" r="8"/></g></svg>',
  '<svg viewBox="0 0 320 150" fill="none" aria-hidden="true"><path d="M84 42q38-13 76 6v74q-38-19-76-6zm152 0q-38-13-76 6v74q38-19 76-6z" stroke="currentColor" stroke-width="2"/><path d="M101 61q22-5 42 4m-42 10q22-5 42 4m-42 10q22-5 42 4m34-28q22-9 42-4m-42 18q22-9 42-4m-42 18q22-9 42-4" stroke="currentColor"/><circle cx="238" cy="34" r="18" fill="currentColor" opacity=".22"/></svg>'
];
const labels = { 技术: '技术探索', 阅读: '阅读思考', 生活: '生活随记' };
let notes = [];
let activeCategory = '全部';
const theme = ['editorial', 'lab', 'original'].find(name => document.body.classList.contains(name)) || 'studio';
const readingURL = path => theme === 'studio' ? path : `${path}?style=${theme}`;
const escapeHTML = value => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));

function renderFilters() {
  const group = document.querySelector('.filters');
  const categories = ['全部', ...new Set(notes.map(note => note.category))];
  group.replaceChildren();
  categories.forEach(category => {
    const button = document.createElement('button');
    button.className = 'filter' + (category === activeCategory ? ' selected' : '');
    button.dataset.filter = category;
    button.setAttribute('aria-pressed', String(category === activeCategory));
    button.textContent = category === '全部' ? '全部笔记' : labels[category] || category;
    group.append(button);
  });
}

function render() {
  const filtered = notes.filter(note => activeCategory === '全部' || note.category === activeCategory);
  document.querySelector('#count').textContent = `${String(filtered.length).padStart(2, '0')} NOTES`;
  list.replaceChildren();
  if (!filtered.length) {
    const empty = document.createElement('p');
    empty.className = 'content-status';
    empty.textContent = '还没有笔记，新的想法正在路上。';
    list.append(empty);
  }
  filtered.forEach(note => {
    const index = notes.indexOf(note);
    const button = document.createElement('a');
    button.className = 'note';
    button.href = readingURL(note.path);
    button.target = '_top';
    const art = document.body.classList.contains('studio') ? `<div class="card-art">${cardArts[index % 3]}</div>` : '';
    const date = note.date.replaceAll('-', '.');
    const meta = `<span class="tag ${note.category === '生活' ? 'life' : ''}">${escapeHTML(labels[note.category] || note.category)}</span><time datetime="${escapeHTML(note.date)}">${date}</time><span>${escapeHTML(note.time)}</span>`;
    const title = `${escapeHTML(note.title)}<span class="note-arrow" aria-hidden="true">↗</span>`;
    button.innerHTML = document.body.classList.contains('original')
      ? `<span class="note-meta">${meta}</span><span class="note-title">${title}</span><p>${escapeHTML(note.summary)}</p>`
      : `${art}<div class="card-text"><div class="note-meta">${meta}</div><div class="note-title">${title}</div><p>${escapeHTML(note.summary)}</p></div>`;
    list.append(button);
  });
}

async function loadNotes() {
  list.innerHTML = '<p class="content-status" role="status">正在翻开笔记…</p>';
  list.setAttribute('aria-busy', 'true');
  document.querySelector('#count').textContent = '…';
  document.querySelector('.filters').hidden = true;
  try {
    notes = await SiteContent.loadNotes();
    if (!notes.some(note => note.category === activeCategory)) activeCategory = '全部';
    renderFilters();
    document.querySelector('.filters').hidden = false;
    render();
  } catch (error) {
    console.error('笔记加载失败', error);
    document.querySelector('#count').textContent = '—';
    list.innerHTML = '<div class="content-status" role="alert">笔记暂时无法加载，请稍后重试。<br><button type="button">重新加载</button></div>';
    list.querySelector('button').addEventListener('click', loadNotes);
  } finally {
    list.setAttribute('aria-busy', 'false');
  }
}

document.querySelector('.filters').addEventListener('click', event => {
  const button = event.target.closest('[data-filter]');
  if (!button) return;
  activeCategory = button.dataset.filter;
  renderFilters();
  render();
  document.querySelectorAll('[data-filter]').forEach(item => {
    if (item.dataset.filter === activeCategory) item.focus();
  });
});
document.querySelectorAll('[data-resume]').forEach(link => {
  link.href = readingURL('/resume/');
  link.target = '_top';
});
loadNotes();
