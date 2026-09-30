# 九歌 AI 大模型博客

VitePress 静态博客，部署到 Cloudflare Pages。

## 目录

- `content/`：文章原文（WPS 图文仓库副本 + Harness 文章），内容唯一来源
- `scripts/import-articles.mjs`：把原文生成到 `docs/posts/`，图片复制到 `docs/public/media/`
- `docs/.vitepress/`：站点配置与主题（首页、归档、关于、文章页头）

## 本地开发

```bash
npm install
npm run dev
```

## 新增文章

1. 把文章目录（`index.md` + `assets/`）放进 `content/articles/`，并在 `content/catalog.json` 中登记
2. 在 `index.md` 的 frontmatter 中填写英文 `slug`（如 `slug: "my-new-post"`），文章地址为 `/posts/年/月/日/slug/`
3. `npm run dev` 预览（会自动执行导入）

## 构建与部署

```bash
npm run build
npm run cf:deploy
```
