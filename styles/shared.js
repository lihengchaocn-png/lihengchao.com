const list = document.querySelector('#note-list');
const reader = document.querySelector('#reader');
const readerBody = document.querySelector('#reader-body');
const printButton = document.querySelector('.print-button');
const cardArts = [
  '<svg viewBox="0 0 320 150" fill="none" aria-hidden="true"><path d="M85 106V43h130v63z" stroke="currentColor" stroke-width="2"/><path d="M85 58h130M100 51h3m5 0h3m5 0h3M137 75l-13 11 13 11m29-22 13 11-13 11m-10-28-10 53" stroke="currentColor" stroke-width="2"/><circle cx="236" cy="48" r="18" fill="currentColor" opacity=".25"/><path d="M64 120h188" stroke="currentColor"/></svg>',
  '<svg viewBox="0 0 320 150" fill="none" aria-hidden="true"><g stroke="currentColor" stroke-width="1.5"><path d="m90 42 70 33 70-33M90 108l70-33 70 33M90 42v66m140-66v66M160 28v94M90 42l70-14 70 14M90 108l70 14 70-14"/><circle cx="160" cy="75" r="26"/></g><g fill="currentColor"><circle cx="90" cy="42" r="5"/><circle cx="90" cy="108" r="5"/><circle cx="230" cy="42" r="5"/><circle cx="230" cy="108" r="5"/><circle cx="160" cy="75" r="8"/></g></svg>',
  '<svg viewBox="0 0 320 150" fill="none" aria-hidden="true"><path d="M84 42q38-13 76 6v74q-38-19-76-6zm152 0q-38-13-76 6v74q38-19 76-6z" stroke="currentColor" stroke-width="2"/><path d="M101 61q22-5 42 4m-42 10q22-5 42 4m-42 10q22-5 42 4m34-28q22-9 42-4m-42 18q22-9 42-4m-42 18q22-9 42-4" stroke="currentColor"/><circle cx="238" cy="34" r="18" fill="currentColor" opacity=".22"/></svg>'
];
function openReader(content, isResume = false) {
  readerBody.innerHTML = content;
  document.querySelector('#reader-label').textContent = isResume ? 'CURRICULUM VITAE' : 'FIELD NOTES';
  printButton.hidden = !isResume;
  reader.showModal();
  reader.scrollTop = 0;
}
function render(category = '全部') {
  const filtered = notes.filter(n => category === '全部' || n.category === category);
  document.querySelector('#count').textContent = `${String(filtered.length).padStart(2, '0')} NOTES`;
  list.replaceChildren();
  filtered.forEach(n => {
    const index = notes.indexOf(n);
    const button = document.createElement('button');
    button.className = 'note';
    const art = document.body.classList.contains('studio') ? `<div class="card-art">${cardArts[index % 3]}</div>` : '';
    button.innerHTML = `${art}<div class="card-text"><div class="note-meta"><span class="tag">${n.category === '技术' ? '技术探索' : n.category === '阅读' ? '阅读思考' : '生活随记'}</span><time datetime="${n.date.replaceAll('.', '-')}">${n.date}</time><span>${n.time}</span></div><div class="note-title"><span>${n.title}</span><span class="note-arrow" aria-hidden="true">↗</span></div><p>${n.summary}</p></div>`;
    button.addEventListener('click', () => openReader(`<h2 id="reader-title">${n.title}</h2><p class="notice">演示笔记 · ${n.date} · ${n.category}</p>${n.body}`));
    list.append(button);
  });
}
document.querySelectorAll('[data-filter]').forEach(button => button.addEventListener('click', () => {
  document.querySelectorAll('[data-filter]').forEach(b => {
    b.classList.toggle('selected', b === button);
    b.setAttribute('aria-pressed', String(b === button));
  });
  render(button.dataset.filter);
}));
document.querySelectorAll('[data-resume]').forEach(button => button.addEventListener('click', event => {
  event.preventDefault(); openReader(resume, true);
}));
document.querySelector('.close').addEventListener('click', () => reader.close());
reader.addEventListener('click', event => {
  if (event.target !== reader) return;
  const rect = reader.getBoundingClientRect();
  if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) reader.close();
});
printButton.addEventListener('click', () => window.print());
render();
