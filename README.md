# 个人主页

一个无需构建、没有外部依赖的响应式个人主页 demo，包含笔记分类、文章阅读弹窗和可打印简历。

直接用浏览器打开 `index.html`，或在当前目录运行 `uv run python -m http.server 8000`，访问 http://localhost:8000。

## 修改内容

- 在 `index.html` 中修改姓名、简介、简历与页脚。
- 搜索 `const notes` 修改笔记；分类来自每篇笔记的 `category` 字段。
- 搜索 `const resume` 修改完整简历。点击「查看简历」可阅读或打印为 PDF。
- 页面所有经历、笔记与时间均为演示内容，请在发布前替换。

## 风格预览

在线比较：<https://www.lihengchao.com/styles/>。本地预览访问 `/styles/`，可切换桌面与手机尺寸，也可独立打开每一版。

- **纸上手记**（`styles/editorial.html`）：米白纸感、衬线标题、编辑式排版。
- **技术实验室**（`styles/lab.html`）：深色网格、荧光绿、技术笔记与实验。
- **蓝白工作室**（`styles/studio.html`）：明亮蓝白、抽象轨道图形、卡片式笔记。

三套预览共用 `styles/data.js` 中的演示笔记与简历；样式在 `styles/shared.css`，交互在 `styles/shared.js`。预览内容与根目录主页各自维护。

## 部署到 Cloudflare Pages

GitHub 仓库：<https://github.com/lihengchaocn-png/lihengchao.com>

在 Cloudflare 控制台选择 **Workers & Pages → Create application → Continue to Pages → Import an existing Git repository**，连接上面的仓库。生产分支选 `main`，Framework preset 选 `None`，Build command 留空，Build output directory 填 `.`（仓库根目录）。部署成功后，先检查 Cloudflare 提供的 `*.pages.dev` 地址。

当前 Pages 项目为 `lihengchao-com`，预览地址为 <https://lihengchao-com.pages.dev>，正式地址为 <https://www.lihengchao.com>。向 GitHub 的 `main` 分支推送更新后，Cloudflare Pages 会自动部署。

域名继续使用 Porkbun 的 Nameservers。在 Pages 项目的 **Custom domains** 中绑定 `www.lihengchao.com`，Porkbun DNS 添加 `CNAME www → lihengchao-com.pages.dev`。根域名 `lihengchao.com` 通过 Porkbun URL Forwarding 以 301 跳转至 `https://www.lihengchao.com`，保留请求路径，关闭 Wildcard Forwarding。邮件转发的 MX 和 SPF 记录保留。

**发布前请替换页面中的演示经历、笔记和时间。**
