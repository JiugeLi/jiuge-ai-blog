// SEO：<head> 元信息（canonical / Open Graph / Twitter / robots）与 JSON-LD 结构化数据
import type { HeadConfig, PageData } from 'vitepress'

export const siteUrl = 'https://jiuge.ai'
export const siteName = '九歌 AI 实验室'
export const siteDescription = '九歌 AI 实验室：记录 AI 大模型、智能体（Agent）、AI 编程与工程化实践，以及电商、互联网与个人成长的思考。'
export const defaultImage = { url: `${siteUrl}/og-default.jpg`, width: 1200, height: 630, alt: '九歌 AI 实验室' }

const twitterHandle = '@jiugeAgent'
const personId = `${siteUrl}/#person`
const websiteId = `${siteUrl}/#website`

const person = {
  '@type': 'Person',
  '@id': personId,
  name: '九歌',
  alternateName: 'Jiuge',
  url: `${siteUrl}/about`,
  description: 'AI 架构实践者、独立开发者，关注大模型、智能体与 AI 编程的真实落地。',
  jobTitle: 'AI 架构实践者',
  sameAs: ['https://github.com/JiugeLi', 'https://x.com/jiugeAgent'],
}

const website = {
  '@type': 'WebSite',
  '@id': websiteId,
  url: `${siteUrl}/`,
  name: siteName,
  alternateName: ['九歌 AI 大模型', 'Jiuge AI Lab'],
  description: siteDescription,
  inLanguage: 'zh-CN',
  publisher: { '@id': personId },
}

/** docs 下的相对路径 → 页面绝对 URL（与 cleanUrls、目录式文章 URL 一致） */
export function pageUrl(relativePath: string): string {
  const path = relativePath.replace(/(^|\/)index\.md$/, '$1').replace(/\.md$/, '')
  return encodeURI(`${siteUrl}/${path}`)
}

/** 文章日期按北京时间输出，避免被当作 UTC 零点 */
const isoDate = (date: string) => `${date}T08:00:00+08:00`

function breadcrumb(url: string, trail: Array<[string, string]>) {
  return {
    '@type': 'BreadcrumbList',
    '@id': `${url}#breadcrumb`,
    itemListElement: trail.map(([name, item], index) => ({ '@type': 'ListItem', position: index + 1, name, item })),
  }
}

function jsonLd(graph: object[]): HeadConfig {
  return ['script', { type: 'application/ld+json' }, JSON.stringify({ '@context': 'https://schema.org', '@graph': graph })]
}

export function buildHead(pageData: PageData): HeadConfig[] {
  const { relativePath, frontmatter: fm } = pageData

  if (pageData.isNotFound || relativePath === '404.md') {
    return [['meta', { name: 'robots', content: 'noindex, follow' }]]
  }

  const url = pageUrl(relativePath)
  const title = fm.title || siteName
  const description = fm.description || siteDescription
  const isPost = relativePath.startsWith('posts/') && Boolean(fm.date)
  const image = isPost && fm.cover
    ? { url: `${siteUrl}${fm.cover}`, alt: title }
    : defaultImage

  const head: HeadConfig[] = [
    ['link', { rel: 'canonical', href: url }],
    ['meta', { name: 'robots', content: 'index, follow, max-image-preview:large, max-snippet:-1' }],
    ['meta', { property: 'og:url', content: url }],
    ['meta', { property: 'og:type', content: isPost ? 'article' : 'website' }],
    ['meta', { property: 'og:title', content: title }],
    ['meta', { property: 'og:description', content: description }],
    ['meta', { property: 'og:image', content: image.url }],
    ['meta', { property: 'og:image:alt', content: image.alt }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:site', content: twitterHandle }],
    ['meta', { name: 'twitter:title', content: title }],
    ['meta', { name: 'twitter:description', content: description }],
    ['meta', { name: 'twitter:image', content: image.url }],
  ]
  if ('width' in image) {
    head.push(
      ['meta', { property: 'og:image:width', content: String(image.width) }],
      ['meta', { property: 'og:image:height', content: String(image.height) }],
    )
  }

  const home = `${siteUrl}/`
  const graph: object[] = [website, person]

  if (isPost) {
    const published = isoDate(fm.date)
    const modified = isoDate(fm.updated || fm.date)
    head.push(
      ['meta', { name: 'twitter:creator', content: twitterHandle }],
      ['meta', { property: 'article:published_time', content: published }],
      ['meta', { property: 'article:modified_time', content: modified }],
      ['meta', { property: 'article:author', content: `${siteUrl}/about` }],
      ...(fm.tags || []).map((tag: string): HeadConfig => ['meta', { property: 'article:tag', content: tag }]),
    )
    if (fm.tags?.[0]) head.push(['meta', { property: 'article:section', content: fm.tags[0] }])
    graph.push(
      {
        '@type': 'BlogPosting',
        '@id': `${url}#article`,
        url,
        mainEntityOfPage: url,
        headline: title.length > 110 ? `${title.slice(0, 109)}…` : title,
        description,
        image: [image.url],
        datePublished: published,
        dateModified: modified,
        author: { '@id': personId },
        publisher: { '@id': personId },
        isPartOf: { '@id': websiteId },
        inLanguage: 'zh-CN',
        keywords: (fm.tags || []).join(','),
        articleSection: fm.tags?.[0],
        timeRequired: `PT${fm.readingMinutes || 1}M`,
        breadcrumb: { '@id': `${url}#breadcrumb` },
      },
      breadcrumb(url, [['首页', home], ['文章', `${siteUrl}/posts/`], [title, url]]),
    )
  }
  else if (relativePath === 'about.md') {
    graph.push(
      { '@type': 'ProfilePage', '@id': `${url}#page`, url, name: title, description, mainEntity: { '@id': personId }, isPartOf: { '@id': websiteId }, inLanguage: 'zh-CN' },
      breadcrumb(url, [['首页', home], ['关于', url]]),
    )
  }
  else if (relativePath === 'posts/index.md' || relativePath.startsWith('tags/')) {
    const trail: Array<[string, string]> = relativePath === 'posts/index.md'
      ? [['首页', home], ['文章', url]]
      : relativePath === 'tags/index.md'
        ? [['首页', home], ['标签', url]]
        : [['首页', home], ['标签', `${siteUrl}/tags/`], [title, url]]
    graph.push(
      { '@type': 'CollectionPage', '@id': `${url}#page`, url, name: title, description, isPartOf: { '@id': websiteId }, inLanguage: 'zh-CN', breadcrumb: { '@id': `${url}#breadcrumb` } },
      breadcrumb(url, trail),
    )
  }

  head.push(jsonLd(graph))
  return head
}
