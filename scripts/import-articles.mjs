// 内容唯一来源：content/articles（WPS 图文仓库副本）+ content/harness → docs/posts/<slug>.md
// 图片复制到 docs/public/media/<folder>/assets/<file>，保持线上 /media/<key> URL 不变。
import { readFile, readdir, writeFile, mkdir, rm, cp } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { basename, dirname, join, resolve } from 'node:path'
import matter from 'gray-matter'
import MarkdownIt from 'markdown-it'
import * as cheerio from 'cheerio'

const projectRoot = resolve(import.meta.dirname, '..')
const contentRoot = resolve(projectRoot, 'content')
const postsDir = resolve(projectRoot, 'docs', 'posts')
const mediaDir = resolve(projectRoot, 'docs', 'public', 'media')
const harnessArticle = resolve(contentRoot, 'harness', 'harness-engineering-wechat.md')
const md = new MarkdownIt({ html: true, linkify: false, typographer: true })
const mediaFiles = []

function slugify(input) {
  return input
    .normalize('NFKC')
    .toLowerCase()
    .replace(/[^\p{Letter}\p{Number}]+/gu, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
}

function plainText(markdown) {
  const $ = cheerio.load(md.render(markdown))
  return $('body').text().replace(/\s+/g, ' ').trim()
}

function tagsFor(text) {
  const candidates = [
    ['AI', /AI|人工智能|大模型/i],
    ['智能体', /智能体|Agent|Harness/i],
    ['编程', /编程|代码|Selenium|开发/i],
    ['电商', /电商|拼多多|阿里巴巴|淘宝/i],
    ['互联网', /互联网|网站|平台/i],
    ['职场', /职场|工作|专业|大学/i],
    ['商业', /商业|财富|收入|老板/i],
    ['成长', /成长|学习|人生|告别/i],
  ]
  const matched = candidates.filter(([, pattern]) => pattern.test(text)).map(([tag]) => tag)
  return matched.length ? matched.slice(0, 4) : ['随笔']
}

// 图片改写为 /media/<folder>/assets/<file>，并登记待复制文件
function rewriteImages(markdown, folder, resolveSource) {
  let cover = ''
  const body = markdown.replace(/!\[([^\]]*)\]\((\.\/assets\/|imgs\/)([^)\s]+)\)/g, (match, alt, _prefix, file) => {
    const fileName = basename(file)
    const source = resolveSource(fileName)
    if (!existsSync(source)) return match
    const key = `${folder}/assets/${fileName}`
    mediaFiles.push({ key, source })
    const url = `/media/${encodeURI(key)}`
    if (!cover) cover = url
    return `![${alt}](${url})`
  })
  return { body, cover }
}

// 飞书导出的专有标签 → VitePress 可渲染的 Markdown
function convertFeishu(markdown, sourceUrl) {
  const link = sourceUrl ? `，请[查看原文](${sourceUrl})` : ''
  return markdown
    .replace(/<callout emoji="([^"]*)">\s*([\s\S]*?)\s*<\/callout>/g, '::: tip $1\n$2\n:::')
    .replace(/<sheet [^>]*><\/sheet>/g, `::: warning 飞书表格\n此处为飞书嵌入表格${link}。\n:::`)
    .replace(/<figure [^>]*><source [^>]*mime="video[^"]*"[^>]*><\/figure>/g, `::: warning 视频\n此处为飞书视频${link}。\n:::`)
    .replace(/<DeepSeek API Key>/g, '&lt;DeepSeek API Key&gt;')
}

