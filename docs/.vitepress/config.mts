import { readFileSync } from 'node:fs'
import { writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createContentLoader, defineConfig } from 'vitepress'
import { Feed } from 'feed'
import { imageSize } from 'image-size'
import cjkFriendly from 'markdown-it-cjk-friendly'
import { buildHead, defaultImage, pageUrl, siteDescription, siteName, siteUrl } from './seo'

const publicDir = fileURLToPath(new URL('../public', import.meta.url))

// MiniSearch 默认按空格分词，中文整句会变成一个词；用 Intl.Segmenter 做中文分词。
// VitePress 会把该函数按源码文本序列化到浏览器端，因此不能引用外部变量。
function tokenize(text: string) {
  const cache = globalThis as typeof globalThis & { __zhSegmenter?: Intl.Segmenter }
  cache.__zhSegmenter ??= new Intl.Segmenter('zh-CN', { granularity: 'word' })
  return Array.from(cache.__zhSegmenter.segment(text))
    .filter(part => part.isWordLike)
    .map(part => part.segment.toLowerCase())
}

/** 读取 public 下图片的宽高，用于 <img width height>，避免布局偏移（CLS）。
 *  客户端、服务端构建与搜索索引会各渲染一次，按路径缓存结果。 */
const imageSizeCache = new Map<string, { width?: number, height?: number }>()
function publicImageSize(src: string): { width?: number, height?: number } {
  if (!imageSizeCache.has(src)) {
    try {
      imageSizeCache.set(src, imageSize(readFileSync(resolve(publicDir, decodeURI(src).replace(/^\//, '')))))
    }
    catch {
      imageSizeCache.set(src, {})
    }
  }
  return imageSizeCache.get(src)!
}

export default defineConfig({
  lang: 'zh-CN',
  title: siteName,
  titleTemplate: `:title｜${siteName}`,
  description: siteDescription,
  cleanUrls: true,
  appearance: false,
  lastUpdated: false,

  sitemap: {
    hostname: siteUrl,
    // lastmod 取文章发布/更新日期；聚合页取其下最新文章的日期
    async transformItems(items) {
      const posts = await createContentLoader('posts/**/index.md').load()
      const dated = posts
        .filter(post => post.frontmatter.date)
        .map(post => ({ url: post.url, tags: post.frontmatter.tags as string[], date: String(post.frontmatter.updated || post.frontmatter.date) }))
      const latest = (list: typeof dated) => list.map(post => post.date).sort().at(-1)
      const byUrl = new Map(dated.map(post => [post.url, post.date]))
      const tagPages = await createContentLoader('tags/*/index.md').load()
      const tagDates = new Map(tagPages.map(page => [page.url, latest(dated.filter(post => post.tags.includes(page.frontmatter.tag)))]))
      return items
        .filter(item => !item.url.includes('404'))
        .map((item) => {
          const path = `/${decodeURI(item.url).replace(/^\//, '')}`
          const lastmod = byUrl.get(path) ?? tagDates.get(path) ?? (['/', '/posts/', '/tags/'].includes(path) ? latest(dated) : undefined)
          return lastmod ? { ...item, lastmod } : item
        })
    },
  },

  markdown: {
    config(md) {
      // 让 **粗体** 紧贴中文标点时也能生效（CommonMark 默认不识别）。
      // VitePress 自带的 markdown-it 类型比插件依赖的旧，运行时兼容，仅需断言类型。
      md.use(cjkFriendly as unknown as Parameters<typeof md.use>[0])

      // 文章图片：懒加载 + 异步解码 + 固有宽高
      const renderImage = md.renderer.rules.image!
      md.renderer.rules.image = (tokens, idx, options, env, self) => {
        const token = tokens[idx]
        const src = token.attrGet('src') || ''
        token.attrSet('loading', 'lazy')
        token.attrSet('decoding', 'async')
        if (src.startsWith('/')) {
          const { width, height } = publicImageSize(src)
          if (width && height) {
            token.attrSet('width', String(width))
            token.attrSet('height', String(height))
          }
        }
        return renderImage(tokens, idx, options, env, self)
      }
    },
  },

  head: [
    ['link', { rel: 'icon', href: '/favicon.ico', sizes: '32x32' }],
    ['link', { rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' }],
    ['link', { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' }],
    ['link', { rel: 'manifest', href: '/site.webmanifest' }],
    ['link', { rel: 'alternate', type: 'application/rss+xml', title: siteName, href: '/feed.xml' }],
    ['meta', { name: 'theme-color', content: '#f0f9ff' }],
    ['meta', { name: 'author', content: '九歌' }],
    ['meta', { property: 'og:site_name', content: siteName }],
    ['meta', { property: 'og:locale', content: 'zh_CN' }],
    // 百度：声明同时适配 PC 与移动端，禁止转码
    ['meta', { name: 'applicable-device', content: 'pc,mobile' }],
    ['meta', { 'http-equiv': 'Cache-Control', content: 'no-transform' }],
    ['meta', { 'http-equiv': 'Cache-Control', content: 'no-siteapp' }],
  ],

  themeConfig: {
    logo: { src: '/favicon.svg', alt: siteName },
    siteTitle: siteName,
    nav: [
      { text: '首页', link: '/' },
      { text: '文章', link: '/posts/', activeMatch: '^/posts/' },
      { text: '标签', link: '/tags/', activeMatch: '^/tags/' },
      { text: '研究方向', link: '/#tracks-section' },
      { text: '关于', link: '/about' },
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/JiugeLi' },
      { icon: 'x', link: 'https://x.com/jiugeAgent' },
    ],
    outline: { level: [2, 3], label: '本文目录' },
    docFooter: { prev: '上一篇', next: '下一篇' },
    returnToTopLabel: '回到顶部',
    sidebarMenuLabel: '菜单',
    darkModeSwitchLabel: '外观',
    notFound: {
      title: '页面不存在',
      quote: '这篇文章可能已被移动或删除。',
      linkText: '返回首页',
    },
    search: {
      provider: 'local',
      options: {
        // 文章页标题由 PostHeader 渲染，正文中没有 h1；建索引时补上标题，
        // 否则首个二级标题之前的正文不会被收录。固定锚点 #top 对应 PostHeader 的 h1。
        _render(src, env, md) {
          if (env.frontmatter?.search === false) return ''
          const html = md.render(src, env)
          if (env.relativePath?.startsWith('posts/') && env.frontmatter?.date)
            return md.render(`# ${env.frontmatter.title} {#top}\n`, {}) + html
          return html
        },
        miniSearch: {
          options: { tokenize },
          searchOptions: { tokenize, prefix: true, fuzzy: 0.1, combineWith: 'AND' },
        },
        translations: {
          button: { buttonText: '搜索文章', buttonAriaLabel: '搜索文章' },
          modal: {
            noResultsText: '没有找到相关文章',
            resetButtonTitle: '清除搜索',
            displayDetails: '显示详细列表',
            footer: { selectText: '选择', navigateText: '切换', closeText: '关闭' },
          },
        },
      },
    },
  },

  transformHead({ pageData }) {
    return buildHead(pageData)
  },

  // Cloudflare Pages 会把 <link rel="preload|modulepreload"> 原样转成 Early Hints 的 Link 响应头，
  // 头里的中文会被浏览器按 Latin-1 解析成乱码路径（404）。预先把 href 中的非 ASCII 字符百分号编码。
  transformHtml(code) {
    return code.replace(/(<link\b[^>]*\bhref=")([^"]*[^\x00-\x7F][^"]*)"/g, (_, prefix, href) => `${prefix}${encodeURI(href)}"`)
  },

  async buildEnd(site) {
    const author = { name: '九歌', link: `${siteUrl}/about` }
    const feed = new Feed({
      title: siteName,
      description: siteDescription,
      id: `${siteUrl}/`,
      link: `${siteUrl}/`,
      language: 'zh-CN',
      image: defaultImage.url,
      favicon: `${siteUrl}/favicon.ico`,
      copyright: `© ${new Date().getFullYear()} ${siteName}`,
      author,
      feedLinks: { rss: `${siteUrl}/feed.xml` },
    })
    const posts = await createContentLoader('posts/**/index.md').load()
    posts
      .filter(post => post.frontmatter.date)
      .sort((a, b) => String(b.frontmatter.date).localeCompare(String(a.frontmatter.date)))
      .forEach((post) => {
        const link = pageUrl(`${post.url.slice(1)}index.md`)
        feed.addItem({
          title: post.frontmatter.title,
          id: link,
          link,
          description: post.frontmatter.description,
          date: new Date(`${post.frontmatter.date}T08:00:00+08:00`),
          author: [author],
          category: (post.frontmatter.tags || []).map((name: string) => ({ name })),
          image: post.frontmatter.cover ? `${siteUrl}${post.frontmatter.cover}` : undefined,
        })
      })
    await writeFile(resolve(site.outDir, 'feed.xml'), feed.rss2())
  },
})
