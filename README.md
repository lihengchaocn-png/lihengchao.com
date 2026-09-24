# Hengchao 的个人主页

默认主页为 **蓝白工作室**。保留四种风格，全部读取同一份 Markdown 笔记和简历，无需构建。

- 正式主页：<https://www.lihengchao.com/>
- 四种风格：<https://www.lihengchao.com/styles/>

## 日常更新内容

| 内容 | 文件 |
| --- | --- |
| 完整简历 | `content/resume.md` |
| 每篇笔记 | `content/notes/*.md`，一篇一个文件 |
| 新笔记模板 | `content/notes/_template.md` |
| 笔记文件清单 | `content/notes/index.json`，由脚本更新 |

**修改已有笔记或简历：直接编辑对应 `.md` 文件，然后提交并推送到 GitHub。** 四套页面会读取同一份更新，不用改 HTML 或 JavaScript。也可以在 GitHub 网页中编辑对应 Markdown 文件并提交。

### 新增笔记

1. 复制 `content/notes/_template.md`，命名如 `2026-09-24-my-first-note.md`。文件名只用小写字母、数字和连字符。
2. 修改顶部元数据和正文。
3. 在项目根目录运行 `node scripts/update-notes.mjs`，自动更新笔记清单和独立阅读页面；删除笔记后也运行一次。
4. 将 Markdown、`content/notes/index.json` 和 `notes/` 中生成的页面变更一起提交、推送。

已有笔记和简历仍可直接在 GitHub 网页中编辑 Markdown。新增或删除笔记时，需要运行上面的本地命令并提交生成的页面。模板以 `_` 开头，不会被加入清单。`notes/` 与 `resume/` 中的 HTML 由脚本生成，日常正文更新只需修改 Markdown。

```markdown
---
title: "我的第一篇笔记"
category: "技术"
date: "2026-09-24"
summary: "首页卡片显示的简短摘要。"
readTime: "3 min"
demo: false
---

这里是正文，支持 **粗体**、*斜体*、`行内代码`。

## 一个小标题

- 第一条想法
- 第二条想法
```

- `title`、`category`、`date`、`summary` 必填，日期使用 `YYYY-MM-DD`。
- `readTime` 可选，省略后根据正文长度估算。
- `demo: true` 会标记为演示笔记；真实内容使用 `false` 或删除此行。
- 笔记自动按日期从新到旧排列，分类自动从笔记中读取；可以增加新分类。
- 正文支持标题、段落、列表、引用、代码块、链接、图片和表格。图片建议放在 `content/images/` 下，用 `/content/images/文件名.png` 这样的根路径引用，保证所有风格下地址一致。
- 简历文件顶部保留 `title`，下方直接写 Markdown 正文；支持打印或保存 PDF。

现有经历与笔记仍是演示内容。首页的简短介绍和页脚属于页面排版，修改位置见下方。

## 本地预览与检查

```sh
uv run python -m http.server 8000
```

访问 <http://localhost:8000/>，风格入口为 <http://localhost:8000/styles/>。页面通过 HTTP 读取 Markdown，需要使用本地服务器，不能直接双击 HTML 文件预览内容。

```sh
node --test tests/content.test.cjs
```

## 四种风格与代码

| 风格 | 页面 |
| --- | --- |
| 蓝白工作室（默认） | `index.html`、`styles/studio.html` |
| 纸上手记 | `styles/editorial.html` |
| 技术实验室 | `styles/lab.html` |
| 日常花园（最初版本） | `styles/original.html` |

- `styles/index.html`：风格切换及桌面／手机预览。
- `styles/shared.css`：三套新风格；原版样式保存在 `styles/original.html` 中。
- `styles/markdown.css`：四套风格共用的文章与简历排版。
- `styles/content.js`：读取 Markdown、解析 YAML 元数据、渲染和清理 HTML。
- `styles/shared.js`：分类筛选和独立阅读页链接。
- `styles/reader.js`、`styles/reader.css`：文章与简历的独立阅读页，支持复制链接、Markdown 下载和简历打印。
- `scripts/reader-template.html`：独立阅读页面模板；修改后运行 `node scripts/update-notes.mjs`。
- `vendor/`：随站点提供的解析库与许可证，无运行时 CDN 请求，版本见其中的 README。

如修改默认主页的固定介绍或布局，同时更新 `index.html` 和 `styles/studio.html`；笔记与简历只修改 Markdown 即可。

## 查看每篇文章和简历的访问量

文章和简历使用真实的独立 HTML 地址，点击后会加载新页面，由 Cloudflare Web Analytics 自动记录页面浏览量：

- 文章：`/notes/2026-09-20-personal-homepage/` 等，每个 Markdown 文件名对应一个稳定路径。
- 简历：`/resume/`。
- 四种风格使用相同路径；`?style=lab` 等参数只控制外观，Cloudflare 不记录查询参数，因此同一篇文章会汇总在同一个 Path 下。
- 修改标题或正文不会改变统计路径；重命名 Markdown 文件会产生新路径。

后台入口：**Cloudflare → Workers & Pages → lihengchao-com → Metrics → View Web Analytics → Page views**。查看 **Paths** 分组，或添加 **Path** 筛选即可查看一篇文章或简历；可再使用 **Host = www.lihengchao.com** 筛选排除 `pages.dev` 地址的流量。

Web Analytics 已在项目中开启，部署时由 Cloudflare 自动注入脚本，请勿重复手动添加。统计从启用后的访问开始，无法补回之前弹窗阅读的数据。数据可能延迟显示，PV 代表页面浏览次数，不是去重人数；广告拦截器和网络问题可能使部分访问无法上报。统计位于 Cloudflare 管理后台，网站前台不展示计数。

官方文档：[Pages 统计设置](https://developers.cloudflare.com/pages/how-to/web-analytics/)、[Path / Host 维度](https://developers.cloudflare.com/web-analytics/data-metrics/dimensions/)、[统计口径与限制](https://developers.cloudflare.com/web-analytics/faq/)。

## 部署到 Cloudflare Pages

GitHub 仓库：<https://github.com/lihengchaocn-png/lihengchao.com>

在 Cloudflare 控制台选择 **Workers & Pages → Create application → Continue to Pages → Import an existing Git repository**，连接上面的仓库。生产分支选 `main`，Framework preset 选 `None`，Build command 留空，Build output directory 填 `.`（仓库根目录）。部署成功后，先检查 Cloudflare 提供的 `*.pages.dev` 地址。

当前 Pages 项目为 `lihengchao-com`，预览地址为 <https://lihengchao-com.pages.dev>，正式地址为 <https://www.lihengchao.com>。向 GitHub 的 `main` 分支推送更新后，Cloudflare Pages 会自动部署。

域名继续使用 Porkbun 的 Nameservers。在 Pages 项目的 **Custom domains** 中绑定 `www.lihengchao.com`，Porkbun DNS 添加 `CNAME www → lihengchao-com.pages.dev`。根域名 `lihengchao.com` 通过 Porkbun URL Forwarding 以 301 跳转至 `https://www.lihengchao.com`，保留请求路径，关闭 Wildcard Forwarding。邮件转发的 MX 和 SPF 记录保留。

**发布前请替换页面中的演示经历、笔记和时间。**
