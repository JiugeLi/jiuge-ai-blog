import { writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { createContentLoader, defineConfig, type HeadConfig } from 'vitepress'
import { Feed } from 'feed'
import cjkFriendly from 'markdown-it-cjk-friendly'

const siteUrl = 'https://jiuge.ai'
const siteName = '九歌 AI 大模型'
const siteDescription = 'AI、技术与商业观察。把复杂问题讲明白，把实用方法留下来。'

// MiniSearch 默认按空格分词，中文整句会变成一个词；用 Intl.Segmenter 做中文分词。
// VitePress 会把该函数按源码文本序列化到浏览器端，因此不能引用外部变量。
function tokenize(text: string) {
  const cache = globalThis as typeof globalThis & { __zhSegmenter?: Intl.Segmenter }
  cache.__zhSegmenter ??= new Intl.Segmenter('zh-CN', { granularity: 'word' })
  return Array.from(cache.__zhSegmenter.segment(text))
    .filter(part => part.isWordLike)
    .map(part => part.segment.toLowerCase())
}

export default defineConfig({
  lang: 'zh-CN',
  title: siteName,
  titleTemplate: `:title｜${siteName}`,
  description: siteDescription,
  cleanUrls: true,
  appearance: false,
  lastUpdated: false,
  sitemap: { hostname: siteUrl },

  markdown: {
    // 让 **粗体** 紧贴中文标点时也能生效（CommonMark 默认不识别）。
    // VitePress 自带的 markdown-it 类型比插件依赖的旧，运行时兼容，仅需断言类型。
    config: md => md.use(cjkFriendly as unknown as Parameters<typeof md.use>[0]),
  },

  head: [
    ['link', { rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' }],
    ['meta', { name: 'theme-color', content: '#f0f9ff' }],
    ['meta', { property: 'og:site_name', content: siteName }],
    ['link', { rel: 'alternate', type: 'application/rss+xml', title: siteName, href: '/feed.xml' }],
  ],

  themeConfig: {
    logo: '/favicon.svg',
    siteTitle: '九歌 AI 实验室',
    nav: [
      { text: '首页', link: '/' },
      { text: '文章', link: '/posts/', activeMatch: '^/posts/' },
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
    const fm = pageData.frontmatter
    const url = `${siteUrl}/${pageData.relativePath.replace(/(^|\/)index\.md$/, '$1').replace(/\.md$/, '')}`
    const head: HeadConfig[] = [
      ['link', { rel: 'canonical', href: encodeURI(url) }],
      ['meta', { property: 'og:url', content: encodeURI(url) }],
      ['meta', { property: 'og:title', content: fm.title || siteName }],
      ['meta', { property: 'og:description', content: fm.description || siteDescription }],
    ]
    if (pageData.relativePath.startsWith('posts/') && fm.date) {
      head.push(
        ['meta', { property: 'og:type', content: 'article' }],
        ['meta', { property: 'article:published_time', content: fm.date }],
        ['meta', { name: 'twitter:card', content: fm.cover ? 'summary_large_image' : 'summary' }],
      )
      if (fm.cover) head.push(['meta', { property: 'og:image', content: `${siteUrl}${fm.cover}` }])
    }
    return head
  },

  // Cloudflare Pages 会把 <link rel="preload|modulepreload"> 原样转成 Early Hints 的 Link 响应头，
  // 头里的中文会被浏览器按 Latin-1 解析成乱码路径（404）。预先把 href 中的非 ASCII 字符百分号编码。
  transformHtml(code) {
    return code.replace(/(<link\b[^>]*\bhref=")([^"]*[^\x00-\x7F][^"]*)"/g, (_, prefix, href) => `${prefix}${encodeURI(href)}"`)
  },

  async buildEnd(site) {
    const feed = new Feed({
      title: siteName,
      description: siteDescription,
      id: siteUrl,
      link: siteUrl,
      language: 'zh-CN',
      favicon: `${siteUrl}/favicon.svg`,
      copyright: `© ${new Date().getFullYear()} ${siteName}`,
    })
    const posts = await createContentLoader('posts/**/index.md').load()
    posts
      .filter(post => post.frontmatter.date)
      .sort((a, b) => String(b.frontmatter.date).localeCompare(String(a.frontmatter.date)))
      .forEach((post) => {
        const link = encodeURI(`${siteUrl}${post.url}`)
        feed.addItem({
          title: post.frontmatter.title,
          id: link,
          link,
          description: post.frontmatter.description,
          date: new Date(post.frontmatter.date),
          image: post.frontmatter.cover ? `${siteUrl}${post.frontmatter.cover}` : undefined,
        })
      })
    await writeFile(resolve(site.outDir, 'feed.xml'), feed.rss2())
  },
})
