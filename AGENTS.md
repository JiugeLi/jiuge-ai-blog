# Project Rules

- `content/` is the content source of truth: `content/catalog.json` + `content/articles/*/index.md` (copied from the WPS 图文仓库) plus `content/harness/harness-engineering-wechat.md`.
- `scripts/import-articles.mjs` generates `docs/posts/<yyyy>/<mm>/<dd>/<slug>/index.md` (URL `/posts/<yyyy>/<mm>/<dd>/<slug>/`) and copies referenced images to `docs/public/media/<folder>/assets/<file>`. Never edit generated posts by hand; `docs/posts/index.md` (archive page) is hand-written and preserved.
- Every article must declare an English `slug` (lowercase letters, digits, hyphens) in its frontmatter; the import fails otherwise. The date part comes from `publish_time`.
- The import also writes `docs/public/_redirects`: 301s from the old Nuxt URLs `/posts/<title-slug>-<id8>(/)` to the new URLs. Keep the legacy slug formula so these redirects stay valid.
- Published article URLs and `/media/<key>` URLs must stay stable. If a slug or date ever changes, add a redirect from the old URL.
- The site is VitePress (`docs/`), statically built and deployed to Cloudflare Pages. No D1, R2, or Pages Functions are used.
- Local search runs in the browser (MiniSearch). Its `tokenize` function in `docs/.vitepress/config.mts` is serialized to the client as source text, so it must not reference outer variables.
- Each post keeps a leading `# title` so local search indexes the whole article; the h1 is hidden by CSS and the visible title comes from `PostHeader.vue`.
- `scripts/update-readme.mjs` regenerates the featured posts and full article list in README.md between `<!-- POSTS:START -->` and `<!-- POSTS:END -->`; never edit that block by hand. README screenshots live in `.github/assets/`.
- Deployment order: `npm run build` (runs import automatically) → `npm run cf:deploy`.
- Production verification must cover the homepage, the archive `/posts/`, 50 article pages, at least one ASCII and one Chinese `/media/` image key, `/feed.xml`, `/sitemap.xml`, and a Chinese query in the local search box.