function stripTitle(markdown) {
  return markdown.replace(/^\s*#\s+.+\n/, '')
}

async function importLibraryPost(entry) {
  const path = join(contentRoot, entry.markdownPath)
  const parsed = matter(await readFile(path, 'utf8'))
  const content = stripTitle(parsed.content)
  const folder = dirname(entry.markdownPath).split('/').pop()
  const title = parsed.data.title || entry.title
  const sourceUrl = parsed.data.wechat_url || entry.url || ''
  const text = plainText(content)
  const { body, cover } = rewriteImages(content, folder, file => join(dirname(path), 'assets', file))
  return {
    slug: parsed.data.slug,
    // 旧 Nuxt 站点的 slug，仅用于生成 301 跳转
    legacySlug: `${slugify(title)}-${String(entry.articleId || '').slice(0, 8).toLowerCase()}`,
    frontmatter: {
      title,
      date: parsed.data.publish_time || new Date((entry.publishTime || 0) * 1000).toISOString().slice(0, 10),
      author: parsed.data.author || entry.author || '九歌',
      description: parsed.data.digest || text.slice(0, 110),
      tags: tagsFor(`${title} ${text}`),
      cover,
      readingMinutes: Math.max(1, Math.ceil(text.length / 500)),
      sourceUrl,
      articleId: entry.articleId || '',
    },
    body: convertFeishu(body, sourceUrl),
  }
}

async function importHarnessPost() {
  const parsed = matter(await readFile(harnessArticle, 'utf8'))
  const title = parsed.content.match(/^#\s+(.+)$/m)?.[1] || 'Harness Engineering'
  const content = stripTitle(parsed.content)
  const text = plainText(content)
  const { body, cover } = rewriteImages(content, '2026-07-11-harness-engineering', file => join(dirname(harnessArticle), 'imgs', file))
  return {
    slug: 'harness-engineering',
    legacySlug: 'harness-engineering-codex-claude-hermes',
    frontmatter: {
      title,
      date: '2026-07-11',
      author: '九歌',
      description: '模型越来越强，AI 编程为什么仍会翻车？答案可能藏在 Harness 工程里。',
      tags: ['AI', '智能体', '编程'],
      cover,
      readingMinutes: Math.max(1, Math.ceil(text.length / 500)),
      sourceUrl: '',
      articleId: 'local-harness-engineering',
    },
    body,
  }
}

const catalog = JSON.parse(await readFile(join(contentRoot, 'catalog.json'), 'utf8'))
const posts = await Promise.all(catalog.map(importLibraryPost))
posts.push(await importHarnessPost())

// 文章 URL：/posts/<年>/<月>/<日>/<slug>/，slug 在原文 frontmatter 中指定
for (const post of posts) {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(post.slug || '')) {
    throw new Error(`《${post.frontmatter.title}》缺少合法的 slug（frontmatter 中填写小写英文、数字和连字符）`)
  }
  post.path = `${post.frontmatter.date.replaceAll('-', '/')}/${post.slug}`
}
if (new Set(posts.map(post => post.path)).size !== posts.length) throw new Error('存在重复的文章路径')

// posts/index.md 是手写的归档页，其余目录均由本脚本生成
await mkdir(postsDir, { recursive: true })
for (const entry of await readdir(postsDir, { withFileTypes: true })) {
  if (entry.name !== 'index.md') await rm(join(postsDir, entry.name), { recursive: true })
}

// 列表按时间倒序：上一篇 = 更新的一篇，下一篇 = 更早的一篇
posts.sort((a, b) => b.frontmatter.date.localeCompare(a.frontmatter.date))
const navLink = post => post ? { text: post.frontmatter.title, link: `/posts/${post.path}/` } : false
for (const [index, post] of posts.entries()) {
  const data = Object.fromEntries(Object.entries({
    ...post.frontmatter,
    prev: navLink(posts[index - 1]),
    next: navLink(posts[index + 1]),
  }).filter(([, value]) => value !== ''))
  // 保留 h1：本地搜索按标题分段建索引，首个标题之前的正文不会被收录。页面上由 PostHeader 显示标题，该 h1 用 CSS 隐藏。
  // 固定锚点 #top，避免搜索结果链接带上中文标题锚点
  const body = `\n# ${post.frontmatter.title} {#top}\n\n${post.body.trim()}\n`
  await mkdir(join(postsDir, post.path), { recursive: true })
  await writeFile(join(postsDir, post.path, 'index.md'), matter.stringify(body, data), 'utf8')
}

// 旧链接 /posts/<旧 slug>(/) → 新链接，301 永久跳转
const redirects = posts.flatMap((post) => {
  const from = `/posts/${encodeURIComponent(post.legacySlug)}`
  const to = `/posts/${post.path}/`
  return [`${from}/ ${to} 301`, `${from} ${to} 301`]
})
await writeFile(join(projectRoot, 'docs', 'public', '_redirects'), `${redirects.join('\n')}\n`, 'utf8')

await rm(mediaDir, { recursive: true, force: true })
for (const { key, source } of mediaFiles) {
  await cp(source, join(mediaDir, key))
}

console.log(`Imported ${posts.length} posts and ${mediaFiles.length} media files.`)
