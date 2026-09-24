const style = new URLSearchParams(location.search).get('style');
const theme = ['studio', 'editorial', 'lab', 'original'].includes(style) ? style : 'studio';
document.body.className = `${theme} reading-page`;
const home = theme === 'studio' ? '/' : `/styles/${theme}.html`;
document.querySelectorAll('[data-home]').forEach(link => { link.href = home; });
const isResume = document.body.dataset.kind === 'resume';
const main = document.querySelector('.reading-main');
const title = document.querySelector('#reading-title');
const meta = document.querySelector('#reading-meta');
const body = document.querySelector('#reading-body');
const actions = document.querySelector('.reading-actions');

async function loadPage() {
  main.setAttribute('aria-busy', 'true');
  actions.hidden = true;
  meta.textContent = '正在读取内容…';
  body.replaceChildren();
  try {
    const content = isResume
      ? await SiteContent.loadResume()
      : await SiteContent.loadNote(document.body.dataset.slug);
    const name = isResume ? content.meta.title : content.title;
    title.textContent = name;
    document.title = isResume ? name : `${name} · Hengchao`;
    document.querySelector('#reading-label').textContent = isResume ? 'CURRICULUM VITAE' : 'FIELD NOTES';
    meta.textContent = isResume ? '个人简历' : `${content.demo ? '演示笔记 · ' : ''}${content.category} / ${content.date.replaceAll('-', '.')} / ${content.time}`;
    body.innerHTML = SiteContent.renderMarkdown(content.markdown);
    document.querySelector('#markdown-source').href = content.url;
    document.querySelector('#markdown-source').download = content.url.split('/').pop();
    document.querySelector('#print-page').hidden = !isResume;
    actions.hidden = false;
  } catch (error) {
    console.error('阅读页面加载失败', error);
    title.textContent = isResume ? '个人简历' : '笔记暂时无法打开';
    meta.textContent = '内容可能已移除，或网络暂时不可用。';
    const retry = document.createElement('button');
    retry.className = 'reader-retry';
    retry.textContent = '重新加载';
    retry.addEventListener('click', loadPage);
    body.append(retry);
  } finally {
    main.setAttribute('aria-busy', 'false');
  }
}

document.querySelector('#copy-link').addEventListener('click', async () => {
  const canonical = new URL(location.pathname, location.origin).href;
  const status = document.querySelector('#action-status');
  try {
    await navigator.clipboard.writeText(canonical);
    status.textContent = '链接已复制，可以分享给朋友了。';
  } catch {
    status.textContent = `可复制此链接分享：${canonical}`;
  }
});
document.querySelector('#print-page').addEventListener('click', () => window.print());
loadPage();
