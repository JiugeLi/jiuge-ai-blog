# Project Rules

- `content/` is the content source of truth: `content/catalog.json` + `content/articles/*/index.md` (copied from the WPS 图文仓库) plus `content/harness/harness-engineering-wechat.md`.
- `scripts/import-articles.mjs` generates `docs/posts/<yyyy>/<mm>/<dd>/<slug>/index.md` (URL `/posts/<yyyy>/<mm>/<dd>/<slug>/`), tag pages `docs/tags/<slug>/index.md`, and copies referenced images to `docs/public/media/<folder>/assets/<file>`. Never edit generated posts or tag pages by hand; `docs/posts/index.md` (archive page) is hand-written and preserved.
- The import script imports `docs/.vitepress/theme/tags.ts` directly (Node ≥ 22.18 type stripping). Every tag produced by `tagsFor()` must be registered there with an English slug, or the import fails.
- Every article must declare an English `slug` (lowercase letters, digits, hyphens) in its frontmatter; the import fails otherwise. The date part comes from `publish_time`.
- The import also writes `docs/public/_redirects`: 301s from the old Nuxt URLs `/posts/<title-slug>-<id8>(/)` to the new URLs. Keep the legacy slug formula so these redirects stay valid.
- Published article URLs and `/media/<key>` URLs must stay stable. If a slug or date ever changes, add a redirect from the old URL.
- Many exported `digest` values are machine-truncated ("title + 大家好，我是九歌 + body", 100 chars). `describe()` in the import script detects these and rebuilds the description from body prose. For image-only or very short articles, write a real `digest` in the source frontmatter.
- The site is VitePress (`docs/`), statically built and deployed to Cloudflare Pages. No D1, R2, or Pages Functions are used. Brand name is「九歌 AI 实验室」(`alternateName`: 九歌 AI 大模型).
- SEO lives in `docs/.vitepress/seo.ts` (canonical, Open Graph/Twitter, robots, JSON-LD `@graph` with WebSite/Person/BlogPosting/BreadcrumbList/CollectionPage/ProfilePage). Pages without a cover use `docs/public/og-default.jpg` (1200×630).
- Each page must have exactly one h1. Article titles are rendered by `PostHeader.vue` as `<h1 id="top">`; generated posts contain no h1. Local search re-adds `# title {#top}` only at index time via `_render` in `config.mts`, otherwise text before the first h2 is not indexed.
- Local search runs in the browser (MiniSearch). Its `tokenize` function in `docs/.vitepress/config.mts` is serialized to the client as source text, so it must not reference outer variables.
- Article `<img>` tags get `loading="lazy"`, `decoding="async"` and intrinsic `width`/`height` (read from `docs/public` with image-size) in the markdown renderer; keep `.vp-doc img { height: auto }`.
- `scripts/update-readme.mjs` regenerates the featured posts and full article list in README.md between `<!-- POSTS:START -->` and `<!-- POSTS:END -->`; never edit that block by hand. README screenshots live in `.github/assets/`.
- Deployment order: `npm run build` (runs import + README update) → `npm run seo:audit` (must pass) → `npm run cf:deploy`.
- Production verification must cover the homepage, the archive `/posts/`, `/tags/` and one tag page, 50 article pages, at least one ASCII and one Chinese `/media/` image key, `/feed.xml`, `/sitemap.xml`, `/robots.txt`, and a Chinese query in the local search box.
