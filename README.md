# 个人主页

一个无需构建、没有外部依赖的响应式个人主页 demo，包含笔记分类、文章阅读弹窗和可打印简历。

直接用浏览器打开 `index.html`，或在当前目录运行 `uv run python -m http.server 8000`，访问 http://localhost:8000。

## 修改内容

- 在 `index.html` 中修改姓名、简介、简历与页脚。
- 搜索 `const notes` 修改笔记；分类来自每篇笔记的 `category` 字段。
- 搜索 `const resume` 修改完整简历。点击「查看简历」可阅读或打印为 PDF。
- 页面所有经历、笔记与时间均为演示内容，请在发布前替换。

## 部署到 Cloudflare Pages

GitHub 仓库：<https://github.com/lihengchaocn-png/lihengchao.com>

在 Cloudflare 控制台选择 **Workers & Pages → Create application → Continue to Pages → Import an existing Git repository**，连接上面的仓库。生产分支选 `main`，Framework preset 选 `None`，Build command 留空，Build output directory 填 `.`（仓库根目录）。部署成功后，先检查 Cloudflare 提供的 `*.pages.dev` 地址。

在 Pages 项目的 **Custom domains → Set up a domain** 中添加 `lihengchao.com`。根域名需要先在 Cloudflare 添加域名，再将 Porkbun 的 Nameservers 改为 Cloudflare 分配的两条。不要手动猜测或填写固定 IP 地址。

**发布前请替换页面中的演示经历、笔记和时间。**
